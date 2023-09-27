<template>
  <div>
    <!-- Your NFTs -->
    <div v-loading="yourNFTLoading" class="account-nfts-container">
      <h3 class="app-con-title">Your NFTs</h3>
      <el-button size="mini" round class="transfer-btn" @click="openTransferTokens()">
        <img src="@/assets/icons/transfer-3787.svg" alt="transfer"><br>Transfer
      </el-button>

      <!-- Sort, Filters -->
      <sort-filters :loading="sortFiltersLoading" :location="collection.default" @sortFiltersSubmit="sortFiltersSubmit" />

      <el-row :gutter="gutter" class="panel-group">
        <el-col v-for="(item, index) of yourNFTList" :key="item.tokenId" :xs="elColXS" :sm="8" :lg="6" :xl="4" class="card-panel-col">
          <div :id="index===0&&'card-panel-first'" class="card-panel">
            <div class="card-panel-icon-wrapper" @click="viewItemDetails(item, false)">
              <img :src="item.img" class="card-panel-icon">
            </div>
            <div v-if="item.stakingSummary" class="card-staking">{{ item.stakingSummary }}</div>

            <div class="card-panel-description">
              <el-row :gutter="20">
                <el-col :span="14"><div class="card-panel-text">VPunks OG</div></el-col>
                <el-col :span="6"><div class="price-text">High offer</div></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="14"><div class="tokenId-line">#{{ item.tokenId }}</div></el-col>
                <el-col :span="6">
                  <div v-if="item.owned&&!item.forSell" class="card-panel-warning">Auction end</div>
                  <div v-else class="card-panel-price">
                    <div>--</div>
                    <img src="@/assets/tokens-symbol/vet.svg">
                  </div>
                </el-col>
              </el-row>
            </div>

            <div class="card-panel-footer">
              <el-button size="small" style="background-color: #202440; border-color: rgba(85, 140, 63, 1); color: #fff; border-radius: 8px;" @click.native.prevent="viewItemDetails(item, false)">View details</el-button>
              <el-button type="success" size="small" style="background-color: rgba(85, 140, 63, 1); border: none; border-radius: 8px;" @click="handleCreateAuc(item.tokenId)">Sell</el-button>
            </div>
            <hr>
            <div class="card-panel-tags">
              <el-tag effect="plain" class="tagName">VIP-181</el-tag>
              <el-tag effect="plain" class="tagName" style="position: relative; left: 5px;">Rank: {{ item.rank }}</el-tag>
            </div>
          </div>
        </el-col>
      </el-row>
      <div v-if="yourNFTList.length===0" style="text-align:center;font-size:14px;"><span class="el-table__empty-text">{{ yourNFTLoading ? "Loading..." : "No items to display" }}</span></div>
      <pagination v-show="totalNFT>0" :total="totalNFT" :page.sync="NFTQuery.page" :limit.sync="NFTQuery.limit" :page-sizes="NFTQuery.pageSizes" @pagination="loadPageYourNFT" />
    </div>
    <!-- end: Your NFTs -->

    <!-- Buy more -->
    <div class="buy-more-container">
      <h3 style="margin: 30px 0 20px 0;">Buy more VPunks</h3>
      <router-link to="/auctions/index">
        <el-button class="btn-share" type="success"><svg-icon icon-class="shop" style="vertical-align: bottom" /> Visit the Marketplace</el-button>
      </router-link>
    </div>
    <!-- end: Buy more -->

    <!-- Dialog View NFT -->
    <el-dialog v-loading="dialogVNFTLoading" :visible.sync="dialogVNFTVisible" title="NFT Details" width="640px">
      <div class="nft-details-container">
        <div class="auction-details">
          <h2 style="margin-top:-10px">VPunk {{ VNFTData.tokenId }}</h2>
          <div class="panel-group">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper">
                <img :src="VNFTData.img" class="card-panel-icon" @load="onImgLoad">
                <span v-show="imgLoading" class="loading-box01"><i class="el-icon-loading" /></span>
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
          <el-tabs v-model="viewNFTTabActiveName" @tab-click="viewNFTTabClick">
            <el-tab-pane label="Staking" name="staking">
              <div v-if="tokenIdStakeInfo.startedAt > 0">
                <h3 class="app-con-title" style="text-align:center;">Staking Pool <b style="font-size:24px;">{{ tokenIdStakeInfo.poolId }}</b></h3>
                <div style="text-align:center;padding-top:20px;">
                  <div class="auc-details-label"><b>APY: </b><b style="color:rgb(6 189 87);font-size:20px;">{{ tokenIdStakeInfo.apy }}</b></div>
                  <div class="auc-details-label"><b>Staking amount: </b><span style="color: #1890ff;">{{ tokenIdStakeInfo.stakeAmount }} VPU</span></div>
                  <div class="auc-details-label"><b>Your rewards: </b><span style="color: #1890ff;">{{ tokenIdStakeInfo.rewardStored }} VPU</span></div>
                  <div class="auc-details-label"><b>Duration: </b>?/{{ tokenIdStakeInfo.duration }} hour</div>
                  <div class="auc-details-label"><b>Link stake with NFT: </b>{{ tokenIdStakeInfo.linkToNFT }}</div>
                  <div style="text-align:center;padding-top:30px;">
                    <el-button type="primary" icon="el-icon-wallet" @click="withdrawStaking(VNFTData.tokenId)">Withdraw</el-button>
                  </div>
                </div>
              </div>
              <div v-else>
                <h3 class="app-con-title" style="text-align:center;">Staking Pool <b style="font-size:24px;">{{ VNFTData.stakingPoolId }}</b></h3>
                <div style="text-align:center;padding-top:20px;">
                  <div class="auc-details-label"><b>APY: </b><b style="color:rgb(6 189 87);font-size:20px;">26%</b></div>
                  <div class="auc-details-label"><b>Total commitment reward: </b><span style="color: #1890ff;">1M VPU</span></div>
                  <div class="auc-details-label"><b>Minimum stake per VPunks: </b><span style="color: #1890ff;">200 VPU</span></div>
                  <div class="auc-details-label"><b>Maximum stake per VPunks: </b><span style="color: #1890ff;">10,000 VPU</span></div>
                  <div class="auc-details-label"><b>Minimum duration: </b>1 hour</div>
                  <div class="auc-details-label"><b>Maximum duration: </b>2,160 hour</div>
                  <div style="text-align:center;padding-top:30px;">
                    <!--Staking pool is full-->
                    <el-button type="primary" icon="el-icon-wallet" @click="handleStaking(VNFTData.tokenId, VNFTData.stakingPoolId)">Staking</el-button>
                  </div>
                </div>
              </div>
              <p v-if="!VNFTData.stakingChecked" class="loading-box02"><i class="el-icon-loading" /></p>
            </el-tab-pane>
            <el-tab-pane label="Rarity" name="rarity">
              <div class="rarity-box" :style="{ height: rarityBoxHeight }">
                <div class="rarity-mc">
                  <div class="rarity-total">
                    Rarity Score
                    <div class="rarity-total2 padding4">{{ VNFTData.rarityScore }}</div>
                  </div>
                  <div style="margin: 20px 0;">
                    <div v-for="(item) of VNFTData.rarityInfo" :key="item[0]" class="rarity-total3">
                      <div class="rarity-total4">{{ item[0] }} <span>+{{ item[3] }}</span></div>
                      <div class="rarity-total5 padding4">{{ item[1] }} <span>{{ item[2] }}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>

        </div>
      </div>
      <span slot="footer">
        <div :style="{ width: viewNFTFooterWidth + 'px' }">
          <el-button type="success" @click="handleCreateAuc(VNFTData.tokenId)">Sell</el-button>
          <el-button @click="dialogVNFTVisible = false">Close</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- end: Dialog View NFT -->

    <!-- Dialog Transfer Tokens -->
    <el-dialog v-loading="dialogTransferLoading" :visible.sync="dialogTransferVisible" :width="dialogTransferWidth" :class="{ deviceMini: (deviceSize !== 'medium') }" append-to-body>
      <div slot="title">
        <span style="padding-right: 10px;">Transfer Tokens</span>
        <el-button size="mini" type="primary" icon="el-icon-delete" @click="clearTransferTokens">Clear All</el-button>
      </div>
      <el-table :size="deviceSize" :data="transferTokens" border fit highlight-current-row>
        <el-table-column align="center" label="TokenId" min-width="70">
          <template slot-scope="{row}">
            <el-input v-model="row.tokenId" placeholder="tokenId" class="trans-input" :class="{'is-error': row.tokenIdErr}" :size="deviceSize" @blur="handleNumOfTransfer()" />
          </template>
        </el-table-column>

        <el-table-column align="center" label="Recipient Address" min-width="170">
          <template slot-scope="{row}">
            <el-input v-model="row.recipient" placeholder="recipient address" class="trans-input" :class="{'is-error': row.recipientErr}" :size="deviceSize" @blur="handleNumOfTransfer()" />
          </template>
        </el-table-column>

        <el-table-column label="Ac" align="center" width="50px" class-name="small-padding fixed-width">
          <template slot-scope="{$index}">
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

    <!-- Dialog Staking -->
    <el-dialog v-loading="dialogStakingLoading" :visible.sync="dialogStakingVisible" title="Staking VPunk & VPU" :width="dialogStakingWidth" append-to-body>
      <el-form ref="stakingForm" :rules="rules" :model="tempStaking" label-position="left" label-width="170px" :style="{margin: stakingFormMargin}">
        <el-form-item label="TokenId">
          <el-tag effect="plain" style="font-size: 18px;">{{ tempStaking.tokenId }}</el-tag>
        </el-form-item>
        <el-form-item label="Staking amount" prop="stakingAmount">
          <el-input v-model="tempStaking.stakingAmount" placeholder="in VPU">
            <template slot="append">VPU</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Duration" prop="duration">
          <el-input v-model="tempStaking.duration" placeholder="in Hours">
            <template slot="append">Hours</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Link stake with NFT">
          <el-switch v-model="tempStaking.linkToNFT" />
          <p style="color:#ff0000;word-break: break-word;line-height: 120%">{{ tempStaking.linkToNFT ? stakingWr2 : stakingWr1 }}</p>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submitStaking()">Submit</el-button>
        <el-button @click="dialogStakingVisible = false">Cancel</el-button>
      </span>
    </el-dialog>
    <!-- end: Dialog Staking -->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import SortFilters from '@/components/SortFilters'
