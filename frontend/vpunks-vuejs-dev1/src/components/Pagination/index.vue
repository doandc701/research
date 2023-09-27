<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, prev, pager, next, jumper'//  sizes,
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style lang="scss">
.pagination-container {
  /* background: #fff; */
  padding: 30px 10px;
  .el-pagination {
    white-space: normal;
    line-height: 220%;
  }
  .el-pagination__total, .el-pagination__jump {
    color: #ffff;
  }
  .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next, .el-pagination.is-background .el-pager li {
    background-color: #334166;
    color: #ffff;
    border-radius: 5px;
  }
  .el-pagination__editor.el-input .el-input__inner {
    background-color: #334166;
    border: none;
    border-radius: 5px;
    color: #fff;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #202440;
    color: #FFFFFF;
  }
  .el-pagination.is-background .btn-prev:disabled, .el-pagination.is-background .btn-next:disabled {
    color: #57595b;
  }
  .el-pagination.is-background .el-pager li:not(.active):hover {
      color: rgb(108, 226, 62);
  }
  .el-pagination.is-background .btn-prev:not(.disabled):hover, .el-pagination.is-background .btn-next:not(.disabled):hover {
    color: rgb(108, 226, 62);
  }
}
.pagination-container.hidden {
  display: none;
}
</style>
