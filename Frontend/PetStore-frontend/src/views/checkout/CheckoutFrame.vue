<template>
  <div>
    <common-header/>

    <div class="web-container checkout-page">
      <v-container>
        <v-row style="flex-direction: row-reverse;">
          <v-col class="flex-shrink-1 flex-grow-1 right-column">
            <summary-panel :checkout-cart="checkoutCart"/>
          </v-col>
          <v-col class="flex-shrink-1 flex-grow-1">
            <h1 style="margin-bottom: 15px;">Secure Checkout</h1>

            <v-alert
                v-for="(item, index) in notAvailableVariants"
                :key="index"
                text
                outlined
                color="deep-orange"
                icon="mdi-basket-remove-outline"
            >
              Item removed from your cart: {{ item.item.product.title }} (Option: {{ item.item.skuName }}), because {{ item.reason }}
            </v-alert>
            <v-alert
                text
                outlined
                color="deep-orange"
                icon="mdi-basket-remove-outline"
                v-if="!checkoutCart.allowCheckout"
            >
              {{ checkoutCart.notAllowReason }},
              Please go back to <a @click="$router.push({name: 'shopping-cart'})">shopping cart</a>
            </v-alert>

            <v-expansion-panels v-model="checkoutStep" readonly>
              <v-expansion-panel @click="moveToStep(Math.min(ECheckoutSteps.ConfirmShippingAddress, checkoutStep))">
                <select-shipping-address
                  @nextStep="moveToStep(ECheckoutSteps.ConfirmBillingAddress)"
                  :checkoutCart="checkoutCart"/>
              </v-expansion-panel>

              <v-expansion-panel @click="moveToStep(Math.min(ECheckoutSteps.ConfirmBillingAddress, checkoutStep))">
                <select-billing-address
                  @nextStep="moveToStep(ECheckoutSteps.SelectShippingMethod)"
                  :checkoutCart="checkoutCart"/>
              </v-expansion-panel>

              <v-expansion-panel @click="moveToStep(Math.min(ECheckoutSteps.SelectShippingMethod, checkoutStep))">
                <shipping-method
                  @nextStep="moveToStep(ECheckoutSteps.SubmitPayment)"
                  :checkoutCart="checkoutCart"/>
              </v-expansion-panel>

              <v-expansion-panel @click="moveToStep(Math.min(ECheckoutSteps.SubmitPayment, checkoutStep))">
                <payment-section
                  @nextStep="moveToStep(ECheckoutSteps.PaymentResult)"
                  :checkoutCart="checkoutCart"/>
              </v-expansion-panel>

              <v-expansion-panel @click="moveToStep(Math.min(ECheckoutSteps.SubmitPayment, checkoutStep))"
                                 v-show="checkoutStep > ECheckoutSteps.SubmitPayment">
                <payment-result
                  :checkoutCart="checkoutCart"/>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import SelectShippingAddress from './SelectShippingAddress.vue'
import SelectBillingAddress from './SelectBillingAddress.vue'
import ShippingMethod from './ShippingMethod.vue'
import SummaryPanel from './SummaryPanel.vue'
import PaymentSection from './PaymentSection.vue'
import PaymentResult from './PaymentResult.vue'
import CommonHeader from '../common/Header.vue'
import ECheckoutSteps from '../../enum/ECheckoutSteps'

export default {
  name: 'CheckoutFrame',
  components: {
    SelectShippingAddress,
    CommonHeader,
    SummaryPanel,
    SelectBillingAddress,
    ShippingMethod,
    PaymentSection,
    PaymentResult
  },
  computed: {
    ...(mapState({
      notAvailableVariants: (state) => state.checkout.notAvailableVariants,
      checkoutCart: (state) => state.checkout.checkoutCartSubtotal,
      storeCheckoutStep: (state) => state.checkout.checkoutStep
    }))
  },
  methods: {
    ...(mapActions({
      getCheckoutCartSubtotal: 'checkout/getCheckoutCartSubtotal',
      cancelPayment: 'checkout/cancelPayment'
    })),
    async moveToStep(step) {
      if (this.checkoutStep === ECheckoutSteps.PaymentResult) {
        // not move
      } else if (this.checkoutStep === ECheckoutSteps.SubmitPayment && step < this.checkoutStep) {
        // 取消付款
        const res = await this.$dialog.confirm({
          text: 'Do you really want to make revision in this order? This will stop submitting payment',
          title: 'Making Revision'
        })

        if (res) {
          this.$store.commit('common/SHOW_LOADING_OVERLAY')
          await this.cancelPayment()
          this.checkoutStep = step
          this.$store.commit('common/HIDE_LOADING_OVERLAY')
        }
      } else {
        this.checkoutStep = step
      }
    }
  },
  data: () => ({
    checkoutStep: 0,
    ECheckoutSteps
  }),
  async mounted() {
    this.$store.commit('common/SHOW_LOADING_OVERLAY')
    await this.getCheckoutCartSubtotal().catch(console.log)
    this.checkoutStep = this.$store.state.checkout.checkoutStep
    this.$store.commit('common/HIDE_LOADING_OVERLAY')
  },
  watch: {
    checkoutStep(to) {
      if (to !== undefined && to !== this.storeCheckoutStep) {
        console.log('changed,', to)
        this.$store.commit('checkout/SET_CHECKOUT_STEP', to)
      }
    },
    storeCheckoutStep(to) {
      this.checkoutStep = to
    }
  }
}
</script>

<style scoped lang="less">
.right-column{
  max-width: 400px;
}
</style>
