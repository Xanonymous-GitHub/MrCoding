<template>
  <VApp>
    <main id="dashboard" :class="{ 'dark-background': isDarkMode }" class="page-container">
      <div class="dashboard-field">
        <v-navigation-drawer
            v-model="drawer"
            :dark="isDarkMode"
            app
            clipped
        >
          <v-list>
            <v-list-item link>
              <v-list-item-action>
                <v-icon>mdi-view-dashboard</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Dashboard</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link>
              <v-list-item-action>
                <v-icon>mdi-cog</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Settings</v-list-item-title>
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

        <v-main>
          <div class="chatroom-list">

            <!--                <v-card v-for="(i, k) in [1,2, 3, 4, 5, 6]" :key="k" :dark="isDarkMode" class="chatroom-card"-->
            <!--                        elevation="2"-->
            <!--                        hover outlined rounded shaped tile>-->
            <!--                  <v-card-title class="flex-nowrap justify-space-between">-->
            <!--                    Mr.Coding Chatroom-->
            <!--                    <v-avatar class="avatar">-->
            <!--                      <v-icon :dark="isDarkMode" large>-->
            <!--                        mdi-account-circle-->
            <!--                      </v-icon>-->
            <!--                    </v-avatar>-->
            <!--                  </v-card-title>-->
            <!--                  <v-card-text>-->
            <!--                    123123{{ i }}-->
            <!--                  </v-card-text>-->
            <!--                  <v-card-actions>-->
            <!--                    <v-btn :href="'/chatroom/'+123123123" color="primary" depressed rel="noreferrer noopener"-->
            <!--                           target="_blank" text>Enter-->
            <!--                    </v-btn>-->
            <!--                    <v-btn color="error" depressed text>Close</v-btn>-->
            <!--                  </v-card-actions>-->
            <!--                </v-card>-->

            <v-lazy
                v-for="(chatroom, key) in chatroomBundle" :key="key"
                ref="cards"
                v-model="isActive[key]"
                :name="chatroom._id"
                :options="{threshold: .5}"
                min-height="150px"
                transition="fade-transition"
            >
              <v-card :dark="isDarkMode" class="chatroom-card" elevation="2" outlined
                      rounded shaped tile>
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
                  <v-btn :href="'/chatroom/'+chatroom._id" color="primary" depressed
                         rel="noreferrer noopener"
                         target="_blank" text>Enter
                  </v-btn>
                  <v-btn color="error" depressed text>Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-lazy>
          </div>
        </v-main>
      </div>
    </main>
  </VApp>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, reactive, toRefs, ref, nextTick} from "@vue/composition-api";
import '@/assets/scss/pages/dashboard.scss';
import {getAllChatRooms} from "@/api/api";
import {ChatRoom} from "@/api/types/apiTypes";
import appStore from '@/store/app'
import autoLogin from "@/api/accountManager";
import {VApp} from 'vuetify/lib';
import getBase64ImgPath from '@/utils/avatarCompression'

interface ChatRoomCards {
  $el: HTMLElement
}

interface UnrefCards {
  value: Array<ChatRoomCards>
}

export default defineComponent({
  name: "Dashboard",
  components: {
    VApp
  },
  setup() {
    const data = reactive({
      chatroomBundle: [] as Array<ChatRoom>,
      isDarkMode: computed(() => appStore.isDarkMode),
      drawer: null as unknown as boolean,
      isActive: [] as Array<boolean>,
      avatars: {} as { [key: string]: string },
      chatroomCardAvatar: {} as { [key: string]: string }
    })

    const onCardInView = (entries: Array<IntersectionObserverEntry>) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target)
          const _id = entry.target.getAttribute('name') as string
          setTimeout(() => {
            replaceAvatar(data.chatroomCardAvatar[_id], entry.target as HTMLElement)
          }, 550)
        }
      })
    }

    const cards = ref(null)
    const observerOptions = {
      threshold: 0.5
    }
    const observer = new IntersectionObserver(onCardInView, observerOptions)

    const triggerDrawer = () => {
      data.drawer = !data.drawer
    }

    const replaceAvatar = (avatar: string | undefined, container: HTMLElement) => {
      if (avatar && avatar !== '') {
        const avatarContainer = container.querySelector('.avatar') as HTMLDivElement
        const defaultAvatar = avatarContainer.childNodes[0] as HTMLElement
        avatarContainer.removeChild(defaultAvatar)
        const realAvatar = document.createElement("img") as HTMLImageElement
        realAvatar.setAttribute("src", avatar)
        realAvatar.setAttribute("alt", "")
        avatarContainer.appendChild(realAvatar)
      }
    }

    const getChatroomAvatar = async (chatroomCards: Array<ChatRoomCards>) => {
      let i = 0
      for (const chatroom of data.chatroomBundle) {
        if (chatroom && chatroom.avatar && chatroom.avatar.slice(0, 4) !== 'data') {
          if (!data.avatars[chatroom.avatar]) {
            data.avatars[chatroom.avatar] = await getBase64ImgPath(chatroom.avatar)
          }
          data.chatroomCardAvatar[chatroom._id] = data.avatars[chatroom.avatar]
          observer.observe(chatroomCards[i++].$el)
        }
      }
    }

    onMounted(async () => {
      await autoLogin()
      const jwtToken = appStore.getJwtKey;
      if (jwtToken) {
        data.chatroomBundle = (await getAllChatRooms(jwtToken)) as Array<ChatRoom>
      }

      // replace admin avatar
      replaceAvatar(appStore.getCurrentUser?.avatar, document.querySelector('.bar') as HTMLElement)

      // wait for DOM loaded.
      nextTick(async () => {
        if (cards.value) {
          await getChatroomAvatar((cards as unknown as UnrefCards).value)
        }
      })
    })

    return {
      cards,
      triggerDrawer,
      ...toRefs(data)
    }
  }
})
</script>
