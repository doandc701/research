<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { TableProBar } from "/@/components/ReTable";
import Pagination from "/@/components/Pagination/index.vue";
import analytics from "/@/static/analystics.json";
import { formatDollarAmount } from "/@/utils/numbers";
import { cloneDeep } from "lodash-unified";
import { router } from "/@/router";
// variable

// --pool
const tablePool = ref(cloneDeep(analytics.pools));
const iconUpDownPools = ref("mdi:arrow-up");
const nameSelectedPools = ref("tvl");
const currentSortPools = ref("asc");
const inputSearch = ref("");

// !method

function alertComing() {
  ElMessage("coming soon!");
}

// sort
// --POOLS
function handleSortPools(valueKey: string) {
  // console.log(valueKey);
  nameSelectedPools.value = valueKey;
  if (valueKey === nameSelectedPools.value) {
    currentSortPools.value = currentSortPools.value === "asc" ? "desc" : "asc";
    if (currentSortPools.value === "asc") {
      iconUpDownPools.value = "mdi:arrow-up";
    } else {
      iconUpDownPools.value = "mdi:arrow-down";
    }
  }
  sortTablePools(valueKey);
}
function sortTablePools(params: string) {
  // console.log("params", params);
  const listPools = tablePool.value.slice().sort((a, b) => {
    let modifier = 1;
    if (currentSortPools.value === "desc") modifier = -1;
    if (a[params] < b[params]) return -1 * modifier;
    if (a[params] > b[params]) return 1 * modifier;
    return 0;
  });
  return listPools;
}

function handlePoolsDetails(row) {
  // console.log("row", row.address);
  router.push(`/stats/pool?address=${row.address}`);
}
</script>
<template>
  <div class="pools">
    <h1 class="title">Top Pools</h1>
    <div class="position-right" @click="alertComing">
      <div class="cta">
        <p class="p_see" id="p_see">See all</p>
        <IconifyIconOnline icon="material-symbols:arrow-right-alt-rounded" />
      </div>
    </div>
    <div class="box-search">
      <el-input v-model="inputSearch" class="w-50 m-2" placeholder="Search" />
      <span style="position: absolute; color: #a8abb2; top: 16px; left: 5px"
        ><IconifyIconOnline icon="material-symbols:search"
      /></span>
    </div>
    <div class="table-pool">
      <TableProBar
        :dataList="sortTablePools(nameSelectedPools)"
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
            :data="sortTablePools(nameSelectedPools)"
            style="width: 100%"
            highlight-current-row
            scrollbar-always-on
            @row-click="handlePoolsDetails"
          >
            <el-table-column align="center" min-width="40">
              <template #header>
                <span class="table-title" @click="handleSortPools('stt')"
                  >#
                  <span v-if="nameSelectedPools === 'stt'" class="iconSort"
                    ><IconifyIconOnline :icon="iconUpDownPools"
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
                  @click="handleSortPools('pools1')"
                  >Pools
                  <span v-if="nameSelectedPools === 'pools1'" class="iconSort"
                    ><IconifyIconOnline :icon="iconUpDownPools"
                  /></span>
                </span>
              </template>
              <template v-slot="{ row }">
                <div class="token-image">
                  <el-avatar :size="25" :src="'img/tokens/' + row.token">
                    <img :src="'img/tokens/' + row.token" />
                  </el-avatar>
                  <el-avatar
                    :size="25"
                    :src="'img/tokens/' + row.token2"
                    style="position: absolute; left: 15px"
                  >
                    <img :src="'img/tokens/' + row.token2" />
                  </el-avatar>
                </div>
                <span style="margin-left: 45px">
                  {{ row.pools1 }}/{{ row.pools2 }}
                </span>
                <p class="percent">{{ row.percent }}%</p>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              min-width="190"
              class-name="small-padding"
            >
              <template #header>
                <span class="table-title" @click="handleSortPools('tvl')"
                  >TVL
                  <span v-if="nameSelectedPools === 'tvl'" class="iconSort"
                    ><IconifyIconOnline :icon="iconUpDownPools"
                  /></span>
                </span>
              </template>
              <template v-slot="{ row }">
                {{ formatDollarAmount(row.tvl) }}
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              min-width="190"
              class-name="small-padding"
            >
              <template #header>
                <span class="table-title" @click="handleSortPools('volume24H')"
                  >Volume 24H
                  <span
                    v-if="nameSelectedPools === 'volume24H'"
                    class="iconSort"
                    ><IconifyIconOnline :icon="iconUpDownPools"
                  /></span>
                </span>
              </template>
              <template v-slot="{ row }">
                {{ formatDollarAmount(row.volume24H) }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              min-width="190"
              class-name="small-padding"
            >
              <template #header>
                <span class="table-title" @click="handleSortPools('volume7D')"
                  >Volume 7D
                  <span v-if="nameSelectedPools === 'volume7D'" class="iconSort"
                    ><IconifyIconOnline :icon="iconUpDownPools"
                  /></span>
                </span>
              </template>
              <template v-slot="{ row }">
                {{ formatDollarAmount(row.volume7D) }}
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
.pools {
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
  .box-search {
    position: relative;
    .el-input {
      width: auto;
    }
    .m-2 {
      margin: 0.5rem 0.5rem 0.5rem 0;
    }
    :deep(.el-input .el-input__wrapper) {
      padding: 1px 7px 1px 25px;
    }
    :deep(.el-input__wrapper) {
      background-color: #ffffff33;
      box-shadow: 0 0 0 1px #ffffff33;
    }
    :deep(.el-input__inner) {
      color: #ffff;
    }
  }
  .table-pool {
    .el-table {
      .percent {
        position: absolute;
        left: 140px;
        top: 5px;
        padding: 3px;
        background-color: #434547;
        border-radius: 5px;
      }
    }
  }
  :deep(.el-table__inner-wrapper) {
    cursor: pointer;
  }
  :deep(.el-table--enable-row-hover
      .el-table__body
      tr:hover
      > td.el-table__cell) {
    background-color: #ffffff33;
  }
  :deep(.el-table__body tr.current-row > td.el-table__cell) {
    background-color: unset;
  }
  :deep(.el-table tr) {
    background-color: unset;
  }
  :deep(.el-table th.el-table__cell) {
    background-color: unset;
  }
}
.details-container {
  .position-right {
    display: none;
  }
}

@media screen and (min-width: 741px) {
  .pools .title {
    font-size: 30px;
  }
}
</style>
