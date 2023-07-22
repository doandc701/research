<script setup lang="ts">
/*
  // issues ----------
  1. jumper input mất hover
  */
import { computed, ref } from "vue";
import { useAppStoreHook } from "/@/store/modules/app";
import { emitter } from "/@/utils/mitt";

defineOptions({
  name: "Pagination"
});

// defineProps
const props = defineProps({
  total: {
    // tổng số items
    required: true,
    type: Number
  },
  page: {
    // page hiện tại
    type: Number,
    default: 1
  },
  limit: {
    // bằng chính pageSizes đang chọn
    type: Number,
    default: 20
  },
  // select options để chọn số lượng hiển thị trên trang, khi thay đổi limit cũng thay đổi
  // thường không dùng đến vì không được sử dụng trong layout
  pageSizes: {
    type: Array,
    default() {
      return [20, 30, 50, 100];
    }
  },
  layout: {
    type: String,
    default: "total, prev, pager, next, jumper" // sizes / prev / pager / next / jumper / -> / total / slot
  },
  autoScroll: {
    // scroll to top khi thay đổi current page
    type: Boolean,
    default: true
  }
});

// defineEmits
const emit = defineEmits<{
  (e: "update:page", val: number): void; // update props
  (e: "update:limit", val: number): void; // update props
  (e: "pagination", val: { page: number; limit: number }): void; // emit to parent
}>();

// Variables --------------------
// const pageSize = ref(props.limit);
const pageSize = computed({
  get(): number {
    return props.limit;
  },
  set(val: number): void {
    emit("update:limit", val);
  }
});
// const currentPage = ref(props.page);
const currentPage = computed({
  get(): number {
    return props.page;
  },
  set(val: number): void {
    emit("update:page", val);
  }
});

const device = computed(() => {
  return useAppStoreHook().device;
});
// end: Variables --------------------

// Methods --------------------
const handleSizeChange = (size: number) => {
  emit("pagination", { page: currentPage.value, limit: size });
  if (props.autoScroll) scrollTo(0);
  // console.log("handleSizeChange, currentPage:" + currentPage.value, "size:" + size, "props.limit:" + props.limit);
};

const handleCurrentChange = (currPage: number) => {
  emit("pagination", { page: currPage, limit: pageSize.value });
  if (props.autoScroll) scrollTo(0);
  // console.log("handleCurrentChange, pageSize:", pageSize.value);
};

const scrollTo = top => {
  emitter.emit("scrollTo", { left: 0, top });
};
// end: Methods --------------------
</script>

<template>
  <div class="pagination-container">
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="props.pageSizes"
      :layout="props.layout"
      :total="props.total"
      :small="device === 'mobile'"
      :disabled="currentPage < 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 60px 0 20px 0;
  .el-pagination {
    display: flex;
    flex-wrap: wrap;
    :deep(.el-pagination__total) {
      margin: 5px 16px 5px 0;
      color: #fff;
    }
    :deep(button) {
      color: #fff;
      background-color: transparent;
      &:hover {
        color: var(--el-pagination-hover-color);
      }
    }
    :deep(button:disabled) {
      color: var(--el-pagination-button-disabled-color);
      &:hover {
        color: var(--el-pagination-button-disabled-color);
      }
    }
    :deep(.el-pager) {
      display: contents;
      color: #fff;
    }
    :deep(.el-pager li) {
      margin: 5px 1px;
      color: #fff;
      background-color: transparent;
      border-radius: 8px;
      font-weight: bold;
      &:hover {
        color: #00f6ff;
      }
    }
    :deep(.el-pager li.is-active) {
      color: #fff;
      background: linear-gradient(
        94.9deg,
        #00bcff 0%,
        #5d7eff 48.44%,
        #5429a0 100%
      );
    }
    :deep(.el-pagination__jump) {
      margin: 5px 0 5px 16px;
      color: #fff;
    }
    :deep(.el-input__inner) {
      color: #fff;
    }
    :deep(.el-input__wrapper) {
      background-color: transparent !important;
      border: 1px solid #2d3b84 !important;
      outline: none !important;
      box-shadow: none;
    }
  }
}
</style>
