<template>
  <VApp>
    <main id="chatroom-redirect" class="page-container">
      Redirect to chatroom ......
    </main>
  </VApp>
</template>

<script lang="ts">
import {defineComponent, onMounted} from '@vue/composition-api';
import '@/assets/scss/pages/chatroom-redirect.scss';
import autoLogin from "@/api/accountManager";
import appStore from '@/store/app'
import {UserType} from "@/api/types/apiTypes";
import router from "@/router";
import {VApp} from 'vuetify/lib';

export default defineComponent({
  name: "ChatroomRedirect",
  components: {
    VApp
  },
  setup() {
    onMounted(async () => {
      try {
        await autoLogin()
        if (appStore.getUserType !== UserType.LIFFUSER) {
          await router.replace('/')
        }
      } catch (e) {
        alert(e)
      }
    })
    return
  }
})
</script>

