<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted, onUnmounted } from "vue";
import { useECharts } from "@pureadmin/utils";
import { formatDollarAmount } from "/@/utils/numbers";

import LoadingChart from "../LoadingChart.vue";

const props = defineProps({
  resizeHeight: {
    type: String
  }
});

const isTime = ref("day");
const textTVL = ref();
const textDay = ref();
const dataDate = ref([]);
const isLoading = ref(false);

const lineChartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(lineChartRef as Ref<HTMLDivElement>);

// !method
function handleBtnTime(btn: string) {
  isTime.value = btn;
  getDataAPI();
}

function getDataAPI() {
  isLoading.value = true;

  let lengthLimited = 100;
  const dataTVL = Array.from({ length: lengthLimited }, () =>
    Math.floor(Math.random() * 10000000)
  );

  let arrayRandomDate = [];
  for (let i = 0; i < lengthLimited; i++) {
    const randomDate = new Date(new Date() - Math.random() * 1e12);
    // console.log("randomDate", randomDate.toISOString().split("T")[0]);
    arrayRandomDate.push(randomDate.toISOString().split("T")[0]);
    arrayRandomDate.sort((a, b) => {
      if (a < b) return -1;
      else if (a > b) return 1;
      else return 0;
    });
    dataDate.value = arrayRandomDate;
  }
  setOptions({
    xAxis: {
      data: Object.values(dataDate.value),
      type: "category",
      axisLabel: {
        formatter: function (value) {
          return value.split("-")[2];
        }
      }
    },

    yAxis: {
      show: false,
      type: "value",
      axisLine: {
        show: true,
        lineStyle: {
          color: "#d8d8d8"
        }
      }
    },

    series: [
      {
        data: dataTVL,
        name: "TVL",
        type: "line",
        showSymbol: false,
        lineStyle: {
          color: "#A9236B",
          width: 2
        },
        smooth: false,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: "#B55C8C"
              },
              {
                offset: 1,
                color: "rgba(62, 30, 47, 0)"
              }
            ],
            false
          )
        }
      }
    ],

    tooltip: {
      trigger: "axis",
      formatter: params => {
        const convertTimeUTC = new Date(params[0].name);
        const cutTimeUTC = convertTimeUTC
          .toDateString()
          .split(":")[0]
          .split(" ");
        const getMonthUTC = cutTimeUTC[1];
        const getDateUTC = cutTimeUTC[2];
        const getYearUTC = cutTimeUTC[3];
        textDay.value = `${getMonthUTC} ${getDateUTC}, ${getYearUTC} (UTC)`;
        textTVL.value = params[0].value;
        return params;
      }
    }
  });
  isLoading.value = false;
}

onMounted(() => {
  getDataAPI();
  if (!textTVL.value && !textDay.value) {
    textTVL.value = "678837159";
    textDay.value = "nodate";
  }
});
onUnmounted(() => {});
</script>

<template>
  <div class="lineChart">
    <div class="text">TVL</div>
    <div class="price">{{ formatDollarAmount(textTVL) }}</div>
    <p class="date" :class="[textDay === 'nodate' ? 'noDate' : 'yesDate']">
      {{ textDay }}
    </p>
    <div class="button">
      <el-button
        @click="handleBtnTime('day')"
        :class="isTime === 'day' ? 'active' : ''"
        >Day</el-button
      >
      <el-button
        @click="handleBtnTime('week')"
        :class="isTime === 'week' ? 'active' : ''"
        >Week</el-button
      >
      <el-button
        @click="handleBtnTime('month')"
        :class="isTime === 'month' ? 'active' : ''"
        >Month</el-button
      >
    </div>
    <div
      id="lineChartRef"
      ref="lineChartRef"
      :style="{ width: '100%', height: props.resizeHeight }"
    />
    <LoadingChart v-if="isLoading" />
  </div>
</template>
<style lang="scss" scoped>
.lineChart {
  position: relative;
  .text {
    color: #ffffff50;
    font-weight: 600;
  }
  .price {
    font-weight: 700;
    font-size: 28px;
  }
  .date {
    color: #716a6a;
    font-weight: 600;
    &.noDate {
      visibility: hidden;
      opacity: 0;
    }
    &.yesDate {
      visibility: visible;
      opacity: 1;
      transition: all 0.2s ease;
    }
  }
  .button {
    position: absolute;
    right: 0px;
    top: 5px;
    .el-button {
      background-color: transparent;
      color: #ffffff5e;
      border-color: #ffffff1c;
      &.active {
        color: #ffff;
        border-color: #3676e0;
        background-color: #3676e0;
        outline: 0;
      }
      &:hover {
        background-color: #ffffff1c;
        outline: 0;
        border-color: #ffffff1c;
      }
    }

    :deep(.el-button:focus) {
      color: #ffff;
      border-color: #3676e0;
      background-color: #3676e0;
      outline: 0;
    }
  }
}
@media screen and (max-width: 850px) {
  .lineChart .button .el-button {
    padding: 0px 5px;
  }
}
@media screen and (max-width: 735px) {
  .lineChart .price {
    font-size: 22px;
  }
}
@media screen and (max-width: 450px) {
  .lineChart .price {
    font-size: 16px;
  }
}
</style>
