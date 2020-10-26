<template>
  <div
      :class="{ 'msg-area--dark-background': isDarkMode }"
      class="msg-area"
  >
    <UpdateDetector/>
    <InfiniteLoading direction="top" distance="20" spinner="spiral" @infinite="loadHistory">
      <template #no-more>
        <div/>
      </template>
    </InfiniteLoading>
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
import InfiniteLoading, {StateChanger} from 'vue-infinite-loading';
import historyLoader from "@/api/historyLoader";

export default defineComponent({
  name: 'MsgArea',
  components: {
    Msg,
    UpdateDetector,
    InfiniteLoading
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
      retry: 10,
    })

    const retryLimit = 10

    const msgOwner = (msgAuthor: string) => {
      const currentUser = appStore.getCurrentUser
      return (msgAuthor === currentUser?._id) ? currentUser : appStore.getOtherUsers.find(user => user._id === msgAuthor)
    }

    const loadHistory = async ($state: StateChanger) => {
      try {
        await new Promise(resolve => setTimeout(() => resolve(), 500))
        if (await historyLoader(30, '#chatroom')) {
          $state.loaded();
        } else {
          $state.complete();
        }
        data.retry = retryLimit
      } catch (e) {
        if (data.retry) {
          await new Promise(resolve => setTimeout(() => resolve(), 1000))
          data.retry--
          $state.loaded()
        } else {
          $state.error()
        }
      }
    }

    return {
      msgOwner,
      loadHistory,
      ...toRefs(data)
    }
  }
})
</script>
