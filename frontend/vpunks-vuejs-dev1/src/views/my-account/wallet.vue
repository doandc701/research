<template>
  <div class="smart-app-container your-wallet-container">
    <!-- Your Wallet -->
    <h3 class="app-con-title">Your Wallet</h3>
    <el-dropdown placement="bottom" style="font-size: 16px">
      <span class="el-dropdown-link">
        <p slot="reference" style="letter-spacing:1px; color: #fff">
          Address: <el-link class="num-break-all">{{ address }}</el-link>
          <!-- <i class="el-icon-document-copy" @click="copyAddress($event)" /> -->
        </p>
      </span>
      <AccountAddress :account-address="address" title="Your Wallet" />
    </el-dropdown>

    <!-- VeChain Network -->
    <div class="wallet-box">
      <h4 class="app-con-title">VeChain Network</h4>
      <div style="letter-spacing:1px">
        VET balance: <span class="num-break-all">{{ checkVPUBtnLoading ? '...' : vetBalance | fromWei }} VET</span><br>
        <p>VPU balance: <span class="num-break-all">{{ checkVPUBtnLoading ? '...' : vpuBalance | fromWei }} VPU</span></p>
      </div>
      <p class="text-center" style="margin-top:50px">
        <el-button type="primary" @click="openTransferTokens()">Transfer VPU</el-button>
      </p>
    </div>
    <!-- end: VeChain Network -->

    <!-- Auction Contract V1 -->
    <div class="wallet-box">
      <h4 class="app-con-title">Auction Contract V1</h4>
      <p style="letter-spacing:1px">
        Balance in contract: <span class="num-break-all">{{ checkBalanceBtnLoading01 ? '...' : userBalance01 | fromWei }} {{ nativeToken }}</span>
        <el-button v-loading="checkBalanceBtnLoading01" icon="el-icon-refresh" circle style="margin-left:4px;" @click="recheckUserBalance01" />
      </p>
      <p>Withdraw balance to:</p>
      <!--<p style="font-size:14px;color:rgb(226 142 15);">Warning: do not withdraw directly to Binance and centralized exchanges</p>-->
      <p>
        <el-input v-model="inputRecipient01" :readonly="true" placeholder="enter the recipient's address" @blur="handleAddressInput01" />
        <br>
        <span v-show="recipientError01!=null" class="error">{{ recipientError01 }}</span>
      </p>
      <p>
        <el-input v-model="inputAmount01" :readonly="withdrawBtnLoading01" :placeholder="`enter the amount of ${nativeToken}`" @blur="handleAmountInput01">
          <el-button slot="append" @click="handleMaxAmount01">MAX</el-button>
        </el-input>
        <br>
        <span v-show="amountError01!=null" class="error">{{ amountError01 }}</span>
      </p>
      <p class="text-center">
        <el-button type="primary" :disabled="amountError01!=null||recipientError01!=null" :loading="withdrawBtnLoading01" @click="handleWithdraw01()">Withdraw</el-button>
      </p>
    </div>
    <!-- end: Auction Contract V1 -->

    <!-- Funding -->
    <div id="funding" class="wallet-box">
      <h4 class="app-con-title">Funding</h4>
      <p style="letter-spacing:1px">
        Your balance: <span class="num-break-all">{{ checkBalanceBtnLoading02 ? '...' : userBalance02 | fromWei }} VPU</span>
        <el-button v-loading="checkBalanceBtnLoading02" icon="el-icon-refresh" circle style="margin-left:4px;" @click="recheckUserBalance02" />
      </p>
      <p>Withdraw balance to:</p>
      <!--<p style="font-size:14px;color:rgb(226 142 15);">Warning: do not withdraw directly to Binance and centralized exchanges</p>-->
      <p>
        <el-input v-model="inputRecipient02" :readonly="true" placeholder="enter the recipient's address" @blur="handleAddressInput02" />
        <br>
        <span v-show="recipientError02!=null" class="error">{{ recipientError02 }}</span>
      </p>
      <p>
        <el-input v-model="inputAmount02" :readonly="withdrawBtnLoading02" :placeholder="`enter the amount of VPU`" @blur="handleAmountInput02">
          <el-button slot="append" @click="handleMaxAmount02">MAX</el-button>
        </el-input>
        <br>
        <span v-show="amountError02!=null" class="error">{{ amountError02 }}</span>
      </p>
      <p style="font-size: 14px;">Receive amount {{ receiveAmount | fromWei }} VPU (Network fee {{ feeAmount | fromWei }} VPU)</p>
      <p class="text-center">
        <el-button type="primary" :loading="withdrawBtnLoading02" @click="handleWithdraw02()">Withdraw</el-button>
      </p>
      <p class="text-center">
        <el-button :loading="leaderboardBtnLoading" @click="handleLeaderboard">History</el-button>
      </p>
    </div>
    <!-- end: Funding -->

    <!-- Admin Box -->
    <div v-if="isAdmin" class="admin-box">
      <p>For Admin: day: {{ currDay }} - {{ currDay-18895 }}</p>
      <el-button type="primary" @click="challengeViewWinners(true)">View winners</el-button>
      <el-button type="primary" @click="challengeUpdateWinners()">Update winners</el-button><br>
      <p><el-button type="primary" @click="checkPending()">Check pending</el-button>
        <el-button type="primary" @click="updatePending()">Update Pending</el-button>
      </p>
    </div>
    <!-- end Admin Box -->

    <!-- Dialog Transfer Tokens -->
    <el-dialog v-loading="dialogTransferLoading" :visible.sync="dialogTransferVisible" :width="dialogTransferWidth" :class="{ deviceMini: (deviceSize !== 'medium') }" append-to-body>
      <div slot="title">
        <span style="padding-right: 10px;">Transfer Tokens</span>
        <el-button size="mini" type="primary" icon="el-icon-delete" @click="clearTransferTokens">Clear All</el-button>
      </div>
      <el-table :size="deviceSize" :data="transferTokens" border fit highlight-current-row>
        <el-table-column align="center" label="Amount (VPU)" min-width="70">
          <template slot-scope="{row}">
            <el-input v-model="row.amount" placeholder="amount" class="trans-input" :class="{'is-error': row.amountErr}" :size="deviceSize" @blur="handleNumOfTransfer()" />
          </template>
        </el-table-column>

        <el-table-column align="center" label="Recipient Address" min-width="170">
          <template slot-scope="{row}">
            <el-input v-model="row.recipient" placeholder="recipient address" class="trans-input" :class="{'is-error': row.recipientErr}" :size="deviceSize" @blur="handleNumOfTransfer()" />
          </template>
        </el-table-column>

        <el-table-column label="Ac" align="center" width="50px" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="info" icon="el-icon-delete" circle @click="removeTransferTokens($index)" />
          </template>
        </el-table-column>

      </el-table>
      <div style="margin:8px 0 -22px 0;">
        <el-button type="primary" plain :size="deviceSize" class="add-transfer-token" @click="addTransferToken">+</el-button>
        <span style="float:right;line-height:40px;">selected {{ transferTokens.length }}/{{ transferMax }}</span>
      </div>
      <div slot="footer">
        <el-button :size="deviceSize" type="success" @click="startTransferTokens">Submit</el-button>
        <el-button :size="deviceSize" @click="dialogTransferVisible = false">Close</el-button>
      </div>
    </el-dialog>
    <!-- end: Dialog Transfer Tokens -->

    <!-- Dialog Leaderboard -->
    <el-dialog v-loading="dialogLeaderLoading" :visible.sync="dialogLeaderVisible" :width="dialogLeaderWidth" :class="{ deviceMini: (deviceSize !== 'medium') }" append-to-body>
      <div slot="title">
        <span style="padding-right: 10px;">History</span>
      </div>
      <p style="margin-top: -10px;line-height: 150%;">Last 20 transactions</p>
      <el-table :size="deviceSize" :data="leaderboardList" border fit highlight-current-row>
        <el-table-column align="center" label="Type" min-width="70">
          <template slot-scope="{row}">
            {{ row.type }}
          </template>
        </el-table-column>

        <el-table-column label="Amount" align="center" min-width="70" class-name="small-padding">
          <template slot-scope="{row}">
            {{ row.amount | fromWei }}
          </template>
        </el-table-column>

        <el-table-column label="Note" align="center" min-width="70" class-name="small-padding">
          <template slot-scope="{row}">
            {{ row.note }}
          </template>
        </el-table-column>

      </el-table>
      <div slot="footer">
        <el-button :size="deviceSize" @click="dialogLeaderVisible = false">Close</el-button>
      </div>
    </el-dialog>
    <!-- end: Dialog Leaderboard -->
  </div>
