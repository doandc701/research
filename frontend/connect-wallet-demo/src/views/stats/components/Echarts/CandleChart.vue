<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

import { useECharts } from "@pureadmin/utils";
import { formatDollarAmount } from "/@/utils/numbers";
import axios from "axios";
import LoadingChart from "../LoadingChart.vue";
import { CandlestickChart } from "echarts/charts";
echarts.use([CandlestickChart]);

const props = defineProps({
  heightChart: {
    type: String
  }
});

const isType = ref("price");
const textTVL = ref();
const textDay = ref();
const isLoading = ref(false);
const stockMarketHistory = ref([]);
const stockMarketHistoryValues = ref([]);
const stockMarketHistoryDates = ref([]);
const candleChart = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(candleChart as Ref<HTMLDivElement>);

// !method
function handleBtnType(btn: string) {
  isType.value = btn;
  fetchDataAPI();
}

const fetchDataAPI = () => {
  isLoading.value = true;

  if (stockMarketHistoryDates.value.length > 0) {
    stockMarketHistoryDates.value = [];
    stockMarketHistoryValues.value = [];
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
        let arrayGetTime = [];
        arrayGetTime.push(new Date(property).getTime());

        const getTimeStamp = arrayGetTime.filter(item => item > 1514739600000);
        if (getTimeStamp[0]) {
          const convertTimeISO = new Date(getTimeStamp[0])
            .toISOString()
            .split("T")[0];

          stockMarketHistoryDates.value.unshift(convertTimeISO);
        }
        stockMarketHistoryValues.value.unshift(
          Object.values(stockMarketHistory.value[property])
        );
      }

      setOptions({
        animation: true,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          formatter: function (param) {
            param = param[0];

            const convertTimeUTC = new Date(param.name);
            const cutTimeUTC = convertTimeUTC
              .toDateString()
              .split(":")[0]
              .split(" ");
            const getMonthUTC = cutTimeUTC[1];
            const getDateUTC = cutTimeUTC[2];
            const getYearUTC = cutTimeUTC[3];
            textDay.value = `${getMonthUTC} ${getDateUTC}, ${getYearUTC} (UTC)`;
            textTVL.value = param.data[2];
            return param;
          }
        },
        visualMap: {
          show: false,
          seriesIndex: 5,
          dimension: 2,
          pieces: [
            {
              value: 1,
              color: "#AE0000"
            },
            {
              value: -1,
              color: "#008000"
            }
          ]
        },
        xAxis: {
          type: "category",
          data: stockMarketHistoryDates.value,
          axisLine: { onZero: false },
          splitLine: { show: false },

          axisPointer: {
            z: 100
          }
        },
        yAxis: {
          position: "right",
          scale: true,
          splitArea: {
            show: false
          },
          axisLine: { show: false },
          splitLine: { show: false }
        },
        dataZoom: {
          type: "inside",
          xAxisIndex: [0, 1],
          start: 70,
          end: 100
        },
        series: {
          name: "Price",
          type: "candlestick",
          data: stockMarketHistoryValues.value,
          itemStyle: {
            color: "#008000",
            color0: "#AE0000",
            borderColor: undefined,
            borderColor0: undefined
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
</script>

<template>
  <div class="lineChart">
    <div class="price">{{ formatDollarAmount(textTVL) }}</div>
    <p class="date" :class="[textDay === 'nodate' ? 'noDate' : 'yesDate']">
      {{ textDay }}
    </p>
    <div class="button">
      <el-button
        size="default"
        @click="handleBtnType('volume')"
        :class="isType === 'volume' ? 'active' : ''"
        >Volume</el-button
      >
      <el-button
        size="default"
        @click="handleBtnType('tvl')"
        :class="isType === 'tvl' ? 'active' : ''"
        >TVL</el-button
      >
      <el-button
        size="default"
        @click="handleBtnType('price')"
        :class="isType === 'price' ? 'active' : ''"
        >Price</el-button
      >
    </div>
    <div
      ref="candleChart"
      :style="{ width: '100%', height: props.heightChart }"
    />
    <!-- loadding -->
    <LoadingChart v-if="isLoading" />
  </div>
</template>
<style lang="scss" scoped>
.lineChart {
  position: relative;

  .price {
    font-weight: 700;
    font-size: 28px;
    padding-top: 9px;
  }
  .date {
    color: #716a6a;
    font-weight: 600;
    padding-top: 5px;
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
    right: 20px;
    top: 8px;
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
  .lineChart .price {
    font-size: 20px;
  }
}

@media screen and (max-width: 400px) {
  .lineChart .button .el-button {
    padding: 0px 5px;
  }
}
</style>
