<template>
  <div v-loading="stakingLoading" class="smart-app-container staking-container">
    <!-- Your Staking -->
    <h3 class="app-con-title">Your Staking</h3>
    <el-table :data="stakingList" border fit highlight-current-row>
      <el-table-column min-width="80px" align="center" label="TokenId">
        <template slot-scope="{row}">
          <el-link type="primary" @click.native.prevent="viewItemDetails(row, false)">#{{ row.tokenId }}</el-link>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="Staking Amount">
        <template slot-scope="{row}">
          <span style="color:#53A7FF;">{{ row.stakeAmount | fromWei }} VPU</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="Your Rewards">
        <template slot-scope="{row}">
          <span>{{ row.rewardStored | fromWei }} VPU</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="Duration">
        <template slot-scope="{row}">
          <span>{{ row.duration2 | durationFormat(row.secondsPassed) }} Min</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="LinkToNFT">
        <template slot-scope="{row}">
          <el-tag :type="row.linkToNFT ? '' : 'warning'">
            {{ row.linkToNFT }}
          </el-tag>
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

      <el-table-column width="60px" align="center" label="Ac" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <i class="el-icon-s-operation" @click="viewItemDetails(row, false)" />
        </template>
      </el-table-column>
    </el-table>
    <p style="font-size:14px;color:#c58001;">Note: the stakes you get from others will not show here, it will show on each NFT if it exists, go to <el-link href="#/my-account/nfts" type="primary">Your NFTs</el-link></p>
    <pagination v-show="totalStaking>0" :total="totalStaking" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes="listQuery.pageSizes" @pagination="loadPageStaking" />
    <!-- end Your Staking -->

    <!-- Dialog View NFT -->
    <el-dialog v-loading="dialogVNFTLoading" :visible.sync="dialogVNFTVisible" title="NFT Details" width="800px">
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
          <!--<h3 style="text-align:center;">Transaction History</h3>
          <img style="width:100%" src="@/assets/punks-chart.png" alt="chart">-->
          <h3 class="app-con-title" style="text-align:center;">Staking Pool <b style="font-size:24px;">{{ tokenIdStakeInfo.poolId }}</b></h3>
          <div>
            <div style="text-align:center;padding-top:20px;">
              <div class="auc-details-label"><b>APY: </b><b style="color:rgb(6 189 87);font-size:20px;">{{ tokenIdStakeInfo.apy }}%</b></div>
              <div class="auc-details-label"><b>Staking amount: </b><span style="color: #1890ff;">{{ tokenIdStakeInfo.stakeAmount | fromWei }} VPU</span></div>
              <div class="auc-details-label"><b>Your rewards: </b><span style="color: #1890ff;">{{ tokenIdStakeInfo.rewardStored | fromWei }} VPU</span></div>
              <div class="auc-details-label"><b>Duration: </b>?/{{ tokenIdStakeInfo.duration }} hour</div>
              <div class="auc-details-label"><b>Link stake with NFT: </b>{{ tokenIdStakeInfo.linkToNFT }}</div>

              <p v-if="tokenIdStakeInfo.isAccess===undefined"><i class="el-icon-loading" /></p>
              <p v-else-if="tokenIdStakeInfo.isAccess===false">{{ !VNFTData.isAuction ? "This stake has been transferred to others" : "Please cancel auction before withdraw" }}</p>
              <div v-else>
                <div style="text-align:center;padding-top:30px;"><el-button type="primary" icon="el-icon-wallet" :disabled="tokenIdStakeInfo.status!=='end'" @click="withdrawStaking(tokenIdStakeInfo)">Withdraw</el-button></div>
                <!--<div style="text-align:center;padding-top:30px;"><el-button type="primary" icon="el-icon-wallet" disabled @click="claimStakingReward(VNFTData.tokenId)">Claim reward (soon)</el-button></div>-->
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="dialogVNFTVisible = false">Close</el-button>
      </span>
    </el-dialog>
    <!-- end Dialog View NFT -->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { nativeToken, explorerTx } from '@/settings'
import { isConnected } from '@/utils/validate'
import punks_1 from '@/punks/0-9999.json'

