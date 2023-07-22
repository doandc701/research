<script setup lang="ts">
import { onMounted, computed, ref, watch } from "vue";
import { Connex } from "@vechain/connex";
import { Ticker, Presume } from "/@/utils/connex";
import { copyText } from "/@/utils";
import { getExplorers } from "/@/settings";
import { useGlobal } from "@pureadmin/utils";

import Symbol from "/@/components/Symbol/index.vue";
import Address from "/@/components/Address/index.vue";
import Amount from "/@/components/Amount/index.vue";

defineOptions({
  name: "TxInfoDialog"
});

const props = defineProps({
  onConfirm: {
    type: Function,
    required: true
  }
});

let presume = null as unknown as Presume<Connex.Vendor.TxResponse | void>;
// let task = null as unknown as Promise<Connex.Vendor.TxResponse | void>;
const { $connex } = useGlobal<GlobalPropertiesApi>();
const debug = ref(false);
const dialogVisible = ref(false);
const titleTxDialog = ref(undefined);
const withdrawContent = ref(undefined);
const confirmMsg = ref("");
const waitingMsg = ref("");
const mssError = ref("");
const txid = ref("");
const succMsg = ref("");
const falseContent = ref("");
const emit = defineEmits(["feedback"]);
const actionType = ref("transaction" as "transaction" | "withdraw");
const explorers = getExplorers();
const status = ref(
  "received" as
    | "received"
    | "submitted"
    | "confirmed"
    | "rejected"
    | "reverted"
    | "success"
);

/*
  submitted: bắt đầu gửi request tới connex
  confirmed: đã gửi tx đi và đã có txid
  received: để hiển thị bảng Confirm trước khi swap, lỗi với error.message === "abort" cũng chuyển về trạng thái received
    (có thể là đã gửi tx đi nhưng ngừng theo dõi tx đó, trường hợp này tạm xóa vì không kiểm soát được)
  rejected: lỗi từ connex trả về hoặc cancel hoặc timeout
  reverted: lỗi tx
  success: tx thành công
*/

onMounted(() => {
  let ticker: Ticker | null = null;
  let txVisitor: Connex.Thor.Transaction.Visitor | null = null;

  const task = () => {
    if (ticker) {
      ticker.stop();
    }
    ticker = new Ticker($connex);
    ticker.tick(async (): Promise<void> => {
      if (!txVisitor) return;
      const t = await txVisitor.getReceipt();
      // console.log("receipt", t);
      if (t) {
        status.value = t.reverted ? "reverted" : "success";
        ticker && ticker.stop();
        emit("feedback", status.value);
        // alert("done");
      }
    });
  };

  watch(txid, (v: string) => {
    txVisitor = $connex.thor.transaction(v);
    task();
  });
});

function handlleWaitingMsg() {
  if (actionType.value == "withdraw") {
    return waitingMsg.value;
  } else {
    waitingMsg.value = "Send transaction to blockchain";
  }
}

function handleFalseContent() {
  if (actionType.value == "withdraw") {
    falseContent.value = "Failed";
    return;
  } else if (actionType.value == "transaction") {
    falseContent.value = "User cancel";
  }
}

const title = computed(() => {
  if (status.value === "received") {
    return titleTxDialog.value;
  }
  return "";
});

function apiOpenConfirm(
  titleWithdraw: string,
  infoContents: string,
  withdrawInfo: Indexable,
  waitingMsgApi: string,
  finalContents: string
): void {
  if (debug.value) console.log("apiOpenConfirm ----------", "open");
  dialogVisible.value = true;
  titleTxDialog.value = titleWithdraw;
  confirmMsg.value = infoContents;
  succMsg.value = finalContents;
  waitingMsg.value = waitingMsgApi;
  status.value = "received";
  withdrawContent.value = withdrawInfo[0];
  // console.log("withdrawAmount", Object.keys(withdrawContent.value)[0]);
  actionType.value = "withdraw";
  mssError.value = "";
}

function apiConfirm(waitingMsgApi: string): void {
  dialogVisible.value = true;
  waitingMsg.value = waitingMsgApi;
  apiConfirmDialog();
  console.log("status.value", status.value);
}

// old: open()
function txConfirm(): void {
  if (debug.value) console.log("txConfirm ----------", "open");
  dialogVisible.value = true;
  actionType.value = "transaction";
  mssError.value = "";
  handlleWaitingMsg();
  handleFalseContent();
  txConfirmDialog();
  // test
  // this.status = "success"; // rejected
  // this.txid = "0x7478dd5c7705ff4ff37e361130e863fc80fef773bbb21aedb48750b626d3ed06";
  // end: test
}

