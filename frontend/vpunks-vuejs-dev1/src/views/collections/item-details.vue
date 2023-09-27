<template>
  <div class="smart-app-container item-details-container">
    <div class="list-item-container">
      <el-row :gutter="20" class="list-items">
        <el-col :span="9">
          <el-row class="item-img1">
            <img :src="VNFTData.img">
          </el-row>
          <el-row class="description">
            <el-card class="box-card">
              <div slot="header">
                <span>Description</span>
              </div>
              <span style="color: #c2c2c2">Created by<span style="color:#00A6FF">#1654564</span></span>
              <br>
              <span>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a</span>
            </el-card>
          </el-row>
          <el-row class="properties">
            <el-card class="box-card">
              <div slot="header">
                <span>Properties</span>
              </div>
              <el-row class="list-properties">
                <div class="list-properties-items">
                  <el-col class="properties-item">
                    <el-row style="color: #00A6FF">Lorem Ipsum</el-row>
                    <el-row>Lorem Ipsum</el-row>
                    <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                  </el-col>
                </div>
                <div class="list-properties-items">
                  <el-col class="properties-item">
                    <el-row style="color: #00A6FF">Lorem Ipsum</el-row>
                    <el-row>Lorem Ipsum</el-row>
                    <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                  </el-col>
                </div>
                <div class="list-properties-items">
                  <el-col class="properties-item">
                    <el-row style="color: #00A6FF">Lorem Ipsum</el-row>
                    <el-row>Lorem Ipsum</el-row>
                    <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                  </el-col>
                </div>
                <div class="list-properties-items">
                  <el-col class="properties-item">
                    <el-row style="color: #00A6FF">Lorem Ipsum</el-row>
                    <el-row>Lorem Ipsum</el-row>
                    <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                  </el-col>
                </div>
                <div class="list-properties-items">
                  <el-col class="properties-item">
                    <el-row style="color: #00A6FF">Lorem Ipsum</el-row>
                    <el-row>Lorem Ipsum</el-row>
                    <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                  </el-col>
                </div>
                <div class="list-properties-items">
                  <el-col class="properties-item">
                    <el-row style="color: #00A6FF">Lorem Ipsum</el-row>
                    <el-row>Lorem Ipsum</el-row>
                    <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                  </el-col>
                </div>
                <div class="list-properties-items">
                  <el-col class="properties-item">
                    <el-row style="color: #00A6FF">Lorem Ipsum</el-row>
                    <el-row>Lorem Ipsum</el-row>
                    <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                  </el-col>
                </div>
                <div class="list-properties-items">
                  <el-col class="properties-item">
                    <el-row style="color: #00A6FF">Lorem Ipsum</el-row>
                    <el-row>Lorem Ipsum</el-row>
                    <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                  </el-col>
                </div>
                <div class="list-properties-items">
                  <el-col class="properties-item">
                    <el-row style="color: #00A6FF">Lorem Ipsum</el-row>
                    <el-row>Lorem Ipsum</el-row>
                    <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                  </el-col>
                </div>
              </el-row>
            </el-card>
          </el-row>
          <el-row class="about-name-ex">
            <el-card class="box-card">
              <div slot="header">
                <span>About Name Exsample</span>
              </div>
              <div style="text-align: center; padding: 10px">
                <img src="@/assets/vpunks-logo-100x100.png">
              </div>
              <span>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five
                centuries, but also the leap into electronic typesetting, remaining essentially unchanged</span>
              <div class="social-media">
                <div v-for="(social, index) in socialMedia" :key="index" class="social-media-item">
                  <a :href="social.link" :target="social.target"><svg-icon :icon-class="social.name" /></a>
                </div>
              </div>
            </el-card>
          </el-row>
          <el-row class="details">
            <el-card class="box-card">
              <div slot="header">
                <span>Details</span>
              </div>
              <div class="infomation">
                <el-row :gutter="24">
                  <el-col :span="10">Contract Address</el-col>
                  <el-col :span="14" style="color:#00D4FF; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ address }}</el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="10">Token ID</el-col>
                  <el-col :span="14">{{ tokenId }}</el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="10">Token Standard</el-col>
                  <el-col :span="14" class="text-blue">ABC-000</el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="10">Blockchain</el-col>
                  <el-col :span="14" class="text-blue">Ethereum</el-col>
                </el-row>
              </div>
            </el-card>
          </el-row>
        </el-col>
        <el-col>
          <div class="name-item">
            <h1>Name token #{{ tokenId }}</h1>
            <el-row class="item-img2">
              <img :src="VNFTData.img">
            </el-row>
            <h3 style="color:#00D4FF">Vpunks Og</h3>
            <h3>Owned by <span style="color:#00A6FF">{{ address }}</span></h3>
          </div>
          <div class="price-list">
            <el-row :gutter="24">
              <el-col :span="7">Current Price</el-col>
              <el-col :span="14" class="text-blue">
                <img src="@/assets/tokens-symbol/vet.svg">
                1 ETH - (2.914,63 USD)</el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="7">Start Price</el-col>
              <el-col :span="14">1 ETH - (2.914,63 USD)</el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="7">End Price</el-col>
              <el-col :span="14" class="text-blue">1 ETH - (2.914,63 USD)</el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="7">Duration <i style="color: #ffff" class="el-icon-timer" /></el-col>
              <el-col :span="14" class="text-blue">0h0m0s</el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="7">Status</el-col>
              <el-col :span="14" class="text-blue">
                <el-button style="color: #33BA74;" round>Sell</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-button
                style="background: #558C3F;
                border-radius: 16px;
                border: none;
                color: #ffff"
              >Buy now
              </el-button>
              <el-button
                style="background: rgb(152 152 152);
                border-radius: 16px;
                border: none;
                color: #ffff"
              ><img src="@/assets/tag.svg">Make offer
              </el-button>
            </el-row>
          </div>
          <el-row class="priceHistory">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="Price history" name="1">
                <el-row :gutter="20" style="margin: 0; padding-top: 10px;">
                  <el-col :span="5">
                    <el-dropdown>
                      <el-button
                        type="primary"
                        style="background: #558C3F;
                        border-radius: 16px;
                        border: none;
                        color: #ffff"
                      >
                        Last 90 days <i class="el-icon-caret-bottom el-icon--right" />
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>Action 1</el-dropdown-item>
                        <el-dropdown-item>Action 2</el-dropdown-item>
                        <el-dropdown-item>Action 3</el-dropdown-item>
                        <el-dropdown-item>Action 4</el-dropdown-item>
                        <el-dropdown-item>Action 5</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                  <el-col :span="5" class="allTimePrice" style="padding-left: 25px">
                    <el-row>
                      <span style="color:#fff">All Time Avg.Price</span>
                    </el-row>
                    <el-row>
                      <span style="color:#00A6FF">00.00</span>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row class="chart-img">
                  <img style="max-width:100%; padding: 10px" src="@/assets/Group 1382.png">
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-row>
          <el-row class="listing">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="Listing" name="2">
                <div class="listing-item">
                  <el-table
                    :data="tableData"
                    fit
                    highlight-current-row
                    style="max-width: 95%"
                  >
                    <el-table-column
                      prop="price"
                      label="Price"
                      min-width="100px"
                      align="center"
                    />
                    <el-table-column
                      prop="usdPrice"
                      label="USD price"
                      min-width="145px"
                      align="center"
                    />
                    <el-table-column
                      prop="expriation"
                      label="Expiration"
                      min-width="100px"
                      align="center"
                    />
                    <el-table-column
                      prop="from"
                      label="From"
                      min-width="145px"
                      align="center"
                    />
                    <el-table-column
                      role="cell"
                      min-width="145px"
                      align="center"
                    >
                      <template>
                        <el-button
                          style="background: #558C3F;
                        border-radius: 16px;
                        border: none;
                        vertical-align: middle;
                        color: #ffff"
                        >Buy
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-row>
          <el-row class="offer">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="Offer" name="3">
                <div class="offer-table">
                  <el-table
                    :data="tableData"
                    fit
                    highlight-current-row
                    style="max-width: 95%"
                  >
                    <el-table-column
                      prop="price"
                      label="Price"
                      min-width="100px"
                      align="center"
                    />
                    <el-table-column
                      prop="usdPrice"
                      label="USD Price"
                      min-width="145px"
                      align="center"
                    />
                    <el-table-column
                      prop="floorDifference"
                      label="Floor Difference"
                      width="145px"
                      align="center"
                    />
                    <el-table-column
                      prop="expiration"
                      label="Expiration"
                      min-width="100px"
                      align="center"
                    />
                    <el-table-column
                      prop="from"
                      label="From"
                      max-width="145px"
                      align="center"
                    />
                  </el-table>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-row>
        </el-col>
      </el-row>
      <div class="list-item-below">
        <el-row class="itemActivity">
          <el-card class="box-card">
            <div slot="header">
              <span>Item Activity</span>
            </div>
            <div class="inputActivity">
              <el-input v-model="input" placeholder="Please input" style="max-width: 95%;" />
            </div>
            <div class="item-activity">
              <el-table
                :data="tableData"
                fit
                highlight-current-row
                style="max-width: 95%;"
              >
                <el-table-column prop="event" label="Event" min-width="80px" />
                <el-table-column
                  prop="price"
                  label="Price"
                  min-width="60px"
                />
                <el-table-column
                  prop="from"
                  label="From"
                  min-width="100px"
                />
                <el-table-column
                  prop="to"
                  label="To"
                  min-width="50px"
                />
                <el-table-column
                  prop="date"
                  label="Date"
                  min-width="150px"
                />
              </el-table>
            </div>
          </el-card>
        </el-row>
        <el-row class="more-from-this">
          <el-card class="box-card">
            <div slot="header">
              <span>More from this</span>
            </div>
            <span>Comming soon</span>
            <br>
            <span>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a</span>
          </el-card>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import punks_1 from '@/punks/0-9999-v3.json'
