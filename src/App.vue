<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>

<!--<template>-->
<!--  <div></div>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--  import {defineComponent} from '@vue/composition-api';-->
<!--  -->
<!--  export default defineComponent({-->
<!--    name: ""-->
<!--  });-->
<!--</script>-->

<script lang="ts">
import appStore from '@/store/app'
import "@/assets/scss/app.scss";
import {defineComponent, onMounted} from '@vue/composition-api';
import {themeModes} from '@/api/types/apiTypes'

export default defineComponent({
  name: "App",
  props: {},
  setup() {
    const detectSystemTheme = (): themeModes => {
      if (!window.matchMedia) {
        return themeModes.LIGHT
      }
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
      return isDarkMode ? themeModes.DARK : themeModes.LIGHT
    }

    const detectLocalStorageTheme = (): themeModes => {
      let colorSchema = `${window.localStorage.getItem('colorSchema')}` as themeModes
      if (!(colorSchema in themeModes)) {
        colorSchema = themeModes.AUTO
      }
      return colorSchema
    }

    const detectTheme = (): themeModes => {
      let theme: themeModes
      const localStorageTheme = detectLocalStorageTheme()
      if (localStorageTheme === themeModes.AUTO) {
        theme = detectSystemTheme()
      } else {
        theme = localStorageTheme
      }
      return theme
    }

    onMounted(() => {
      appStore.SET_THEME_MODE(detectTheme())
      window
          .matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', () => {
            appStore.SET_THEME_MODE(detectTheme())
          })
      document.dispatchEvent(new Event('app-rendered'));
    })

    return {};
  }
});
</script>
