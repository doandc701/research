<script setup lang="ts">
import { useColumns } from "./columns";
import { getRoleList } from "/@/api/system";
import { reactive, ref, onMounted } from "vue";
import { type FormInstance } from "element-plus";
import { TableProBar } from "/@/components/ReTable";
import { type PaginationProps } from "@pureadmin/table";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

defineOptions({
  name: "Role"
});

const form = reactive({
  name: "",
  code: "",
  status: ""
});

let dataList = ref([]);
let loading = ref(true);
const { columns } = useColumns();

const formRef = ref<FormInstance>();

const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

function handleUpdate(row) {
  console.log(row);
}

function handleDelete(row) {
  console.log(row);
}

function handleCurrentChange(val: number) {
  console.log(`current page: ${val}`);
}

function handleSizeChange(val: number) {
  console.log(`${val} items per page`);
}

function handleSelectionChange(val) {
  console.log("handleSelectionChange", val);
}

async function onSearch() {
  loading.value = true;
  let { data } = await getRoleList();
  dataList.value = data.list;
  pagination.total = data.total;
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
      <el-form-item label="Role Name:" prop="name">
        <el-input
          v-model="form.name"
          placeholder="Please enter a role name"
          clearable
        />
      </el-form-item>
      <el-form-item label="Character ID:" prop="code">
        <el-input
          v-model="form.code"
          placeholder="Please enter a role ID"
          clearable
        />
      </el-form-item>
      <el-form-item label="State:" prop="status">
        <el-select
          v-model="form.status"
          placeholder="Please select a status"
          clearable
        >
          <el-option label="Activated" value="1" />
          <el-option label="Closed" value="0" />
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
      title="role list"
      :loading="loading"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon('add')">
          Add role
        </el-button>
      </template>
      <template v-slot="{ size, checkList }">
        <PureTable
          border
          align="center"
          showOverflowTooltip
          table-layout="auto"
          :size="size"
          :data="dataList"
          :columns="columns"
          :checkList="checkList"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
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
            <el-popconfirm title="Whether to confirm the deletion?">
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon('delete')"
                  @click="handleDelete(row)"
                >
                  delete
                </el-button>
              </template>
            </el-popconfirm>
            <el-dropdown>
              <el-button
                class="ml-3"
                link
                type="primary"
                :size="size"
                @click="handleUpdate(row)"
                :icon="useRenderIcon('more')"
              />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-button
                      class="reset-margin !h-20px !text-gray-500"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon('menu')"
                    >
                      menu permissions
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      class="reset-margin !h-20px !text-gray-500"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon('database')"
                    >
                      data permission
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </PureTable>
      </template>
    </TableProBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
