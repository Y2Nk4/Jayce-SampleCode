<template>
  <div>
    <form>
      <slot></slot>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ValidateForm',
  props: {
    model: Object
  },
  model: {
    prop: 'model',
    event: 'modelChanged'
  }
}
</script>

<style scoped>

</style>
