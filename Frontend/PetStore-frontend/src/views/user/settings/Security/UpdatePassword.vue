<template>
  <div>
    <h3 class="section-title">Update Password</h3>

    <validation-observer
      ref="observer"
      v-slot="{ invalid }"
    >
      <v-form>
      <v-container>
        <v-row class="security-row">
          <v-col cols="12" md="12">
            <validation-provider
              v-slot="{ errors }"
              name="current password"
              rules="required"
            >
              <v-text-field
                v-model="changePasswordForm.currentPassword"
                type="password"
                :rules="nameRules"
                :error-messages="errors"
                label="Current Password"
                filled
                required
              ></v-text-field>
            </validation-provider>
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="changePasswordForm.newPassword"
              type="password"
              :rules="nameRules"
              label="New Password"
              filled
              required
            ></v-text-field>
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field
              v-model="changePasswordForm.newPasswordConfirm"
              type="password"
              :rules="nameRules"
              label="Confirm New Password"
              filled
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-btn color="primary" @click="submitUpdatePassword">Submit</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    </validation-observer>
  </div>
</template>

<script>
import userSettings from '@/api/userSettings'

export default {
  name: 'UpdatePassword',
  data: () => ({
    changePasswordForm: {},
    nameRules: {}
  }),
  methods: {
    async submitUpdatePassword() {
      this.$store.commit('common/SHOW_LOADING_OVERLAY')
      try {
        await userSettings.updatePassword(this.changePasswordForm)
        this.$dialog.notify.success('Your password has been successfully updated', { position: 'top' })
      } catch (e) {
        // this.$dialog.notify.warning('Your password has been successfully updated', { position: 'top' })
      }
      this.changePasswordForm = {}
      this.$store.commit('common/HIDE_LOADING_OVERLAY')
    }
  }
}
</script>

<style scoped>

</style>
