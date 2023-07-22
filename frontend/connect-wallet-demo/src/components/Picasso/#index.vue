<script lang="ts">
// import { picasso } from "@vechain/picasso";
import picasso from "/@/utils/picasso";
import { defineComponent } from "vue";

export default defineComponent({
  name: "",
  props: {
    value: String
  },
  computed: {
    svg(): string {
      return this.value
        ? `data:image/svg+xml;utf8,${picasso(this.value.toLowerCase())}`
        : "";
    }
  }
});
</script>

<template>
  <img :attr="$attrs" :src="svg" />
</template>
