<template>
  <v-app>
    <main class="page-container" id="chatroom-redirect">
      Redirect to chatroom ......
    </main>
  </v-app>
</template>

<script lang="ts">
import {defineComponent, onMounted} from '@vue/composition-api';
import '@/assets/scss/pages/chatroom-redirect.scss';
import autoLogin from "@/api/accountManager";

export default defineComponent({
  name: "ChatroomRedirect",
  setup(_, vm) {
    onMounted(() => {
      autoLogin(vm.root.$route)
      // const route = vm.root.$route.query['liff.state'] as string
      // console.log(route)
    })
    return
  }
})
</script>

