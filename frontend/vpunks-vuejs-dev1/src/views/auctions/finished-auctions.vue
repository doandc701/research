<template>
  <div v-loading="finishedAucLoading" class="smart-app-container finished-auc-container">
    <!-- Finished Auctions -->
    <h3 class="app-con-title">Finished Auctions</h3>
    <el-table :data="finishedAucList" border fit highlight-current-row>
      <el-table-column align="center" label="TokenId" min-width="80">
        <template slot-scope="{row}">
          <el-link type="primary" @click.native.prevent="viewItemDetails(row.tokenId)">#{{ row.tokenId }}</el-link>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="Price">
        <template slot-scope="{row}">
          <span>{{ row.price | fromWei }} {{ nativeToken }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="Winner">
        <template slot-scope="{row}">
          <el-link :type="row.role==2?'primary':'default'" @click.native.prevent="openAddressDialog(row.winner)">{{ row.winner }}</el-link>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="Seller">
        <template slot-scope="{row}">
          <el-link :type="row.role==1?'primary':'default'" @click.native.prevent="openAddressDialog(row.seller)">{{ row.seller }}</el-link>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Timestamp (UTC)">
        <template slot-scope="{row}">
          <el-link type="primary" :href="row.transactionLink" target="_blank">{{ row.blockTimestamp | _parseTime | parseTime('{y}-{m}-{d} {h}:{i}:{m}') }} <svg-icon icon-class="link" style="font-size:10px;" /></el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- end Finished Auctions -->
    <div v-show="showPagination" style="padding: 60px 10px 30px 10px;">
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-arrow-left" @click="previousPage()">Previous</el-button>
        <el-button type="primary" size="small" @click="nextPage()">Next <i class="el-icon-arrow-right" /></el-button>
      </el-button-group>
      <span style="padding-left: 15px;">Page {{ listQuery.page }}</span>
    </div>
    <NFTDetails />
    <AddressDialog ref="addressDialog" />
    <!-- <el-button type="text" @click="centerDialogVisible = true">Click to open the Dialog</el-button> -->
  </div>
</template>

<script>
import { isConnected } from '@/utils/validate'
import { scrollTo } from '@/utils/scroll-to'
import { nativeToken, explorerTx } from '@/settings' // explorerAddress
import NFTDetails from '@/components/NFTDetails'
import AddressDialog from '@/components/AddressDialog'
// import AcountAddress from '@/components/AcountAddress'

export default {
  name: 'FinishedAuctions',
  components: {
    NFTDetails,
    AddressDialog
    // AcountAddress
  },
  filters: {
    _parseTime(timestamp) {
      const t = new Date(1970, 0, 1) // Epoch
      t.setSeconds(timestamp)
      return t
    },
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

      // Finished Auctions
      finishedAucList: [],
      finishedAucLoading: false,
      showPagination: false,
      totalItem: 0,
      listQuery: {
        page: 1,
        limit: 30 // recommended: 30 , vechain: 30
        // pageSizes: [30] // recommended: [30]
      },
      total: new window.web3.utils.BN() // test
    }
  },
  created() {
    this.debug && console.log('created - FinishedAuctions', window.selectedAccount)
    if (!isConnected([true, true], [false, false])) return
    this.address = window.selectedAccount
    // tam
    // window.onSubscribeEvents = this.onSubscribeEvents tam khoa
    this.appendFinishedAuctions()
  },
  beforeDestroy() {
    this.debug && console.log('beforeDestroy - FinishedAuctions')
    window.onSubscribeEvents = undefined
  },
  methods: {
    //
    previousPage() {
      if (this.finishedAucLoading) return
      if (this.listQuery.page > 1) {
        this.listQuery.page -= 1
        this.appendFinishedAuctions()
      }
    },
    nextPage() {
      if (this.finishedAucLoading) return
      this.listQuery.page += 1
      this.appendFinishedAuctions()
    },
    // @
    async appendFinishedAuctions() {
      if (this.finishedAucLoading) return
      this.finishedAucLoading = true
      const fromIndex = (this.listQuery.page - 1) * this.listQuery.limit

      const filter = this.$store.getters.instances.ERC721DutchAuctionV1.AuctionSuccessful.filter([]).order('desc') // Work from the last event
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
          this.total = this.total.add(auc.price)
        }
      }
      this.appendFinishedAuctionsDone()
    },
    // @
    appendFinishedAuctionsDone() {
      this.debug && console.log('appendFinishedAuctionsDone')
      this.finishedAucLoading = false
      console.log('total', window.web3.utils.fromWei(this.total, 'ether'))
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
      const auc = Object.assign({}, _auc) // copy obj,
      // auc.sellerLink = `${explorerAddress}${auc.seller}`
      // auc.winnerLink = `${explorerAddress}${auc.winner}`
      auc.transactionLink = `${explorerTx}${auc.transactionHash}`
      if (this.address && auc.seller.toLowerCase() === this.address.toLowerCase()) {
        auc.role = 1
      } else if (this.address && auc.winner.toLowerCase() === this.address.toLowerCase()) {
        auc.role = 2
      }
      return auc
    },

    // View Item Details -------------------------------------------------------
    // @
    viewItemDetails(tokenId) {
      if (window.showNFTDetails) window.showNFTDetails(tokenId)
    },
    openAddressDialog(address) {
      (this.$refs.addressDialog).open(null, address)
    }
    // end View Item Details -------------------------------------------------------

    // @
    /*
    onSubscribeEvents(event) {
      if (event.event === 'AuctionSuccessful') {
        // returnValues or args
        this.totalItem += 1
        const auc = this.generateAuctionStorage(event)
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
