<template>
  <div v-loading="runningAucLoading" class="smart-app-container auction-container">
    <el-progress class="progress" :class="{'progress2':percentageShow}" type="circle" :percentage="percentage" :show-text="false" :width="30" :stroke-width="4" />
    <!--<div class="notify">This feature is coming soon.<br>
      <a href="/local-demo/#/auctions/index" target="_blank" rel="noopener">
        <el-button type="primary" size="medium" plain round>Demo</el-button>
      </a>
    </div>-->
    <div class="notify">This is an auctions listing that calls directly from Vechain connex, no server and no sort filter</div>
    <!-- Current Auctions -->
    <h3 class="app-con-title">Current Auctions</h3>
    <div v-if="queryChallenge" class="notify">My Challenge List</div>
    <el-row :gutter="gutter" class="panel-group">
      <el-col v-for="(item, index) of runningAucList" :key="item.tokenId" :xs="elColXS" :sm="8" :lg="6" :xl="4" class="card-panel-col">
        <div :id="index===0&&'card-panel-first'" class="card-panel">
          <div v-if="item.staking" class="card-staking">{{ item.staking }}</div>
          <div class="card-panel-icon-wrapper" :class="(item.owned||!item.forSell)&&'icon-wrapper-end'">
            <img :src="item.img" class="card-panel-icon">
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              VPunk {{ item.tokenId }}
              <span class="card-panel-type">{{ item.type }}</span>
            </div>
            <div v-if="item.owned&&!item.forSell" class="card-panel-warning">
              Auction end
            </div>
            <div v-else class="card-panel-price">
              <img src="@/assets/tokens-symbol/vet-64x64.png">
              Price: {{ item.currentPriceV }}
            </div>
          </div>
          <!--<iframe src="http://localhost:3000/three/three.js-master/examples/webgl_loader_collada.html" width="300px" height="400px"></iframe>-->
          <div class="card-panel-footer">
            <el-button v-if="item.closeWhenTimeout" @click.native.prevent="viewAuctionDetails(item)">View <i class="el-icon-alarm-clock" /></el-button>
            <el-button v-else @click.native.prevent="viewAuctionDetails(item)">View details</el-button>
            <el-button v-if="!item.owned&&!item.forSell" disabled>End</el-button>
            <el-button v-else-if="item.owned" type="primary" disabled>Owned</el-button>
            <el-button v-else type="success" @click="handleBidAuc(item)">Buy</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <div v-if="runningAucList.length===0" style="text-align:center;font-size:14px;"><span class="el-table__empty-text">{{ runningAucLoading ? 'Loading...' : 'No Data' }}</span></div>
    <pagination v-show="totalRunningAuc>0" :total="totalRunningAuc" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes="listQuery.pageSizes" @pagination="loadPageRunningAuc" />
    <!-- end Current Auctions -->

    <!-- Dialog View Auction -->
    <el-dialog :visible.sync="dialogVAVisible" title="NFT Auction" width="800px">
      <div class="auction-dialog-body">
        <div class="auction-details">
          <img :src="VAData.img" class="card-panel-icon" style="width:80px;image-rendering:pixelated;margin:-25px 0 5px 0;">
          <div class="auc-details-value"><b>VPunk</b>
            <el-tag effect="plain" style="font-size:18px;margin-left:10px;">
              {{ VAData.tokenId }}
            </el-tag>
            <span v-if="VAData.staking" style="padding-left:10px;">& <b style="color:#bd8f14;">{{ VAData.staking }}</b> Staking</span>
          </div>
          <!--
          <div class="card-panel-icon-wrapper">
            <img :src="VAData.img" class="card-panel-icon" @load="onImgLoad">
            <span v-show="imgLoading" class="loading-box"><i class="el-icon-loading" /></span>
          </div>-->
          <!--<div class="auc-details-label"><b>Accessories: </b>{{ VAData.accessories }}</div>-->
          <div class="auc-details-label"><b>Starting price</b></div>
          <div class="auc-details-value">{{ VAData.startingPrice | fromWei }} {{ nativeToken }}</div>
          <div class="auc-details-label"><b>Current price</b></div>
          <div class="auc-details-value" :class="VAData.status | statusFilter">
            {{ VAData.currentPrice | fromWei }} {{ nativeToken }}
          </div>
          <div class="auc-details-label"><b>Ending price</b></div>
          <div class="auc-details-value">{{ VAData.endingPrice | fromWei }} {{ nativeToken }}</div>
          <div class="auc-details-label"><b>Duration</b></div>
          <div class="auc-details-value">{{ VAData.duration | durationFormat(VAData.secondsPassed) }} Minutes
            <span v-if="VAData.closeWhenTimeout">
              <el-tooltip class="item" effect="dark" content="Close When Timeout" placement="top">
                <i class="el-icon-alarm-clock" />
              </el-tooltip>
            </span>
          </div>
          <div class="auc-details-label"><b>Status</b></div>
          <div class="auc-details-value">
            <el-tag :type="VAData.status | statusFilter">
              {{ VAData.status }}
            </el-tag>
          </div>
          <div class="auc-details-label"><b>Seller: </b>
            <el-link :href="VAData.sellerLink" target="_blank" style="display: inline;">{{ VAData.sellerV }}</el-link>
          </div>
        </div>
        <div class="chart-container">
          <el-tabs>
            <!--<el-tab-pane v-if="VAData.staking" label="Staking">
            </el-tab-pane>-->
            <el-tab-pane label="Rarity">
              <div class="rarity-box" :style="{ height: rarityBoxHeight }">
                <div class="rarity-mc">
                  <div class="rarity-total">
                    Rarity Score
                    <div class="rarity-total2 padding4">{{ VAData.rarityScore }}</div>
                  </div>
                  <div style="margin: 20px 0;">
                    <div v-for="(item) of VAData.rarityInfo" :key="item[0]" class="rarity-total3">
                      <div class="rarity-total4">{{ item[0] }} <span>+{{ item[3] }}</span></div>
                      <div class="rarity-total5 padding4">{{ item[1] }} <span>{{ item[2] }}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="Price chart">
              <chart v-if="dialogVAVisible" width="440px" height="440px" :auction="VAData" :current-price="VACPrice" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <span slot="footer">
        <div :style="{ width: viewAucFooterWidth + 'px' }">
          <el-button v-if="VAData.owned" type="primary" disabled style="width:100%">Your auction</el-button>
          <el-button v-else type="success" :disabled="!VAData.forSell" :loading="buyButtonLoading" style="width:100%" @click="handleBidAuc(VAData)">Buy</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- end Dialog View Auction -->
  </div>
