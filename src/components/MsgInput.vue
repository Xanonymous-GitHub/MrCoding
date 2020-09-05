<template>
  <v-text-field
      @keypress.enter.exact.prevent="sendMessage"
      class="msg-input"
      dense
      filled
      hide-details
      no-resize
      placeholder="Put Some Messages"
      rounded
      v-model="textContent"
  >
    <template #prepend-inner>
      <v-icon>mdi-message-reply-text</v-icon>
    </template>
    <template #append-outer>
      <v-btn @click.prevent="sendMessage" fab icon small>
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </template>
    <template #prepend>
      <v-btn fab icon small>
        <v-icon>mdi-plus-circle</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from '@vue/composition-api'
import '@/assets/scss/components/chatroom/msg-input.scss'

export default defineComponent({
  name: 'MsgInput',
  props: {
    currentChatRoomId: {
      required: true,
      type: String
    }
  },
  setup(_, {emit}) {
    const data = reactive({
      textContent: ''
    })

    const sendMessage = () => {
      const textContext = data.textContent.trim()
      data.textContent = ''
      emit('sendNewMsg', textContext)
      emit('scrollMsgAreaToEnd')
    }

    return {
      sendMessage,
      ...toRefs(data)
    }
  }
})
</script>
