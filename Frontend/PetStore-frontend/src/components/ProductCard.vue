<template>
  <a @click="$router.push({ name: 'product.product-page', params: { productId: item.id } })">
    <v-card class="item-card">
      <div class="item-img-wrapper">
        <img class="item-img" :src="item.productImage ? item.productImage.imageLink : null" alt="">
      </div>
      <div class="item-info">
        <p class="item-title">{{ item.title }}</p>
        <span class="item-options">
          Option: {{ item.variants[0].skuName }}
          <template v-if="item.variants.length > 1">
            , (and {{ item.variants.length - 1 }} more options)
          </template>
        </span>

        <div>
          <p class="item-price red--text">
            ${{ (item.variants[0].price/100).toFixed(2) }}
          </p>
          <template v-if="item.variants[0].hasDiscount">
            <p class="item-price-normal item-price">
              ${{ (item.variants[0].normalPrice/100).toFixed(2) }}
            </p>
          </template>
        </div>
      </div>
    </v-card>
  </a>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less">
.item-card{
  padding: 10px;

  .item-img-wrapper{
    width: 100%;
    text-align: center;

    .item-img{
      max-height: 250px;
      max-width: 100%;
    }
  }

  .item-info{
    margin-top: 15px;
    .item-title{
      font-stretch: normal;
      font-style: normal;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: 2rem;

      margin-bottom: 0;
      line-height: 1.3em;
      font-size: 13px;
      font-weight: 600;
      width: 100%;
    }
    span.item-options{
      font-size: 80%;
      margin: 8px 0;
      line-height: 1rem;
      display: block;
    }
    .item-price{
      display: inline-block;
      margin: 5px 0;
      font-weight: bold;

      &.item-price-normal{
        margin-left: 8px;
        font-size: 14px;
        text-decoration: line-through;
        font-weight: 100;
      }
    }
  }
}
</style>
