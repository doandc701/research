<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="300px"
    class="addressDialog"
  >
    <div style="background-color: #2e3670; padding: 10px; border-radius: 10px;">
      <div style="letter-spacing:1px; display: flex;">
        Address: <span style="color: #d3d3d3; margin-left: 5px"> {{ accountAddressView }}</span>
        <i class="el-icon-copy-document icon-copy" @click="copyAddress($event)" />
      </div>
      <el-link icon="el-icon-link" rel="noopener" target="_blank" :underline="false" :href="accountLinkSt">
        View on VeChain Stats </el-link>
      <el-link icon="el-icon-link" rel="noopener" target="_blank" :underline="false" :href="accountLinkEx">
        View on VeChain Explorer </el-link>
    </div>
  </el-dialog>
</template>

<script>
import { explorerAddress, veExplorerAddress } from '@/settings'
import clip from '@/utils/clipboard' // use clipboard directly

export default {
  name: 'AddressDialog',
  data() {
    return {
      title: '',
      defaultTitle: 'Address',
      accountAddress: '',
      accountLinkSt: null, // vechain start
      accountLinkEx: null, // vechain explorer
      accountAddressView: '',
      dialogVisible: false
    }
  },
  created() {
    window.showAddressDialog = this.showAddressDialog
  },
  methods: {
    copyAddress(event) {
      clip(this.accountAddress, event)
    },
    open(title, accountAddress) {
      if (!accountAddress) return
      this.title = title !== null ? title : this.defaultTitle
      this.accountAddress = accountAddress
      this.accountAddressView = `${this.accountAddress.slice(0, 6)}...${this.accountAddress.slice(this.accountAddress.length - 4)}` // địa chỉ khi rút gọn
      this.dialogVisible = true
      this.accountLinkSt = `${explorerAddress}${this.accountAddress}`
      this.accountLinkEx = `${veExplorerAddress}${this.accountAddress}`
    }
  }
}
</script>

<style lang="scss" scoped>
.addressDialog {
  ::v-deep .el-dialog .el-dialog__body {
    padding: 10px;
    text-align: left !important;
  }
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

