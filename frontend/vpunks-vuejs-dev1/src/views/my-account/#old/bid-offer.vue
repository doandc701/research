<template>
  <div v-loading="runningAucLoading" class="smart-app-container running-auc-container">
    <!-- Your Running Auctions -->
    <h3 class="app-con-title">Your Bids <i class="el-icon-sort-up" /></h3>
    <el-table :data="runningAucList" border fit highlight-current-row>
      <el-table-column min-width="80px" align="center" label="TokenId">
        <template slot-scope="{row}">
          <el-link type="primary" @click.native.prevent="viewItemDetails(row.tokenId)">#{{ row.tokenId }}</el-link>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="Price">
        <template slot-scope="{row}">
          <span style="color:#53A7FF;">{{ row.price | fromWei }} VPU</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="Duration">
        <template slot-scope="{row}">
          <span v-if="row.closeWhenTimeout" style="padding-right:3px;">
            <el-tooltip class="item" effect="dark" content="Close When Timeout" placement="top">
              <i class="el-icon-alarm-clock" />
            </el-tooltip>
          </span>
          <span>{{ row.duration | durationFormat(row.secondsPassed) }} Min</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Status">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Started At (UTC)">
        <template slot-scope="{row}">
          <span>{{ row.startedAt | _parseTime | parseTime('{y}-{m}-{d} {h}:{i}:{m}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Actions" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="danger" size="mini" @click="handleCancelAuc(row)">Cancel</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="totalRunningAuc>0" :total="totalRunningAuc" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes="listQuery.pageSizes" @pagination="loadPageRunningAuc" />
    <!-- end Your Running Auctions -->

    <!-- Your Offers -->
    <h3 class="app-con-title">Your Offers <i class="el-icon-sort-down" /></h3>
    <el-table :data="yourOfferList" border fit highlight-current-row>
      <el-table-column min-width="80px" align="center" label="TokenId">
        <template slot-scope="{row}">
          <el-link type="primary" @click.native.prevent="viewItemDetails(row.tokenId)">#{{ row.tokenId }}</el-link>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="Actions" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="viewItemDetails(row.tokenId)">View</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- end Your Offers -->

    <h3 class="app-con-title">Your Balance</h3>
    <div v-if="userErc20Locked>0">Locked balance: <span class="num-break-all">{{ userErc20Locked | fromWei }} {{ erc20LockedSymbol }}</span>
      <p><el-button type="primary" :disabled="!erc20UnlockEnable" @click="handleUnlock()">Unlock</el-button></p>
    </div>
    <div>
      <p>Normal balance: <span class="num-break-all">{{ userErc20Balance | fromWei }} VPU</span></p>
      <p>Total Bid Value: {{ totalBidValue['0xb0821559723db89e0bd14fee81e13a3aae007e65'] | fromWei }} VPU</p>
      <p>Available for withdrawal: {{ canWithdraw['0xb0821559723db89e0bd14fee81e13a3aae007e65'] | fromWei }} VPU</p>
      <p>
        <el-input v-model="inputAmount" placeholder="enter the amount of VPU" @blur="handleAmountInput" />
        <br>
        <span v-show="amountError!=null" class="error">{{ amountError }}</span>
      </p>
      <p><el-button type="primary" @click="handleWithdraw()">Withdraw</el-button></p>
    </div>
    <NFTDetails />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import NFTDetails from '@/components/NFTDetails'
import { explorerTx, nativeToken } from '@/settings'
import { isConnected } from '@/utils/validate'

export default {
  name: 'YourRunningAuctions',
  components: { Pagination, NFTDetails },
  filters: {
    _parseTime(timestamp) {
      const t = new Date(1970, 0, 1) // Epoch
      t.setSeconds(timestamp)
      return t
    },
    fromWei(w) {
      if (typeof w !== 'object' && typeof w !== 'string') return w
      return window.web3.utils.fromWei(w, 'ether')
    },
    durationFormat(s, sp) {
      return `${(sp / 60).toFixed(2)}/${s / 60}`
    },
    statusFilter(status) {
      const statusMap = {
        end: 'info',
        run: 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      // general
      debug: false,
      address: null,
      nativeToken: nativeToken,

      // Running Auctions
      runningAucList: [],
      runningAucLoading: false,
      runningAucFetching: false,
      fetchingStep: 1, // recommended: 10
      totalRunningAuc: 0,
      interval01: null,
      // runningAucMaxShow: 48, // recommended: 48 (pageSizes * 2)
      runningAucMinShow: 12, // recommended: 12 (pageSizes / 2) (test 2)
      listQuery: {
        page: 1,
        limit: 24, // recommended: 24 (test 3)
        pageSizes: [24]// recommended: [24] (test 3)
      },

      // Your Offers
      yourOfferList: [],

      //
      withdrawAmount: undefined,
      inputAmount: undefined,
      amountError: null,
      totalBidValue: {
        '0xb0821559723db89e0bd14fee81e13a3aae007e65': new window.web3.utils.BN()
      },
      canWithdraw: {
        '0xb0821559723db89e0bd14fee81e13a3aae007e65': new window.web3.utils.BN()
      },
      btnWithdrawEnable: false,
      erc20UnlockEnable: false,
      erc20LockedSymbol: '',
      userErc20Locked: new window.web3.utils.BN(),
      userErc20Balance: new window.web3.utils.BN(),
      paymentlist: {
        '0xb0821559723db89e0bd14fee81e13a3aae007e65': 'VPU'
      }
    }
  },
  created() {
    this.debug && console.log('created - YourRunningAuctions', window.selectedAccount)
    if (!isConnected([true, true], [true, true])) { // checkChainId, checkWallet
      this.runningAucShowing = true
      return
    }
    this.address = window.selectedAccount

    window.createAuctionDone = this.createAuctionDone
    window.cancelAuctionDone = this.cancelAuctionDone
    window.onSubscribeEvents = this.onSubscribeEvents
    this.appendRunningAuctions(this.address, true)
    this.getBalance()
    this.getYourOffers()
    //
  },
  beforeDestroy() {
    this.debug && console.log('beforeDestroy - YourRunningAuctions')
    window.createAuctionDone = undefined
    window.cancelAuctionDone = undefined
    window.onSubscribeEvents = undefined
    clearInterval(this.interval01)
  },
  methods: {
    //
    async getBalance() {
      const vpuAddress = this.$store.getters.instances.VPUContract.address
      this.totalRunningAuc = await this.getTotalRunningAuc(this.address)
      await this.$store.getters.instances.ERC721BidV1.userErc20Locked(this.address).then(result => {
        this.debug && console.log('userErc20Locked', result)
        this.userErc20Locked = result[1]
        this.erc20LockedSymbol = this.paymentlist[result[0]]
        this.erc20UnlockEnable = this.totalRunningAuc <= 1
      }).catch(() => {})
      await this.$store.getters.instances.ERC721BidV1.userErc20Balance(this.address, vpuAddress).then(result => {
        this.debug && console.log('userErc20Balance', result)
        this.userErc20Balance = result
        const vpuAddress = '0xb0821559723db89e0bd14fee81e13a3aae007e65'
        this.canWithdraw[vpuAddress] = this.userErc20Balance.sub(this.totalBidValue[vpuAddress])
      }).catch(() => {})
    },
    handleUnlock() {
      if (!isConnected([true, true], [true, true])) return // checkChainId, checkWallet
      this.runningAucLoading = true
      this.$store.getters.instances.ERC721BidV1.unlockBalance({ from: this.address }).then(async result => {
        this.debug && console.log('unlockBalance-result', result)
        const txHash = result.txid
        const transaction = await window.VeChainThor.waitTxReceipt(txHash)
        this.debug && console.log('transaction-result', transaction)
        const htmlStr = `transaction: <a href="${explorerTx}${txHash}" target="_blank" style="color:#53A7FF;word-break:break-all">${txHash}</a>`
        this.$alert(htmlStr, !transaction.reverted ? 'Successful transaction' : 'Transaction was reverted', {
          type: !transaction.reverted ? 'success' : 'error',
          dangerouslyUseHTMLString: true
        }).catch(() => {})
        await this.getBalance()
        this.runningAucLoading = false
      }).catch(err => {
        this.debug && console.error(err.message)
        this.runningAucLoading = false
      })
    },
    handleWithdraw() {
      if (!isConnected([true, true], [true, true])) return // checkChainId, checkWallet
      this.handleAmountInput()
      if (this.amountError !== null) return
      this.runningAucLoading = true
      const vpuAddress = '0xb0821559723db89e0bd14fee81e13a3aae007e65'
      this.$store.getters.instances.ERC721BidV1.userWithdraw(vpuAddress, this.address, this.withdrawAmount, { from: this.address }).then(async result => {
        this.debug && console.log('userWithdraw-result', result)
        const txHash = result.txid
        const transaction = await window.VeChainThor.waitTxReceipt(txHash)
        this.debug && console.log('transaction-result', transaction)
        const htmlStr = `transaction: <a href="${explorerTx}${txHash}" target="_blank" style="color:#53A7FF;word-break:break-all">${txHash}</a>`
        this.$alert(htmlStr, !transaction.reverted ? 'Successful transaction' : 'Transaction was reverted', {
          type: !transaction.reverted ? 'success' : 'error',
          dangerouslyUseHTMLString: true
        }).catch(() => {})
        await this.getBalance()
        this.runningAucLoading = false
      }).catch(err => {
        this.debug && console.error(err.message)
        this.runningAucLoading = false
      })
    },
    handleAmountInput() {
      if (!isConnected([true, false], [true, false])) return // checkChainId, checkWallet
      try {
        this.inputAmount = this.inputAmount.replace(/[^\d.]/g, '')
        const wei = window.web3.utils.toWei(this.inputAmount, 'ether')
        this.inputAmount = window.web3.utils.fromWei(wei, 'ether')
        this.withdrawAmount = wei
        if (this.inputAmount === '0') {
          this.amountError = 'Amount must be greater than 0'
          return
        }
        if (new window.web3.utils.BN(wei).gt(this.canWithdraw['0xb0821559723db89e0bd14fee81e13a3aae007e65'])) { // >
          this.amountError = 'Exceed available balance'
        } else {
          this.amountError = null
        }
      } catch (error) {
        // console.log(error)
        this.amountError = 'Please enter a valid number'
        return
      }
    },

    // Your Offers -------------------------------------------------------
    async getYourOffers() {
      const vpunksAddress = '0xe92FDDD633008C1bca6E738725d2190cD46DF4a1'
      const result = await this.$store.getters.instances.ERC721BidPeripheryV1.offersOf(this.address, '0', '2000', [vpunksAddress]).catch(() => {})
      this.debug && console.log('offersOf-result', result)
      this.yourOfferList = []
      if (result !== undefined) {
        for (let i = 0; i < result.tokenIdsHasBid.length; i++) {
          this.yourOfferList.push({ 'tokenId': result.tokenIdsHasBid[i] })
        }
      }
    },
    // end Your Offers -------------------------------------------------------

    // Running Auctions -------------------------------------------------------
    // @
    loadPageRunningAuc() {
      this.appendRunningAuctions(this.address, true)
    },
    // @
    async getTotalRunningAuc(account) {
      let total = 0
      const auctionBalanceOf = await this.$store.getters.instances.ERC721BidV1.totalBidOfBidder(this.address).catch(() => {})
      if (auctionBalanceOf !== undefined) total = auctionBalanceOf.toNumber()
      this.debug && console.log('auctionBalanceOf: ' + total + ', account: ' + account)
      return total
    },
    // @
    async appendRunningAuctions(account, getTotal) {
      if (this.runningAucFetching) return
      this.runningAucFetching = true
      this.runningAucLoading = true
      if (getTotal) this.totalRunningAuc = await this.getTotalRunningAuc(account)
      if (this.totalRunningAuc <= 0) {
        this.runningAucList = []
        this.appendRunningAuctionsDone()
        return
      }
      const page = this.totalRunningAuc / this.listQuery.limit
      const pageFloor = Math.floor(page)
      const maxPage = page > pageFloor ? pageFloor + 1 : pageFloor
      if (this.listQuery.page > maxPage) this.listQuery.page = maxPage
      //
      const start = this.listQuery.page * this.listQuery.limit - this.listQuery.limit
      let end = this.listQuery.page * this.listQuery.limit - 1
      if (end > this.totalRunningAuc - 1) end = this.totalRunningAuc - 1
      this.debug && console.log('page: ' + this.listQuery.page + ', start: ' + start + ', end: ' + end)
      let indexs = []
      const _runningAucList = []
      //
      for (let i = start; i <= end; i++) {
        if (indexs.length < this.fetchingStep) indexs.push(i)
        if (indexs.length >= this.fetchingStep || i === end) {
          this.debug && console.log(`auctionOfOwnerByIndex() with indexs: ${indexs}`)
          const result = await this.$store.getters.instances.ERC721BidV1.bidOfBidderByIndex(account, indexs[0]).catch(() => {})
          this.debug && console.log('bidOfBidderByIndex-result', result)
          indexs = []
          if (result === undefined) continue
          result.startedAt = new window.web3.utils.BN(result.startedAt)
          result.duration = new window.web3.utils.BN(result.duration)
          _runningAucList.push(result)
          this.totalBidValue[result.paymentAddress] = this.totalBidValue[result.paymentAddress].add(new window.web3.utils.BN(result.price))
        }
      }
      const vpuAddress = '0xb0821559723db89e0bd14fee81e13a3aae007e65'
      this.canWithdraw[vpuAddress] = this.userErc20Balance.sub(this.totalBidValue[vpuAddress])
      this.runningAucList = _runningAucList
      this.appendRunningAuctionsDone()
    },
    // @
    appendRunningAuctionsDone() {
      this.debug && console.log('appendRunningAuctionsDone')
      this.runningAucFetching = false
      this.runningAucLoading = false
      this.currentPriceCalculator()
      clearInterval(this.interval01)
      this.interval01 = setInterval(() => {
        this.currentPriceCalculator()
      }, 3000)
    },
    // end Running Auctions -------------------------------------------------------

    // Cancel Auction -------------------------------------------------------
    // @
    handleCancelAuc(row) {
      // this.$store.dispatch('auctionCart/addCancelItem', { tokenId: row.tokenId, startedAt: row.startedAt })
      // if (typeof window.openCancelAuc === 'function') window.openCancelAuc()
      this.runningAucLoading = true
      this.$store.getters.instances.ERC721BidV1.cancelBids([row.bidId], { from: this.address }).then(async result => {
        this.debug && console.log('cancelBids-result', result)
        const txHash = result.txid
        const transaction = await window.VeChainThor.waitTxReceipt(txHash)
        this.debug && console.log('transaction-result', transaction)
        const htmlStr = `transaction: <a href="${explorerTx}${txHash}" target="_blank" style="color:#53A7FF;word-break:break-all">${txHash}</a>`
        this.$alert(htmlStr, !transaction.reverted ? 'Successful transaction' : 'Transaction was reverted', {
          type: !transaction.reverted ? 'success' : 'error',
          dangerouslyUseHTMLString: true
        }).catch(() => {})
        // this.withdrawStakingDone()
        // new tam
        setTimeout(() => {
          this.$router.push({ path: `/my-redirect?redirect=${this.$router.history.current.path}` })
        }, 800)
        this.runningAucLoading = false
      }).catch(err => {
        this.debug && console.error(err.message)
        this.runningAucLoading = false
      })
    },
    // @
    cancelAuctionDone(tokenIds) {
      console.log('cancelAuctionDone-tokenIds:', tokenIds)
      this.runningAucList = this.runningAucList.filter(obj => {
        return tokenIds.indexOf(obj.tokenId) === -1
      })
      const aucListCount = this.runningAucList.length
      const currentInPage = (this.listQuery.page - 1) * this.listQuery.limit + aucListCount
      this.getTotalRunningAuc(this.address).then(result => {
        this.totalRunningAuc = result
        if (aucListCount <= 0 || (this.totalRunningAuc <= this.listQuery.limit && aucListCount < this.totalRunningAuc) ||
        (aucListCount < this.runningAucMinShow && currentInPage < this.totalRunningAuc)) {
          this.appendRunningAuctions(this.address, false)
        }
      })
    },
    // end Cancel Auction -------------------------------------------------------

    // Create & Edit Auction -------------------------------------------------------
    // @
    handleUpdateAuc(row) {
      if (typeof row !== 'object') {
        const index = this.runningAucList.findIndex(obj => { return obj.tokenId === row })
        if (index >= 0) row = this.runningAucList[index]
      }
      if (typeof row === 'object' && typeof window.handlePreUpdateAuc === 'function') window.handlePreUpdateAuc(row)
    },
    // @
    createAuctionDone(tokenIds) {
      this.debug && console.log('createAuctionDone-tokenIds:', tokenIds)
      this.getAuctionByTokenId(tokenIds).then(result => {
        for (let i = 0; i < result.length; i++) {
          this.runningAucList = this.runningAucList.filter(obj => {
            return obj.tokenId !== result[i].tokenId
          })
          this.runningAucList.unshift(result[i])
        }
        /* This page does not need set the MAX
        while (this.runningAucList.length > this.runningAucMaxShow) {
          this.runningAucList.pop()
        }*/
        this.getTotalRunningAuc(this.address).then(result => {
          this.totalRunningAuc = result
        })
      })
    },
    // end Create & Edit Auction -------------------------------------------------------

    // View Item Details -------------------------------------------------------
    // @
    viewItemDetails(tokenId) {
      if (window.showNFTDetails) window.showNFTDetails(tokenId)
    },
    // end View Item Details -------------------------------------------------------

    // AuctionSuccessful -------------------------------------------------------
    // @
    onEventAuctionSuccessful(tokenId) {
      this.debug && console.log('onEventAuctionSuccessful-tokenId:', tokenId)
      if (this.runningAucLoading) return
      this.runningAucList = this.runningAucList.filter(obj => {
        return obj.tokenId !== tokenId
      })
      this.totalRunningAuc -= 1
      const aucListCount = this.runningAucList.length
      const currentInPage = (this.listQuery.page - 1) * this.listQuery.limit + aucListCount
      if (aucListCount <= 0 || (this.totalRunningAuc <= this.listQuery.limit && aucListCount < this.totalRunningAuc) ||
      (aucListCount < this.runningAucMinShow && currentInPage < this.totalRunningAuc)) {
        this.appendRunningAuctions(this.address, true)
      }
    },
    // end AuctionSuccessful -------------------------------------------------------

    // @
    generateAuctionStorage(o) {
      return {
        // seller: o.seller,
        tokenId: o.tokenId,
        startedAt: new window.web3.utils.BN(o.startedAt),
        startingPrice: new window.web3.utils.BN(o.startingPrice),
        endingPrice: new window.web3.utils.BN(o.endingPrice),
        duration: new window.web3.utils.BN(o.duration),
        closeWhenTimeout: o.closeWhenTimeout,
        currentPrice: new window.web3.utils.BN(o.startingPrice), // toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') (ex: 1234 -> 1,234)
        currentPriceV: ''
      }
    },

    // @
    async getAuctionByTokenId(tokenIds) {
      this.debug && console.log('getAuctionByTokenId-tokenIds:', tokenIds)
      const aucList = []
      const result = await this.$store.getters.instances.ERC721DutchAuctionV1.auctionByTokenId(tokenIds[0]).catch(() => {})
      if (result !== undefined) {
        for (let j = 0; j < result.length; j++) {
          const auc = this.generateAuctionStorage(result[j])
          aucList.push(auc)
        }
      }
      return aucList
    },

    // @
    onSubscribeEvents(event) {
      // event: AuctionCreated, AuctionUpdated, AuctionCancelled, AuctionSuccessful
      if (event.event === 'AuctionSuccessful' && event.returnValues.seller.toLowerCase() === this.address.toLowerCase()) {
        this.onEventAuctionSuccessful(event.returnValues.tokenId)
      }
    },

    // @
    currentPriceCalculator() {
      this.debug && console.log('currentPriceCalculator')
      const auctions = this.runningAucList
      const currTimestamp = new window.web3.utils.BN(Math.floor(Date.now() / 1000))

      for (let i = 0; i < auctions.length; i++) {
        const secondsPassed = currTimestamp.sub(auctions[i].startedAt)
        let forSell = true
        auctions[i].secondsPassed = secondsPassed.toNumber()
        if (auctions[i].duration.gt(new window.web3.utils.BN()) && secondsPassed.gte(auctions[i].duration)) {
          forSell = false
        }
        auctions[i].status = forSell ? 'run' : 'end'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.running-auc-container {
  .el-table span {
    word-break: break-word;
  }
  .el-icon-alarm-clock {
    // position: absolute;
    // top: 5px;
    // right: 5px;
    color:red;
  }
  .nft-details-container {
    display: flex;
    flex-wrap: wrap;
    .auction-details {
      width: 300px;
      display: inline-block;
      .card-panel {
        width: 100%;
      }
    }
    .chart-container {
      width: calc(100% - 300px);
      display: inline-block;
      padding: 20px;
    }
  }
  .loading-box {
    height: 50px;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 50px;
    color: aliceblue;
  }
  .num-break-all {
    color:#53A7FF;
    word-break: break-all;
  }
  .error {
    color: red;
    font-size: 15px;
  }
}

.panel-group {
  margin-top: 18px;

  .card-panel {
    padding: 10px 5px;
    font-size: 12px;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .1);
    border-color: rgba(0, 0, 0, .05);

    .card-panel-icon-wrapper {
      height: 200px;
      text-align: center;
      background: #c8c6e0;
      position: relative;
    }

    .card-panel-icon {
      height: 100%;
      image-rendering: pixelated;
    }

    .card-panel-description {
      font-weight: bold;
      margin: 15px 5px 0 5px;

      .card-panel-text {
        line-height: 18px;
        color: #212529;
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-type {
        float: right;
        color: #666;
        font-size: 14px;
      }
      .card-panel-acces {
        margin: 4px 4px 0 0;
        padding: .4em .6em;
        background-color: #c8c6e0;
        word-wrap: break-word;
        white-space: nowrap;
        display: inline-block;
        border-radius: .5rem;
        -webkit-border-radius: .5rem;
        -moz-border-radius: .5rem;
      }
    }
  }
}
</style>
