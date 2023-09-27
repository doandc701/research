<template>
  <div v-loading="runningAucLoading" class="auction-container">
    <el-progress class="progress" :class="{'progress2':percentageShow}" type="circle" :percentage="percentage" :show-text="false" :width="30" :stroke-width="4" />
    <!--<div class="notify">This feature is coming soon.<br>
      <a href="/local-demo/#/auctions/index" target="_blank" rel="noopener">
        <el-button type="primary" size="medium" plain round>Demo</el-button>
      </a>
    </div>-->
    <!--<div class="notify">If the duplicate issue is not resolved please switch to the "Connex Auctions" tab</div>-->
    <!-- Current Auctions -->
    <h3 class="app-con-title">Current Auctions</h3>
    <!-- SortFill -->
    <sort-filters :loading="sortFiltersLoading" :location="collection.default" @sortFiltersSubmit="sortFiltersSubmit" />
    <el-row :gutter="gutter" class="panel-group">
      <el-col v-for="(item, index) of runningAucList" :key="item.tokenId" :xs="elColXS" :sm="8" :lg="5" :xl="3" class="card-panel-col">
        <div :id="index===0&&'card-panel-first'" class="card-panel">
          <div v-if="item.staking" class="card-staking">{{ item.staking }}</div>
          <div class="card-panel-icon-wrapper" :class="(item.owned||!item.forSell)&&'icon-wrapper-end'" @click="viewAuctionDetails(item)">
            <el-image :src="item.img" class="card-panel-icon" fit="contain" lazy>
              <div slot="placeholder" class="image-slot">
                <i class="el-icon-loading" />
              </div>
            </el-image>
          </div>

          <div class="card-panel-description">
            <el-row :gutter="20">
              <el-col :span="14"><div class="card-panel-text">VPunks OG</div></el-col>
              <el-col :span="6"><div class="price-text">Price</div></el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="14"><div class="tokenId-line">#{{ item.tokenId }}</div></el-col>
              <el-col :span="6">
                <div v-if="item.owned&&!item.forSell" class="card-panel-warning">Auction end</div>
                <div v-else class="card-panel-price">
                  <div>{{ item.currentPriceV }}</div>
                  <img src="@/assets/tokens-symbol/vet.svg">
                </div>
                <!--  -->
              </el-col>
            </el-row>
          </div>

          <div class="card-panel-footer">
            <el-button v-if="item.closeWhenTimeout" size="small" class="view-with-clock" @click.native.prevent="viewAuctionDetails(item)">View <i class="el-icon-alarm-clock" /></el-button>
            <el-button v-else size="small" class="btn-view-details" @click.native.prevent="viewAuctionDetails(item)">View details</el-button>
            <el-button v-if="!item.owned&&!item.forSell" size="small" disabled>End</el-button>
            <el-button v-else-if="item.owned" type="primary" size="small" disabled>Owned</el-button>
            <el-button v-else size="small" type="success" class="btn-buy" @click="handleBidAuc(item)">Buy</el-button>
          </div>
          <hr>
          <div class="card-panel-tags">
            <el-tag effect="plain" class="tagName">VIP-181</el-tag>
            <el-tag effect="plain" class="tagName" style="position: relative; left: 5px;">Rank: {{ item.rank }}</el-tag>
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
          <div class="auc-details-value">
            <b :class="VAData.status | statusFilter">{{ VAData.currentPrice | fromWei }}</b> {{ nativeToken }}
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
            <el-link type="primary" :href="VAData.sellerLink" target="_blank" style="display: inline;">{{ VAData.sellerV }}</el-link>
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

    <!-- <right-panel v-if="showSortFilters" :button-top="100" :open="openSortFilters" :loading="sortFiltersLoading" @handleBtnClick="rightPanelClick">
      <SortFilters :loading="sortFiltersLoading" @searchByTokenId="searchByTokenId" @sortFiltersSubmit="sortFiltersSubmit" />
    </right-panel> -->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Chart from '@/components/Charts/Line'
