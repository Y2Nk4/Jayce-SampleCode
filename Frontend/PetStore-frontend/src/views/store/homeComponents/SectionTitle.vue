<template>
  <h3 class="section-title">
    <slot></slot>
  </h3>
</template>

<script>
export default {
  name: 'SectionTitle'
}
</script>

<style scoped>
  h3.section-title{
    font-size: 25px;
    font-weight: bold;
    border-bottom: solid 2px #F2AEC1;
    padding-bottom: 6px;
    margin: 30px 0 20px;
  }
</style>
