import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#F2AEC1',
        secondary: '#262626',
        // background: '#DDEFF0'
        primarytext: '#262626'
      }
    }
  },
  breakpoint: {
    mobileBreakpoint: 'sm' // 这个值等于960
  },
})