export default {
  name: 'YourStaking',
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

      // Your Staking
      stakingList: [],
      stakingLoading: false,
      stakingFetching: false,
      fetchingStep: 1, // recommended: 10
      totalStaking: 0,
      interval01: null,
      // stakingMaxShow: 48, // recommended: 48 (pageSizes * 2)
      stakingMinShow: 12, // recommended: 12 (pageSizes / 2) (test 2)
      listQuery: {
        page: 1,
        limit: 24, // recommended: 24 (test 3)
        pageSizes: [24]// recommended: [24] (test 3)
      },
      stakingPoolIdTem: [],

      // Dialog View NFT
      dialogVNFTVisible: false,
      dialogVNFTLoading: false,
      VNFTData: {
        accessories: []
      },
      imgLoading: false,
      tokenIdStakeInfo: {}
    }
  },
  created() {
    this.debug && console.log('created - YourStakings', window.selectedAccount)
    if (!isConnected([true, true], [true, true])) {
      this.stakingShowing = true
      return
    }
    this.address = window.selectedAccount
    this.appendStakings(this.address, true)
  },
  beforeDestroy() {
    this.debug && console.log('beforeDestroy - YourStakings')
    clearInterval(this.interval01)
  },
  methods: {
    // Your Staking -------------------------------------------------------
    // @
    loadPageStaking() {
      this.appendStakings(this.address, true)
    },
    // @
    async getTotalStaking(account) {
      /* test
      const xx = await this.$store.getters.instances.VPunkStakingV1.stakeHolders('1', '1').catch(() => {})
      this.debug && console.log('stakeHolders: ', xx)
      const result = await this.$store.getters.instances.ERC721DutchAuctionV1.auctionsByIndex(['1','2']).catch(() => {})
      this.debug && console.log('auctionsByIndex: ', result)*/

      //
      let total = 0
      this.stakingPoolIdTem = []
      const totalStakeInPoolOf = await this.$store.getters.instances.VPunkStakingV1.totalStakeInPoolOf(account, '1').catch(() => {})
      if (totalStakeInPoolOf !== undefined) {
        total = totalStakeInPoolOf.toNumber()
        for (let i = 0; i < total; i++) this.stakingPoolIdTem.push(['1', i])
      }
      const totalStakeInPoolOf2 = await this.$store.getters.instances.VPunkStakingV1.totalStakeInPoolOf(account, '2').catch(() => {})
      if (totalStakeInPoolOf2 !== undefined) {
        const total2 = totalStakeInPoolOf2.toNumber()
        total += total2
        for (let i = 0; i < total2; i++) this.stakingPoolIdTem.push(['2', i])
      }
      this.debug && console.log('totalStakeInPoolOf: ' + total + ', account: ' + account)
      return total
    },
    // @
    async appendStakings(account, getTotal) {
      if (this.stakingFetching) return
      this.stakingFetching = true
      this.stakingLoading = true
      if (getTotal) this.totalStaking = await this.getTotalStaking(account)
      if (this.totalStaking <= 0) {
        this.stakingList = []
        this.appendStakingsDone()
        return
      }
      const page = this.totalStaking / this.listQuery.limit
      const pageFloor = Math.floor(page)
      const maxPage = page > pageFloor ? pageFloor + 1 : pageFloor
      if (this.listQuery.page > maxPage) this.listQuery.page = maxPage
      //
      const start = this.listQuery.page * this.listQuery.limit - this.listQuery.limit
      let end = this.listQuery.page * this.listQuery.limit - 1
      if (end > this.totalStaking - 1) end = this.totalStaking - 1
      this.debug && console.log('page: ' + this.listQuery.page + ', start: ' + start + ', end: ' + end)
      let indexs = []
      const _stakingList = []
      //
      for (let i = start; i <= end; i++) {
        if (indexs.length < this.fetchingStep) indexs.push(i)
        if (indexs.length >= this.fetchingStep || i === end) {
          this.debug && console.log(`stakeIdInPoolByIndexOf, indexs: ${indexs}`)
          const poolId = this.stakingPoolIdTem[indexs[0]][0]
          const index = this.stakingPoolIdTem[indexs[0]][1]
          const stakeId = await this.$store.getters.instances.VPunkStakingV1.stakeIdInPoolByIndexOf(account, poolId, index).catch(() => {})
          this.debug && console.log('poolId: ' + poolId, 'stakeId: ' + stakeId.toString(), 'account: ' + account)
          if (stakeId === undefined) continue
          const result = await this.$store.getters.instances.VPunkStakingV1.stakeInPoolByStakeId(poolId, stakeId.toString()).catch(() => {})
          this.debug && console.log('result', result)
          indexs = []
          if (result === undefined || result[1] === '0') {
            this.totalStaking -= 1
            continue
          }
          const auc = this.generateAuctionStorage(result, poolId, stakeId.toString())
          _stakingList.push(auc)
        }
      }
      this.stakingList = _stakingList
      this.appendStakingsDone()
    },
    // @
    appendStakingsDone() {
      this.debug && console.log('appendStakingsDone')
      this.stakingFetching = false
      this.stakingLoading = false
      this.currentPriceCalculator()
      clearInterval(this.interval01)
      this.interval01 = setInterval(() => {
        this.currentPriceCalculator()
      }, 3000)
    },
    // end Your Staking -------------------------------------------------------
    async withdrawStaking(stake) {
      const currTimestamp = Math.floor(Date.now() / 1000)
      const duration = this.tokenIdStakeInfo.duration.toNumber() * 3600
      const startedAt = this.tokenIdStakeInfo.startedAt.toNumber()
      const secondsPassed = currTimestamp - startedAt
      let timeRemaining = duration - secondsPassed
      let timeType = 'hour'
      if (timeRemaining > 0) {
        if (timeRemaining < 3600) {
          timeRemaining = (timeRemaining / 60).toFixed(2)
          timeType = 'minutes'
        } else {
          timeRemaining = (timeRemaining / 3600).toFixed(2)
        }
        this.$alert(`Time remaining: ${timeRemaining} ${timeType}`, 'Warning!!', {
          type: 'warning'
        }).catch(() => {})
        return
      }

      this.debug && console.log('withdrawStaking', stake)
      this.dialogVNFTLoading = true
      this.$store.getters.instances.VPunkStakingV1.exitByStakeId(stake.poolId, stake.stakeId, { from: this.address }).then(async result => {
        this.debug && console.log('exitByStakeId-result', result)
        const txHash = result.txid
        const transaction = await window.VeChainThor.waitTxReceipt(txHash)
        this.debug && console.log('transaction-result', transaction)
        const htmlStr = `transaction: <a href="${explorerTx}${txHash}" target="_blank" style="color:#53A7FF;word-break:break-all">${txHash}</a>`
        this.$alert(htmlStr, !transaction.reverted ? 'Successful transaction' : 'Transaction was reverted', {
          type: !transaction.reverted ? 'success' : 'error',
          dangerouslyUseHTMLString: true
        }).catch(() => {})
        this.withdrawStakingDone()
        this.tokenIdStakeInfo = { startedAt: 0 }
        this.stakingList = this.stakingList.filter(obj => {
          return obj.tokenId !== stake.tokenId
        })
      }).catch(err => {
        this.debug && console.error(err.message)
        this.dialogVNFTLoading = false
      })
    },
    withdrawStakingDone() {
      this.dialogVNFTLoading = false
      this.dialogVNFTVisible = false
    },

    // View Item Details -------------------------------------------------------
    // @
    async viewItemDetails(item2, isAuction) {
      const item = this.getItemInfos(item2.tokenId)
      this.debug && console.log('item', item)
      const preImg = this.VNFTData.img
      this.VNFTData = item
      this.VNFTData.isAuction = isAuction
      if (preImg !== this.VNFTData.img) this.imgLoading = true
      this.dialogVNFTVisible = true
      //
      // console.log('item', item)
      // console.log('item2', item2)
      this.tokenIdStakeInfo = item2
      this.tokenIdStakeInfo.isAccess = undefined
      this.tokenIdStakeInfo.apy = item2.poolId === '1' ? 30 : 26
      let access = false
      if (item2.linkToNFT) {
        const owner = await this.$store.getters.instances.NFTContract.ownerOf(item2.tokenId)
        if (owner === this.address) {
          access = true
        } else {
          access = false
          this.VNFTData.isAuction = true // tạm cho V1
        }
      } else {
        access = await this.$store.getters.instances.VPunkStakingV1.accessToStakeByStakeId(this.address, item2.poolId, this.tokenIdStakeInfo.stakeId).catch(() => {})
      }
      this.debug && console.log('access', access, this.address, this.tokenIdStakeInfo.stakeId)
      if (access !== undefined) this.tokenIdStakeInfo.isAccess = access
      //
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

    // @
    generateAuctionStorage(o, poolId, stakeId) {
      return {
        // seller: o.seller,
        tokenId: o[0],
        startedAt: new window.web3.utils.BN(o[1]),
        stakeAmount: new window.web3.utils.BN(o[2]),
        rewardStored: new window.web3.utils.BN(o[3]),
        rewardWithdrawn: new window.web3.utils.BN(o[4]),
        duration: new window.web3.utils.BN(o[5]),
        duration2: new window.web3.utils.BN(o[5] * 3600), // tạm
        linkToNFT: o[7],
        poolId: poolId, // new
        stakeId: stakeId, // new
        isAccess: false // new
      }
    },

    // @
    currentPriceCalculator() {
      this.debug && console.log('currentPriceCalculator')
      const stakings = this.stakingList
      const currTimestamp = new window.web3.utils.BN(Math.floor(Date.now() / 1000))

      for (let i = 0; i < stakings.length; i++) {
        const secondsPassed = currTimestamp.sub(stakings[i].startedAt)
        let forSell = true
        stakings[i].secondsPassed = secondsPassed.toNumber()
        if (secondsPassed.gte(stakings[i].duration.mul(new window.web3.utils.BN(3600)))) { // h -> s
          forSell = false
        }
        stakings[i].status = forSell ? 'run' : 'end'
      }
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.staking-container {
  .el-table span {
    word-break: break-word;
  }
  .el-icon-s-operation {
    font-size: 18px;
    cursor: pointer;
    padding: 5px;
  }
  .el-icon-s-operation:hover {
    background: #e8e8e8;
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