function onClose(): void {
  // alert("onClose, status:" + status.value);
  if (presume) {
    presume.ignore();
  }
  // không emit feedback các trường hợp này vì đã emit ở trên
  if (!["reverted", "success"].includes(status.value)) {
    emit("feedback", status.value);
  }
}

function onOk(): void {
  dialogVisible.value = false;
  // nếu sử dụng v-if tại el-dialog, khi set dialogVisible = false sẽ không phát ra sự kiện onClose
  // vì thế cần emit feedback tại đây
  if (!["reverted", "success"].includes(status.value)) {
    emit("feedback", status.value);
  }
}

async function apiConfirmDialog() {
  if (props.onConfirm && typeof props.onConfirm === "function") {
    status.value = "submitted";
    try {
      presume = new Presume(
        props.onConfirm as () => Promise<Connex.Vendor.TxResponse>
      );
      const tx = await presume.promise;
      console.log("tx-111111", tx);
      // status.value = !tx ? "rejected" : "success"; // test success
      // console.log("onConfirm result", tx.data);
      if (tx.data.success == false) {
        status.value = "rejected";
        mssError.value = tx.data.errorMess[0];
      } else if (tx.data.success == true) {
        status.value = "success";
        emit("feedback", status.value);
      }
      actionType.value = "withdraw";
      handleFalseContent();
    } catch (error) {
      // this.status = error.message === "abort" ? "received" : "rejected"; // tạm bỏ "received" vì không kiểm soát được
      status.value = "rejected";
      mssError.value = error.message;
      handleFalseContent();
    }
  }
}

async function txConfirmDialog() {
  if (props.onConfirm && typeof props.onConfirm === "function") {
    status.value = "submitted";
    try {
      presume = new Presume(
        props.onConfirm as () => Promise<Connex.Vendor.TxResponse>
      );
      const tx = await presume.promise;
      txid.value = tx.txid;
      status.value = "confirmed";
      actionType.value = "transaction";
    } catch (error) {
      // this.status = error.message === "abort" ? "received" : "rejected"; // tạm bỏ "received" vì không kiểm soát được
      status.value = "rejected";
      mssError.value = error.message;
    }
  }
}

defineExpose({
  txConfirm,
  apiConfirm,
  apiOpenConfirm
});
</script>

