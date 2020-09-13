import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import appStore from '@/store/app'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(
      /* webpackChunkName: "Home" */
      /* webpackPrefetch: true */
      '@/pages/Home.vue'
      )
  },
  {
    path: '/chatroom/:chatroom',
    name: 'ChatRoom',
    beforeEnter(to, from, next) {
      appStore.CLEAN_CURRENT_CHATROOM_MESSAGES_BOX()
      next()
    },
    component: () => import(
      /* webpackChunkName: "ChatRoom" */
      /* webpackPrefetch: true */
      '@/pages/Chatroom.vue'
      )
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import(
      /* webpackChunkName: "Dashboard" */
      /* webpackPrefetch: true */
      '@/pages/Dashboard.vue'
      )
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
