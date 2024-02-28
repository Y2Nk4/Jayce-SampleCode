<template>
  <div>
    <v-expansion-panel-header>
      Payment
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <div class="payment-section">
        <v-radio-group class="payment-radio-group" v-model="selectPaymentMethod">
          <template v-if="checkoutPayments">
            <v-card class="payment-radio-card" v-for="(payment, index) in checkoutPayments.payments" :key="index">
              <v-radio class="payment-radio" :value="index">
                <template v-slot:label>
                  <div class="radio-header">
                    <v-row class="align-center">
                    <span style="padding: 0 10px">{{ payment.paymentName }}
                      <!--                      <v-chip-->
                      <!--                        color="primary"-->
                      <!--                        text-color="white"-->
                      <!--                        small-->
                      <!--                      >-->
                      <!--                        Extra 10% Off-->
                      <!--                      </v-chip>-->
                    </span>
                      <img v-if="payment.paymentLogoUrl"
                           :src="payment.paymentLogoUrl"
                           style="height: 2em;">
                    </v-row>
                  </div>
                </template>
              </v-radio>
              <v-expand-transition>
                <div v-show="selectPaymentMethod === index">
                  <v-divider class="radio-divider"></v-divider>
                  <pay-later-card :payment="payment"
                                  :ref="'payment-'+payment.id"
                                  v-if="payment.gateway === 'payLaterGateway'"/>
                  <stripe-card :payment="payment"
                               :ref="'payment-'+payment.id"
                               v-else-if="payment.gateway === 'stripeGateway'" />
                </div>
              </v-expand-transition>
            </v-card>
          </template>
        </v-radio-group>

        <v-btn color="primary primarytext--text" @click="confirmPayment">Place the Order</v-btn>

        <p style="margin-top: 10px;">
          By placing your order, you authorize us to charge
          <span style="font-weight: bold" v-if="selectedPaymentSummary">${{ ((selectedPaymentSummary.chargeAmount) / 100).toFixed(2) }}</span>
          from your selected payment, and you agree to PawPose's privacy notice and conditions of use.
        </p>
      </div>
    </v-expansion-panel-content>
  </div>
</template>

<script>
import config from '@/config/app.config'
import { mapActions, mapState } from 'vuex'
import PayLaterCard from '@/views/paymentGatewayCards/PayLaterCard.vue'
import StripeCard from '@/views/paymentGatewayCards/StripeCard.vue'
import EPaymentStatusCode from '../../enum/EPaymentStatusCode'

export default {
  name: 'PaymentSection',
  components: {
    PayLaterCard, StripeCard
  },
  data: () => ({
    config,
    selectPaymentMethod: 0
  }),
  computed: {
    ...(mapState({
      checkoutPayments: (state) => state.checkout.checkoutPayments,
      selectedPaymentSummary: (state) => state.checkout.selectedPaymentSummary
    }))
  },
  methods: {
    ...(mapActions({
      wrappedFetchResult: 'checkout/wrappedFetchResult',
      submitPayment: 'checkout/submitPayment'
    })),
    async confirmPayment() {
      this.$store.commit('common/SHOW_LOADING_OVERLAY')

      await this.$store.dispatch('checkout/submitPayment',
        this.checkoutPayments.payments[this.selectPaymentMethod].paymentDetailId)

      const selectedPaymentGateway = this.$refs[`payment-${this.selectedPaymentSummary.id}`][0]
      await selectedPaymentGateway.submitPayment()

      await this.wrappedFetchResult()

      this.$emit('nextStep')
      this.$store.commit('common/HIDE_LOADING_OVERLAY')
    }
  },
  watch: {
    selectPaymentMethod(to) {
      if (this.checkoutPayments && this.selectPaymentMethod !== null) {
        this.$store.commit('checkout/UPDATE_PAYMENT_SUMMARY', this.checkoutPayments.payments[to])
      }
    },
    checkoutPayments() {
      this.selectPaymentMethod = null
    }
  }
}
</script>

<style lang="less">
.payment-radio-group{
  .payment-radio-card{
    padding: 15px;

    &:not(:last-child){
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
    &:not(:first-child){
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    .radio-divider{
      margin: 10px 0 20px;
    }
  }
}
</style>