<template>
  <div class="txInfo-container">
    <!-- thêm v-if để xóa toàn bộ DOM khi không hiển thị dialog center -->
    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      center
      :show-close="['received', 'submitted'].includes(status)"
      destroy-on-close
      :close-on-click-modal="false"
      custom-class="txinfo-dialog dialog-type1"
      :title="title"
      append-to-body
      @closed="onClose()"
    >
      <template v-if="'received' === status">
        <!-- new -->
        <el-row
          style="
            color: #d1e4ff;
            font-size: 16px;
            margin-top: -20px;
            justify-content: center;
            align-items: center;
          "
        >
          {{ withdrawContent.contents }}
        </el-row>
        <el-row
          style="
            color: #fff;
            margin-top: 15px;
            font-size: 20px;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            align-items: flex-end;
          "
          >
          <Amount
            style="margin-right: 5px; margin-left: 5px; color: #ffffff"
            :balance="withdrawContent.Receive.toString()"
            :decimals="withdrawContent.decimals"
            :precision="100"
          />
          <span style="font-size: 16px; margin-left: 5px">{{
            withdrawContent.Token
          }}</span></el-row
        >
        <div class="dashboardInfo">
          <el-row class="row-position" :gutter="24">
            <el-col class="col-left" :span="7">{{
              Object.keys(withdrawContent)[1]
            }}</el-col>
            <el-col class="col-right" :span="17">{{
              withdrawContent.Address
            }}</el-col>
          </el-row>
          <el-row class="row-position" :gutter="24">
            <el-col :span="7">{{ Object.keys(withdrawContent)[2] }}</el-col>
            <el-col class="col-right" :span="16">{{
              withdrawContent.Network
            }}</el-col>
          </el-row>
          <el-row class="row-position" :gutter="24">
            <el-col :span="7">{{ Object.keys(withdrawContent)[3] }}</el-col>
            <el-col class="col-right" :span="16">{{
              withdrawContent.Source
            }}</el-col>
          </el-row>
          <hr />
          <el-row class="row-position" :gutter="24">
            <el-col :span="7">{{ Object.keys(withdrawContent)[4] }}</el-col>
            <el-col class="col-right" :span="16">{{
              withdrawContent.Token
            }}</el-col>
          </el-row>
          <el-row class="row-position" :gutter="24">
            <el-col :span="7">{{ Object.keys(withdrawContent)[6] }}</el-col>
            <el-col class="col-right" :span="17">{{
              withdrawContent.Amount
            }}</el-col>
          </el-row>
          <el-row class="row-position" :gutter="24">
            <el-col :span="10">{{
              Object.keys(withdrawContent)[7].replace("_", " ")
            }}</el-col>
            <el-col class="col-right" :span="14">{{
              withdrawContent.Network_Fee
            }}</el-col>
          </el-row>
        </div>
        <div
          v-if="confirmMsg"
          style="
            word-break: break-word;
            font-size: 12px;
            color: rgb(209 228 255);
            margin-top: 10px;
            line-height: 16px;
            margin-left: -10px;
            margin-right: -10px;
          "
        >
          {{ confirmMsg }}
        </div>
        <el-row
          style="
            margin-top: 25px;
            margin-left: -15px;
            margin-right: -15px;
            justify-content: center;
            align-items: center;
          "
        >
          <el-button
            style="width: 100%"
            class="btn-confirm"
            type="primary"
            round
            @click="apiConfirmDialog()"
          >
            Confirm
          </el-button>
        </el-row>
      </template>

      <template v-if="['confirmed', 'submitted'].includes(status)">
        <div style="text-align: center">
          <div>
            <el-icon class="is-loading" :size="70" color="#c3dcff">
              <IconifyIconOnline icon="ep:loading" />
            </el-icon>
          </div>
          <div style="margin: 10px 0">
            <span style="font-size: 18px; font-weight: 500; color: #fff"
              >Waiting for confirmation...</span
            >
          </div>
          <div
            style="
              margin: 10px 0;
              color: rgb(215 223 235 / 85%);
              word-break: break-word;
            "
          >
            <span>{{ waitingMsg }}</span>
          </div>
        </div>
      </template>

      <template v-if="['success', 'reverted', 'rejected'].includes(status)">
        <div style="text-align: center; margin-top: -20px">
          <div>
            <el-icon
              :color="status === 'success' ? '#22a564' : '#CE4B4B'"
              :size="70"
            >
              <IconifyIconOnline
                v-if="status === 'success'"
                icon="ep:circle-check"
              />
              <IconifyIconOnline v-else icon="ep:circle-close" />
            </el-icon>
          </div>
          <div style="font-size: 20px">
            <span v-if="status === 'success'" style="color: #85ddb1"
              >Success</span
            >
            <span v-if="status === 'reverted'" style="color: #dd8787"
              >Transaction Failed</span
            >
            <span v-if="status === 'rejected'" style="color: #cacaca">{{
              falseContent
            }}</span>
          </div>
          <div style="color: #dc6363; word-break: break-word">
            {{ mssError }}
          </div>
          <div v-if="status !== 'rejected'" style="margin-top: 10px">
            <div v-if="'transaction' === actionType">
              <div
                style="
                  padding-bottom: 5px;
                  display: flex;
                  justify-content: center;
                  color: #fff;
                "
              >
                txID:
                <Address
                  :addr="txid"
                  style="color: #ffffff9e; margin-left: 5px"
                />
                <IconifyIconOnline
                  icon="ep:copy-document"
                  class="icon-copy"
                  @click="copyText(txid)"
                />
              </div>
              <el-link
                v-for="exp in explorers"
                :key="exp"
                :underline="false"
                class="link-type01"
                target="_blank"
                rel="noopener"
                :href="exp.txs + txid"
              >
                <IconifyIconOnline
                  icon="fa-solid:link"
                  style="margin-right: 5px"
                />
                View on {{ exp.name }}
              </el-link>
            </div>
            <div
              v-if="'withdraw' === actionType"
              style="word-break: break-word; color: #d1e4ff"
            >
              {{ succMsg }}
            </div>
          </div>
          <div style="margin-top: 20px">
            <el-button style="width: 100%" type="primary" round @click="onOk()">
              OK
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.txinfo-dialog {
  max-width: 340px !important;
  width: 90%;
}
.el-dialog__header {
  margin-right: unset;
}
</style>

<style lang="scss" scoped>
:deep(.el-dialog__header) {
  margin-right: unset;
}

.icon-copy {
  display: inline;
  color: #fff;
  margin-left: 5px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    color: #4999ff;
  }
}
.dashboardInfo {
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 15px;
  padding: 10px;
  margin-top: 15px;
  color: #ffffff80;
  margin-left: -15px;
  margin-right: -15px;
}
.row-position {
  justify-content: space-between;
  margin-top: 5px;
}
.col-right {
  text-align: right;
  color: #fff;
}
.col-left {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  word-break: break-word;
}
hr {
  height: 1px;
  color: rgb(28, 40, 98);
  margin-top: 14px;
  margin-bottom: 12px;
}
.btn-confirm {
  background-color: #1264f2;
  border: none;
  color: #fff;
  &:hover {
    background-color: #3177ef;
  }
}
</style>
