<template>
  <div class="panel-column">
    <div class="panel-item">
      <h4 class="block-title">Account</h4>
      <a class="secondary--text" @click="$router.push({name: 'user.orders'})">My Orders</a>
      <a class="secondary--text" @click="$router.push({name: 'user.settings.address'})">Address Book</a>
      <a class="secondary--text" @click="$router.push({name: 'user.settings.security'})">Login & Security</a>
    </div>
    <div class="panel-item">
      <!--                      <h4 class="block-title">Account</h4>-->
      <v-btn color="primary primarytext--text" @click="prepareLogout" depressed>
        Sign out
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserDropdownPanel'
}
</script>

<style lang="less" scoped>
.user-dropdown-panel{
  .panel-item{
    a{
      padding: 6px 3px;
    }
  }
}
</style>
