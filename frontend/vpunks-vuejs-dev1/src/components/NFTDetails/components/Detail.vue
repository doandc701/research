<template>
  <div>
    <span class="introduce">{{ description }}</span>
    <div class="infomation">
      <el-row :gutter="24">
        <el-col :span="8">Token ID</el-col>
        <el-col :span="1">:</el-col>
        <el-col :span="14">#{{ VNFTData.tokenId }}</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">Collection</el-col>
        <el-col :span="1">:</el-col>
        <el-col :span="14" class="text-blue">VPunks OG</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">Standard</el-col>
        <el-col :span="1">:</el-col>
        <el-col :span="14" class="text-blue">VIP-181</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">Blockchain</el-col>
        <el-col :span="1">:</el-col>
        <el-col :span="14" class="text-blue">VeChain</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">Owner's Address</el-col>
        <el-col :span="1">:</el-col>
        <el-col :span="14" class="more-blue" />
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8" class="">Contract Address</el-col>
        <el-col :span="1">:</el-col>
        <el-col :span="14" class="more-blue">
          <el-dropdown placement="bottom" style="font-size: 16px">
            <span class="el-dropdown-link">
              <el-link slot="reference" class="more-blue">{{ tokenAddressView }}</el-link>
            </span>
            <AccountAddress :account-address="tokenAddress" title="Collections" />
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
    <div style="display:none;">
      <router-link
        :to="'item-details/' + '0xe92FDDD6...0cD46DF4a1/' + VNFTData.tokenId"
      >
        <a style="color: #6CE23E">Go to full details<i class="el-icon-d-arrow-right" /></a>
      </router-link>
    </div>
  </div>
</template>

<script>
// import rarityInfo2 from '@/punks/_metadata-11-17.json'
import AccountAddress from '@/components/AccountAddress'

export default {
  name: 'Details',
  components: {
    AccountAddress
  },
  filters: {
    fromWei(w) {
      if (typeof w !== 'object') return w
      return window.web3.utils.fromWei(w, 'ether')
    }
  },
  props: [
    'VNFTData'
  ],
  data() {
    //
    return {
      // general
      // debug: false,
      // address: null,

      description: `VPunks are a collection of 10,000 unique digital assets nested within a gaming ecosystem.
      VPunks NFTs are utility-driven, offering staking and P2E gaming rewards in the ecosystem's native $VPU token.`,
      //
      tokenAddress: '0xe92FDDD633008C1bca6E738725d2190cD46DF4a1',
      tokenAddressView: '' // địa chỉ khi rút gọn
    }
  },
  mounted() {
    this.tokenAddressView = `${this.tokenAddress.slice(0, 6)}...${this.tokenAddress.slice(this.tokenAddress.length - 4)}`
  }
}
</script>

<style lang="scss">
.introduce {
  color: #00D4FF;
  word-break: break-word;
}
.infomation {
  margin-top: 12px;
  .el-row {
    margin-bottom: 12px;
    word-break: break-word;
    padding: unset;
  }
  .el-col-8 {
    width: 34.333333%;
    word-break: break-word;
    padding-right: 0 !important;
  }
  .el-col-14 {
    padding: unset !important;
  }
  .text-blue {
    color: #00A6FF;
  }
  .more-blue {
    color: #00D4FF;
  }
}
</style>
