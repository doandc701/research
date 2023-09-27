<template>
  <div>
    <!-- Dialog Viewing NFT -->
    <el-dialog v-loading="dialogVNFTLoading" class="dialog-nft-dt" :visible.sync="dialogVNFTVisible" title="Viewing NFT" :width="dialogVNFTWidth" top="20px">
      <div slot="title" style="font-size: 22px">
        Viewing NFT<!--<i class="el-icon-share" /><i class="el-icon-refresh" />-->
      </div>
      <div class="nft-details-container">
        <div class="left-box" :style="{ width: leftBoxWidth }">
          <div class="panel-group">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper">
                <img :src="VNFTData.img" class="card-panel-icon" @load="onImgLoad">
                <span v-show="imgLoading" class="loading-box"><i class="el-icon-loading" /></span>
              </div>
              <div class="card-panel-description">
                <div class="item-card-details">
                  <el-row :gutter="20">
                    <el-col :span="14"><div class="card-panel-text">VPunks OG</div></el-col>
                    <el-col :span="6"><div class="price-text">Best price</div></el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="14"><div class="tokenId-line">#{{ VNFTData.tokenId }}</div></el-col>
                    <el-col :span="6">
                      <div class="card-panel-price">
                        <div>-</div>
                        <img src="@/assets/tokens-symbol/vet.svg">
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div class="card-panel-tags">
                  <el-tag effect="plain" class="tagName">VIP-181</el-tag>
                  <el-tag effect="plain" class="tagName" style="position: relative; left: 5px;">Rank: {{ VNFTData.rank }}</el-tag>
                </div>
                <!-- <div class="card-panel-text">
                  <h3>VPunk {{ VNFTData.tokenId }}</h3>
                  <span class="card-panel-type">{{ VNFTData.type }}</span>
                </div>
                Accessories<br>
                <span v-for="acces of VNFTData.accessories" :key="acces" class="card-panel-acces">{{ acces }}</span> -->
              </div>
            </div>
          </div>
        </div>
        <div class="right-box" :style="{ width: rightBoxWidth }">
          <!-- margin ở trên: marginLeft: rightBoxMarginLeft -->
          <el-tabs v-model="viewNFTTabActiveName" type="card" @tab-click="viewNFTTabClick">
            <el-tab-pane label="Details" name="details">
              <Details :v-n-f-t-data="VNFTData" />
            </el-tab-pane>
            <el-tab-pane label="All Offer" name="offer">
              <AllOffer :v-n-f-t-data="VNFTData" />
            </el-tab-pane>
            <el-tab-pane label="Rarity" name="rarity">
              <Rarity :v-n-f-t-data="VNFTData" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <span slot="footer">
        <!-- <el-button @click="dialogVNFTVisible = false">Close</el-button> -->
        <div class="place-bid-mc"><el-button :disabled="cuaban" type="success" round @click="handlePlaceBid(VNFTData.tokenId)">Make Offer <i class="el-icon-sort-up" /></el-button></div>
      </span>
    </el-dialog>
    <!-- end: Dialog Viewing NFT -->

    <!-- Dialog Staking -->
    <el-dialog v-loading="dialogStakingLoading" :visible.sync="dialogStakingVisible" title="Place a bid" :width="dialogStakingWidth" append-to-body>
      <el-form ref="stakingForm" :rules="rules" :model="tempStaking" label-position="left" label-width="170px" :style="{margin: stakingFormMargin}">
        <el-form-item label="TokenId">
          <el-tag effect="plain" style="font-size: 18px;">{{ tempStaking.tokenId }}</el-tag>
        </el-form-item>
        <el-form-item label="Price" prop="price">
          <el-input v-model="tempStaking.price" placeholder="in VPU">
            <template slot="append">VPU</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Duration" prop="duration">
          <el-input v-model="tempStaking.duration" placeholder="in Days">
            <template slot="append">Days</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="handleAddBid()">Add bid</el-button>
        <el-button @click="dialogStakingVisible = false">Cancel</el-button>
      </span>
    </el-dialog>
    <!-- end Dialog Staking -->
  </div>
</template>

<script>
import punks_1 from '@/punks/0-9999-v3.json'
import rarityInfo from '@/punks/rarity-info.json'
import { explorerAddress, explorerTx } from '@/settings'
import Details from './components/Detail.vue'
import AllOffer from './components/AllOffer.vue'
import Rarity from './components/Rarity.vue'
// import rarityInfo2 from '@/punks/_metadata-11-17.json'

