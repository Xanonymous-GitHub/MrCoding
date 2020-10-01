<template>
  <VTextField
      id="msgInput"
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
  >
    <template #prepend-inner>
      <VIcon>mdi-message-reply-text</VIcon>
    </template>
    <template #append-outer>
      <VBtn :disabled="!textContent" fab icon small @click.prevent="sendMessage($event)">
        <VIcon>mdi-send</VIcon>
      </VBtn>
    </template>
    <template #prepend>
      <VBtn fab icon small>
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
    }
  },
  setup(_, {emit}) {
    const data = reactive({
      textContent: ''
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function sendMessage(e: any) {
      (document.getElementById('msgInput') as HTMLInputElement).focus()
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      const textContext = data.textContent.trim()
      data.textContent = ''
      emit('send-new-msg', textContext)
      emit('scroll-msg-area-to-end')
    }

    // function onBottomFocused() {
    //   const bottomController = document.querySelector('#bottom-controller') as HTMLDivElement
    //   bottomController.style.position = 'relative'
    // }
    //
    // function onBottomBlurred() {
    //   const bottomController = document.querySelector('#bottom-controller') as HTMLDivElement
    //   bottomController.style.position = 'fixed'
    // }

    return {
      sendMessage,
      // onBottomFocused,
      // onBottomBlurred,
      ...toRefs(data)
    }
  }
})
</script>
