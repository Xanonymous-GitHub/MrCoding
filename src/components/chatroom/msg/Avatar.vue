<template>
  <v-avatar class="mx-2" size="24px">
    <v-icon :dark="isDarkMode" v-if="!avatar">
      mdi-account-circle
    </v-icon>
    <img
        :src="avatar"
        alt="Avatar"
        class="avatar"
        v-if="avatar"
    >
  </v-avatar>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'

export default defineComponent({
  name: 'Avatar',
  props: {
    avatar: {
      required: false,
      type: String
    },
    isDarkMode: {
      required: false,
      type: Boolean
    }
  }
})
</script>
