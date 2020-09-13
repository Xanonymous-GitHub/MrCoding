<template>
  <div
      :class="{ 'msg-area--dark-background': isDarkMode }"
      class="msg-area msg-area--full-height"
  >
    <Msg
        :is-dark-mode="isDarkMode"
        :key="index"
        :msg-setup="{...message}"
        :owner="msgOwner(message.author)"
        v-for="(message, index) of messages"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, computed} from '@vue/composition-api'
import Msg from "@/components/Msg.vue";
import appStore from '@/store/app'
import '@/assets/scss/components/chatroom/msg-area.scss'

export default defineComponent({
  name: 'MsgArea',
  components: {
    Msg
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
  setup() {
    const data = reactive({
      messages: computed(() => appStore.getMessage)
    })

    const msgOwner = (msgAuthor: string) => {
      const currentUser = appStore.getCurrentUser
      if (msgAuthor === currentUser?._id) {
        return currentUser
      }
      return appStore.getOtherUsers.find(user => user._id === msgAuthor)
    }

    return {
      msgOwner,
      ...toRefs(data)
    }
  }
})
</script>
