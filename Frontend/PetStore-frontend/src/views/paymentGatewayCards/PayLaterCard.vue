<template>
  <div>
    <p>
      {{ payment.description }}
    </p>
  </div>
</template>

<script>

export default {
  name: 'PayLaterCard',
  props: {
    payment: {
      type: Object,
      required: true
    }
  },
  methods: {
    async submitPayment() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
