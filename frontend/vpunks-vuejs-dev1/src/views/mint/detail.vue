<template>
  <div class="smart-app-container mint-container">
    <!-- Mint box -->
    <div v-for="item in arrayMint" :key="item.id" class="loop">
      <div v-if="id == item.id" class="condition">
        <div class="min-box">
          <div class="min-box-item">
            <!-- <div class="image"> -->
            <el-image style="width: 100%; height: 200px; border-top-left-radius: 25px; border-top-right-radius: 25px;" :src="'./images/mint/' + item.img" alt="" fit="cover" lazy />
            <!-- </div> -->
            <div class="min-box-item-right">
              <div class="min-box-item-right-text">
                <h4>{{ item.name }}</h4>
                <p>{{ item.name1 }}</p>
              </div>
              <div class="min-box-item-right-scores">
                <span>{{ item.scores }}</span>
              </div>
            </div>
          </div>
          <div class="min-box-description">
            <h2>Mint <span style="color:#6CE23E">VPunks</span></h2>
            <p style="letter-spacing:1px">current cost is <span style="color:#6CE23E">{{ currentPrice | fromWei }} {{ nativeToken }}</span> to mint one VPunk</p>
            <p style="letter-spacing:1px;padding:5px;">☂️Airdrop⚡ For each VPunk minted you will receive 500 VPU
              <el-link href="#/token-and-contract" style="color:#6CE23E">(more info)</el-link>
            </p>
            <p style="letter-spacing:1px">VPunks left : {{ isConnected ? remainingNFT : '?' }}</p>
            <p><el-input v-model="numberOfNfts" placeholder="Amount of NFTs to mint" class="number-of-nfts" :disabled="mintButtonLoading" @blur="handleNumOfNfts" /><br>
              <span v-show="numNftError!=null" class="error">{{ numNftError }}</span>
            </p>
            <el-button type="success" :disabled="numNftError!=null" :loading="mintButtonLoading" @click="handleMint()">🛠 {{ mintButtonText }}</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- end Mint box -->

    <!-- Mint Cost -->
    <h3 style="margin: 50px 0 20px 0;">Cost to mint a VPunk</h3>
    <div ref="splitContainer" style="display:flex;flex-wrap:wrap;">
      <div :class="splitColClass" class="split-col">
        <el-table :data="costToMint1" border fit highlight-current-row>
          <el-table-column align="center" label="Order of NFT is minted" min-width="160">
            <template slot-scope="{row}">
              <b style="color:#6CE23E;">{{ row.order }}</b>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Cost" min-width="160">
            <template slot-scope="{row}">
              {{ row.cost | fromWei }} {{ nativeToken }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div :class="splitColClass" class="split-col">
        <el-table :data="costToMint2" border fit highlight-current-row>
          <el-table-column align="center" label="Order of NFT is minted" min-width="160">
            <template slot-scope="{row}">
              <b style="color:#6CE23E;">{{ row.order }}</b>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Cost" min-width="160">
            <template slot-scope="{row}">
              {{ row.cost | fromWei }} {{ nativeToken }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- end Mint boCostx -->

    <!-- Recently Minted -->
    <div style="margin-top:50px">
      <h3 style="margin: 20px 0 20px 0;">Recently Minted</h3>
      <el-row :gutter="gutter" class="panel-group">
        <el-col v-for="(item, index) of recentlyMinted" :key="item.id" :xs="elColXS" :sm="12" :lg="6" class="card-panel-col">
          <div :id="index===0&&'card-panel-first'" class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <img :src="item.img" class="card-panel-icon">
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                VPunk {{ item.id }}
                <span class="card-panel-type">{{ item.type }}</span>
              </div>
              <span v-for="(acces, index2) of item.accessories" :key="item.id+'-'+index2" class="card-panel-acces">{{ acces }}</span>
            </div>
            <div style="clear:both;text-align:center;" />
          </div>
        </el-col>
      </el-row>
      <div v-if="recentlyMinted.length===0" style="text-align:center;font-size:14px;"><span class="el-table__empty-text">No Data</span></div>
    </div>
    <!-- end Recently Minted -->
  </div>
</template>

<script>
import { isConnected } from '@/utils/validate'
import { nativeToken, explorerTx } from '@/settings'
import punks_1 from '@/punks/0-9999.json'
import { mintingList } from '@/data/mintingList.js'
export default {
  name: 'Detail',
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
      gutter: 40,
      elColXS: 12,
      address: null,
      isConnected: false,
      nativeToken: nativeToken,
      //
      remainingNFT: 0,
      currentPrice: new window.web3.utils.BN(),
      numberOfNfts: undefined,
      numNftError: null,
      infoChecking: false,
      mintButtonLoading: false,
      mintButtonText: 'Mint VPunks',
      //
      splitColClass: 'split-col50',
      costToMint1: [
        { order: '0 to 999', cost: '' },
        { order: '1000 to 1999', cost: '' },
        { order: '2000 to 2999', cost: '' },
        { order: '3000 to 3999', cost: '' },
        { order: '4000 to 4999', cost: '' }
      ],
      costToMint2: [
        { order: '5000 to 5999', cost: '' },
        { order: '6000 to 6999', cost: '' },
        { order: '7000 to 7999', cost: '' },
        { order: '8000 to 8999', cost: '' },
        { order: '9000 to 9999', cost: '' }
      ],
      //
      recentlyMinted: [],
      id: this.$route.params.id,
      arrayMint: mintingList
    }
  },
  created() {
    this.debug && console.log('created - Mint')
    this.isConnected = isConnected([true, true], [false, false]) // checkChainId, checkWallet
    if (!this.isConnected) return
    this.address = window.selectedAccount
    this.appendMintInfo(true) // getCurrentPrice: true
    this.$store.getters.instances.NFTContract.getPriceList().then(result => {
      this.debug && console.log(result.length)
      for (let i = 0; i < result.length; i++) {
        if (i <= 4) {
          this.costToMint1[i].cost = result[i]
        } else if (i <= 9) {
          this.costToMint2[i - 5].cost = result[i]
        }
      }
    }).catch(() => {})
  },
  mounted() {
    this.debug && console.log('mounted - Mint')
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
  },
  beforeDestroy: function() {
    this.debug && console.log('beforeDestroy - Mint')
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    // @
    handleWindowResize(event) {
      this.debug && console.log('innerWidth:', window.innerWidth)
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
      this.debug && console.log('gutter:', this.gutter)

      if (this.$refs.splitContainer.clientWidth >= 900) {
        this.splitColClass = 'split-col50'
      } else {
        this.splitColClass = 'split-col100'
      }
    },
    // @
    async appendMintInfo(getPrice) {
      this.infoChecking = true
      let _remainingNFT = await this.$store.getters.instances.NFTContract.remainingNFT().catch(() => {})
      if (_remainingNFT !== undefined) _remainingNFT = _remainingNFT.toNumber()
      if (getPrice) {
        const _currentPrice = await this.$store.getters.instances.NFTContract.getCurrentPrice().catch(() => {})
        if (_currentPrice !== undefined) this.currentPrice = _currentPrice
      }
      this.infoChecking = false
      if (this.remainingNFT !== _remainingNFT) {
        this.remainingNFT = _remainingNFT
        this.appendRecentlyMinted()
      }
    },

    // @
    handleNumOfNfts() {
      if (!isConnected([true, false], [true, false])) return
      this.numberOfNfts = parseInt(this.numberOfNfts)
      if (isNaN(this.numberOfNfts)) this.numberOfNfts = undefined
      this.debug && console.log(this.numberOfNfts)
      if (this.numberOfNfts > 20) {
        this.numNftError = 'You can only mint up to 20 VPunks at a time'
      } else if (this.numberOfNfts > this.remainingNFT) {
        this.numNftError = 'Exceeded the number of remaining VPunks'
      } else if (this.numberOfNfts <= 0) {
        this.numNftError = 'Number must be greater than 0'
      } else if (this.numberOfNfts > 0) {
        this.numNftError = null
      } else {
        this.numNftError = 'Please enter a valid number'
      }
      this.mintButtonText = this.numNftError === null ? `Mint ${this.numberOfNfts} x VPunks` : 'Mint VPunks'
    },
    // @
    async handleMint() {
      if (!isConnected([true, true], [true, true])) return
      this.handleNumOfNfts()
      if (this.numNftError !== null) return
      if (this.infoChecking) return
      this.mintButtonLoading = true
      const _currentPrice = await this.$store.getters.instances.NFTContract.getCurrentPrice().catch(() => {})
      if (!this.currentPrice.eq(_currentPrice)) {
        this.currentPrice = _currentPrice
        this.$alert('The cost to mint VPunk has changed.', 'Warning!!', {
          confirmButtonText: 'OK',
          type: 'warning'
        }).catch(() => {})
        this.mintNFTsDone(false)
        return
      }
      const value = this.currentPrice.mul(new window.web3.utils.BN(this.numberOfNfts))
      this.$store.getters.instances.NFTContract.mintNFT(this.numberOfNfts, { from: this.address, value }).then(async result => {
        this.debug && console.log('mintNFT result', result)
        //
        const txHash = result.txid
        const htmlStr = `transaction: <a href="${explorerTx}${txHash}" target="_blank" style="color:#53A7FF;word-break:break-all">${txHash}</a>`
        const transaction = await window.VeChainThor.waitTxReceipt(txHash)
        this.debug && console.log('transaction-result', transaction)
        if (transaction.reverted) {
          this.$alert(htmlStr, 'Transaction was reverted', {
            type: 'error',
            dangerouslyUseHTMLString: true
          }).catch(() => {})
        } else {
          this.$alert(htmlStr, 'Successfully minted NFT', {
            type: 'success',
            dangerouslyUseHTMLString: true
          }).catch(() => {})
        }
        //
        this.mintNFTsDone(true)
      }).catch(err => {
        this.debug && console.error(err.message)
        this.mintNFTsDone(true)
      })
    },
    // @
    mintNFTsDone(getPrice) {
      this.mintButtonLoading = false
      this.appendMintInfo(getPrice)
      // gtag
      this.$gtag.event('mintNFTsDone', { num: this.numberOfNfts })
    },

    // @
    async appendRecentlyMinted() {
      this.debug && console.log('appendRecentlyMinted')
      this.recentlyMinted = []
      const nftMinted = 10000 - this.remainingNFT
      if (nftMinted <= 0) return
      const start = nftMinted - 1
      let end = start - 3 // 3
      if (end < 0) end = 0
      for (let i = start; i >= end; i--) {
        const tokenId = await this.$store.getters.instances.NFTContract.tokenByIndex(i).catch(() => {})
        if (tokenId === undefined) continue
        const item = punks_1[tokenId.toNumber()]
        if (typeof item.accessories === 'string') item.accessories = item.accessories.split(' / ')
        let imgId = '000' + item.id
        imgId = imgId.slice(imgId.length - 4)
        // item.img = `https://www.larvalabs.com/public/images/cryptopunks/punk${imgId}.png`
        item.img = `https://vpunks.com/images/vpunks/punk${imgId}.png`
        this.recentlyMinted.push(item)
      }
    }
  }
}
</script>
<style lang="scss">
.mint-container {
  .min-box {
    &-description {
      .el-input--medium .el-input__inner {
        background: #D9D9D9;
        border-radius: 16px;
        color: #000;
        line-height: 40px;
        height: 40px;
      }
      & button {
        filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.25));
        border-radius: 18px;
      }
    }
  }
  .el-table.el-table--fit.el-table--border.el-table--enable-row-hover.el-table--enable-row-transition.el-table--medium {
    .el-table__body-wrapper {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(120px);
    }
  }
}
@media screen and (max-width: 480px) {
  .el-message-box__wrapper {
    .el-message-box {
      width: unset;
    }
  }
}
</style>
<style lang="scss" scoped>
.mint-container {
  .min-box {
    border: 2px dashed #bbb;
    padding: 10px;
    padding: min(max(5px, 3vw), 20px);
    display: flex;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(120px);
    &-item {
      width: 270px;
      // margin:10px 0px 0px 14px;
      box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.25);
      border-radius:25px;
      background-color: #202440;
      .image {
        height: 270px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #202440;
        border-top: 1px solid transparent;
        border-top-left-radius: 25px;
        border-top-right-radius: 25px;
        img {
          height: 100%;
          object-fit: cover;
        }
      }
      &-right {
        display: flex;
        justify-content:center;
        align-items: center;
        padding-inline: 10px;
        &-text {
          flex-grow: 1;
        }
        &-scores {
          flex-grow: 1;
          background: #558C3F;
          border-radius: 16px;
          line-height: 30px;
          text-align: center;
        }
      }
    }
    &-description {
      flex-grow: 8;
      text-align: center;
      .number-of-nfts {
        font-size:18px;
        padding-left: 15px;
      }
      .error {
        color: rgb(2, 234, 44);
        font-size: 15px;
      }
    }
  }
  .split-col {
    display: inline-block;
    padding: 15px 10px;
    padding-left: min(max(0px, 2vw), 20px);
    padding-right: min(max(0px, 2vw), 20px);
  }
  .split-col50 {
    width: 50%;
  }
  .split-col100 {
    width: 100%;
  }
}

.panel-group {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 100%;
    padding: 10px 5px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .1);
    border-color: rgba(0, 0, 0, .05);

    .card-panel-icon-wrapper {
      height: 200px;
      text-align: center;
      background: #c8c6e0;
    }

    .card-panel-icon {
      height: 100%;
      image-rendering: pixelated;
    }

    .card-panel-description {
      font-weight: bold;
      margin: 15px 15px 0 15px;

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
@media screen and (max-width: 750px) {
  .mint-container {
    .min-box {
      flex-wrap: wrap;
      &-item {
      }
      &-description {
        margin-top: 20px;
        .number-of-nfts {
          padding-left: 0;
        }
      }
    }
  }
}
</style>
