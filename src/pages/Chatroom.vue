<template>
  <VApp id="app">
    <main id="chatroom" :class="{ 'dark-background': isDarkMode }"
          class="page-container flex-column">
      <AppBar :is-dark-mode="isDarkMode" :room-name="roomName" :state="state"/>
      <MsgArea id="msg-area" :current-chat-room-id="currentChatRoomId" :is-dark-mode="isDarkMode"
               @first-load-complete="scrollMsgAreaToBottom"/>
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
import {computed, defineComponent, onBeforeUnmount, onMounted, reactive, toRefs, nextTick} from '@vue/composition-api'
import '@/assets/scss/pages/chatroom.scss'
import appStore from '@/store/app'
import {getChatRoom, getLatestMessage, sendMessage} from "@/api/api";
import {ChatRoom, Message} from "@/api/types/apiTypes";
import MsgArea from "@/components/chatroom/MsgArea.vue";
import BottomController from "@/components/chatroom/BottomController.vue";
import AppBar from "@/components/chatroom/AppBar.vue";
import {ioType} from "@/api/webSocketManager";
import autoLogin from "@/api/accountManager";
import {VApp} from 'vuetify/lib';
import {scrollToElement} from "@/utils/scrollPositionMaintainer";
import {disableBodyScroll} from 'body-scroll-lock';
import replaceAvatar from "@/utils/replaceAvatar";

export default defineComponent({
  name: "ChatRoom",
  components: {
    MsgArea,
    BottomController,
    VApp,
    AppBar
  },
  setup(_, vm) {
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
    })

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

    const chatroomJoined = async (): Promise<void> => {
      // await historyLoader(20)
      scrollMsgAreaToBottom()
    }

    const initializeWebSocket = async (): Promise<void> => {
      const socketSeed = await (async () => await (await import('@/api/webSocketManager')).default)() as unknown as (() => ioType);
      const socket = socketSeed()
      socket.on('successfullyJoinedChatRoomOfMrCodingPlatformInNationalTaipeiUniversityOfTechnologyProgrammingClub', chatroomJoined)
      socket.on('message', receiveNewMsg)
      socket.on('exception', webSocketException)
      await socket.open()
      socket.emit('join', data.currentChatRoomId)
    }

    const receiveNewMsg = async (): Promise<void> => {
      const newMsg = (await getLatestMessage(data.currentChatRoomId, appStore.getJwtKey as string)) as unknown as Message
      await appStore.createMsg({newMsg})
      if (newMsg.author === appStore.getCurrentUser?._id) {
        scrollMsgAreaToBottom()
      }
    }

    const sendNewMsg = (newMsg: string): void => {
      if (newMsg) {
        sendMessage(data.currentChatRoomId, newMsg, appStore.getJwtKey as string)
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
      const expectedChatRoomId = (vm.root.$route.params.chatroom as string) || ''

      // validate the chatroom is exist or not.
      const chatRoom = (await getChatRoom(expectedChatRoomId)) as ChatRoom
      if (('statusCode' in chatRoom) || (chatRoom?._id !== expectedChatRoomId)) {
        // alert('LOADING ERROR! this chatroom is not exist!')
        // await (vm.root.$options.router as VueRouter).push('/')
        return
      }
      await appStore.SET_CHATROOM_ID(expectedChatRoomId)
      data.roomName = chatRoom.name
      data.state = chatRoom.closed ? 'closed' : 'open'
      await appStore.CLEAN_CURRENT_CHATROOM_MESSAGES_BOX()

      // load socketIO instance factory function after login
      await autoLogin()
      replaceAvatar(appStore.getCurrentUser?.avatar, document.querySelector('.app-bar__avatar') as HTMLElement)
      await initializeWebSocket()
    })

    onBeforeUnmount(() => {
      appStore.CLEAN_CURRENT_CHATROOM_MESSAGES_BOX()
      document.dispatchEvent(new Event('BeforeUnmount'));
    })

    return {
      sendNewMsg,
      scrollMsgAreaToBottom,
      ...toRefs(data)
    }
  }
});
</script>
