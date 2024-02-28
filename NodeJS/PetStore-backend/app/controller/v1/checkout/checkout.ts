import { Controller, IModel } from 'egg'
import { Op } from 'sequelize'
import EProductVariantStatus from '../../../enum/EProductVariantStatus'
import * as _ from 'lodash'
import { createHash } from 'crypto'
import CheckoutCart, { Address } from '../../../lib/CheckoutCart/CheckoutCart'
import CheckoutCartItem from '../../../lib/CheckoutCart/CheckoutCartItem'
import ProductVariantResource from '../../../resource/ProductVariantResource'
import DiscountHelper from '../../../lib/Discount/DiscountHelper'
import Tax from '../../../lib/Tax/Tax'
import CheckoutShippingRate from '../../../lib/CheckoutCart/CheckoutShippingRate'
import PercentageDiscount from '../../../lib/Discount/PercentageDiscount'
import DiscountContract from '../../../lib/Discount/DiscountContract'
// import EErrorCode from '../../../enum/EErrorCode'
// import ICheckoutCart from '../../../interface/shoppingCart/ICheckoutCart'
// import * as flatted from 'flatted'

export default class CheckoutController extends Controller {
  async initCheckout() {
    const { ctx, app, service } = this

    const valid = await ctx.validate({
      items: {
        type: 'array',
        required: true,
        fields: {
          0: {
            type: 'object',
            fields: {
              variant_id: { type: 'integer', required: true, transform: val => Number(val) },
              amount: { type: 'integer', required: true, transform: val => Number(val) },
            },
          },
        },
      },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const loggedInUser = ctx.state.user

    const transaction = await app.model.transaction()

    interface UserSentItem {
      variant_id: number;
      amount: number;
      cartItemId?: number|string;
    }
    const userSentItems: UserSentItem[] = ctx.request.body.items

    // console.log('userSentItems', userSentItems)

    const productVariants = await app.model.ProductVariant.findAll({
      where: {
        id: {
          [Op.in]: userSentItems.map(item => item.variant_id),
        },
        status: {
          // 非 Draft 的都获取，在下方做筛选
          // 目的是为了防止 Draft 的物品被显露出来
          [Op.notIn]: [
            EProductVariantStatus.Draft,
          ],
        },
      }
    })

    interface itemStruct{
      item: object,
      reason: string
    }

    const notAvailableVariants: itemStruct[] = []
    const userCheckoutItemMap = _.keyBy(userSentItems, 'variant_id')
    const availableVariants = productVariants.filter(
      item => {
        const resourcedItem = ProductVariantResource(item)
        if (item.status !== EProductVariantStatus.Normal) {
          notAvailableVariants.push({
            item: resourcedItem,
            reason: 'Item is not available',
          })
          return false
        } else if (item.is_track_quantity && item.stock_quantity <= 0) {
          notAvailableVariants.push({
            item: resourcedItem,
            reason: 'Item sold out',
          })
          return false
        }
        return true
      })

    // const userId = loggedInUser ? loggedInUser.id : ctx.session.userSessionId
    const sessionId = this.getUserId()
    const checkoutCartId = ctx.session.checkoutCartId || createHash('sha1')
      .update(`${sessionId}|checkoutCart|${Date.now()}`)
      .digest('hex')

    try {
      await service.checkout.checkoutCartLockItem.releaseItems(checkoutCartId, loggedInUser.id, transaction)

      let queue = Promise.resolve()
      availableVariants.forEach((variant) => {
        queue = queue.then(async () => {
          let availableAmount = userCheckoutItemMap[variant.id].amount
          if (variant.is_track_quantity) {
            availableAmount = Math.min(availableAmount, variant.stock_quantity)
          }
          if (availableAmount < userCheckoutItemMap[variant.id].amount) {
            notAvailableVariants.push({
              item: ProductVariantResource(variant),
              reason: `Item stock only left: ${availableAmount}`,
            })
          }

          await service.checkout.checkoutCartLockItem.lockItem(
            variant, availableAmount, loggedInUser.id, checkoutCartId, transaction)

          userCheckoutItemMap[variant.id].amount = availableAmount
        })
      })

      await queue
      await transaction.commit()
    } catch (err) {
      // console.log(err)
      await transaction.rollback()
      return ctx.error('Error While Checkout')
    }

    const checkoutCart: CheckoutCart = new CheckoutCart(checkoutCartId)

    availableVariants.forEach(variant => {
      const userItem = userCheckoutItemMap[variant.id]
      checkoutCart.addItem(CheckoutCartItem.fromModel(variant, userItem.amount, userItem.cartItemId))
    })
    await this.service.checkout.checkoutCartStorageService.saveCheckoutCart(sessionId, checkoutCartId, checkoutCart)

    return ctx.success({
      checkoutCartId,
      notAvailableVariants,
      subtotal: checkoutCart,
    })
  }

  async removeDiscount() {
    const { ctx } = this
    const valid = await ctx.validate({
      couponCodeIds: {
        type: 'array',
        required: true,
        fields: {
          0: {
            type: 'integer',
            required: true,
          },
        },
        transform: val => val.split(',').map(val => Number(val)),
      },
      checkoutCartId: {
        type: 'string',
        required: true,
      },
    }, ctx.request.body, 'rule')
    if (!valid) return

    let { checkoutCartId, couponCodeIds } = ctx.request.body
    couponCodeIds = couponCodeIds.split(',').map(val => Number(val))
    let checkoutCart
    try {
      checkoutCart = await this.service.checkout.checkoutCartStorageService.getCheckoutCart(
        this.getUserId(), checkoutCartId)
    } catch (e) { return ctx.error(e.message) }

    checkoutCart.removeDiscounts(couponCodeIds)

    await this.service.checkout.checkoutCartStorageService.saveCheckoutCart(
      this.getUserId(), checkoutCartId, checkoutCart)

    return ctx.success()
  }

  async addDiscount() {
    const { ctx, app } = this
    const valid = await ctx.validate({
      couponCode: {
        type: 'string',
        required: true,
      },
      checkoutCartId: {
        type: 'string',
        required: true,
      },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const { checkoutCartId, couponCode } = ctx.request.body

    // 获取 checkout cart
    const checkoutCart = await this.service.checkout.checkoutCartStorageService.getCheckoutCart(
      this.getUserId(), checkoutCartId)

    // 获取discount
    const discount = await app.model.Discount.getValidDiscount(couponCode)

    // console.log('discount', discount)

    if (!discount) return ctx.error(`Coupon ${couponCode} not found`, 200)

    if (checkoutCart.discounts.map(discount => discount.discountId).includes(discount.id)) {
      return ctx.error(`Discount ${couponCode} has already been applied.`)
    }

    const checkoutDiscount = DiscountHelper.fromModel(discount)
    // console.log('checkoutDiscount', checkoutDiscount)
    checkoutCart.addDiscount(checkoutDiscount)

    await this.service.checkout.checkoutCartStorageService.saveCheckoutCart(this.getUserId(), checkoutCartId, checkoutCart)

    return ctx.success()
  }

  async getCheckoutCartDetailSubtotal() {
    const { ctx } = this
    const valid = await ctx.validate({
      checkoutCartId: {
        type: 'string',
        required: true,
      },
    }, ctx.request.query, 'rule')
    if (!valid) return

    const { checkoutCartId } = ctx.request.query

    const checkoutCart = await this.service.checkout.checkoutCartStorageService.getCheckoutCart(this.getUserId(), checkoutCartId)

    return ctx.success(checkoutCart)
  }

  async updateShippingAddress() {
    const { ctx, app } = this

    const valid = await ctx.validate({
      checkoutCartId: {
        type: 'string',
        required: true,
      },
      firstName: { type: 'string', required: true },
      lastName: { type: 'string', required: true },
      address1: { type: 'string', required: true },
      city: { type: 'string', required: true },
      country: { type: 'string', required: true },
      zipCode: { type: 'string', required: true },
      state: { type: 'string', required: true },
      phone: { type: 'string', required: true },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const { checkoutCartId } = ctx.request.body

    const checkoutCart = await this.service.checkout.checkoutCartStorageService.getCheckoutCart(this.getUserId(), checkoutCartId)

    checkoutCart.updateShippingAddress({
      firstName: ctx.request.body.firstName,
      lastName: ctx.request.body.lastName,
      address1: ctx.request.body.address1,
      address2: ctx.request.body.address2,
      company: ctx.request.body.company,
      city: ctx.request.body.city,
      country: ctx.request.body.country,
      zipCode: ctx.request.body.zipCode,
      state: ctx.request.body.state,
      phone: ctx.request.body.phone,
    })

    const postalCode = await app.model.PostalCode.findOne({
      where: {
        zip_code: ctx.request.body.zipCode.slice(0, 5),
      },
    })
    const salesTax = Tax.fromModel(postalCode)
    // console.log('salesTax', ctx.request.body.zipCode, salesTax, postalCode.toJSON())
    checkoutCart.changeTax(salesTax)

    await this.service.checkout.checkoutCartStorageService.saveCheckoutCart(
      this.getUserId(), checkoutCartId, checkoutCart)

    return ctx.success()
  }

  async updateBillingAddress() {
    const { ctx } = this
    const valid = await ctx.validate({
      checkoutCartId: {
        type: 'string',
        required: true,
      },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const checkoutCart = await this.service.checkout.checkoutCartStorageService.getCheckoutCart(
      this.getUserId(), ctx.request.body.checkoutCartId)

    if (ctx.request.body.differentBillingAddress !== '1') {
      // use shipping addr as billing addr
      checkoutCart.updateBillingAddress(false)
    } else {
      const valid = await ctx.validate({
        firstName: { type: 'string', required: true },
        lastName: { type: 'string', required: true },
        address1: { type: 'string', required: true },
        city: { type: 'string', required: true },
        country: { type: 'string', required: true },
        zipCode: { type: 'string', required: true },
        state: { type: 'string', required: true },
        phone: { type: 'string', required: true },
      }, ctx.request.body, 'rule')
      if (!valid) return

      checkoutCart.updateBillingAddress(true, {
        firstName: ctx.request.body.firstName,
        lastName: ctx.request.body.lastName,
        address1: ctx.request.body.address1,
        address2: ctx.request.body.address2,
        company: ctx.request.body.company,
        city: ctx.request.body.city,
        country: ctx.request.body.country,
        zipCode: ctx.request.body.zipCode,
        state: ctx.request.body.state,
        phone: ctx.request.body.phone,
      })
    }

    await this.service.checkout.checkoutCartStorageService.saveCheckoutCart(
      this.getUserId(), ctx.request.body.checkoutCartId, checkoutCart)

    return ctx.success()
  }

  async selectShippingRate() {
    const { ctx, app } = this
    const valid = await ctx.validate({
      checkoutCartId: {
        type: 'string',
        required: true,
      },
      shippingRateId: {
        type: 'integer',
        required: true,
        transform: Number,
      },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const rate = await app.model.ShippingRate.findRateById(Number(ctx.request.body.shippingRateId))
    if (!rate) return ctx.error('Cannot find rate')

    const checkoutCart = await this.service.checkout.checkoutCartStorageService.getCheckoutCart(
      this.getUserId(), ctx.request.body.checkoutCartId)
    checkoutCart.updateShippingRate(CheckoutShippingRate.fromModel(rate))

    await this.service.checkout.checkoutCartStorageService.saveCheckoutCart(
      this.getUserId(), checkoutCart.cartId, checkoutCart)

    return ctx.success()
  }

  async initPayment() {
    const { ctx, app, service } = this

    // 防止短时间内多次提交 initPayment 请求
    if (await ctx.Limit({ max: 5, time: '5s' })) { return ctx.error('You are checkout too fast, please retry later', 200) }

    const valid = await ctx.validate({
      checkoutCartId: {
        type: 'string',
        required: true,
      },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const checkoutCart = await this.service.checkout.checkoutCartStorageService.getCheckoutCart(
      this.getUserId(), ctx.request.body.checkoutCartId)

    try {
      checkoutCart.checkIfAbleToInitPayment(true)
    } catch (err) { return ctx.error(`Failed to initialize payment: ${err.message}`, 200, err.errorCode) }

    // 创建事务
    let transaction = await app.model.transaction()

    // 检查折扣可用性
    // 先获取一个已经存在的折扣id的数组
    // 然后通过折扣id检查折扣是否仍可用
    // 然后清除原有的折扣
    // 加入已经验证过的折扣
    try {
      // 获取所有折扣
      // 自带悲观锁
      const dbDiscounts = await app.model.Discount.getValidDiscountsByID(
        checkoutCart.discounts.map(discount => discount.discountId),
        transaction)

      // 清除cart的所有折扣
      checkoutCart.clearDiscount()
      dbDiscounts.forEach(dbDiscount => {
        checkoutCart.addDiscount(DiscountHelper.fromModel(dbDiscount))
      })

      const { grandTotal, detailedTax, detailedSubtotal } = checkoutCart.getCheckoutCartGrandTotal()

      const userId = ctx.state.user.id

      // 将总价存入
      const paymentRecord = await app.model.CheckoutCartPayment.create({
        user_id: userId,
        cart_id: checkoutCart.cartId,
        payment_amount: grandTotal, // needs to be updated
        status: app.enum.ePaymentStatusCode.NotPaid,
        session_id: this.getUserId(),
        grand_total: grandTotal,
        item_total: detailedTax.taxableAmount,
        tax_total: detailedTax.totalTaxAmount,
        shipping_rate: checkoutCart.shippingRate.rate
      }, { transaction })

      // 存入折扣
      await service.order.discount.recordDiscount(
        checkoutCart, ctx.state.user, dbDiscounts, paymentRecord, transaction)

      // 存入物品
      await app.model.CheckoutCartItem.bulkCreate(detailedSubtotal.itemDetailSubtotal.map((item) => ({
        checkout_cart_payment_id: paymentRecord.id,
        variant_id: item.cartItem.variantId,
        product_id: item.cartItem.productId,
        user_id: userId,
        amount: item.cartItem.getAmount(),
        single_price: item.cartItem.itemPrice,
        total_price: item.itemSubTotal,
        cache_cart_item_id: item.cartItem.cartItemId
      })), { transaction })

      // 存入地址数据
      // shipping addr
      // console.log({
      //   checkout_cart_payment_id: paymentRecord.id,
      //   user_id: userId,
      //   address_type: app.enum.eAddressTypes.SHIPPING,
      //   ...checkoutCart.shippingAddress
      // })
      const shippingAddrRecord = await app.model.UserOrderAddress.create({
        checkout_cart_payment_id: paymentRecord.id,
        user_id: userId,
        address_type: app.enum.eAddressTypes.SHIPPING,
        ...this.serializeAddressToDB(checkoutCart.shippingAddress)
      }, { transaction })
      if (!checkoutCart.differentBillingAddress) {
        await shippingAddrRecord.update({
          address_type: app.enum.eAddressTypes.BOTH_SHIPPING_AND_BILLING
        }, { transaction })
      } else {
        await app.model.UserOrderAddress.create({
          checkout_cart_payment_id: paymentRecord.id,
          user_id: userId,
          address_type: app.enum.eAddressTypes.BILLING,
          ...this.serializeAddressToDB(checkoutCart.billingAddress)
        }, { transaction })
      }

      await app.model.UserOrderShipping.create({
        checkout_cart_payment_id: paymentRecord.id,
        name: checkoutCart.shippingRate.name,
        shipping_rate_id: checkoutCart.shippingRate.id,
        rate: checkoutCart.shippingRate.rate,
        user_id: userId
      })

      // 创建 paymentIntents
      let paymentResult
      let skipPaymentStep = false
      let orderId = null

      const payments: object[] = []

      if (grandTotal <= 0) {
        // 先释放锁
        // 避免后续处理死锁
        await transaction.commit()
        transaction = await app.model.transaction()

        paymentResult = await service.payment.gateways.freeGateway
          .createPayment(grandTotal, 'usd', {
            payment: paymentRecord, transaction
          })
        orderId = paymentResult.orderId
        skipPaymentStep = true
        await paymentRecord.update({
          payment_session_id: paymentResult.paymentSessionId,
          payment_gateway: app.enum.ePaymentGatewaySymbol.Free,
        }, { transaction })
      } else {

        await app.model.CheckoutCartPaymentGatewayDetail.destroy({
          where: {
            user_id: userId,
            cart_id: checkoutCart.cartId
          }
        })
        const paymentMethods = await app.model.PaymentMethod
          .scope('enabled')
          .findAll()

        let queue = Promise.resolve()

        paymentMethods.forEach((payment: IModel['PaymentMethod']) => {
          const fee = new Tax(Tax.specialID.PaymentFee, 'Transaction Fee', payment.transaction_fee)
          const discount = new PercentageDiscount({
            discountName: 'Payment Discount',
            discountId: DiscountContract.specialID.PaymentDiscount,
            discountValue: payment.discount_rate / 100,
            // payment's discount rate store in 1/10k unit
            // but the Discount Modifier is in 1/100 unit
            // therefore, divided by 100 is needed.
            modifierScope: app.enum.eModifierScope.FinalPrice,
            applicableProducts: [],
            applicableVariants: []
          })

          const paymentFee = fee.computeTax(grandTotal)
          const paymentTotal = discount.getPrice(grandTotal + paymentFee)
          const discountedAmount = grandTotal + paymentFee - paymentTotal

          queue = queue.then(async () => {
            const paymentResult = await service.payment
              .gateways[payment.payment_gateway]
              .createPayment(paymentTotal, 'usd', {
                payment: paymentRecord, transaction
              })
            console.log('paymentResult', paymentResult)
            const tempInfo = await app.model.CheckoutCartPaymentGatewayDetail.create({
              user_id: userId,
              cart_id: checkoutCart.cartId,
              payment_gateway_id: payment.id,
              payment_record_id: paymentRecord.id,

              payment_session_id: paymentResult.paymentSessionId,
              payment_transaction_id: paymentResult.paymentTransactionId,

              grand_total: grandTotal,
              transaction_fee: paymentFee,
              discounted_amount: discountedAmount,
              charge_amount: paymentTotal
            }, { transaction })

            payments.push({
              id: payment.id,
              paymentDetailId: tempInfo.id,
              paymentName: payment.display_name,
              description: payment.description,
              paymentLogoUrl: payment.payment_logo_url,

              clientSecret: paymentResult.clientSecret,
              publicKey: payment.public_key,
              gateway: payment.payment_gateway,

              grandTotal,
              paymentFee,
              discountedAmount,
              chargeAmount: paymentTotal

            })
          })
        })

        await queue
      }

      await transaction.commit()
      await this.service.checkout.checkoutCartStorageService.saveCheckoutCart(
        this.getUserId(), checkoutCart.cartId, checkoutCart)

      return ctx.success({
        cart: checkoutCart,
        payment: {
          payments,
          paymentId: paymentRecord.id,

          skipPaymentStep,
          orderId
        }
      })
    } catch (e) {
      await transaction.rollback()
      return ctx.error('Something went wrong during processing the order, please retry', 200, app.enum.eErrorCode.ServiceError)
    }
  }

  async submitPayment() {
    const { ctx, app, service } = this
    const valid = await ctx.validate({
      checkoutCartId: { type: 'string', required: true },
      paymentId: { type: 'integer', required: true, transform: Number },
      paymentDetailId: { type: 'integer', required: true, transform: Number },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const userId = ctx.state.user.id

    const transaction = await app.model.transaction()

    try {
      const paymentDetail = await app.model.CheckoutCartPaymentGatewayDetail.findOne({
        where: {
          user_id: userId,
          id: ctx.request.body.paymentDetailId,
          cart_id: ctx.request.body.checkoutCartId
        },
        lock: transaction.LOCK.UPDATE
      }, { transaction })

      if (!paymentDetail) {
        await transaction.commit()
        return ctx.error('Payment Not Found', 404)
      }

      const paymentRecord = await app.model.CheckoutCartPayment.findOne({
        where: {
          id: paymentDetail.payment_record_id,
          user_id: userId,
          cart_id: ctx.request.body.checkoutCartId
        },
        lock: transaction.LOCK.UPDATE
      }, { transaction })

      if (!paymentRecord) {
        await transaction.commit()
        return ctx.error('Payment Detail Not Found', 404)
      }

      if (paymentRecord.status === app.enum.ePaymentStatusCode.Paid ||
        paymentRecord.status === app.enum.ePaymentStatusCode.Failed) {
        return ctx.success()
      } else if (paymentRecord.status !== app.enum.ePaymentStatusCode.NotPaid) {
        await transaction.commit()
        return ctx.error('Payment has been submitted', 400)
      }

      const paymentMethod = await app.model.PaymentMethod
        .scope('gatewayOnly').findOne({
          where: {
            id: paymentDetail.payment_gateway_id
          }
        })

      if (!paymentMethod) {
        return ctx.error('Internal Error: PaymentMethodNotExist', 500)
      }

      await paymentRecord.update({
        status: this.app.enum.ePaymentStatusCode.Submitted,
        payment_amount: paymentDetail.charge_amount,
        payment_gateway_detail_id: paymentDetail.id,
        payment_gateway: paymentMethod.id
      }, { transaction })

      const result = await service.payment.gateways[paymentMethod.payment_gateway]
        .submitPayment(paymentRecord, paymentDetail, paymentMethod, transaction)

      await transaction.commit()

      if (result) {
        return ctx.success()
      } else {
        return ctx.error('Failed to submit your payment', 500)
      }
    } catch (e) {
      await transaction.rollback()
      throw e
    }
  }

  async cancelPayment() {
    const { ctx, app, service } = this
    const valid = await ctx.validate({
      checkoutCartId: { type: 'string', required: true },
      paymentId: { type: 'integer', required: true, transform: Number },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const { checkoutCartId, paymentId } = ctx.request.body
    const { user } = ctx.state

    const transaction = await app.model.transaction()
    try {
      const checkoutPayment = await app.model.CheckoutCartPayment.findOne({
        where: {
          id: paymentId,
          user_id: user.id,
          cart_id: checkoutCartId,
          status: app.enum.ePaymentStatusCode.NotPaid
        }
      }, { transaction })

      if (!checkoutPayment) {
        await transaction.commit()
        return ctx.error('Payment record does not exist.', 404)
      }

      await app.model.CheckoutCartPaymentGatewayDetail.destroy({
        where: {
          user_id: user.id,
          cart_id: checkoutCartId
        }
      })

      const paymentDiscounts = await app.model.UserOrderDiscount.findAll({
        where: {
          checkout_cart_payment_id: checkoutPayment.id,
          user_id: user.id,
          cart_id: checkoutCartId
        },
        lock: transaction.LOCK.UPDATE
      }, { transaction })

      // 删除折扣
      await service.order.discount.retrieveCheckoutDiscount(paymentDiscounts, transaction)

      // 取消支付网关的transaction
      await service.order.paymentGateway.cancelCheckoutPayment(checkoutPayment)

      // 删除此条数据
      await checkoutPayment.destroy({ transaction })

      await transaction.commit()

      return ctx.success()
    } catch (err) {
      await transaction.rollback()
      this.logger.error(err)
      return ctx.error(err.message, 500)
    }
  }

  async fetchPaymentResult() {
    const { ctx, app } = this
    const valid = await ctx.validate({
      paymentId: {
        type: 'integer',
        required: true,
        transform: Number
      },
    }, ctx.request.body, 'rule')
    if (!valid) return

    const { user } = ctx.state
    const { paymentId } = ctx.request.body

    const payment = await app.model.CheckoutCartPayment.findOne({
      where: {
        user_id: user.id,
        id: paymentId
      }
    })

    if (!payment) return ctx.error('Payment Record Not Found', 404)

    if (payment.status !== app.enum.ePaymentStatusCode.NotPaid) {
      const order = await app.model.UserOrder.findOne({
        where: {
          checkout_cart_payment_id: payment.id,
          user_id: user.id
        },
        attributes: [ 'id', 'checkout_cart_payment_id', 'user_id' ]
      })

      if (order) {
        return ctx.success({
          status: payment.status,
          orderId: order.id
        })
      }
    }
    return ctx.success({
      status: payment.status
    })

  }

  /**
   * Internal Methods
   * */
  protected getUserId(): string {
    // const loggedInUser = this.ctx.state.user
    // return loggedInUser ? loggedInUser.id : this.ctx.session.userSessionId
    return this.ctx.session.userSessionId
  }

  // 以后独立出来
  protected serializeAddressToDB(address: Address) {
    return {
      first_name: address.firstName,
      last_name: address.lastName,
      address1: address.address1,
      address2: address.address2,
      company: address.company,
      city: address.city,
      country: address.country,
      zip_code: address.zipCode,
      state: address.state,
      phone: address.phone,
    }
  }
}
