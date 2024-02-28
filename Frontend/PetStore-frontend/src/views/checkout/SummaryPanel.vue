<template>
  <div>
    <v-card class="summary-panel">
      <h2>Summary</h2>

      <div class="subtotal-table">
        <div class="subtotal-row">
          <div class="cart-item-title" >
            <p>Item(s):</p>
          </div>
          <div class="cart-item-amount">
            <span style="font-weight: 800">${{ (checkoutCart.subtotalBeforeTax.finalSubtotalBeforeTax / 100).toFixed(2) }}</span>
          </div>
        </div>
        <template v-if="checkoutCart && checkoutCart.subtotalBeforeTax && checkoutCart.subtotalBeforeTax.itemDetailSubtotal">
          <div class="item-detail-block" v-for="(item, index) in checkoutCart.subtotalBeforeTax.itemDetailSubtotal" :key="index">
            <div class="subtotal-row sub-item">
              <div class="cart-item-title">
                <p>
                  {{ item.cartItem.productName }},
                  <strong>Option: {{ item.cartItem.variantName }}</strong>
                </p>
              </div>
              <div class="cart-item-amount">
                <template v-if="item.cartItem.itemNormalPrice && item.cartItem.itemNormalPrice !== item.cartItem.itemPrice">
                  <del class="original-price"><span>${{ (item.cartItem.itemNormalPrice/100).toFixed(2) }}</span></del>
                </template>
                <span style="font-weight: 800">${{ (item.cartItem.itemPrice / 100).toFixed(2) }} x {{ item.cartItem.purchaseAmount }}</span>
              </div>
            </div>

            <template v-if="item.discounts && item.discounts.length > 0">
              <div class="subtotal-row sec-sub-item" v-for="(discount, discountIndex) in item.discounts" :key="discountIndex">
                <div class="cart-item-title">
                  <v-icon color="orange accent-3">mdi-sale</v-icon><p>{{ discount.discount.discountName }}</p>
                </div>
                <div class="cart-item-amount">
                  <span>- ${{ (discount.appliedAmount / 100).toFixed(2) }}</span>
                </div>
              </div>
            </template>
          </div>

        </template>
        <div class="subtotal-row">
          <div class="cart-item-title" >
            <p>Shipping:</p>
          </div>
          <div class="cart-item-amount">
            <span>
              {{ !checkoutCart.shippingRate ? 'Select a shipping method first' : '' }}
            </span>
          </div>
        </div>
        <div class="subtotal-row sub-item" v-if="checkoutCart.shippingRate">
          <div class="cart-item-title">
            <p> {{ checkoutCart.shippingRate ? checkoutCart.shippingRate.name : '' }} </p>
          </div>
          <div class="cart-item-amount">
            <span>
              {{ checkoutCart.shippingRate ? `$${(checkoutCart.shippingRate.rate / 100).toFixed(2)}` : 'Select a shipping method first' }}
            </span>
          </div>
        </div>
        <div class="subtotal-row">
          <div class="cart-item-title" >
            <p>Tax:</p>
          </div>
          <div class="cart-item-amount">
            <span>
              {{ (!checkoutCart.taxDetails || !checkoutCart.taxDetails.taxDetails || !checkoutCart.taxDetails.taxDetails.length > 0) ? 'Calculate Once Confirmed Address' : `$${(checkoutCart.taxDetails.totalTaxAmount / 100).toFixed(2)}` }}
            </span>
          </div>
        </div>
        <template v-if="checkoutCart.taxDetails && checkoutCart.taxDetails.taxDetails && checkoutCart.taxDetails.taxDetails.length > 0">
          <div class="subtotal-row sub-item"
               v-for="(tax, index) in checkoutCart.taxDetails.taxDetails"
               :key="index">
            <div class="cart-item-title">
              <p>{{ tax.taxDetail.taxName }}:</p>
            </div>
            <div class="cart-item-amount">
              <span>
                ${{ (tax.taxAmount / 100).toFixed(2) }}
              </span>
            </div>
          </div>
        </template>
        <template v-if="checkoutCart && checkoutCart.subtotalBeforeTax
        && checkoutCart.subtotalBeforeTax.orderDiscounts
        && checkoutCart.subtotalBeforeTax.orderDiscounts.length > 0">
          <div class="subtotal-row">
            <div class="cart-item-title">
              <p>Discounts:</p>
            </div>
            <div class="cart-item-amount">
            </div>
          </div>
          <div class="subtotal-row sub-item"
               v-for="(discount, index) in checkoutCart.subtotalBeforeTax.orderDiscounts"
               :key="index">
            <div class="cart-item-title">
              <v-icon color="orange accent-3">mdi-sale</v-icon><p>{{ discount.discount.discountName }}:</p>
            </div>
            <div class="cart-item-amount">
              - ${{ (discount.appliedAmount / 100).toFixed(2) }}
            </div>
          </div>
        </template>

        <v-divider></v-divider>
        <div class="subtotal-row">
          <div class="cart-item-title" >
            <p>Order total:</p>
          </div>
          <div class="cart-item-amount" v-if="checkoutCart && checkoutCart.taxDetails">
            ${{ ((checkoutCart.finalAmount) / 100).toFixed(2) }}
          </div>
        </div>
        <v-expand-transition v-if="selectedPaymentSummary">
          <div class="subtotal-table">
            <div class="subtotal-row sub-item" v-if="selectedPaymentSummary.paymentFee">
              <div class="cart-item-title" >
                <p>Transaction Fee</p>
              </div>
              <div class="cart-item-amount">
                ${{ ((selectedPaymentSummary.paymentFee) / 100).toFixed(2) }}
              </div>
            </div>
            <div class="subtotal-row sub-item" v-if="selectedPaymentSummary.discountedAmount">
              <div class="cart-item-title" >
                <p>Payment Discount</p>
              </div>
              <div class="cart-item-amount">
                - ${{ ((selectedPaymentSummary.discountedAmount) / 100).toFixed(2) }}
              </div>
            </div>
            <div class="subtotal-row">
              <div class="cart-item-title" >
                <p>Total Charge</p>
              </div>
              <div class="cart-item-amount">
                ${{ ((selectedPaymentSummary.chargeAmount) / 100).toFixed(2) }}
              </div>
            </div>
          </div>
        </v-expand-transition>
      </div>
    </v-card>

    <v-card class="coupon-panel">
      <h2>Coupon</h2>

      <validation-observer
          ref="couponObserver"
      >
        <form @submit.prevent="submitCoupon">
          <validation-provider
              v-slot="{ errors }"
              name="couponCode"
              rules="required"
          >
            <v-combobox
                v-model="checkoutCart.subtotalBeforeTax.discounts"
                label="Coupon Code"
                @input="submitCoupon"
                :search-input.sync="couponCode"
                :loading="isCheckingCoupon"
                :error-messages="errors"
                :disabled="checkoutStep >= ECheckoutSteps.SubmitPayment"
                multiple
                small-chips
                hide-no-data
                disable-lookup
                hide-selected
            >
              <template v-slot:selection="{ attrs, item, parent, selected }">
                <v-chip
                    v-if="item === Object(item)"
                    v-bind="attrs"
                    color="lighten-3"
                    :input-value="selected"
                    label
                    small>
            <span class="pr-2">
              {{ item.discountName }}
            </span>
                  <v-icon
                      small
                      @click="deleteItem(attrs, item, parent, selected)">
                    $delete
                  </v-icon>
                </v-chip>
              </template>
              <template v-slot:append><span></span></template>
            </v-combobox>
          </validation-provider>
        </form>
      </validation-observer>

      <v-expand-transition>
        <v-btn color="primary primarytext--text" @click="submitCoupon" v-show="checkoutStep < ECheckoutSteps.SubmitPayment" :disabled="!couponCode || checkoutStep === ECheckoutSteps.SubmitPayment">ADD</v-btn>
      </v-expand-transition>
      <v-expand-transition>
        <span class="coupon-note" v-show="checkoutStep === ECheckoutSteps.SubmitPayment">
          * Applying Coupon is not available during submitting payment.
          You may go back to the previous step and apply coupon.
        </span>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ECheckoutSteps from '@/enum/ECheckoutSteps'
