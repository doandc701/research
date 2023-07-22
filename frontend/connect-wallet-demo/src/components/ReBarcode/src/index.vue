<script setup lang="ts">
import JsBarcode from "jsbarcode";
import { ref, onMounted } from "vue";

defineOptions({
  name: "ReBarcode"
});

const props = defineProps({
  tag: {
    type: String,
    default: "canvas"
  },
  text: {
    type: String,
    default: null
  },
  // Full configuration https://github.com/lindell/JsBarcode/wiki/Options
  options: {
    type: Object,
    default() {
      return {};
    }
  },
  // type tương đương với options.format, nếu type và options.format tồn tại đồng thời, giá trị type sẽ được ưu tiên
  type: {
    type: String,
    default: "CODE128"
  }
});

const wrapEl = ref(null);

onMounted(() => {
  const opt = { ...props.options, format: props.type };
  JsBarcode(wrapEl.value, props.text, opt);
});
</script>

<template>
  <component :is="tag" ref="wrapEl" />
</template>
