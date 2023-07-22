<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed, ref, reactive } from "vue";
import type { FormInstance } from "element-plus";
// import { ElLoading } from "element-plus";
// import { message } from "@pureadmin/components";
import { $t, transformI18n } from "/@/plugins/i18n";
import { useUserStoreHook } from "/@/store/modules/user";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import Amount from "/@/components/Amount/index.vue";
import TxInfoDialog from "/@/components/TxInfoDialog/index.vue";
import { useGlobal } from "@pureadmin/utils";
import { toAscii, asciiToHex } from "/@/utils/connex";
import { copyText, timestampToUTC } from "/@/utils";
import { getExplorers } from "/@/settings";

const { $connex, $dAccount } = useGlobal<GlobalPropertiesApi>();

const { t } = useI18n();

interface Emits {
  (e: "registerSuccess"): void;
}
const emit = defineEmits<Emits>();

const dialogVisible = ref(false);
const loading = ref(false);
const updating = ref(false);
const txInfoDialogRef = ref(null);

const ruleForm = reactive({
  friend: "",
  name: ""
});
const regFee = ref("");
const blackList = ["vechain", "vpunk", "vpunks"];

const ruleFormRef = ref<FormInstance>();
const myName = computed(() => {
  return useUserStoreHook().dAccount.name;
});
// console.log("myName-----", myName);
const friendInputRule = [
  {
    validator: async (rule, value, callback) => {
      if (updating.value) return;
      value = value.replace(/ /g, "").toLowerCase(); // remove all whitespace
      ruleForm.friend = value;
      // console.log("value", value);
      if (value === "") {
        callback(new Error(transformI18n($t("login.veFamVIPReg"))));
      } else {
        const hex = `${asciiToHex(
          value
        )}0000000000000000000000000000000000000000000000000000000000000000`.slice(
          0,
          66
        );
        // console.log("hex", hex);
        loading.value = true;
        await $dAccount.getVipIDxName(hex).then(results => {
          // console.log("results", results);
          if (results === "0") {
            callback(new Error("VeFam VIP does not exist"));
          } else {
            callback();
          }
          loading.value = false;
          // console.log("loading------------------2");
        });
      }
    },
    trigger: "blur",
    required: true
  }
];

const nameInputRule = [
  {
    validator: (rule, value, callback) => {
      if (updating.value) return;
      value = value.replace(/ /g, "").toLowerCase(); // remove all whitespace and toLowerCase
      if (value.length >= 2 && value[0] === "0" && value[1] === "x") {
        value = value.slice(2, 34);
      }
      if (value.length > 32) value = value.slice(0, 32);
      ruleForm.name = value;
      // console.log("value", value.length);
      if (value === "") {
        callback(new Error("Please enter your VeFam VIP name"));
      } else if (/^[A-Za-z0-9]*$/.test(value) === false) {
        callback(new Error("Characters must be a-z, 0-9"));
      } else if (/^[0-9]*$/.test(value)) {
        callback(new Error("Cannot be only numbers"));
      } else if (value.length < 2) {
        callback(new Error("At least 2 characters"));
      } else if (blackList.includes(value)) {
        callback(new Error("The name is invalid or has been used"));
      } else {
        loading.value = true;
        $dAccount.checkIfNameValid(value).then(results => {
          // console.log("results", results, typeof results);
          if (results === true) {
            callback();
          } else {
            callback(new Error("The name is invalid or has been used"));
          }
          loading.value = false;
          // console.log("loading------------------3");
        });
      }
    },
    trigger: "blur",
    required: true
  }
];

