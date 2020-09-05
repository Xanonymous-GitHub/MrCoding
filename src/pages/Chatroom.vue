<template>
  <v-app class="chat-room flex-column">
    <main class="page-container" id="chatroom">
      <MsgArea :current-chat-room-id="currentChatRoomId" :is-dark-mode="isDarkMode" id="msg-area"/>
      <BottomController
          :current-chat-room-id="currentChatRoomId"
          :is-dark-mode="isDarkMode"
          @scrollMsgAreaToEnd="scrollMsgAreaToEnd"
          @sendNewMsg="sendNewMsg"
          class="chat-room--bottom"
          id="bottom-controller"
      />
    </main>
  </v-app>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  reactive,
  toRefs,
} from '@vue/composition-api'
import '@/assets/scss/pages/chatroom.scss'
import appStore from '@/store/app'
import {getChatRoom, getLatestMessage, sendMessage} from "@/api/api";
import {ChatRoom, Message} from "@/api/types/apiTypes";
import adminDataFetcher from '@/utils/adminDataFetcher'
import socket from "@/api/webSocketManager";
// import {VueRouter} from "vue-router/types/router";
import MsgArea from "@/components/MsgArea.vue";
import BottomController from "@/components/BottomController.vue";

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
      // eslint-disable-next-line no-unused-expressions
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
      socket.on('successfullyJoinedChatRoomOfMrCodingPlatformInNationalTaipeiUniversityOfTechnologyProgrammingClub', chatroomJoined)
      socket.on('message', receiveNewMsg)
      socket.on('exception', webSocketException)
      await socket.open() // connect to the server
      socket.emit('join', data.currentChatRoomId)
    }

    const receiveNewMsg = async (): Promise<void> => {
      const newMsg = (await getLatestMessage(data.currentChatRoomId, (appStore.getJwtKey || undefined), (appStore.getCurrentUser?._id || undefined))) as unknown as Message
      await appStore.createMsg({newMsg})
    }

    const sendNewMsg = (newMsg: string): void => {
      sendMessage(data.currentChatRoomId, newMsg, (appStore.getJwtKey || undefined), (appStore.getCurrentUser?._id || undefined))
    }

    const scrollMsgAreaToEnd = (): void => {
      const msgArea = document.getElementById('msg-area') as HTMLDivElement
      msgArea.scrollIntoView(false)
    }

    onBeforeMount(async () => {
      // set the current chatroom identify
      const expectedChatRoomId = (vm.root.$route.params.chatRoom as string) || ''
      appStore.SET_CHATROOM_ID(expectedChatRoomId)
      // validate the chatroom is exist or not.
      const chatRoom = (await getChatRoom(expectedChatRoomId)) as ChatRoom
      if (('statusCode' in chatRoom) || (chatRoom?._id !== expectedChatRoomId)) {
        // alert('LOADING ERROR! this chatroom is not exist!')
        // await (vm.root.$options.router as VueRouter).push('/')
        return
      }
      appStore.SET_CHATROOM_ID(expectedChatRoomId)
    })

    onMounted(async () => {
      const msgArea = document.getElementById('msg-area') as HTMLDivElement
      const bottomController = document.getElementById('bottom-controller') as HTMLElement
      // modify the chatroom size to adapt the screen
      setMsgAreaPadding(msgArea, bottomController)
      // check if login
      if (!await adminDataFetcher()) {
        // alert('please login!')
        // await (vm.root.$options.router as VueRouter).push('/')
        return
      } else {
        // register the new msg event.
        await initializeWebSocket()
      }
    })

    onBeforeUnmount(() => {
      if (socket) {
        socket.disconnect()
      }
    })

    return {
      sendNewMsg,
      scrollMsgAreaToEnd,
      ...toRefs(data)
    }
  }
});
</script>
