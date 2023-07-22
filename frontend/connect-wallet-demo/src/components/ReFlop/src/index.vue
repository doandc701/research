<script setup lang="ts">
import { ref, unref, nextTick, onUnmounted } from "vue";
import { templateRef } from "@vueuse/core";
import flippers from "./filpper";

let timer = ref(null);
let flipObjs = ref([]);

const flipperHour1 = templateRef<HTMLElement | null>("flipperHour1", null);
const flipperHour2 = templateRef<HTMLElement | null>("flipperHour2", null);
const flipperMinute1 = templateRef<HTMLElement | null>("flipperMinute1", null);
const flipperMinute2 = templateRef<HTMLElement | null>("flipperMinute2", null);
const flipperSecond1 = templateRef<HTMLElement | null>("flipperSecond1", null);
const flipperSecond2 = templateRef<HTMLElement | null>("flipperSecond2", null);

// khởi tạo số
const init = () => {
  let now = new Date();
  let nowTimeStr = formatDate(new Date(now.getTime()), "hhiiss");
  for (let i = 0; i < flipObjs.value.length; i++) {
    flipObjs.value[i].setFront(nowTimeStr[i]);
  }
};

// start the timer
const run = () => {
  timer.value = setInterval(() => {
    // get current time
    let now = new Date();
    let nowTimeStr = formatDate(new Date(now.getTime() - 1000), "hhiiss");
    let nextTimeStr = formatDate(now, "hhiiss");
    for (let i = 0; i < flipObjs.value.length; i++) {
      if (nowTimeStr[i] === nextTimeStr[i]) {
        continue;
      }
      flipObjs.value[i].flipDown(nowTimeStr[i], nextTimeStr[i]);
    }
  }, 1000);
};

// Regular format date
const formatDate = (date: Date, dateFormat: string) => {
  /* Format the year alone, output the year based on the number of characters in y
     * Ví dụ: yyyy => 2019
            yy => 19
            y => 9
     */
  if (/(y+)/.test(dateFormat)) {
    dateFormat = dateFormat.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  // Format month, day, hour, minute, second
  let o = {
    "m+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "i+": date.getMinutes(),
    "s+": date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(dateFormat)) {
      // get the corresponding value
      let str = o[k] + "";
      /* Theo định dạng đã đặt, xuất các ký tự tương ứng
       * Ví dụ: 8 giờ sáng，hh => 08，h => 8
       * Tuy nhiên, khi số >= 10, bất kể định dạng là một chữ số hay nhiều chữ số, không thực hiện đánh chặn, điều này không phù hợp với định dạng năm
       * Ví dụ: 15 giờ chiều，hh => 15, h => 15
       */
      dateFormat = dateFormat.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return dateFormat;
};

// Date time zero padding
const padLeftZero = (str: string | any[]) => {
  return ("00" + str).substr(str.length);
};

nextTick(() => {
  flipObjs.value = [
    unref(flipperHour1),
    unref(flipperHour2),
    unref(flipperMinute1),
    unref(flipperMinute2),
    unref(flipperSecond1),
    unref(flipperSecond2)
  ];

  init();
  run();
});

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
});
</script>

<template>
  <div class="flip-clock">
    <flippers ref="flipperHour1" />
    <flippers ref="flipperHour2" />
    <em>:</em>
    <flippers ref="flipperMinute1" />
    <flippers ref="flipperMinute2" />
    <em>:</em>
    <flippers ref="flipperSecond1" />
    <flippers ref="flipperSecond2" />
  </div>
</template>

<style>
.flip-clock .m-flipper {
  margin: 0 3px;
}

.flip-clock em {
  display: inline-block;
  line-height: 102px;
  font-size: 66px;
  font-style: normal;
  vertical-align: top;
}
</style>
