import EPaymentGatewaySymbol from './EPaymentGatewaySymbol'
import EPaymentStatusCode from './EPaymentStatusCode'

export default {
  [EPaymentGatewaySymbol.STRIPE]: {
    'payment_intent.created': EPaymentStatusCode.NotPaid,
    'payment_intent.succeeded': EPaymentStatusCode.Paid,
    'payment_intent.payment_failed': EPaymentStatusCode.Failed,
    'payment_intent.requires_action': EPaymentStatusCode.ActionRequired,
  }
}
