<script setup lang="ts">
import { getExplorers } from "/@/settings";
import { computed } from "vue";
import Address from "/@/components/Address/index.vue";
import { copyText } from "/@/utils";

const explorers = getExplorers();
const props = defineProps({
  accountAddress: String,
  title: String
});
const address = computed(() => {
  return props.accountAddress;
});
</script>

<template>
  <div>
    <el-dropdown-menu class="addressDropdown">
      <div class="dropdown-body">
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
            class="link-type01"
            target="_blank"
            rel="noopener"
            :href="exp.accounts + address"
          >
            <IconifyIconOnline icon="fa-solid:link" style="margin-right: 5px" />
            View on {{ exp.name }}
          </el-link>
          <el-link
            v-else
            v-for="exp in explorers"
            :key="exp.txs"
            :underline="false"
            class="link-type01"
            target="_blank"
            rel="noopener"
            :href="exp.txs + address"
          >
            <IconifyIconOnline icon="fa-solid:link" style="margin-right: 5px" />
            View on {{ exp.name }}
          </el-link>
        </div>
      </div>
    </el-dropdown-menu>
    <!-- </template> -->
    <!-- </el-dropdown> -->
  </div>
</template>

<style lang="scss" scoped>
.addressDropdown {
  background-color: #293366;
  color: #fff;
  border-radius: 10px;
  border: 2px solid #384482 !important;
  .dropdown-body {
    padding: 15px !important;
    font-size: 14px;
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
  :deep(.el-link.link-type01) {
    display: flex;
    justify-content: flex-start;
    margin-top: 5px;
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
</style>
