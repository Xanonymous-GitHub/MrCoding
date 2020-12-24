<template>
  <VApp id="app">
    <main id="chatroom" :class="{ 'dark-background': isDarkMode }"
          class="page-container flex-column">
      <AppBar :is-dark-mode="isDarkMode" :room-name="roomName" :state="state"/>
      <MsgArea id="msg-area" :current-chat-room-id="currentChatRoomId" :is-dark-mode="isDarkMode"
               @first-load-complete="scrollMsgAreaToBottom" @found-no-msg="foundNoMsg"/>
      <BottomController
          :current-chat-room-id="currentChatRoomId"
          :is-dark-mode="isDarkMode"
          :state="state"
          class="chat-room--bottom"
          @scroll-msg-area-to-end="scrollMsgAreaToBottom"
          @send-new-msg="sendNewMsg"
      />
    </main>
  </VApp>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  Ref,
  ref,
  toRefs,
} from '@vue/composition-api'
import '@/assets/scss/pages/chatroom.scss'
import appStore from '@/store/app'
import {getChatRoom, getLatestMessage, sendMessage} from "@/api/api";
import {ChatRoom, Message, UserType} from "@/api/types/apiTypes";
import MsgArea from "@/components/chatroom/MsgArea.vue";
import BottomController from "@/components/chatroom/BottomController.vue";
import AppBar from "@/components/chatroom/AppBar.vue";
import {ioType} from "@/api/webSocketManager";
import {VApp} from 'vuetify/lib';
import {scrollToElement} from "@/utils/scrollPositionMaintainer";
import {disableBodyScroll} from 'body-scroll-lock';
import replaceAvatar from "@/utils/replaceAvatar";
import router from "@/router";
import {liffLogin} from "@/api/accountManager";

