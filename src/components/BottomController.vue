<template>
  <VAppBar id="bottom-controller" :dark="isDarkMode">
    <MsgInput
        :current-chat-room-id="currentChatRoomId"
        @scrollMsgAreaToEnd="scrollMsgAreaToEnd"
        @sendNewMsg="sendNewMsg"
    />
  </VAppBar>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import MsgInput from "@/components/MsgInput.vue";
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
  },
  setup(_, {emit}) {
    const scrollMsgAreaToEnd = () => {
      emit('scrollMsgAreaToEnd')
    }

    const sendNewMsg = (newMsg: Message) => {
      emit('sendNewMsg', newMsg)
    }

    return {
      scrollMsgAreaToEnd,
      sendNewMsg
    }
  }
})
</script>
