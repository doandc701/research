<script setup lang="ts">
import Pagination from "/@/components/Pagination/index.vue";
// LeaderboardZd: () => import(/* webpackChunkName: "LeaderboardZd" */ "./leaderboard-zd.vue");
import Leaderboard from "./leaderboard.vue";
import chart from "/@/assets/img/chart.png";

defineOptions({
  name: "Activity"
});
const tableData = [
  {
    sale: "Win",
    item: "--",
    price: "00.00",
    quantity: "0",
    from: "--",
    to: "----",
    time: "1 second ago"
  },
  {
    sale: "Win",
    item: "--",
    price: "00.00",
    quantity: "0",
    from: "--",
    time: "1 second ago"
  },
  {
    sale: "Win",
    item: "--",
    price: "00.00",
    quantity: "0",
    from: "--",
    time: "1 second ago"
  },
  {
    sale: "Win",
    item: "--",
    price: "00.00",
    quantity: "0",
    from: "--",
    time: "1 second ago"
  }
];
</script>

<template>
  <div class="activity-container">
    <h3 style="color: #00d4ff">Stats</h3>
    <Leaderboard />
    <div style="color: #0df11f; padding: 10px 0px">
      This feature is coming soon.
    </div>
    <h3 style="color: #00d4ff; margin: 18px 0px; font-size: 18px">Chart</h3>
    <div class="dropdown-body">
      <el-dropdown popper-class="last90-days-arrow" disabled>
        <el-button class="dropdown-btn" type="primary">
          Last 90 days <i class="el-icon-caret-bottom el-icon--right" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu
            style="
              background-color: #293366;
              color: #fff;
              border-radius: 10px;
              border: 2px solid #384482;
            "
          >
            <el-dropdown-item class="bgr">Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item>Action 4</el-dropdown-item>
            <el-dropdown-item>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-row class="chart-img">
      <img style="max-width: 100%; padding: 20px" :src="chart" />
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="" width="120px">
        <template v-slot="scope">
          <div style="display: flex">
            <img src="/img/icons/sale-tag.svg" />
            <span style="margin-left: 10px; color: #33ba74">{{
              scope.row.sale
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Item" width="400px" align="center">
        <template v-slot="scope">
          <div :span="12">
            <el-row class="item-group">
              <el-avatar
                :size="35"
                src="https://vpunks.com/images/vpunks/punk7344.png"
              />
              <el-col :span="6" class="name-date">
                <p>Name: {{ scope.row.item }}</p>
                <p>Name: {{ scope.row.item }}</p>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Amount" align="center">
        <template v-slot="scope">
          <p>{{ scope.row.price }}</p>
        </template>
      </el-table-column>
      <el-table-column label="From" align="center">
        <template v-slot="scope">
          <p>{{ scope.row.from }}</p>
        </template>
      </el-table-column>
      <el-table-column label="Time" align="center" min-width="120px">
        <template v-slot="scope">
          <p>{{ scope.row.time }}</p>
        </template>
      </el-table-column>
    </el-table>
    <!-- <Pagination :total="1" /> -->
    <Pagination />
  </div>
</template>
<style lang="scss">
.last90-days-arrow {
  .el-popper__arrow::before {
    background: #384482 !important;
    border-color: #384482 !important;
  }
}
</style>
<style lang="scss" scoped>
.activity-container {
  .dropdown-btn {
    background: #3c4c76;
    border-radius: 16px;
    border: none;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    color: #ffff;
    border-radius: 14px;
    -webkit-border-radius: 14px;
    -moz-border-radius: 14px;
    &:hover {
      background: #3e5389;
    }
  }

  .el-table {
    margin-top: 15px;
    margin-bottom: 15px;
    p {
      margin: 0;
    }
    .el-col-6 {
      width: 135px;
    }
  }
  .item-group {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
  }
  .el-table th.is-leaf,
  .el-table td {
    border-bottom: 0px solid #00000050 !important;
    padding: 10px;
    margin: 0;
  }
  .el-table::before,
  .el-table--group::after,
  .el-table--border::after {
    background-color: #000 !important;
  }
  :deep(.el-table tr),
  :deep(.el-table thead),
  :deep(.el-table__cell.is-leaf),
  :deep(.el-table__cell),
  :deep(.el-table__inner-wrapper::before) {
    background-color: #0d1333 !important;
    border: none;
  }
  :deep(.el-table thead),
  :deep(.el-table__cell.is-leaf),
  :deep(.el-table__cell) {
    color: white;
  }
}
</style>
