import { IModel, Service } from 'egg'
import { Transaction, Op } from 'sequelize'
import ServiceError from '../../exception/ServiceError'

export interface IConfirmPaymentResult{
  order?: IModel['UserOrder']
}

export default class OrderService extends Service {
  async getCheckoutCartPayment(gateway: number, payment_id: string, filter: object, transaction: Transaction): Promise<IModel['CheckoutCartPayment']> {
    const paymentDetail = await this.app.model
      .CheckoutCartPaymentGatewayDetail.findOne({
        where: {
          payment_transaction_id: payment_id,
        },
        lock: transaction ? Transaction.LOCK.UPDATE : undefined,
      }, { transaction })
    if (!paymentDetail) throw new Error('Payment Detail not find')
    return this.app.model.CheckoutCartPayment.findOne({
      where: {
        payment_gateway: gateway,
        payment_gateway_detail_id: paymentDetail.id,
        ...filter
      },
      include: [
        {
          model: this.app.model.CheckoutCartItem,
          as: 'items'
        },
        {
          model: this.app.model.UserOrderDiscount,
          as: 'discounts'
        }
      ],
      lock: transaction ? Transaction.LOCK.UPDATE : undefined,
    }, { transaction })
  }

  async confirmPaymentProc(payment: IModel['CheckoutCartPayment'], transaction: Transaction, status: number|undefined = undefined, orderStatus: number|undefined = undefined) {
    const { app } = this
    if (status === undefined) status = app.enum.ePaymentStatusCode.Paid
    console.log('update to payment', status)
    await payment.update({
      status
    }, { transaction })

    return this.createOrderFromCheckoutCartPayment(payment, transaction, orderStatus)
  }

  async confirmPayment(gateway: number, payment_id: string,
    receivedAmount: number, transaction: Transaction|undefined = undefined): Promise<IConfirmPaymentResult> {
    const { app } = this
    let internalTransaction = false
    // 不存在transaction
    if (!transaction) {
      transaction = await app.model.transaction()
      internalTransaction = true
    }
    let order = null
    try {
      console.log('gateway, payment_id', gateway, payment_id)
      const payment = await this.getCheckoutCartPayment(gateway, payment_id, {}, transaction)

      if (!payment) {
        // 订单不存在
        this.logger.error(`Payment Record not found, ${gateway} - ${payment_id}`)
        throw new ServiceError(`Payment Record not found, ${gateway} - ${payment_id}`, 404)

      } else if (![
        app.enum.ePaymentStatusCode.NotPaid,
        app.enum.ePaymentStatusCode.Submitted
      ].includes(payment.status)) {
        // 订单已处理
        this.logger.info('Payment has been processed:', payment.id)
      } else if (payment.payment_amount !== receivedAmount) {
        this.logger.error(`Payment Record Price does not match ${gateway} - ${payment_id}`)
        throw new ServiceError(`Payment Record Price does not match ${gateway} - ${payment_id}`, 404)
      } else {
        const result = await this.confirmPaymentProc(payment, transaction)
        order = result.order
      }
    } catch (err) {
      if (internalTransaction) {
        await transaction.rollback()
      }
      return Promise.reject(err)
    }

    if (internalTransaction) {
      await transaction.commit()
    }
    return Promise.resolve({ order })
  }

  async failPayment(gateway: number, payment_id: string, info: object = {}) {
    const { app } = this
    const transaction = await app.model.transaction()
    try {
      const payment = await this.getCheckoutCartPayment(gateway, payment_id, {}, transaction)

      await payment.update({
        status: app.enum.ePaymentStatusCode.Failed,
        ...info
      })

      // 删除 order_shipping
      await app.model.UserOrderShipping.delete({
        where: {
          checkout_cart_payment_id: payment.id
        }
      }, { transaction })

      // 删除 order_address
      await app.model.UserOrderAddress.delete({
        where: {
          checkout_cart_payment_id: payment.id
        }
      }, { transaction })
    } catch (err) {
      await transaction.rollback()
      return Promise.reject(err)
    }
    await transaction.commit()
  }

  async createOrderFromCheckoutCartPayment(payment: IModel['CheckoutCartPayment'], transaction: Transaction, orderStatus: number|undefined = undefined) {
    const { app } = this
    // 生成订单数据
    let queue = Promise.resolve()

    if (orderStatus === undefined) orderStatus = app.enum.eUserOrderStatus.PaymentConfirmed

    const order = await app.model.UserOrder.create({
      user_id: payment.user_id,
      status: orderStatus,
      checkout_cart_payment_id: payment.id,
      amount: payment.payment_amount,
      paid_at: app.utils.utcDate.utcDate()
    }, { transaction })

    // 更新 discount 信息
    await app.model.UserOrderDiscount.update({
      order_id: order.id
    }, {
      where: {
        user_id: payment.user_id,
        checkout_cart_payment_id: payment.id
      },
      lock: transaction.LOCK.UPDATE
    }, { transaction })

    // 更新shipping_addresses
    await app.model.UserOrderAddress.update({
      order_id: order.id
    }, {
      where: {
        user_id: payment.user_id,
        checkout_cart_payment_id: payment.id
      }
    }, { transaction })

    // 更新 order_shipping
    await app.model.UserOrderShipping.update({
      order_id: order.id
    }, {
      where: {
        user_id: payment.user_id,
        checkout_cart_payment_id: payment.id
      }
    }, { transaction })

    // 获取所有相关物品
    const paymentItems = await app.model.CheckoutCartItem.findAll({
      where: {
        user_id: payment.user_id,
        checkout_cart_payment_id: payment.id
      },
      lock: transaction.LOCK.UPDATE
    }, { transaction })

    // 创建物品
    await app.model.UserOrderItem.bulkCreate(paymentItems.map((paymentItem) => ({
      order_id: order.id,
      product_id: paymentItem.product_id,
      user_id: payment.user_id,
      variant_id: paymentItem.variant_id,
      amount: paymentItem.amount,
      total_price: paymentItem.total_price,
      single_price: paymentItem.single_price
    })), { transaction })

    // 删除旧物品(CheckoutCartItems)
    paymentItems.forEach((paymentItem) => {
      queue = queue.then(() => paymentItem.destroy())
    })

    await queue

    // 移除购物车物品
    await this.removeCartItems(payment.user_id,
      paymentItems.filter((item) => item.cache_cart_item_id).map((item) => item.cache_cart_item_id),
      transaction)

    return Promise.resolve({ order })
  }

  async removeCartItems(userId: number, cartIds: number[], transaction: Transaction) {
    return await this.app.model.UserShoppingCartItem.destroy({
      where: {
        user_id: userId,
        id: {
          [Op.in]: cartIds
        }
      }
    }, { transaction })
  }
}
