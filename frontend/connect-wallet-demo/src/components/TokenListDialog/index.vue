<template>
  <el-dialog
    v-model="dialogVisible"
    custom-class="token-list-dialog"
    :title="dialogTitle"
    append-to-body
    destroy-on-close
    center
  >
    <div
      style="text-align: right; margin: -15px -15px 5px -15px; color: #ffffff69"
    >
      Your Balances
    </div>
    <el-scrollbar height="300px" class="token-list-body">
      <el-row
        v-for="item in tokenList"
        :key="item.address"
        class="token-item1"
        :class="{
          'token-item2': currentItems.includes(item.address),
          'token-item3': otherItems.includes(item.address)
        }"
        justify="space-between"
        align="middle"
        @click="tokenChange(item)"
      >
        <el-col :span="12">
          <el-row align="middle">
            <Symbol :src="item.logoURI" :size="24" style="margin-right: 5px" />
            <el-col :span="18" class="token-symbolname">
              <div>{{ item.symbol }}</div>
              <div>{{ item.name }}</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12" style="text-align: right; font-size: 16px">
          <Amount
            :balance="item.balanceOf"
            :decimals="item.decimals"
            :format="3"
          />
        </el-col>
      </el-row>
    </el-scrollbar>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Symbol from "/@/components/symbol.vue";
import Amount from "/@/components/amount.vue";
import { fromWei } from "/@/utils/connex";
import { useAppStoreHook } from "/@/store/modules/app";
import * as types from "/@/types";

export default defineComponent({
  name: "TokenListDialog",
  components: {
    Symbol,
    Amount
  },
  /*
  props: {
    dgType: {
      type: String,
      required: true
    }
  },*/
  emits: ["on-select"],
  data: () => {
    return {
      // general
      debug: false,

      dialogVisible: false,
      dialogTitle: "",
      dialogType: "", // chưa sử dụng
      fromCurrency: "vet",
      currentItems: [] as string[], // danh sách làm mờ và không thể select
      otherItems: [] as string[], // // danh sách làm mờ có thể select
      fromCurrencyItem: {} as types.TokenDetails,
      toCurrencyItem: {} as types.TokenDetails,
      tokenList: undefined
    };
  },
  created() {
    this.debug && console.log("TokenListDialog ----------", "created");
    this.tokenList = useAppStoreHook().tokenList;
  },
  methods: {
    fromWei(value: string, decimals: number) {
      if (typeof value === "undefined") return "---";
      if (typeof value === "string") return fromWei(value, decimals);
    },
    //
    open(
      dialogType: string,
      dialogTitle: string,
      currentItems = [""],
      otherItems = [""]
    ): void {
      this.dialogType = dialogType;
      this.dialogTitle = dialogTitle;
      this.currentItems = currentItems;
      this.otherItems = otherItems;
      this.dialogVisible = true;
      this.debug && console.log("showTokenListDialog->dialogType:", dialogType);
    },
    //
    close(): void {
      this.dialogVisible = false;
    },
    //
    tokenChange(item: types.TokenDetails): void {
      this.debug && console.log("tokenChange item:", item);
      if (this.currentItems.includes(item.address)) return;
      this.$emit("on-select", item);
    }
  }
});
</script>

<style lang="scss">
.token-list-dialog {
  max-width: 350px;
  width: 100% !important;
  // // background: #072f58;
  border: 2px solid #1167ea;
  .el-dialog__header {
    & span {
      color: inherit;
    }
  }
  .el-dialog__body {
    color: inherit;
  }
}
</style>

<style lang="scss" scoped>
.token-list-dialog {
  .token-list-body {
    margin: 0 -25px;
    border-top: 1px solid #1050ab;
    border-bottom: 1px solid #1050ab;
    .token-item1 {
      cursor: pointer;
      padding: 10px;
      &:hover {
        background-color: rgb(10 67 148);
      }
    }
    .token-item2 {
      opacity: 0.5;
      cursor: default;
    }
    .token-item3 {
      opacity: 0.5;
    }
    .token-symbolname {
      font-size: 18px;
    }
    .token-symbolname div:last-child {
      font-size: 12px;
      color: #7a9dce;
    }
  }
}
</style>
