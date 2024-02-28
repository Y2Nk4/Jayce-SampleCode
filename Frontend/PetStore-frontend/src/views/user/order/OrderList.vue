<template>
  <div class="order-card">
    <h2>Orders</h2>

    <div class="orders">
      <div class="order" v-for="(order, index) in orderList" :key="index" @click="goToOrder(order)">
        <v-row class="header">
          <v-col cols="6">
            <v-row class="d-flex flex-row mb-6">
              <v-col class="header-item pa-2">
                <a @click="$router.push({ name: 'user.orderDetail', params: { orderId: order.id } })">
                  <h4>Order#{{ order.id }}</h4>
                </a>
              </v-col>
              <v-col class="header-item pa-2">
                {{ new Date(order.createdAt).toLocaleDateString('en-us', { year:"numeric", day:"numeric", month:"short"}) }}
              </v-col>
              <v-col class="header-item pa-2">
                <v-row>Total</v-row>
                <v-row>${{ order.amount / 100 }}</v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="order-item" v-for="(item, index) in order.items" :key="'item-' + index">
          <v-col class="item-img-col">
            <img class="order-item-img" :src="item.variantImage ? item.variantImage.imageLink : item.productImage.imageLink" alt="">
          </v-col>
          <v-col>
            <a @click="$router.push({ name: 'product.product-page', params: { productId: item.productId }, query: { variantId: item.variantId } })">
              <h3>{{ item.variant.product.title }}</h3>
            </a>
            <span>Option: {{ item.variant.skuName }}</span>
          </v-col>
        </v-row>

      </div>
    </div>
  </div>
</template>

<script>

import { mapActions, mapState } from 'vuex'

export default {
  name: 'Order',
  computed: {
    ...(mapState({
      orderList: (state) => state.order.orderList
    }))
  },
  methods: {
    ...(mapActions({
      getOrderList: 'order/getOrderList'
    })),

    goToOrder(order) {
      this.$router.push({ name: 'user.orderDetail', params: { orderId: order.id } })
    }
  },
  async mounted() {
    this.$store.commit('common/SHOW_LOADING_OVERLAY')
    await this.getOrderList()
    this.$store.commit('common/HIDE_LOADING_OVERLAY')
  }
}
</script>

<style lang="less">
  .order-card{
    padding: 10px;
  }

  .order{
    padding: 25px 15px;
    border: solid 1px #efefef;
    border-radius: 10px;
    margin: 10px 0;
    cursor: pointer;
  }
  .order-item{
    .item-img-col{
      max-width: 130px;
      text-align: center;
      height: 130px;
    }
    .order-item-img{
      height: 100px;
    }
  }

  .header-item{
    align-items: center;
    display: inline-flex;
    flex-direction: column;
  }
</style>
