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
<!--  import {defineComponent} from 'vue';-->
<!--  -->
<!--  export default defineComponent({-->
<!--    name: ""-->
<!--  });-->
<!--</script>-->

<script lang="ts">
// import "@/assets/scss/app.scss";
import {defineComponent, onMounted} from '@vue/composition-api';

export default defineComponent({
  name: "App",
  props: {},
  setup() {
    onMounted(() => {
      document.dispatchEvent(new Event('app-rendered'));
    })

    return {};
  }
});
</script>
