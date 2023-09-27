<template>
  <div>
    <el-table :data="allOffer" size="mini" border fit highlight-current-row>
      <el-table-column min-width="80px" align="center" label="Price">
        <template slot-scope="{row}">
          {{ row.price | fromWei }} VPU
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="Bidder">
        <template slot-scope="{row}">
          <el-link :href="row.bidderLink" target="_blank">{{ row.bidderV }}</el-link>
        </template>
      </el-table-column>
      <el-table-column min-width="80px" align="center" label="Duration">
        <template slot-scope="{row}">
          {{ row.durationV }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="100px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.canAccept==1" type="primary" size="mini" @click="acceptBid(row)">Accept</el-button>
          <el-button v-else-if="row.canAccept==2" type="warning" size="mini" @click="acceptBid()">Accept</el-button>
          <el-button v-else type="info" size="mini" disabled>Accept</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="getOfferLoading" style="text-align:center;padding-top:50px;"><span class="el-table__empty-text">Loading...</span></div>
  </div>
</template>

<script>
// import rarityInfo2 from '@/punks/_metadata-11-17.json'

const defaultTempStaking = {
  tokenId: '',
  price: '',
  duration: '',
  tokenAddress: '0xe92FDDD633008C1bca6E738725d2190cD46DF4a1', // VPunks
  paymentAddress: '0xb0821559723dB89e0Bd14FEE81E13a3aaE007e65' // VPU
}

export default {
  name: 'AllOffer',
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

<style>

</style>
