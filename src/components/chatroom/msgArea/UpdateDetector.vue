<template>
  <div id="update-detector">
    <div id="update-detector__heading-line" style="height: 1px"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "@vue/composition-api";

export default defineComponent({
  name: "UpdateDetector",
  setup() {
    onMounted(() => {
      const appBar = document.getElementById('app-bar') as HTMLDivElement
      const self = document.getElementById('update-detector') as HTMLDivElement
      self.setAttribute(
          'style',
          `height:${appBar.clientHeight}px`
      )
    })
    return
  }
})
</script>
