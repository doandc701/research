<script setup lang="ts">
import { computed } from "vue";
import { BigNumber } from "bignumber.js";

defineOptions({
  name: "Amount"
});

const props = defineProps({
  balance: String,
  decimals: { type: Number, default: 18 },
  precision: { type: Number, default: 6 },
  format: { type: Number, default: 3 }
});

const formatted = computed(() => {
  if (!props.balance) {
    return "";
  }
  const bn = new BigNumber(props.balance);
  return bn
    .dividedBy(`1e${props.decimals}`)
    .precision(props.precision)
    .toFormat(); // toFormat(this.format)
});
</script>

<template>
  <span>{{ formatted }}</span>
</template>

<style scoped></style>
