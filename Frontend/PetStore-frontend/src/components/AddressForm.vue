<template>
  <div>
    <validation-observer
        ref="observer"
        v-slot="{ invalid }"
    >
      <v-expand-transition>
        <form @submit.prevent="submitForm" v-show="showForm">
        <div class="form-wrapper">
          <v-row class="form-row">
            <v-col>
              <validation-provider
                  v-slot="{ errors }"
                  name="form.firstName"
                  rules="required"
              >
                <v-text-field
                    class="auth-text-field"
                    v-model="form.firstName"
                    :error-messages="errors"
                    label="First Name"
                    required
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col>
              <validation-provider
                  v-slot="{ errors }"
                  name="form.lastName"
                  rules="required"
              >
                <v-text-field
                    class="auth-text-field"
                    v-model="form.lastName"
                    :error-messages="errors"
                    label="Last Name"
                    required
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>

          <v-row class="form-row">
            <v-col>
              <v-text-field
                  class="auth-text-field"
                  v-model="form.company"
                  label="Company (Optional)"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="form-row">
            <v-col>
              <validation-provider
                  v-slot="{ errors }"
                  name="form.address1"
                  rules="required"
              >
                <v-text-field
                    class="auth-text-field"
                    v-model="form.address1"
                    :error-messages="errors"
                    label="Address"
                    required
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row class="form-row">
            <v-col>
              <v-text-field
                  class="auth-text-field"
                  v-model="form.address2"
                  label="Apartment, suite, etc. (Optional)"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="form-row">
            <v-col>
              <validation-provider
                  v-slot="{ errors }"
                  name="form.city"
                  rules="required"
              >
                <v-text-field
                    class="auth-text-field"
                    v-model="form.city"
                    :error-messages="errors"
                    label="City"
                    required
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>

          <v-row class="form-row">
            <v-col>
              <validation-provider
                  v-slot="{ errors }"
                  name="form.city"
                  rules="required"
              >
                <v-select
                    v-model="form.state"
                    :items="stateAbbrItems"
                    item-text="name"
                    item-value="abbr"
                    :error-messages="errors"
                    label="State"
                    required
                    single-line
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col>
              <validation-provider
                  v-slot="{ errors }"
                  name="form.zipCode"
                  rules="required">
                <v-text-field
                    class="auth-text-field"
                    v-model="form.zipCode"
                    :error-messages="errors"
                    label="Zip Code"
                    required
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>

          <v-row class="form-row">
            <v-col>
              <validation-provider
                  v-slot="{ errors }"
                  name="form.phone"
                  rules="required">
                <v-text-field
                    class="auth-text-field"
                    v-model="form.phone"
                    :error-messages="errors"
                    label="Phone Number"
                    required
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>

          <v-row class="form-row" v-if="showType">
            <v-col>
              <v-radio-group v-model="form.addressType">
                <v-radio
                  :key="EAddressTypes.BOTH"
                  label="Shipping & Billing Address"
                  :value="EAddressTypes.BOTH"
                ></v-radio>
                <v-radio
                  :key="EAddressTypes.BILLING"
                  label="Shipping Address only"
                  :value="EAddressTypes.BILLING"
                ></v-radio>
                <v-radio
                  :key="EAddressTypes.SHIPPING"
                  label=" Billing Address only"
                  :value="EAddressTypes.SHIPPING"
                ></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row class="form-row" v-if="!hideSave">
            <v-col>
              <v-checkbox
                  v-model="saveThisAddress"
                  label="Save this address for future purchase"
              ></v-checkbox>
            </v-col>
          </v-row>
        </div>
      </form>
      </v-expand-transition>

      <v-btn
          class="auth-confirm-btn mr-4"
          type="submit"
          color="primary primarytext--text"
          @click="userSubmit"
      >
        {{ submitButton }}
      </v-btn>
    </validation-observer>

    <address-validation ref="address-validation" @passed="verifyPassed"/>
  </div>
</template>

<script>
import EStateAbbr from '@/enum/EStateAbbr'
import AddressValidation from '@/components/AddressValidation.vue'
import EAddressTypes from '@/enum/EAddressTypes'

export default {
  name: 'AddressForm',
  components: {
    AddressValidation
  },
  props: {
    form: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: () => ({
        addressType: EAddressTypes.BOTH
      })
    },
    showForm: {
      type: Boolean,
      default: true
    },
    submitButton: {
      type: String,
      default: 'update'
    },
    hideSave: {
      type: Boolean,
      default: false
    },
    verify: {
      type: Boolean,
      default: true
    },
    showType: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    invalid: false,
    stateAbbrItems: Object.keys(EStateAbbr.abbrToName).map((abbr) => ({
      name: EStateAbbr.abbrToName[abbr],
      abbr
    })),
    saveThisAddress: true,
    EAddressTypes
  }),
  methods: {
    userSubmit() {
      if (!this.verify) {
        this.$emit('submit', this.form, this.saveThisAddress)
      } else {
        this.$refs['address-validation'].verify(this.form)
      }
    },
    verifyPassed(verifiedAddress) {
      console.log(verifiedAddress)
      this.$emit('submit', verifiedAddress, this.saveThisAddress)
    }
  }
}
</script>

<style lang="less">
.row.form-row{
  margin-top: 0;

  .col{
    padding: 5px 12px;
  }
}
.form-wrapper{
  margin-bottom: 10px;
}
</style>
