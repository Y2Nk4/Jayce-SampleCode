<template>
  <div>
    <stripe-element-card
      ref="stripeElement"
      :pk="payment.publicKey"
    />
    <span style="display: block; margin: 10px 0 0">{{ payment.description }}</span>
  </div>
</template>

<script>
import { StripeElementCard } from '@vue-stripe/vue-stripe'

export default {
  name: 'StripeCard',
  components: { StripeElementCard },
  props: {
    payment: {
      type: Object,
      required: true
    }
  },

  methods: {
    async submitPayment() {
      const stripeCard = this.$refs.stripeElement
      const { clientSecret } = this.payment
      const stripeResult = await stripeCard.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: stripeCard.element
        }
      })
      console.log(stripeResult)
      this.$store.commit('checkout/SET_PAYMENT_GATEWAY_RESULT', stripeResult)
    }
  }
}
</script>

<style scoped>

</style>