import rarityInfo from '@/punks/rarity-info.json'
// import { explorerAddress, explorerTx } from '@/settings'

// const defaultTempStaking = {
//   tokenId: '',
//   price: '',
//   duration: '',
//   tokenAddress: '0xe92FDDD633008C1bca6E738725d2190cD46DF4a1', // VPunks
//   paymentAddress: '0xb0821559723dB89e0Bd14FEE81E13a3aaE007e65' // VPU
// }

export default {

  name: 'ItemDetails',
  filters: {
    fromWei(w) {
      if (typeof w !== 'object') return w
      return window.web3.utils.fromWei(w, 'ether')
    }
  },
  data() {
    return {
      // general
      debug: false,
      //
      input: '',
      activeNames: ['1'],
      tableData: [{
        event: 'Sale',
        price: '00.00',
        from: 'name exsample',
        to: '-',
        date: '24 Hours ago'
      }, {
        event: 'Sale',
        price: '00.00',
        from: 'name exsample',
        to: '-',
        date: '24 Hours ago'
      }, {
        event: 'Sale',
        price: '00.00',
        from: 'name exsample',
        to: '-',
        date: '24 Hours ago'
      }, {
        event: 'Sale',
        price: '00.00',
        from: 'name exsample',
        to: '-',
        date: '24 Hours ago'
      }],
      // socialMedia
      socialMedia: [
        { link: 'https://discord.gg/vpunks', name: 'discord', target: '_blank' },
        { link: 'https://twitter.com/vpunksofficial', name: 'twitter', target: '_blank' },
        { link: 'https://twitter.com/vpunksofficial', name: 'browser', target: '_blank' }
      ],
      VNFTData: {
        img: '',
        tokenId: null,
        rank: null,
        accessories: [],
        rarityInfo: []
      },
      tokenId: this.$route.params.tokenId,
      address: this.$route.params.address,
      myGallery: []
    }
  },
  mounted() {
    this.debug && console.log('mounted - Gallery')
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
  },
  beforeDestroy() {
    this.debug && console.log('beforeDestroy - Gallery')
    window.removeEventListener('resize', this.handleWindowResize)
  },
  created() {
    this.VNFTData = this.getPunkDetails(this.tokenId)
  },
  methods: {
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
    },
    //
    searchInput(value) {
      this.debug && console.log('searchInput-value', value)
      if (value.length === 0) {
        this.getPunkList()
        return
      }
      if (value >= this.totalPunks) return
      this.myGallery = []
      this.getPunkDetails(value)
    },
    // @
    getPunkList() {
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

      this.myGallery = []
      const start = this.NFTQuery.page * this.NFTQuery.limit - this.NFTQuery.limit
      let end = this.NFTQuery.page * this.NFTQuery.limit - 1
      if (end > this.totalPunks - 1) end = this.totalPunks - 1
      this.debug && console.log('page: ' + this.NFTQuery.page + ', start: ' + start + ', end: ' + end)
      for (let i = start; i <= end; i++) {
        this.getPunkDetails(i)
      }
      if (this.NFTQuery.page !== this.urlQueryPage) {
        this.urlQueryPage = this.NFTQuery.page
        this.$router.replace({ name: this.$router.history.current.name, query: { page: this.NFTQuery.page }})
      }
    },
    // @
    getPunkDetails(tokenId) {
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
      // console.log('----', item)
      return item
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

<style lang="scss">
.item-details-container {
    display: flex;
    justify-content: center;
  .list-items {
    display: flex;
    justify-content: center;
  }
  .list-items-down {
    display: flex;
    justify-content: center;
  }
  color: rgb(255, 255, 255, 0.95);
  .list-item-container {
    .item-img1 {
      border: 1px solid #001859;
      border-radius: 12px;
      margin-bottom: 10px;
      text-align: center;
      img {
        width: 300px;
        image-rendering: pixelated;
        padding: 15px;
      }
    }
    .el-card {
      background-color: #3C4C76;
      color: #fff;
      border: 1px solid #001859;
      border-radius: 12px;
      margin-bottom: 15px;
      max-width: 1787px;
      min-width: 265px;
    }
    .el-collapse {
      border-top: 1px solid #001859;
      border-bottom: none;
      margin-bottom: 10px;
      border-radius: 12px;
      .el-collapse-item__header {
        background-color: #3C4C76;
        border: 1px solid #001859;
        color: #fff;
        border-top: none;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        padding: 31px 20px;
        font-size: 22px;
      }
      .el-collapse-item__wrap {
        background-color: #3C4C76;
        border: 1px solid #001859;
        border-top: 0;
        border-bottom-right-radius: 12px;
        border-bottom-left-radius: 12px;
      }
    }
    .el-card__body {
      padding: 10px !important;
    }
    .el-card__header {
      border-bottom: 1px solid #001859;
      font-size: 22px;
    }

    .list-properties {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      &-items {
        padding: 5px;
      }
    }
    .properties-item {
      border: 1px solid #001859;
      text-align: center;
      font-size: 13px;
      width: 100%;
      height: 100%;
      border-radius: 12px;
      padding: 6px;
      // padding-inline: 10px;
    }
    .about-name-ex {
      .social-media {
        display: flex;
        justify-content: left;
        align-items: center;
      }
      .social-media-item {
        text-align: center;
      }
      .social-media a {
        width: auto !important;
        transition: 0.5s ease-out;
      }
      .social-media a:hover {
        opacity: 0.6;
      }
      .social-media-item a svg {
        width: 50px;
        height: 50px;
      }
      .social-media-item .svg-icon {
        margin-right: 0 !important;
      }
      img {
        justify-content: center;
        -ms-flex-wrap: wrap-reverse;
        flex-wrap: wrap-reverse;
      }
    }
    .details {
      .el-row {
        margin-bottom: 10px;
      }
    }
    .price-list {
      border: 1px solid #001859;
      border-radius: 16px;
      font-size: 20px;
      background-color: #3C4C76;
      margin-bottom: 10px;
      .el-row {
        padding: 15px;
      }
      .el-col-7 {
        width: 37%;
        padding-right: 0 !important;
      }
      img {
        width: 15px;
        height: 15px;
        vertical-align: middle;
      }
    }
    .priceHistory {
      .el-col-5 {
        width: 50%;
        .allTimePrice {
          .el-col-5 {
            padding-left: 25px !important;
          }
        }
      }
      .chart-img {
        display: flex;
        justify-content: center;
      }
    }
    .listing {
      .listing-item {
        margin-top: 8px;
        justify-content: center;
        display: flex;
        text-align: center;
      }
      .el-col-4 {
        margin-top: 8px;
        width: 20%;
      }
    }
    .offer {
      .offer-table {
        margin-top: 8px;
        justify-content: center;
        display: flex;
        text-align: center;
      }
      .el-col-4 {
        margin-top: 8px;
        width: 20%;
      }
    }
    .name-item {
      .item-img2 {
        border: 1px solid #001859;
        border-radius: 12px;
        margin-bottom: 10px;
        text-align: center;
        img {
          width: 300px;
          image-rendering: pixelated;
          padding: 15px;
        }
      }
    }
    .itemActivity {
      font-size: 20px;
      // justify-content: center;
      // display: flex;
      .inputActivity {
        justify-content: center;
        display: flex;
        text-align: center;
        .el-input--medium .el-input__inner {
          background: rgba(255, 255, 255, 0.5);
          box-shadow: inset 0px 4px 4px rgb(0 0 0 / 25%);
          border-radius: 10px;
        }
      }
      .item-activity {
        margin-top: 8px;
        justify-content: center;
        display: flex;
        text-align: center;
      }
    }
  }
  @media screen and (min-width: 1245px) {
    .name-item {
      .item-img2{
          display: none;
      }
    }
  }
  @media screen and (max-width: 1246px) {
    .list-items {
      flex-wrap: wrap-reverse;
      .el-col-9 {
        width: 100%;
      }
    }
    .item-img1{
        display: none;
    }
  }
  @media screen and (max-width: 850px) {
  .list-item-container {
    font-size: 13.5px;
    .price-list {
      font-size: 13.5px;
    }
    .listing {
      font-size: 13.5px;
    }
    .offer {
      font-size: 13.5px;
    }
    .itemActivity {
      .el-table {
        font-size: 13.5px;
      }
    }
  }
  }
  @media screen and (max-width: 685px){
    .offer {
      .el-table {
        max-width: 400px !important;
        width: 100%;
      }
    }
    .listing-item {
      .el-table {
        max-width: 400px !important;
        width: 100%;
      }
    }
    .itemActivity {
      .el-table {
        max-width: 400px !important;
        width: 100%;
      }
    }
    @media screen and (max-width: 450px){
      .offer {
        .el-table {
          max-width: 250px !important;
          width: 100%;
        }
      }
      .listing-item {
        .el-table {
          max-width: 250px !important;
          width: 100%;
        }
      }
      .itemActivity {
        .el-table {
          max-width: 250px !important;
          width: 100%;
        }
      }
    }
  }
}
</style>
