<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { Icon } from "@iconify/vue";

interface Messages {
  _id: string;
  msg: string;
  createdAt: string;
  updatedAt: string;
}
// server api data
const uri = import.meta.env.VITE_URL_MESSAGES;
const uriBackUp = import.meta.env.VITE_URL_BACKUP;
const searchOriginal = ref("");
const searchBackUp = ref("");
const labelText = ref("Add");
const totalRecordOriginal = ref();
const totalRecordBackUp = ref();
const apiDataOriginal: any = ref([]);
const totalPageOriginal = ref(0);
const totalPageBackUp = ref(0);
const apiDataBackUp: any = ref([]);
const setRules = ref(true);
const cusDisable = ref(true);
const getID = ref("");
const formRef = ref("");
const typeEdit = ref("");
const numberValidateForm = reactive({
  msg: "",
});
// console.log("numberValidateForm", numberValidateForm.msg);
const filterTableDataOriginal = computed(() =>
  apiDataOriginal.value.filter(
    (data: Messages) =>
      !searchOriginal.value ||
      data.msg.toLowerCase().includes(searchOriginal.value.toLowerCase())
  )
);
const filterTableDataBackUp = computed(() =>
  apiDataBackUp.value.filter(
    (data: Messages) =>
      !searchBackUp.value ||
      data.msg.toLowerCase().includes(searchBackUp.value.toLowerCase())
  )
);

