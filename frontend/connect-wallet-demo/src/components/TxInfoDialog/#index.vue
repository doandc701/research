<template>
  <!-- thêm v-if để xóa toàn bộ DOM khi không hiển thị dialog -->
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
    @closed="onClose"
  >
    <template v-if="'received' === status">
      <el-row justify="space-between" align="middle">
        <el-col :span="12">
          <el-row align="middle">
            <component :is="contents[0].token" style="margin-right: 5px" />
            <Symbol
              :src="contents[0].logoURI"
              :size="30"
              style="margin-right: 8px"
            />
            <span style="font-size: 18px">
              {{ contents[0].token }}
            </span>
          </el-row>
        </el-col>
        <el-col :span="12" style="text-align: right; font-size: 18px">
          {{ contents[0].amount }}
        </el-col>
      </el-row>
      <el-row
        v-if="contents[1]"
        justify="center"
        align="middle"
        style="margin: 5px"
      >
        <el-col :span="6" style="text-align: center">
          <el-icon :size="30">
            <IconifyIconOnline v-if="type === 'swap'" icon="ep:bottom" />
            <IconifyIconOnline v-else icon="ep:plus" />
          </el-icon>
        </el-col>
      </el-row>
      <el-row v-if="contents[1]" justify="space-between" align="middle">
        <el-col :span="12">
          <el-row align="middle">
            <component :is="contents[1].token" style="margin-right: 5px" />
            <Symbol
              :src="contents[1].logoURI"
              :size="30"
              style="margin-right: 8px"
            />
            <span style="font-size: 18px">
              {{ contents[1].token }}
            </span>
          </el-row>
        </el-col>
        <el-col :span="12" style="text-align: right; font-size: 18px">
          {{ contents[1].amount }}
        </el-col>
      </el-row>
      <div
        v-if="confirmMsg"
        style="
          word-break: break-word;
          font-size: 12px;
          color: rgb(209 228 255);
          padding-top: 15px;
          border-top: 1px solid rgb(40 120 232 / 81%);
          margin-top: 15px;
          line-height: 16px;
        "
      >
        {{ confirmMsg }}
      </div>
      <el-row justify="center" align="middle" style="margin-top: 25px">
        <el-button style="width: 100%" type="primary" round @click="onClick">
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
          <span style="font-size: 18px; font-weight: 500"
            >Waiting for confirmation...</span
          >
        </div>
        <div style="margin: 10px 0; color: rgb(215 223 235 / 85%)">
          <span>{{ waitingMsg }}</span>
        </div>
      </div>
    </template>

    <template v-if="['success', 'reverted', 'rejected'].includes(status)">
      <div style="text-align: center; margin-top: -20px;">
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
          <span v-if="status === 'success'" style="color: #85ddb1;">Success</span>
          <span v-if="status === 'reverted'" style="color: #dd8787;">Transaction Failed</span>
          <span v-if="status === 'rejected'">User Canceled</span>
        </div>
        <div style="color: #e09f9f; word-break: break-word">
          {{ mssError }}
        </div>
        <div v-if="status !== 'rejected'" style="margin-top: 10px">
          <p style="padding-bottom: 5px;">
            txID: <Address :addr="txid" style="color: #ffffff9e;" />
            <IconifyIconOnline
              icon="ep:copy-document"
              class="icon-copy"
              @click="copyText(txid)"
            />
          </p>
          <el-link
            v-for="exp in explorers"
            :underline="false"
            class="link-type01"
            target="_blank"
            rel="noopener"
            :href="exp.txs + txid"
          >
            <IconifyIconOnline icon="fa-solid:link" style="margin-right: 5px" />
            View on {{ exp.name }}
          </el-link>
        </div>
        <div style="margin-top: 20px">
          <el-button style="width: 100%" type="primary" round @click="onOk">
            OK
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Connex } from "@vechain/connex";
import { Ticker, Presume } from "/@/utils/connex";
import { copyText } from "/@/utils";
import Symbol from "/@/components/symbol/index.vue";
import Address from "/@/components/Address/index.vue";
// import * as types from '@/types'
import { getExplorers } from "/@/settings";

type ItemBase0 = {
  token: string;
  amount: string;
  logoURI: string;
};