const onUpdate = async (formEl: FormInstance | undefined) => {
  // console.log("txInfoDialogRef.value", txInfoDialogRef.value);
  // txInfoDialogRef.value.open();
  // return;

  if (!formEl) return;
  loading.value = true;
  await formEl.validate((valid, fields) => {
    if (valid) {
      updating.value = true;
      txInfoDialogRef.value.txConfirm();
      // Yêu cầu mô phỏng, cần được sửa đổi theo sự phát triển thực tế
      // setTimeout(() => {
      //   message.success(transformI18n($t("login.registerSuccess")));
      //   console.log("loading------------------4");
      //   reset();
      //   registerSuccess();
      // }, 2000);

      /* const clauses = $dAccount.registerNameXName(
        ruleForm.name,
        ruleForm.friend,
        regFee.value
      );
      console.log(`DAccount-----------------`, clauses);
      $connex.vendor
        .sign("tx", [clauses])
        .signer(useUserStoreHook().dAccount.myAddr)
        .request()
        .then(rs => {
          reset();
          registerSuccess();
          console.log(`rs-----------------`, rs);
        });*/
    } else {
      loading.value = false;
      return fields;
    }
  });
};
// Cancel or Error
function stop() {
  updating.value = false;
  loading.value = false;
}
//
function reset() {
  dialogVisible.value = false;
  updating.value = false;
  loading.value = false;
  ruleForm.friend = "";
  ruleForm.name = "";
}
function registerSuccess() {
  emit("registerSuccess");
}
//
function getRegistrationFee() {
  // console.log("getRegistrationFee");
  loading.value = true;
  $dAccount.getRegistrationFee().then(results => {
    regFee.value = results;
    loading.value = false;
    // console.log("regFee", regFee);
  });
}
interface RegisteredName {
  name: string;
  time: number;
  txID: string;
}
let registeredNameList: RegisteredName = [];
const loadingTab2 = ref(false);
const totalRegisteredName = ref(0);
async function getRegisteredName() {
  // console.log("getRegisteredName", myName.value.length);
  if (myName.value.length <= 0) return; // chưa đăng ký tên nào
  loadingTab2.value = true;
  let vipId = useUserStoreHook().dAccount.vipId;
  // console.log("vipId1-------", vipId);
  if (vipId === "") {
    vipId = await $dAccount.getVipIDxAddr(useUserStoreHook().dAccount.myAddr);
    if (vipId) useUserStoreHook().dAccount.vipId = vipId;
  }
  // console.log("vipId2-------", vipId);
  if (vipId === "") return;
  const vipInfo = await $dAccount.getVIPInfoxVIPId(vipId);
  // console.log("vipInfo-------", vipInfo);
  if (vipInfo) totalRegisteredName.value = parseInt(vipInfo.nameCount);

  //
  const fromIndex = 0;
  const event = await $dAccount.getEveRegisterName();
  const filter = event
    .filter([{ addr: useUserStoreHook().dAccount.myAddr }])
    .order("desc"); // Work from the last event
  const logResults = await filter.apply(fromIndex, 250).catch(() => {}); // this.listQuery.limit
  // console.log("logResults-------", logResults);
  registeredNameList.splice(0, registeredNameList.length); // để làm rỗng mảng hãy sử dụng splice nếu không có thể có lỗi không update DOM
  for (let i = 0; i < logResults.length; i++) {
    registeredNameList.push({
      name: toAscii(logResults[i].decoded.name).replace(/ /g, ""),
      time: timestampToUTC(logResults[i].meta.blockTimestamp),
      txID: logResults[i].meta.txID
    });
  }
  loadingTab2.value = false;
  // console.log("registeredNameList-------", registeredNameList);
  // const loading22 = ElLoading.service({
  //   // lock: true,
  //   background: "rgba(0, 0, 0, 0.1)"
  //   // fullscreen: true
  // });
  // setTimeout(() => {
  //   loading22.close()
  // }, 5000)
}
//
function open() {
  dialogVisible.value = true;
  loading.value = false;
  regFee.value = ""; // reset để lấy lại dữ liệu trong sự kiện tabChange
  totalRegisteredName.value = 0; // reset để lấy lại dữ liệu trong sự kiện tabChange
  registeredNameList.splice(0, registeredNameList.length); // reset
  if (activeName.value === "first") {
    onOpenFirstTab();
    getRegistrationFee();
  } else {
    getRegisteredName();
  }
}

async function onConfirm(): Promise<Connex.Vendor.TxResponse | void | unknown> {
  const clauses = [
    // $dAccount.registerNameXName("tvt3", "vefam", "1000000000000000000")
    $dAccount.registerNameXName(ruleForm.name, ruleForm.friend, regFee.value)
  ];
  // console.log("ruleForm-----", ruleForm);
  // console.log("clauses-----", clauses);
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("timeout"));
    }, 50000); // recommend: 50000
  });
  try {
    return Promise.race([
      myPromise,
      $connex.vendor
        .sign("tx", clauses)
        .signer(useUserStoreHook().dAccount.myAddr)
        .request()
    ]);
  } catch (error) {
    console.error(error);
  } finally {
    // this.resetInput()
  }
}
//
function txDialogFeedback(
  mss = "success" |
    "reverted" |
    "received" |
    "submitted" |
    "confirmed" |
    "rejected"
) {
  // alert("txDialogFeedback: " + mss);
  if (mss === "success") {
    reset();
    registerSuccess();
  } else {
    // Cancel, Error or reverted
    stop();
  }
}

