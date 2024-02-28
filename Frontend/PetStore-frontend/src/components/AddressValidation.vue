<template>
  <div>
    <v-dialog
      v-model="showRevisionDialog"
      width="450"
    >
      <v-card class="revision-dialog-card">
        <h3 class="dialog-title">Revision on your Address</h3>
        <span class="dialog-title">Use the recommended address from USPS?</span>
        <v-divider/>

        <div class="address-revision-form">
          <v-row>
            <v-col class="revision-column">
              <h4>Current</h4>
              <h3>{{ inputAddress.firstName }} {{ inputAddress.lastName }}</h3>
              <p>{{ inputAddress.company }}</p>
              <p>{{ inputAddress.phone }}</p>
              <p>{{ inputAddress.address1 }}</p>
              <p>{{ inputAddress.address2 }}</p>
              <p>{{ inputAddress.city }} {{inputAddress.zipCode}}, {{inputAddress.state}}</p>
            </v-col>
            <v-col class="revision-column">
              <h4>USPS Verified</h4>
              <h3>{{ inputAddress.firstName }} {{ inputAddress.lastName }}</h3>
              <p>{{ inputAddress.company }}</p>
              <p>{{ inputAddress.phone }}</p>
              <p :style="{color: (result.recommendedAddress.address1 !== inputAddress.address1) ? 'red' : undefined}">
                {{ result.recommendedAddress.address1 }}
              </p>
              <p :style="{color: (result.recommendedAddress.address2 !== inputAddress.address2) ? 'red' : undefined}">
                {{ result.recommendedAddress.address2 }}
              </p>
              <p>
                <span :style="{color: (result.recommendedAddress.city !== inputAddress.city) ? 'red' : undefined}">
                  {{ result.recommendedAddress.city }}
                </span>
                <span :style="{color: (result.recommendedAddress.zipCode !== inputAddress.zipCode) ? 'red' : undefined}">
                  {{result.recommendedAddress.zipCode}}
                </span>,
                <span :style="{color: (result.recommendedAddress.state !== inputAddress.state) ? 'red' : undefined}">
                  {{result.recommendedAddress.state}}
                </span></p>
            </v-col>
          </v-row>
        </div>
        <div class="description" v-if="result.description && result.description !== ''">
          <span>{{ result.description }}</span>
          <v-divider/>
        </div>
        <div class="dialog-control">
          <v-btn color="primary" @click="useRecommended">Use Recommended Address</v-btn>
          <v-btn @click="keepCurrent">Use Current Address</v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog
      width="450"
      v-show="result.result === EAddressValidationResult.RevisionRequired"
      v-model="showWarningDialog">
      <v-card class="revision-dialog-card">
        <h3 class="dialog-title">{{ result.description }}</h3>

        <div class="dialog-control">
          <v-btn @click="showWarningDialog = false">Edit My Address</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import addressApi from '@/api/address'
import EAddressValidationResult from '@/enum/EAddressValidationResult'

export default {
  name: 'AddressValidation',
  data: () => ({
    showRevisionDialog: false,
    showWarningDialog: false,
    inputAddress: {},
    result: {
      recommendedAddress: {}
    },
    EAddressValidationResult
  }),
  methods: {
    async verify(address) {
      this.$store.commit('common/SHOW_LOADING_OVERLAY')
      this.inputAddress = address
      const response = await addressApi.verifyAddress(address)
      this.result = response.data.data
      this.$store.commit('common/HIDE_LOADING_OVERLAY')
      if (this.result.result === EAddressValidationResult.RevisionRequired) {
        this.showWarningDialog = true
      } else {
        if (this.result.result === EAddressValidationResult.Good) {
          const recommend = [
            this.result.recommendedAddress.address1,
            this.result.recommendedAddress.address2,
            this.result.recommendedAddress.city,
            this.result.recommendedAddress.state,
            this.result.recommendedAddress.zipCode
          ]
          const input = [
            this.inputAddress.address1,
            this.inputAddress.address2,
            this.inputAddress.city,
            this.inputAddress.state,
            this.inputAddress.zipCode,
          ]
          if (input.join(':') === recommend.join(':')) {
            this.$emit('passed', Object.assign(this.inputAddress, this.result.recommendedAddress))
            return
          }
        }
        this.showRevisionDialog = true
      }
    },
    async useRecommended() {
      this.showRevisionDialog = false
      const passedAddress = Object.assign(this.inputAddress, this.result.recommendedAddress)
      this.$emit('passed', passedAddress)
    },
    async keepCurrent() {
      this.showRevisionDialog = false
      this.$emit('passed', this.inputAddress)
    }
  }
}
</script>

<style lang="less" scoped>
.revision-dialog-card{
  padding: 20px 30px;

  .v-divider{
    margin: 10px 0;
  }

  .dialog-title{
    text-align: center;
    display: block;
  }

  .dialog-control{
    display: flex;
    flex-direction: column;
    margin-top: 1em;

    button{
      margin: 5px 0;
    }
  }

  .description{
    margin-top: 1.5em;
  }
}
.address-revision-form{
  .revision-column.col{
    p{
      margin: 0;
    }
  }
}
</style>
