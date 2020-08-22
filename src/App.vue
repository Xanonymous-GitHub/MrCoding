<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
// import "@/assets/scss/app.scss";
import {defineComponent} from '@vue/composition-api';

export default defineComponent({
  name: "App",
  props: {},
  setup() {
    return {};
  }
});
</script>
