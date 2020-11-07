import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import appStore from '@/store/app'
import autoLogin from "@/api/accountManager";

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
    path: '/chatroom',
    name: 'ChatroomRedirect',
    component: () => import(
      /* webpackChunkName: "ChatroomRedirect" */
      /* webpackPrefetch: true */
      '@/pages/ChatroomRedirect.vue'
      )
  },
  {
    path: '/chatroom/:chatroom',
    name: 'Chatroom',
    async beforeEnter(to, from, next) {
      appStore.CLEAN_CURRENT_CHATROOM_MESSAGES_BOX()
      await autoLogin()
      next()
    },
    component: () => import(
      /* webpackChunkName: "Chatroom" */
      /* webpackPrefetch: true */
      '@/pages/Chatroom.vue'
      )
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    async beforeEnter(to, from, next) {
      await autoLogin()
      next()
    },
    redirect: 'room-list',
    component: () => import(
      /* webpackChunkName: "Dashboard" */
      /* webpackPrefetch: true */
      '@/pages/Dashboard.vue'
      ),
    children: [
      {
        name: 'room-list',
        path: '',
        component: () => import(
          /* webpackChunkName: "RoomList" */
          /* webpackPrefetch: true */
          '@/components/dashboard/RoomList.vue'
          ),
      },
      {
        path: '/settings',
        component: () => import(
          /* webpackChunkName: "Settings" */
          /* webpackPrefetch: true */
          '@/components/dashboard/Settings.vue'
          ),
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(
      /* webpackChunkName: "Login" */
      /* webpackPrefetch: true */
      '@/pages/Login.vue'
      )
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
