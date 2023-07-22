<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
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
const isLoading = ref(false);
const stockMarketHistory = ref([]);

const stockMarketHistoryVolume = ref([]);
const stockMarketHistoryDates = ref([]);

const barChartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(barChartRef);

// !method
function handleBtnTime(btn: string) {
  isTime.value = btn;
  fetchDataAPI();
}

const fetchDataAPI = () => {
  isLoading.value = true;

  if (stockMarketHistoryDates.value.length > 0) {
    stockMarketHistoryDates.value = [];
    stockMarketHistoryVolume.value = [];
  }

  axios
    .get(
      "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=IBM&apikey=6S3XWKYVUZIUJZEF"
    )
    .then(async response => {
      stockMarketHistory.value = await response.data[
        "Monthly Adjusted Time Series"
      ];
      // console.log("response", response.data["Monthly Adjusted Time Series"]);
      if (!stockMarketHistory.value) {
        isLoading.value = true;
        return;
      }
      for (const property in stockMarketHistory.value) {
        let dataVolume = stockMarketHistory.value[property]["6. volume"];

        let arrayGetTime = [];
        arrayGetTime.push(new Date(property).getTime());

        const getTimeStamp = arrayGetTime.filter(item => item > 1514739600000);
        if (getTimeStamp[0]) {
          const convertTimeISO = new Date(getTimeStamp[0])
            .toISOString()
            .split("T")[0];
          stockMarketHistoryDates.value.unshift(convertTimeISO);
        }
        stockMarketHistoryVolume.value.unshift(dataVolume);
      }

      setOptions({
        xAxis: {
          data: stockMarketHistoryDates.value,
          type: "category",
          axisLabel: {
            formatter: function (value) {
              return value.split("-")[2];
            }
          }
        },

        yAxis: {
          show: false,
          type: "value"
        },

        series: {
          name: "volume24H",
          data: stockMarketHistoryVolume.value,
          type: "bar",
          color: "#3676E0"
        },
        tooltip: {
          trigger: "axis",
          formatter: (params: any) => {
            // console.log("params", params, params[0].name);
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
    });
};

onMounted(() => {
  fetchDataAPI();
  if (!textTVL.value && !textDay.value) {
    textTVL.value = "678837159";
    textDay.value = "nodate";
  }
});
onUnmounted(() => {});
</script>

<template>
  <div class="barChart">
    <div class="text">Volume</div>
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
      id="barChartRef"
      ref="barChartRef"
      :style="{
        width: '100%',
        height: props.resizeHeight
      }"
    />
    <!-- loadding -->
    <LoadingChart v-if="isLoading" />
  </div>
</template>
<style lang="scss" scoped>
.barChart {
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
  .barChart .button .el-button {
    padding: 0px 5px;
  }
}
@media screen and (max-width: 735px) {
  .barChart .price {
    font-size: 22px;
  }
}
@media screen and (max-width: 450px) {
  .barChart {
    .text {
      font-size: 15px;
    }
    .price {
      font-size: 16px;
    }
  }
}
</style>
