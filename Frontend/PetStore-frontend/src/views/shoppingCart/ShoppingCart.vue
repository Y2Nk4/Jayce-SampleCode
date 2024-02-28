<template>
  <div>
    <common-header></common-header>

    <div class="web-container shopping-cart-page">
      <div class="shopping-cart-column cart-items-column">
        <h2 style="margin-bottom: 10px;">Shopping Cart <span v-if="shoppingCartItems">({{ shoppingCartItems.length }} items)</span></h2>

        <v-card class="shopping-cart-card">
          <v-progress-linear
              :active="isPageLoading"
              indeterminate
              query
          ></v-progress-linear>

          <div class="shopping-cart-content">
            <div class="empty-shopping-cart" v-if="!shoppingCartItems || shoppingCartItems.length <= 0">
              <h4 class="primarytext--text">Ohh, Seems like your shopping cart is empty</h4>
            </div>
            <div class="shopping-cart-items" v-else>
              <div class="shopping-cart-item d-flex" v-for="(item, index) in shoppingCartItems" :key="index">
                <div class="col-9">
                  <div class="item-img-block">
                    <img :src="item.variantImage ? item.variantImage.imageLink : (item.productImage ? item.productImage.imageLink : null)" alt="">
                  </div>
                  <div class="item-details flex-column justify-space-between">
                    <div>
                      <a @click="$router.push({ name: 'product.product-page', params: { productId: item.product.id }, query: { variantId: item.variant.id }})">
                        <h4 class="item-title primarytext--text">{{ item.product.title }}</h4>
                      </a>
                      <p>option: {{ item.variant.skuName }}</p>
                    </div>
                    <div class="item-control">
                      <span>amount:</span>
                      <form @submit.prevent="submitUpdateAmount(item)" style="display: inline-block;">
                        <v-text-field
                            class="amount-text-field"
                            label="amount"
                            min="0"
                            max="9999"
                            hide-details
                            type="number"
                            v-model="item.r_amount"
                            :loading="disableInputs"
                            @blur="submitUpdateAmount(item)"
                            solo></v-text-field>
                      </form>
                      <v-divider
                          vertical
                      ></v-divider>
                      <v-btn @click="removeItem(item)" :disabled="disableInputs" plain>remove</v-btn>
                    </div>
                  </div>
                </div>

                <div class="item-price col-3">
                  <p class="total-price">
                    ${{ computePrice(item) }}
                  </p>
                  <p class="single-price">
                    (${{ (item.variant.price / 100).toFixed(2) }} ea.)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </div>
      <div class="shopping-cart-column subtotal-panel-column">
        <div class="floating-panel" ref="floating-checkout-panel">
          <v-card class="subtotal-panel">
            <h2>Summary</h2>
            <div class="subtotal-table">
              <div class="subtotal-row">
                <div class="cart-item-title" >
                  <p>Item(s):</p>
                </div>
                <div class="cart-item-amount">
                  ${{ totalAmount }}
                </div>
              </div>
              <div class="subtotal-row">
                <div class="cart-item-title" >
                  <p>Shipping:</p>
                </div>
                <div class="cart-item-amount">
                  Calc on Checkout
                </div>
              </div>
              <div class="subtotal-row">
                <div class="cart-item-title" >
                  <p>Tax:</p>
                </div>
                <div class="cart-item-amount">
                  Calc on Checkout
                </div>
              </div>

              <v-divider></v-divider>
              <div class="subtotal-row">
                <div class="cart-item-title" >
                  <p>Est. total:</p>
                </div>
                <div class="cart-item-amount">
                  ${{ totalAmount }}
                </div>
              </div>
            </div>

          </v-card>
          <span class="coupon-note">* Coupon Could be Applied During Checkout</span>

          <v-btn class="checkout-btn" color="primary primarytext--text" :disabled="disableCheckoutBtn" @click="clickSubmitCheckout">Checkout</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import CommonHeader from '../common/Header.vue'

