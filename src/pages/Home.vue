<template>
  <VApp/>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
} from '@vue/composition-api';

import {VApp} from 'vuetify/lib';
export default defineComponent({
  name: "Home",
  props: {},
  components: {
    VApp,
  },
  setup() {
    onMounted(async () => {
      document.dispatchEvent(new Event('app-rendered'));
    })
    return {};
  }
});
</script>