</template>

<script>
import clip from '@/utils/clipboard' // use clipboard directly
import { parseErrorMessage } from '@/utils/error-message-parse'
import { nativeToken, explorerAddress, explorerTx } from '@/settings'
import { isConnected } from '@/utils/validate'
import AccountAddress from '@/components/AccountAddress'
import {
  challenge01Winners,
  fundingBalance,
  fundingWithdraw,
  fundingHistory,
  fundingPending,
  fundingPendingUpdate
} from '@/api/user'

export default {
  name: 'YourWallet',
  filters: {
    fromWei(w) {
      if (typeof w !== 'object') return w
      return window.web3.utils.fromWei(w, 'ether')
    }
  },
  components: {
    AccountAddress
  },
  data() {
    return {
      // general
      debug: false,
      address: null,
      nativeToken: nativeToken,
      deviceSize: 'medium', // medium / small / mini

      // Balance on VeChain Network
      vetBalance: new window.web3.utils.BN(),
      checkVPUBtnLoading: false,
      vpuBalance: new window.web3.utils.BN(),

      // Balance on Auction Contract V1
      accountLink: null,
      checkBalanceBtnLoading01: false,
      userBalance01: new window.web3.utils.BN(),
      withdrawAmount01: undefined,
      inputAmount01: undefined,
      amountError01: null,
      inputRecipient01: undefined,
      recipientError01: null,
      withdrawBtnLoading01: false,

      // Funding
      checkBalanceBtnLoading02: false,
      userBalance02: new window.web3.utils.BN(),
      withdrawAmount02: undefined,
      inputAmount02: undefined,
      amountError02: null,
      inputRecipient02: undefined,
      recipientError02: null,
      withdrawBtnLoading02: false,
      receiveAmount: new window.web3.utils.BN(),
      feeAmount: new window.web3.utils.BN('2000000000000000000'),

      // Dialog Transfer Tokens
      leaderboardBtnLoading: false,
      transferTokens: [],
      dialogTransferVisible: false,
      dialogTransferLoading: false,
      dialogTransferWidth: '90%',
      transferMax: 20,

      // Dialog Leaderboard (tạm cho lịch sử)
      leaderboardList: [],
      dialogLeaderVisible: false,
      dialogLeaderLoading: false,
      dialogLeaderWidth: '90%',

      // for admin
      isAdmin: false,
      currDay: 0,
      fundingPendingIds: []
    }
  },
  created() {
    this.debug && console.log('created - YourWallet', window.selectedAccount)
    if (!isConnected([true, true], [true, true])) return // checkChainId, checkWallet
    this.address = window.selectedAccount
    this.isAdmin = ['0xd3ef14ff4ea3c95c076b9fc948aa05b7a407410a', '0x8553a90ea70ae556916610f5361353bd92ae26a8'].indexOf(this.address) >= 0
    this.currDay = Math.floor(Date.now() / 86400000)
    this.inputRecipient01 = window.selectedAccount
    this.inputRecipient02 = window.selectedAccount
    this.accountLink = `${explorerAddress}${this.address}`
    this.checkVPUBalance()
    this.checkUserBalance01()
    this.checkUserBalance02()
    window.connex.thor.account(this.address).get().then(accInfo => {
      // console.log(accInfo)
      this.vetBalance = window.web3.utils.hexToNumberString(accInfo.balance)
      this.vetBalance = new window.web3.utils.BN(this.vetBalance)
    })
  },
  mounted() {
    this.debug && console.log('mounted - YourWallet')
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
  },
  beforeDestroy() {
    this.debug && console.log('beforeDestroy - YourWallet')
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    // @
    handleWindowResize(event) {
      const w = window.innerWidth
      this.dialogTransferWidth = w > 800 ? '90%' : (w > 320 ? '100%' : '320px')
      this.dialogLeaderWidth = w > 800 ? '90%' : (w > 320 ? '100%' : '320px')
      this.deviceSize = w > 500 ? 'small' : 'mini'
    },
    // @ for admin
    checkPending() {
      fundingPending().then(result => {
        console.log('fundingPending-result', result)
        if (result.data && result.data.fundHistoryList) {
          const data = result.data.fundHistoryList
          if (data.length <= 0) {
            this.$alert('FundingPending find has no results', 'Alert', {
              type: 'info'
            }).catch(() => {})
            return
          }
          this.transferTokens = []
          this.fundingPendingIds = []
          for (let i = 0; i < data.length; i++) {
            if (this.transferTokens.length >= 20) break
            const recipient = data[i].to
            const amountBN = new window.web3.utils.BN(data[i].amount)
            const feeBN = new window.web3.utils.BN(data[i].fee)
            const receive = amountBN.sub(feeBN).toString()
            const amount = window.web3.utils.fromWei(receive, 'ether')
            this.transferTokens.push({ amount, amountErr: false, recipient, recipientErr: false })
            this.fundingPendingIds.push(data[i]._id)
          }
          console.log('transferTokens:', this.transferTokens)
          if (this.transferTokens.length > 0) this.dialogTransferVisible = true
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // @ for admin
    updatePending() {
      if (this.address !== '0x8553a90ea70ae556916610f5361353bd92ae26a8') return
      this.$prompt('Please input txId', 'Update Pending').then(({ value }) => {
        if (!value) return
        const myArr = value.split(',')
        if (myArr.length !== 2) return
        // const ids = ['61f36ae1a624a9586926ecd1','61ee27c2978a79f5d97be0cb'] // test
        const query = `txid=${myArr[0]}&admin=${myArr[1]}&ids=${this.fundingPendingIds}`
        console.log('query:', query)
        fundingPendingUpdate(query).then(result => {
          console.log('fundingPendingUpdate-result', result)
          if (!result.data) return
          if (result.data.errorMess.length > 0) {
            const htmlStr = result.data.errorMess.join('<br>')
            this.$alert(htmlStr, 'Error!!', {
              type: 'error',
              dangerouslyUseHTMLString: true
            }).catch(() => {})
          } else if (result.data.success) {
            const htmlStr = 'Update fundingPending Successful!'
            this.$alert(htmlStr, 'Successful', {
              type: 'success',
              dangerouslyUseHTMLString: true
            }).catch(() => {})
            this.fundingPendingIds = []
          }
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {})
    },
    // @ for admin
    challengeViewWinners(checkSend) {
      console.log('day:', this.inputAmount01)
      if (!this.inputAmount01) return
      challenge01Winners(`?day=${this.inputAmount01}`).then(result => {
        console.log('challengeViewWinners-result', result)
        this.transferTokens = []
        let totalSlot = 0
        let totalReward = 0
        for (let i = 0; i < result.data.length; i++) {
          const data = result.data[i].data
          const recipient = result.data[i].address
          let paid = 0
          if (data && data.length > 0) {
            let reward = 0
            for (let j = 0; j < data.length; j++) {
              totalSlot += 1
              reward += data[j].reward
              totalReward += data[j].reward
              if (checkSend && data[j].paid) paid += data[j].reward
            }
            this.transferTokens.push({ amount: reward.toString(), amountErr: false, recipient: paid > 0 ? `${recipient} - paid: ${paid}` : recipient, recipientErr: false })
          }
        }
        console.log('transferTokens:', this.transferTokens)
        const day = Number(this.inputAmount01) - 18895
        console.log('day:', day)
        console.log('total Winner:', this.transferTokens.length)
        console.log('total Slot:', totalSlot)
        console.log('total Reward:', totalReward)
        if (this.transferTokens.length > 0) this.dialogTransferVisible = true
      }).catch(error => {
        console.log(error)
      })
    },
    // @ for admin
    challengeUpdateWinners() {
      console.log('day:', this.inputAmount01)
      if (!this.inputAmount01) return
      this.$prompt('Please input txId', 'Update Winners').then(({ value }) => {
        if (!value) return
        const myArr = value.split(',')
        if (myArr.length !== 2) return
        const query = `day=${this.inputAmount01}&txid=${myArr[0]}&admin=${myArr[1]}`
        console.log('query:', query)
        challenge01Winners(query).then(result => {
          console.log('challengeUpdateWinners-result', result)
          this.$alert('Update Winners Successful!', 'Successful', {
            type: 'success'
          }).catch(() => {})
        }).catch(error => {
          console.log(error)
        })
      }).catch(() => {})
    },
    // Dialog Leaderboard -----------------------------------------------
    // @
    handleLeaderboard() {
      this.debug && console.log('handleLeaderboard')
      this.getList()
    },
    getList() {
      this.leaderboardBtnLoading = true
      fundingHistory(`address=${this.address}&page=1&limit=20`).then(result => {
        this.debug && console.log('fundingHistory-result', result)
        this.dialogLeaderVisible = true
        if (result.data && result.data.fundHistoryList) {
          const data = result.data.fundHistoryList
          this.leaderboardList = []
          for (let i = 0; i < data.length; i++) {
            // const addressV = `${data[i].address.slice(0, 5)}...${data[i].address.slice(data[i].address.length - 3)}`
            let note = data[i].note
            if (data[i].type === 'out') {
              note = (data[i].txId) ? 'Successful transaction' : 'Pending, can be up to 8 hours'
            }
            this.leaderboardList.push({
              type: data[i].type,
              amount: new window.web3.utils.BN(data[i].amount),
              note,
              addressV: 'addressV'
            })
          }
        }
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        this.leaderboardBtnLoading = false
      })
    },
    // end: Dialog Leaderboard -----------------------------------------------

    // Dialog Transfer Token -----------------------------------------------
    // @
    openTransferTokens() {
      if (!isConnected([true, true], [true, true])) return // checkChainId, checkWallet
      this.dialogTransferVisible = true
      if (this.transferTokens.length === 0) this.transferTokens.push({ amount: '', amountErr: false, recipient: '', recipientErr: false })
    },
    // @
    clearTransferTokens() {
      this.dialogTransferVisible = false
      this.transferTokens = []
    },
    // @
    removeTransferTokens(index) {
      this.transferTokens.splice(index, 1)
      if (this.transferTokens.length <= 0) this.dialogTransferVisible = false
    },
    // @
    addTransferToken() {
      if (this.transferTokens.length < this.transferMax) this.transferTokens.push({ amount: '', amountErr: false, recipient: '', recipientErr: false })
    },
    // @
    handleNumOfTransfer(submit) {
      let amountErr = false
      let recipientErr = false
      let recipientErr2 = false
      for (let i = 0; i < this.transferTokens.length; i++) {
        if (this.transferTokens[i].amount !== '') {
          try {
            this.transferTokens[i].amount = this.transferTokens[i].amount.replace(/[^\d.]/g, '')
            const wei = window.web3.utils.toWei(this.transferTokens[i].amount, 'ether')
            this.transferTokens[i].amount = wei === '0' ? '' : window.web3.utils.fromWei(wei, 'ether')
          } catch (error) {
            this.transferTokens[i].amount = ''
          }
        }
        this.transferTokens[i].amountErr = false
        this.transferTokens[i].recipientErr = false
        if (this.transferTokens[i].recipient !== '' && !window.web3.utils.isAddress(this.transferTokens[i].recipient)) {
          this.transferTokens[i].recipientErr = true
          recipientErr = true
        }
        if (this.transferTokens[i].recipient.toLowerCase() === this.address.toLowerCase()) {
          this.transferTokens[i].recipientErr = true
          recipientErr2 = true
        }
        if (submit && this.transferTokens[i].amount === '') {
          this.transferTokens[i].amountErr = true
          amountErr = true
        }
        if (submit && this.transferTokens[i].recipient === '') {
          this.transferTokens[i].recipientErr = true
          recipientErr = true
        }
      }
      if (amountErr || recipientErr || recipientErr2) {
        let mss = ''
        if (recipientErr2) mss = 'Unable to send to current owner address'
        else if (amountErr) mss = 'Input must not be empty'
        else mss = 'Invalid recipient wallet address'
        this.$alert(mss, 'Warning!!', {
          type: 'error'
        }).catch(() => {})
        return false
      }
      return true
    },
    // @
    async startTransferTokens() {
      this.debug && console.log('transferTokens', this.transferTokens)
      if (!this.handleNumOfTransfer(true)) return
      let totalAmountTransfer = new window.web3.utils.BN(0)
      this.dialogTransferLoading = true
      const transferInputs = []
      for (let i = 0; i < this.transferTokens.length; i++) {
        const wei = window.web3.utils.toWei(this.transferTokens[i].amount, 'ether')
        totalAmountTransfer = totalAmountTransfer.add(new window.web3.utils.BN(wei))
        transferInputs.push([this.address, this.transferTokens[i].recipient, wei])
      }
      if (totalAmountTransfer.gt(this.vpuBalance)) { // >
        this.$alert('Not enough balance', 'Warning!!', {
          type: 'error'
        }).catch(() => {})
        this.dialogTransferLoading = false
        return
      }
      this.debug && console.log('transferInputs', transferInputs)
      this.$store.getters.instances.VPUContract.transferFrom({ clauses: transferInputs }, { from: window.selectedAccount }).then(async result => {
        this.debug && console.log('safeTransferFrom-result', result)
        //
        const txHash = result.txid
        const transaction = await window.VeChainThor.waitTxReceipt(txHash)
        this.debug && console.log('transaction-result', transaction)
        const htmlStr = `transaction: <a href="${explorerTx}${txHash}" target="_blank" style="color:#53A7FF;word-break:break-all">${txHash}</a>`
        this.$alert(htmlStr, !transaction.reverted ? 'Successful transaction' : 'Transaction was reverted', {
          type: !transaction.reverted ? 'success' : 'error',
          dangerouslyUseHTMLString: true
        }).catch(() => {})
        //
        this.transferTokensDone()
      }).catch(err => {
        this.debug && console.error(err.message)
        this.dialogTransferLoading = false
      })
    },
    // @
    transferTokensDone() {
      this.debug && console.log('transferTokensDone')
      this.dialogTransferLoading = false
      this.checkVPUBalance()
      for (let i = 0; i < this.transferTokens.length; i++) {
        this.transferTokens[i].amount = ''
      }
      this.dialogTransferVisible = false
    },
    // end Dialog Transfer Token -----------------------------------------------

    // @
    copyAddress(event) {
      clip(this.address, event)
    },
    // @
    checkVPUBalance() {
      this.checkVPUBtnLoading = true
      this.$store.getters.instances.VPUContract.balanceOf(this.address).then(result => {
        this.debug && console.log(result)
        this.vpuBalance = result
        this.checkVPUBtnLoading = false
      }).catch(err => {
        this.debug && console.error(err.message)
        this.checkVPUBtnLoading = false
      })
    },
    // @
    checkUserBalance01() {
      this.checkBalanceBtnLoading01 = true
      this.$store.getters.instances.ERC721DutchAuctionV1.userBalanceOf(this.address).then(result => {
        this.debug && console.log(result)
        this.userBalance01 = result
        this.checkBalanceBtnLoading01 = false
      }).catch(err => {
        this.debug && console.error(err.message)
        this.checkBalanceBtnLoading01 = false
      })
    },
    // @
    checkUserBalance02() {
      this.checkBalanceBtnLoading02 = true
      fundingBalance(`address=${this.address}`).then(result => {
        this.debug && console.log('fundingBalance-result', result)
        this.checkBalanceBtnLoading02 = false
        if (!result.data || !result.data.success) return
        this.userBalance02 = new window.web3.utils.BN(result.data.balance)
      }).catch(error => {
        console.log(error)
        this.checkBalanceBtnLoading02 = false
      })
    },
    // @
    recheckUserBalance01() {
      if (!isConnected([true, true], [true, true])) return // checkChainId, checkWallet
      if (this.checkBalanceBtnLoading01) return
      this.checkBalanceBtnLoading01 = true
      setTimeout(() => { this.checkUserBalance01() }, 1000)
    },
    // @
    handleAddressInput01() {
      if (!isConnected([true, false], [true, false])) return // checkChainId, checkWallet
      if (window.web3.utils.isAddress(this.inputRecipient01) === false) {
        this.recipientError01 = 'Recipient address is wrong format'
      } else {
        this.recipientError01 = null
      }
    },
    // @
    handleMaxAmount01() {
      if (this.withdrawBtnLoading01) return
      this.inputAmount01 = window.web3.utils.fromWei(this.userBalance01, 'ether')
      this.handleAmountInput01()
    },
    // @
    recheckUserBalance02() {
      if (!isConnected([true, true], [true, true])) return // checkChainId, checkWallet
      if (this.checkBalanceBtnLoading02) return
      this.checkBalanceBtnLoading02 = true
      setTimeout(() => { this.checkUserBalance02() }, 1000)
    },
    // @
    handleAddressInput02() {
      if (!isConnected([true, false], [true, false])) return // checkChainId, checkWallet
      if (window.web3.utils.isAddress(this.inputRecipient02) === false) {
        this.recipientError02 = 'Recipient address is wrong format'
      } else {
        this.recipientError02 = null
      }
    },
    // @
    handleMaxAmount02() {
      if (this.withdrawBtnLoading02) return
      this.inputAmount02 = window.web3.utils.fromWei(this.userBalance02, 'ether')
      this.handleAmountInput02()
    },
    // @
    handleAmountInput02() {
      if (!isConnected([true, false], [true, false])) return // checkChainId, checkWallet
      try {
        this.inputAmount02 = this.inputAmount02.replace(/[^\d.]/g, '') // chỉ lấy số và "."
        const wei = window.web3.utils.toWei(this.inputAmount02, 'ether') // nếu không hợp lệ sẽ chạy xuống catch
        this.inputAmount02 = window.web3.utils.fromWei(wei, 'ether') // convert lại để xóa số không thừa sau dấu phẩy
        this.withdrawAmount02 = wei
        const amountBN = new window.web3.utils.BN(wei)
        this.receiveAmount = amountBN.sub(this.feeAmount)
        const minWeiBN = new window.web3.utils.BN(window.web3.utils.toWei('50', 'ether')) // 50 VPU
        if (amountBN.lt(minWeiBN)) { // <
          this.amountError02 = 'Withdrawal amount must be at least 50 VPU'
          return
        }
        if (amountBN.gt(this.userBalance02)) { // >
          this.amountError02 = 'Not enough balance'
        } else {
          this.amountError02 = null
        }
      } catch (error) {
        console.log(error)
        this.amountError02 = 'Please enter a valid number'
        return
      }
    },
    // @
    handleAmountInput01() {
      if (!isConnected([true, false], [true, false])) return // checkChainId, checkWallet
      try {
        this.inputAmount01 = this.inputAmount01.replace(/[^\d.]/g, '')
        const wei = window.web3.utils.toWei(this.inputAmount01, 'ether')
        this.inputAmount01 = window.web3.utils.fromWei(wei, 'ether')
        this.withdrawAmount01 = wei
        if (this.inputAmount01 === '0') {
          this.amountError01 = 'Amount must be greater than 0'
          return
        }
        if (new window.web3.utils.BN(wei).gt(this.userBalance01)) { // >
          this.amountError01 = 'Not enough balance'
        } else {
          this.amountError01 = null
        }
      } catch (error) {
        // console.log(error)
        this.amountError01 = 'Please enter a valid number'
        return
      }
    },
    // @
    handleWithdraw02() {
      if (!isConnected([true, true], [true, true])) return // checkChainId, checkWallet
      this.handleAddressInput02()
      this.handleAmountInput02()
      if (this.recipientError02 !== null || this.amountError02 !== null) return
      this.withdrawBtnLoading02 = true
      fundingWithdraw(`address=${this.address}&amount=${this.withdrawAmount02}`).then(result => {
        this.debug && console.log('fundingWithdraw-result', result)
        if (!result.data) return
        if (result.data.balance) this.userBalance02 = new window.web3.utils.BN(result.data.balance)
        if (result.data.errorMess.length > 0) {
          const htmlStr = result.data.errorMess.join('<br>')
          this.$alert(htmlStr, 'Error!!', {
            type: 'error',
            dangerouslyUseHTMLString: true
          }).catch(() => {})
        } else if (result.data.success) {
          const htmlStr = 'The transaction has been sent, it may take up to 8 hours to be processed.'
          this.$alert(htmlStr, 'Successful', {
            type: 'success',
            dangerouslyUseHTMLString: true
          }).catch(() => {})
        }
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        this.withdrawBtnLoading02 = false
      })
    },
    // @
    handleWithdraw01() {
      if (!isConnected([true, true], [true, true])) return // checkChainId, checkWallet
      this.handleAddressInput01()
      this.handleAmountInput01()
      if (this.recipientError01 !== null || this.amountError01 !== null) return
      this.withdrawBtnLoading01 = true
      // test
      // this.inputRecipient01 = '0x0000000000000000000000000000000000000000'
      // this.withdrawAmount01 = '200000000000000000000'
      /**
       * VeChainThor when calling contract method always return RequestResult {"signer":, "txId":} so there will be no error to catch
       * still use catch to sync with Ethereum
       * transaction just returns reverted with no message so parseErrorMessage is not checked
      **/
      this.$store.getters.instances.ERC721DutchAuctionV1.userWithdraw(this.inputRecipient01, this.withdrawAmount01, { from: this.address }).then(async result => {
        this.debug && console.log('userWithdraw-result', result)
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
          this.$alert(htmlStr, 'Withdrawal successful', {
            type: 'success',
            dangerouslyUseHTMLString: true
          }).catch(() => {})
        }
        this.withdrawDone(this.withdrawAmount01)
      }).catch(err => {
        this.debug && console.error(err.message)
        this.withdrawBtnLoading01 = false
        const errMess = parseErrorMessage('ERC721Auction', err.message)
        if (errMess === null) return
        this.$alert(errMess, 'Transaction Error', {
          type: 'error'
        }).catch(() => {})
      })
    },
    // @
    withdrawDone(withdrawAmount01) {
      // gtag
      this.$gtag.event('withdrawDone', { amount: this.inputAmount01, wei: withdrawAmount01 })
      //
      this.withdrawBtnLoading01 = false
      this.inputAmount01 = undefined
      this.recheckUserBalance01()
    }
  }
}
</script>

<style>
  .is-error .el-input__inner {
    border-color: #ff4949;
  }
  .trans-input .el-input__inner {
    /*padding:0 5px;*/
    text-align: center;
    color: rgb(83, 167, 255);
  }
  .deviceMini .trans-input .el-input__inner {
    padding:0 5px;
  }
  .deviceMini .el-dialog__body {
    padding:10px 10px 30px 10px;
  }
  .deviceMini .el-button--medium.is-circle {
    padding: 6px;
  }
  .deviceMini .el-table--border td:first-child .cell {
    padding-left: 5px;
  }
  .deviceMini .el-table .cell {
    padding: 0 5px;
  }
</style>
<style lang="scss" scoped>
.your-wallet-container {
  // background-color: #f0f2f5;

  .wallet-box {
    // background-color: rgba(0, 0, 0, .1);
    border: 2px dashed #2a3969;
    margin-bottom: 10px;
    padding: 10px;
    padding: min(max(5px, 3vw), 20px);
    .el-icon-document-copy {
      cursor: pointer;
      margin-left: 5px;
    }
    .error {
      color: red;
      font-size: 15px;
    }
  }
  .num-break-all {
    color:#53A7FF;
    word-break: break-all;
  }
  .admin-box {
    background: #5f2d50;
    padding: 10px 0;
    margin-top: 10px;
    text-align: center;
  }
}
</style>
