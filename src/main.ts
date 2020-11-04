import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueCompositionAPI from '@vue/composition-api'
import InfiniteLoading from 'vue-infinite-loading';

Vue.config.productionTip = false
Vue.use(VueCompositionAPI)
Vue.use(InfiniteLoading, {
  props: {
    spinner: 'spiral',
    distance: 20,
    noMore: 'NPC Mr.Coding',
    noResults: ''
  },
  system: {
    throttleLimit: 300,
  },
})

const app = new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
})

document.addEventListener('DOMContentLoaded', () => app.$mount('#app'))