</template>

<script>
// import RightPanel from '@/components/RightPanel'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Chart from '@/components/Charts/Line'
import { isConnected } from '@/utils/validate'
import { nativeToken, explorerAddress } from '@/settings'
// import { parseErrorMessage } from '@/utils/error-message-parse'
import { getVpunks } from '@/api/user'
import punks_1 from '@/punks/0-9999.json'
import rarityInfo from '@/punks/rarity-info.json'

export default {
  name: 'Auctions',
  components: {
    Pagination,
    Chart
    // RightPanel
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
    },
    durationFormat(s, sp) {
      return `${(sp / 60).toFixed(2)}/${s / 60}`
    },
    statusFilter(status) {
      const statusMap = {
        sell: 'success',
        end: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      // general
      debug: false,
      state: '',
      stateBreak: 0,
      address: null,
      nativeToken: nativeToken,

      // Running Auctions
      runningAucList: [],
      runningAucLoading: false,
      runningAucFetching: false,
      fetchingStep: 1, // recommended: 10
      totalRunningAuc: 0,
      interval01: null,
      // runningAucMaxShow: 72, // recommended: 72 (pageSizes * 2)
      runningAucMinShow: 18, // recommended: 18 (pageSizes / 2) (test 2)
      listQuery: {
        page: 1,
        limit: 36, // recommended: 36 (test 4)
        pageSizes: [36] // recommended: 36 (test 4)
      },
      timeout01: null,
      timeout02: null,
      newAucList: [],
      updateAucList: [],
      newAucCount: 0,
      newAucFetching: false,
      percentage: 0,
      percentageShow: false,
      queryChallenge: false,
      gutter: 40,
      elColXS: 12,

      // View Auction Dialog
      VAData: {
        accessories: [],
        rarityInfo: []
      },
      VACPrice: new window.web3.utils.BN(0), // currentPrice for update chart
      dialogVAVisible: false,
      buyButtonLoading: false,
      viewAucFooterWidth: '760',
      rarityBoxHeight: '400px',

      // SortFilters
      showSortFilters: true,
      openSortFilters: false,
      sortFiltersLoading: false,
      query: ''
    }
  },
  created() {
    // this.debug && console.log('created - Auction', window.selectedAccount)
    if (!isConnected([true, true], [false, false])) return // checkChainId, checkWallet
    this.address = window.selectedAccount
    this.queryChallenge = this.$route.query.challenge === 'true'

    window.onSubscribeEvents = this.onSubscribeEvents
    this.appendRunningAuctions(true)
    // this.appendRunningAucServer()
    setTimeout(() => {
      this.percentageShow = true
    }, 1000)
  },
  mounted() {
    // this.debug && console.log('mounted - Auction')
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
  },
  beforeDestroy() {
    // this.debug && console.log('beforeDestroy - Auction')
    this.state = 'beforeDestroy'
    window.onSubscribeEvents = undefined
    clearInterval(this.interval01)
    clearTimeout(this.timeout01)
    clearTimeout(this.timeout02)
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    // @
    handleWindowResize(event) {
      // this.debug && console.log('innerWidth:', window.innerWidth)
      if (window.innerWidth > 420) {
        this.elColXS = 12
      } else {
        this.elColXS = 24
      }

      const cpf = document.getElementById('card-panel-first')
      if (cpf && cpf.clientWidth > 0) {
        this.gutter = (cpf.clientWidth / 150 * 15) - 5
      } else {
        this.gutter = window.innerWidth / 320 * 10
      }
      if (this.gutter > 35) this.gutter = 35
      else if (this.gutter < 10) this.gutter = 10
      // this.debug && console.log('gutter:', this.gutter)
      //
      const w = window.innerWidth
      this.viewAucFooterWidth = w > 800 ? '760' : w - 40
    },

    // RightPanel | Filters -------------------------------------------------------
    rightPanelClick(show) {
      if (show) this.dialogVAVisible = false
    },
    sortFiltersSubmit(query, isChallenge) {
      this.appendRunningAucServer(true, query, isChallenge)
    },
    appendRunningAucServer(newSubmit, newQuery, isChallenge) {
      if (this.sortFiltersLoading) return
      if (this.runningAucLoading) return
      //
      if (!newSubmit && this.queryChallenge) {
        this.query = `challenge=true&address=${this.address}&`
      } else if (newSubmit) {
        if (!isChallenge) {
          const query = Object.assign({}, this.$route.query)
          delete query.challenge
          this.$router.replace({ query })
        }
        this.queryChallenge = isChallenge
      }
      this.openSortFilters = true
      if (isChallenge && !isConnected([true, true], [true, true])) { // checkChainId, checkWallet
        this.$nextTick(() => {
          this.openSortFilters = false // close right-panel
        })
        return
      }
      if (newSubmit) {
        if (isChallenge) newQuery = `${newQuery}address=${this.address}&`
        this.sortFiltersLoading = true
        this.listQuery.page = 1
        this.query = newQuery
      } else {
        this.runningAucLoading = true
      }
      this.debug && console.log('query: ', this.query)
      getVpunks(this.query + 'page=' + this.listQuery.page).then(response => {
        const { data } = response
        if (data.length > 0) {
          this.totalRunningAuc = Number(data[data.length - 1][0])
          if (this.totalRunningAuc <= 0) this.appendRunningAuctions(true) // server bị lỗi thì gọi từ blockchain API
          console.log(data[data.length - 1][2])
        }
        console.log('data', data)
        this.runningAucList = []
        if (data.length > 1) {
          for (let i = 0; i < data.length - 1; i++) {
            const auc1 = {
              seller: data[i][0],
              tokenId: data[i][1],
              startedAt: data[i][2],
              startingPrice: data[i][3],
              endingPrice: data[i][4],
              duration: data[i][5],
              closeWhenTimeout: data[i][6]
            }
            const auc = this.generateAuctionStorage(auc1)
            this.debug && console.log('auc', auc)
            this.runningAucList.push(auc)
          }
        }
        // console.log('response', response)
        // console.log('data', data)
        this.sortFiltersLoading = false
        this.openSortFilters = false
        this.stateBreak += 1
        this.appendRunningAuctionsDone()
      }).catch(error => {
        this.debug && console.log(error)
        this.sortFiltersLoading = false
        this.runningAucLoading = false
        if (!newSubmit) this.appendRunningAuctions(true)
      })
    },
    searchByTokenId(tokenId) {
      this.debug && console.log('searchByTokenId', tokenId)
      if (tokenId.length <= 0) return
      if (tokenId >= 10000) return
      this.sortFiltersLoading = true
      this.openSortFilters = true
      this.$store.getters.instances.ERC721DutchAuctionV1.auctionByTokenId(tokenId).then(result => {
        this.debug && console.log(result)
        if (result.length > 0 && result[0].startedAt !== '0') {
          const auc = this.generateAuctionStorage(result[0])
          this.debug && console.log('auc', auc)
          const index = this.runningAucList.findIndex(obj => { return obj.tokenId === auc.tokenId })
          if (index >= 0) {
            this.runningAucList[index] = auc
          } else {
            this.runningAucList.unshift(auc)
          }
          this.viewAuctionDetails(auc)
          this.openSortFilters = false
        } else {
          this.$alert('This TokenId has no auction', 'Alert', {
            type: 'warning'
          }).catch(() => {})
        }
        this.sortFiltersLoading = false
      }).catch(err => {
        this.debug && console.error(err.message)
        this.sortFiltersLoading = false
      })
    },
    // RightPanel | Filters -------------------------------------------------------

    // Running Auctions -------------------------------------------------------
    // @
    loadPageRunningAuc() {
      this.appendRunningAuctions(true)
      // this.appendRunningAucServer()
    },
    // @
    async getTotalRunningAuc() {
      let total = 0
      const auctionTotalSupply = await this.$store.getters.instances.ERC721DutchAuctionV1.auctionTotalSupply().catch(() => {})
      if (auctionTotalSupply !== undefined) total = auctionTotalSupply.toNumber()
      this.debug && console.log('auctionTotalSupply:', total)
      return total
    },
    // @
    async appendRunningAuctions(getTotal) {
      if (this.runningAucFetching) return
      this.runningAucFetching = true
      this.runningAucLoading = true
      if (getTotal) this.totalRunningAuc = await this.getTotalRunningAuc()
      if (this.totalRunningAuc <= 0) {
        this.runningAucList = []
        this.stateBreak += 1
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
      this.stateBreak += 1
      const _stateBreak = this.stateBreak
      //
      for (let i = start; i <= end; i++) {
        if (indexs.length < this.fetchingStep) indexs.push(i)
        if (indexs.length >= this.fetchingStep || i === end) {
          this.debug && console.log(`auctionByIndex() with indexs: ${indexs}`)
          // console.log('_stateBreakC: ' + _stateBreak, this.stateBreak)
          if (this.state === 'beforeDestroy' || _stateBreak !== this.stateBreak) break
          const result = await this.$store.getters.instances.ERC721DutchAuctionV1.auctionByIndex(indexs[0]).catch(() => {})
          // console.log('_stateBreakD: ' + _stateBreak, this.stateBreak)
          if (this.state === 'beforeDestroy' || _stateBreak !== this.stateBreak) break
          // console.log('result' + i, result)
          indexs = []
          if (result === undefined) continue
          for (let j = 0; j < result.length; j++) {
            if (!result[j].tokenId) continue
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
      this.getTotalStakingByTokenId()
    },

    async getTotalStakingByTokenId() {
      // console.log('----stakeInfo', this.runningAucList.length)
      const _stateBreak = this.stateBreak
      for (let i = 0; i < this.runningAucList.length; i++) {
        // console.log('_stateBreakA: ' + _stateBreak, this.stateBreak)
        if (this.state === 'beforeDestroy' || _stateBreak !== this.stateBreak) break
        const stakeInfo = await this.$store.getters.instances.VPunkStakingV1.stakeByTokenId(this.runningAucList[i].tokenId).catch(() => {})
        // console.log('_stateBreakB: ' + _stateBreak, this.stateBreak)
        if (this.state === 'beforeDestroy' || _stateBreak !== this.stateBreak) break
        // console.log('stakeInfo: ' + i, stakeInfo)
        if (stakeInfo && stakeInfo[7] === true) {
          const vpu = parseInt(window.web3.utils.fromWei(stakeInfo[2], 'ether')) // int vì khi stake cũng chỉ cho nhập int
          this.runningAucList[i].staking = `${vpu}+ VPU`
        } else {
          this.runningAucList[i].staking = ''
        }
      }
      this.$forceUpdate()
    },

    // @
    getAuctionByTokenId(tokenIds, callBack) {
      this.debug && console.log('getAuctionByTokenId-tokenIds:', tokenIds)
      this.$store.getters.instances.ERC721DutchAuctionV1.auctionsByTokenId(tokenIds).then(result => {
        this.debug && console.log(result)
        for (let i = 0; i < result.length; i++) {
          const auc = this.generateAuctionStorage(result[i])
          this.debug && console.log('auc', auc)
          //
          const index = this.runningAucList.findIndex(obj => { return obj.tokenId === auc.tokenId })
          if (index >= 0) {
            this.runningAucList[index] = auc
          } else {
            if (this.runningAucList.length < this.listQuery.limit) this.runningAucList.unshift(auc)
          }
        }
        if (typeof callBack === 'function') callBack()
      }).catch(err => {
        this.debug && console.error(err.message)
        if (typeof callBack === 'function') callBack()
      })
    },
    // @
    generateAuctionStorage(o) {
      const item = punks_1[o.tokenId]
      // if (typeof item.accessories === 'string') item.accessories = item.accessories.split(' / ') tạm k đổi sang array
      let imgId = `000${item.id}`
      imgId = imgId.slice(imgId.length - 4)
      // item.img = `https://www.larvalabs.com/public/images/cryptopunks/punk${imgId}.png`
      item.img = `https://vpunks.com/images/vpunks/punk${imgId}.png`
      const tokenId = o.tokenId.toString()
      item.tokenId = tokenId
      if (!item.rarityInfo) {
        item.rarityInfo = []
        const _item = rarityInfo.items[tokenId]
        for (let j = 0; j < _item.length; j++) {
          // console.log(_item[j], typeof _item[j])
          if (typeof _item[j] === 'number' && rarityInfo.basePropDefs[j].name !== 'Skin Tone') {
            const category_name = rarityInfo.basePropDefs[j].name
            const pvs_name = rarityInfo.basePropDefs[j].pvs[rarityInfo.items[tokenId][j]][0] || '<none>'
            const value = rarityInfo.basePropDefs[j].pvs[rarityInfo.items[tokenId][j]][1]
            let rarity = 10000 / value
            rarity = Math.round(rarity * 100) / 100
            item.rarityInfo.push([category_name, pvs_name, value, rarity])
            // this.debug && console.log(rarity)
            // this.debug && console.log(category_name, pvs_name, value, rarity)
          }
        }
        // this.debug && console.log(item.rarityInfo)
      }
      return {
        seller: o.seller,
        tokenId: o.tokenId,
        startedAt: new window.web3.utils.BN(o.startedAt), // window.web3.utils.toBN('1618369672'),
        startingPrice: new window.web3.utils.BN(o.startingPrice),
        endingPrice: new window.web3.utils.BN(o.endingPrice),
        duration: new window.web3.utils.BN(o.duration),
        closeWhenTimeout: o.closeWhenTimeout,
        currentPrice: new window.web3.utils.BN(o.startingPrice), // toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') (ex: 1234 -> 1,234)
        currentPriceV: '',
        forSell: true,
        owned: (this.address && o.seller.toLowerCase() === this.address.toLowerCase()),
        img: item.img,
        accessories: item.accessories,
        type: item.type,
        rarityScore: item.rarityScore,
        rarityInfo: item.rarityInfo,
        staking: '...'
      }
    },
    // end Running Auctions -------------------------------------------------------

    // end View Auctions -------------------------------------------------------
    // @
    viewAuctionDetails(auc) {
      this.debug && console.log('viewAuctionDetails', auc)
      this.VAData = auc
      const seller = this.VAData.seller
      this.VAData.sellerV = `${seller.slice(0, 6)}...${seller.slice(seller.length - 4)}`
      this.VAData.sellerLink = `${explorerAddress}${seller}`
      this.dialogVAVisible = true
    },
    // @
    handleBidAuc(row) {
      this.debug && console.log('handleBidAuc-row', row)
      if (!isConnected([true, true], [true, true])) return // checkChainId, checkWallet
      if (row.seller && row.seller.toLowerCase() === this.address.toLowerCase()) {
        this.$notify({
          title: 'Error',
          message: 'You cannot bid your auction',
          type: 'error',
          duration: 3000
        })
        return
      }
      this.dialogVAVisible = false
      const auc = Object.assign({}, row) // copy obj
      this.$store.dispatch('auctionCart/addBidItem', auc)
      window.openBidAuc()
    },
    // end View Auctions -------------------------------------------------------

    // @
    getNewAuctions() {
      if (this.newAucCount > 0) {
        this.totalRunningAuc += this.newAucCount
        this.$message({
          message: `There are ${this.newAucCount} new auctions`,
          type: 'success'
        })
        this.newAucCount = 0
      }
      let tokenIds = []
      // updated auctions on the current page
      this.updateAucList = this.updateAucList.filter(tokenId => {
        return this.runningAucList.some(obj => obj.tokenId === tokenId)
      })
      if (this.updateAucList.length > 0) {
        tokenIds = this.updateAucList.slice(0, this.fetchingStep)
        this.updateAucList = this.updateAucList.slice(this.fetchingStep, this.updateAucList.length)
      }
      //
      let canAppend = this.listQuery.limit - this.runningAucList.length
      if (canAppend > 0) {
        const _fetchingStep2 = this.fetchingStep - tokenIds.length
        if (canAppend > _fetchingStep2) canAppend = _fetchingStep2
        if (canAppend > 0 && this.newAucList.length > 0) {
          tokenIds = tokenIds.concat(this.newAucList.slice(0, canAppend))
          this.newAucList = this.newAucList.slice(canAppend, this.newAucList.length)
        }
      } else {
        this.newAucList = []
      }
      //
      if (tokenIds.length <= 0) {
        this.newAucFetching = false
        return
      }
      this.getAuctionByTokenId(tokenIds, () => {
        if (this.newAucList.length > 0 || this.updateAucList.length > 0) {
          this.getNewAuctions()
        } else {
          this.newAucFetching = false
        }
      })
    },
    // @
    aucFetching() {
      if (this.newAucFetching) return
      this.newAucFetching = true
      this.timeout01 = setTimeout(this.getNewAuctions, 1000)
      // clearTimeout(this.timeout01)
    },
    // @
    onEventAuctionCreated(tokenId) {
      if (this.newAucList.indexOf(tokenId) < 0) {
        this.newAucList.push(tokenId)
        this.newAucCount += 1
      }
      this.aucFetching()
    },
    // @
    onEventAuctionUpdated(tokenId) {
      if (this.updateAucList.indexOf(tokenId) < 0) this.updateAucList.push(tokenId)
      this.aucFetching()
    },
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
        this.loadPageRunningAuc()
      }
    },
    // @
    onSubscribeEvents(event) {
      const tokenId = event.returnValues.tokenId
      // this.debug && console.log('event------', event.event, 'tokenId-----', tokenId)
      if (event.event === 'AuctionCreated') {
        this.onEventAuctionCreated(tokenId)
      } else if (event.event === 'AuctionUpdated') {
        this.onEventAuctionUpdated(tokenId)
      } else if (event.event === 'AuctionCancelled' || event.event === 'AuctionSuccessful') {
        this.onEventAuctionSuccessful(tokenId)
      }
    },

    // @
    currentPriceCalculator() {
      this.percentage = 100
      clearTimeout(this.timeout02)
      this.timeout02 = setTimeout(() => {
        this.percentage = 0
      }, 500)
      //
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
        auctions[i].forSell = forSell
        // update currentPrice on Dialog View Auction
        if (this.VAData.tokenId === auctions[i].tokenId) {
          this.VACPrice = auctions[i].currentPrice
        }
        // if (!forSell) this.runningAucList.splice(i, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.auction-container {
  .notify {
    padding: 5px 0 5px 10px;
    font-size: 18px;
    text-align: center;
    line-height: 40px;
    color: #690375;
    background: #f6f0ff;
    font-weight: 500;
  }
  .auction-details {
    width: 300px;
    float: left;
  }
  .auc-details-label {
    padding-bottom: 5px;
  }
  .auc-details-value {
    padding-bottom: 15px;
  }
  .chart-container {
    position: relative;
    width: 440px;
    float: left;
    margin: -40px 0 0 20px;
  }
  .success {
    color:#13ce66;
  }
  .el-icon-alarm-clock {
    color:red;
  }
  .progress {
    position: fixed;
    top: 65px;
    right: -300px;
    z-index: 999;
  }
  .progress2 {
    right: 10px;
  }
}

// Dialog View Auction
.auction-dialog-body {
  display: flex;
  flex-wrap: wrap;
  .rarity-box {
    height: 600px;
    margin: 0 auto;
    color: #fff;
    background: #f5f5f5;
    overflow-y: auto;
    .rarity-mc {
      padding: 5px 10px;
    }
    .padding4 {
      border-radius: 4px;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
    }
    .rarity-total {
      text-align: center;
      background: #be185d;
      font-weight: 500;
      font-size: 15px;
      padding: 5px;
      border-radius: 6px;
      -webkit-border-radius: 6px;
      -moz-border-radius: 6px;
    }
    .rarity-total2 {
      padding: 5px;
      color: #10b981;
      background: #fff;
      font-size: 17px;
      font-weight: 800;
      margin: 5px 0;
    }
    .rarity-total3 {
      padding: 4px 5px;
    }
    .rarity-total4 {
      padding: 3px;
      font-size: 14px;
      font-weight: 500;
      color: #db2777;
      span {
        float: right;
        color: #10b981;
        font-size: 15px;
      }
    }
    .rarity-total5 {
      background: #9ca3af;
      line-height: 20px;
      padding: 3px 5px;
      span {
        float: right;
        background: #fff;
        font-size: 13px;
        color: #9ca3af;
        padding: 0 5px;
        border-radius: 2px;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
      }
    }
  }
}
// end Dialog View Auction

.panel-group {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 100%;
    padding: 6px 5px;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .1);
    border-color: rgba(0, 0, 0, .05);
    .card-staking {
      position: absolute;
      top:6px;
      right: 5px;
      padding: 5px 10px;
      background-color: #04271399;
      color: #ffff88;
      border-radius: 0 0 0 8px;
      -webkit-border-radius: 0 0 0 8px;
      -moz-border-radius: 0 0 0 8px;
      font-size: 12px;
      font-weight: 500;
    }
    .card-panel-icon-wrapper {
      height: 200px;
      text-align: center;
      background: #ba9ce1;
    }
    .icon-wrapper-end {
      background: #c8c6e0;
    }

    .card-panel-icon {
      height: 100%;
      image-rendering: pixelated;
    }

    .card-panel-description {
      font-weight: bold;
      margin: 15px 5px 10px 5px;

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
      .card-panel-price {
        color:#53A7FF;
        font-weight: 500;
        line-height: 20px;
        display: flex;
        img {
          width: 20px;
          height: 20px;
          margin: 0 5px 0 -3px;
        }
      }
      .card-panel-warning {
        color:#ff0000;
        font-weight: 500;
        line-height: 20px;
      }
    }
    .card-panel-footer {
      clear: both;
      text-align: center;
    }
    .card-panel-footer .el-button {
      margin-top: 8px;
    }
  }
}
</style>