function handleInput(event: any) {
  if (event.length > 0) {
    if (event.trim().length > 0) {
      cusDisable.value = false;
    }
  } else {
    cusDisable.value = true;
  }
}
function submitForm(formEl: any | undefined) {
  if (!formEl) return;
  formEl.validate(async (valid: any) => {
    if (valid) {
      console.log("submit!", numberValidateForm.msg);
      if (numberValidateForm.msg.trim().length <= 0) return;
      if (labelText.value == "Add") {
        const { data } = await axios.post(
          uri,
          {
            msg: numberValidateForm.msg,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("data", data);
        if (data.code == 11000) {
          ElMessage.error(`Oops, message ${data.keyValue.msg} already exists.`);
          cusDisable.value = true;
          formEl.resetFields();
          return;
        }
        apiDataOriginal.value.unshift(data);
        apiDataOriginal.value.pop();
        totalRecordOriginal.value++;
      } else if (labelText.value == "Update") {
        if (typeEdit.value == "original") {
          const data = await shareEdit(uri);
          apiDataOriginal.value = apiDataOriginal.value.map((item: Messages) =>
            item._id !== data._id ? item : data
          );
        } else if (typeEdit.value == "backup") {
          const data = await shareEdit(uriBackUp);
          apiDataBackUp.value = apiDataOriginal.value.map((item: Messages) =>
            item._id !== data._id ? item : data
          );
        }
        labelText.value = "Add";
        cusDisable.value = true;
      }
      formEl.resetFields();
    } else {
      console.log("error submit!");
      return false;
    }
  });
}

async function shareEdit(url: string): Promise<Messages> {
  const { data } = await axios.put(
    `${url}/${getID.value}`,
    {
      msg: numberValidateForm.msg,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
}

function handleEditData(index: number, row: Messages, edit: string) {
  // console.log(index, row);
  labelText.value = "Update";
  getID.value = row._id;
  numberValidateForm.msg = row.msg;
  typeEdit.value = edit;
  cusDisable.value = false;
}

async function handleDeleteDataOriginal(index: number, row: Messages) {
  // console.log(index, row);
  ElMessageBox.confirm(
    `You are sure you want to delete ${row.msg}`,
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(async () => {
      await axios.delete(`${uri}/${row._id}`);
      apiDataOriginal.value.splice(index, 1);
      totalRecordOriginal.value--;
      ElMessage({
        type: "success",
        message: "Delete completed",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled",
      });
    });
}

async function handleDeleteDataBackUp(index: number, row: Messages) {
  // console.log(index, row);
  ElMessageBox.confirm(
    `You are sure you want to delete ${row.msg}`,
    "Warning",
    {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning",
    }
  )
    .then(async () => {
      await axios.delete(`${uriBackUp}/${row._id}`);
      apiDataBackUp.value.splice(index, 1);
      totalRecordBackUp.value--;
      ElMessage({
        type: "success",
        message: "Delete completed",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled",
      });
    });
}

async function handleChangePageOriginal(value: number) {
  console.log("value", value);
  const { data } = await axios.get(`${uri}`, {
    params: {
      page: value,
    },
  });
  console.log("data", data);
  for (let i = 0; i < data.length; i++) {
    apiDataOriginal.value = data[i].dataOriginal;
  }
}
async function handleChangePageBackUp(value: number) {
  console.log("value", value);
  const { data } = await axios.get(`${uriBackUp}`, {
    params: {
      page: value,
    },
  });
  console.log("data", data);
  for (let i = 0; i < data.length; i++) {
    apiDataBackUp.value = data[i].dataBackUp;
  }
}

async function apiMessOriginal() {
  try {
    const { data } = await axios.get(`${uri}`);
    console.log("11111", data);
    for (let i = 0; i < data.length; i++) {
      apiDataOriginal.value = data[i].dataOriginal;
      totalPageOriginal.value = data[i].pages;
    }
  } catch (error) {
    console.log(error);
    ElMessageBox.alert(
      "Server is under maintenance, please try again later",
      "Warning",
      {
        confirmButtonText: "OK",
        type: "warning",
        center: true,
        showClose: false,
      }
    );
  }
}
async function apiMessBackUp() {
  try {
    const { data } = await axios.get(`${uriBackUp}`);
    console.log("22222", data);
    for (let i = 0; i < data.length; i++) {
      apiDataBackUp.value = data[i].dataBackUp;
      totalPageBackUp.value = data[i].pages;
    }
  } catch (error) {
    console.log(error);
  }
}

function apiGetAllMess() {
  apiMessOriginal();
  apiMessBackUp();
}

onMounted(() => {
  apiGetAllMess();
});
</script>

<template>
  <el-form
    ref="formRef"
    :model="numberValidateForm"
    label-width="100px"
    class="demo-ruleForm"
    @submit.prevent
  >
    <el-form-item
      label="Message"
      prop="msg"
      :rules="[{ required: setRules, message: 'message is required' }]"
    >
      <el-input
        v-model="numberValidateForm.msg"
        type="text"
        autocomplete="off"
        @input="handleInput"
        @keyup.enter="submitForm(formRef)"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="success"
        :disabled="cusDisable"
        @click="submitForm(formRef)"
        >{{ labelText }}</el-button
      >
    </el-form-item>
  </el-form>
  <div>
    <h1>Data Original</h1>
    <el-table :data="filterTableDataOriginal" style="width: 100%">
      <el-table-column label="Message" prop="msg" />
      <el-table-column label="CreatedAt" prop="createdAt" />
      <el-table-column label="UpdatedAt" prop="updatedAt" />
      <el-table-column align="right">
        <template #header>
          <el-input
            v-model="searchOriginal"
            size="small"
            placeholder="Type to search"
          />
        </template>
        <template #default="scope">
          <!-- <el-button size="small" type="primary" @click="handleBackUpFromDataOriginal(scope.$index, scope.row)">
              BackUp
              <Icon icon="icon-park-outline:down-two" />
            </el-button> -->
          <el-button
            size="small"
            @click="handleEditData(scope.$index, scope.row, 'original')"
            >Edit</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDeleteDataOriginal(scope.$index, scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-count="totalPageOriginal"
      @current-change="handleChangePageOriginal"
    />
  </div>

  <div>
    <h1>Data BackUp</h1>
    <el-table :data="filterTableDataBackUp" style="width: 100%">
      <el-table-column label="Message" prop="msg" />
      <el-table-column label="CreatedAt" prop="createdAt" />
      <el-table-column label="UpdatedAt" prop="updatedAt" />
      <el-table-column align="right">
        <template #header>
          <el-input
            v-model="searchBackUp"
            size="small"
            placeholder="Type to search"
          />
        </template>
        <template #default="scope">
          <!-- <el-button size="small" type="primary" @click="handleBackUpFromDataOriginal(scope.$index, scope.row)">
              BackUp
              <Icon icon="icon-park-outline:down-two" />
            </el-button> -->
          <el-button
            size="small"
            @click="handleEditData(scope.$index, scope.row, 'backup')"
            >Edit</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDeleteDataBackUp(scope.$index, scope.row)"
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
</template>

<style scoped></style>
