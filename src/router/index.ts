import Vue from 'vue'
import VueRouter, {NavigationGuardNext, Route, RouteConfig} from 'vue-router'
import appStore from '@/store/app'
import autoLogin from "@/api/accountManager";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    beforeEnter(to: Route, from: Route, next: NavigationGuardNext) {
      next()
    },
    component: () => import(
      /* webpackChunkName: "Home" */
      /* webpackPrefetch: true */
      '@/pages/Fixing.vue'
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
    redirect: 'room-list',
    component: () => import(
      /* webpackChunkName: "Dashboard" */
      /* webpackPrefetch: true */
      '@/pages/Dashboard.vue'
      ),
    children: [
      {
        name: 'RoomList',
        path: '',
        component: () => import(
          /* webpackChunkName: "RoomList" */
          /* webpackPrefetch: true */
          '@/components/dashboard/RoomList.vue'
          ),
      },
      {
        name: 'Settings',
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

router.beforeEach(async (to: Route, from: Route, next: NavigationGuardNext) => {
  const nonProtectionPages = ['Home', 'Login']
  if (!nonProtectionPages.includes(to.name ?? '')) {
    await autoLogin()
    if (!appStore.isLoggedIn) {
      next({name: "Login"})
    }
  }
  next()
})

export default router
