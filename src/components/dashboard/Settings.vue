<template>
  <v-main>
    <SelfCard :current-user="currentUser" :is-dark-mode="isDarkMode"/>
    <NewTeacherDialog :is-dark-mode="isDarkMode" @creation-done="refreshTeacherCardKey"/>
    <UserCard :key="teacherCardKey" :is-dark-mode="isDarkMode"/>
  </v-main>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, toRefs, onMounted} from "@vue/composition-api";
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
  setup() {
    const data = reactive({
      isDarkMode: computed(() => appStore.isDarkMode),
      currentUser: computed(() => appStore.getCurrentUser),
      teacherCardKey: 0
    })

    const refreshTeacherCardKey = () => {
      data.teacherCardKey++
    }

    onMounted(() => {
      replaceAvatar(appStore.getCurrentUser?.avatar, document.querySelector('.profile') as HTMLElement)
    })

    return {
      refreshTeacherCardKey,
      ...toRefs(data)
    }
  }
})
</script>
