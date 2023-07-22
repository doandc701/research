<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { TableProBar } from "/@/components/ReTable";
import Pagination from "/@/components/Pagination/index.vue";
import analytics from "/@/static/analystics.json";
import { formatDollarAmount } from "/@/utils/numbers";
import { cloneDeep } from "lodash-unified";
import { router } from "/@/router";
// variable
// --token
const tableToken = ref(cloneDeep(analytics.token));
const iconUpDownToken = ref("mdi:arrow-up");
const nameSelectedToken = ref("tvl");
const currentSortToken = ref("asc");

// !method

function alertComing() {
  ElMessage("coming soon!");
}

function followGrowthPrice() {
  // console.log("tableToken", tableToken.value);
  for (let i = 0; i < tableToken.value.length; i++) {
    let valPriceChange = tableToken.value[i].priceChange;
    // console.log("valPriceChange", valPriceChange);
    tableToken.value[i].positive = valPriceChange.includes("-") ? false : true;
    // if (valPriceChange.includes("-")) valPriceChange = valPriceChange.slice(1);
    tableToken.value[i].priceChange = parseFloat(valPriceChange);
  }
}

// sort
// --TOKEN
function handleSortToken(valueKey: string) {
  nameSelectedToken.value = valueKey;
  if (valueKey === nameSelectedToken.value) {
    currentSortToken.value = currentSortToken.value === "asc" ? "desc" : "asc";
    if (currentSortToken.value === "asc") {
      iconUpDownToken.value = "mdi:arrow-up";
    } else {
      iconUpDownToken.value = "mdi:arrow-down";
    }
  }
  sortTableToken(valueKey);
}
function sortTableToken(params: string) {
  const listToken = tableToken.value.slice().sort((a, b) => {
    let modifier = 1;
    if (currentSortToken.value === "desc") modifier = -1;
    if (a[params] < b[params]) return -1 * modifier;
    if (a[params] > b[params]) return 1 * modifier;
    return 0;
  });
  // console.log("listToken", listToken);
  return listToken;
}

function handleTokenDetails(row) {
  // console.log("row", row.address);
  router.push(`/stats/token?address=${row.address}`);
}