//
defineExpose({
  open
});
const activeName = ref("first");
function onOpenFirstTab() {
  const refer = useUserStoreHook().refer;
  if (refer) ruleForm.friend = refer;
  // console.log("onOpenFirstTab, refer:", refer);
}
function openRegisterName() {
  activeName.value = "first";
}

function tabChange(name: TabPanelName) {
  // console.log("tabChange", name);
  if (name === "first") {
    onOpenFirstTab();
    if (regFee.value === "") getRegistrationFee();
  } else {
    if (totalRegisteredName.value === 0) getRegisteredName();
  }
}

const baseVipLink = "https://vefam.com/account?vip=";
const exLink = getExplorers()[0].txs; // "https://explore-testnet.vechain.org/transactions/";
/* const listQuery = {
  page: 1,
  limit: 30 // recommended: 30 , vechain: 30
  // pageSizes: [30] // recommended: [30]
}; */
</script>

<template>
  <TxInfoDialog
    ref="txInfoDialogRef"
    :on-confirm="onConfirm"
    @feedback="txDialogFeedback"
  />

  <div class="dialog-register">
    <el-dialog
      v-model="dialogVisible"
      title="Register VIP Name"
      custom-class="dialog-type1 reg-name-dialog"
      :show-close="false"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <div :id="titleId" :class="titleClass">
            <el-tabs
              v-model="activeName"
              class="demo-tabs"
              @tab-change="tabChange"
              lazy
            >
              <!---------- tab-pane: first ---------->
              <el-tab-pane label="Register VeFam VIP" name="first">
                <el-form
                  ref="ruleFormRef"
                  :model="ruleForm"
                  :rules="loginRules"
                  size="large"
                  label-width="70px"
                  @keyup.enter="onUpdate(ruleFormRef)"
                >
                  <div v-if="myName.length <= 0" class="input-group">
                    <el-form-item
                      prop="friend"
                      label="Friend"
                      :rules="friendInputRule"
                    >
                      <el-input
                        clearable
                        v-model="ruleForm.friend"
                        placeholder="VeFam VIP friend"
                        :readonly="updating"
                        :prefix-icon="useRenderIcon('user')"
                      />
                    </el-form-item>
                  </div>

                  <div class="input-group">
                    <el-form-item
                      label="Name"
                      prop="name"
                      :rules="nameInputRule"
                    >
                      <el-input
                        clearable
                        v-model="ruleForm.name"
                        placeholder="Your VIP name"
                        :readonly="updating"
                        :prefix-icon="useRenderIcon('card')"
                      />
                    </el-form-item>
                  </div>

                  <div class="input-group">
                    <el-form-item label="Fee" style="margin-bottom: 0">
                      <Amount :balance="regFee" />
                      <pre> VET</pre>
                    </el-form-item>
                  </div>

                  <div>
                    <el-button
                      class="w-full mt-4"
                      size="default"
                      type="primary"
                      round
                      :loading="loading || updating"
                      @click="onUpdate(ruleFormRef)"
                    >
                      {{ t("login.register") }}
                    </el-button>
                  </div>

                  <div class="ask">
                    <p>Name must be between 2 and 32 characters</p>
                    <p>Characters must be a-z, 0-9</p>
                    <p>Cannot be only numbers</p>
                  </div>
                </el-form>
              </el-tab-pane>
              <!---------- end: tab-pane: first ---------->

              <!---------- tab-pane: second ---------->
              <el-tab-pane
                label="All My VIP Cards"
                name="second"
                v-loading="loadingTab2"
              >
                <div class="register-vs-btn">
                  <span style="word-break: break-word">
                    Registered name: <b>{{ totalRegisteredName }}</b>
                  </span>
                  <div class="border-linear01" style="margin-right: 9px">
                    <el-button
                      class="button-type02"
                      round
                      size="small"
                      @click="openRegisterName"
                    >
                      Register VIP
                    </el-button>
                  </div>
                </div>
                <div class="list-accounts">
                  <ul
                    style="list-style-type: circle"
                    v-for="item in registeredNameList"
                    :key="item.name"
                  >
                    <li style="margin-bottom: 10px">
                      <el-row :gutter="20">
                        <el-col :span="19">
                          <span>
                            <span style="color: #45bbff">
                              {{ item.name }}:
                            </span>
                            registered at
                            <el-link
                              type="primary"
                              :href="exLink + item.txID"
                              target="_blank"
                              >{{ item.time }}</el-link
                            >
                          </span>
                        </el-col>
                        <el-col :span="1">
                          <IconifyIconOnline
                            icon="ep:copy-document"
                            class="icon-copy"
                            @click="copyText(baseVipLink + item.name)"
                          />
                        </el-col>
                      </el-row>
                    </li>
                  </ul>
                </div>
                <!-- <div class="button-group">
                  <el-button-group>
                    <el-button type="primary">
                      <IconifyIconOnline icon="ep:arrow-left" />Previous
                    </el-button>
                    <el-button type="primary">
                      Next <IconifyIconOnline icon="ep:arrow-right"
                    /></el-button>
                  </el-button-group>
                  <span style="padding-left: 15px"
                    >Page {{ listQuery.page }}</span
                  >
                </div> -->
              </el-tab-pane>
              <!---------- end: tab-pane: second ---------->
            </el-tabs>
          </div>
          <div style="display: flex; justify-content: flex-end">
            <el-button class="btn-close" type="info" plain @click="close">
              Close
              <IconifyIconOnline icon="ep:close" />
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.reg-name-dialog.dialog-type1) {
  width: 90%;
  max-width: 500px;
  min-width: 300px;
}
:deep(.el-dialog__body) {
  color: #fff;
}
:deep(.el-form-item__label) {
  color: #fff;
}
.ask {
  margin-top: 20px;
  word-break: break-word;
  font-size: 15px;
  color: #ffffff90;
}

