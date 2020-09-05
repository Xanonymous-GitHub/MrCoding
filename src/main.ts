import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueCompositionAPI from '@vue/composition-api'

Vue.config.productionTip = false
Vue.use(VueCompositionAPI)

const app = new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
})

document.addEventListener('DOMContentLoaded', () => app.$mount('#app'))
