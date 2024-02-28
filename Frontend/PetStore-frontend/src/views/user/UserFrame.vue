<template>
  <div>
    <common-header></common-header>

    <v-container>
      <v-row no-gutters>
        <v-col cols="3">
          <div class="side-panel">
            <h3>Account</h3>

            <a @click="$router.push({ name: 'user.orders' })">Order History</a>
            <a @click="$router.push({ name: 'user.settings.address' })">Address Book</a>
            <a @click="$router.push({ name: 'user.settings.security' })">Login & Security</a>
          </div>
        </v-col>
        <v-col cols="9">
          <router-view></router-view>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import CommonHeader from '@/views/common/Header.vue'

export default {
  name: 'UserFrame',
  components: {
    CommonHeader
  }
}
</script>

<style lang="less">
  .side-panel{
    padding: 15px;
    width:14em;
    margin-left: auto;
    margin-right: 15px;

    a{
      text-decoration: none;
      display: block;
      margin-bottom: 5px;
    }

    h3{
      margin-bottom: 15px;
      font-size: 22px;
    }
  }
</style>
