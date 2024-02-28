<template>
  <div>
    <common-header/>

    <home-carousel/>

<!--    <home-benefit/>-->

    <tags-list title="Hottest Categories"/>

    <tag-products-list title="New Products" :tagId="2"/>

    <tag-products-list :tagId="1"/>

    <tag-products-list title="New House For your Pet" :tagId="3"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CommonHeader from './common/Header.vue'
import HomeCarousel from './store/homeComponents/HomeCarousel.vue'
import HomeBenefit from './store/homeComponents/HomeBenefit.vue'
import TagsList from './store/homeComponents/TagsList.vue'
import TagProductsList from './store/homeComponents/TagProductsList.vue'

export default Vue.extend({
  name: 'Home',

  components: {
    CommonHeader,
    HomeCarousel,
    // HomeBenefit,
    TagProductsList,
    TagsList
  },

  data: () => ({
    carousel: null
  })
})
</script>

<style lang="less">
.home-page-section{
  margin: 10px 0;
}
</style>
