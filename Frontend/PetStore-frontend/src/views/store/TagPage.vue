<template>
  <div>
    <common-header/>

    <v-sheet class="tag-title-wrapper d-flex flex-column align-center justify-center" :color="page_theme_color || 'primary'">
      <h2 class="tag-title">
        {{ tagInfo.name }}
      </h2>
      <p class="tag-description">{{ tagInfo.description }}</p>
    </v-sheet>

    <div class="web-container tag-products-page">
      <div style="margin-bottom: 20px;">
        <span class="title-sub-title">
          ({{ (currentPage-1)*pageSize + 1 }} - {{ currentPage*pageSize }} of {{ totalCount }} items)
        </span>
      </div>
      <v-row>
        <v-col
          v-for="(item, index) in productLists"
          :key="index"
          col="4" md="3" lg="2">
          <product-card :item="item"></product-card>
        </v-col>
      </v-row>

      <v-pagination
          v-model="currentPage"
          :length="totalPage"
          @input="getTagProducts"
          circle
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import CommonHeader from '@/views/common/Header.vue'
import ProductCard from '@/components/ProductCard.vue'
import { mapActions } from 'vuex'

export default {
  name: 'TagPage',
  components: {
    CommonHeader, ProductCard
  },
  props: {
    tagId: {
      required: true
    }
  },
  data: () => ({
    productLists: [],
    tagInfo: {},
    totalPage: 0,
    currentPage: 1,
    pageSize: 20,
    totalCount: 0
  }),
  methods: {
    ...mapActions({
      getProductByType: 'product/getProductByType'
    }),
    async getTagProducts() {
      this.$store.commit('common/SHOW_LOADING_OVERLAY')
      const result = await this.getProductByType({
        tagId: this.tagId,
        size: this.pageSize,
        page: this.currentPage
      }).catch(() => {
        this.$router.push({
          name: 'notFoundPage'
        })
      })
      this.$store.commit('common/HIDE_LOADING_OVERLAY')
      if (result) {
        this.tagInfo = result.tagInfo
        if (this.tagInfo && this.tagInfo.custom_link && this.tagInfo.custom_link !== this.tagId) {
          this.$router.replace({
            params: { tagId: this.tagInfo.custom_link }
          })
        }
        this.productLists = result.dataRows
        this.totalPage = Math.ceil(result.pagination.total / result.pagination.size)
        this.totalCount = result.pagination.total
        this.currentPage = result.pagination.page
      }
    }
  },
  async mounted() {
    await this.getTagProducts()
    document.title = `Tag: ${this.tagInfo.name} - PawPose`
  },
}
</script>

<style scoped lang="less">
.tag-title-wrapper{
  min-height: 200px;
  width: 100%;
  text-align: center;
  margin-bottom: 20px;

  .tag-title{
    margin: 0 0 10px;
  }
  .tag-description{
    max-width: 50em;
  }
}

.tag-products-page{
  margin: 0 0 20px;
  .title-sub-title{
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
