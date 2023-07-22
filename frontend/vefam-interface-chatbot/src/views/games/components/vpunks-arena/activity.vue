<script setup lang="ts">
import chart from "/@/assets/img/chart.png";
</script>
<template>
  <div class="activity-container">
    <div style="color: #0df11f; padding: 30px 0px">
      This feature is coming soon.
    </div>
    <div class="dropdown-body">
      <el-dropdown popper-class="last90-days-arrow">
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
    <!-- <Pagination :total="1" /> -->
  </div>
</template>

<style lang="scss">
.last90-days-arrow {
  .el-popper__arrow::before {
    background: #181e3d !important;
    border-color: #181e3d !important;
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
