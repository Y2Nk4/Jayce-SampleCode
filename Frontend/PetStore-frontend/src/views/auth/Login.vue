<template>
  <div>
    <common-header></common-header>
    <div class="web-container">
      <div class="auth-frame">
        <v-card
            class="auth-box"
            elevation="2"
        >
<!--          <v-img-->
<!--              alt="Vuetify Logo"-->
<!--              class="shrink mr-2"-->
<!--              contain-->
<!--              src="@/assets/images/website_logo.png"-->
<!--              transition="scale-transition"-->
<!--              width="100"-->
<!--              style="margin: auto!important;"-->
<!--          />-->
          <h1 style="text-align: center">LOGO</h1>
          <h2>Sign in to {xxx}</h2>

          <div>
            <v-alert
                text
                outlined
                color="deep-orange"
                icon="mdi-fire"
                v-if="loginError"
            >
              {{ loginError }}
            </v-alert>

            <validation-observer
                ref="observer"
                v-slot="{ invalid }"
            >
              <form @submit.prevent="submit">
                <validation-provider
                    v-slot="{ errors }"
                    name="username"
                    rules="required"
                >
                  <v-text-field
                      class="auth-text-field"
                      v-model="username"
                      :error-messages="errors"
                      label="username or email"
                      filled
                      required
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                    v-slot="{ errors }"
                    name="password"
                    rules="required"
                >
                  <v-text-field
                      class="auth-text-field"
                      v-model="password"
                      :error-messages="errors"
                      label="password"
                      type="password"
                      filled
                      required
                  ></v-text-field>
                </validation-provider>
              </form>
            </validation-observer>

            <v-btn
                class="auth-confirm-btn mr-4"
                type="submit"
                :disabled="invalid"
                :loading="isPageLoading"
                color="primary primarytext--text"
                @click="submit"
            >
              Login
            </v-btn>

            <div class="auth-other-options">
              <p>Don't have an account? <a href="/register">Create an account</a></p>
            </div>

            <v-divider />

            <p class="auth-disclosure">
              By continuing you agree to our Terms and Conditions, our Privacy Policy.
            </p>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { setInteractionMode } from 'vee-validate'
import { mapActions } from 'vuex'
import CommonHeader from '../common/Header.vue'
import '@/assets/css/auth/auth.less'

setInteractionMode('eager')

export default {
  name: 'Login',
  components: {
    CommonHeader
  },
  data: () => ({
    username: '',
    password: '',
    isPageLoading: false,
    loginError: ''
  }),
  methods: {
    ...mapActions({
      authLogin: 'auth/authLogin'
    }),
    async submit() {
      this.$refs.observer.validate()
      this.isPageLoading = true
      const result = await this.authLogin({
        username: this.username,
        password: this.password
      })
        .then(() => {
          this.$dialog.notify.success('Login Successfully', { position: 'top' })
          setTimeout(() => {
            this.isPageLoading = false

            if (this.$route.query.toPath) {
              console.log('redirect to', this.$route.query.toPath)
              this.$router.push({ path: this.$route.query.toPath })
            } else {
              this.$router.push({ path: '/' })
            }
          }, 800)
        })
        .catch((error) => {
          this.isPageLoading = false
          this.loginError = error.response.data.error
        })
      console.log(result)
    }
  }
}
</script>

<style scoped>

</style>
