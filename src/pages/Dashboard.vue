<template>
  <VApp>
    <main id="dashboard" class="page-container">
      <div class="dashboard-field">
        <div class="chatroom-list">

          <v-card v-for="(chatroom, key) in chatroomBundle" :key="key" :dark="isDarkMode" class="chatroom-card" elevation="2"
                  hover outlined rounded shaped tile>
            <v-card-title>
              Mr.Coding Chatroom
            </v-card-title>
            <v-card-text>
              {{ chatroom._id }}
            </v-card-text>
            <v-card-actions>
              <v-btn :href="'/chatroom/'+chatroom._id" color="primary" depressed rel="noreferrer noopener"
                     target="_blank" text>Enter
              </v-btn>
              <v-btn color="error" depressed text>Close</v-btn>
            </v-card-actions>
          </v-card>

        </div>
      </div>
    </main>
  </VApp>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, reactive, toRefs} from "@vue/composition-api";
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
      chatroomBundle: [] as Array<ChatRoom>,
      isDarkMode: computed(() => appStore.isDarkMode)
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
