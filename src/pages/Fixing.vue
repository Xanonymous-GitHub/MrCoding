<template>
  <v-app>
    <div class="website-fixing-svg">
      <Logo/>
      <RotatingIcon/>
      <div class="website-fixing-svg__message--small">
        Mr.Coding
      </div>
      <div class="website-fixing-svg__message">
        Coming Soon
      </div>
    </div>
  </v-app>
</template>

<script lang="ts">
import {defineComponent, onMounted} from '@vue/composition-api';
import Logo from '@/components/fixing/logo.vue';
import RotatingIcon from '@/components/fixing/RotatingIcon.vue'

export default defineComponent({
  name: 'Fixing',
  components: {
    Logo,
    RotatingIcon
  },
  setup() {
    onMounted(() => {
      document.dispatchEvent(new Event('app-rendered'));
    });
    return;
  }
});
</script>

<style lang="scss" scoped>

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotating {
  animation: rotating 2s linear infinite;
}

.website-fixing-svg {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  user-select: none;
  height: 40rem;
  width: 100%;
  text-align: center;
  margin: 0;
  padding: 0;
  @at-root &__message {
    cursor: default;
    height: min-content;
    margin: 0;
    font-size: 2rem;
    font-weight: bold;
    padding-bottom: 3rem;
    &--small {
      cursor: default;
    }
  }
}

</style>