const defaultTempStaking = {
  tokenId: '',
  price: '',
  duration: '',
  tokenAddress: '0xe92FDDD633008C1bca6E738725d2190cD46DF4a1', // VPunks
  paymentAddress: '0xb0821559723dB89e0Bd14FEE81E13a3aaE007e65' // VPU
}

export default {
  name: 'NFTDetails',
  components: {
    Details,
    AllOffer,
    Rarity
  },
  filters: {
    fromWei(w) {
      if (typeof w !== 'object') return w
      return window.web3.utils.fromWei(w, 'ether')
    }
  },
  data() {
    const validateStakingAmount = (rule, value, callback) => {
      if (value === '') return callback(new Error('Price is required'))
      try {
        let _value = parseInt(value) // đưa về Int cho số đẹp
        if (isNaN(_value)) {
          _value = ''
        } else if (_value < 1000) {
          _value = 1000
        } else if (_value > 10000000) {
          _value = 10000000
        }
        this.tempStaking.price = _value
        return callback()
      } catch (error) {
        // console.log(error)
        return callback(new Error('invalid number value'))
      }
    }
    const validateDuration = (rule, value, callback) => {
      // if (value === '') return callback(new Error('Duration is required'))
      try {
        let _value = parseInt(value)
        if (isNaN(_value)) {
          _value = ''
        } else if (_value < 1) {
          _value = ''
        } else if (_value > 365) {
          _value = 365
        }
        this.tempStaking.duration = _value
        return callback()
      } catch (error) {
        // console.log(error)
        // return callback(new Error('invalid number value'))
      }
    }
    //
    return {
      // general
      debug: false,
      address: null,

      // Dialog View NFT
      dialogVNFTVisible: false,
      dialogVNFTLoading: false,
      VNFTData: {
        tokenId: null,
        rank: null,
        accessories: [],
        rarityInfo: []
      },
      imgLoading: false,
      viewNFTTabActiveName: 'details',
      dialogVNFTWidth: '90%',
      leftBoxWidth: '240px',
      rightBoxWidth: '450px',
      rightBoxMarginLeft: '20px',
      rarityBoxHeight: '600px',
      description: `VPunks are a collection of 10,000 unique digital assets nested within a gaming ecosystem.
      VPunks NFTs are utility-driven, offering staking and P2E gaming rewards in the ecosystem's native $VPU token.`,

      // Dialog Staking, tạm chưa đổi tên
      dialogStakingVisible: false,
      dialogStakingLoading: false,
      tempStaking: Object.assign({}, defaultTempStaking), // copy obj
      dialogStakingWidth: '90%',
      stakingFormMargin: '0 50px',
      rules: {
        price: [{ required: true, trigger: 'blur', validator: validateStakingAmount }],
        duration: [{ required: false, trigger: 'blur', validator: validateDuration }]
      },
      allOffer: [],
      getOfferLoading: false,
      cuaban: false
    }
  },
  created() {
    this.debug && console.log('created - NFTDetails', window.selectedAccount)
    this.address = window.selectedAccount
    window.showNFTDetails = this.showNFTDetails

    // test ------------------------------------------
    // build metadata: vpunks
    /* for(let i = 0; i < punks_1.length; i++) {
      const tokenId = i
      const item = punks_1[tokenId]
      // if (typeof item.accessories === 'string') item.accessories = item.accessories.split(' / ')
      // item.tokenId = tokenId.toString()
      delete item.type
      delete item.img
      delete item.tokenId
      delete item.accessories
      delete item.rarityInfo
      // if (!item.rarityInfo) {
        // item.rarityInfo = []
        const _item = rarityInfo.items[tokenId]
        for (let j = 0; j < _item.length; j++) {
          // console.log(_item[j], typeof _item[j])
          if (typeof _item[j] === 'number' && rarityInfo.basePropDefs[j].name !== 'Skin Tone') {
            const category_name = rarityInfo.basePropDefs[j].name
            const pvs_name = rarityInfo.basePropDefs[j].pvs[rarityInfo.items[tokenId][j]][0] || 'NONE'
            const value = rarityInfo.basePropDefs[j].pvs[rarityInfo.items[tokenId][j]][1]
            let rarity = 10000 / value
            rarity = Math.round(rarity * 100) / 100
            // item.rarityInfo.push([category_name, pvs_name, value, rarity])
            item[category_name] = pvs_name
            // this.debug && console.log(rarity)
            // this.debug && console.log(category_name, pvs_name, value, rarity)
          }
        }
        // this.debug && console.log(item.rarityInfo)
      // }
    }
    console.log(punks_1)
    return; */

    // build metadata: pixel-puffs
    /* let x = 0
    for(let i = 0; i < rarityInfo2.length; i++) {
      x ++
      let a = rarityInfo2[i].attributes
      for(let j = 0; j < a.length; j++) {
        // a[j].trait_type = a[j].trait_type.replace('-Cheese','')
        if (a[j].trait_type.indexOf('Background-') > -1) a[j].trait_type = 'Background'
        if (a[j].trait_type.indexOf('Backpack-') > -1) a[j].trait_type = 'Backpack'
        if (a[j].trait_type.indexOf('Body-') > -1) a[j].trait_type = 'Body'
        if (a[j].trait_type.indexOf('Eyes-') > -1) a[j].trait_type = 'Eyes'
        if (a[j].trait_type.indexOf('Mouth-') > -1) a[j].trait_type = 'Mouth'
        if (a[j].trait_type.indexOf('Shield-') > -1) a[j].trait_type = 'Shield'
        if (a[j].trait_type.indexOf('Weapon-') > -1) a[j].trait_type = 'Weapon'
        // if (a[j].value.indexOf('Empty') > -1) a[j].value = 'Empty'
      }
    }
    console.log('x:', x)
    console.log(rarityInfo2)*/
  },
  mounted() {
    this.debug && console.log('mounted - NFTDetails')
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
  },
  beforeDestroy() {
    window.showNFTDetails = undefined
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    // @
    handleWindowResize(event) {
      this.debug && console.log('innerWidth:', window.innerWidth)
      const w = window.innerWidth
      this.dialogVNFTWidth = w > 705 ? '705px' : (w > 360 ? '100%' : '360px')
      this.rightBoxWidth = '420px'
      const h = window.innerHeight - 227 // 150 + top:10 + bottom:20 + dialog-top:10 + dialog-outline:2
      this.rarityBoxHeight = w > 570 ? (h > 500 ? `${h}px` : '500px') : 'auto'

      // dialog Staking
      this.dialogStakingWidth = w > 800 ? '800px' : (w > 340 ? '100%' : '340px')
      this.stakingFormMargin = w > 800 ? '0 50px' : (w > 600 ? '0 10px' : (w > 370 ? '0' : '0 -10px'))
    },
    //
    async showNFTDetails(item, isAuction) {
      if (typeof item !== 'object') item = this.getItemInfos(item)
      this.debug && console.log('item', item)
      const preImg = this.VNFTData.img
      this.VNFTData = item
      this.VNFTData.isAuction = isAuction
      this.dialogVNFTVisible = true
      if (preImg !== this.VNFTData.img) this.imgLoading = true
      const owner = await this.$store.getters.instances.NFTContract.ownerOf(item.tokenId).catch(() => {})
      this.debug && console.log('owner', owner)
      if (owner === this.address) this.cuaban = true
      if (this.viewNFTTabActiveName === 'offer') this.checkOffer(this.VNFTData.tokenId)
    },
    //
    viewNFTTabClick(tab, event) {
      if (this.viewNFTTabActiveName === 'offer') this.checkOffer(this.VNFTData.tokenId)
    },
    async acceptBid(row) {
      this.debug && console.log('acceptBid', row)
      if (!row) {
        this.$alert('This offer has expired or the bidder does not have enough balance!', 'Alert', {
          type: 'error',
          dangerouslyUseHTMLString: true
        }).catch(() => {})
        return
      }
      //
      this.dialogVNFTLoading = true
      const bidV1Address = this.$store.getters.instances.ERC721BidV1.address
      const isApproved = await this.$store.getters.instances.NFTContract.isApprovedForAll(this.address, bidV1Address).catch(() => {})
      this.debug && console.log('isApprovedForAll', isApproved)
      if (isApproved === undefined) {
        this.dialogVNFTLoading = false
        return
      }
      //
      let allClause = []
      if (!isApproved) {
        const clause = await this.$store.getters.instances.NFTContract.setApprovalForAll(bidV1Address, true, { getClause: true })
        allClause = allClause.concat(clause)
      }
      const clause = await this.$store.getters.instances.ERC721BidV1.acceptBids([row.bidId], { getClause: true })
      allClause = allClause.concat(clause)
      this.debug && console.log('allClause:', allClause)
      if (allClause.length <= 0) return
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
        this.dialogVNFTLoading = false
        this.dialogVNFTVisible = false
      }).catch(err => {
        console.error(err.message)
        this.dialogVNFTLoading = false
      })
    },
    //
    async checkOffer(tokenId) {
      this.getOfferLoading = true
      this.allOffer = []
      const NFTAddress = this.$store.getters.instances.NFTContract.address
      let totalBid = await this.$store.getters.instances.ERC721BidV1.totalBidOfTokenId(NFTAddress, tokenId).catch(() => {})
      this.debug && console.log('totalBid', totalBid)
      if (totalBid) totalBid = totalBid.toNumber()
      if (!totalBid || totalBid <= 0) {
        this.getOfferLoading = false
        return
      }
      for (let i = 0; i < totalBid; i++) {
        const bid = await this.$store.getters.instances.ERC721BidV1.bidOfTokenIdByIndex(NFTAddress, tokenId, i).catch(() => {})
        if (!bid) continue
        bid.canAccept = 0
        if (this.cuaban) {
          const bidValid = await this.$store.getters.instances.ERC721BidV1.validBidByBidIds([bid.bidId]).catch(() => {})
          bid.canAccept = 2
          if (bidValid && bidValid[0]) bid.canAccept = 1
          this.debug && console.log('bidValid', bidValid)
        }
        this.debug && console.log('bid', bid)
        bid.bidderV = `${bid.bidder.slice(0, 5)}...${bid.bidder.slice(bid.bidder.length - 3)}`
        bid.bidderLink = `${explorerAddress}${bid.bidder}`
        bid.price = new window.web3.utils.BN(bid.price)
        bid.durationV = '--'
        if (bid.duration !== '0') bid.durationV = `${parseInt(bid.duration) / 86400} days`
        this.allOffer.push(bid)
      }
      this.getOfferLoading = false
    },
    //
    handlePlaceBid(tokenId) {
      this.debug && console.log('handlePlaceBid-tokenId', tokenId)
      if (this.tempStaking.tokenId !== '' && this.tempStaking.tokenId !== tokenId) {
        this.tempStaking = Object.assign({}, defaultTempStaking) // copy obj
      }
      this.tempStaking.tokenId = tokenId
      this.dialogStakingVisible = true
      this.$nextTick(() => {
        this.$refs['stakingForm'].clearValidate()
      })
    },
    //
    handleAddBid() {
      this.debug && console.log('submitStaking-tempStaking', this.tempStaking)
      this.$refs['stakingForm'].validate(valid => {
        if (valid) {
          this.dialogVNFTVisible = false
          this.dialogStakingVisible = false
          this.$store.dispatch('auctionCart/addCreateBidOf', this.tempStaking)
          if (window.openCreateBidOffers) window.openCreateBidOffers()
        }
      })
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
      return item
    },
    // @
    onImgLoad() {
      this.imgLoading = false
    }
  }
}
</script>

