<template>
  <div>
    <el-dropdown-menu
      slot="dropdown"
      class="addressDropdown"
    >
      <span style="color: #fff; margin-bottom: 10px">{{ title }}</span>
      <div style="background-color: #2e3670; margin-top: 15px; padding: 10px; border-radius: 10px">
        <div style="letter-spacing:1px; display: flex;">
          Address: <span style="color: #d3d3d3; margin-left: 5px"> {{ accountAddressView }}</span>
          <i class="el-icon-copy-document icon-copy" @click="copyAddress($event)" />
        </div>
        <el-link icon="el-icon-link" rel="noopener" target="_blank" :underline="false" :href="accountLinkSt">
          View on VeChain Stats </el-link>
        <el-link icon="el-icon-link" rel="noopener" target="_blank" :underline="false" :href="accountLinkEx">
          View on VeChain Explorer </el-link>
      </div>
    </el-dropdown-menu>
  </div>
</template>
<!-- :visible-arrow="false" use to turn off arrow in dropdown -->
<script>
import { explorerAddress, veExplorerAddress } from '@/settings'
import clip from '@/utils/clipboard' // use clipboard directly

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    accountAddress: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      accountLinkSt: null, // vechain start
      accountLinkEx: null, // vechain explorer
      accountAddressView: '' // địa chỉ khi rút gọn
    }
  },
  created() {
    if (this.accountAddress) this.accountAddressView = `${this.accountAddress.slice(0, 6)}...${this.accountAddress.slice(this.accountAddress.length - 4)}`
    this.accountLinkSt = `${explorerAddress}${this.accountAddress}`
    this.accountLinkEx = `${veExplorerAddress}${this.accountAddress}`
  },
  methods: {
    copyAddress(event) {
      clip(this.accountAddress, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.addressDropdown {
  background-color: #202440;
  border-color: #4A5495;
  border-radius: 10px;
  padding: 15px;
  .el-link {
    font-weight: lighter;
    margin-top: 10px;
  }
  .icon-copy {
    cursor: pointer;
    margin-left: 5px;
    &:hover {
      color: #1890ff;
    }
  }
}
</style>
