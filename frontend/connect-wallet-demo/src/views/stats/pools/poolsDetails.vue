<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { cloneDeep } from "lodash-unified";
import { formatDollarAmount, formatAmount } from "/@/utils/numbers";
import analytics from "/@/static/analystics.json";
import TableTransactions from "../components/transactions.vue";
import CandleChart from "../components/Echarts/CandleChart.vue";

// variable
const route = useRoute();
const dataPools = ref(cloneDeep(analytics.pools));

const sizeButton = ref("large");
const queryString = route.query.address;
const addrData = dataPools.value.map(item => item.address);

//  !method

function alertComing() {
  ElMessage("coming soon!");
}

function resizeBtn() {
  const width = window.innerWidth;
  width <= 800 ? (sizeButton.value = "default") : (sizeButton.value = "large");
}

function getDataPool(paramA: string | string[], paramB: string | string[]) {
  if (paramB.includes(paramA)) {
    const newObj = dataPools.value.find(obj => {
      return obj.address === paramA;
    });
    // console.log(newObj);
    return newObj;
  }
}
const dataOnePools = getDataPool(queryString, addrData);
// console.log(dataOnePools.name);

onMounted(() => {
  addEventListener("resize", resizeBtn);
});
onUnmounted(() => {
  addEventListener("resize", resizeBtn);
});
</script>
<template>
  <div class="details-container">
    <div class="pools-details">
      <div class="top-infor">
        <div class="infor">
          <div class="pool-image">
            <el-avatar :size="25" :src="'img/tokens/' + dataOnePools.token">
              <img :src="'img/tokens/' + dataOnePools.token" />
            </el-avatar>
            <el-avatar
              :size="25"
              :src="'img/tokens/' + dataOnePools.token2"
              style="position: absolute; left: 15px"
            >
              <img :src="'img/tokens/' + dataOnePools.token2" />
            </el-avatar>
          </div>
          <h1 class="name-pool">
            {{ dataOnePools.pools1 }}/{{ dataOnePools.pools2 }}
          </h1>
          <el-tooltip content="Fee for a transaction" placement="right">
            <p class="percent">{{ dataOnePools.percent }}%</p>
            >
          </el-tooltip>
        </div>
        <div class="reference">
          <div class="item-pools mr-2">
            <el-avatar :size="23" :src="'img/tokens/' + dataOnePools.token">
              <img :src="'img/tokens/' + dataOnePools.token" />
            </el-avatar>
            <span class="reference-text"
              >1 {{ dataOnePools.pools1 }} =
              {{ dataOnePools.tvl }}
              {{ dataOnePools.pools2 }}</span
            >
          </div>
          <div class="item-pools">
            <el-avatar :size="23" :src="'img/tokens/' + dataOnePools.token2">
              <img :src="'img/tokens/' + dataOnePools.token2" />
            </el-avatar>
            <span class="reference-text"
              >1 {{ dataOnePools.pools2 }} =
              {{ dataOnePools.volume24H }}
              {{ dataOnePools.pools1 }}</span
            >
          </div>
        </div>
        <el-row class="mb-4">
          <el-button
            :size="sizeButton"
            type="info"
            class="addlq"
            @click="alertComing"
            ><span><IconifyIconOnline icon="ic:outline-download" /></span> Add
            Liquidity
          </el-button>
          <el-button :size="sizeButton" @click="alertComing" class="trade"
            >Trade</el-button
          >
        </el-row>
      </div>
      <div class="flex-dashboard">
        <div class="box-pool">
          <div class="total-locked">
            <h1 style="color: #ffffff50; font-weight: 600; margin-bottom: 5px">
              Total Tokens Locked
            </h1>
            <div class="total-item" style="padding-bottom: 10px">
              <el-avatar
                :size="23"
                :src="'img/tokens/' + dataOnePools.token"
                style="vertical-align: middle"
              >
                <img :src="'img/tokens/' + dataOnePools.token" />
              </el-avatar>
              <span style="margin-left: 5px">{{ dataOnePools.pools1 }}</span>
              <span class="total-lock-price">{{
                formatAmount(dataOnePools.volume24H)
              }}</span>
            </div>
            <div class="total-item">
              <el-avatar
                :size="23"
                :src="'img/tokens/' + dataOnePools.token2"
                style="vertical-align: middle"
              >
                <img :src="'img/tokens/' + dataOnePools.token2" />
              </el-avatar>
              <span style="margin-left: 5px">{{ dataOnePools.pools2 }}</span>
              <span class="total-lock-price">{{
                formatAmount(dataOnePools.volume24H)
              }}</span>
            </div>
          </div>
          <div class="items-pool">
            <div class="box-pool-detail">
              <h1 class="text">Total liquidity</h1>
              <div>
                <p class="price">{{ formatDollarAmount(dataOnePools.tvl) }}</p>
                <p class="percent">+/- 0.0%</p>
              </div>
            </div>
            <div class="box-pool-detail">
              <h1 class="text">Volume 24H</h1>
              <div>
                <p class="price">
                  {{ formatDollarAmount(dataOnePools.volume24H) }}
                </p>
                <p class="percent" style="color: #d10000">+/- 0.0%</p>
              </div>
            </div>
            <div class="box-pool-detail">
              <h1 class="text">Volume 7D</h1>
              <div>
                <p class="price">
                  {{ formatDollarAmount(dataOnePools.volume7D) }}
                </p>
                <p class="percent" style="color: #00c008">+/- 0.0%</p>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard">
          <CandleChart height-chart="400px" />
        </div>
      </div>
    </div>
    <TableTransactions />
  </div>
