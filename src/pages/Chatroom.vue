<template>
  <VApp id="app">
    <main id="chatroom" :class="{ 'dark-background': isDarkMode }"
          class="page-container flex-column">
      <AppBar :is-dark-mode="isDarkMode"/>
      <MsgArea id="msg-area" :current-chat-room-id="currentChatRoomId" :is-dark-mode="isDarkMode"/>
      <BottomController
          :current-chat-room-id="currentChatRoomId"
          :is-dark-mode="isDarkMode"
          class="chat-room--bottom"
          @scroll-msg-area-to-end="scrollMsgAreaToEnd"
          @send-new-msg="sendNewMsg"
      />
    </main>
  </VApp>
</template>

<script lang="ts">
import {computed, defineComponent, onBeforeUnmount, onMounted, reactive, toRefs} from '@vue/composition-api'
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
      currentChatRoomId: computed(() => appStore.getCurrentChatRoomId)
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webSocketException = (e: any): void => {
      alert(e.message)
    }

    const setMsgAreaPadding = (msgArea: HTMLDivElement, bottomController: HTMLElement): void => {
      const attributeList = [
        // `padding-top:${appBar.clientHeight}px`,
        `padding-bottom:${bottomController.clientHeight + 10}px`
      ]
      msgArea.setAttribute(
          'style',
          attributeList.join(';').toString()
      );
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
      scrollMsgAreaToBottom()
    }

    const sendNewMsg = (newMsg: string): void => {
      if (newMsg) {
        sendMessage(data.currentChatRoomId, newMsg, appStore.getJwtKey as string)
      }
    }

    const scrollMsgAreaToBottom = (): void => {
      const msgArea = document.getElementById('msg-area') as HTMLDivElement
      const bottomController = document.getElementById('bottom-controller') as HTMLDivElement
      msgArea.scrollIntoView(false);
      bottomController.scrollIntoView(false);
    }

    onMounted(async () => {
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
      await appStore.CLEAN_CURRENT_CHATROOM_MESSAGES_BOX()

      // const appBar = document.getElementById('app-bar') as HTMLDivElement
      const msgArea = document.getElementById('msg-area') as HTMLDivElement
      const bottomController = document.getElementById('bottom-controller') as HTMLElement
      // modify the chatroom size to adapt the screen
      setMsgAreaPadding(msgArea, bottomController)
      // load socketIO instance factory function after login
      await autoLogin()
      await initializeWebSocket()
    })

    onBeforeUnmount(() => {
      appStore.CLEAN_CURRENT_CHATROOM_MESSAGES_BOX()
      document.dispatchEvent(new Event('BeforeUnmount'));
    })

    return {
      sendNewMsg,
      scrollMsgAreaToEnd: scrollMsgAreaToBottom,
      ...toRefs(data)
    }
  }
});
</script>
