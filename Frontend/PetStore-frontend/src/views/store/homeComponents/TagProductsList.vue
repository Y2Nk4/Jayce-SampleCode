<template>
  <div class="home-page-section home-type-section web-container">
    <section-title>
      {{ title || (tagInfo ? tagInfo.name : null) }}
    </section-title>

    <products-list :products="products" as-component/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ProductsList from './ProductsList.vue'
import SectionTitle from './SectionTitle.vue'

export default {
  name: 'TagProductsList',
  components: {
    ProductsList, SectionTitle
  },
  props: {
    title: {
      type: String,
      required: true
    },
    tagId: {
      type: Number,
      required: true
    }
  },
  methods: {
    ...mapActions({
      getProductByType: 'product/getProductByType'
    })
  },
  data: () => ({
    products: [],
    tagInfo: {}
  }),
  async mounted() {
    const result = await this.getProductByType({
      tagId: this.tagId,
      size: 5
    }).catch(() => null)
    console.log('result', result)
    this.products = result.dataRows
    this.tagInfo = result.tagInfo
  }
}
</script>

<style scoped>

</style>
