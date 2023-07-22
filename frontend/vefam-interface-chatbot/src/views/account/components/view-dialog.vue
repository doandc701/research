<script setup lang="ts">
// import { useI18n } from "vue-i18n";
import { ref } from "vue";
// import { ElMessage } from "element-plus";
// import { useVerifyCode } from "../utils/verifyCode";
// import { $t, transformI18n } from "/@/plugins/i18n";
import { useUserStoreHook } from "/@/store/modules/user";
import Amount from "/@/components/Amount/index.vue";
import TxInfoDialog from "/@/components/TxInfoDialog/index.vue";
import { useGlobal } from "@pureadmin/utils";

const { $connex, $dAccount } = useGlobal<GlobalPropertiesApi>();

// const { t } = useI18n();

interface Emits {
  (e: "registerSuccess"): void;
}
const emit = defineEmits<Emits>();

const dialogVisible = ref(false);
const loading = ref(false);
const updating = ref(false);
const txInfoDialogRef = ref(null);

const referReward = ref("");

const programList = [
  {
    title: "2022/11/01: VPunks Weapons minting program",
    status: "In Progress", // "Upcoming", "In Progress", "Passed",
    description:
      "- 10% to 25% of purchased amount used as rebate reward<br>- <span class='highlights'>80% for first-level</span> inviter and <span class='highlights'>20% for second-level</span> inviter"
  },
  {
    title: "2022/12/--: Larva heroes minting program",
    status: "Upcoming"
  }
];
const activeColors = {
  Upcoming: "#fff700",
  "In Progress": "#05ff00",
  Passed: "#00fff0"
};

//
function withdrawRewards() {
  // console.log("txInfoDialogRef.value", txInfoDialogRef.value);
  txInfoDialogRef.value.txConfirm();
}

async function onConfirm(): Promise<Connex.Vendor.TxResponse | void | unknown> {
  const clauses = [$dAccount.claim()];
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
    referReward.value = "0";
    useUserStoreHook().dAccount.referReward = "0";
    dialogVisible.value = false;
  }
}
//
function open() {
  dialogVisible.value = true;
  loading.value = true;
  referReward.value = useUserStoreHook().dAccount.referReward;
}
//
defineExpose({
  open
});
//
const activeName = ref("first");
const listQuery = {
  page: 1,
  limit: 30 // recommended: 30 , vechain: 30
  // pageSizes: [30] // recommended: [30]
};
</script>

<template>
  <TxInfoDialog
    ref="txInfoDialogRef"
    type="default"
    :on-confirm="onConfirm"
    @feedback="txDialogFeedback"
  />

  <div class="dialog-view">
    <el-dialog v-model="dialogVisible" custom-class="view-dialog dialog-type1">
      <template #header="{ titleId, titleClass }">
        <div class="my-header">
          <div :id="titleId" :class="titleClass">
            <el-tabs v-model="activeName" class="demo-tabs">
              <el-tab-pane label="My Rewards" name="first">
                <div class="rewards-vs-btn">
                  <span>
                    Rewards:
                    <span style="color: #45bbff; word-break: break-word">
                      <Amount :balance="referReward" /> VET
                    </span>
                  </span>
                  <div
                    :class="{ disabled: referReward === '0' }"
                    class="border-linear01"
                    style="margin-right: 9px"
                  >
                    <el-button
                      class="button-type02"
                      round
                      size="small"
                      :disabled="referReward == '0'"
                      @click="withdrawRewards"
                    >
                      Withdraw
                    </el-button>
                  </div>
                </div>
                <div class="list-rewards">
                  <!-- <ul style="list-style-type: circle">
                    <li style="margin-bottom: 10px">
                      2022/09/29: Recived 12,560.456 VET, VPunks Weapon minting
                      program
                    </li>
                    <li>
                      2022/09/26: Received 22,560.456 VET, VPunks Weapon minting
                      program
                    </li>
                  </ul> -->
                </div>
                <div class="button-group">
                  <el-button-group>
                    <el-button type="primary">
                      <IconifyIconOnline icon="ep:arrow-left" />Previous
                    </el-button>
                    <el-button type="primary">
                      Next <IconifyIconOnline icon="ep:arrow-right" />
                    </el-button>
                  </el-button-group>
                  <span style="padding-left: 15px">
                    Page {{ listQuery.page }}
                  </span>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Programs" name="second">
                <div class="list-program">
                  <ul style="list-style-type: circle">
                    <li v-for="item in programList" style="margin-bottom: 20px">
                      <span>{{ item.title }}</span>
                      <span :style="{ color: activeColors[item.status] }">
                        [{{ item.status }}]
                      </span>
                      <div v-html="item.description" />
                    </li>
                  </ul>
                </div>
                <div class="button-group">
                  <el-button-group>
                    <el-button type="primary">
                      <IconifyIconOnline icon="ep:arrow-left" />Previous
                    </el-button>
                    <el-button type="primary">
                      Next <IconifyIconOnline icon="ep:arrow-right" />
                    </el-button>
                  </el-button-group>
                  <span style="padding-left: 15px">
                    Page {{ listQuery.page }}
                  </span>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.highlights {
  color: #ffe300;
}
</style>

<style lang="scss" scoped>
:deep(.dialog-type1.view-dialog) {
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
// dialog
.dialog-view {
  :deep(.el-dialog__header) {
    margin-right: unset !important;
  }
  :deep(.el-dialog__headerbtn) {
    top: 2px;
  }
  :deep(.el-dialog__headerbtn .el-dialog__close) {
    color: #fff;
    &:hover {
      color: rgb(157, 157, 157);
    }
  }
  // tabs
  :deep(.el-dialog__body) {
    display: none;
  }
  :deep(.el-tabs__content) {
    font-size: 16px;
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
  .rewards-vs-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .list-rewards {
    padding: 10px 0px 0px 20px;
    li {
      word-break: break-word;
    }
  }
  .list-program {
    padding: 10px 0px 0px 20px;
    li {
      word-break: break-word;
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
