<template>
  <span>{{ displayString }}</span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import { address } from "thor-devkit";

export default defineComponent({
  name: "Address",
  props: {
    addr: String
  },
  computed: {
    displayString() {
      if (typeof this.addr !== "string" || this.addr.length <= 0) return "";
      /*
      if (!address.test(this.addr)) {
        return "";
      }*/
      return this.addr.slice(0, 5) + "..." + this.addr.slice(-4);
      /*
      if (!address.test(this.addr)) {
        return ''
      }
      const checksumed = address.toChecksumed(this.addr)
      // console.log('Address', this.addr)
      // console.log('checksumed', checksumed)
      return checksumed.slice(0, 5) + '...' + checksumed.slice(-4)*/
    }
  }
});
</script>
