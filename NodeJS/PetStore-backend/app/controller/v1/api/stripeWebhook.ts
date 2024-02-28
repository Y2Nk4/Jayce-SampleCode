import { Controller, IModel } from 'egg'
import stripe from 'stripe'

const paymentStatusChangedHooks = [
  'payment_intent.amount_capturable_updated',
  'payment_intent.canceled',
  'payment_intent.created',
  'payment_intent.payment_failed',
  'payment_intent.processing',
  'payment_intent.requires_action',
  'payment_intent.succeeded',
  'balance.available',
  'charge.dispute.created'
]

export default class StripeWebhookController extends Controller {
  async webhook() {
    const { ctx, app } = this

    const method = await app.model.PaymentMethod.findOne({
      where: {
        payment_gateway: 'stripeGateway'
      }
    })

    if (!method) return ctx.error('Gateway not Found', 404)
    const webhookKey = method.notify_key

    const sig = ctx.request.headers['stripe-signature']
    console.log('sig', sig, webhookKey, ctx.request.body)
    let event
    try {
      event = app.stripe().webhooks.constructEvent(ctx.request.rawBody, sig, webhookKey)
    } catch (err) {
      return ctx.error(`Webhook Error: ${err.message}`, 400, 400)
    }

    if (paymentStatusChangedHooks.includes(event.type)) {
      return this.webHooksPaymentChanged(event)
    }
  }

  protected async webHooksPaymentChanged(event: stripe.Event) {
    console.log(event)
    const { app } = this

    // eslint-disable-next-line default-case
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.service.order.order.confirmPayment(
          app.enum.ePaymentGatewaySymbol.STRIPE,
          event.data.object.id,
          event.data.object.amount_received)
        this.ctx.body = { received: true }

        break
      case 'payment_intent.payment_failed':
        await this.service.order.order.failPayment(
          app.enum.ePaymentGatewaySymbol.STRIPE,
          event.data.object.id)
        break
    }

    // 记录日志
    try {
      const paymentDetail = await app.model
        .CheckoutCartPaymentGatewayDetail.findOne({
          where: {
            payment_transaction_id: event.data.object.id,
          }
        })

      const payment = await app.model.CheckoutCartPayment.findOne({
        where: {
          payment_gateway: app.enum.ePaymentGatewaySymbol.STRIPE,
          payment_gateway_detail_id: paymentDetail.id,
        },
        attributes: [ 'id', 'payment_gateway', 'payment_gateway_detail_id', 'user_id' ]
      })
      await this.recordPaymentGatewayLogs(event, payment)
    } catch (e) {
      console.log('Error while logging:', e)
    }
  }

  protected async recordPaymentGatewayLogs(event: stripe.Event, payment: IModel['CheckoutCartPayment']) {
    const { app } = this
    await app.model.PaymentGatewayLog.create({
      payment_id: payment.id,
      user_id: payment.user_id,
      payment_gateway: payment.payment_gateway,
      sys_status_code: app.enum.ePaymentGatewaysToSysStatusMap[app.enum.ePaymentGatewaySymbol.STRIPE][event.type],
      gateway_status_code: event.data.object.status,
      gateway_payment_method_id: event.data.object.payment_method,
      gateway_payment_charge_id: event.data.object.charges.data.map((charge) => charge.id).join(', '),
      bank_code: event.data.object.charges.data.map((charge) => (
        `${charge.id}: ${charge.outcome.network_status}:${charge.outcome.reason}:${charge.outcome.type}`
      )).join(', '),
      payment_method_last4: event.data.object.charges.data.map((charge) => (
        `${charge.payment_method_details.card.network}:${charge.payment_method_details.card.last4}`
      )).join(', '),
      log: JSON.stringify(event)
    })
  }
}
