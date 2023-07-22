<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Symbol from "/@/components/Symbol/index.vue";
import Amount from "/@/components/Amount/index.vue";
import { fromWei } from "/@/utils/connex";
import { useAppStoreHook } from "/@/store/modules/app";
import * as types from "/@/types";

const debug = ref(false);
const dialogTokenList = ref(false);
const titleDialog = ref("");
// const dialogType = ref(""); // did't used yet
const currentItems = ref([]);
const otherItems = ref([]);
const emit = defineEmits(["on-select"]);
const tokenList = computed(() => {
  return useAppStoreHook().tokenList;
});

defineOptions({
  name: "TokenListDialog"
});

// onMounted(() => {
//   fromWei();
// });

// function fromWei(value, decimals) {
//   if (typeof value === "undefined") return "---";
//   if (typeof value === "string") return fromWei(value, decimals);
// }

function open(
  dialogType: any,
  dialogTitle: any,
  currentItemAddress: any,
  otherItemAddress: any
) {
  // dialogType.value = dialogType;
  dialogTokenList.value = true;
  titleDialog.value = dialogTitle;
  currentItems.value = currentItemAddress;
  otherItems.value = otherItemAddress;
  console.log("currentItems", currentItems.value);
  // if (debug.value) console.log("showTokenListDialog->dialogType:", dialogType);
}

function close() {
  dialogTokenList.value = false;
}

function tokenChange(item: types.TokenDetails) {
  if (debug.value) console.log("tokenChange, item:", item);
  if (currentItems.value.includes(item.address)) return;
  emit("on-select", item);
}

defineExpose({
  open,
  close
});
</script>

<template>
  <el-dialog
    v-model="dialogTokenList"
    custom-class="txinfo-dialog dialog-type1"
    :title="titleDialog"
    append-to-body
    destroy-on-close
    center
  >
    <!-- <template #header="{ titleId, titleClass }">
      <div class="my-header">
        <h4
          style="display: flex; align-items: flex-end"
          :id="titleId"
          :class="titleClass"
        >
          <div>{{ titleDialog }}</div>
        </h4>
      </div>
    </template> -->
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
</style>
