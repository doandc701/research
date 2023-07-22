<script setup lang="ts">
import { computed } from "vue";
import picasso from "/@/utils/picasso";

defineOptions({
  name: ""
});

const props = defineProps({
  value: String
});

const svg = computed(() => {
  return props.value
    ? `data:image/svg+xml;utf8,${picasso(props.value.toLowerCase())}`
    : "";
});
</script>

<template>
  <img :attr="$attrs" :src="svg" />
</template>

<style scoped></style>
