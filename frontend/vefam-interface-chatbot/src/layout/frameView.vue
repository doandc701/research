<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ref, unref, onMounted, nextTick } from "vue";

defineOptions({
  name: "FrameView"
});

const { t } = useI18n();
const loading = ref(true);
const currentRoute = useRoute();
const frameSrc = ref<string>("");
const frameRef = ref<HTMLElement | null>(null);

const curr = unref(currentRoute.meta);
if (curr && curr.frameSrc) {
  frameSrc.value = curr.frameSrc as string;
}
curr && curr.frameLoading === false && hideLoading();

function hideLoading() {
  loading.value = false;
}

function init() {
  nextTick(() => {
    const iframe = unref(frameRef);
    if (!iframe) return;
    const _frame = iframe as any;
    if (_frame.attachEvent) {
      _frame.attachEvent("onload", () => {
        hideLoading();
      });
    } else {
      iframe.onload = () => {
        hideLoading();
      };
    }
  });
}

onMounted(() => {
  init();
});
</script>

<template>
  <div
    class="frame"
    v-loading="loading"
    :element-loading-text="t('status.hsLoad')"
  >
    <iframe :src="frameSrc" class="frame-iframe" ref="frameRef" />
  </div>
</template>

<style lang="scss" scoped>
.frame {
  height: calc(100vh - 62px);
  z-index: 998;

  .frame-iframe {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 0;
    box-sizing: border-box;
  }
}

.main-content {
  margin: 2px 0 0 !important;
}
</style>