<style lang="scss">
.dialog-nft-dt {
  .el-dialog__header {
    border-bottom: 1px solid #39549c;
    padding: 15px;
  }
  .el-dialog__body {
    padding: 10px 10px 20px 10px;
  }
  .el-dialog__headerbtn {
    top: 14px;
    font-size: 25px;
    line-height: 1;
    .el-dialog__close {
      background-color: #668CD9;
      border-radius: 3px;
    }
    &:focus .el-dialog__close, &:hover .el-dialog__close {
      background: #8b9ecf;
      color: #fff;
    }
  }
  .el-dialog__footer {
    border-top: 1px solid #39549c;
    padding: 10px;
  }

  .el-tabs__item {
    font-size: 16px;
    color: #fff;
    border-left: 0;
  }
  .el-tabs__nav-scroll {
    background-color: #202440;
    border-radius: 12px;
    display: flex;
    justify-content: center;
  }
  .el-tabs__item.is-active {
    color: rgba(108, 226, 62, 1);
  }
  .el-tabs__item.is-top.is-active::before {
    content: '';
    position: absolute;
    border: 8px solid transparent;
    border-top: 0;
    border-bottom-color: #28407D;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
  }
  .el-tabs--border-card {
    border: 0;
    background: rgba(60, 76, 118, 1);
  }
  .el-tabs--border-card > .el-tabs__header {
    background-color: rgba(32, 36, 64, 1);
    border-bottom: 0;
  }
  .el-tabs--card > .el-tabs__header {
    border-bottom: 0;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: 0;
  }
  .el-tabs__header .el-tabs__item.is-active {
    border-bottom: 0;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-left: 0px;
    font-size: 20px;
  }
  .el-tabs.is-active {
    content: " ";
    background: #fff;
    width: 50px;
    height: 50px;
    position: relative;
    margin-top: 50px;
    margin-left: 10px;
    transform: rotate(45deg);
  }
  .place-bid-mc {
    text-align: center;
    .el-button {
      background-color: #558C3F;
      border: none;
      &:hover, &:focus {
        background-color: #82a176;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.nft-details-container {
  display: flex;
  flex-wrap: wrap;
  .left-box {
    width: 240px;
    margin: 0 auto;
    .card-panel {
      width: 100%;
    }
  }
  .right-box {
    display: inline-block;
    padding-left: 6px;
    margin: 0 auto;
  }
  .rarity-box {
    height: 600px;
    margin: 0 auto;
    color: #fff;
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

.panel-group {
  .card-panel {
    padding: 5px 5px 0px 5px;
    font-size: 12px;
    box-shadow: 3px 3px 30px rgb(0 0 0 / 20%);
    border-radius: 6px;
    background: #202440;
    .card-panel-icon-wrapper {
      height: 200px;
      text-align: center;
      background: #709dd1;
      position: relative;
      border-radius: 4px;
    }

    .card-panel-icon {
      height: 100%;
      image-rendering: pixelated;
    }

    .card-panel-description {
      font-weight: bold;
      // box-shadow: 4px 4px 15px rgb(0 0 0 / 25%);
      // margin: 15px 5px 5px 5px;
      .item-card-details {
        font-weight: bold;
        padding: 10px;
      }
      .card-panel-text {
        // line-height: 18px;
        // color: #fff;
        // font-size: 18px;
        // margin-bottom: 12px;
        // h2 {
        //   display: inline;
        // }
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
        font-size: 14px;
        color: rgba(255, 255, 255, .6);
      }
      .card-panel-acces {
        margin: 4px 4px 0 0;
        padding: .4em .6em;
        background-color: #c8c6e0;
        color: #606266;
        word-wrap: break-word;
        white-space: nowrap;
        display: inline-block;
        border-radius: .5rem;
        -webkit-border-radius: .5rem;
        -moz-border-radius: .5rem;
      }
      .price-text {
        color: #CCCCCC;
        position: absolute;
        right:10px;
      }
      // .tokenId-line {
      //   font-size: 14px;
      //   color: #ebebeb;
      //   width: 90px;
      //   text-overflow: ellipsis;
      //   overflow: hidden;
      //   white-space: nowrap;
      // }
      .tokenId-line {
        font-size: 14px;
        color: #ebebeb;
        width: 90px;
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
          right: 30px;
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
          right: 10px;
        }
      }
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
      }
              .card-panel-tags {
          border-top: 1px solid #525C9A;
          padding: 10px 5px;
          .tagName {
            background-color: #202440 ;
            border: 1px solid #606BBF;
            border-radius: 16px;
            color: #fff;
          }
        }
    }
  }
}
.el-icon-share {
  position: absolute;
  top: 14px;
  right: 65px;
  font-size: 25px;
}
.el-icon-refresh {
  position: absolute;
  right: 105px;
  top: 14px;
  font-size: 25px;
}
.introduce {
  color: #00D4FF;
  word-break: break-word;
}
.infomation {
  margin-top: 12px;
  .el-row {
    margin-bottom: 12px;
    word-break: break-word;
    padding: unset;
  }
  .el-col-8 {
    width: 34.333333%;
    word-break: break-word;
    padding-right: 0 !important;
  }
  .el-col-14 {
    padding: unset !important;
  }
  .text-blue {
    color: #00A6FF;
  }
  .more-blue {
    color: #00D4FF;
  }
}

@media screen and (max-width: 700px) {
  .left-box {
    padding-bottom: 20px;
    .right-box {
      justify-content: center;
    }
  }
}
</style>