import '@/assets/css/subtotal/subtotal.less'

export default {
  name: 'SummaryPanel',
  props: {
    checkoutCart: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...(mapState({
      checkoutStep: (state) => state.checkout.checkoutStep,
      selectedPaymentSummary: (state) => state.checkout.selectedPaymentSummary
    }))
  },
  data: () => ({
    couponCode: null,
    isCheckingCoupon: false,
    couponInvalid: true,
    ECheckoutSteps
  }),
  methods: {
    ...mapActions({
      getCheckoutCartSubtotal: 'checkout/getCheckoutCartSubtotal',
      addDiscount: 'checkout/addDiscount',
      removeDiscount: 'checkout/removeDiscount'
    }),
    computePrice(item) {
      return (item.amount * item.variant.price / 100).toFixed(2)
    },
    async submitCoupon() {
      const inputCode = this.couponCode
      const isValid = await this.$refs.couponObserver.validate()
      console.log('isValid', isValid, inputCode)
      if (inputCode && !this.isCheckingCoupon) {
        console.log('send')
        this.isCheckingCoupon = true
        await this.addDiscount(inputCode)
          .then((data) => {
            this.$dialog.notify.success('Successfully added Coupon', {
              position: 'down-left'
            })
          })
          .catch((error) => {
            console.log('error catch', error)
            const res = error.response.data
            this.$dialog.notify.error(res.error, {
              position: 'down-left'
            })
          })
        await this.getCheckoutCartSubtotal()
          .catch(console.error)
        this.couponCode = null
        this.isCheckingCoupon = false
      }
    },
    testEvent() {
      console.log('testEvent emitted')
    },
    async deleteItem(attrs, item) {
      this.isCheckingCoupon = true
      await this.removeDiscount([item.discountId]).catch(console.error)
      await this.getCheckoutCartSubtotal().catch(console.error)
      this.isCheckingCoupon = false
    }
  }
}
</script>

<style lang="less">
.coupon-note{
  font-size: 13px;
  text-align: left;
  display: block;
  margin: 9px 0 0;
}

.summary-panel, .coupon-panel{
  padding: 30px;
  margin-bottom: 15px;
}

.original-price{
  display: block;
}
</style>
