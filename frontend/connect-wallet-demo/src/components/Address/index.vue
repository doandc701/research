<script setup lang="ts">
import { computed } from "vue";
defineOptions({
  name: "Address"
});
const props = defineProps({
  addr: String
});
const displayString = computed(() => {
  if (typeof props.addr !== "string" || props.addr.length <= 0) return "";
  /*
      if (!address.test(this.addr)) {
        return "";
      }*/
  return props.addr.slice(0, 5) + "..." + props.addr.slice(-4);
  /*
      if (!address.test(this.addr)) {
        return ''
      }
      const checksumed = address.toChecksumed(this.addr)
      // console.log('Address', this.addr)
      // console.log('checksumed', checksumed)
      return checksumed.slice(0, 5) + '...' + checksumed.slice(-4)*/
});
</script>

<template>
  <div>
    <span>{{ displayString }}</span>
  </div>
</template>

<style scoped></style>
