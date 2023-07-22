<script setup lang="ts">
import { computed, ref, unref, nextTick } from "vue";
import type { CSSProperties, PropType } from "vue";
import {
  tryOnMounted,
  tryOnUnmounted,
  templateRef,
  useDebounceFn
} from "@vueuse/core";
import * as utilsMethods from "./utils";
const { animationFrame, copyObj } = utilsMethods;
animationFrame();

defineOptions({
  name: "ReSeamlessScroll"
});

const props = defineProps({
  data: {
    type: Array as PropType<unknown>
  },
  classOption: {
    type: Object as PropType<unknown>
  }
});

const emit = defineEmits<{
  (e: "scrollEnd"): void;
}>();

let xPos = ref<number>(0);
let yPos = ref<number>(0);
let delay = ref<number>(0);
let height = ref<number>(0);
// outer container width
let width = ref<number>(0);
// Chiều rộng thực tế của nội dung
let realBoxWidth = ref<number>(0);
let realBoxHeight = ref<number>(0);
let copyHtml = ref("");
// single Single-step scrolling timer
let singleWaitTime = null;
// animationFrame timer for move animation
let reqFrame = null;
let startPos = null;
// Ghi lại posY tại touchStart
let startPosY = null;
// Ghi lại posX tại touchStart
let startPosX = null;
// mouseenter mouseleave Control the switch of scrollMove()
let isHover = false;
let ease = "ease-in";

// eslint-disable-next-line vue/no-setup-props-destructure
let { classOption } = props;

if (classOption["key"] === undefined) {
  classOption["key"] = 0;
}

const wrap = templateRef<HTMLElement | null>(`wrap${classOption["key"]}`, null);
const slotList = templateRef<HTMLElement | null>(
  `slotList${classOption["key"]}`,
  null
);
const realBox = templateRef<HTMLElement | null>(
  `realBox${classOption["key"]}`,
  null
);

let leftSwitchState = computed(() => {
  return unref(xPos) < 0;
});

let rightSwitchState = computed(() => {
  return Math.abs(unref(xPos)) < unref(realBoxWidth) - unref(width);
});

let defaultOption = computed(() => {
  return {
    // step size
    step: 1,
    // Cho phép cuộn liền mạch số lượng dữ liệu tối thiểu
    limitMoveNum: 5,
    //Whether to enable mouse hover control
    hoverStop: true,
    // bottom, top(mặc định), left, right
    direction: "top",
    // Enable mobile touch
    openTouch: true,
    // A single data height has a value hoverStop closed
    singleHeight: 0,
    // A single data width has a value hoverStop closed
    singleWidth: 0,
    // single step stop wait time
    waitTime: 1000,
    switchOffset: 30,
    autoPlay: true,
    navigation: false,
    switchSingleStep: 134,
    switchDelay: 400,
    switchDisabledClass: "disabled",
    // singleWidth/singleHeight Có bật tính năng đo lường lại hay không
    isSingleRemUnit: false
  };
});

let options = computed(() => {
  // @ts-expect-error
  return copyObj({}, unref(defaultOption), classOption);
});

const leftSwitchClass = computed(() => {
  return unref(leftSwitchState) ? "" : unref(options).switchDisabledClass;
});

let rightSwitchClass = computed(() => {
  return unref(rightSwitchState) ? "" : unref(options).switchDisabledClass;
});

let leftSwitch = computed((): CSSProperties => {
  return {
    position: "absolute",
    margin: `${unref(height) / 2}px 0 0 -${unref(options).switchOffset}px`,
    transform: "translate(-100%,-50%)"
  };
});

let rightSwitch = computed((): CSSProperties => {
  return {
    position: "absolute",
    margin: `${unref(height) / 2}px 0 0 ${
      unref(width) + unref(options).switchOffset
    }px`,
    transform: "translateY(-50%)"
  };
});

let isHorizontal = computed(() => {
  return (
    unref(options).direction !== "bottom" && unref(options).direction !== "top"
  );
});

let float = computed((): CSSProperties => {
  return unref(isHorizontal)
    ? { float: "left", overflow: "hidden" }
    : { overflow: "hidden" };
});

let pos = computed(() => {
  return {
    transform: `translate(${unref(xPos)}px,${unref(yPos)}px)`,
    transition: `all ${ease} ${unref(delay)}ms`,
    overflow: "hidden"
  };
});

let navigation = computed(() => {
  return unref(options).navigation;
});

let autoPlay = computed(() => {
  if (unref(navigation)) return false;
  return unref(options).autoPlay;
});

let scrollSwitch = computed(() => {
  // Properties deconstructed from props no longer have correspondence.
  return (props.data as any).length >= unref(options).limitMoveNum;
});

let hoverStopSwitch = computed(() => {
  return unref(options).hoverStop && unref(autoPlay) && unref(scrollSwitch);
});

let canTouchScroll = computed(() => {
  return unref(options).openTouch;
});