onMounted(() => {
  followGrowthPrice();
});
</script>
<template>
  <div class="tokens">
    <h1 class="title">Top Token</h1>
    <div class="position-right" @click="alertComing">
      <div class="cta">
        <p class="p_see">See all</p>
        <IconifyIconOnline icon="material-symbols:arrow-right-alt-rounded" />
      </div>
    </div>
    <div class="table-token">
      <TableProBar
        :dataList="sortTableToken(nameSelectedToken)"
        class="tableProBar"
        style="
          background-color: #c0c0c000;
          margin: 7px;
          padding: 0px;
          margin-right: 0 !important;
        "
      >
        <template #buttons>
          <el-button type="primary" />
        </template>
        <template v-slot="{ size }">
          <el-table
            border
            :size="size"
            :data="sortTableToken(nameSelectedToken)"
            style="width: 100%"
            highlight-current-row
            scrollbar-always-on
            @row-click="handleTokenDetails"
          >
            <el-table-column align="center" min-width="40">
              <template #header>
                <span class="table-title" @click="handleSortToken('stt')"
                  >#
                  <span v-if="nameSelectedToken === 'stt'" class="iconSort"
                    ><IconifyIconOnline :icon="iconUpDownToken"
                  /></span>
                </span>
              </template>
              <template v-slot="{ row }">
                {{ row.stt }}
              </template>
            </el-table-column>

            <el-table-column
              align=""
              min-width="190"
              class-name="small-padding"
            >
              <template #header>
                <span
                  class="table-title noCenter"
                  @click="handleSortToken('name')"
                  >Name
                  <span v-if="nameSelectedToken === 'name'" class="iconSort"
                    ><IconifyIconOnline :icon="iconUpDownToken"
                  /></span>
                </span>
              </template>
              <template v-slot="{ row }">
                <div class="token-image">
                  <el-avatar :size="25" :src="'img/tokens/' + row.token">
                    <img :src="'img/tokens/' + row.token" />
                  </el-avatar>
                </div>
                <span style="padding-left: 35px">
                  {{ row.name }}
                </span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              min-width="190"
              class-name="small-padding"
            >
              <template #header>
                <span class="table-title" @click="handleSortToken('price')"
                  >Price (USD)
                  <span v-if="nameSelectedToken === 'price'" class="iconSort"
                    ><IconifyIconOnline :icon="iconUpDownToken"
                  /></span>
                </span>
              </template>
              <template v-slot="{ row }">
                {{ formatDollarAmount(row.price) }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              min-width="190"
              class-name="small-padding"
            >
              <template #header>
                <span
                  class="table-title"
                  @click="handleSortToken('priceChange')"
                  >Price Change
                  <span
                    v-if="nameSelectedToken === 'priceChange'"
                    class="iconSort"
                    ><IconifyIconOnline :icon="iconUpDownToken"
                  /></span>
                </span>
              </template>
              <template v-slot="{ row }">
                <div
                  class="flex justify-center"
                  style="font-weight: 600"
                  :style="'color:' + (!row.positive ? '#D10000' : '#00C008')"
                >
                  <span style="position: relative; bottom: -5px; left: -5px"
                    ><IconifyIconOnline
                      :icon="
                        row.positive === false
                          ? 'mdi:arrow-down'
                          : 'mdi:arrow-up'
                      "
                  /></span>
                  <span> {{ Math.abs(row.priceChange) }} %</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              min-width="190"
              class-name="small-padding"
            >
              <template #header>
                <span class="table-title" @click="handleSortToken('volume')"
                  >Volume 24H
                  <span v-if="nameSelectedToken === 'volume'" class="iconSort"
                    ><IconifyIconOnline :icon="iconUpDownToken"
                  /></span>
                </span>
              </template>
              <template v-slot="{ row }">
                {{ formatDollarAmount(row.volume) }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              min-width="190"
              class-name="small-padding"
            >
              <template #header>
                <span class="table-title" @click="handleSortToken('tvl')"
                  >TVL
                  <span v-if="nameSelectedToken === 'tvl'" class="iconSort"
                    ><IconifyIconOnline :icon="iconUpDownToken" /></span
                ></span>
              </template>
              <template v-slot="{ row }">
                {{ formatDollarAmount(row.tvl) }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </TableProBar>
      <Pagination :total="1" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tokens {
  position: relative;
  .table-title {
    display: flex;
    justify-content: center;
    align-items: center;
    .iconSort {
      position: relative;
      font-size: 16px;
      left: 5px;
    }
    &.noCenter {
      justify-content: flex-start;
    }
  }
  .title {
    font-size: 20px;
    padding: 30px 0px;
  }
  .el-table {
    padding: 10px 0px;
    background-color: unset;
    color: #ffff;
    font-size: 14px;
    border-radius: 0px;
    --el-table-border-color: unset;
    & tr {
      background-color: unset;
    }
    .token-image {
      position: absolute;
    }
  }
  .position-right {
    $primary: #6f1847;
    position: absolute;
    top: 40px;
    right: 0;
    .cta {
      position: relative;
      display: flex;
      align-items: center;
      margin: auto;
      padding: 5px 10px;
      transition: all 0.2s ease;
      cursor: pointer;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        border-radius: 28px;
        background: rgba($primary, 0);
        width: 0px;
        height: 30px;
        transition: all 0.3s ease;
      }
      &:hover {
        &::before {
          width: 100%;
          background: rgba($primary, 1);
        }
        .p_see {
          color: #ffffffe9;
        }
        svg {
          transform: translateX(0);
        }
      }
      &:active {
        transform: scale(0.96);
      }
      .p_see {
        position: relative;
        font-size: 16px;
        line-height: 18px;
        font-weight: 600;
        color: #ffffff80;
        vertical-align: middle;
        transition: all 0.2s ease;
        user-select: none;
      }
      svg {
        position: relative;
        top: 0;
        margin-left: 8px;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke: #ffffff80;
        color: #ffffff80;
        stroke-width: 2;
        transform: translateX(-5px);
        transition: all 0.3s ease;
      }
    }
  }
  :deep(.el-table__inner-wrapper) {
    cursor: pointer;
  }
}

@media screen and(min-width:741px) {
  .tokens {
    .title {
      font-size: 30px;
    }
  }
}
</style>
