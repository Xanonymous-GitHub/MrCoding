<template>
  <div class="home">
    123aoifjaoisjfoaisjfoaisfjoaisfjaoisjfoaisfjaosifjaoisfjaoisfwhehuwfuefhwiueghw
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from '@vue/composition-api';

export default defineComponent({
  name: "Home",
  props: {},
  setup() {
    onMounted(() => {
      document.dispatchEvent(new Event('app-rendered'));
    })

    return {};
  }
});
</script>
