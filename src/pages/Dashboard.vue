<template>
  <VApp>
    <main id="dashboard" :class="{ 'dark-background': isDarkMode }" class="page-container">
      <div class="dashboard-field">
        <v-navigation-drawer
            id="nav"
            v-model="drawer"
            :dark="isDarkMode"
            :style="{zIndex:(isMobile && drawer) ? 1000000 : undefined}"
            app
            class="drawer"
            clipped
        >
          <v-list>
            <v-list-item link to="/dashboard">
              <v-list-item-action>
                <v-icon>mdi-view-dashboard</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Dashboard</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/settings">
              <v-list-item-action>
                <v-icon>mdi-cog</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Settings</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link @click.prevent.stop="logout">
              <v-list-item-action>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-app-bar
            id="bar"
            app
            class="bar"
            clipped-left
            color="#2994b2"
            dark
        >
          <div class="content">
            <div class="left">
              <v-app-bar-nav-icon @click.prevent.stop="triggerDrawer"></v-app-bar-nav-icon>
              <v-toolbar-title>NPC Mr.Coding</v-toolbar-title>
            </div>
            <div class="right">
              <v-avatar class="avatar" right size="42px">
                <v-icon :dark="isDarkMode" large>
                  mdi-account-circle
                </v-icon>
              </v-avatar>
            </div>
          </div>
        </v-app-bar>
        <keep-alive>
          <router-view @refresh-avatar="refreshAvatar"/>
        </keep-alive>
      </div>
    </main>
  </VApp>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, reactive, toRefs, nextTick, watchEffect} from "@vue/composition-api";
import '@/assets/scss/pages/dashboard.scss';
import appStore from '@/store/app'
import {VApp} from 'vuetify/lib';
import replaceAvatar from "@/utils/replaceAvatar";
import {disableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock';
import {removeJwt} from "@/utils/jwtToken";
import router from "@/router";

export default defineComponent({
  name: "Dashboard",
  components: {
    VApp,
  },
  setup() {
    const data = reactive({
      isDarkMode: computed(() => appStore.isDarkMode),
      drawer: null as unknown as boolean,
      isMobile: true
    })

    watchEffect(() => {
      const nav = document.querySelector('#nav.v-navigation-drawer--is-mobile') as HTMLElement
      if (nav) {
        data.isMobile = true
        if (data.drawer) {
          disableBodyScroll(nav)
          nextTick(() => {
            const overlay = document.querySelector('.v-overlay') as HTMLElement
            if (overlay) {
              (overlay.parentNode as HTMLElement).removeChild(overlay);
              (nav.parentNode as HTMLElement).insertBefore(overlay, nav.nextSibling);
            }
          })
        } else {
          clearAllBodyScrollLocks()
        }
      } else {
        data.isMobile = false
      }
    })

    const triggerDrawer = () => {
      data.drawer = !data.drawer
    }

    const refreshAvatar = () => {
      replaceAvatar(appStore.getCurrentUser?.avatar, document.querySelector('.bar') as HTMLElement)
    }

    const logout = async () => {
      await removeJwt()
      location.reload()
      await router.push('/login')
    }

    onMounted(async () => {
      document.dispatchEvent(new Event('app-rendered'));
      refreshAvatar()
    })

    return {
      triggerDrawer,
      refreshAvatar,
      logout,
      ...toRefs(data)
    }
  }
})
</script>
