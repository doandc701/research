<template>
  <div class="smart-app-container token-contract-container">
    <!-- Token and Contract -->
    <h3 class="app-con-title">VPU VIP-180 (ERC20) Contract</h3>
    <p style="margin-top:-15px;">(Governance token)</p>
    <p style="letter-spacing:1px">
      Address: <el-link class="num-break-all" @click.native.prevent="openAddressDialog(VPUAddress)">{{ VPUAddress }}</el-link>
      <!-- <i class="el-icon-document-copy" @click="copyAddress($event, VPUAddress)" /> -->
    </p>
    <p style="letter-spacing:1px;padding:5px;">☂️Airdrop⚡ For each VPunk minted you will receive 500 VPU</p>
    <!--<p style="letter-spacing:1px;font-size:30px;margin-top:-5px;color:#00940b;">Claim coming soon!</p>-->
    <router-link to="/my-account/claim">
      <el-button type="primary">🛠 Claim VPU</el-button>
    </router-link>

    <h3 class="app-con-title" style="margin-top:50px;">VPunks VIP-181 (ERC721) Contract</h3>
    <p style="letter-spacing:1px">
      Address: <el-link class="num-break-all" @click.native.prevent="openAddressDialog(vpunksAddress)">{{ vpunksAddress }}</el-link>
      <!-- <i class="el-icon-document-copy" @click="copyAddress($event, vpunksAddress)" /> -->
    </p>

    <h3 class="app-con-title" style="margin-top:50px;">NFT AuctionV1 Contract</h3>
    <p style="letter-spacing:1px">
      Address: <el-link class="num-break-all" @click.native.prevent="openAddressDialog(auctionAddress)">{{ auctionAddress }}</el-link>
      <!-- <i class="el-icon-document-copy" @click="copyAddress($event, auctionAddress)" /> -->
    </p>

    <h3 class="app-con-title" style="margin-top:50px;">StakingV1 Contract</h3>
    <p style="letter-spacing:1px">
      Address: <el-link class="num-break-all" @click.native.prevent="openAddressDialog(vpunkStakingV1Address)">{{ vpunkStakingV1Address }}</el-link>
      <!-- <i class="el-icon-document-copy" @click="copyAddress($event, vpunkStakingV1Address)" /> -->
    </p>

    <h3 class="app-con-title" style="margin-top:50px;">Claim VPU Contract</h3>
    <p style="letter-spacing:1px">
      Address: <el-link class="num-break-all" @click.native.prevent="openAddressDialog(claimVPUAddress)">{{ claimVPUAddress }}</el-link>
      <!-- <i class="el-icon-document-copy" @click="copyAddress($event, claimVPUAddress)" /> -->
    </p>

    <h3 class="app-con-title" style="margin-top:50px;">VIP-181(ERC721) BidV1 Contract</h3>
    <p style="letter-spacing:1px">
      Address: <el-link class="num-break-all" @click.native.prevent="openAddressDialog(erc721BidV1Address)">{{ erc721BidV1Address }}</el-link>
      <!-- <i class="el-icon-document-copy" @click="copyAddress($event, erc721BidV1Address)" /> -->
    </p>
    <AddressDialog ref="addressDialog" />

    <!-- end Token and Contract -->
  </div>
</template>

<script>
import clip from '@/utils/clipboard' // use clipboard directly
import { explorerAddress } from '@/settings'
import AddressDialog from '@/components/AddressDialog'
// import { isConnected } from '@/utils/validate'

export default {
  name: 'TokenAndContract',
  components: {
    AddressDialog
  },
  data() {
    return {
      // general
      debug: false,
      address: null,

      // Token and Contract
      VPUAddress: null,
      VPULink: null,
      //
      vpunksAddress: null,
      vpunksLink: null,
      //
      auctionAddress: null,
      auctionLink: null,
      //
      vpunkStakingV1Address: null,
      vpunkStakingV1Link: null,
      //
      claimVPUAddress: '0x9E0A95BD19A16BA599A9D0Fa0eF6Ea722964e374',
      claimVPULink: null,
      //
      erc721BidV1Address: null,
      erc721BidV1Link: null
    }
  },
  created() {
    this.debug && console.log('created - TokenAndContract', window.selectedAccount)
    // if (!isConnected()) return   // vechain not check
    this.address = window.selectedAccount

    this.vpunksAddress = this.$store.getters.instances.NFTContract.address
    this.vpunksLink = `${explorerAddress}${this.vpunksAddress}`
    //
    this.auctionAddress = this.$store.getters.instances.ERC721DutchAuctionV1.address
    this.auctionLink = `${explorerAddress}${this.auctionAddress}`
    //
    this.VPUAddress = this.$store.getters.instances.VPUContract.address
    this.VPULink = `${explorerAddress}${this.VPUAddress}`
    //
    this.vpunkStakingV1Address = this.$store.getters.instances.VPunkStakingV1.address
    this.vpunkStakingV1Link = `${explorerAddress}${this.vpunkStakingV1Address}`
    //
    this.claimVPULink = `${explorerAddress}${this.claimVPUAddress}`
    //
    this.erc721BidV1Address = this.$store.getters.instances.ERC721BidV1.address
    this.erc721BidV1Link = `${explorerAddress}${this.erc721BidV1Address}`
  },
  methods: {
    // @
    copyAddress(event, address) {
      clip(address, event)
    },
    openAddressDialog(address) {
      (this.$refs.addressDialog).open(null, address)
    }
  }
}
</script>

<style lang="scss" scoped>
.token-contract-container {
  text-align: center;
  .num-break-all {
    color:#53A7FF;
    word-break: break-all;
  }
  .el-icon-document-copy {
    cursor: pointer;
    margin-left: 5px;
  }
}
</style>
