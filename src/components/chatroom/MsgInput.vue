<template>
  <VTextField
      id="msgInput"
      v-model="textContent"
      :disabled="state!=='open'"
      :placeholder="state==='open'?'Aa':'無法傳送訊息'"
      autofocus
      class="msg-input"
      clearable
      dense
      filled
      hide-details
      no-resize
      rounded
      @keypress.enter.exact.prevent="sendMessage"
  >
    <template #prepend-inner>
      <VIcon v-if="state==='open'">mdi-message-reply-text</VIcon>
      <VIcon v-else disabled>mdi-message-bulleted-off</VIcon>
    </template>
    <template #append-outer>
      <VBtn :disabled="!textContent && state!=='open'" fab icon small @click.prevent="sendMessage($event)">
        <VIcon v-if="state==='open'">mdi-send</VIcon>
        <VIcon v-else disabled>mdi-send-lock</VIcon>
      </VBtn>
    </template>
    <template #prepend>
      <VBtn :disabled="state!=='open'" fab icon small>
        <VIcon>mdi-plus-circle</VIcon>
      </VBtn>
    </template>
  </VTextField>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from '@vue/composition-api'
import '@/assets/scss/components/chatroom/msg-input.scss'
import {VIcon, VTextField, VBtn} from 'vuetify/lib';

export default defineComponent({
  name: 'MsgInput',
  components: {
    VIcon,
    VTextField,
    VBtn
  },
  props: {
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
    const data = reactive({
      textContent: ''
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function sendMessage(e: any) {
      (document.getElementById('msgInput') as HTMLInputElement).focus()
      // TODO focus problem
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      const textContext = data.textContent.trim()
      data.textContent = ''
      emit('send-new-msg', textContext)
      emit('scroll-msg-area-to-end')
    }

    return {
      sendMessage,
      ...toRefs(data)
    }
  }
})
</script>
