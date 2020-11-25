<template>
  <svg height="50%" viewBox="0 0 24 24" width="100%" xmlns="http://www.w3.org/2000/svg">
    <defs/>
    <path d="M0 0h24v24H0z" fill="#fff"/>
    <path
      d="M6 4v12l4-4 8 4V4l-4 4-8-4zM18 20v-1h1v1zM6 20h1v-2h1v2h1v-3H6zM10 20l1-2h1v1h-1v1h2v-3h-3zM17 17h-3v3h3v-1h-2v-1h2z"/>
  </svg>
</template>

<script lang="ts">
  import {defineComponent} from '@vue/composition-api';

  export default defineComponent({
    name: 'Logo',
  });
</script>
