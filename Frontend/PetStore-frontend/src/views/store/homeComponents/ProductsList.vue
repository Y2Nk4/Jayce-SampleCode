<template>
  <div :class="`${!asComponent ? 'home-page-section home-type-section web-container' : ''} products-list`">
    <h3 class="page-title" v-if="title">
      {{ title }}
    </h3>
    <a class="orange--text text--lighten-1" @click="$router.push({})">
      <p>View All {{ title }} products</p>
    </a>
    <div>
      <v-row>
        <v-col
          class="product-item-col"
          v-for="(item, index) in products"
          :key="index"
          cols="6" md="4" lg="2" xs="6">
          <product-card :item="item"/>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import ProductCard from '@/components/ProductCard.vue'

export default {
  name: 'ProductsList',
  components: {
    ProductCard
  },
  props: {
    asComponent: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
    },
    products: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="less">
.product-item-col{
  .item-card{
    height: 100%;
  }
}
</style>