export default defineComponent({
  name: "ChatRoom",
  components: {
    MsgArea,
    BottomController,
    VApp,
    AppBar
  },
  setup() {
    const data = reactive({
      isDarkMode: computed(() => {
        const colorMode = appStore.isDarkMode
        if (colorMode) {
          (document.querySelector('body') as HTMLBodyElement).classList.add('dark-background')
        } else {
          (document.querySelector('body') as HTMLBodyElement).classList.remove('dark-background')
        }
        return colorMode
      }),
      currentChatRoomId: computed(() => appStore.getCurrentChatRoomId),
      roomName: '',
      state: '',
      isFirstMsg: false
    })

    // eslint-disable-next-line no-undef
    let socket!: Ref<ioType>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webSocketException = (e: any): void => {
      alert(e.message)
    }

    const setMsgAreaHeight = (msgArea: HTMLDivElement, bottomController: HTMLElement, appBar: HTMLElement): void => {
      const bodyHeight = (document.querySelector('body') as HTMLBodyElement).offsetHeight
      const result = bodyHeight - (appBar.clientHeight + bottomController.clientHeight)
      msgArea.setAttribute(
          'style',
          `min-height:${result}px;max-height:${result}px`
      )
    }

    const foundNoMsg = (): void => {
      data.isFirstMsg = true
    }

    const chatroomJoined = async (): Promise<void> => {
      scrollMsgAreaToBottom()
      checkIsSocketOnline()
    }

    const webSocketDisconnect = (): void => {
      checkIsSocketOnline()
    }

    const initializeWebSocket = async (): Promise<void> => {
      const socketSeed = await (async () => await (await import('@/api/webSocketManager')).default)() as unknown as (() => ioType);
      socket = ref(socketSeed())
      socket.value.on('successfullyJoinedChatRoomOfMrCodingPlatformInNationalTaipeiUniversityOfTechnologyProgrammingClub', chatroomJoined)
      socket.value.on('message', receiveNewMsg)
      socket.value.on('exception', webSocketException)
      socket.value.on('disconnect', webSocketDisconnect)
      await socket.value.open()
      socket.value.emit('join', data.currentChatRoomId)
    }

    const receiveNewMsg = async (): Promise<void> => {
      const newMsg = (await getLatestMessage(data.currentChatRoomId, appStore.getJwtKey as string)) as unknown as Message
      if (data.isFirstMsg) {
        const noMsgImg = document.querySelector('.no-msg-img') as HTMLImageElement
        (noMsgImg.parentNode as HTMLElement).removeChild(noMsgImg)
      }
      await appStore.createMsg({newMsg})
      if (newMsg.author === appStore.getCurrentUser?._id) {
        scrollMsgAreaToBottom()
      }
    }

    const sendNewMsg = async (newMsg: string): Promise<void> => {
      const isOnline = checkIsSocketOnline()
      if (newMsg) {
        if (!isOnline) {
          await initializeWebSocket()
          checkIsSocketOnline()
        }
        const sendResult = (await sendMessage(data.currentChatRoomId, newMsg, appStore.getJwtKey as string))
        if ('statusCode' in sendResult) {
          await initChatroom()
        }
      }
    }

    const scrollMsgAreaToBottom = (): void => {
      nextTick(() => {
        const msgArea = document.getElementById('msg-area') as HTMLDivElement
        const lastMsg = ((msgArea.querySelector('.msg-area') as HTMLElement).lastChild) as HTMLElement
        if (lastMsg) {
          scrollToElement(msgArea, lastMsg, 300)
        }
      })
    }

    const checkIsSocketOnline = (): boolean => {
      socket.value.connected ? appStore.SET_ONLINE() : appStore.SET_OFFLINE()
      return socket.value.connected
    }

    const handleVisibilityChange = async (): Promise<void> => {
      if (document.visibilityState === 'visible') {
        await autoReconnectDaemon()
      }
    }

    const autoReconnectDaemon = async () => {
      const isOnline = checkIsSocketOnline()
      if (!isOnline) {
        await initializeWebSocket()
      }
    }

    const initChatroom = async () => {
      const expectedChatRoomId = (router.currentRoute.params['chatroom'] as string) || ''
      // validate the chatroom is exist or not.
      const chatRoom = (await getChatRoom(expectedChatRoomId)) as ChatRoom
      if (('statusCode' in chatRoom) || (chatRoom?._id !== expectedChatRoomId)) {
        alert('LOADING ERROR! this chatroom is not exist!')
        await router.replace('/')
        return
      }
      await appStore.SET_CHATROOM_ID(expectedChatRoomId)
      data.roomName = chatRoom.name
      data.state = chatRoom.closed ? 'closed' : 'open'
    }

    onMounted(async () => {
      const msgArea = document.getElementById('msg-area') as HTMLDivElement
      const appBar = document.getElementById('app-bar') as HTMLDivElement
      const bottomController = document.getElementById('bottom-controller') as HTMLElement
      // modify the chatroom size to adapt the screen
      setMsgAreaHeight(msgArea, bottomController, appBar)

      // I so scary to this code.
      window.addEventListener('resize', () => setMsgAreaHeight(msgArea, bottomController, appBar))

      // lock body scroll.
      disableBodyScroll(msgArea)

      // set the current chatroom identify
      await initChatroom()
      await appStore.CLEAN_CURRENT_CHATROOM_MESSAGES_BOX()
      if (appStore.getUserType === UserType.LIFFUSER) {
        await liffLogin(data.currentChatRoomId)
      }
      // load socketIO instance factory function after login
      replaceAvatar(appStore.getCurrentUser?.avatar, document.querySelector('.app-bar__avatar') as HTMLElement)
      await initializeWebSocket()
      document.addEventListener('visibilitychange', handleVisibilityChange)
      setInterval(autoReconnectDaemon, 300)
    })

    onBeforeUnmount(() => {
      appStore.CLEAN_CURRENT_CHATROOM_MESSAGES_BOX()
      document.dispatchEvent(new Event('BeforeUnmount'));
    })

    return {
      sendNewMsg,
      foundNoMsg,
      scrollMsgAreaToBottom,
      ...toRefs(data)
    }
  }
});
</script>
