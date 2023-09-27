<template>
  <div class="activity-container">
    <h3 style="color: #00D4FF">Stats</h3>
    <LeaderboardZd />
    <div style="color: #0df11f;padding-top: 30px;">This feature is coming soon.</div>
    <h3 style="color: #00D4FF">Chart</h3>
    <el-row :gutter="20" style="margin: 0;">
      <el-dropdown>
        <el-button class="dropdown-btn" type="primary">
          Last 90 days <i class="el-icon-caret-bottom el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>Action 1</el-dropdown-item>
          <el-dropdown-item>Action 2</el-dropdown-item>
          <el-dropdown-item>Action 3</el-dropdown-item>
          <el-dropdown-item>Action 4</el-dropdown-item>
          <el-dropdown-item>Action 5</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
    <el-row class="chart-img">
      <img style="max-width:100%; padding: 20px" src="@/assets/chart.png">
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        label=""
        width="120px"
      >
        <template slot-scope="scope">
          <img src="@/assets/sale-tag.svg">
          <span style="margin-left: 10px; color: #33BA74;">{{ scope.row.sale }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Item"
        min-width="200px"
        align="center"
      >
        <template slot-scope="scope">
          <el-row :span="12">
            <el-row class="item-group">
              <el-avatar :size="35" src="https://www.larvalabs.com/cryptopunks/cryptopunk7344.png" />
              <el-col :span="6" class="name-date">
                <p>Name: {{ scope.row.item }}</p>
                <p>Name: {{ scope.row.item }}</p>
              </el-col>
            </el-row>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        label="Amount"
        align="center"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.price }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="From"
        align="center"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.from }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="Time"
        align="center"
        min-width="120px"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.time }}</p>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="1" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  name: 'Activity',
  components: {
    Pagination,
    LeaderboardZd: () => import(/* webpackChunkName: "LeaderboardZd" */ './leaderboard-zd.vue')
  },
  data() {
    return {
      tableData: [{
        sale: 'Win',
        item: '--',
        price: '00.00',
        quantity: '0',
        from: '--',
        to: '----',
        time: '1 second ago'
      }, {
        sale: 'Win',
        item: '--',
        price: '00.00',
        quantity: '0',
        from: '--',
        time: '1 second ago'
      }, {
        sale: 'Win',
        item: '--',
        price: '00.00',
        quantity: '0',
        from: '--',
        time: '1 second ago'
      }, {
        sale: 'Win',
        item: '--',
        price: '00.00',
        quantity: '0',
        from: '--',
        time: '1 second ago'
      }]
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.activity-container {
  .dropdown-btn {
    background: #3C4C76;
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
  .el-table th.is-leaf, .el-table td {
    border-bottom: 0px solid #00000050 !important;
    padding: 10px;
    margin: 0;
  }
  .el-table::before, .el-table--group::after, .el-table--border::after {
    background-color: #00000000;
  }
}
</style>
