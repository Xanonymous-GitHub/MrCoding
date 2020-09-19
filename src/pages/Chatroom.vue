<template>
  <v-app id="chatroom" class="chat-room flex-column page-container">
    <MsgArea id="msg-area" :current-chat-room-id="currentChatRoomId" :is-dark-mode="isDarkMode"/>
    <BottomController
        id="bottom-controller"
        :current-chat-room-id="currentChatRoomId"
        :is-dark-mode="isDarkMode"
        class="chat-room--bottom"
        @scrollMsgAreaToEnd="scrollMsgAreaToEnd"
        @sendNewMsg="sendNewMsg"
    />
  </v-app>
</template>

<script lang="ts">
import {computed, defineComponent, onBeforeUnmount, onMounted, reactive, toRefs} from '@vue/composition-api'
import '@/assets/scss/pages/chatroom.scss'
import appStore from '@/store/app'
import {getChatRoom, getHistory, getLatestMessage, sendMessage} from "@/api/api";
import {ChatRoom, Message} from "@/api/types/apiTypes";
import MsgArea from "@/components/MsgArea.vue";
import BottomController from "@/components/BottomController.vue";
import {ioType} from "@/api/webSocketManager";
import autoLogin from "@/api/accountManager";

export default defineComponent({
  name: "ChatRoom",
  components: {
    MsgArea,
    BottomController
  },
  setup(_, vm) {
    const data = reactive({
      isDarkMode: computed(() => appStore.isDarkMode),
      currentChatRoomId: computed(() => appStore.getCurrentChatRoomId),
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webSocketException = (e: any): void => {
      alert(e.message)
    }

    const setMsgAreaPadding = (msgArea: HTMLDivElement, bottomController: HTMLElement): void => {
      msgArea.setAttribute(
          'style',
          `padding-bottom:${bottomController.clientHeight + 10}px`
      );
      return
    }

    const chatroomJoined = (): void => {
      return
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
    }

    const sendNewMsg = (newMsg: string): void => {
      if (newMsg) {
        sendMessage(data.currentChatRoomId, newMsg, appStore.getJwtKey as string)
      }
    }

    const loadHistoryMessages = async () => {
      const messages = await getHistory(data.currentChatRoomId, Date.now(), 99999, appStore.getJwtKey as string) as unknown as Array<Message>
      for (const newMsg of messages.reverse()) {
        await appStore.createMsg({newMsg})
      }
    }

    const scrollMsgAreaToEnd = (): void => {
      const msgArea = document.getElementById('msg-area') as HTMLDivElement
      msgArea.scrollIntoView(false)
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

      const msgArea = document.getElementById('msg-area') as HTMLDivElement
      const bottomController = document.getElementById('bottom-controller') as HTMLElement
      // modify the chatroom size to adapt the screen
      setMsgAreaPadding(msgArea, bottomController)
      // load socketIO instance factory function after login
      await autoLogin()
      await initializeWebSocket()
      await loadHistoryMessages()
    })

    onBeforeUnmount(() => {
      appStore.CLEAN_CURRENT_CHATROOM_MESSAGES_BOX()
      document.dispatchEvent(new Event('BeforeUnmount'));
    })

    return {
      sendNewMsg,
      scrollMsgAreaToEnd,
      ...toRefs(data)
    }
  }
});
</script>
