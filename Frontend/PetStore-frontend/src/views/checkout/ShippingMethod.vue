<template>
  <div>
    <v-expansion-panel-header>
      <template v-slot:default="{ open }">
        <v-row no-gutters>
          <v-col cols="4">
            Shipping Method
          </v-col>
          <v-col cols="8">
            <v-fade-transition leave-absolute>
            <span v-if="!open">
              {{ checkoutCart.shippingRate ? checkoutCart.shippingRate.name : '' }}
            </span>
            </v-fade-transition>
          </v-col>
        </v-row>
      </template>
      <template v-slot:actions>
        <div v-if="checkoutStep > ECheckoutSteps.SelectShippingMethod">
          <span class="primary--text" v-show="checkoutStep !== ECheckoutSteps.PaymentResult">Edit</span>
          <v-icon color="teal">
            mdi-check
          </v-icon>
        </div>
        <v-icon v-else>
          $expand
        </v-icon>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <div>
        <v-radio-group class="address-selector-radio" v-model="selectedMethod">
          <v-radio
              v-for="(method, index) in shippingRates"
              :key="index"
              :label="`${method.name} - $${(method.rate / 100).toFixed(2)}`"
              :value="index"
          ></v-radio>
        </v-radio-group>
        <v-btn color="primary primarytext--text" @click="updateShippingMethod">UPDATE AND CONTINUE</v-btn>
      </div>
    </v-expansion-panel-content>
  </div>
</template>

<script>
import shippingApi from '@/api/shipping'
import { mapActions, mapState } from 'vuex'
import ECheckoutSteps from '@/enum/ECheckoutSteps'

export default {
  name: 'ShippingMethod',
  props: {
    checkoutCart: {
      type: Object
    }
  },
  data: () => ({
    selectedMethod: 0,
    ECheckoutSteps
  }),
  computed: {
    ...(mapState({
      checkoutStep: (state) => state.checkout.checkoutStep,
      shippingRates: (state) => state.checkout.shippingRates
    }))
  },
  methods: {
    ...(mapActions({
      selectShippingRate: 'checkout/selectShippingRate',
      initPayment: 'checkout/initPayment',
      getCheckoutCartSubtotal: 'checkout/getCheckoutCartSubtotal',
      wrappedFetchResult: 'checkout/wrappedFetchResult',
      getShippingRate: 'checkout/getShippingRate'
    })),
    async updateShippingMethod() {
      const selectedMethod = this.shippingRates[this.selectedMethod]
      if (selectedMethod) {
        this.$store.commit('common/SHOW_LOADING_OVERLAY')
        await this.selectShippingRate(selectedMethod.id)
          .catch(console.error)
        await this.getCheckoutCartSubtotal()
        await this.initPayment().then(async (result) => {
          if (result.payment.skipPaymentStep) {
            await this.wrappedFetchResult()
            this.$store.commit('checkout/SET_CHECKOUT_STEP', ECheckoutSteps.PaymentResult)
          } else {
            this.$emit('nextStep')
          }
          return Promise.resolve()
        }).catch((err) => {
          console.log(err)
          this.$dialog.notify.error(err.message)
        })
        this.$store.commit('common/HIDE_LOADING_OVERLAY')
      }
    }
  },
  async mounted() {
    if (this.checkoutStep === ECheckoutSteps.SelectShippingMethod) {
      this.$store.commit('common/SHOW_LOADING_OVERLAY')
      await this.getShippingRate()
      this.$store.commit('common/HIDE_LOADING_OVERLAY')
    }
  }
}
</script>

<style scoped>

</style>
