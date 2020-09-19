<template>
  <v-app>
    <main id="chatroom-redirect" class="page-container">
      Redirect to chatroom ......
    </main>
  </v-app>
</template>

<script lang="ts">
import {defineComponent, onMounted} from '@vue/composition-api';
import '@/assets/scss/pages/chatroom-redirect.scss';
import autoLogin from "@/api/accountManager";
import appStore from '@/store/app'
import {UserType} from "@/api/types/apiTypes";
import router from "@/router";

export default defineComponent({
  name: "ChatroomRedirect",
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

