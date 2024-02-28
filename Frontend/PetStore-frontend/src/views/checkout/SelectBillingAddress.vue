<template>
  <div class="select-address-panel">
    <v-expansion-panel-header>
      <template v-slot:default="{ open }">
        <v-row no-gutters>
          <v-col cols="4">
            Billing Address
          </v-col>
          <v-col cols="8">
            <v-fade-transition leave-absolute>
            <span v-if="!open && checkoutCart && !checkoutCart.differentBillingAddress && checkoutCart.shippingAddress">
              Same as Shipping Address
            </span>
            <span v-if="!open && checkoutCart && checkoutCart.differentBillingAddress && checkoutCart.billingAddress">
              {{ checkoutCart.billingAddress.firstName }} {{ checkoutCart.billingAddress.lastName }}, {{ checkoutCart.billingAddress.address1 }}, {{ checkoutCart.billingAddress.city }}, {{ checkoutCart.billingAddress.state }}, {{ checkoutCart.billingAddress.zipCode }}
            </span>
            </v-fade-transition>
          </v-col>
        </v-row>
      </template>
      <template v-slot:actions>
        <div v-if="checkoutStep > ECheckoutSteps.ConfirmBillingAddress">
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
      <div class="address-selector">
        <v-expand-transition>
          <div v-if="!differentBillingAddress && checkoutCart.shippingAddress" v-show="!differentBillingAddress">
            Same As Shipping Address: <br>
            {{ checkoutCart.shippingAddress.firstName }} {{ checkoutCart.shippingAddress.lastName }}, {{ checkoutCart.shippingAddress.address1 }}, {{ checkoutCart.shippingAddress.city }}, {{ checkoutCart.shippingAddress.state }}, {{ checkoutCart.shippingAddress.zipCode }}
          </div>
        </v-expand-transition>
        <v-checkbox
            v-model="differentBillingAddress"
            label="Use Different Billing Address"
        ></v-checkbox>

        <v-btn color="primary primarytext--text" @click="useCurrentShippingAddress" v-show="!differentBillingAddress">continue</v-btn>

        <v-expand-transition>
          <div v-show="differentBillingAddress">
            <v-radio-group class="address-selector-radio" v-model="billingAddressSelector">
              <v-radio
                  v-for="(address, index) in billingAddresses"
                  :key="index"
                  :value="index"
              >
                <template v-slot:label>
                  {{address.firstName}} {{address.lastName}}, {{address.address1}}, {{address.city}}, {{address.state}}, {{address.zipCode}}

                  <button class="edit-address-btn primary--text" @click="showEditFields=true">Edit</button>
                </template>
              </v-radio>
              <v-radio :key="-1" label="New Address" :value="-1"></v-radio>
            </v-radio-group>
            <div>
              <v-expand-transition>
                <address-form v-show="billingAddressSelector === -1" submitButton="ADD NEW"/>
              </v-expand-transition>
              <v-expand-transition>
                <address-form
                    v-show="billingAddressSelector !== -1"
                    submitButton="UPDATE & USE THIS"
                    @submit="submitExistedAddress"
                    :form="billingAddresses[billingAddressSelector]"
                    :show-form="showEditFields"
                    hide-save />
              </v-expand-transition>
            </div>
          </div>
        </v-expand-transition>
      </div>
    </v-expansion-panel-content>
  </div>
</template>

<script>
import addressApi from '@/api/address'
import AddressForm from '@/components/AddressForm.vue'
import { mapActions, mapState } from 'vuex'
import EAddressTypes from '../../enum/EAddressTypes'
import ECheckoutSteps from '../../enum/ECheckoutSteps'

export default {
  name: 'SelectBillingAddress',
  props: {
    checkoutCart: {
      type: Object
    }
  },
  components: {
    AddressForm
  },
  computed: {
    ...(mapState({
      checkoutStep: (state) => state.checkout.checkoutStep,
      billingAddresses: (state) => state.user.billingAddresses,
    }))
  },
  data: () => ({
    billingAddressSelector: 0,
    differentBillingAddress: false,
    showEditFields: false,
    ECheckoutSteps
  }),
  methods: {
    ...(mapActions({
      updateBillingAddress: 'checkout/updateBillingAddress',
      getShippingRate: 'checkout/getShippingRate',
      getUserAddresses: 'user/getUserAddresses',
      getCheckoutCartSubtotal: 'checkout/getCheckoutCartSubtotal'
    })),
    async useCurrentShippingAddress() {
      if (!this.differentBillingAddress) {
        this.$store.commit('common/SHOW_LOADING_OVERLAY')
        await this.updateBillingAddress({ differentBillingAddress: false })
        this.$store.commit('common/HIDE_LOADING_OVERLAY')

        await this.nextStep()
      }
    },
    async submitExistedAddress(address, saveThisAddress) {
      console.log('submit', JSON.parse(JSON.stringify(address)))

      if (this.differentBillingAddress) {
        this.$store.commit('common/SHOW_LOADING_OVERLAY')
        await this.updateBillingAddress({
          differentBillingAddress: true,
          address
        })

        if (saveThisAddress) await addressApi.editAddress(address.id, address).catch(console.log)
        await this.getCheckoutCartSubtotal()

        this.$store.commit('common/HIDE_LOADING_OVERLAY')

        await this.nextStep()
      }
    },
    async submitNewAddress(address, saveThisAddress) {
      if (this.differentBillingAddress) {
        // eslint-disable-next-line no-param-reassign
        address.country = 'US'
        // eslint-disable-next-line no-param-reassign
        address.addressType = EAddressTypes.SHIPPING

        console.log('submit', address)
        this.$store.commit('common/SHOW_LOADING_OVERLAY')

        await this.updateBillingAddress({
          differentBillingAddress: 1,
          ...address
        })

        if (saveThisAddress) await addressApi.addAddress(address).catch(console.log)
        await this.getCheckoutCartSubtotal()

        this.$store.commit('common/HIDE_LOADING_OVERLAY')

        await this.nextStep()
      }
    },

    async nextStep() {
      this.$store.commit('common/SHOW_LOADING_OVERLAY')
      await this.getShippingRate()
      this.$store.commit('common/HIDE_LOADING_OVERLAY')
      this.$emit('nextStep')
    }
  },
  async mounted() {
    await this.getUserAddresses()
    if (this.billingAddresses.length <= 0) this.billingAddressSelector = -1
  }
}
</script>

<style scoped lang="less">
.select-address-panel{
  h3.panel-title{

  }
}
.address-selector{
  padding: 10px;

  .address-selector-radio{
    margin-top: 0;
  }
}
button.edit-address-btn{
  margin-left: 10px;
  transition: all 0.1s ease-in-out;

  &:hover{
    opacity: 0.8;
  }
}
</style>
