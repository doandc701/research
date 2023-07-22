<script setup lang="ts">
import { useDetail } from "./hooks";

defineOptions({
  name: "TabDetail"
});

const { initToDetail, id } = useDetail();
initToDetail();
</script>

<template>
  <div>{{ id }} - Details page is here</div>
</template>
