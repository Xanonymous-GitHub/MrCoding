<template>
  <v-app class="chat-room flex-column page-container" id="chatroom">
    <MsgArea :current-chat-room-id="currentChatRoomId" :is-dark-mode="isDarkMode" id="msg-area"/>
    <BottomController
        :current-chat-room-id="currentChatRoomId"
        :is-dark-mode="isDarkMode"
        @scrollMsgAreaToEnd="scrollMsgAreaToEnd"
        @sendNewMsg="sendNewMsg"
        class="chat-room--bottom"
        id="bottom-controller"
    />
  </v-app>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  reactive,
  toRefs,
} from '@vue/composition-api'
import '@/assets/scss/pages/chatroom.scss'
import appStore from '@/store/app'
import {bindLineUserUidToChatroom, getChatRoom, getHistory, getLatestMessage, sendMessage} from "@/api/api";
import {Admin, ChatRoom, Message, User} from "@/api/types/apiTypes";
// import {VueRouter} from "vue-router/types/router";
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
      console.log(e.message)
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
      const socketSeed = await (async () => await (await import('@/api/webSocketManager')).default)() as unknown as (() => ioType);
      const socket = socketSeed()
      socket.on('successfullyJoinedChatRoomOfMrCodingPlatformInNationalTaipeiUniversityOfTechnologyProgrammingClub', chatroomJoined)
      socket.on('message', receiveNewMsg)
      socket.on('exception', webSocketException)
      await socket.open()
      socket.emit('join', data.currentChatRoomId)
    }

    const receiveNewMsg = async (): Promise<void> => {
      const newMsg = (await getLatestMessage(data.currentChatRoomId, (appStore.getJwtKey || undefined), (appStore.getCurrentUser?._id || undefined))) as unknown as Message
      await appStore.createMsg({newMsg})
      console.log('received a message!')
    }

    const sendNewMsg = (newMsg: string): void => {
      if (newMsg) {
        sendMessage(data.currentChatRoomId, newMsg, (appStore.getJwtKey || undefined), (appStore.getCurrentUser?._id || undefined))
      }
    }

    const loadHistoryMessages = async () => {
      const messages = await getHistory(data.currentChatRoomId, 1, 99999, (appStore.getJwtKey || undefined), (appStore.getCurrentUser?._id || undefined)) as unknown as Array<Message>
      messages.forEach((newMsg: Message, insertPosition: number) => appStore.createMsg({newMsg, insertPosition}))
    }

    const scrollMsgAreaToEnd = (): void => {
      const msgArea = document.getElementById('msg-area') as HTMLDivElement
      msgArea.scrollIntoView(false)
    }

    onMounted(async () => {
      console.log('onMounted')

      // set the current chatroom identify
      const expectedChatRoomId = (vm.root.$route.params.chatroom as string) || ''
      console.log('now is in roomNumber: ' + expectedChatRoomId)

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
      const currentUser = appStore.getCurrentUser
      if (currentUser && (!('cc' in currentUser)) && !chatRoom.liffUserID) {
        await bindLineUserUidToChatroom(data.currentChatRoomId, currentUser?._id || '')
        console.log('bind -> ' + currentUser?._id)
      }

      await appStore.createMsg({
        newMsg: {
          _id: 'test1',
          author: (appStore.getCurrentUser as (User | Admin))._id,
          read: false,
          context: '123456',
          chatroomID: data.currentChatRoomId,
          updateAt: '123456789'
        }
      })
      await appStore.createMsg({
        newMsg: {
          _id: 'test2',
          author: (appStore.getCurrentUser as (User | Admin))._id,
          read: false,
          context: (appStore.getCurrentUser)?._id,
          chatroomID: data.currentChatRoomId,
          updateAt: '123456789'
        }
      })

      await initializeWebSocket()
      // await loadHistoryMessages()
    })

    onBeforeUnmount(() => {
      console.log('onBeforeUnmount')
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
