<script setup lang="ts">
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";

defineOptions({
  name: "Guide"
});

const steps = [
  {
    element: "#header-notice",
    popover: {
      title: "notification",
      description: "You can view messages sent by administrators here",
      position: "left"
    }
  },
  {
    element: "#header-screenfull",
    popover: {
      title: "Full screen",
      description: "You can toggle fullscreen here",
      position: "left"
    }
  },
  {
    element: "#header-translation",
    popover: {
      title: "Globalization",
      description: "You can switch languages here",
      position: "left"
    }
  },
  {
    element: ".el-icon-setting",
    popover: {
      title: "Project configuration",
      description: "You can view the project configuration here",
      position: "left"
    }
  },
  {
    element: ".tags-view",
    popover: {
      title: "multi-tab",
      description: "Here is the history of the pages you have visited",
      position: "buttom"
    }
  }
];

const driver = new Driver({
  className: "scoped-class",
  animate: true,
  opacity: 0.75,
  padding: 0,
  allowClose: true,
  overlayClickNext: false,
  doneBtnText: "Finish",
  closeBtnText: "Closure",
  nextBtnText: "Next step",
  prevBtnText: "Previous"
});

const guide = () => {
  driver.defineSteps(steps);
  driver.start();
};
</script>

<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span class="font-medium">
          Trang giới thiệu hữu ích cho một số người lần đầu vào dự án, có thể
          giới thiệu sơ qua về các chức năng của dự án
        </span>
      </div>
    </template>
    <el-button
      type="primary"
      style="margin-top: 10px"
      @click.prevent.stop="guide"
    >
      Mở trang giới thiệu
    </el-button>
  </el-card>
</template>

<style>
div#driver-highlighted-element-stage,
div#driver-page-overlay {
  background: transparent !important;
  outline: 5000px solid rgba(0, 0, 0, 0.75);
}
</style>
