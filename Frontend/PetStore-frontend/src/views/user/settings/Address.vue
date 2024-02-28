<template>
  <div class="order-card">
    <h2>Address Book</h2>

    <div>
      <v-btn color="primary" @click="addAddress">Add Address</v-btn>
    </div>

    <div>
      <h3 class="title">Shipping Addresses</h3>
      <v-row
        class="mb-6"
        no-gutters
      >
        <template  v-for="address in addresses">
          <v-col
            md="4"
            :key="address.id"
            v-if="address.addressType === EAddressTypes.SHIPPING || address.addressType === EAddressTypes.BOTH">
            <address-card
              :address="address"
              @edit="editAddress"
              @delete="deleteClicked"
            />
          </v-col>
        </template>
      </v-row>

      <h3 class="title">Billing Addresses</h3>
      <v-row
        class="mb-6"
        no-gutters
      >
        <template v-for="address in addresses">
          <v-col
            md="4"
            :key="address.id"
            v-if="address.addressType === EAddressTypes.BILLING || address.addressType === EAddressTypes.BOTH"
          >
            <address-card
              :address="address"
              @edit="editAddress"
              @delete="deleteClicked"
            />
          </v-col>
        </template>
      </v-row>
    </div>
    <v-dialog
      v-model="showEditDialog"
      max-width="390"
    >
      <v-card class="edit-address-card">
        <h3>Edit Address</h3>
        <address-form :form="editingAddress" @submit="submitEditAddress" hideSave/>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showAddDialog"
      max-width="390"
    >
      <v-card class="edit-address-card">
        <h3>Add a new Address</h3>
        <address-form submitButton="ADD NEW" @submit="submitNewAddress" show-type hide-save/>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="removeDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title>Delete the address?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color=""
            text
            @click="removeDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            text
            @click="deleteAddress"
          >
            <span style="font-weight: 800">Yes</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AddressCard from '@/components/AddressCard.vue'
import AddressForm from '@/components/AddressForm.vue'
import EAddressTypes from '@/enum/EAddressTypes'
import addressApi from '@/api/address'

export default {
  name: 'Address',
  components: {
    AddressCard,
    AddressForm
  },

  computed: {
    ...(mapState({
      addresses: (state) => state.user.addresses
    }))
  },
  data: () => ({
    EAddressTypes,
    showEditDialog: false,
    showAddDialog: false,
    removeDialog: false,
    editingAddress: {},
    addressForDel: {}
  }),
  methods: {
    ...(mapActions({
      getUserAddresses: 'user/getUserAddresses'
    })),
    editAddress(address) {
      this.showEditDialog = true
      this.editingAddress = address
      console.log('editAddress emit', address)
    },
    async submitEditAddress(address) {
      this.$store.commit('common/SHOW_LOADING_OVERLAY')
      await addressApi.editAddress(address.id, address).catch(console.log)
      await this.getUserAddresses()
      this.$store.commit('common/HIDE_LOADING_OVERLAY')
      this.showEditDialog = false
    },
    async deleteClicked(address) {
      this.addressForDel = address
      this.removeDialog = true
    },
    async deleteAddress() {
      this.$store.commit('common/SHOW_LOADING_OVERLAY')
      const response = await addressApi.deleteAddress(this.addressForDel.id)
      if (response && response.data.success) {
        this.$dialog.notify.info('The address successfully deleted', {
          position: 'top-right'
        })
      } else {
        this.$dialog.notify.warning('We currently encounter a problem', {
          position: 'top'
        })
      }
      this.removeDialog = false
      this.$store.commit('common/HIDE_LOADING_OVERLAY')
    },
    async addAddress() {
      this.showAddDialog = true
    },
    async submitNewAddress(address) {
      this.$store.commit('common/SHOW_LOADING_OVERLAY')
      const response = await addressApi.addAddress(address, address.addressType)
      if (response && response.data.success) {
        this.$dialog.notify.info('The address successfully added', {
          position: 'top-right'
        })
      } else {
        this.$dialog.notify.warning('We currently encounter a problem', {
          position: 'top'
        })
      }
      this.removeDialog = false
      this.$store.commit('common/HIDE_LOADING_OVERLAY')
    }
  },

  async mounted() {
    this.$store.commit('common/SHOW_LOADING_OVERLAY')
    await this.getUserAddresses()
    this.$store.commit('common/HIDE_LOADING_OVERLAY')
  }
}
</script>

<style lang="less" scoped>
.title{
  margin: 20px 0 10px;
}
.edit-address-card{
  padding: 20px;
}
</style>
