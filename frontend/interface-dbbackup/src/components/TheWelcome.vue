<template>
  <div>
    <!-- Management Tables -->
    <TableData />
    <!--End Management Tables -->
    <el-button
      v-for="button in typeButtons"
      :key="button.buttonText"
      :type="button.color"
      @click="handleButtonApi(button.buttonText)"
      style="margin-top: 40px"
      >{{ button.buttonText }}</el-button
    >

    <div>
      <h1>
        Tồn tại
        {{ totalRecordBackUp }} ----- Bản ghi cần backup
        {{ recordBackUp }}
      </h1>
      <el-table :data="filterTableData" style="width: 100%">
        <el-table-column label="Message" prop="items.msg" />
        <el-table-column label="CreatedAt" prop="items.createdAt" />
        <el-table-column label="UpdatedAt" prop="items.updatedAt" />
        <el-table-column label="Active" prop="type" />
        <el-table-column align="right">
          <template #header>
            <el-input
              v-model="search"
              size="small"
              placeholder="Type to search"
            />
          </template>
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleBackUp(scope.$index, scope.row)"
            >
              BackUp
              <Icon icon="icon-park-outline:down-two" />
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDeleteBackUp(scope.$index, scope.row)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-count="totalPageOriginal"
        @current-change="handleChangePageBackUp"
      />
    </div>
    <div>
      <h1>
        Tồn tại
        {{ totalRecordRestore }} ----- Bản ghi cần restore
        {{ recordRestore }}
      </h1>
      <el-table :data="tableDataBackUp" style="width: 100%">
        <el-table-column label="Message" prop="items.msg" />
        <el-table-column label="CreatedAt" prop="items.createdAt" />
        <el-table-column label="UpdatedAt" prop="items.updatedAt" />
        <el-table-column label="Active" prop="type" />
        <el-table-column align="right">
          <template #default="scope">
            <el-button
              size="small"
              type="danger"
              @click="handleRestore(scope.$index, scope.row)"
            >
              Restore
              <Icon icon="icon-park-outline:up-two" />
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDeleteStore(scope.$index, scope.row)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :page-count="totalPageBackUp"
        @current-change="handleChangePageRestore"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, reactive } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { Icon } from "@iconify/vue";
import TableData from "./TableData.vue";

interface Messages {
  type: string;
  items: {
    _id: string;
    msg: string;
    createdAt: string;
    updatedAt: string;
  };
}

const uriMessages = import.meta.env.VITE_URL_MESSAGES;
const uriLocal = import.meta.env.VITE_URL;
const search = ref("");
const tableData: any = ref([]);
const tableDataBackUp: any = ref([]);
const totalPageOriginal = ref();
const totalPageBackUp = ref();
const totalRecordBackUp = ref();
const totalRecordRestore = ref();
const recordBackUp = ref(0);
const recordRestore = ref(0);
const typeButtons = [
  {
    buttonText: "Check Data",
    color: "primary",
    disable: false,
  },
  {
    buttonText: "Add Data",
    color: "info",
    disable: false,
  },
  {
    buttonText: "Update Data",
    color: "warning",
    disable: false,
  },
  {
    buttonText: "Delete Data",
    color: "danger",
    disable: false,
  },
  {
    buttonText: "Auto Schedule",
    color: "success",
    disable: false,
  },
];

const filterTableData = computed(() =>
  tableData.value.filter(
    (data: Messages) =>
      !search.value ||
      data.items.msg.toLowerCase().includes(search.value.toLowerCase())
  )
);

async function handleChangePageBackUp(value: number) {
  console.log("value", value);
  const { data } = await axios.get(`${uriLocal}`, {
    params: {
      page: value,
    },
  });
  console.log("data", data);
  tableData.value = data.result1;
}
async function handleChangePageRestore(value: number) {
  console.log("value", value);
  const { data } = await axios.get(`${uriLocal}/check-restore`, {
    params: {
      page: value,
    },
  });
  console.log("data", data);
  tableDataBackUp.value = data.result2;
}

