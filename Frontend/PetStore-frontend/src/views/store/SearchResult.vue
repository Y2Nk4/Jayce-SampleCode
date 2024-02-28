<template>
  <div>
    <common-header></common-header>

    <div class="web-container search-results">
      <h1>Search: {{ keyword }}</h1>

      <template v-if="searchResult && searchResult.length > 0">
        <v-row no-gutters>
          <v-col class="search-item-col" v-for="(item, index) in searchResult" :key="'item-' + index" cols="3">
            <product-card :item="item"></product-card>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <not-found/>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import NotFound from '@/components/NotFound.vue'
import ProductCard from '@/components/ProductCard.vue'
import CommonHeader from '../common/Header.vue'

export default {
  name: 'SearchResult',
  components: {
    CommonHeader, NotFound, ProductCard
  },
  methods: {
    ...(mapActions({
      searchProducts: 'store/searchProducts'
    })),
    async updateSearch() {
      this.$store.commit('common/SHOW_LOADING_OVERLAY')
      this.searchResult = await this.searchProducts(this.keyword)
      this.$store.commit('common/HIDE_LOADING_OVERLAY')
    }
  },
  data: () => ({
    searchResult: [],
    keyword: ''
  }),
  async mounted() {
    this.keyword = this.$route.query.keyword
    if (this.keyword) {
      await this.updateSearch()
    } else {
      this.$router.push({
        name: 'Home'
      })
    }
  },
  watch: {
    async $route(to) {
      if (to.query.keyword !== this.keyword) {
        this.keyword = to.query.keyword
        await this.updateSearch()
      }
    }
  }
}
</script>

<style lang="less">
.search-results{
  margin-top: 10px;

  .search-item-col{
    margin: 10px;
  }
}
</style>
