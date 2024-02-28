<template>
  <div>
    <common-header></common-header>

    <div class="web-container product" v-if="!!productDetail">
      <div class="product-detail-row">
        <div class="product-detail-column" style="flex: 0 1 auto;">
          <image-displayer :images="images"></image-displayer>
        </div>
        <div class="product-detail-column" style="flex: 1 1 auto;width: 100%;">
          <div class="product-detail-box">
            <h3 style="width: 100%;">
              {{ productDetail.title }}
            </h3>
            <p class="secondary--text" v-if="productDetail.type">
              {{ productDetail.type.name }}
            </p>
            <v-divider></v-divider>

            <template v-if="productDetail.variants && productDetail.variants.length > 0">
              <div class="detail-section-box">
                <span class="variant-price">$ {{ formatPrice(productDetail.variants[showingVariant].price) }}</span>
                <template v-if="productDetail.variants[showingVariant].hasDiscount">
                  <span class="variant-normal-price">${{ formatPrice(productDetail.variants[showingVariant].normalPrice) }}</span>
                </template>
              </div>
              <div class="detail-section-box">
                <span class="field-title">Size:</span>
                <span>{{ productDetail.variants[showingVariant].skuName }}</span>
              </div>
              <div class="detail-section-box"
                   v-if="productDetail.variants[showingVariant].isTrackQuantity">
                <span class="field-title">Stock Quantity:</span>
                <span v-if="productDetail.variants[showingVariant].stockQuantity > 0">{{ productDetail.variants[showingVariant].stockQuantity }}</span>
                <span class="deep-orange--text" v-else>Out Of Stock</span>
              </div>
              <div class="detail-section-box">
                <v-btn
                  class="secondary--text"
                  :class="['variant-btn', showingVariant === i ? 'primary' : '']"
                  @click="changeSelectedVariant(i)"
                  v-for="(variant, i) in productDetail.variants"
                  :disabled="isPageLoading"
                  :key="i">
                  {{ variant.skuName }}
                </v-btn>
              </div>
              <div class="detail-section-box">
                <span class="field-title">Quantity:</span>

                <v-text-field
                  v-model="buyingAmount"
                  class="amount-field"
                  type="number"
                  min="1"
                  :disabled="isPageLoading || (productDetail.variants[showingVariant].isTrackQuantity && productDetail.variants[showingVariant].stockQuantity <= 0)"
                  hide-details
                  solo>
                </v-text-field>
              </div>

              <div class="detail-section-box">
                <v-btn
                  color="orange lighten-1 white--text"
                  v-if="productDetail.variants[showingVariant].status !== EProductVariantStatus.Normal"
                  disabled>
                  Not available
                </v-btn>
                <v-btn
                  v-else-if="productDetail.variants[showingVariant].isTrackQuantity && productDetail.variants[showingVariant].stockQuantity <= 0"
                  color="orange lighten-1 white--text"
                  disabled>
                  Not available
                </v-btn>
                <v-btn
                  v-else
                  color="orange lighten-1 white--text"
                  @click="addItemToCart"
                  :loading="isPageLoading">
                  Add to cart
                </v-btn>
              </div>
            </template>
            <template v-else>
              <p>This item is not available to purchase.</p>
            </template>
          </div>

        </div>
      </div>

      <div class="item-description">
        <h1>Description</h1>

        {{ productDetail.description }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ImageDisplayer from '@/components/ImageDisplayer.vue'
import EProductVariantStatus from '@/enum/EProductVariantStatus'
import CommonHeader from '../common/Header.vue'

export default {
  name: 'Product',
  components: {
    CommonHeader, ImageDisplayer
  },
  props: {
    productId: {
      required: true
    }
  },
  data: () => ({
    isPageLoading: false,
    buyingAmount: 1,
    showingVariant: 0,
    images: [
    ],
    showingVariantId: null,
    EProductVariantStatus
  }),
  computed: {
    ...(mapState({
      productDetail: (state) => state.product.productDetail,
      productImages: (state) => state.product.productImages,
      variantImages: (state) => state.product.variantImages,
    }))
  },
  methods: {
    ...(mapActions({
      getProductDetail: 'product/getProductDetail',
      getImages: 'product/getImages',
      addToCart: 'shoppingCart/addToCart',
      getItemsAmount: 'shoppingCart/getItemsAmount'
    })),
    formatPrice(price) {
      return (price / 100).toFixed(2)
    },
    changeSelectedVariant(i) {
      this.showingVariant = i
    },
    async addItemToCart() {
      const variant = this.productDetail.variants[this.showingVariant]
      this.isPageLoading = true
      await this.addToCart({
        variantId: variant.id,
        amount: this.buyingAmount
      }).then(() => this.getItemsAmount())
        .then(() => {
          this.$dialog.notify.success('Cart updated successfully', { position: 'down-left' })
        }).catch((err) => { console.log(err) })

      this.buyingAmount = 1
      this.isPageLoading = false
    },

    changeShowingImg(variantId) {
      this.images = this.variantImages.has(variantId.toString())
        ? this.variantImages.get(variantId.toString()) : this.productImages.get(this.productId.toString())
    }
  },
  async mounted() {
    await this.getProductDetail({
      productId: this.productId
    })
    document.title = `${this.productDetail.title} - PawPose`
    this.productDetail.variants.forEach((variant, index) => {
      if (Number(variant.id) === Number(this.$route.query.variantId)) {
        this.showingVariant = index
      }
    })
    this.showingVariantId = this.$route.query.variantId
    console.log('ids', [this.productId], this.productDetail.variants.map((item) => item.id))
    await this.getImages({
      productIds: [this.productId],
      variantIds: this.productDetail.variants.map((item) => item.id)
    })
    this.changeShowingImg(this.showingVariant)
  },
  watch: {
    showingVariant(to) {
      this.changeShowingImg(to)
      console.log('set', this.productDetail.variants[to].id)
      this.$router.replace({
        name: 'product.product-page',
        params: { productId: this.productDetail.id },
        query: { variantId: this.productDetail.variants[to].id }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
      })
    }
  }
}
</script>

<style lang="less">
.product{
  margin-top: 30px;
}
.product-detail-row{
  display: flex;
  flex-direction: row;
  width: 100%;

  .product-detail-column{
    display: inline-flex;
  }
}
.product-detail-box{
  margin-left: 20px;
  width: 100%;

  .detail-section-box{
    margin: 10px 0 20px;

    .field-title{
      font-size: 20px;
      margin-right: 10px;
    }
  }

  .variant-btn{
    margin-right: 10px;
  }

  .variant-price{
    font-weight: 600;
    color: #b32605;
    font-size: 24px;
    line-height: 12px;
    padding-top: 11px;
  }
  .variant-normal-price{
    margin-left: 10px;
    text-decoration: line-through;
  }
  .add-to-cart-card{
    padding: 15px;
  }

  .amount-field{
    display: inline-block;
    max-width: 5em;
    margin-left: 0.8em;

    .v-input__control{
      min-height: 40px;
    }
  }
}
.item-description{
  margin-top: 50px;
}
</style>
