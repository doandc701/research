<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { cloneDeep } from "lodash-unified";
import { formatDollarAmount } from "/@/utils/numbers";

import TablePools from "../components/pools.vue";
import TableTransactions from "../components/transactions.vue";
import analytics from "/@/static/analystics.json";
import CandleChart from "../components/Echarts/CandleChart.vue";
// variable
const route = useRoute();
const dataTokens = ref(cloneDeep(analytics.token));

const sizeButton = ref("large");
const queryString = route.query.address;
const addrData = dataTokens.value.map(item => item.address);
// console.log(addrData);

//  !method

function alertComing() {
  ElMessage("coming soon!");
}

function resizeBtn() {
  const width = window.innerWidth;
  width <= 800 ? (sizeButton.value = "default") : (sizeButton.value = "large");
}

function getDataToken(paramA: string | string[], paramB: string | string[]) {
  if (paramB.includes(paramA)) {
    const newObj = dataTokens.value.find(obj => {
      return obj.address === paramA;
    });
    // console.log(newObj);
    return newObj;
  }
}
const dataOneToken = getDataToken(queryString, addrData);

function followGrowthPrice() {
  let valPriceChange = dataOneToken.priceChange;
  dataOneToken.positive = valPriceChange.includes("-") ? true : false;
  dataOneToken.priceChange = parseFloat(valPriceChange);
}

onMounted(() => {
  followGrowthPrice();
  addEventListener("resize", resizeBtn);
});
onUnmounted(() => {
  addEventListener("resize", resizeBtn);
});
</script>
<template>
  <div class="details-container">
    <div class="tokens-details">
      <div class="top-infor">
        <div class="infor">
          <el-avatar :size="25" src="/img/tokens/vpu.png">
            <img src="/img/tokens/vpu.png" />
          </el-avatar>
          <h1 class="name-token">{{ dataOneToken.name }}</h1>
        </div>
        <h1 class="dolar-price">
          {{ formatDollarAmount(dataOneToken.price) }}

          <span
            :style="'color:' + (dataOneToken.positive ? '#D10000' : '#00C008')"
            >({{ Math.abs(dataOneToken.priceChange) }}%)</span
          >
        </h1>
        <el-row class="mb-4">
          <el-button
            :size="sizeButton"
            type="info"
            class="addlq"
            @click="alertComing"
            ><span><IconifyIconOnline icon="ic:outline-download" /></span> Add
            Liquidity
          </el-button>
          <el-button
            :size="sizeButton"
            type="primary"
            @click="alertComing"
            class="trade"
            >Trade</el-button
          >
        </el-row>
      </div>
      <div class="flex-dashboard">
        <div class="box-token">
          <div class="items-token">
            <div class="box-token-detail">
              <h1 class="text">TVL</h1>
              <div>
                <p class="price">{{ formatDollarAmount(dataOneToken.tvl) }}</p>
                <p class="percent">+/- 0.0%</p>
              </div>
            </div>
            <div class="box-token-detail">
              <h1 class="text">Volume 24H</h1>
              <div>
                <p class="price">
                  {{ formatDollarAmount(dataOneToken.volume) }}
                </p>
                <p class="percent" style="color: #d10000">+/- 0.0%</p>
              </div>
            </div>
            <div class="box-token-detail">
              <h1 class="text">Volume 7D</h1>
              <div>
                <p class="price">
                  {{ formatDollarAmount(dataOneToken.volume) }}
                </p>
                <p class="percent" style="color: #00c008">+/- 0.0%</p>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard">
          <CandleChart height-chart="300px" />
        </div>
      </div>
    </div>
    <TablePools />
    <TableTransactions />
  </div>
</template>
<style lang="scss" scoped>
.details-container {
  color: #ffff;
  .tokens-details {
    max-width: 1200px;
    margin: 0 auto;
    .top-infor {
      position: relative;
      .infor {
        display: flex;
        align-items: center;
        .name-token {
          margin-left: 5px;
          margin-bottom: 5px;
          font-size: 30px;
        }
      }
      .dolar-price {
        font-size: 30px;
        font-weight: 600;
        margin-bottom: 15px;
        span {
          font-size: 15px;
          padding-left: 5px;
          color: #00c008;
        }
      }
      .mb-4 {
        position: absolute;
        bottom: 0px;
        right: 0;
        justify-content: flex-end;
        margin-bottom: 0;

        .addlq {
          background-color: #4a4a4a;
          border: none;
          &:hover {
            background-color: #595858;
          }
        }
        .trade {
          background-color: #3676e0;
          border: none;
          &:hover {
            background-color: #4f88e3;
          }
        }
      }
    }
    .flex-dashboard {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      background-color: #00000020;

      .box-token {
        min-width: 280px;
        max-width: 320px;
        width: 100%;
        border-radius: 20px;
        position: relative;
        .items-token {
          width: 100%;
          padding: 0px 15px;
        }
        .box-token-detail {
          padding: 10px 12px;
          margin-bottom: 15px;

          .text {
            color: #ffffff50;
            margin-bottom: 15px;
          }
          .price {
            font-size: 20px;
          }
          div {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
      }
      .dashboard {
        max-width: 860px;
        width: 100%;
      }
    }
  }
}

@media screen and(max-width:1300px ) {
  .details-container .tokens-details .left .infor .name-token {
    font-size: 20px;
  }
}
@media screen and(max-width:1170px ) {
  .details-container .tokens-details .flex-dashboard {
    // flex-direction: column;

    .box-token {
      .items-token {
        position: relative;
        top: unset;
        width: auto;
        transform: translateY(0);
      }
    }
    .dashboard {
      max-width: 100%;
    }
  }
}
@media screen and(max-width:850px ) {
  .details-container .tokens-details .top-infor .dolar-price {
    font-size: 20px;
  }
}
@media screen and(max-width:400px ) {
  .details-container .tokens-details {
    .flex-dashboard .dashboard .card .button .el-button {
      padding: 5px 5px;
    }
    .top-infor {
      .mb-4 {
        position: relative;
        .addlq {
          padding: 0px 5px;
        }
      }
      .infor .name-token {
        font-size: 20px;
      }
    }
  }
}
@media screen and(max-width:850px ) {
  .details-container .tokens-details .flex-dashboard {
    flex-direction: column;
    .box-token {
      max-width: 100%;
    }
  }
}
</style>
