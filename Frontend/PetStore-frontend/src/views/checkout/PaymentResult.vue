<template>
  <div>
    <v-expansion-panel-header>
      Result
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <div class="payment-result-section payment-success" v-if="paymentResult && [EPaymentStatusCode.Paid, EPaymentStatusCode.Submitted].includes(paymentResult.status) && paymentResult.orderId">
        <v-row>
          <v-col class="result-col-left">
            <img src="../../assets/images/undraw_deliveries_131a.svg" class="side-img" alt="">
          </v-col>
          <v-col class="result-col-right">
            <h2>
              <v-icon color="teal">
                mdi-check-circle
              </v-icon>
              You are all set!
            </h2>
            <h3>
              <a @click="$router.push({ name: 'user.orderDetail', params: { orderId: paymentResult.orderId } })">
                Order #{{ paymentResult.orderId }}
              </a>
            </h3>
            <p>We have already received your payment, and the order will be delivered to you as soon as possible!</p>
            <p>During this time, you can check the order updates via <a @click="$router.push({name: 'user.orders'})">Order History</a></p>
          </v-col>
        </v-row>
      </div>
      <div class="payment-result-section payment-success" v-else-if="paymentResult && [EPaymentStatusCode.Paid, EPaymentStatusCode.Submitted].includes(paymentResult.status)">
        <v-row>
          <v-col class="result-col-left">
            <img src="../../assets/images/undraw_deliveries_131a.svg" class="side-img" alt="">
          </v-col>
          <v-col class="result-col-right">
            <h2>
              <v-icon color="teal">
                mdi-check-circle
              </v-icon>
              We are processing your order!
            </h2>
            <h3>
              <a @click="$router.push({ name: 'user.orderDetail', params: { orderId: paymentResult.orderId } })">
                Order #{{ paymentResult.orderId }}
              </a>
            </h3>
            <p>Once the payment is confirmed, we will notify you and it will be shown on your <a @click="$router.push({name: 'user.orders'})">Order History</a>.</p>
          </v-col>
        </v-row>
      </div>
      <div class="payment-result-section payment-failed" v-else-if="paymentResult && paymentResult.status !== EPaymentStatusCode.Paid">
        <v-row>
          <v-col class="result-col-left">
            <img src="../../assets/images/undraw_decide_3iwx.svg" class="side-img" alt="">
          </v-col>
          <v-col class="result-col-right">
            <h2>
              <v-icon color="red">
                mdi-close-circle
              </v-icon>
              Payment Failed
            </h2>
            <p>We are sorry to tell you that the payment was failed.</p>
            <p>Please make sure you have enter the correct information. Or You can try to check out again now.</p>
          </v-col>
        </v-row>
      </div>
    </v-expansion-panel-content>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EPaymentStatusCode from '../../enum/EPaymentStatusCode'

export default {
  name: 'PaymentResult',
  computed: {
    ...(mapState({
      checkoutPayments: (state) => state.checkout.checkoutPayments,
      paymentGatewayResult: (state) => state.checkout.paymentGatewayResult,
      paymentResult: (state) => state.checkout.paymentResult,
    }))
  },
  data: () => ({
    EPaymentStatusCode
  })
}
</script>

<style lang="less">
.payment-result-section{
  img.side-img{
    width: 200px;
  }

  .result-col-right, .result-col-left{
    text-align: center;
  }
  .result-col-left{
    max-width: 220px;
  }
  .result-col-right{

  }
}
</style>
