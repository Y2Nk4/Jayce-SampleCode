<template>
  <div>
    <h2>Login & Security</h2>

    <update-password/>
  </div>
</template>

<script>
import UpdatePassword from '@/views/user/settings/Security/UpdatePassword.vue'

export default {
  name: 'Security',
  components: {
    UpdatePassword
  },

  data: () => ({
    nameRules: {}
  })
}
</script>

<style lang="less">
.section-title{
  margin: 10px 0;
}
.security-row{
  padding: 15px 0;
  & > div{
    padding: 0 10px;
  }
}
</style>
