<template>
  <div v-loading="finishedAucLoading" class="smart-app-container finished-auc-container">
    <!-- Your Finished Auctions -->
    <h3 class="app-con-title">Your Finished Auctions</h3>
    <el-table :data="finishedAucList" border fit highlight-current-row>
      <el-table-column align="center" label="TokenId" min-width="80">
        <template slot-scope="{row}">
          <el-link type="primary" @click.native.prevent="viewItemDetails(row.tokenId)">#{{ row.tokenId }}</el-link>
        </template>
      </el-table-column>

      <el-table-column min-width="60px" align="center" label="Type">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="Price">
        <template slot-scope="{row}">
          <span>{{ row.price | fromWei }} {{ nativeToken }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="Partner">
        <template slot-scope="{row}">
          <el-link :href="row.partnerLink" target="_blank">{{ row.partner }}</el-link>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Timestamp (UTC)">
        <template slot-scope="{row}">
          <el-link type="primary" :href="row.transactionLink" target="_blank">{{ row.blockTimestamp | _parseTime | parseTime('{y}-{m}-{d} {h}:{i}:{m}') }} <svg-icon icon-class="link" style="font-size:10px;" /></el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- end Your Finished Auctions -->
    <div v-show="showPagination" style="padding: 60px 10px 30px 10px;">
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-arrow-left" @click="previousPage()">Previous</el-button>
        <el-button type="primary" size="small" @click="nextPage()">Next <i class="el-icon-arrow-right" /></el-button>
      </el-button-group>
      <span style="padding-left: 15px;">Page {{ listQuery.page }}</span>
    </div>

    <NFTDetails />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'
import { isConnected } from '@/utils/validate'
import { nativeToken, explorerAddress, explorerTx } from '@/settings'
import NFTDetails from '@/components/NFTDetails'

export default {
  name: 'YourFinishedAuctions',
  components: { NFTDetails },
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
    statusFilter(status) {
      const statusMap = {
        buy: '',
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

      // Finished Auctions
      finishedAucList: [],
      finishedAucLoading: false,
      showPagination: false,
      totalItem: 0,
      listQuery: {
        page: 1,
        limit: 30 // recommended: 30
        // pageSizes: [30] // recommended: [30]
      }
    }
  },
  created() {
    this.debug && console.log('created - YourFinishedAuctions', window.selectedAccount)
    if (!isConnected([true, true], [true, true])) return
    this.address = window.selectedAccount

    // tam
    // window.onSubscribeEvents = this.onSubscribeEvents tam khoa
    this.appendFinishedAuctions(this.address)
  },
  beforeDestroy() {
    this.debug && console.log('beforeDestroy - YourFinishedAuctions')
    window.onSubscribeEvents = undefined
  },
  methods: {
    //
    previousPage() {
      if (this.finishedAucLoading) return
      if (this.listQuery.page > 1) {
        this.listQuery.page -= 1
        this.appendFinishedAuctions(this.address)
      }
    },
    nextPage() {
      if (this.finishedAucLoading) return
      this.listQuery.page += 1
      this.appendFinishedAuctions(this.address)
    },
    // @
    async appendFinishedAuctions(account) {
      if (this.finishedAucLoading) return
      this.finishedAucLoading = true
      const fromIndex = (this.listQuery.page - 1) * this.listQuery.limit
      const filter = this.$store.getters.instances.ERC721DutchAuctionV1.AuctionSuccessful.filter([{
        'seller': this.address
      },
      {
        'winner': this.address
      }]).order('desc') // Work from the last event
      const logResults = await filter.apply(fromIndex, this.listQuery.limit).catch(() => {})
      this.debug && console.log('logResults', logResults)
      if (logResults !== undefined) {
        if (logResults.length > 0) this.showPagination = true
        scrollTo(0, 800)
        this.finishedAucList = []
        for (let i = 0; i < logResults.length; i++) {
          const auc = this.generateAuctionStorage(logResults[i])
          const aucView = this.generateAuctionView(auc)
          this.finishedAucList.push(aucView)
        }
      }
      this.appendFinishedAuctionsDone()
    },
    // @
    appendFinishedAuctionsDone() {
      this.debug && console.log('appendFinishedAuctionsDone')
      this.finishedAucLoading = false
    },
    // @
    generateAuctionStorage(event) {
      // decoded
      return {
        tokenId: event.decoded.tokenId,
        price: new window.web3.utils.BN(event.decoded.price), // get BN
        seller: event.decoded.seller,
        winner: event.decoded.winner,
        blockNumber: event.meta.blockNumber,
        transactionHash: event.meta.txID,
        blockTimestamp: event.meta.blockTimestamp
      }
    },
    // @
    generateAuctionView(_auc) {
      const auc = Object.assign({}, _auc) // copy obj
      if (auc.seller.toLowerCase() === this.address.toLowerCase()) {
        auc.status = 'sell'
        auc.partner = auc.winner
      } else if (auc.winner.toLowerCase() === this.address.toLowerCase()) {
        auc.status = 'buy'
        auc.partner = auc.seller
      }
      auc.partnerLink = `${explorerAddress}${auc.partner}`
      auc.transactionLink = `${explorerTx}${auc.transactionHash}`
      return auc
    },

    // View Item Details -------------------------------------------------------
    // @
    viewItemDetails(tokenId) {
      if (window.showNFTDetails) window.showNFTDetails(tokenId)
    }
    // end View Item Details -------------------------------------------------------

    // @
    /*
    onSubscribeEvents(event) {
      if (event.event === 'AuctionSuccessful') {
        // returnValues or args
        const auc = this.generateAuctionStorage(event)
        if (auc.seller.toLowerCase() !== this.address.toLowerCase() && auc.winner.toLowerCase() !== this.address.toLowerCase()) return
        this.totalItem += 1
        // this.finishedAucStorage.unshift(auc)
        this.finishedAucList.unshift(this.generateAuctionView(auc))
        if (this.finishedAucList.length > this.listQuery.limit) this.finishedAucList.pop()
      }
    }*/
  }
}
</script>

<style lang="scss" scoped>
.finished-auc-container {
  .el-table span {
    word-break: break-word;
  }
}
</style>
