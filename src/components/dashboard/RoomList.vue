<template>
  <v-main>
    <div class="chatroom-list">
      <v-lazy
          v-for="(chatroom, key) in chatroomBundle" :key="key"
          ref="cards"
          v-model="isActive[key]"
          :name="chatroom._id"
          :options="{threshold: .5}"
          min-height="150px"
          transition="fade-transition"
      >
        <v-card :dark="isDarkMode" :disabled="inProgressingChatroom[chatroom._id]"
                :loading="inProgressingChatroom[chatroom._id]"
                class="chatroom-card"
                elevation="2" outlined rounded shaped tile>
          <v-card-title class="flex-nowrap justify-space-between">
            {{ chatroom.name }}
            <v-avatar class="avatar mx-2">
              <v-icon :dark="isDarkMode" large>
                mdi-account-circle
              </v-icon>
            </v-avatar>
          </v-card-title>
          <v-card-text>
            {{ chatroom._id }}
          </v-card-text>
          <v-card-actions class="justify-space-between">
            <span>
              <v-btn :href="'/chatroom/'+chatroom._id" class="mr-3" color="primary"
                     depressed
                     rel="noreferrer noopener" target="_blank" text>
                  <v-icon dark left small class="mr-1">mdi-open-in-new</v-icon>
                  Enter
              </v-btn>
              <v-btn :color="chatroom.closed?'green':'error'" depressed text
                     @click.prevent.stop="changeRoomStatus(chatroom._id)">
                <v-icon dark left small class="mr-1">mdi-{{ chatroom.closed ? 'reload' : 'close-circle-outline' }}</v-icon>
                {{ chatroom.closed ? 'open' : 'close' }}
              </v-btn>
            </span>
            <StateBadge :state="chatroom.closed?'closed':'open'"/>
          </v-card-actions>
        </v-card>
      </v-lazy>
    </div>
  </v-main>
</template>

<script lang="ts">
import {computed, defineComponent, nextTick, onMounted, reactive, ref, toRefs} from "@vue/composition-api";
import StateBadge from "@/components/App/StateBadge.vue";
import {BMap, ChatRoom, SMap} from "@/api/types/apiTypes";
import appStore from "@/store/app";
import replaceAvatar from "@/utils/replaceAvatar";
import getBase64ImgPath from "@/utils/avatarCompression";
import {getAllChatRooms, setChatRoomClosingState} from "@/api/api";

interface ChatRoomCards {
  $el: HTMLElement
}

interface UnrefCards {
  value: Array<ChatRoomCards>
}

export default defineComponent({
  name: "RoomList",
  components: {
    StateBadge
  },
  setup() {
    const data = reactive({
      chatroomBundle: [] as Array<ChatRoom>,
      isDarkMode: computed(() => appStore.isDarkMode),
      drawer: null as unknown as boolean,
      isActive: [] as Array<boolean>,
      avatars: {} as SMap,
      chatroomCardAvatar: {} as SMap,
      inProgressingChatroom: {} as BMap
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

    const getChatroomAvatar = async (chatroomCards: Array<ChatRoomCards>) => {

      // closure for the IntersectionObserver generator
      const equipObserver = (): Generator<void, void, void> => {
        return (function* () {
          for (const chatroomCard of chatroomCards) {
            yield observer.observe(chatroomCard.$el)
          }
        })()
      }

      // init a generator
      const observerEquipHandler = equipObserver()

      for (const chatroom of data.chatroomBundle) {
        if (chatroom && chatroom.avatar && chatroom.avatar.slice(0, 4) !== 'data') {
          if (!data.avatars[chatroom.avatar]) {
            data.avatars[chatroom.avatar] = await getBase64ImgPath(chatroom.avatar)
          }
          data.chatroomCardAvatar[chatroom._id] = data.avatars[chatroom.avatar]

          // equip the observer to the chatroom card
          observerEquipHandler.next()
        }
      }
    }

    const changeRoomStatus = async (id: string) => {
      const chatroomBundle = data.chatroomBundle.entries()
      let targetChatroom!: ChatRoom
      let targetIndex!: number

      //locate the chatroom in array.
      for (const [i, chatroom] of chatroomBundle) {
        if (chatroom._id === id) {
          targetChatroom = chatroom
          targetIndex = i
          break
        }
      }

      // disable the card
      await new Promise(resolve => resolve(
          (() => data.inProgressingChatroom[targetChatroom._id] = true)()
      ))


      // call api
      nextTick(async () => {
        if (targetChatroom) {
          const currentStatus = targetChatroom.closed
          const jwtToken = appStore.getJwtKey
          if (jwtToken) {
            const changedChatroom = (await setChatRoomClosingState(targetChatroom._id, !currentStatus, jwtToken)) as unknown as ChatRoom
            if (!('message' in changedChatroom) && !('statusCode' in changedChatroom)) {
              data.chatroomBundle[targetIndex].closed = changedChatroom.closed
            }
          }
        }
      })

      // enable the card
      await new Promise(resolve => resolve(
          (() => data.inProgressingChatroom[targetChatroom._id] = false)()
      ))
    }

    onMounted(async () => {
      // await autoLogin()
      const jwtToken = appStore.getJwtKey;
      if (jwtToken) {
        data.chatroomBundle = (await getAllChatRooms(jwtToken)) as Array<ChatRoom>
      }

      // wait for DOM loaded.
      nextTick(async () => {
        if (cards.value) {
          await getChatroomAvatar((cards as unknown as UnrefCards).value)
        }
      })
    })

    return {
      cards,
      changeRoomStatus,
      triggerDrawer,
      ...toRefs(data)
    }
  }
})
</script>
