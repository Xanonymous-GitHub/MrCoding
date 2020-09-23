<template>
  <VAppBar id="app-bar" :dark="isDarkMode">
    NPC Mr. Coding
  </VAppBar>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import {VAppBar} from "vuetify/lib";
import '@/assets/scss/components/chatroom/app-bar.scss'

export default defineComponent({
  name: "AppBar",
  components: {
    VAppBar
  },
  props: {
    isDarkMode: {
      required: false,
      type: Boolean
    },
  },
  setup() {
    return
  }
})
</script>
