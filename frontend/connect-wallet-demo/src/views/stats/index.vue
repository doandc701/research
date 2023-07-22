<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import TableTokens from "./components/tokens.vue";
import TablePools from "./components/pools.vue";
import TableTransactions from "./components/transactions.vue";
import LineECharts from "./components/Echarts/LineECharts.vue";
import BarECharts from "./components/Echarts/BarECharts.vue";
// variable
const resizeHeight = ref("500px");

// !method
function handleWindowResize() {
  window.innerWidth < 740
    ? (resizeHeight.value = "300px")
    : (resizeHeight.value = "500px");
}

onMounted(() => {
  window.addEventListener("resize", handleWindowResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", handleWindowResize);
});
</script>
<template>
  <div id="analytics" class="analytics">
    <div class="overview">
      <h1 class="title">Overview</h1>
      <div class="dashboard">
        <div class="left">
          <div class="card">
            <LineECharts :resize-height="resizeHeight" />
          </div>
        </div>
        <div class="right">
          <div class="card">
            <BarECharts :resize-height="resizeHeight" />
          </div>
        </div>
      </div>
    </div>
    <TableTokens />
    <TablePools />
    <TableTransactions />
  </div>
</template>
<style lang="scss" scoped>
.analytics {
  color: #fff;
  .title {
    font-size: 20px;
    padding: 30px 0px;
  }

  .overview {
    .dashboard {
      display: flex;
      justify-content: center;
      .price {
        font-weight: 700;
      }
      .text {
        color: #ffffff50;
        font-weight: 600;
      }
      .card {
        height: 100%;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 16px;
        padding: 10px 10px;
      }
      .left {
        margin-right: 10px;
        min-width: 0px;
        max-width: 800px;
        width: 100%;
      }
      .right {
        position: relative;
        min-width: 0px;
        max-width: 800px;
        width: 100%;
        .card {
          position: relative;

          .button {
            position: absolute;
            right: 20px;
            top: 10px;
            margin-left: 10px;
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
      }
    }
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
@media screen and(min-width:741px) {
  .analytics .overview .dashboard .card {
    padding: 15px 20px;
  }
}
@media screen and(max-width:740px) {
  .analytics {
    .overview {
      .dashboard {
        justify-content: center;
        flex-wrap: wrap;
        .left {
          margin-right: 0px;
          margin-bottom: 15px;
        }
      }
    }
  }
}
@media screen and(min-width:741px) {
  .analytics {
    .title {
      font-size: 30px;
    }
    .overview .dashboard .price {
      font-size: 28px;
    }
  }
}
@media screen and(max-width:480px) {
  .analytics {
    .overview .dashboard {
      .card .price {
        font-size: 18px;
      }
      .right .card .button .el-button {
        padding: 5px 5px;
      }
    }
  }
}
</style>
