<template>
  <div class="smart-app-container your-wallet-container">
    <!-- Claim VPU -->
    <h3 class="app-con-title">Claim VPU</h3>

    <div class="wallet-box">
      <!-- <p style="letter-spacing:1px">
        Address: <el-link :href="accountLink" target="_blank" class="num-break-all">{{ address }}</el-link>
        <i class="el-icon-document-copy" @click="copyAddress($event)" />
      </p> -->
      <el-dropdown placement="bottom" style="font-size: 16px">
        <span class="el-dropdown-link">
          <p slot="reference" style="letter-spacing:1px; color: #fff">
            Address: <el-link class="num-break-all">{{ address }}</el-link>
            <!-- <i class="el-icon-document-copy" @click="copyAddress($event)" /> -->
          </p>
        </span>
        <AccountAddress :account-address="address" title="Claim VPU Wallet" />
      </el-dropdown>
      <p style="letter-spacing:1px">
        VPunks minted: <span class="num-break-all">{{ claimInfoLoading ? '...' : vpunksMinted }} VPunks</span>
      </p>
      <p style="letter-spacing:1px">
        VPU received: <span class="num-break-all">{{ claimInfoLoading ? '...' : vpuReceived }} $VPU</span>
      </p>
      <p style="letter-spacing:1px">
        VPU to claim: <span class="num-break-all">{{ claimInfoLoading ? '...' : vpuToClaim }} $VPU</span>
      </p>
      <p class="text-center" style="margin-top:50px;">
        <el-button v-if="!claimDone" type="primary" :disabled="vpuToClaim===0" :loading="claimBtnLoading" @click="handleWithdraw()">🛠 Claim</el-button>
        <router-link v-else to="/my-account/wallet"><el-button type="primary">Your Wallet</el-button></router-link>
      </p>
    </div>
    <!-- end: Claim VPU -->
    <!-- test button
    <el-row>
      <el-button>Default</el-button>
      <el-button size="medium">Medium</el-button>
      <el-button size="small">Small</el-button>
      <el-button size="mini">Mini</el-button>
    </el-row>
    <el-row>
      <el-button>Default</el-button>
      <el-button type="primary" size="medium">Primary medium</el-button>
      <el-button type="success" size="small">Success small</el-button>
      <el-button type="info" size="mini">Info mini</el-button>
      <el-button type="warning">Warning</el-button>
      <el-button type="danger">Danger</el-button>
    </el-row>

    <el-row>
      <el-button plain>Plain</el-button>
      <el-button type="primary" plain>Primary</el-button>
      <el-button type="success" plain>Success</el-button>
      <el-button type="info" plain>Info</el-button>
      <el-button type="warning" plain>Warning</el-button>
      <el-button type="danger" plain>Danger</el-button>
    </el-row>

    <el-row>
      <el-button round>Round</el-button>
      <el-button type="primary" round>Primary</el-button>
      <el-button type="success" round>Success</el-button>
      <el-button type="info" round>Info</el-button>
      <el-button type="warning" round>Warning</el-button>
      <el-button type="danger" round>Danger</el-button>
    </el-row>

    <el-row>
      <el-button icon="el-icon-search" circle></el-button>
      <el-button type="primary" icon="el-icon-edit" circle></el-button>
      <el-button type="success" icon="el-icon-check" circle></el-button>
      <el-button type="info" icon="el-icon-message" circle></el-button>
      <el-button type="warning" icon="el-icon-star-off" circle></el-button>
      <el-button type="danger" icon="el-icon-delete" circle></el-button>
    </el-row>-->
  </div>
</template>

<script>
import clip from '@/utils/clipboard' // use clipboard directly
import { nativeToken, explorerAddress, explorerTx } from '@/settings'
import { isConnected } from '@/utils/validate'
import AccountAddress from '@/components/AccountAddress'

export default {
  name: 'Claim',
  components: {
    AccountAddress
  },
  filters: {
    fromWei(w) {
      if (typeof w !== 'object') return w
      return window.web3.utils.fromWei(w, 'ether')
    }
  },
  data() {
    return {
      // general
      debug: false,
      address: null,
      nativeToken: nativeToken,

      // Claim
      accountLink: null,
      claimInfoLoading: false,
      vpunksMinted: 0,
      vpuReceived: 0,
      vpuToClaim: 0,
      claimBtnLoading: false,
      claimDone: false
    }
  },
  created() {
    this.debug && console.log('created - Claim', window.selectedAccount)
    if (!isConnected([true, true], [true, true])) return
    this.address = window.selectedAccount
    this.accountLink = `${explorerAddress}${this.address}`
    this.checkClaimInfo()
  },
  methods: {
    // @
    copyAddress(event) {
      clip(this.address, event)
    },
    // @
    checkClaimInfo() {
      this.claimInfoLoading = true
      this.$store.getters.instances.ClaimVPU.getClaimCount(this.address).then((result) => {
        this.debug && console.log('result:', result[0])
        this.debug && console.log('result2:', result[1])
        this.vpunksMinted = result[0].toNumber()
        const claimed = result[1].toNumber()
        if (claimed >= this.vpunksMinted) this.claimDone = true
        this.vpuReceived = claimed * 500
        this.vpuToClaim = (this.vpunksMinted - claimed) * 500
        this.claimInfoLoading = false
      }).catch(err => {
        this.debug && console.error(err.message)
        this.claimInfoLoading = false
      })
    },
    // @
    handleWithdraw() {
      if (!isConnected([true, true], [true, true])) return
      if (this.vpuToClaim <= 0) return
      this.claimBtnLoading = true
      //
      this.$store.getters.instances.ClaimVPU.claim({ from: this.address }).then(async result => {
        this.debug && console.log('claim-result', result)
        //
        const txHash = result.txid
        const htmlStr = `transaction: <a href="${explorerTx}${txHash}" target="_blank" style="color:#53A7FF;word-break:break-all">${txHash}</a>`
        const transaction = await window.VeChainThor.waitTxReceipt(txHash)
        this.debug && console.log('transaction-result', transaction)
        if (transaction.reverted) {
          this.$alert(htmlStr, 'Transaction was reverted', {
            type: 'error',
            dangerouslyUseHTMLString: true
          }).catch(() => {})
        } else {
          this.$alert(htmlStr, 'Transaction successful', {
            type: 'success',
            dangerouslyUseHTMLString: true
          }).catch(() => {})
        }
        this.withdrawDone()
      }).catch(err => {
        this.debug && console.error(err.message)
        this.claimBtnLoading = false
      })
    },
    // @
    withdrawDone() {
      // gtag
      this.$gtag.event('claimVPUDone', { amount: this.vpuToClaim, Account: this.address })
      //
      this.claimBtnLoading = false
      this.claimDone = true
      this.vpuReceived += this.vpuToClaim
      this.vpuToClaim = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.your-wallet-container {
  font-weight: 500; /* support for the Jura font */
  .wallet-box {
    border: 2px dashed #2a3969;
    padding: 10px;
    padding: min(max(5px, 3vw), 20px);
    .num-break-all {
      color:#53A7FF;
      word-break: break-all;
    }
    .el-icon-document-copy {
      cursor: pointer;
      margin-left: 5px;
    }
    .error {
      color: red;
      font-size: 15px;
    }
  }
}
</style>
