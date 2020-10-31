<template>
  <div :id="msgSetup._id" :class="{'msg--sent-by-self':sendBySelf}" class="msg pr-2 mb-1">
    <Avatar v-if="!sendBySelf" :avatar="owner.avatar" :is-dark-mode="isDarkMode" :verified="owner.cc"/>
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
import {Admin, LiffUser} from "@/api/types/apiTypes";

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
  setup(props) {
    const data = reactive({
      sendBySelf: false,
      getCurrentUserId: computed(() => appStore.getCurrentUser?._id)
    })

    onMounted(() => {
      data.sendBySelf = (props.owner as (Admin | LiffUser))._id === data.getCurrentUserId
    })

    return {...toRefs(data)}
  }
})
</script>