export default {
  name: 'ShoppingCart',
  components: {
    CommonHeader
  },
  data: () => ({
    disableInputs: false,
    isPageLoading: false
  }),
  computed: {
    ...(mapState({
      shoppingCartItems: (state) => state.shoppingCart.shoppingCartItems.map((item) => {
        item.r_amount = item.amount
        return item
      }),
      disableCheckoutBtn: (state) => (!state.shoppingCart.shoppingCartItems || state.shoppingCart.shoppingCartItems.length === 0),
      totalAmount: (state) => ((!state.shoppingCart.shoppingCartItems || state.shoppingCart.shoppingCartItems.length === 0)
        ? 0 : state.shoppingCart.shoppingCartItems
          .map((item) => (item.amount * item.variant.price / 100))
          .reduce((tol, cur) => tol + cur)
          .toFixed(2))
    })),
  },
  methods: {
    ...(mapActions({
      fetchShoppingCart: 'shoppingCart/getShoppingCart',
      changeItemAmount: 'shoppingCart/changeItemAmount',
      removeFromCart: 'shoppingCart/removeFromCart',
      initCheckout: 'checkout/initCheckout'
    })),
    computePrice(item) {
      return (item.amount * item.variant.price / 100).toFixed(2)
    },
    async submitUpdateAmount(item) {
      if (item.r_amount !== item.amount) {
        this.disableInputs = true
        this.isPageLoading = true
        await this.changeItemAmount({
          cartItemId: item.id,
          amount: item.r_amount
        }).then(() => {
          this.$dialog.notify.info('Cart updated successfully', {
            position: 'top-right'
          })
        }).catch((err) => { console.log(err) })
        await this.fetchShoppingCart()
        this.disableInputs = false
        this.isPageLoading = false
      }
    },
    async removeItem(item) {
      this.disableInputs = true
      this.isPageLoading = true
      await this.removeFromCart({
        cartItemId: item.id
      }).then(() => {
        this.$dialog.notify.info('Cart updated successfully', {
          position: 'top-right'
        })
      }).catch((err) => { console.log(err) })
      await this.fetchShoppingCart()
      this.disableInputs = false
      this.isPageLoading = false
    },
    async clickSubmitCheckout() {
      this.$store.commit('common/SHOW_LOADING_OVERLAY')

      await this.initCheckout(this.shoppingCartItems.map((item) => ({
        variant_id: item.variant.id,
        amount: item.amount,
        cartItemId: item.id
      }))).catch((err) => console.log(err))
      this.$store.commit('common/HIDE_LOADING_OVERLAY')
      this.$router.push({ name: 'checkout' })
    },

    scrollEvent() {
      const scrollOffset = document.documentElement.scrollTop
      console.log('scrolled', scrollOffset)
      this.$refs['floating-checkout-panel'].style.setProperty('transform', `translateY(${scrollOffset}px)`)
    }
  },
  async mounted() {
    this.fetchShoppingCart()

    document.addEventListener('scroll', this.scrollEvent)
  },
  async beforeDestroy() {
    if (this.scrollEvent) {
      document.removeEventListener('scroll', this.scrollEvent)
    }
  }
}
</script>

<style lang="less">
.shopping-cart-page{
  max-width: 95em;
  margin: 20px auto 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;

  .shopping-cart-card{
    padding: 0;
    min-width: 50em;

    .shopping-cart-content{
      padding: 30px;
    }
  }

  .shopping-cart-item{
    display: inline-flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    align-content: center;

    &:not(:last-child) {
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: solid 2px #efefef;
    }

    & > div{

    }

    .item-price{
      min-width: 7em;
      text-align: center;

      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .total-price{
        font-weight: bold;
        font-size: 22px;
        margin-bottom: 0;
      }
      .single-price{
        font-size: 13px;
      }
    }

    .item-img-block{
      height: 200px;
      width: 200px;
      text-align: center;
      display: inline-block;

      img{
        display: inline-block;
        max-width: 100%;
        max-height: 100%;
      }
    }

    .item-details{
      display: inline-flex;
      padding-left: 20px;
      vertical-align: top;
      height: 100%;
      width: calc(100% - 200px);

      .item-title{
        line-break: auto;
      }

      .item-control{
        display: flex;
        flex-direction: row;
        align-items: center;

        .v-divider{
          margin: 0 6px 0 20px;
        }
      }
    }

    .amount-text-field{
      display: inline-block;
      max-width: 5em;
      margin-left: 0.8em;

      .v-input__control{
        min-height: 36px;
      }
    }
  }

  .cart-items-column{
    width: 100%;
  }
  .subtotal-panel-column{
    width: 23em;
    margin-top: 36px;
    margin-left: 20px;

    .coupon-note{
      font-size: 13px;
      text-align: center;
      display: block;
      margin: 9px 0 0;
    }
  }

  .subtotal-panel{
    width: 100%;
    padding: 30px;

    .subtotal-table{
      display: flex;
      flex-direction: column;

      .subtotal-row{
        display: inline-flex;
        flex-direction: row;
        justify-content: center;
        margin-bottom: 10px;

        .cart-item-title{
          width: 100%;
          flex-shrink: 2;
          flex-grow: 1;

          p{
            margin-bottom: 0;
          }
        }
        .cart-item-amount{
          line-break: auto;
          width: 100%;
          flex-shrink: 1;
          flex-grow: 1;
          padding-left: 1em;
          text-align: right;
        }
      }
    }
  }

  .checkout-btn{
    width: 100%;
    margin-top:10px;
  }

  .floating-panel{
    transition: all ease-in-out 0.3s;
  }
}
</style>
