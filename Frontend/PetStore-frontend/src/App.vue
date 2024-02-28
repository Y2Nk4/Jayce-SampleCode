<template>
  <v-app>
    <link rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Zen+Kaku+Gothic+Antique">
    <v-main>
      <router-view/>
    </v-main>
    <v-overlay :z-index="999" :value="isShowLoadingOverlay">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import '@/assets/css/common/styles.less'

export default Vue.extend({
  name: 'App',
  computed: {
    ...(mapState({
      isShowLoadingOverlay: (state) => state.common.isShowLoadingOverlay
    }))
  },
  data: () => ({
    //
  })
})
</script>
