<template>
  <VAppBar id="app-bar" :dark="isDarkMode" class="app-bar">
    <span class="app-bar__title">NPC Mr. Coding</span>
    <StateBadge :state="state"/>
    <span v-if="roomName"
          :class="{'app-bar__title--room-name-dark':isDarkMode,'app-bar__title--room-name-light':!isDarkMode}"
          class="app-bar__title">{{ roomName }}</span>
    <span :class="{ 'app-bar__avatar--dark-background': isDarkMode }" class="app-bar__avatar">
      <v-avatar class="avatar" right size="40px">
        <v-icon :dark="isDarkMode" large>
          mdi-account-circle
        </v-icon>
      </v-avatar>
    </span>
  </VAppBar>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import {VAppBar} from "vuetify/lib";
import '@/assets/scss/components/chatroom/app-bar.scss'
import StateBadge from "@/components/App/StateBadge.vue";

export default defineComponent({
  name: "AppBar",
  components: {
    VAppBar,
    StateBadge
  },
  props: {
    isDarkMode: {
      required: false,
      type: Boolean
    },
    roomName: {
      required: false,
      type: String,
    },
    state: {
      required: true,
      type: String
    }
  },
  setup() {
    return
  }
})
</script>
