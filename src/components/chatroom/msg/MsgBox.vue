<template>
  <div
      :class="{'msg-box--from-other':!sentBySelf}"
      class="msg-box mt-5"
  >
    <v-card-text class="py-2">
      {{ context.toString().trim() }}
    </v-card-text>
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'

export default defineComponent({
  name: 'MsgBox',
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
