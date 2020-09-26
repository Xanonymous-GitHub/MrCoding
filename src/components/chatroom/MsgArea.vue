<template>
  <div
      :class="{ 'msg-area--dark-background': isDarkMode }"
      class="msg-area"
  >
    <UpdateDetector/>
    <Msg
        v-for="message of messages"
        :key="message._id"
        :is-dark-mode="isDarkMode"
        :msg-setup="{...message}"
        :owner="msgOwner(message.author)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, computed} from '@vue/composition-api'
import Msg from "@/components/chatroom/msgArea/Msg.vue";
import UpdateDetector from '@/components/chatroom/msgArea/UpdateDetector.vue';
import appStore from '@/store/app'
import '@/assets/scss/components/chatroom/msg-area.scss'

export default defineComponent({
  name: 'MsgArea',
  components: {
    Msg,
    UpdateDetector
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
      messages: computed(() => appStore.getMessage),
    })

    const msgOwner = (msgAuthor: string) => {
      const currentUser = appStore.getCurrentUser
      return (msgAuthor === currentUser?._id) ? currentUser : appStore.getOtherUsers.find(user => user._id === msgAuthor)
    }

    return {
      msgOwner,
      ...toRefs(data)
    }
  }
})
</script>
