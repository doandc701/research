<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";

import { TableProBar } from "/@/components/ReTable";
import Pagination from "/@/components/Pagination/index.vue";
import analytics from "/@/static/analystics.json";
import { formatDollarAmount, formatAmount } from "/@/utils/numbers";
import { BigNumber } from "bignumber.js";
import { fromWei } from "/@/utils/connex";
import { cloneDeep } from "lodash-unified";
// variable

const isType = ref("all");

// --transactions
const tableTransactions = ref(cloneDeep(analytics.transactions));
const iconUpDownTransactions = ref("mdi:arrow-up");
const nameSelectedTransactions = ref("time");
const currentSortTransactions = ref("asc");

// !method

function handleBtnType(btn: string) {
  ElMessage("coming soon!");
  isType.value = btn;
}
function alertComing() {
  ElMessage("coming soon!");
}

function formatTokenAmount(wei: string): string {
  const amountStr = fromWei(wei);
  const result = new BigNumber(amountStr).toNumber();
  return formatAmount(result);
}

// sort
// --TRANSACTIONS
function handleSortTransactions(valueKey: string) {
  nameSelectedTransactions.value = valueKey;
  if (valueKey === nameSelectedTransactions.value) {
    currentSortTransactions.value =
      currentSortTransactions.value === "asc" ? "desc" : "asc";
  }
  if (currentSortTransactions.value === "asc") {
    iconUpDownTransactions.value = "mdi:arrow-up";
  } else {
    iconUpDownTransactions.value = "mdi:arrow-down";
  }
  sortTableTransactions(valueKey);
}
function sortTableTransactions(params: string) {
  // console.log("params", params);
  const listTransaction = tableTransactions.value.slice().sort((a, b) => {
    let modifier = 1;
    if (currentSortTransactions.value === "desc") modifier = -1;
    if (["tokenAmountA", "tokenAmountB"].includes(params)) {
      const amountA = new BigNumber(a[params]);
      const amountB = new BigNumber(b[params]);
      if (amountA.lt(amountB)) return -1 * modifier;
      if (amountA.gt(amountB)) return 1 * modifier;
      return 0;
    } else {
      if (a[params] < b[params]) return -1 * modifier;
      if (a[params] > b[params]) return 1 * modifier;
      return 0;
    }
  });
  return listTransaction;
}
</script>
<template>
  <div class="transactions">
    <h1 class="title">Transactions</h1>
    <div class="position-right" @click="alertComing">
      <div class="cta">
        <p class="p_see">See all</p>
        <IconifyIconOnline icon="material-symbols:arrow-right-alt-rounded" />
      </div>
    </div>
    <div class="button-handle">
      <el-button
        @click="handleBtnType('all')"
        :class="isType === 'all' ? 'active' : ''"
        >All</el-button
      >
      <el-button
        @click="handleBtnType('swaps')"
        :class="isType === 'swaps' ? 'active' : ''"
        >Swaps</el-button
      >
      <el-button
        @click="handleBtnType('adds')"
        :class="isType === 'adds' ? 'active' : ''"
        >Adds</el-button
      >
      <el-button
        @click="handleBtnType('removes')"
        :class="isType === 'removes' ? 'active' : ''"
        >Removes</el-button
      >
    </div>
    <div class="table-transactions">
      <TableProBar
        :dataList="sortTableTransactions(nameSelectedTransactions)"
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
            :data="sortTableTransactions(nameSelectedTransactions)"
            style="width: 100%"
            highlight-current-row
            scrollbar-always-on
          >
            <el-table-column align="center" min-width="190">
              <template #header>
                <span>Type </span>
              </template>
              <template v-slot="{ row }">
                <a href="#" style="color: #3676e0; font-weight: 600">
                  {{ row.type }}
                </a>
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
                  @click="handleSortTransactions('totalValue')"
                  >Total Value
                  <span
                    v-if="nameSelectedTransactions === 'totalValue'"
                    class="iconSort"
                    ><IconifyIconOnline :icon="iconUpDownTransactions"
                  /></span>
                </span>
              </template>
              <template v-slot="{ row }">
                <span>
                  {{ formatDollarAmount(row.totalValue) }}
                </span>
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
                  @click="handleSortTransactions('tokenAmountA')"
                  >Token Amount
                  <span
                    v-if="nameSelectedTransactions === 'tokenAmountA'"
                    class="iconSort"
                    ><IconifyIconOnline :icon="iconUpDownTransactions"
                  /></span>
                </span>
              </template>
              <template v-slot="{ row }">
                {{ formatTokenAmount(row.tokenAmountA) }}
                {{ row.tokenA }}
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
                  @click="handleSortTransactions('tokenAmountB')"
                  >Token Amount
                  <span
                    v-if="nameSelectedTransactions === 'tokenAmountB'"
                    class="iconSort"
                    ><IconifyIconOnline :icon="iconUpDownTransactions"
                  /></span>
                </span>
              </template>
              <template v-slot="{ row }">
                {{ formatTokenAmount(row.tokenAmountB) }}
                {{ row.tokenB }}
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              min-width="190"
              class-name="small-padding"
            >
              <template #header>
                <span>Account </span>
              </template>
              <template v-slot="{ row }">
                <a href="#" style="color: #3676e0; font-weight: 600">
                  {{ row.account }}
                </a>
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
                  @click="handleSortTransactions('time')"
                  >Time
                  <span
                    v-if="nameSelectedTransactions === 'time'"
                    class="iconSort"
                    ><IconifyIconOnline :icon="iconUpDownTransactions"
                  /></span>
                </span>
              </template>
              <template v-slot="{ row }"> {{ row.time }} hours ago </template>
            </el-table-column>
          </el-table>
        </template>
      </TableProBar>
      <Pagination :total="1" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.transactions {
  position: relative;
  .table-title {
    display: flex;
    justify-content: center;
    cursor: pointer;
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
  .button-handle {
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
  .table-transactions {
    .el-table {
      .time {
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
    cursor: default;
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

@media screen and(min-width:741px) {
  .transactions {
    .title {
      font-size: 30px;
    }
  }
}
@media screen and(max-width:480px) {
  .transactions .button-handle .el-button {
    padding: 5px 5px;
  }
}
</style>