// dialog
.dialog-register {
  :deep(.el-dialog__headerbtn .el-dialog__close) {
    color: #fff;
    &:hover {
      color: rgb(157, 157, 157);
    }
  }
  :deep(.el-dialog__body) {
    display: none;
  }
  :deep(.el-dialog__header) {
    margin-right: unset !important;
  }
  :deep(.el-input__wrapper) {
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.25);
    box-shadow: none;
    transition: 0.5s ease-out;
    &:hover {
      box-shadow: 0 0 0 1px #767676 inset;
    }
    &:focus-within {
      box-shadow: 0 0 0 1px #45bbff inset !important;
    }
  }
  // --el-input-focus-border: #45bbff !important;
  :deep(.el-form-item.is-error .el-input__wrapper) {
    transition: 0.5s ease-out;
    box-shadow: 0 0 0 1px rgba(255, 100, 100, 0.872) inset;
  }
  :deep(.el-input--large .el-input__inner) {
    color: #ffff;
  }
  // tabs
  :deep(.el-tabs__content) {
    font-size: 16px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .el-tab-pane {
    margin-top: 8px;
  }
  :deep(.el-tabs__nav-prev.is-disabled) {
    line-height: 27px;
  }
  :deep(.el-tabs__nav-next, .el-tabs__nav-prev) {
    line-height: 27px;
  }
  :deep(.el-tabs__nav-prev) {
    line-height: 27px;
  }
  :deep(.el-tabs__nav.is-top) {
    margin-top: -10px;
  }
  // :deep(.el-tabs__nav-scroll) {
  //   margin-bottom: 8px;
  // }
  :deep(.el-tabs__item.is-active) {
    color: #fff !important;
    font-weight: bold;
    font-size: 17px;
  }
  :deep(.el-tabs__item) {
    color: rgb(150, 150, 150);
    font-size: 17px;
    margin-bottom: 7px;
  }
  :deep(.el-tabs__header .el-tabs__nav-wrap::after) {
    background-color: #4b537d;
    opacity: 0.4;
    height: 1px;
  }
  :deep(.el-tabs__nav-scroll .el-tabs__active-bar) {
    background-color: #45bbff;
    height: 2px;
  }
  // end tabs
  .list-accounts {
    padding: 20px 0px 0px 20px;
    .el-row {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      .el-col-19 {
        padding: 0 !important;
      }
      .el-col-1 {
        padding-right: 16px !important;
      }
    }
    li {
      word-break: break-word;
    }
    .icon-copy {
      cursor: pointer;
      // margin-right: 9px;
      &:hover {
        color: #45bbff;
      }
    }
  }
  .register-vs-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .btn-close {
    color: #45bbff;
    background-color: transparent;
    border: 1px solid #45bbff;
    border-radius: 10px;
    margin-bottom: 10px;
    &:hover {
      color: #76ccfd;
      border: 1px solid #76ccfd;
    }
  }
  .button-group {
    border: none;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 100px;
    .el-button-group {
      .el-button {
        font-size: 12px;
        background-color: rgba(0, 0, 0, 0.25);
        color: rgba(255, 255, 255, 0.75);
        border: none;
        &:hover {
          color: #45bbff;
        }
      }
    }
    span {
      color: rgba(255, 255, 255, 0.75);
      font-size: 12px;
    }
  }
}
</style>
