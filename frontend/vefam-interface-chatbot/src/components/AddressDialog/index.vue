<script setup lang="ts">
import { ref, computed } from "vue";
import Address from "/@/components/Address/index.vue";
import { getExplorers } from "/@/settings";
import { copyText } from "/@/utils";

const props = defineProps({
  accountAddress: String,
  title: String
});
const explorers = getExplorers();
const address = computed(() => {
  return props.accountAddress;
});
const visible = ref(false);

function open() {
  visible.value = true;
}
defineExpose({
  open
});
</script>

<template>
  <div class="address-dialog">
    <el-dialog v-model="visible" :show-close="false">
      <template #header>
        <div class="my-header">
          <h1 class="title" style="font-size: 16px">{{ title }}</h1>
          <div class="info">
            <div class="address-line">
              Address:
              <Address
                style="font-size: 16px; color: #ffffffc2; margin-left: 5px"
                :addr="accountAddress"
              />
              <IconifyIconOnline
                icon="ep:copy-document"
                class="icon-copy"
                @click="copyText(address)"
              />
            </div>
            <el-link
              v-if="address.length < 43"
              v-for="exp in explorers"
              :key="exp"
              :underline="false"
              class="link-explorers"
              target="_blank"
              rel="noopener"
              :href="exp.accounts + address"
            >
              <IconifyIconOnline
                icon="fa-solid:link"
                style="margin-right: 5px"
              />
              View on {{ exp.name }}
            </el-link>
            <el-link
              v-else
              v-for="exp in explorers"
              :key="exp.txs"
              :underline="false"
              class="link-explorers"
              target="_blank"
              rel="noopener"
              :href="exp.txs + address"
            >
              <IconifyIconOnline
                icon="fa-solid:link"
                style="margin-right: 5px"
              />
              View on {{ exp.name }}
            </el-link>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.address-dialog {
  :deep(.el-dialog__header) {
    margin-right: 0;
    padding: 15px;
  }
  :deep(.el-dialog__body) {
    display: none;
  }
  :deep(.el-dialog) {
    background-color: #293366 !important;
    border: 2px solid #384482 !important;
    border-radius: 20px;
    color: #fff;
    width: 275px;
    .el-dialog__title {
      color: #fff;
    }
    .address-line {
      letter-spacing: 1px;
      display: flex;
      align-items: center;
    }
    .info {
      background-color: rgb(24, 30, 61);
      margin-top: 10px;
      padding: 10px;
      border-radius: 10px;
    }
    .link-explorers {
      display: flex;
      justify-content: flex-start;
      font-weight: lighter;
      color: #b2c8f4;
      margin-top: 5px;
      &:hover {
        color: #4999ff;
      }
    }
    .icon-copy {
      color: #fff !important;
      margin-left: 5px;
      cursor: pointer;
      font-size: 17px;

      &:hover {
        color: #4999ff !important;
      }
    }
  }
}
</style>
