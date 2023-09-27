<template>
  <div>
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
  </div>
</template>

<script>
const defaultTempStaking = {
  tokenId: '',
  price: '',
  duration: '',
  tokenAddress: '0xe92FDDD633008C1bca6E738725d2190cD46DF4a1', // VPunks
  paymentAddress: '0xb0821559723dB89e0Bd14FEE81E13a3aaE007e65' // VPU
}

export default {
  name: 'Details',
  filters: {
    fromWei(w) {
      if (typeof w !== 'object') return w
      return window.web3.utils.fromWei(w, 'ether')
    }
  },
  props: [
    'VNFTData'
  ],
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
      //   VNFTData: {
      //     tokenId: null,
      //     rank: null,
      //     accessories: [],
      //     rarityInfo: []
      //   },
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
  }
}
</script>

<style lang="scss">
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

</style>
