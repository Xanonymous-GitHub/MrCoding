<template>
  <VApp>
    <main id="dashboard" :class="{ 'dark-background': isDarkMode }" class="page-container">
      <div class="dashboard-field">

        <v-app-bar
            class="bar"
            color="deep-purple"
            dark
            fixed
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

        <v-navigation-drawer
            v-model="drawer"
            :dark="isDarkMode"
            app
            fixed
            temporary
        >
          <v-list
              dense
              nav
          >
            <v-list-item-group
                active-class="deep-purple--text text--accent-4"
            >
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Home</v-list-item-title>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Account</v-list-item-title>
              </v-list-item>

            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>

        <div class="chatroom-list">


          <!--          <v-card v-for="(i, k) in [1,2, 3, 4, 5, 6]" :key="k" :dark="isDarkMode" class="chatroom-card"-->
          <!--                  elevation="2"-->
          <!--                  hover outlined rounded shaped tile>-->
          <!--            <v-card-title class="flex-nowrap justify-space-between">-->
          <!--              Mr.Coding Chatroom-->
          <!--              <v-avatar class="avatar">-->
          <!--                <v-icon :dark="isDarkMode" large>-->
          <!--                  mdi-account-circle-->
          <!--                </v-icon>-->
          <!--              </v-avatar>-->
          <!--            </v-card-title>-->
          <!--            <v-card-text>-->
          <!--              123123{{ i }}-->
          <!--            </v-card-text>-->
          <!--            <v-card-actions>-->
          <!--              <v-btn :href="'/chatroom/'+123123123" color="primary" depressed rel="noreferrer noopener"-->
          <!--                     target="_blank" text>Enter-->
          <!--              </v-btn>-->
          <!--              <v-btn color="error" depressed text>Close</v-btn>-->
          <!--            </v-card-actions>-->
          <!--          </v-card>-->

          <v-lazy
              v-for="(chatroom, key) in chatroomBundle" :key="key"
              v-model="isActive[key]"
              :options="{threshold: .5}"
              min-height="150px"
              transition="fade-transition"
          >
            <v-card :dark="isDarkMode"
                    class="chatroom-card"
                    elevation="2"
                    hover
                    outlined rounded shaped tile>
              <v-card-title class="flex-nowrap justify-space-between">
                {{ chatroom.name }}
                <v-avatar class="avatar">
                  <v-icon :dark="isDarkMode" large>
                    mdi-account-circle
                  </v-icon>
                </v-avatar>
              </v-card-title>
              <v-card-text>
                {{ chatroom._id }}
              </v-card-text>
              <v-card-actions>
                <v-btn :href="'/chatroom/'+chatroom._id" color="primary" depressed rel="noreferrer noopener"
                       target="_blank" text>Enter
                </v-btn>
                <v-btn color="error" depressed text>Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-lazy>
        </div>
      </div>
    </main>
  </VApp>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, reactive, toRefs} from "@vue/composition-api";
import '@/assets/scss/pages/dashboard.scss';
import {getAllChatRooms} from "@/api/api";
import {ChatRoom} from "@/api/types/apiTypes";
import appStore from '@/store/app'
import autoLogin from "@/api/accountManager";
import {VApp} from 'vuetify/lib';

export default defineComponent({
  name: "Dashboard",
  components: {
    VApp
  },
  setup() {
    const data = reactive({
      chatroomBundle: [] as Array<ChatRoom>,
      isDarkMode: computed(() => appStore.isDarkMode),
      drawer: false,
      isActive: [] as Array<boolean>,
    })

    const triggerDrawer = () => {
      data.drawer = true
    }

    const replaceAvatar = () => {
      const avatar = appStore.getCurrentUser?.avatar
      if (avatar && avatar !== '') {
        const avatarContainer = document.querySelector('.avatar') as HTMLDivElement
        const defaultAvatar = avatarContainer.childNodes[0] as HTMLElement
        avatarContainer.removeChild(defaultAvatar)
        const realAvatar = document.createElement("img") as HTMLImageElement
        realAvatar.setAttribute("src", avatar)
        realAvatar.setAttribute("alt", "")
        avatarContainer.appendChild(realAvatar)
      }
    }

    onMounted(async () => {
      await autoLogin()
      const jwtToken = appStore.getJwtKey;
      if (jwtToken) {
        data.chatroomBundle = (await getAllChatRooms(jwtToken)) as Array<ChatRoom>
      }
      replaceAvatar()
    })
    return {
      triggerDrawer,
      ...toRefs(data)
    }
  }
})
</script>
