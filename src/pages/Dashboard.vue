<template>
  <VApp>
    <main id="dashboard" class="page-container">
      <div class="dashboard-field">
        <div class="chatroom-list">
          <a v-for="(chatroom, key) in chatroomBundle" :key="key" :href="'/chatroom/'+chatroom._id"
             class="chatroom" rel="noreferrer noopener" target="_blank">
            {{ chatroom._id }}
          </a>
        </div>
      </div>
    </main>
  </VApp>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from "@vue/composition-api";
import '@/assets/scss/pages/dashboard.scss';
import {getAllChatRooms} from "@/api/api";
import {ChatRoom} from "@/api/types/apiTypes";
import appStore from '@/store/app'
import autoLogin from "@/api/accountManager";
import {VApp} from 'vuetify/lib';

export default defineComponent({
  name: "Dashboard",
  components: {
    VApp
  },
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
