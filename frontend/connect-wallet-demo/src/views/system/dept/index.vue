<script setup lang="ts">
import { useColumns } from "./columns";
import { handleTree } from "@pureadmin/utils";
import { getDeptList } from "/@/api/system";
import { FormInstance } from "element-plus";
import { reactive, ref, onMounted } from "vue";
import { TableProBar } from "/@/components/ReTable";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

defineOptions({
  name: "Dept"
});

const form = reactive({
  user: "",
  status: ""
});
let dataList = ref([]);
let loading = ref(true);
const { columns } = useColumns();

const formRef = ref<FormInstance>();
const tableRef = ref();

function handleUpdate(row) {
  console.log(row);
}

function handleDelete(row) {
  console.log(row);
}

function handleSelectionChange(val) {
  console.log("handleSelectionChange", val);
}

async function onSearch() {
  loading.value = true;
  let { data } = await getDeptList();
  dataList.value = handleTree(data);
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
};

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="bg-white dark:bg-dark w-99/100 pl-8 pt-4"
    >
      <el-form-item label="Department name:" prop="user">
        <el-input
          v-model="form.user"
          placeholder="Please enter department name"
          clearable
        />
      </el-form-item>
      <el-form-item label="State:" prop="status">
        <el-select
          v-model="form.status"
          placeholder="Please select a status"
          clearable
        >
          <el-option label="turn on" value="1" />
          <el-option label="closure" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('search')"
          :loading="loading"
          @click="onSearch"
        >
          search
        </el-button>
        <el-button :icon="useRenderIcon('refresh')" @click="resetForm(formRef)">
          reset
        </el-button>
      </el-form-item>
    </el-form>

    <TableProBar
      title="Department List"
      :loading="loading"
      :tableRef="tableRef && tableRef.getTableRef()"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon('add')">
          add department
        </el-button>
      </template>
      <template v-slot="{ size, checkList }">
        <PureTable
          ref="tableRef"
          border
          align="center"
          row-key="id"
          table-layout="auto"
          default-expand-all
          :size="size"
          :data="dataList"
          :columns="columns"
          :checkList="checkList"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleUpdate(row)"
              :icon="useRenderIcon('edits')"
            >
              Revise
            </el-button>
            <el-popconfirm title="Are you sure to delete?">
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon('delete')"
                  @click="handleDelete(row)"
                >
                  Delete
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </PureTable>
      </template>
    </TableProBar>
  </div>
</template>
