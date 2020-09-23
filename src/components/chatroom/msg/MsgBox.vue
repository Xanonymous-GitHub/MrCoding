<template>
  <div
      :class="{'msg-box--from-other':!sentBySelf}"
      class="msg-box mt-5"
  >
    <VCardText class="py-2">
      {{ context.toString().trim() }}
    </VCardText>
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import {VCardText} from 'vuetify/lib';

export default defineComponent({
  name: 'MsgBox',
  components: {
    VCardText
  },
  props: {
    context: {
      required: true,
      type: String
    },
    sentBySelf: {
      required: true,
      type: Boolean
    }
  }
})
</script>