let baseFontSize = computed(() => {
  return unref(options).isSingleRemUnit
    ? parseInt(window.getComputedStyle(document.documentElement, null).fontSize)
    : 1;
});

let realSingleStopWidth = computed(() => {
  return unref(options).singleWidth * unref(baseFontSize);
});

let realSingleStopHeight = computed(() => {
  return unref(options).singleHeight * unref(baseFontSize);
});

let step = computed(() => {
  let singleStep;
  let step = unref(options).step;
  if (unref(isHorizontal)) {
    singleStep = unref(realSingleStopWidth);
  } else {
    singleStep = unref(realSingleStopHeight);
  }
  if (singleStep > 0 && singleStep % step > 0) {
    throw "If single-step scrolling is set, the step must be a submultiple of the single-step size, otherwise it cannot be guaranteed that the position where the single-step scrolling ends is accurate";
  }
  return step;
});

function reset() {
  xPos.value = 0;
  yPos.value = 0;
  scrollCancle();
  scrollInitMove();
}

function leftSwitchClick() {
  if (!unref(leftSwitchState)) return;
  // less than one-step distance
  if (Math.abs(unref(xPos)) < unref(options).switchSingleStep) {
    xPos.value = 0;
    return;
  }
  xPos.value += unref(options).switchSingleStep;
}

function rightSwitchClick() {
  if (!unref(rightSwitchState)) return;
  // less than one-step distance
  if (
    unref(realBoxWidth) - unref(width) + unref(xPos) <
    unref(options).switchSingleStep
  ) {
    xPos.value = unref(width) - unref(realBoxWidth);
    return;
  }
  xPos.value -= unref(options).switchSingleStep;
}

function scrollCancle() {
  cancelAnimationFrame(reqFrame || "");
}

function touchStart(e) {
  if (!unref(canTouchScroll)) return;
  let timer;
  // The touches array object gets all the touches on the screen, and takes the first touch
  const touch = e.targetTouches[0];
  const { waitTime, singleHeight, singleWidth } = unref(options);
  // Lấy giá trị tọa độ của lần chạm đầu tiên
  startPos = {
    x: touch.pageX,
    y: touch.pageY
  };
  // Ghi lại posY tại touchStart
  startPosY = unref(yPos);
  // Ghi lại posX tại touchStart
  startPosX = unref(xPos);
  if (!!singleHeight && !!singleWidth) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      scrollCancle();
    }, waitTime + 20);
  } else {
    scrollCancle();
  }
}

function touchMove(e) {
  // When the screen has multiple touches or the page is zoomed, the move operation is not performed
  if (
    !unref(canTouchScroll) ||
    e.targetTouches.length > 1 ||
    (e.scale && e.scale !== 1)
  )
    return;
  const touch = e.targetTouches[0];
  const { direction } = unref(options);
  let endPos = {
    x: touch.pageX - startPos.x,
    y: touch.pageY - startPos.y
  };
  // Hành vi mặc định của việc ngăn chặn các sự kiện chạm, tức là để ngăn việc cuộn
  e.preventDefault();
  // dir, 1 cho trượt dọc, 0 cho trượt ngang
  const dir = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1 : 0;
  if (
    (dir === 1 && direction === "bottom") ||
    (dir === 1 && direction === "top")
  ) {
    // Cho biết hướng chuyển động trượt && theo chiều dọc là lên và xuống
    yPos.value = startPosY + endPos.y;
  } else if (
    (dir === 0 && direction === "left") ||
    (dir === 0 && direction === "right")
  ) {
    // Đối với trượt ngang & & hướng chuyển động là trái và phải
    xPos.value = startPosX + endPos.x;
  }
}

function touchEnd() {
  if (!unref(canTouchScroll)) return;
  let timer;
  const direction = unref(options).direction;
  delay.value = 50;
  if (direction === "top") {
    if (unref(yPos) > 0) yPos.value = 0;
  } else if (direction === "bottom") {
    let h = (unref(realBoxHeight) / 2) * -1;
    if (unref(yPos) < h) yPos.value = h;
  } else if (direction === "left") {
    if (unref(xPos) > 0) xPos.value = 0;
  } else if (direction === "right") {
    let w = unref(realBoxWidth) * -1;
    if (unref(xPos) < w) xPos.value = w;
  }
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    delay.value = 0;
    scrollMove();
  }, unref(delay));
}

function enter() {
  if (unref(hoverStopSwitch)) scrollStopMove();
}

function leave() {
  if (unref(hoverStopSwitch)) scrollStartMove();
}

