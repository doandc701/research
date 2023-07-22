<script setup lang="ts">
import { useDark } from "@pureadmin/utils";

interface Props {
  isActive: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false
});
const { isDark } = useDark();

const emit = defineEmits<{
  (e: "toggleClick"): void;
}>();

const toggleClick = () => {
  emit("toggleClick");
};
</script>

<template>
  <div class="container">
    <el-tooltip
      popper-class="leffCollap"
      placement="right"
      :effect="isDark ? 'dark' : 'light'"
      :content="props.isActive ? 'Click to collapse' : 'Click to expand'"
    >
      <IconifyIconOffline
        :icon="props.isActive ? 'menu-fold' : 'menu-unfold'"
        class="cursor-pointer inline-block align-middle color-primary hover:color-primary !dark:hover:color-white w-16px h-16px ml-4 mb-1"
        @click="toggleClick"
      />
    </el-tooltip>
  </div>
</template>

<style lang="scss">
.el-popper.is-light.leffCollap {
  background-color: rgb(8 14 51) !important;
  color: #ffff;
}
.leffCollap {
  .el-popper__arrow::before {
    border: unset !important;
    background: rgb(8 14 51) !important;
  }
}
</style>
<style lang="scss" scoped>
.container {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  box-shadow: 0 0 6px -2px var(--el-color-primary);
}
</style>
