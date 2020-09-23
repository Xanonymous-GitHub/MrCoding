<template>
  <VAvatar class="mx-2" size="24px">
    <VIcon v-if="!avatar" :dark="isDarkMode">
      mdi-account-circle
    </VIcon>
    <img
        v-if="avatar"
        :src="avatar"
        alt="Avatar"
        class="avatar"
    >
  </VAvatar>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api'
import {VAvatar, VIcon} from 'vuetify/lib';

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
    }
  }
})
</script>
