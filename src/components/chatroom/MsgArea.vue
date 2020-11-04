<template>
  <div class="wrapper">
    <div
        :class="{ 'msg-area--dark-background': isDarkMode }"
        class="msg-area"
    >
      <InfiniteLoading :distance="20" direction="top" spinner="spiral" style="user-select: none"
                       @infinite="loadHistory">
        <template #no-more>
          NPC Mr.Coding
        </template>
        <template #no-results>
          <v-icon
              :dark="isDarkMode"
              class="no-msg-img"
              color="grey"
              size="200px"
          >mdi-comment-plus-outline
          </v-icon>
        </template>
        <template #error>
          <v-alert dense outlined type="error">
            無法連接至聊天室
          </v-alert>
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
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, computed} from '@vue/composition-api'
import Msg from "@/components/chatroom/msgArea/Msg.vue";
import appStore from '@/store/app'
import '@/assets/scss/components/chatroom/msg-area.scss'
import InfiniteLoading, {StateChanger} from 'vue-infinite-loading';
import historyLoader from "@/api/historyLoader";

export default defineComponent({
  name: 'MsgArea',
  components: {
    Msg,
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
  setup(_, {emit}) {
    const data = reactive({
      messages: computed(() => appStore.getMessage),
      retry: 3,
      notLoadYet: true
    })

    const retryLimit = 3
    let firstComplete = true

    const msgOwner = (msgAuthor: string) => {
      const currentUser = appStore.getCurrentUser
      return (msgAuthor === currentUser?._id) ? currentUser : appStore.getOtherUsers.find(user => user._id === msgAuthor)
    }

    const loadHistory = async ($state: StateChanger) => {
      try {
        await new Promise(resolve => setTimeout(() => resolve(), 500))
        if (await historyLoader(30)) {
          $state.loaded();
          if (data.notLoadYet) {
            data.notLoadYet = false
          }
        } else {
          $state.complete();
          if (data.notLoadYet) {
            emit('found-no-msg')
          }
        }
        data.retry = retryLimit
        if (firstComplete) {
          emit('first-load-complete')
          firstComplete = false
        }
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