async function handleDeleteBackUp(index: number, row: Messages) {
  console.log(index, row);
  ElMessageBox.confirm(
    `You are sure you want to delete ${row.items.msg}`,
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(async () => {
      const { data } = await axios.delete(
        `${uriMessages}/backup/${row.items._id}`
      );
      // console.log("data.....", data);
      if (!data.err) {
        tableData.value.splice(index, 1);
        ElMessage({
          type: "success",
          message: `Delete ${row.items.msg} completed`,
        });
      } else {
        ElMessage.error(`Oops, message ${row.items.msg}`);
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled",
      });
    });
}

async function handleDeleteStore(index: number, row: Messages) {
  console.log(index, row);
  ElMessageBox.confirm(
    `You are sure you want to delete ${row.items.msg}`,
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(async () => {
      const { data } = await axios.delete(
        `${uriMessages}/restore/${row.items._id}`
      );
      if (!data.err) {
        tableDataBackUp.value.splice(index, 1);
        ElMessage({
          type: "success",
          message: `Delete ${row.items.msg} completed`,
        });
      } else {
        ElMessage.error(`Oops, message ${row.items.msg}`);
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled",
      });
    });
}

async function handleBackUp(index: number, row: Messages) {
  const { data } = await axios.post(
    `${uriMessages}/backup/${row.items._id}`,
    row.items
  );
  // console.log("data,,,", data.err);
  if (!data.err) {
    tableData.value.splice(index, 1);
    ElMessage({
      type: "success",
      message: `Backup item ${row.items.msg} completed`,
    });
  } else {
    if (data.err.code === 11000) {
      ElMessage.error(`Oops, message ${row.items.msg} already exists.`);
    }
  }
}

async function handleRestore(index: number, row: Messages) {
  const { data } = await axios.post(
    `${uriMessages}/restore/${row.items._id}`,
    row.items
  );
  if (!data.err) {
    tableDataBackUp.value.splice(index, 1);
    ElMessage({
      type: "success",
      message: `Restore item ${row.items.msg} completed`,
    });
  }
}

async function handleButtonApi(typeBtn: string) {
  switch (typeBtn) {
    case "Check Data":
      await handleCallApi();
      break;
    case "Add Data":
      await axios.post(`${uriMessages}/adds`);
      break;
    case "Update Data":
      await axios.put(`${uriMessages}/updates`);
      break;
    case "Delete Data":
      await axios.delete(`${uriMessages}/deletes`);
      break;
    case "Auto Schedule":
      ElMessage({
        type: "success",
        message: "Start schedule success!",
      });
      await axios.get(`${uriLocal}/check-auto`);
      break;
  }
}

async function apiCheckMessBackUp() {
  try {
    const { data } = await axios.get(`${uriLocal}`);
    console.log("fetchDataCheckMessBackUp", data);
    totalRecordBackUp.value = data.recordBack.countDocMess;
    totalPageOriginal.value = data.pages;
    recordBackUp.value = data.recordBack.countDocBackUp;
    if (tableData.value.length <= 0) {
      tableData.value.push(...data.result1);
    } else {
      const result = data.result1.filter(
        (item: Messages) =>
          !tableData.value.find(
            (element: Messages) => element.items._id === item.items._id
          )
      );
      // console.log('result', result)
      tableData.value.push(...result);
    }
  } catch (error) {
    console.log(error);
  }
}

async function apiCheckMessRestore() {
  try {
    const { data } = await axios.get(`${uriLocal}/check-restore`);
    console.log("fetchDataCheckMessRestore", data);
    totalRecordRestore.value = data.recordRestore.countDocMessBackUp;
    totalPageBackUp.value = data.pages;
    recordRestore.value = data.recordRestore.countDocRestore;
    // -------------
    if (tableDataBackUp.value.length <= 0) {
      tableDataBackUp.value.push(...data.result2);
    } else {
      const result = data.result2.filter(
        (item: Messages) =>
          !tableDataBackUp.value.find(
            (element: Messages) => element.items._id === item.items._id
          )
      );
      tableDataBackUp.value.push(...result);
    }
  } catch (error) {
    console.log(error);
  }
}

async function handleCallApi() {
  apiCheckMessBackUp();
  apiCheckMessRestore();
}

onMounted(() => {
  handleCallApi();
});
</script>
