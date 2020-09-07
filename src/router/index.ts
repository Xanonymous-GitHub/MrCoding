import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'

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
    component: () => import(
      /* webpackChunkName: "ChatRoom" */
      /* webpackPrefetch: true */
      '@/pages/Chatroom.vue'
      )
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
