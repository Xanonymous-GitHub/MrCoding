<template>
  <div class="msg-status">
    <p
        v-if="read && sentBySelf"
        class="msg-status__text px-0 py-0 mb-0 mx-2"
    >
      已讀
    </p>
    <p :class="{'msg-status__text--right':sentBySelf,'msg-status__text--left':!sentBySelf}"
       class="msg-status__text px-0 py-0 mb-0 mx-2">
      {{ formattedSentTime }}
    </p>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, computed} from '@vue/composition-api'
import formatter from '@/utils/timeFormater'

export default defineComponent({
  name: 'MsgStatus',
  props: {
    sentTime: {
      required: true,
      type: Number
    },
    read: {
      required: true,
      type: Boolean
    },
    sentBySelf: {
      required: true,
      type: Boolean
    },
  },
  setup(props) {
    const data = reactive({
      formattedSentTime: computed(() => formatter(props.sentTime))
    })

    return {
      ...toRefs(data)
    }
  }
})
</script>
