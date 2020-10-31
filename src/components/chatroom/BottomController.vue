<template>
  <VAppBar id="bottom-controller" :dark="isDarkMode">
    <MsgInput
        :current-chat-room-id="currentChatRoomId"
        :state="state"
        @scroll-msg-area-to-End="scrollMsgAreaToEnd"
        @send-new-msg="sendNewMsg"
    />
  </VAppBar>
</template>

<script lang="ts">
import {defineComponent, onMounted} from '@vue/composition-api'
import MsgInput from "@/components/chatroom/MsgInput.vue";
import {Message} from '@/api/types/apiTypes'
import '@/assets/scss/components/chatroom/bottom-controller.scss'
import {VAppBar} from 'vuetify/lib';

export default defineComponent({
  name: 'BottomController',
  components: {
    MsgInput,
    VAppBar
  },
  props: {
    isDarkMode: {
      required: false,
      type: Boolean
    },
    currentChatRoomId: {
      required: true,
      type: String
    },
    state: {
      required: true,
      type: String
    }
  },
  setup(_, {emit}) {
    const scrollMsgAreaToEnd = () => {
      emit('scroll-msg-area-to-end')
    }

    const sendNewMsg = (newMsg: Message) => {
      emit('send-new-msg', newMsg)
    }

    onMounted(() => {
      const appBar = document.getElementById('bottom-controller') as HTMLDivElement
      appBar.style.setProperty('height', '70px')
    })

    return {
      scrollMsgAreaToEnd,
      sendNewMsg
    }
  }
})
</script>