import { nativeToken, explorerTx } from '@/settings'
import { isConnected } from '@/utils/validate'
import { getVpunks } from '@/api/user'
// import punks_1 from '@/punks/0-9999.json'
import punks_1 from '@/punks/0-9999-v3.json'
import rarityInfo from '@/punks/rarity-info.json'

const defaultTempStaking = {
  tokenId: '',
  stakingAmount: '',
  duration: '',
  linkToNFT: false,
  poolId: '1'
}

export default {
  name: 'YourNFTs',
  components: { Pagination, SortFilters },
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
    const validateStakingAmount = (rule, value, callback) => {
      if (value === '') return callback(new Error('Staking amount is required'))
      try {
        let _value = parseInt(value)
        if (isNaN(_value)) {
          _value = ''
        } else if (_value < 200) {
          _value = 200
        } else if (_value > 10000) {
          _value = 10000
        }
        this.tempStaking.stakingAmount = _value
        return callback()
      } catch (error) {
        // console.log(error)
        return callback(new Error('invalid number value'))
      }
    }
    const validateDuration = (rule, value, callback) => {
      if (value === '') return callback(new Error('Duration is required'))
      try {
        let _value = parseInt(value)
        if (isNaN(_value)) {
          _value = ''
        } else if (_value < 1) {
          _value = 1
        } else if (_value > 2160) {
          _value = 2160
        }
        this.tempStaking.duration = _value
        return callback()
      } catch (error) {
        // console.log(error)
        return callback(new Error('invalid number value'))
      }
    }
    return {
      // general
      debug: false,
      state: '',
      address: null,
      nativeToken: nativeToken,
      deviceSize: 'medium', // medium / small / mini

      // Your NFTs
      yourNFTList: [],
      yourNFTLoading: false,
      yourNFTFetching: false,
      totalNFT: 0,
      yourNFTMaxShow: 36, // recommended: 36 (pageSizes*1.5) (test 6)
      // yourNFTMinShow: 1, // recommended: 1 (test 1)
      NFTQuery: {
        page: 1,
        limit: 24, // recommended: 24 (test 4)
        pageSizes: [24] // recommended: 24 (test 4)
      },
      gutter: 40,
      elColXS: 12,

      // Dialog View NFT
      dialogVNFTVisible: false,
      dialogVNFTLoading: false,
      VNFTData: {
        accessories: [],
        rarityInfo: []
      },
      imgLoading: false,
      viewNFTTabActiveName: 'staking',
      viewNFTFooterWidth: '760',
      rarityBoxHeight: '400px',

      // Dialog Transfer Tokens
      transferTokens: [],
      dialogTransferVisible: false,
      dialogTransferLoading: false,
      dialogTransferWidth: '90%',
      transferMax: 10,

      // Dialog Staking
      dialogStakingVisible: false,
      dialogStakingLoading: false,
      tempStaking: Object.assign({}, defaultTempStaking), // copy obj
      dialogStakingWidth: '90%',
      stakingFormMargin: '0 50px',
      rules: {
        stakingAmount: [{ required: true, trigger: 'blur', validator: validateStakingAmount }],
        duration: [{ required: true, trigger: 'blur', validator: validateDuration }]
      },
      stakingWr1: ' You will have to claim the reward before transferring VPunk to someone else, the staking amount always belongs to you.',
      stakingWr2: ' Your stake will belong to the owner of VPunk if you transfer VPunk to someone.',
      tokenIdStakeInfo: {},

      // SortFilters
      sortFiltersLoading: false,
      query: '',
      collection: {
        // nhận 2 giá trị : location and market
        default: 'market'
      }

    }
  },
  created() {
    this.debug && console.log('created - YourNFTs', window.selectedAccount)
    if (!isConnected([true, true], [true, true])) {
      return
    }
    this.address = window.selectedAccount
    this.address = '0x0854aBd19a87E8f62e6aa1463e0120C1F862639A' // test

    window.createAuctionDone = this.createAuctionDone
    window.cancelAuctionDone = this.cancelAuctionDone
    window.bidAuctionDone = this.bidAuctionDone
    // window.onSubscribeEvents = this.onSubscribeEvents // not working on VeChain
    this.appendYourNFT(true)
    // this.appendRunningAucServer(false, '')
  },
  mounted() {
    this.debug && console.log('mounted - YourNFTs')
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
  },
  beforeDestroy() {
    this.debug && console.log('beforeDestroy - YourNFTs')
    this.state = 'beforeDestroy'
    window.createAuctionDone = undefined
    window.cancelAuctionDone = undefined
    window.bidAuctionDone = undefined
    // window.onSubscribeEvents = undefined // not working on VeChain
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

      const w = window.innerWidth
      // dialog viewNFT
      this.viewNFTFooterWidth = w > 640 ? (640 - 40) : (w - 40)

      // dialog Transfer
      this.dialogTransferWidth = w > 800 ? '90%' : (w > 320 ? '100%' : '320px')
      // this.deviceSize = w > 800 ? 'medium' : (w > 500 ? 'small' : 'mini')
      this.deviceSize = w > 500 ? 'small' : 'mini'

      // dialog Staking
      this.dialogStakingWidth = w > 800 ? '800px' : (w > 340 ? '100%' : '340px')
      this.stakingFormMargin = w > 800 ? '0 50px' : (w > 600 ? '0 10px' : (w > 370 ? '0' : '0 -10px'))
    },

    // Staking -----------------------------------------------
    // @
    handleStaking(tokenId, poolId) {
      this.debug && console.log('handleStaking-tokenId: ' + tokenId, 'poolId: ' + poolId)
      if (this.tempStaking.tokenId !== '' && this.tempStaking.tokenId !== tokenId) {
        this.tempStaking = Object.assign({}, defaultTempStaking) // copy obj
      }
      this.tempStaking.tokenId = tokenId
      this.tempStaking.poolId = poolId
      this.dialogStakingVisible = true
    },
    //
    async withdrawStaking(tokenId) {
      const currTimestamp = Math.floor(Date.now() / 1000)
      const duration = Number(this.tokenIdStakeInfo.duration) * 3600
      const startedAt = Number(this.tokenIdStakeInfo.startedAt)
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

      this.dialogVNFTLoading = true
      const stakeInfo = await this.$store.getters.instances.VPunkStakingV1.stakeInfoByTokenId(tokenId).catch(() => {})
      this.debug && console.log('stakeInfo', stakeInfo)
      if (!stakeInfo) {
        this.withdrawStakingDone()
        return
      }
      this.$store.getters.instances.VPunkStakingV1.exitByStakeId(stakeInfo[0], stakeInfo[1], { from: this.address }).then(async result => {
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
      }).catch(err => {
        this.debug && console.error(err.message)
        this.dialogVNFTLoading = false
      })
    },
    withdrawStakingDone() {
      this.dialogVNFTLoading = false
    },
    //
    submitStaking() {
      this.debug && console.log('submitStaking-tempStaking', this.tempStaking)
      this.$refs['stakingForm'].validate(valid => {
        if (valid) {
          this.startCreateStake()
        }
      })
    },
    async startCreateStake() {
      this.debug && console.log('startCreateStake', this.tempStaking)
      this.dialogStakingLoading = true
      const tokenId = this.tempStaking.tokenId
      const amount = window.web3.utils.toWei(String(this.tempStaking.stakingAmount), 'ether')
      const duration = String(this.tempStaking.duration)
      const linkNFT = this.tempStaking.linkToNFT
      const poolId = this.tempStaking.poolId

      const stakingV1Address = this.$store.getters.instances.VPunkStakingV1.address
      const approveClause = await this.$store.getters.instances.VPUContract.approve(stakingV1Address, amount, { getClause: true })
      const stakeClause = await this.$store.getters.instances.VPunkStakingV1.stake(tokenId, poolId, amount, duration, linkNFT, { getClause: true })
      const allClause = approveClause.concat(stakeClause)
      this.debug && console.log('approveClause', approveClause)
      this.debug && console.log('stakeClause', stakeClause)
      this.debug && console.log('allClause', allClause)
      window.VeChainThor.callWithClauses(allClause, this.address).then(async result => {
        this.debug && console.log('callWithClauses-result', result)
        const txHash = result.txid
        const transaction = await window.VeChainThor.waitTxReceipt(txHash)
        this.debug && console.log('transaction-result', transaction)
        const htmlStr = `transaction: <a href="${explorerTx}${txHash}" target="_blank" style="color:#53A7FF;word-break:break-all">${txHash}</a>`
        this.$alert(htmlStr, !transaction.reverted ? 'Successful transaction' : 'Transaction was reverted', {
          type: !transaction.reverted ? 'success' : 'error',
          dangerouslyUseHTMLString: true
        }).catch(() => {})
        //
        this.checkStakeByTokenId(tokenId)
      }).catch(err => {
        this.debug && console.error(err.message)
        this.dialogStakingLoading = false
        this.dialogStakingVisible = false
      })
    },

    //
    async checkStakeByTokenId(tokenId) {
      const stakeData = await this.$store.getters.instances.VPunkStakingV1.stakeByTokenId(tokenId).catch(() => {})
      this.debug && console.log('stakeData', stakeData)
      if (stakeData) {
        const stakeInfo = await this.$store.getters.instances.VPunkStakingV1.stakeInfoByTokenId(tokenId).catch(() => {})
        // console.log('stakeInfo', stakeInfo)
        this.tokenIdStakeInfo = {
          tokenId: stakeData[0],
          startedAt: (stakeData[6] === this.address || stakeData[7]) ? stakeData[1] : '0',
          stakeAmount: window.web3.utils.fromWei(stakeData[2], 'ether'),
          rewardStored: window.web3.utils.fromWei(stakeData[3], 'ether'),
          rewardWithdrawn: stakeData[4],
          duration: stakeData[5],
          account: stakeData[6],
          linkToNFT: stakeData[7],
          poolId: (stakeInfo) ? stakeInfo[0] : '?',
          apy: '?'
        }
        if (stakeInfo && stakeInfo[0] === '1') this.tokenIdStakeInfo.apy = '30%'
        if (stakeInfo && stakeInfo[0] === '2') this.tokenIdStakeInfo.apy = '26%'
        //
        this.VNFTData.stakingChecked = true
      }
      //
      this.dialogStakingVisible = false
      this.dialogStakingLoading = false
    },

    // @
    async getTotalStakingByTokenId() {
      // console.log('----stakeData', this.yourNFTList.length)
      for (let i = 0; i < this.yourNFTList.length; i++) {
        if (this.state === 'beforeDestroy') break
        const stakeData = await this.$store.getters.instances.VPunkStakingV1.stakeByTokenId(this.yourNFTList[i].tokenId).catch(() => {})
        // console.log('stakeData: '+i, stakeData)
        if (stakeData && (stakeData[6] === this.address || stakeData[7])) {
          const vpu = parseInt(window.web3.utils.fromWei(stakeData[2], 'ether')) // int vì khi stake cũng chỉ cho nhập int
          this.yourNFTList[i].stakingSummary = `${vpu}+ VPU`
        } else {
          this.yourNFTList[i].stakingSummary = ''
        }
      }
      this.$forceUpdate() // update DOM
    },
    // end Staking -----------------------------------------------

    // Dialog Transfer Token -----------------------------------------------
    // @
    openTransferTokens() {
      this.dialogTransferVisible = true
      if (this.transferTokens.length === 0) this.transferTokens.push({ tokenId: '', tokenIdErr: false, recipient: '', recipientErr: false })
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
      if (this.transferTokens.length < this.transferMax) this.transferTokens.push({ tokenId: '', tokenIdErr: false, recipient: '', recipientErr: false })
    },
    // @
    handleNumOfTransfer(submit) {
      let tokenIdErr = false
      let tokenIdErr2 = false
      let recipientErr = false
      let recipientErr2 = false
      for (let i = 0; i < this.transferTokens.length; i++) {
        if (this.transferTokens[i].tokenId !== '') {
          this.transferTokens[i].tokenId = parseInt(this.transferTokens[i].tokenId)
          if (isNaN(this.transferTokens[i].tokenId)) {
            this.transferTokens[i].tokenId = ''
          } else if (this.transferTokens[i].tokenId < 0) {
            this.transferTokens[i].tokenId *= -1
          }
        }
        this.transferTokens[i].tokenIdErr = false
        this.transferTokens[i].recipientErr = false
        if (this.transferTokens[i].recipient !== '' && !window.web3.utils.isAddress(this.transferTokens[i].recipient)) {
          this.transferTokens[i].recipientErr = true
          recipientErr = true
        }
        if (this.transferTokens[i].recipient.toLowerCase() === this.address.toLowerCase()) {
          this.transferTokens[i].recipientErr = true
          recipientErr2 = true
        }
        if (submit && this.transferTokens[i].tokenId === '') {
          this.transferTokens[i].tokenIdErr = true
          tokenIdErr = true
        }
        if (submit && this.transferTokens[i].recipient === '') {
          this.transferTokens[i].recipientErr = true
          recipientErr = true
        }
        if (!tokenIdErr && !recipientErr && !recipientErr2 && this.transferTokens[i].tokenId >= 0) {
          for (let j = 0; j < i; j++) {
            if (this.transferTokens[j].tokenId !== '' && this.transferTokens[j].tokenId === this.transferTokens[i].tokenId) {
              this.transferTokens[i].tokenIdErr = true
              this.transferTokens[j].tokenIdErr = true
              tokenIdErr2 = true
            }
          }
        }
      }
      if (tokenIdErr || tokenIdErr2 || recipientErr || recipientErr2) {
        let mss = ''
        if (tokenIdErr2) mss = 'Some TokenIds has been duplicated'
        else if (recipientErr2) mss = 'Unable to send to current owner address'
        else if (tokenIdErr) mss = 'Input must not be empty'
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
      let ownerErr = false
      let fetchErr = false
      this.dialogTransferLoading = true
      for (let i = 0; i < this.transferTokens.length; i++) {
        await this.$store.getters.instances.NFTContract.ownerOf(this.transferTokens[i].tokenId).then(owner => {
          this.debug && console.log('ownerOf', owner, this.address)
          if (owner === undefined || owner.toLowerCase() !== this.address.toLowerCase()) {
            this.transferTokens[i].tokenIdErr = true
            ownerErr = true
          }
        }).catch(() => {
          fetchErr = true
        })
        if (fetchErr) break
      }
      if (fetchErr || ownerErr) {
        if (ownerErr) {
          this.$alert('Some TokenIds are not owned by you', 'Warning!!', {
            type: 'error'
          }).catch(() => {})
        }
        this.dialogTransferLoading = false
        return
      }
      const transferInputs = []
      for (let i = 0; i < this.transferTokens.length; i++) {
        transferInputs.push([this.address, this.transferTokens[i].recipient, this.transferTokens[i].tokenId.toString()])
      }
      this.debug && console.log('transferInputs', transferInputs)
      this.$store.getters.instances.NFTContract.safeTransferFrom({ clauses: transferInputs }, { from: this.address }).then(async result => {
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
      // new tam
      setTimeout(() => {
        this.$router.push({ path: `/my-redirect?redirect=${this.$router.history.current.path}` })
      }, 800)
    },
    // end Dialog Transfer Token -----------------------------------------------

    // Create & Edit Auction -------------------------------------------------------
    // @
    handleCreateAuc(tokenId) {
      if (typeof window.handlePreCreateAuc === 'function') window.handlePreCreateAuc(tokenId)
    },
    // @
    createAuctionDone(tokenIds) {
      this.debug && console.log('createAuctionDone-tokenIds:', tokenIds)
      this.yourNFTList = this.yourNFTList.filter(obj => {
        return tokenIds.indexOf(obj.tokenId) === -1
      })
      this.getTotalNFT().then(result => {
        this.totalNFT = result
        if (this.yourNFTList.length <= 0 || (result <= this.NFTQuery.limit && this.yourNFTList.length < result)) {
          this.appendYourNFT(false)
        }
      })
    },
    // end Create & Edit Auction -------------------------------------------------------

    // Bid|Cancel Auction Done -------------------------------------------------------
    // @
    appendNFT(tokenIds) {
      for (let i = 0; i < tokenIds.length; i++) {
        if (this.yourNFTList.some(obj => obj.tokenId === tokenIds[i]) === false) {
          const item = this.getItemInfos(tokenIds[i])
          this.yourNFTList.unshift(item)
          if (this.yourNFTList.length > this.yourNFTMaxShow) this.yourNFTList.pop()
        }
      }
      this.getTotalNFT().then(result => {
        this.totalNFT = result
      })
    },
    // end Bid|Cancel Auction Done -------------------------------------------------------

    // Bid Auction -------------------------------------------------------
    // @
    bidAuctionDone(tokenIds) {
      this.debug && console.log('bidAuctionDone-tokenIds:', tokenIds)
      this.appendNFT(tokenIds)
    },
    // end Bid Auction -------------------------------------------------------

    // Your NFTs -------------------------------------------------------
    // @
    loadPageYourNFT() {
      this.appendYourNFT(true)
      // this.appendRunningAucServer(false, '')
    },
    // @
    async getTotalNFT() {
      let total = 0
      const balance = await this.$store.getters.instances.NFTContract.balanceOf(this.address).catch(() => {})
      if (balance !== undefined) total = balance.toNumber()
      this.debug && console.log('totalNFT:', total)
      return total
    },
    // @
    async appendYourNFT(getTotal) {
      if (this.yourNFTFetching) return
      this.yourNFTFetching = true
      this.yourNFTLoading = true
      if (getTotal) this.totalNFT = await this.getTotalNFT()
      if (this.totalNFT <= 0) {
        this.yourNFTList = []
        this.appendYourNFTDone()
        return
      }
      const page = this.totalNFT / this.NFTQuery.limit
      const pageFloor = Math.floor(page)
      const maxPage = page > pageFloor ? pageFloor + 1 : pageFloor
      if (this.NFTQuery.page > maxPage) this.NFTQuery.page = maxPage
      //
      const start = this.NFTQuery.page * this.NFTQuery.limit - this.NFTQuery.limit
      let end = this.NFTQuery.page * this.NFTQuery.limit - 1
      if (end > this.totalNFT - 1) end = this.totalNFT - 1
      this.debug && console.log('NFTQuery - page: ' + this.NFTQuery.page + ', limit: ' + this.NFTQuery.limit)
      this.debug && console.log('NFTQuery - start: ' + start + ', end: ' + end)
      const _yourNFTList = []
      const indexs = []
      for (let i = start; i <= end; i++) indexs.push(i)
      await this.$store.getters.instances.ERC721PeripheryV1.tokenOfOwnerByIndexs(this.$store.getters.instances.NFTContract.address, this.address, indexs).then(results => {
        this.debug && console.log('tokenOfOwnerByIndexs', results)
        for (let i = 0; i < results[0].length; i++) {
          const item = this.getItemInfos(results[0][i])
          // console.log('item', item)
          _yourNFTList.push(item)
        }
      }).catch(() => {})

      this.yourNFTList = _yourNFTList
      this.appendYourNFTDone()
    },
    // @
    appendYourNFTDone() {
      this.debug && console.log('appendYourNFTDone')
      this.yourNFTLoading = false
      this.yourNFTFetching = false
      if (this.state === 'beforeDestroy') return
      this.getTotalStakingByTokenId()
    },
    // end: Your NFTs -------------------------------------------------------

    // SortFilters -------------------------------------------------------
    sortFiltersSubmit(query) {
      this.appendRunningAucServer(true, query)
    },
    appendRunningAucServer(newSubmit, newQuery) {
      if (this.yourNFTFetching) return
      if (this.yourNFTLoading) return
      //
      if (!newSubmit && this.queryChallenge) {
        this.query = `challenge=true&address=${this.address}&`
      } else if (newSubmit) {
        const query = Object.assign({}, this.$route.query)
        delete query.challenge
        this.$router.replace({ query })
      }
      if (newSubmit) {
        this.yourNFTFetching = true
        this.NFTQuery.page = 1
        this.query = newQuery
      } else {
        this.yourNFTLoading = true
      }
      this.yourNFTLoading = true
      this.debug && console.log('query: ', this.query)
      getVpunks(this.query + 'page=' + this.NFTQuery.page).then(response => {
        const { data } = response
        if (data.length > 0) {
          this.totalNFT = Number(data[data.length - 1][0])
          if (this.totalNFT <= 0) this.appendYourNFT(true) // server bị lỗi thì gọi từ blockchain API
          // console.log(data[data.length - 1][2], data[data.length - 1][3])
        }
        // console.log('data', data)
        this.yourNFTList = []
        if (data.length > 1) {
          for (let i = 0; i < data.length - 1; i++) {
            // console.log(auc1)
            // const auc = this.generateAuctionStorage(auc1)
            // this.debug && console.log('auc', auc)
            const tokenId = data[i][1]
            const item = punks_1[tokenId]
            let imgId = '000' + item.id
            imgId = imgId.slice(imgId.length - 4)
            // item.img = `https://www.larvalabs.com/public/images/cryptopunks/punk${imgId}.png`
            item.img = `https://vpunks.com/images/vpunks/punk${imgId}.png`
            item.tokenId = tokenId.toString()
            this.yourNFTList.push(item)
          }
        }
        // console.log('response', response)
        // console.log('data', data)
        this.yourNFTFetching = false
        this.appendYourNFTDone()
      }).catch(error => {
        this.debug && console.log(error)
        this.yourNFTFetching = false
        this.yourNFTLoading = false
        if (!newSubmit) this.appendYourNFT(true)
      })
    },
    // end: SortFilters -------------------------------------------------------

    // Dialog View Item Details -------------------------------------------------------
    // @
    viewItemDetails(item, isAuction) {
      if (typeof item !== 'object') item = this.getItemInfos(item)
      this.debug && console.log('item', item)
      const preImg = this.VNFTData.img
      this.VNFTData = item
      this.VNFTData.isAuction = isAuction
      this.VNFTData.stakingChecked = false
      this.VNFTData.stakingPoolId = '2'
      this.dialogVNFTVisible = true
      if (preImg !== this.VNFTData.img) this.imgLoading = true
      if (this.viewNFTTabActiveName === 'staking') this.checkStakeByTokenId(this.VNFTData.tokenId)
    },
    // @
    onImgLoad() {
      this.imgLoading = false
    },
    //
    viewNFTTabClick(tab, event) {
      if (this.viewNFTTabActiveName === 'staking' && !this.VNFTData.stakingChecked) this.checkStakeByTokenId(this.VNFTData.tokenId)
    },
    // end: Dialog View Item Details -------------------------------------------------------

    // Other -------------------------------------------------------
    // @
    getItemInfos(tokenId) {
      const item = punks_1[tokenId]
      if (typeof item.accessories === 'string') item.accessories = item.accessories.split(' / ')
      let imgId = '000' + item.id
      imgId = imgId.slice(imgId.length - 4)
      // item.img = `https://www.larvalabs.com/public/images/cryptopunks/punk${imgId}.png`
      item.img = `https://vpunks.com/images/vpunks/punk${imgId}.png`
      item.tokenId = tokenId.toString()
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
      // staking
      item.stakingSummary = '...'
      return item
    },
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
      const result = await this.$store.getters.instances.ERC721DutchAuctionV1.auctionByTokenId(tokenIds).catch(() => {})
      if (result !== undefined) {
        for (let j = 0; j < result.length; j++) {
          const auc = this.generateAuctionStorage(result[j])
          aucList.push(auc)
        }
      }
      return aucList
    }
    // end Other -------------------------------------------------------

    /* not working on VeChain
    // @
    onSubscribeEvents(event) {
      // event: AuctionCreated, AuctionUpdated, AuctionCancelled, AuctionSuccessful
      if (event.event === 'AuctionSuccessful' && event.returnValues.seller.toLowerCase() === this.address.toLowerCase()) {
        this.onEventAuctionSuccessful(event.returnValues.tokenId)
      }
    },*/
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

.loading-box02 {
  text-align: center;
  font-size: 22px;
}

.account-nfts-container {
  position: relative;
  padding: 30px 30px 10px 30px;
  padding-left: min(max(10px, 4vw), 30px);
  padding-right: min(max(10px, 4vw), 30px);

  .auc-details-label {
    padding:3px 0 6px 0;
  }
  .cAForm .el-form-item {
    margin-bottom: 10px;
  }
  .cATag {
    font-size: 15px;
    padding: 4px 10px;
    height: auto;
  }
  .cATag01 {
    min-width: 385px;
  }
  .cATag02 {
    margin-left: -4px;
  }
  .transfer-btn {
    position: absolute;
    right: 30px;
    top: 30px;
    padding: 4px 10px;
    img {
      width: 20px;
      margin: -3px 0 -5px 0;
    }
  }
}

.buy-more-container {
  padding: 30px 30px 150px 30px;
  padding-left: min(max(10px, 4vw), 30px);
  padding-right: min(max(10px, 4vw), 30px);
  text-align: center;
}

.add-transfer-token {
  width: 50px;
  margin: 3px 0;
  font-weight: bold;
  font-size: 16px;
  line-height: 14px;
}

.nft-details-container {
  display: flex;
  flex-wrap: wrap;
  .auction-details {
    width: 240px;
    display: inline-block;
    .card-panel {
      width: 100%;
    }
    .loading-box01 {
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
  .chart-container {
    width: calc(100% - 240px);
    display: inline-block;
    padding: 0 0 20px 20px;
    margin-top: -20px;
  }
  .auc-details-label {
    padding-bottom: 5px;
  }
  .rarity-box {
    height: 600px;
    margin: 0 auto;
    color: #fff;
    background: #28407e;
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
      top:5px;
      right: 5px;
      padding: 5px 10px;
      background-color: #04271399;
      color: #ffff88;
      border-radius: 0 10px 0 8px;
      -webkit-border-radius: 0 10px 0 8px;
      -moz-border-radius: 0 10px 0 8px;
      font-weight: 500;
    }
    .card-panel-icon-wrapper {
      height: 190px;
      text-align: center;
      background: #4fa8b9;
      cursor: pointer;
      &:hover {
       background: #63becf;
      }
    }

    .card-panel-icon {
      height: 100%;
      image-rendering: pixelated;
    }

    .card-panel-description {
      font-weight: bold;
      margin: 15px 5px 0 5px;

      .card-panel-text {
        // line-height: 18px;
        // color: #fff;
        // font-size: 16px;
        // margin-bottom: 12px;
        color: #CCCCCC;
        font-size: 15px;
        margin-bottom: 5px;
        width: 140px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .card-panel-type {
        float: right;
        color: rgba(255, 255, 255, 0.5);
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
      .card-panel-price {
        div {
          color:#53A7FF;
          font-weight: 500;
          position: absolute;
          width: 100px;
          right: 29px;
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
          right: 12px;
        }
      }
    }
    .card-panel-footer {
      clear: both;
      text-align: center;
    }
    .card-panel-footer .el-button {
      margin-top: 8px;
    }
    .card-panel-tags {
      padding: 0 5px 10px 5px;
    }
  }
}
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
@media screen and (max-width: 425) {
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
