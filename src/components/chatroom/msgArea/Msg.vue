<template>
  <div :class="{'msg--sent-by-self':sendBySelf}" class="msg pr-2 mb-1">
    <Avatar v-if="!sendBySelf" :avatar="owner.avatar" :is-dark-mode="isDarkMode"/>
    <MsgBox :context="msgSetup.context" :sent-by-self="sendBySelf"/>
    <MsgStatus :read="msgSetup.read" :sent-by-self="sendBySelf" :sent-time="msgSetup.updatedAt"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted, computed} from '@vue/composition-api'
import MsgBox from '@/components/chatroom/msg/MsgBox.vue'
import Avatar from '@/components/chatroom/msg/Avatar.vue'
import MsgStatus from '@/components/chatroom/msg/MsgStatus.vue'
import appStore from '@/store/app'
import '@/assets/scss/components/chatroom/msg.scss'
import {Admin, LiffUser, Message} from "@/api/types/apiTypes";
import historyLoader from "@/api/historyLoader";

export default defineComponent({
  name: 'Msg',
  components: {
    MsgBox,
    Avatar,
    MsgStatus
  },
  props: {
    msgSetup: {
      required: true,
      type: Object
      // type: Message
    },
    owner: {
      required: true,
      type: Object
      // type: Admin
    },
    isDarkMode: {
      required: false,
      type: Boolean
    }
  },
  setup(props, vm) {
    const data = reactive({
      sendBySelf: false,
      getCurrentUserId: computed(() => appStore.getCurrentUser?._id)
    })

    let observer: IntersectionObserver

    function subscribeIsNeedNewMessages<T>(target: HTMLElement, callback: (() => T)): void {
      const observerOptions = {
        // root: document.getElementById('msg-area') as HTMLDivElement,
        // rootMargin: '0px',
        threshold: 1
      }
      observer = new IntersectionObserver(callback, observerOptions);
      observer.observe(target)
    }

    const loadHistory = async () => {
      await historyLoader(20)
      await observer.disconnect()
    }

    onMounted(() => {
      data.sendBySelf = (props.owner as (Admin | LiffUser))._id === data.getCurrentUserId
      if ((props.msgSetup as Message).observer) {
        subscribeIsNeedNewMessages(vm.root.$el as HTMLDivElement, loadHistory)
      }
    })

    return {...toRefs(data)}
  }
})
</script>
