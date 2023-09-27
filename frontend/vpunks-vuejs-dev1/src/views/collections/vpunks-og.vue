<template>
  <div id="card-group-container" class="gallery-container">
    <div class="gallery-header">
      <div class="top-banner top-banner1">
        <el-image class="banner" :src="bannerVpo" alt="" fit="cover">
          <div slot="placeholder" class="image-slot">
            <i class="el-icon-loading" />
          </div>
        </el-image>
      </div>
    </div>
    <div class="header-content">
      <div class="avatar-cont">
        <el-avatar class="avatar-circle" style="box-shadow: rgb(0 0 0 / 50%) 4px 4px 15px" :size="150">
          <div class="avt-loop">
            <el-carousel :interval="1500" height="200px" indicator-position="none" arrow="never">
              <el-carousel-item v-for="item of myGallery" :key="item.id">
                <el-image style="width: 100%; image-rendering: pixelated" :src="item.img" class="card-panel-icon" fit="contain">
                  <div slot="placeholder" class="image-slot">
                    <i class="el-icon-loading" />
                  </div>
                </el-image>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-avatar>
      </div>
    </div>
    <div class="icon-setup-gr">
      <!-- <i class="el-icon-share" /> -->
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-button slot="reference" class="btn-share"><i class="el-icon-share" /></el-button>
        </span>
        <div class="dropdown-item">
          <el-dropdown-menu slot="dropdown" style="background-color: #202440; border-color: #4A5495; border-radius: 10px;">
            <el-dropdown-item style="color: #ffff"><div @click="copyUrl($event)"><i class="el-icon-link" />Get link</div></el-dropdown-item>
            <el-dropdown-item style="color: #ffff"><a rel="noopener" target="_blank" :href="twitterUrl"><i class="el-icon-circle-plus" />Share on Twitter</a></el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </el-dropdown>
    </div>
    <div class="name-gallery">
      <h3>VPunks OG</h3>
      <el-dropdown placement="bottom">
        <span class="el-dropdown-link">
          <el-button slot="reference" class="btn-address-vpo">{{ tokenAddressView }}</el-button>
        </span>
        <AccountAddress :account-address="tokenAddress" title="Collections" />
      </el-dropdown>
    </div>
    <div class="card-statistics">
      <el-card class="statistics">
        <el-row>
          <el-row class="list-statistics">
            <div class="list-statistics-items">
              <el-col class="statistics-item">
                <el-row class="statistics-item-number">10000</el-row>
                <el-row class="statistics-item-text">Items</el-row>
              </el-col>
            </div>
            <div class="list-statistics-items">
              <el-col class="statistics-item">
                <el-row class="statistics-item-number">--k</el-row>
                <el-row class="statistics-item-text">Owners</el-row>
              </el-col>
            </div>
            <div class="list-statistics-items">
              <el-col class="statistics-item">
                <el-row class="statistics-item-number">--<img class="vet-icon1" src="@/assets/tokens-symbol/vet.svg"></el-row>
                <el-row class="statistics-item-text">Floor price</el-row>
              </el-col>
            </div>
            <div class="list-statistics-items">
              <el-col class="statistics-item">
                <el-row class="statistics-item-number">--<img class="vet-icon2" src="@/assets/tokens-symbol/vet.svg"></el-row>
                <el-row class="statistics-item-text">Volume</el-row>
              </el-col>
            </div>
          </el-row>
        </el-row></el-card>
    </div>
    <div class="tab-mode">
      <el-tabs v-model="activeName">
        <el-tab-pane name="items">
          <span slot="label"><i style="margin-right: 2px;" class="el-icon-menu" /> Items</span>
          <div style="padding-left: 15px; padding-right: 15px;">
            <!-- Your NFTs -->
            <div class="sefi">
              <search class="right-menu-item" @input="searchInput" />
              <SortFil :location="collection.location" :sort-actived-id="1" @sortFiltersSubmit="sortFiltersSubmit" />
            </div>
            <el-row :gutter="gutter" class="panel-group">
              <el-col v-for="(item, index) of myGallery" :key="item.id" :xs="elColXS" :sm="8" :lg="5" :xl="3" class="card-panel-col">
                <div :id="index===0&&'card-panel-first'" class="card-panel">
                  <div class="card-panel-icon-wrapper" @click.prevent="viewItemDetails(item.id)">
                    <el-image :src="item.img" class="card-panel-icon" fit="contain" lazy>
                      <div slot="placeholder" class="image-slot">
                        <i class="el-icon-loading" />
                      </div>
                    </el-image>
                  </div>
                  <!-- newcard -->
                  <div class="card-panel-description">
                    <el-row :gutter="20">
                      <el-col :span="14"><div class="card-panel-text">VPunks OG</div></el-col>
                      <el-col :span="6"><div class="price-text">Best price</div></el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="14"><div class="tokenId-line">#{{ item.id }}</div></el-col>
                      <el-col :span="6">
                        <div class="card-panel-price">
                          <div>-</div>
                          <img src="@/assets/tokens-symbol/vet.svg">
                        </div>
                      </el-col>
                    </el-row>
                    <hr>
                    <!-- <span v-for="(acces, index2) of item.accessories" :key="item.id+'-'+index2" class="card-panel-acces">{{ acces }}</span> -->
                    <div>
                      <el-tag effect="plain" class="tagName">VIP-181</el-tag>
                      <el-tag effect="plain" class="tagName" style="position: relative; left: 5px;">Rank: {{ item.rank }}</el-tag>
                    </div>
                  </div>

                  <div style="clear:both;text-align:center;" />
                </div>
              </el-col>
            </el-row>
            <div v-if="myGallery.length===0" style="text-align:center;font-size:14px;"><span class="el-table__empty-text">No Data</span></div>
            <!-- end Your NFTs -->
            <pagination v-show="totalPunks>0" :total="totalPunks" :page.sync="NFTQuery.page" :limit.sync="NFTQuery.limit" :page-sizes="NFTQuery.pageSizes" @pagination="getPunkListPage" />
            <NFTDetails />
          </div>
        </el-tab-pane>
        <el-tab-pane name="about">
          <span slot="label"><i style="margin-right: 2px;" class="el-icon-info" /> About</span>
          <p style="padding-right: 15px; padding-left: 15px; color: #00D4FF;">VPunks are a collection of 10,000 unique digital assets nested within a gaming ecosystem. VPunks NFTs are utility-driven, offering staking and P2E gaming rewards in the ecosystem's native $VPU token.</p>
        </el-tab-pane>
        <el-tab-pane name="activity">
          <span slot="label"><svg-icon icon-class="activity" /> Activity</span>
          <p style="padding-right: 15px; padding-left: 15px; color: #0df11f;">This feature is coming soon.</p>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/BaseSearch'
