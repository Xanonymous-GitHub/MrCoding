<template>
  <div id="app">
    <main class="page-container" id="not-found">
      <div class="_404">
        <div class="_404svg">
          <svg viewBox="0 0 960 300" preserveAspectRatio="xMidYMid meet">
            <symbol id="s-text">
              <text text-anchor="middle" x="50%" y="50%">404</text>
            </symbol>
            <g class="g-ants">
              <use class="text" xlink:href="#s-text"></use>
              <use class="text" xlink:href="#s-text"></use>
              <use class="text" xlink:href="#s-text"></use>
              <use class="text" xlink:href="#s-text"></use>
              <use class="text" xlink:href="#s-text"></use>
            </g>
          </svg>
        </div>
        <svg class="logo" fill="black" viewBox="0 0 2703 630">
          <use xlink:href="#npc_text.svg"/>
          _
        </svg>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api';
import '@/assets/scss/pages/not-found.scss'
import '@/assets/images/npc_text.svg'
export default defineComponent({
  name: "NotFound",
});
</script>
