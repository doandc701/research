<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useFullscreen } from "@vueuse/core";

const { t } = useI18n();
const { isSupported, isFullscreen, toggle } = useFullscreen();
</script>

<template>
  <div v-if="isSupported" class="screen-full navbar-bg-hover" @click="toggle">
    <!-- <FontIcon
      :title="
        isFullscreen ? t('buttons.hsexitfullscreen') : t('buttons.hsfullscreen')
      "
      :icon="isFullscreen ? 'team-iconexit-fullscreen' : 'team-iconfullscreen'"
    /> -->
    <IconifyIconOnline
      :icon="
        isFullscreen ? 'ic:outline-fullscreen-exit' : 'ic:outline-fullscreen'
      "
    />
  </div>
</template>

<style scoped>
.screen-full {
  font-size: 26px;
}
</style>
