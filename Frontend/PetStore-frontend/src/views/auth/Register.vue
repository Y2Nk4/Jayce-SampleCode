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
          <h2>Create an Account</h2>
          <div class="auth-other-options">
            <p>Already have an account? <a href="/login">Sign in</a></p>
          </div>

          <div>
            <v-alert
                text
                outlined
                color="deep-orange"
                icon="mdi-fire"
                v-if="formError"
            >
              {{ formError }}
            </v-alert>

            <validation-observer
                ref="observer"
                v-slot="{ invalid }"
            >
              <form @submit.prevent="submit">
                <validation-provider
                    v-slot="{ errors }"
                    name="firstName"
                    rules="required"
                >
                  <v-text-field
                      class="auth-text-field"
                      v-model="firstName"
                      :error-messages="errors"
                      label="First Name"
                      filled
                      required
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                    v-slot="{ errors }"
                    name="lastName"
                    rules="required"
                >
                  <v-text-field
                      class="auth-text-field"
                      v-model="lastName"
                      :error-messages="errors"
                      label="Last Name"
                      filled
                      required
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                    v-slot="{ errors }"
                    name="username"
                    rules="required"
                >
                  <v-text-field
                      class="auth-text-field"
                      v-model="username"
                      :error-messages="errors"
                      label="Username"
                      filled
                      required
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                    v-slot="{ errors }"
                    name="email"
                    rules="required|email"
                >
                  <v-text-field
                      class="auth-text-field"
                      v-model="email"
                      :error-messages="errors"
                      label="Your email address"
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
                      label="Password"
                      type="password"
                      filled
                      required
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                    v-slot="{ errors }"
                    name="confirmPassword"
                    rules="required"
                >
                  <v-text-field
                      class="auth-text-field"
                      v-model="confirmPassword"
                      :error-messages="errors"
                      label="Confirm you password"
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
                color="primary primarytext--text"
                @click="submit"
                :loading="isPageLoading"
            >
              Create !
            </v-btn>

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
    email: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
    formError: '',
    isPageLoading: false,
  }),
  methods: {
    ...mapActions({
      authRegister: 'auth/authRegister'
    }),
    async submit() {
      this.$refs.observer.validate()
      this.isPageLoading = true
      const result = await this.authRegister({
        username: this.username,
        email: this.email,
        confirmPassword: this.confirmPassword,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password
      })
        .then(() => {
          setTimeout(() => {
            if (this.$route.query.toPath) {
              this.$router.push({ path: this.$route.query.toPath })
            } else {
              this.$router.push({ path: '/' })
            }
            this.isPageLoading = false
          }, 800)
        })
        .catch((error) => {
          this.isPageLoading = false
          this.formError = error.response.data.error
        })
      console.log(result)
    }
  }
}
</script>

<style scoped>

</style>
