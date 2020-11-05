<template>
  <VAppBar id="app-bar" :dark="isDarkMode" class="app-bar">
    <span class="app-bar__title">NPC Mr. Coding</span>
    <StateBadge :state="state"/>
    <span v-if="roomName"
          :class="{'app-bar__title--room-name-dark':isDarkMode,'app-bar__title--room-name-light':!isDarkMode}"
          class="app-bar__title">{{ roomName }}</span>
    <span :class="{ 'app-bar__avatar--dark-background': isDarkMode }" class="app-bar__avatar">
      <v-badge
          :color="isOnLine?'green':'orange'"
          bordered
          bottom
          dot
          offset-x="10"
          offset-y="10"
      >
        <v-avatar class="avatar" right size="40px">
          <v-icon :dark="isDarkMode" x-large>
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </v-badge>
    </span>
  </VAppBar>
</template>

<script lang="ts">
import {computed, defineComponent} from '@vue/composition-api'
import {VAppBar} from "vuetify/lib";
import '@/assets/scss/components/chatroom/app-bar.scss'
import StateBadge from "@/components/App/StateBadge.vue";
import appStore from '@/store/app'

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
    const isOnLine = computed(() => appStore.getIsOnline)
    return {isOnLine}
  }
})
</script>
