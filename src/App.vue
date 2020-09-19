<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import appStore from '@/store/app'
import "@/assets/scss/app.scss";
import {defineComponent, onMounted} from '@vue/composition-api';
import {ThemeModes} from '@/api/types/apiTypes'

export default defineComponent({
  name: "App",
  props: {},
  setup() {
    const detectSystemTheme = (): ThemeModes => {
      if (!window.matchMedia) {
        return ThemeModes.LIGHT
      }
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
      return isDarkMode ? ThemeModes.DARK : ThemeModes.LIGHT
    }

    const detectLocalStorageTheme = (): ThemeModes => {
      let colorSchema = `${window.localStorage.getItem('colorSchema')}` as ThemeModes
      if (!(colorSchema in ThemeModes)) {
        colorSchema = ThemeModes.AUTO
      }
      return colorSchema
    }

    const detectTheme = (): ThemeModes => {
      let theme: ThemeModes
      const localStorageTheme = detectLocalStorageTheme()
      if (localStorageTheme === ThemeModes.AUTO) {
        theme = detectSystemTheme()
      } else {
        theme = localStorageTheme
      }
      return theme
    }

    onMounted(() => {
      document.dispatchEvent(new Event('app-rendered'));
      appStore.SET_THEME_MODE(detectTheme())
      window
          .matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', () => {
            appStore.SET_THEME_MODE(detectTheme())
          })
    })

    return {};
  }
});
</script>
