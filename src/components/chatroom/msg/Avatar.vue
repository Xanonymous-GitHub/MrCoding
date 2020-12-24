<template>
  <span class="avatar">
    <VAvatar class="mx-2" size="24px">
      <VIcon v-if="!avatar" :dark="isDarkMode">
        mdi-account-circle
      </VIcon>
      <v-img
          v-if="avatar"
          :src="avatar"
          alt="Avatar"
          class="avatar"
      ></v-img>
    </VAvatar>
    <VIcon v-if="verified" class="verified-badge verified-badge__layer" x-small>mdi-checkbox-blank-circle</VIcon>
    <VIcon v-if="verified" class="verified-badge" x-small>mdi-check-decagram</VIcon>
  </span>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import {VAvatar, VIcon} from 'vuetify/lib';
import '@/assets/scss/components/chatroom/msg/_avatar.scss'

export default defineComponent({
  name: 'Avatar',
  components: {
    VAvatar,
    VIcon
  },
  props: {
    avatar: {
      required: false,
      type: String
    },
    isDarkMode: {
      required: false,
      type: Boolean
    },
    verified: {
      type: Boolean,
      required: false
    }
  }
})
</script>
