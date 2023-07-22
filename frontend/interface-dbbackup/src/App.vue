<script setup lang="ts">
import { RouterView } from "vue-router";
import Navigation from "./components/nav/index.vue";
</script>

<template>
  <Navigation />
  <header>
    <div class="wrapper"></div>
  </header>

  <RouterView />
</template>

<style scoped></style>
