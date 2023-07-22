<script setup lang="ts">
import tree from "./tree.vue";
import { useColumns } from "./columns";
import { getUserList } from "/@/api/system";
import { reactive, ref, onMounted } from "vue";
import { type FormInstance } from "element-plus";
import { TableProBar } from "/@/components/ReTable";
import { type PaginationProps } from "@pureadmin/table";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";

defineOptions({
  name: "User"
});

const form = reactive({
  username: "",
  mobile: "",
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
  let { data } = await getUserList();
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
  <div class="main flex">
    <tree />
    <div class="flex-1 ml-4">
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        class="bg-white dark:bg-dark w-99/100 pl-8 pt-4"
      >
        <el-form-item label="Username: " prop="username">
          <el-input
            v-model="form.username"
            placeholder="Please enter username"
            clearable
          />
        </el-form-item>
        <el-form-item label="Cellphone number: " prop="mobile">
          <el-input
            v-model="form.mobile"
            placeholder="Please enter the phone number"
            clearable
          />
        </el-form-item>
        <el-form-item label="State: " prop="status">
          <el-select
            v-model="form.status"
            placeholder="Please choose"
            clearable
          >
            <el-option label="activated" value="1" />
            <el-option label="closed" value="0" />
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
          <el-button
            :icon="useRenderIcon('refresh')"
            @click="resetForm(formRef)"
          >
            reset
          </el-button>
        </el-form-item>
      </el-form>

      <TableProBar
        title="User Management"
        :loading="loading"
        :dataList="dataList"
        @refresh="onSearch"
      >
        <template #buttons>
          <el-button type="primary" :icon="useRenderIcon('add')">
            New users
          </el-button>
        </template>
        <template v-slot="{ size, checkList }">
          <PureTable
            border
            align="center"
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
                        :icon="useRenderIcon('password')"
                      >
                        Reset password
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        class="reset-margin !h-20px !text-gray-500"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon('role')"
                      >
                        Assigning Roles
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
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
</style>