export default defineComponent({
  name: "TxDialog",
  components: {
    Symbol,
    Address
  },
  props: {
    type: {
      type: String,
      required: true
    },
    confirmMsg: String,
    onConfirm: { type: Function, required: true },
    contents: { type: Array as () => Array<ItemBase0>, required: true }
  },
  emits: ["feedback"],
  data: () => {
    return {
      // general
      debug: false,

      task: null as unknown as Promise<Connex.Vendor.TxResponse | void>,
      txid: "",
      presume: null as unknown as Presume<Connex.Vendor.TxResponse>,
      dialogVisible: false,
      /*
        submitted: bắt đầu gửi request tới connex
        confirmed: đã gửi tx đi và đã có txid
        received: để hiển thị bảng Confirm trước khi swap, lỗi với error.message === "abort" cũng chuyển về trạng thái received 
          (có thể là đã gửi tx đi nhưng ngừng theo dõi tx đó, trường hợp này tạm xóa vì không kiểm soát được)
        rejected: lỗi từ connex trả về hoặc cancel hoặc timeout
        reverted: lỗi tx
        success: tx thành công
      */
      status: "received" as
        | "received"
        | "submitted"
        | "confirmed"
        | "rejected"
        | "reverted"
        | "success",

      explorers: getExplorers(),
      mssError: "",
      copyText
    };
  },
  computed: {
    waitingMsg(): string {
      let result = "";

      if (!["confirmed", "submitted"].includes(this.status)) {
        return result;
      }

      switch (this.type) {
        case "swap":
          result = `Swapping ${this.contents[0].amount} ${this.contents[0].token} for ${this.contents[1].amount} ${this.contents[1].token}`;
          break;
        case "add":
          result = `Supplying ${this.contents[0].amount} ${this.contents[0].token} and ${this.contents[1].amount} ${this.contents[1].token}`;
          break;
        case "remove":
          result = `Removing ${this.contents[0].amount} ${this.contents[0].token} and ${this.contents[1].amount} ${this.contents[1].token}`;
          break;
        case "claim":
          result = `Claiming ${this.contents[0].amount} ${this.contents[0].token}`;
          break;
        default:
          result = "Send transaction to blockchain";
          break;
      }
      return result;
    },
    title(): string {
      let result = "";

      if (this.status !== "received") {
        return result;
      }
      switch (this.type) {
        case "swap":
          result = "Confirm Swap";
          break;
        case "add":
          result = "You will supply";
          break;
        case "remove":
          result = "You will receive";
          break;
        case "claim":
          result = "You will receive";
          break;
      }
      return result;
    },
    icon(): string {
      return this.type === "swap" ? "el-icon-bottom" : "el-icon-plus";
    }
  },
  created() {
    let ticker: Ticker | null = null;
    let txVisitor: Connex.Thor.Transaction.Visitor | null = null;

    const task = () => {
      if (ticker) {
        ticker.stop();
      }
      ticker = new Ticker(this.$connex);
      ticker.tick(async (): Promise<void> => {
        const t = await txVisitor?.getReceipt();
        // console.log("receipt", t);
        if (t) {
          this.status = t.reverted ? "reverted" : "success";
          ticker && ticker.stop();
          this.$emit("feedback", this.status);
          // alert("done");
        }
      });
    };
    this.$watch("txid", (v: string) => {
      txVisitor = this.$connex.thor.transaction(v);
      task();
    });
  },
  methods: {
    open2(): void {
      // this.debug && console.log('TxInfoDialog ----------', 'open')
      this.dialogVisible = true;
      this.mssError = "";
    },
    open(): void {
      // this.debug && console.log('TxInfoDialog ----------', 'open')
      this.dialogVisible = true;
      this.mssError = "";
      this.onClick();
      // test
      // this.status = "success"; // rejected
      // this.txid = "0x7478dd5c7705ff4ff37e361130e863fc80fef773bbb21aedb48750b626d3ed06";
      // end: test
    },
    onClose(): void {
      // alert("onClose, status:" + this.status);
      if (this.presume) {
        this.presume.ignore();
      }
      // không emit feedback các trường hợp này vì đã emit ở trên
      if (!["reverted", "success"].includes(this.status)) {
        this.$emit("feedback", this.status);
      }
    },
    onOk(): void {
      this.dialogVisible = false;
      // nếu sử dụng v-if tại el-dialog, khi set dialogVisible = false sẽ không phát ra sự kiện onClose
      // vì thế cần emit feedback tại đây
      if (!["reverted", "success"].includes(this.status)) {
        this.$emit("feedback", this.status);
      }
    },
    async onClick(): Promise<void> {
      if (this.onConfirm && typeof this.onConfirm === "function") {
        this.status = "submitted";
        try {
          this.presume = new Presume(
            this.onConfirm as () => Promise<Connex.Vendor.TxResponse>
          );
          const tx = await this.presume.promise;
          this.txid = tx.txid;
          this.status = "confirmed";
        } catch (error) {
          // this.status = error.message === "abort" ? "received" : "rejected"; // tạm bỏ "received" vì không kiểm soát được
          this.status = "rejected";
          this.mssError = error.message;
        }
      }
    }
  }
});
</script>

<style lang="scss">
.txinfo-dialog {
  max-width: 340px !important;
}
</style>

<style lang="scss" scoped>
.icon-copy {
  display: inline;
  color: #fff;
  margin-left: 5px;
  cursor: pointer;
  &:hover {
    color: #4999ff;
  }
}
</style>
