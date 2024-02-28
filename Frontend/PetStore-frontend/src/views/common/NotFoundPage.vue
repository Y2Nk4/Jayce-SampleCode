<template>
  <div>
    <common-header/>
    <div class="content">
      <not-found/>
    </div>
  </div>
</template>

<script>
import CommonHeader from '@/views/common/Header.vue'
import NotFound from '@/components/NotFound.vue'

export default {
  name: 'NotFoundPage',
  components: {
    NotFound,
    CommonHeader
  }
}
</script>

<style lang="less" scoped>
.content{
  padding-top: 3em;
}
</style>
