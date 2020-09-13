<template>
  <v-app>
    <main class="page-container" id="dashboard">
      <div class="dashboard-field">
        <div class="chatroom-list">
          <a :href="'/chatroom/'+chatroom._id" :key="key" class="chatroom"
             rel="noreferrer noopener" target="_blank" v-for="(chatroom, key) in chatroomBundle">
            {{ chatroom._id }}
          </a>
        </div>
      </div>
    </main>
  </v-app>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from "@vue/composition-api";
import '@/assets/scss/pages/dashboard.scss';
import {getAllChatRooms} from "@/api/api";
import {ChatRoom} from "@/api/types/apiTypes";
import appStore from '@/store/app'
import autoLogin from "@/api/accountManager";

export default defineComponent({
  name: "Dashboard",
  setup() {
    const data = reactive({
      chatroomBundle: [] as Array<ChatRoom>
    })

    onMounted(async () => {
      await autoLogin()
      const jwtToken = appStore.getJwtKey;
      if (jwtToken) {
        data.chatroomBundle = (await getAllChatRooms(jwtToken)) as Array<ChatRoom>
      }
    })
    return {...toRefs(data)}
  }
})
</script>