function scrollMove() {
  // Chặn scrollMove khi chuột di chuyển vào
  if (isHover) return;
  // Nhập di chuyển để xóa hoạt ảnh ngay lập tức để ngăn việc touchMove thường xuyên gây ra nhiều hoạt ảnh cùng một lúc
  // scrollCancle();
  reqFrame = requestAnimationFrame(function () {
    // chiều cao thực tế
    const h = unref(realBoxHeight) / 2;
    // bề rộng
    const w = unref(realBoxWidth) / 2;
    let { direction, waitTime } = unref(options);
    if (direction === "top") {
      // Up
      if (Math.abs(unref(yPos)) >= h) {
        emit("scrollEnd");
        yPos.value = 0;
      }
      yPos.value -= step.value;
    } else if (direction === "bottom") {
      // Down
      if (unref(yPos) >= 0) {
        emit("scrollEnd");
        yPos.value = h * -1;
      }
      yPos.value += step.value;
    } else if (direction === "left") {
      // left
      if (Math.abs(unref(xPos)) >= w) {
        emit("scrollEnd");
        xPos.value = 0;
      }
      xPos.value -= step.value;
    } else if (direction === "right") {
      // right
      if (unref(xPos) >= 0) {
        emit("scrollEnd");
        xPos.value = w * -1;
      }
      xPos.value += step.value;
    }
    if (singleWaitTime) clearTimeout(singleWaitTime);
    if (unref(realSingleStopHeight)) {
      // Cấu hình tạm dừng một dòng có được bật hay không
      if (Math.abs(unref(yPos)) % unref(realSingleStopHeight) < unref(step)) {
        // Đủ điều kiện để tạm dừng thời gian chờ
        singleWaitTime = setTimeout(() => {
          scrollMove();
        }, waitTime);
      } else {
        scrollMove();
      }
    } else if (unref(realSingleStopWidth)) {
      if (Math.abs(unref(xPos)) % unref(realSingleStopWidth) < unref(step)) {
        // Đủ điều kiện để tạm dừng thời gian chờ
        singleWaitTime = setTimeout(() => {
          scrollMove();
        }, waitTime);
      } else {
        scrollMove();
      }
    } else {
      scrollMove();
    }
  });
}

function scrollInitMove() {
  nextTick(() => {
    const { switchDelay } = unref(options);
    // clear copy
    copyHtml.value = "";
    if (unref(isHorizontal)) {
      height.value = unref(wrap).offsetHeight;
      width.value = unref(wrap).offsetWidth;
      let slotListWidth = unref(slotList).offsetWidth;
      // Đặt warp width cho cuộn ngang
      if (unref(autoPlay)) {
        // Fix offsetWidth rounding
        slotListWidth = slotListWidth * 2 + 1;
      }
      unref(realBox).style.width = slotListWidth + "px";
      realBoxWidth.value = slotListWidth;
    }

    if (unref(autoPlay)) {
      ease = "ease-in";
      delay.value = 0;
    } else {
      ease = "linear";
      delay.value = switchDelay;
      return;
    }

    // Whether it can be scrolled to judge
    if (unref(scrollSwitch)) {
      let timer;
      if (timer) clearTimeout(timer);
      copyHtml.value = unref(slotList).innerHTML;
      setTimeout(() => {
        realBoxHeight.value = unref(realBox).offsetHeight;
        scrollMove();
      }, 0);
    } else {
      scrollCancle();
      yPos.value = xPos.value = 0;
    }
  });
}

function scrollStartMove() {
  // Bật scrollMove
  isHover = false;
  scrollMove();
}

function scrollStopMove() {
  // close scrollMove
  isHover = true;
  // Ngăn chặn việc di chuột thường xuyên vào và ra khỏi cuộn một bước, khiến bộ hẹn giờ bị rối
  if (singleWaitTime) clearTimeout(singleWaitTime);
  scrollCancle();
}

// mouse wheel event
function wheel(e) {
  e.preventDefault();
  if (
    unref(options).direction === "left" ||
    unref(options).direction === "right"
  )
    return;
  useDebounceFn(() => {
    e.deltaY > 0 ? (yPos.value -= step.value) : (yPos.value += step.value);
  }, 50)();
}

// watchEffect(() => {
//   const watchData = data;
//   if (!watchData) return;
//   nextTick(() => {
//     reset();
//   });

//   const watchAutoPlay = unref(autoPlay);
//   if (watchAutoPlay) {
//     reset();
//   } else {
//     scrollStopMove();
//   }
// });

tryOnMounted(() => {
  scrollInitMove();
});

tryOnUnmounted(() => {
  scrollCancle();
  clearTimeout(singleWaitTime);
});

defineExpose({
  reset
});
</script>

<template>
  <div :ref="'wrap' + classOption['key']">
    <div
      :style="leftSwitch"
      v-if="navigation"
      :class="leftSwitchClass"
      @click="leftSwitchClick"
    >
      <slot name="left-switch" />
    </div>
    <div
      :style="rightSwitch"
      v-if="navigation"
      :class="rightSwitchClass"
      @click="rightSwitchClick"
    >
      <slot name="right-switch" />
    </div>
    <div
      :ref="'realBox' + classOption['key']"
      :style="pos"
      @mouseenter="enter"
      @mouseleave="leave"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
      @mousewheel="wheel"
    >
      <div :ref="'slotList' + classOption['key']" :style="float">
        <slot />
      </div>
      <div v-html="copyHtml" :style="float" />
    </div>
  </div>
</template>