import SortFil from '@/components/SortFilters'
import NFTDetails from '@/components/NFTDetails'
import punks_1 from '@/punks/0-9999-v3.json'
import clip from '@/utils/clipboard' // use clipboard directly
// import { isConnected } from '@/utils/validate'
import AccountAddress from '@/components/AccountAddress'
const bannerVpo = require('@/assets/collections/vpunks-og/header-img-v1p.png')

// import rarityInfo from '@/punks/rarity-info.json'

// sort
// small -> big
const tokenIdStB = (a, b) => {
  if (a.id > b.id) {
    return 1
  }
  if (a.id < b.id) {
    return -1
  }
  return 0
}
// big -> small
const tokenIdBtS = (a, b) => {
  if (a.id > b.id) {
    return -1
  }
  if (a.id < b.id) {
    return 1
  }
  return 0
}
// rank
// small -> big
const rarityScoreStB = (a, b) => {
  if (a.rank > b.rank) {
    return 1
  }
  if (a.rank < b.rank) {
    return -1
  }
  return 0
}
// big -> small
const rarityScoreBtS = (a, b) => {
  if (a.rank > b.rank) {
    return -1
  }
  if (a.rank < b.rank) {
    return 1
  }
  return 0
}
// fill
const checkIfDuplicateExists = (w) => new Set(w).size !== w.length
const filterType = (auctionsData, types) => auctionsData.filter((auc) => types.indexOf(auc.type) !== -1)
const filterCount = (auctionsData, counts) => auctionsData.filter((auc) => counts.indexOf(auc.count) !== -1)
const filterAttr = (auctionsData, attrs) => auctionsData.filter((auc) => checkIfDuplicateExists(attrs.concat(auc.accessories)))
export default {
  name: 'Gallery',
  components: {
    Pagination,
    NFTDetails,
    Search,
    SortFil,
    AccountAddress
  },
  data() {
    return {
      // general
      debug: false,
      address: null,
      gutter: 40,
      elColXS: 12,

      // Your NFTs
      myGallery: [],
      totalPunks: 10000,
      NFTQuery: {
        page: 1,
        limit: 100, // recommended: 100
        pageSizes: [100] // recommended: 100
      },
      urlQueryPage: 1,
      minCardWidth: 192,
      maxCardWidth: 220,
      cardWidth: 192,
      queryObj: null,
      collection: {
        // nhận 2 giá trị : location and market
        location: 'default'
      },
      // tab
      activeName: 'items',
      //
      tokenAddress: '0xe92FDDD633008C1bca6E738725d2190cD46DF4a1', // địa chỉ để lên link
      tokenAddressView: '', // địa chỉ khi rút gọn
      linkUrl: null,
      twitterUrl: '',
      bannerVpo // bannner
    }
  },
  created() {
    this.debug && console.log('created - Gallery')
    this.urlQueryPage = parseInt(this.$route.query.page, 10)
    if (this.urlQueryPage > 0 && this.urlQueryPage !== this.NFTQuery.page) this.NFTQuery.page = this.urlQueryPage
    this.getPunkList(punks_1)
    // if (!isConnected([true, true], [true, true])) return
    this.address = window.tokenAddress
    // get link
    this.linkUrl = window.location.href
    // console.log(window.location)
    let myUrl = window.location.href.split('?')[0]
    // myUrl = 'http://vpunks.com/#/collections/vpunks-og'
    myUrl = myUrl.replace('#', '%23')
    // console.log('myUrl', myUrl)
    const caption = 'Check out this collection on Vpunks'
    //
    const linkTwitter = `?text=${caption}&url=${myUrl}&via=vpunksofficial&original_referer=${myUrl}`
    // const encodeLink = encodeURIComponent(linkTwitter)
    this.twitterUrl = `https://twitter.com/intent/tweet${linkTwitter}`
    // console.log(this.linkUrl)
    // test: build data
    /*
    let k = []
    for (let i = 0; i < punks_1.length; i++) {
      let item = punks_1[i]
      if (typeof item.accessories === 'string') item.accessories = item.accessories.split(' / ')
      for (let j = 0; j < item.accessories.length; j++) {
        if (k.indexOf(item.accessories[j]) === -1) k.push(item.accessories[j])
      }
    }
    k.sort(function (a, b) {
      if (a > b) {
          return 1;
      }
      if (b > a) {
          return -1;
      }
      return 0;
    })
    */
    /* test: build data
    for (let i = 0; i < punks_1.length; i++) {
    // for (let i = 2547; i < 2548; i++) {
      let rarityScore = 0
      let item = rarityInfo.items[i]
      // console.log('item', item)
      for (let j = 0; j < item.length; j++) {
        // console.log(item[j], typeof item[j])
        if (typeof item[j] === 'number' && rarityInfo.basePropDefs[j].name !== 'Skin Tone') {
          let rarity = 10000/rarityInfo.basePropDefs[j].pvs[rarityInfo.items[i][j]][1]
          // rarity = Math.round(rarity*1000)/1000
          rarityScore += rarity
          // console.log(rarity)
          // console.log('name', rarityInfo.basePropDefs[j].name, rarityInfo.basePropDefs[j].pvs[rarityInfo.items[i][j]][1])
        }
      }
      rarityScore = Math.round(rarityScore*100)/100
      punks_1[i].rarityScore = rarityScore
      // console.log('rarityScore', rarityScore)
    }
    console.log(punks_1)*/
    /* test: build data
    for (let i = 0; i < punks_1.length; i++) {
      const item = punks_1[i]
      if (typeof item.accessories === 'string') item.accessories = item.accessories.split(' / ')
      delete item.img
    }
    console.log(punks_1)
    */
  },
  mounted() {
    this.debug && console.log('mounted - Gallery')
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
    // rút gọn địa chỉ ví
    this.tokenAddressView = `${this.tokenAddress.slice(0, 6)}...${this.tokenAddress.slice(this.tokenAddress.length - 4)}`
  },
  beforeDestroy() {
    this.debug && console.log('beforeDestroy - Gallery')
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    copyUrl(event) {
      clip(this.linkUrl, event)
    },
    // @
    handleWindowResize(event) {
      this.debug && console.log('innerWidth:', window.innerWidth)
      if (window.innerWidth >= 412) {
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
      this.debug && console.log('gutter:', this.gutter)

      //
      // const cont = document.getElementById('card-group-container')
      // console.log('cont width:', cont.clientWidth)
    },
    //
    searchInput(value) {
      this.debug && console.log('searchInput-value', value)
      if (value.length === 0) {
        this.getPunkList(punks_1)
        return
      }
      if (value >= this.totalPunks) return
      this.myGallery = []
      this.getPunkDetails(value, punks_1)
    },
    // handleSort and Fill
    sortFiltersSubmit(query, queryObj) {
      this.appendRunningAucLocal(true, query, queryObj)
    },
    getPunkListPage() {
      if (this.queryObj) {
        this.appendRunningAucLocal(true, false, this.queryObj)
      } else {
        this.getPunkList(punks_1)
      }
    },
    appendRunningAucLocal(newSubmit, newQuery, queryObj) {
      if (newQuery) {
        this.NFTQuery.page = 1
        this.urlQueryPage = this.NFTQuery.page
        this.$router.replace({ name: this.$router.history.current.name, query: { page: this.NFTQuery.page }})
      }
      // clone object array (Deep copy) để khi thay đổi newList không tác động đến punks_1
      // tham khảo https://viblo.asia/p/lieu-co-bao-nhieu-cach-clone-array-trong-javascript-63vKjeVk52R
      let newList = JSON.parse(JSON.stringify(punks_1))
      this.queryObj = queryObj

      const order = queryObj.order
      const typeArr = queryObj.type
      const countArr = queryObj.count
      const attrArr = queryObj.attr

      // type
      let typeDefault = ['all']
      if (typeArr.length > 0) {
        typeDefault = typeArr
      }
      if (typeDefault[0] !== 'all') {
        newList = filterType(newList, typeDefault)
      }
      // console.log('newList', typeDefault, newList)

      // count
      let countDefault = ['all']
      if (countArr.length > 0) {
        countDefault = countArr
      }
      if (countDefault[0] !== 'all') {
        newList = filterCount(newList, countDefault)
      }
      // console.log('countDefault', countDefault, newList)

      // attr
      let attrDefault = ['all']
      if (attrArr.length > 0) {
        attrDefault = attrArr
      }
      if (attrDefault[0] !== 'all') {
        newList = filterAttr(newList, attrDefault)
      }
      // console.log('attrDefault', attrDefault, newList, attrDefault[0])

      let newcompare = tokenIdStB
      this.query = newQuery
      // console.log(newQuery, queryObj)

      if (order === 1) newcompare = tokenIdStB
      else if (order === 2) newcompare = tokenIdBtS
      else if (order === 5) newcompare = rarityScoreBtS
      else if (order === 6) newcompare = rarityScoreStB
      const newSort = newList.sort(newcompare)
      this.getPunkList(newSort)
      // console.log('punks_1', punks_1)
    },
    getPunkList(punks) {
      /*
      const a = []
      const b = []
      const c = []
      for (let i = 0; i < 10000; i++) {
        // Alien
        if (punks_1[i] .type === 'Alien') a.push(i)
        else if (punks_1[i] .type === 'Ape') b.push(i)
        else if (punks_1[i] .type === 'Zombie') c.push(i)
      }
      console.log('Alien', a)
      console.log('Ape', b)
      console.log('Zombie', c)
      */
      this.totalPunks = punks.length
      this.myGallery = []
      const start = this.NFTQuery.page * this.NFTQuery.limit - this.NFTQuery.limit
      let end = this.NFTQuery.page * this.NFTQuery.limit - 1
      if (end > this.totalPunks - 1) end = this.totalPunks - 1
      this.debug && console.log('page: ' + this.NFTQuery.page + ', start: ' + start + ', end: ' + end)
      for (let i = start; i <= end; i++) {
        this.getPunkDetails(i, punks)
      }
      if (this.NFTQuery.page !== this.urlQueryPage) {
        this.urlQueryPage = this.NFTQuery.page
        this.$router.replace({ name: this.$router.history.current.name, query: { page: this.NFTQuery.page }})
      }
    },
    // @
    getPunkDetails(id, punks) {
      // console.log('getPunkDetails', id)
      // const file = Math.floor(id/1000)
      // const index = id - file*1000
      const item = punks[id]// allPunks[file][index]
      if (typeof item.accessories === 'string') item.accessories = item.accessories.split(' / ')
      // console.log(item.accessories)
      let imgId = '000' + item.id
      imgId = imgId.slice(imgId.length - 4)
      // item.img = `https://www.larvalabs.com/public/images/cryptopunks/punk${imgId}.png`
      item.img = `https://vpunks.com/images/vpunks/punk${imgId}.png`
      this.myGallery.push(item)
      // console.log(item)
      // this.debug && console.log(item)
    },

    // View Item Details -------------------------------------------------------
    // @
    viewItemDetails(tokenId) {
      if (window.showNFTDetails) window.showNFTDetails(tokenId)
    }
    // end View Item Details -------------------------------------------------------
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
}
.price-text {
  color: #CCCCCC;
  position: absolute;
  right:10px;
}
.tokenId-line {
  font-size: 14px;
  color: #ebebeb;
  width: 90px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.sefi {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon-setup-gr {
  position: absolute;
  right: 10px;
  font-size: 20px;
  padding: 10px 0px 0px 0px;
  .btn-share {
    background-color: transparent;
    color: #ffff;
    width: 42px;
    border-color: #525C9A;
    .el-icon-share {
      display: flex;
      justify-content: center;
    }
  }
  .el-button:hover, .el-button:focus {
    border-color: #747fc5;
  }
}
.tab-mode {
  margin-top: 5px;
  ::v-deep .el-tabs__nav {
    // white-space: pre-wrap;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  ::v-deep .el-tabs__nav {
    span {
      display: flex;
      align-items: center;
    }
  }
  ::v-deep .el-tabs__nav-scroll {
    display: -webkit-box;
    -webkit-box-pack: center;
    svg {
      width: 16px;
      height: 16px;
      margin-right: 2px;
    }
  }
  ::v-deep .el-tabs__nav-scroll .el-tabs__item.is-active {
    color: #ffffff;
  }
  ::v-deep .el-tabs__nav-scroll .el-tabs__active-bar {
    background-color: #45BBFF;
    height: 2px;
  }
  ::v-deep .el-tabs__nav-scroll .el-tabs__item:hover {
    color: #45BBFF;
  }
  ::v-deep .el-tabs__header .el-tabs__nav-wrap::after {
    background-color: #2e3670;
  }
}

::v-deep .el-dropdown .el-dropdown-menu .el-dropdown-menu__item:not(.is-disabled):hover, .el-dropdown-menu__item:hover {
  background-color: rgb(46, 54, 112) !important;
}

.gallery-container {
  // padding: 30px 20px 150px 20px;
  padding-bottom: 150px;
  .gallery-header {
    position: relative;
    display: flex;
    height: 320px;
    .top-banner {
      width: 100%;
      height: 320px;
      position: absolute;
      background-size: contain;
    }
    .top-banner1 {
      background-image: url("~@/assets/collections/vpunks-og/header-img-vp.jpg");
      display: flex;
      align-items: center;
      justify-content: center;
      .banner {
        position: relative;
        width: 90%;
        max-width: 770px;
      }
    }
  }
  .header-content {
    height: 0;
  }
  .avatar-cont {
    position: relative;
    bottom: 35px;
    text-align: center;
    .avt-loop {
      .el-carousel {
        background: #3e949b;
      }
    }
  }
  .name-gallery {
    display: flex;
    justify-content: center;
    margin-top: 120px;
    flex-direction: column;
    align-items: center;
    align-content: center;
    .btn-address-vpo {
      background: #3C4C76;
      color: #ffff;
      border-radius: 46px;
      border: none;
      box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.25);
      font-size: 15px;
      cursor: pointer;
    }
    .el-button:hover {
      background-color: #414f76;;
    }
  }
  .card-statistics {
    display: flex;
    justify-content: center;
    padding-right: 7px;
    padding-left: 7px;
    ::v-deep .el-card__body {
      padding: 0px;
    }
    .statistics {
      background-color: #c4c8d000;
      color: #fff;
      border: 2px solid #2e3670;
      border-radius: 12px;
      margin-bottom: 15px;
      margin-top: 25px;
      .list-statistics {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        .list-statistics-items {
          padding: 8px;
        }
      }
      .statistics-item {
        text-align: center;
        // font-size: 13px;
        width: 100%;
        height: 100%;
        border-radius: 12px;
        padding-right: 15px;
        padding-left: 15px;
        .statistics-item-number {
          color: #53A7FF;
          font-weight: bold;
        }
        .statistics-item-text {
          font-size: 14px;
          color: #dbdbdb;
        }
        .vet-icon1 {
          width: 14px;
          height: 14px;
          position: absolute;
          top: 2px;
          left: 5px;
        }
        .vet-icon2 {
          width: 14px;
          height: 14px;
          position: absolute;
          top: 2px;
          left: -5px;
        }
      }
    }
  }
  .popover-connection {
    .el-popover .el-popper {
      background-color: #000;
    }
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background .3s;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }
  }
}

.panel-group {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  // justify-content: flex-start;
  justify-content: center;
  .card-panel-col {
    margin-bottom: 32px;
    max-width: 206px;
    min-width: 192px;
  }

  .card-panel {
    height: 100%;
    padding: 5px 5px 5px 5px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    background: #202440;
    box-shadow: 3px 3px 30px rgba(0, 0, 0, .2);
    border-radius: 16px;
    min-width: 192px;
    .card-panel-icon-wrapper {
      height: 190px;
      text-align: center;
      background: #33a9af;
      cursor: pointer;
      border-radius: 10px;
      overflow: hidden;
      transition: all .5s;
      &:hover {
        background: #5ae1e8;
        transition: all .5s;
      }
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
      margin: 15px 5px 5px 5px;

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
          right: 10px;
        }
      }
      /*
      .card-panel-acces {
        margin: 4px 4px 0 0;
        padding: .4em .6em;
        background-color: #202440;
        border: 1px solid #606BBF;
        color: #fff;
        word-wrap: break-word;
        white-space: nowrap;
        display: inline-block;
        border-radius: .5rem;
        -webkit-border-radius: .5rem;
        -moz-border-radius: .5rem;
      } */
    }
  }
}
// responsive
@media screen and (max-width: 1030px) {
  .gallery-container {
    .gallery-header {
      .top-banner {
        background-size: cover;
      }
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
@media screen and (max-width: 415px) {
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
// for banner
@media screen and (max-width: 530px) {
  .gallery-container {
    .header-content {
      .avatar-cont {
        .avatar-circle {
          height: 125px !important;
          width: 125px !important;
          line-height: 125px !important;
        }
      }
    }
    .gallery-header {
      height: 200px;
      .top-banner1 {
        height: 200px;
      }
    }
    .name-gallery {
      margin-top: 95px;
    }
  }
}
</style>
