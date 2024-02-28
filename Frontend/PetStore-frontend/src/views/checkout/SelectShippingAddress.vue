<template>
  <div class="select-address-panel">
    <v-expansion-panel-header>
      <template v-slot:default="{ open }">
        <v-row no-gutters>
          <v-col cols="4">
            Shipping Address
          </v-col>
          <v-col cols="8">
            <v-fade-transition leave-absolute>
            <span v-if="!open && checkoutCart.shippingAddress">
              {{ checkoutCart.shippingAddress.firstName }} {{ checkoutCart.shippingAddress.lastName }}, {{ checkoutCart.shippingAddress.address1 }}, {{ checkoutCart.shippingAddress.city }}, {{ checkoutCart.shippingAddress.state }}, {{ checkoutCart.shippingAddress.zipCode }}
            </span>
            </v-fade-transition>
          </v-col>
        </v-row>
      </template>
      <template v-slot:actions>
        <div v-if="checkoutStep > ECheckoutSteps.ConfirmShippingAddress">
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
        <v-radio-group class="address-selector-radio" v-model="shippingAddressSelector" @change="showEditFields=false">
          <v-radio
              v-for="(address, index) in shippingAddresses"
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
            <address-form v-show="shippingAddressSelector === -1" submitButton="ADD NEW" @submit="submitNewAddress"/>
          </v-expand-transition>
          <v-expand-transition>
            <address-form
                v-show="shippingAddressSelector !== -1"
                submitButton="UPDATE & USE THIS"
                @submit="submitExistedAddress"
                :form="shippingAddresses[shippingAddressSelector]"
                :showForm="showEditFields"
                verify
                hide-save/>
          </v-expand-transition>
        </div>
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
  name: 'SelectShippingAddress',
  props: {
    checkoutCart: {
      type: Object
    }
  },
  components: {
    AddressForm
  },
  data: () => ({
    shippingAddressSelector: 0,
    showEditFields: false,
    ECheckoutSteps
  }),
  computed: {
    ...(mapState({
      checkoutStep: (state) => state.checkout.checkoutStep,
      shippingAddresses: (state) => state.user.shippingAddresses
    }))
  },
  methods: {
    ...(mapActions({
      updateShippingAddress: 'checkout/updateShippingAddress',
      getUserAddresses: 'user/getUserAddresses',
      getCheckoutCartSubtotal: 'checkout/getCheckoutCartSubtotal'
    })),
    async submitExistedAddress(address, saveThisAddress) {
      this.$store.commit('common/SHOW_LOADING_OVERLAY')
      if (saveThisAddress) addressApi.editAddress(address.id, address).catch(console.log)
      await this.updateShippingAddress(address).catch(console.log)

      await this.getCheckoutCartSubtotal().catch(console.log)
      this.$store.commit('common/HIDE_LOADING_OVERLAY')
      this.$emit('nextStep')
    },
    async submitNewAddress(address, saveThisAddress) {
      // eslint-disable-next-line no-param-reassign
      address.country = 'US'
      // eslint-disable-next-line no-param-reassign
      address.addressType = EAddressTypes.SHIPPING

      this.$store.commit('common/SHOW_LOADING_OVERLAY')
      await this.updateShippingAddress(address).catch(console.log)
      if (saveThisAddress) addressApi.addAddress(address).catch(console.log)

      await this.getCheckoutCartSubtotal().catch(console.log)
      this.$store.commit('common/HIDE_LOADING_OVERLAY')
      this.$emit('nextStep')
    }
  },
  async mounted() {
    await this.getUserAddresses()
    if (this.shippingAddresses.length <= 0) this.shippingAddressSelector = -1
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
