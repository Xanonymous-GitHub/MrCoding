<template>
  <v-text-field
      v-model="textContent"
      autofocus
      class="msg-input"
      clearable
      dense
      filled
      hide-details
      no-resize
      placeholder="Aa"
      rounded
      @keypress.enter.exact.prevent="sendMessage"
      @blur.prevent="null"
  >
    <template #prepend-inner>
      <v-icon>mdi-message-reply-text</v-icon>
    </template>
    <template #append-outer>
      <v-btn :disabled="!textContent" fab icon small @click.prevent="sendMessage">
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendMessage = (e: any) => {
      e.preventDefault()
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