</template>
<style lang="scss" scoped>
.details-container {
  color: #ffff;
  .pools-details {
    max-width: 1200px;
    margin: 0 auto;
    .top-infor {
      position: relative;
      .infor {
        display: flex;
        align-items: center;
        .name-pool {
          margin-left: 20px;
          margin-bottom: 5px;
          font-size: 30px;
        }
        .percent {
          margin-left: 5px;
          padding: 5px;
          background-color: #00000020;
          border-radius: 5px;
          cursor: pointer;
        }
      }
      .reference {
        display: flex;
        font-weight: 600;
        margin: 15px 0px;
        flex-direction: row;
        .item-pools {
          background-color: #4a4a4a50;
          display: flex;
          padding: 5px 15px;
          border-radius: 10px;
          -webkit-box-align: center;
          align-items: center;
          width: fit-content;
          .reference-text {
            margin-left: 5px;
          }
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
          color: #ffff;
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

      .box-pool {
        min-width: 280px;
        max-width: 320px;
        width: 100%;
        border-radius: 20px;
        position: relative;
        .total-locked {
          background-color: #66666633;
          margin: 16px;
          padding: 10px 12px;
          border-radius: 15px;
          .total-item {
            position: relative;
            .total-lock-price {
              position: absolute;
              right: 0;
            }
          }
        }
        .items-pool {
          padding: 0px 15px;
        }
        .box-pool-detail {
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

@media screen and(max-width:1170px ) {
  .details-container .pools-details .flex-dashboard {
    .box-pool {
      .items-pool {
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
@media screen and(max-width:690px ) {
  .details-container .pools-details .top-infor .mb-4 {
    position: relative;
  }
  .details-container
    .pools-details
    .top-infor
    .reference
    .item-pools
    .reference-text {
    font-size: 15px;
  }
  .details-container
    .pools-details
    .top-infor
    .infor
    .name-pool[data-v-30dd40e6] {
    font-size: 20px;
  }
}
@media screen and(max-width:850px ) {
  .details-container .pools-details .flex-dashboard {
    flex-direction: column;
    .box-pool {
      max-width: 100%;
    }
  }
}

@media screen and(max-width:425px ) {
  .details-container .pools-details {
    .top-infor {
      .reference {
        flex-direction: column;
        .item-pools {
          margin-right: 0;
          &.mr-2 {
            margin-bottom: 10px;
          }
        }
      }
      .mb-4 {
        .addlq {
          padding: 0px 5px;
        }
      }
    }
    .flex-dashboard .dashboard .card .button .el-button {
      padding: 5px 5px;
    }
  }
}
</style>
