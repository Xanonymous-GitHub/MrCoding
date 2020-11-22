<template>
  <v-main>
    <SelfCard :key="selfCardKey" :current-user="currentUser" :is-dark-mode="isDarkMode"
              @refresh-avatar="refreshAvatar"/>
    <NewTeacherDialog :key="dialogCardKey" :is-dark-mode="isDarkMode" @creation-done="refreshUserCardKey"/>
    <UserCard :key="userCardKey" :is-dark-mode="isDarkMode"/>
  </v-main>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, toRefs, onMounted, nextTick} from "@vue/composition-api";
import appStore from "@/store/app";
import replaceAvatar from "@/utils/replaceAvatar";
import SelfCard from "@/components/dashboard/settingComponents/SelfCard.vue";
import NewTeacherDialog from "@/components/dashboard/settingComponents/NewTeacherDialog.vue";
import UserCard from "@/components/dashboard/settingComponents/UserCard.vue";

export default defineComponent({
  name: "Settings",
  components: {
    SelfCard,
    NewTeacherDialog,
    UserCard
  },
  setup(_, {emit}) {
    const data = reactive({
      isDarkMode: computed(() => appStore.isDarkMode),
      currentUser: computed(() => appStore.getCurrentUser),
      userCardKey: 0,
      selfCardKey: 99999,
      dialogCardKey: 878787,
    })

    const refreshUserCardKey = () => {
      data.userCardKey++
    }

    const refreshDialogCardKey = () => {
      data.dialogCardKey++
    }

    const refreshAvatar = () => {
      refreshUserCardKey()
      refreshDialogCardKey()
      nextTick(() => replaceAvatar(appStore.getCurrentUser?.avatar, document.querySelector('.profile') as HTMLElement))
      emit('refresh-avatar')
    }

    onMounted(() => {
      replaceAvatar(appStore.getCurrentUser?.avatar, document.querySelector('.profile') as HTMLElement)
    })

    return {
      refreshUserCardKey,
      refreshAvatar,
      ...toRefs(data)
    }
  }
})
</script>
