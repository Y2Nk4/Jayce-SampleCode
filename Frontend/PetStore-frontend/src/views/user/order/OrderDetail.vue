<template>
  <div class="order-detail">
    <div class="order-detail-card" v-if="orderDetail">
<!--      <h2>Order Detail</h2>-->
      <h2 class="order-number">Order #{{ orderDetail.id }}</h2>

      <div class="d-flex flex-row justify-space-between">
        <div class="d-flex">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
            <span
              v-bind="attrs"
              v-on="on"
            >Placed on {{ new Date(orderDetail.paidAt).toLocaleDateString('en-us', { year:"numeric", day:"numeric", month:"short"}) }}</span>
                </template>
                <span>{{ new Date(orderDetail.paidAt) }}</span>
          </v-tooltip>

          <v-divider
            class="inline-divider"
            vertical
          ></v-divider>
          <div class="d-flex">
            {{ EUserOrderStatus[orderDetail.status] }}
          </div>
        </div>
        <div class="d-flex">
          <v-btn color="mint" small>Contact US</v-btn>
        </div>
      </div>

      <div class="order-items">
        <h3>Items</h3>
        <v-simple-table class="order-items-table">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">
                Product
              </th>
              <th class="text-left">
                Quantity
              </th>
              <th class="text-left">
                Subtotal
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="item in orderDetail.items"
                :key="item.id"
            >
              <td class="d-flex align-center" style="height: auto;">
                <div class="product-image-wrapper">
                  <img
                      class="product-image"
                      :src="item.variantImage ? item.variantImage.imageLink : item.productImage.imageLink"
                      :alt="item.variantImage ? item.variantImage.title : item.productImage.title">
                </div>
                <div class="product-name">
                  <span>{{ item.variant.product.title }}</span>
                  <br>
                  <span>Option: {{ item.variant.skuName }}</span>
                </div>
              </td>
              <td>{{ item.amount }}</td>
              <td>${{ (item.totalPrice/100).toFixed(2) }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>

        <div class="d-flex flex-row">
          <v-col cols="3">
            <div>
              <h3>Billing Information</h3>
              <div class="address-block">
                <p style="font-weight: bold">{{ billingAddress.firstName }} {{billingAddress.lastName}}</p>
                <p>{{ billingAddress.address1 }}</p>
                <p>{{ billingAddress.address2 }}</p>
                <p>{{ billingAddress.city }}, {{ billingAddress.state }} {{ billingAddress.zipCode }}, {{ billingAddress.country }}</p>
                <p>{{ billingAddress.phone }}</p>
              </div>
            </div>
          </v-col>
          <v-spacer/>
          <div class="subtotal-table">
            <div class="subtotal-row">
              <div class="cart-item-title" >
                <p>Item(s):</p>
              </div>
              <div class="cart-item-amount">
                <span>
                  ${{ (orderDetail.payment.itemTotal/100).toFixed(2) }}
                </span>
              </div>
            </div>
            <div class="subtotal-row">
              <div class="cart-item-title" >
                <p>Tax:</p>
              </div>
              <div class="cart-item-amount">
                <span>
                  ${{ (orderDetail.payment.taxTotal/100).toFixed(2) }}
                </span>
              </div>
            </div>
            <div class="subtotal-row">
              <div class="cart-item-title" >
                <p>Shipping:</p>
              </div>
              <div class="cart-item-amount">
                <span>
                  ${{ (orderDetail.payment.shippingRate/100).toFixed(2) }}
                </span>
              </div>
            </div>
            <v-divider/>
            <div class="subtotal-row">
              <div class="cart-item-title" >
                <p>Grand Total:</p>
              </div>
              <div class="cart-item-amount">
                <span>${{ (orderDetail.payment.grandTotal/100).toFixed(2) }}</span>
              </div>
            </div>
            <div class="subtotal-row">
              <div class="cart-item-title" >
                <p>Paid:</p>
              </div>
              <div class="cart-item-amount">
                <span>
                  ${{ (orderDetail.payment.paymentAmount/100).toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <v-row no-gutters>
        <v-col cols="3">
          <div>
            <h3>Delivery Instruction</h3>
            <div class="address-block">
              <p style="font-weight: bold">{{ shippingAddress.firstName }} {{shippingAddress.lastName}}</p>
              <p>{{ shippingAddress.address1 }}</p>
              <p>{{ shippingAddress.address2 }}</p>
              <p>{{ shippingAddress.city }}, {{ shippingAddress.state }} {{ shippingAddress.zipCode }}, {{ shippingAddress.country }}</p>
              <p>{{ shippingAddress.phone }}</p>
            </div>
          </div>
        </v-col>
      </v-row>

      <div class="shipping-status">
        <h3>Shipping Status</h3>
        <h4>Carrier: USPS, Tracking Number: 123131312312312322</h4>

        <v-stepper
            v-model="shippingStatus"
            class="shipping-stepper"
            vertical
        >
          <v-stepper-step
              :complete="shippingStatus >= 0"
              step="0"
          >
            Order Placed
            <small>{{ new Date(orderDetail.paidAt) }}</small>
          </v-stepper-step>

          <v-stepper-content step="0">
            <h5>We are preparing your order for shipping.</h5>
          </v-stepper-content>

          <v-stepper-step
              :complete="shippingStatus >= 1"
              step="1"
          >
            Label Created
          </v-stepper-step>

          <v-stepper-content step="1">
            <h5>A shipping label has been created and it will be handed to carrier soon.</h5>
          </v-stepper-content>

          <v-stepper-step
              :complete="shippingStatus >= 2"
              step="2"
          >
            In Transit
          </v-stepper-step>

          <v-stepper-content step="2">
            <h5>We had already handed your package to the carrier.</h5>
          </v-stepper-content>

          <v-stepper-step
              :complete="shippingStatus > 3"
              step="3"
          >
            Out for Delivery
          </v-stepper-step>

          <v-stepper-content step="3">
            <h5>The carrier is heading up to the shipping address.</h5>
          </v-stepper-content>

          <v-stepper-step step="4">
            Delivered
          </v-stepper-step>
          <v-stepper-content step="4">
            <h5>The order has already been handed to you!</h5>
          </v-stepper-content>
        </v-stepper>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import EUserOrderStatus from '@/enum/EUserOrderStatus'
import EAddressTypes from '@/enum/EAddressTypes'
import '@/assets/css/subtotal/subtotal.less'

export default {
  name: 'OrderDetail',
  props: {
    orderId: {
      required: true
    }
  },
  data: () => ({
    EUserOrderStatus,

    shippingAddress: {},
    billingAddress: {},
  }),
  computed: {
    ...(mapState({
      orderDetail: (state) => state.order.orderDetail,
      addresses: (state) => state.order.addresses
    })),
    shippingStatus() {
      return this.orderDetail.logistics ? this.orderDetail.logistics.status : 0
    }
  },
  methods: {
    ...(mapActions({
      getOrderDetail: 'order/getOrderDetail',
      getOrderAddresses: 'order/getOrderAddresses'
    }))
  },
  async mounted() {
    this.$store.commit('common/SHOW_LOADING_OVERLAY')
    await this.getOrderDetail(this.orderId).catch(console.log)
    await this.getOrderAddresses(this.orderId).catch(console.log)

    for (let i = 0; i < this.addresses.length; i += 1) {
      const address = this.addresses[i]
      if (address.addressType === EAddressTypes.SHIPPING) {
        this.shippingAddress = address
      } else if (address.addressType === EAddressTypes.BILLING) {
        this.billingAddress = address
      } else if (address.addressType === EAddressTypes.BOTH) {
        this.billingAddress = address
        this.shippingAddress = address
      }
    }
    this.$store.commit('common/HIDE_LOADING_OVERLAY')
  }
}
</script>

<style lang="less">
hr.inline-divider{
  margin: 0 10px;
}
.order-detail{
  .order-detail-card{
    padding: 10px 15px;
    border: solid 1px #efefef;
    border-radius: 10px;
    margin: 10px 0;

    div.address-block{
      margin-bottom: 20px;
      p{
        margin: 0
      }
    }
    .order-number{
      margin: 0 0 10px;
    }

    .order-items{
      margin-bottom: 25px;

      .product-name{
        text-align: left;
      }

      .order-items-table{
        margin-bottom: 10px;

        tr{
          padding: 5px 0;
        }
        td{
          text-align: center;
        }
      }

      .product-image-wrapper{
        display: inline-block;
        position: relative;
        height: 100px;
        width: 100px;
        padding: 10px;
        text-align: center;

        img.product-image{
          height: 100%;
        }
      }
    }

    .subtotal-table{
      width: 11em;

      .subtotal-row:not(.sub-item):not(.sec-sub-item) {
        margin: 2px 0;
      }
      .v-divider{
        margin: 3px 0;
      }
    }

    .v-stepper.shipping-stepper{
      box-shadow: none;

      .v-stepper__label{
        text-align: center;

        small{
          margin-top: 4px;
        }
      }
      .v-stepper__content {
        padding: 4px 60px 4px 23px;
        width: auto;
      }
    }
  }
}
</style>
