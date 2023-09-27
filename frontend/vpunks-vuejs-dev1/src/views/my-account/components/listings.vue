<template>
  <div v-loading="runningAucLoading" class="running-auc-container">
    <!-- Your Running Auctions -->
    <h3 class="app-con-title">Your Running Auctions</h3>
    <el-table :data="runningAucList" border fit highlight-current-row>
      <el-table-column min-width="80px" align="center" label="TokenId">
        <template slot-scope="{row}">
          <el-link type="primary" @click.native.prevent="viewItemDetails(row.tokenId, true)">#{{ row.tokenId }}</el-link>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="Current Price">
        <template slot-scope="{row}">
          <span style="color:#53A7FF;">{{ row.currentPriceV }} {{ nativeToken }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="Starting Price">
        <template slot-scope="{row}">
          <span>{{ row.startingPrice | fromWei }} {{ nativeToken }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="Ending Price">
        <template slot-scope="{row}">
          <span>{{ row.endingPrice | fromWei }} {{ nativeToken }}</span>
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
          <el-button type="primary" size="mini" @click="handleUpdateAuc(row)">Edit</el-button>
          <el-button type="danger" size="mini" @click="handleCancelAuc(row)">Cancel</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="totalRunningAuc>0" :total="totalRunningAuc" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes="listQuery.pageSizes" @pagination="loadPageRunningAuc" />
    <!-- end Your Running Auctions -->

    <!-- Dialog View NFT -->
    <el-dialog :visible.sync="dialogVNFTVisible" title="NFT Details" width="800px">
      <div class="nft-details-container">
        <div class="auction-details">
          <h1>VPunk {{ VNFTData.tokenId }}</h1>
          <div class="panel-group">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper">
                <img :src="VNFTData.img" class="card-panel-icon" @load="onImgLoad">
                <span v-show="imgLoading" class="loading-box"><i class="el-icon-loading" /></span>
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  <span class="card-panel-type">Type: {{ VNFTData.type }}</span>
                </div>
                Accessories<br>
                <span v-for="acces of VNFTData.accessories" :key="acces" class="card-panel-acces">{{ acces }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="chart-container">
          <h3 style="text-align:center;">Transaction History</h3>
          <img style="width:100%" src="@/assets/punks-chart.png" alt="chart">
        </div>
      </div>
      <span slot="footer">
        <el-button v-if="VNFTData.isAuction" type="primary" @click="handleUpdateAuc(VNFTData.tokenId)">Edit auction</el-button>
        <el-button v-else type="success" @click="handleCreateAuc(VNFTData.tokenId)">Sell</el-button>
        <el-button @click="dialogVNFTVisible = false">Close</el-button>
      </span>
    </el-dialog>
    <!-- end Dialog View NFT -->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { nativeToken } from '@/settings'
import { isConnected } from '@/utils/validate'
import punks_1 from '@/punks/0-9999.json'

export default {
  name: 'YourRunningAuctions',
  components: { Pagination },
  filters: {
    _parseTime(timestamp) {
      const t = new Date(1970, 0, 1) // Epoch
      t.setSeconds(timestamp)
      return t
    },
    fromWei(w) {
      if (typeof w !== 'object') return w
      return window.web3.utils.fromWei(w, 'ether')
    },
    durationFormat(s, sp) {
      return `${(sp / 60).toFixed(2)}/${s / 60}`
    },
    statusFilter(status) {
      const statusMap = {
        end: 'info',
        sell: 'success'
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

      // Dialog View NFT
      dialogVNFTVisible: false,
      VNFTData: {
        accessories: []
      },
      imgLoading: false
    }
  },
  created() {
    this.debug && console.log('created - YourRunningAuctions', window.selectedAccount)
    if (!isConnected([true, true], [true, true])) {
      this.runningAucShowing = true
      return
    }
    this.address = window.selectedAccount

    window.createAuctionDone = this.createAuctionDone
    window.cancelAuctionDone = this.cancelAuctionDone
    window.onSubscribeEvents = this.onSubscribeEvents
    this.appendRunningAuctions(this.address, true)
  },
  beforeDestroy() {
    this.debug && console.log('beforeDestroy - YourRunningAuctions')
    window.createAuctionDone = undefined
    window.cancelAuctionDone = undefined
    window.onSubscribeEvents = undefined
    clearInterval(this.interval01)
  },
  methods: {
    // Running Auctions -------------------------------------------------------
    // @
    loadPageRunningAuc() {
      this.appendRunningAuctions(this.address, true)
    },
    // @
    async getTotalRunningAuc(account) {
      let total = 0
      const auctionBalanceOf = await this.$store.getters.instances.ERC721DutchAuctionV1.auctionBalanceOf(account).catch(() => {})
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
          const result = await this.$store.getters.instances.ERC721DutchAuctionV1.auctionOfOwnerByIndex(account, indexs[0]).catch(() => {})
          indexs = []
          if (result === undefined) continue
          for (let j = 0; j < result.length; j++) {
            const auc = this.generateAuctionStorage(result[j])
            this.debug && console.log('auc', auc)
            _runningAucList.push(auc)
          }
        }
      }
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
      this.$store.dispatch('auctionCart/addCancelItem', { tokenId: row.tokenId, startedAt: row.startedAt })
      if (typeof window.openCancelAuc === 'function') window.openCancelAuc()
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
    viewItemDetails(item, isAuction) {
      if (typeof item !== 'object') item = this.getItemInfos(item)
      this.debug && console.log('item', item)
      const preImg = this.VNFTData.img
      this.VNFTData = item
      this.VNFTData.isAuction = isAuction
      this.dialogVNFTVisible = true
      if (preImg !== this.VNFTData.img) this.imgLoading = true
    },
    // @
    getItemInfos(tokenId) {
      const item = punks_1[tokenId]
      if (typeof item.accessories === 'string') item.accessories = item.accessories.split(' / ')
      let imgId = '000' + item.id
      imgId = imgId.slice(imgId.length - 4)
      // item.img = `https://www.larvalabs.com/public/images/cryptopunks/punk${imgId}.png`
      item.img = `https://vpunks.com/images/vpunks/punk${imgId}.png`
      item.tokenId = tokenId.toString()
      return item
    },
    // @
    onImgLoad() {
      this.imgLoading = false
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
        const startingPrice = auctions[i].startingPrice
        const endingPrice = auctions[i].endingPrice
        const secondsPassed = currTimestamp.sub(auctions[i].startedAt)
        let forSell = true
        auctions[i].secondsPassed = secondsPassed.toNumber()
        if (secondsPassed.gte(auctions[i].duration)) {
          auctions[i].currentPrice = endingPrice
          auctions[i].currentPriceV = window.web3.utils.fromWei(endingPrice, 'ether')
          if (auctions[i].closeWhenTimeout) forSell = false
        } else if (startingPrice.eq(endingPrice)) {
          auctions[i].currentPrice = endingPrice
          auctions[i].currentPriceV = window.web3.utils.fromWei(endingPrice, 'ether')
        } else {
          const totalPriceChange = endingPrice.sub(startingPrice)
          const currentPriceChange = totalPriceChange.mul(secondsPassed).div(auctions[i].duration)
          auctions[i].currentPrice = startingPrice.add(currentPriceChange)
          const curr = window.web3.utils.fromWei(auctions[i].currentPrice, 'ether')
          const arr = curr.split('.')
          if (arr.length === 1 || arr[0].length >= 10) {
            auctions[i].currentPriceV = `~${arr[0]}`
          } else {
            const decimal = arr[1].slice(0, 15 - arr[0].length)
            auctions[i].currentPriceV = `~${arr[0]}.${decimal}`
          }
        }
        auctions[i].status = forSell ? 'sell' : 'end'
        auctions[i].currentPriceV += ' '// trick to update duration label
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
