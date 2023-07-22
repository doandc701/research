<script setup lang="ts">
import { computed } from "vue";

defineOptions({
  name: "Symbol"
});

const props = defineProps({
  src: String,
  size: { type: Number, default: 28 }
});

const url = computed(() => {
  return props.src ? props.src : "/@/img/fallback.png";
});
</script>

<template>
  <div>
    <div class="symbol" :style="{ width: size + 'px', height: size + 'px' }">
      <img :src="url" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