import { isConnected } from '@/utils/validate'
import { nativeToken, explorerAddress } from '@/settings'
// import { parseErrorMessage } from '@/utils/error-message-parse'
import SortFilters from '@/components/SortFilters'
import { getVpunks } from '@/api/user'
import punks_1 from '@/punks/0-9999-v3.json'
import rarityInfo from '@/punks/rarity-info.json'

export default {
  name: 'Auctions',
  components: {
    Pagination,
    Chart,
    SortFilters
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
      urlQueryPage: 1,
      timeout01: null,
      timeout02: null,
      newAucList: [],
      updateAucList: [],
      newAucCount: 0,
      newAucFetching: false,
      percentage: 0,
      percentageShow: false,
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
      // showSortFilters: true,
      // openSortFilters: false,
      sortFiltersLoading: false,
      query: '',
      collection: {
        // nhận 2 giá trị : location and market
        default: 'market'
      }
    }
  },
  created() {
    // this.debug && console.log('created - Auction', window.selectedAccount)
    if (!isConnected([true, true], [false, false])) return // checkChainId, checkWallet
    this.address = window.selectedAccount

    this.urlQueryPage = parseInt(this.$route.query.page, 10)
    if (this.urlQueryPage > 0 && this.urlQueryPage !== this.listQuery.page) this.listQuery.page = this.urlQueryPage

    window.onSubscribeEvents = this.onSubscribeEvents
    // this.appendRunningAuctions(true)
    this.appendRunningAucServer()
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
    sortFiltersSubmit(queryString) {
      this.appendRunningAucServer(true, queryString)
    },
    appendRunningAucServer(newSubmit, newQuery) {
      if (this.sortFiltersLoading) return
      if (this.runningAucLoading) return
      //
      this.openSortFilters = true
      if (newSubmit) {
        this.sortFiltersLoading = true
        this.listQuery.page = 1
        this.query = newQuery
        if (this.listQuery.page !== this.urlQueryPage) {
          this.urlQueryPage = this.listQuery.page
          this.$router.replace({ name: this.$router.history.current.name, query: { page: this.listQuery.page }})
        }
      } else {
        this.runningAucLoading = true
      }
      this.debug && console.log('query: ', this.query)
      getVpunks(this.query + 'page=' + this.listQuery.page).then(response => {
        const { data } = response
        if (data.length > 0) {
          this.totalRunningAuc = Number(data[data.length - 1][0])
          if (this.totalRunningAuc <= 0) this.appendRunningAuctions(true) // server bị lỗi thì gọi từ blockchain API
          console.log(data[data.length - 1][2], data[data.length - 1][3])
        }
        // console.log('data', data)
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
      // this.appendRunningAuctions(true)
      this.appendRunningAucServer()
      if (this.listQuery.page !== this.urlQueryPage) {
        this.urlQueryPage = this.listQuery.page
        this.$router.replace({ name: this.$router.history.current.name, query: { page: this.listQuery.page }})
      }
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
        // console.log(item)
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
        staking: '...',
        rank: item.rank
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
// Hưng
hr {
  border: none;
  height: 1px;
  background: #2e3670;
}
.tagName {
  background-color: #202440 ;
  border: 1px solid #606BBF;
  border-radius: 16px;
  color: #fff;
  // padding: 0px 10px;
}
.price-text {
  color: #CCCCCC;
  position: absolute;
  right: 10px;
}
.tokenId-line {
  font-size: 14px;
  color: #ebebeb;
  width: 90px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
//
.auction-container {
  padding: 30px 20px 150px 20px;
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
    color:#10e66f;
  }
  .el-icon-alarm-clock {
    color:red;
    animation: blinker 0.4s linear infinite;
    // vertical-align: middle;
    @keyframes blinker {
      50% {
        opacity: 0.7;
      }
    }
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
      font-size: 16px;
      padding: 5px;
      border-radius: 6px;
      -webkit-border-radius: 6px;
      -moz-border-radius: 6px;
    }
    .rarity-total2 {
      padding: 5px;
      color: #10b981;
      background: #fff;
      font-size: 18px;
      font-weight: 800;
      margin: 5px 0;
    }
    .rarity-total3 {
      padding: 4px 5px;
    }
    .rarity-total4 {
      padding: 3px;
      font-size: 15px;
      font-weight: 500;
      color: #db2777;
      span {
        float: right;
        color: #10b981;
        font-size: 16px;
      }
    }
    .rarity-total5 {
      background: #3a65af;
      line-height: 20px;
      padding: 3px 5px;
      span {
        float: right;
        background: #234693;
        font-size: 14px;
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
  justify-content: center;
  // justify-content: flex-start;

  .card-panel-col {
    margin-bottom: 32px;
    max-width: 206px;
    min-width: 192px;
  }

  .card-panel {
    // height: 100%;
    width: 100%;
    min-width: 192px;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    background: #202440; // #323f6f
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .2);
    border-color: rgba(0, 0, 0, .05);
    border-radius: 16px;
    .card-staking {
      position: absolute;
      right: 0;
      padding: 5px 10px;
      background-color: #04271399;
      color: #ffff88;
      border-radius: 0 0 0 8px;
      -webkit-border-radius: 0 10px 0 8px;
      -moz-border-radius: 0 0 0 8px;
      font-size: 12px;
      font-weight: 500;
    }
    .card-panel-icon-wrapper {
      height: 190px;
      text-align: center;
      background: #709dd1;
      overflow: hidden;
      cursor: pointer;
      &:hover {
       background: #85b1e4;
      }
    }
    .icon-wrapper-end {
      background: #615ca6;
    }
    .card-panel-acces {
      margin: 4px 4px 0 0;
      padding: .4em .6em;
      background-color: rgba(85, 140, 63, 1);
      color: #fff;
      word-wrap: break-word;
      white-space: nowrap;
      display: inline-block;
      border-radius: .5rem;
      -webkit-border-radius: .5rem;
      -moz-border-radius: .5rem;
    }

    .card-panel-icon {
      width: 100%;
      height: 100%;
      image-rendering: pixelated;
      transition: transform .5s ease;
      ::v-deep .el-image__inner {
        object-position: bottom;
      }
      &:hover {
        transform: scale(1.2);
        transition: transform .5s ease;
      }
    }

    .card-panel-description {
      font-weight: bold;
      margin: 15px 10px 10px 10px;

      .card-panel-text {
        // line-height: 18px;
        color: #CCCCCC;
        font-size: 15px;
        margin-bottom: 5px;
        width: 140px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .card-panel-price {
        div {
          color:#53A7FF;
          font-weight: 500;
          position: absolute;
          width: 100px;
          right: 25px;
          text-align: right;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          // line-height: 20px;
          // display: flex;
        }
        img {
          width: 14px;
          height: 14px;
          position: absolute;
          top: 0px;
          right: 7px;
        }
      }
      .card-panel-warning {
        color:#ff0000;
        font-weight: 500;
        line-height: 20px;
        width: 85px;
        position: absolute;
        left: 110px;
      }
    }
    .card-panel-footer {
      clear: both;
      text-align: center;
      .el-button {
        margin-top: 8px;
      }
      .el-button--small {
        border-radius: 8px;
      }
      .view-with-clock {
        background: #202440;
        color: #fff;
        border-color: rgba(85, 140, 63, 1);
        &:hover {
          border-color: rgb(118, 225, 76);
          transition: transform .5s ease-in-out;
        }
      }
      .btn-view-details {
        background-color: #202440;
        border-color: rgba(85, 140, 63, 1);
        color: #fff;
        &:hover {
          border-color: #77c159;
        }
      }
      .btn-buy {
        background-color: rgba(85, 140, 63, 1);
        border: none;
        &:hover {
          background-color: #77c159;
        }
      }
    }
    .card-panel-tags {
      padding: 0 5px 10px 5px;
    }
  }
}
// responsive
@media screen and (max-width: 660px) {
  .panel-group {
    .card-panel-col {
      margin-bottom: 22px !important;
      margin-bottom: 32px;
      max-width: 370px;
      min-width: 191px;
    }
  }
}
@media screen and (max-width: 415) {
.panel-group {
    .card-panel-col {
      padding-left: 5px !important;
      padding-right: 5px !important;
      margin-bottom: 20px !important;
      max-width: 380px;
      min-width: 190px;
    }
  }
}
</style>
