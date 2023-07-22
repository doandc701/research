<template>
  <div class="symbol" :style="{ width: size + 'px', height: size + 'px' }">
    <img :src="url" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Symbol",
  props: {
    src: String,
    size: { type: Number, default: 28 }
  },
  computed: {
    url(): string {
      return this.src ? this.src : "./img/fallback.png";
    }
  }
});
</script>

<style scoped>
.symbol {
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  outline: 1px solid #0000000d;
  background-color: white;
  width: 28px;
  height: 28px;
  overflow: hidden;
}
.symbol img {
  width: 100%;
  height: 100%;
}
</style>
