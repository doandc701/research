<template>
  <div>
    <!-- Dialog Bid Offer -->
    <div v-if="createBidOffers.length>0" style="display:inline-block">
      <el-badge :is-dot="true" class="badge-bid" @click.native="openCreateBidOffers">
        <el-button class="badge-btn-bid" size="small" type="success">
          B <i class="el-icon-sort-up" />
        </el-button>
      </el-badge>

      <el-dialog v-loading="dlogBidOfferLoading" :visible.sync="dlogBidOfferVisible" :width="dialogBidWidth" append-to-body @close="onCloseDlogBidOf">
        <div slot="title">
          <span style="padding-right: 10px;">Place Bids</span>
          <el-button size="mini" type="primary" icon="el-icon-delete" @click="clearAllBidOf">Clear All</el-button>
        </div>
        <el-table :data="createBidOffers" border fit highlight-current-row>
          <el-table-column align="center" label="TokenId" min-width="80">
            <template slot-scope="{row}">
              <b style="font-size: 16px;">{{ row.tokenId }}</b>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="Price">
            <template slot-scope="{row}">
              <span>{{ row.price | fromWei }} VPU</span>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="Duration">
            <template slot-scope="{row}">
              <span>{{ row.duration | fromWei }} days</span>
            </template>
          </el-table-column>

          <el-table-column label="Actions" align="center" width="100px" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button type="info" size="mini" @click="removeBidOf(row)">Remove</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div style="text-align:right;margin:8px 0 -22px 0;">selected {{ createBidOffers.length }}/{{ createBidMax }}</div>
        <div class="total-bid-info">
          <div>Total bid price: <b style="color:#10e66f">{{ totalBidPrice | fromWei }}</b> VPU</div>
          <div>Your balance in contract: {{ checkUserBalanceBtnLoading ? '...' : userBalanceInContract | fromWei }} VPU
            <el-button v-loading="checkUserBalanceBtnLoading" icon="el-icon-refresh" circle @click="recheckUserBalance2" />
          </div>
          <div v-if="depositRequired" style="color:#e6a700;word-break: break-word;">With smart bid mode you do not need to deposit the entire bid amount into the contract, but when you have more than 1 bid, the contract will ask you to deposit 300 more VPU to lock them until the bids are successful or removed.</div>
        </div>
        <div class="total-bid-info2">
          <div>Your balance: {{ userBalanceInNetwork | fromWei }} VPU</div>
          <div>Need to send to contract: <b style="color:#10e66f">{{ amountSendToContract | fromWei }}</b> to <b style="color:#10e66f">{{ amountSendToContract2 | fromWei }}</b> VPU</div>
          <el-input v-model="inputDeposit" placeholder="enter VPU" @blur="validateInputDeposit">
            <template slot="append">VPU</template>
          </el-input>
          <div v-if="inputError" class="input-error">{{ inputError }}</div>
        </div>
        <div slot="footer">
          <el-button type="success" @click="startBidOF">Submit</el-button>
          <el-button @click="dlogBidOfferVisible = false">Add more</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- end Dialog Bid Offer -->

    <!-- Dialog Bid Auction -->
    <div v-if="bidAuctions.length>0" style="display:inline-block">
      <el-badge :is-dot="true" class="badge-bid" @click.native="openBidAuc">
        <el-button class="badge-btn-bid" size="small" type="success">
          <i class="el-icon-alarm-clock" /> B
        </el-button>
      </el-badge>

      <el-dialog v-loading="dialogBidALoading" :visible.sync="dialogBidAVisible" :width="dialogBidWidth" append-to-body @close="onCloseDialogBid">
        <div slot="title">
          <span style="padding-right: 10px;">Bid Auctions</span>
          <el-button size="mini" type="primary" icon="el-icon-delete" @click="clearAllBidAuc">Clear All</el-button>
          <el-link href="https://en.wikipedia.org/wiki/Dutch_auction" target="_blank" rel="noopener" class="dutch-auction-wiki">
            What is dutch auction <i class="el-icon-question" />
          </el-link>
        </div>
        <el-table :data="bidAuctions" border fit highlight-current-row>
          <el-table-column align="center" label="TokenId" min-width="80">
            <template slot-scope="{row}">
              <b style="font-size: 16px;">{{ row.tokenId }}</b>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="Current Price">
            <template slot-scope="{row}">
              <b style="color:#18caff;">{{ row.currentPrice | fromWei }}</b> {{ nativeToken }}
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="Starting Price">
            <template slot-scope="{row}">
              <span>{{ row.startingPrice | fromWei }} {{ nativeToken }}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="Ending Price">
            <template slot-scope="{row}">
              <span>{{ row.endingPrice | fromWei }} {{ nativeToken }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Actions" align="center" width="100px" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button type="info" size="mini" @click="removeBidAuc(row)">Remove</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div style="text-align:right;margin:8px 0 -22px 0;">selected {{ bidAuctions.length }}/{{ bidAucMax }}</div>
        <div class="total-bid-info">
          <div>Total bid price: <b style="color:#10e66f">~{{ totalBidPrice | fromWei }}</b> {{ nativeToken }}</div>
          <div>Your balance in contract: {{ checkUserBalanceBtnLoading ? '...' : userBalanceInContract | fromWei }} {{ nativeToken }}
            <el-button v-loading="checkUserBalanceBtnLoading" icon="el-icon-refresh" circle @click="recheckUserBalance" />
          </div>
          <div>Need to send to contract: <b style="color:#10e66f">{{ amountSendToContract | fromWei }}</b> {{ nativeToken }}</div>
        </div>
        <div slot="footer">
          <el-button type="success" @click="startBidAuc">Submit</el-button>
          <el-button @click="dialogBidAVisible = false">Add more</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- end Dialog Bid Auction -->

    <!-- Dialog Pre Create|Edit Auction -->
    <el-dialog :visible.sync="dialogPreCEAVisible" :title="dialogPreCEATitle" :width="dialogPreCEAWidth" append-to-body>
      <el-link href="https://en.wikipedia.org/wiki/Dutch_auction" target="_blank" rel="noopener" class="dutch-auction-wiki">
        What is dutch auction <i class="el-icon-question" />
      </el-link>
      <el-form ref="CEAForm" :rules="rules" :model="tempPreCEAuction" label-position="left" label-width="170px" :style="{margin: CEAFormMargin}">
        <el-form-item label="TokenId">
          <el-tag effect="plain" style="font-size: 18px;">{{ tempPreCEAuction.tokenId }}</el-tag>
        </el-form-item>
        <el-form-item label="Starting price" prop="startingPrice">
          <el-input ref="startingPrice2" v-model="tempPreCEAuction.startingPrice" :placeholder="`in ${ nativeToken }`">
            <template slot="append">{{ nativeToken }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Ending price" prop="endingPrice">
          <el-input v-model="tempPreCEAuction.endingPrice" :placeholder="`in ${ nativeToken }`">
            <template slot="append">{{ nativeToken }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Duration of auction" prop="duration">
          <el-input v-model="tempPreCEAuction.duration" placeholder="in Hours">
            <template slot="append">Hours</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Close when timeout">
          <el-switch v-model="tempPreCEAuction.closeWhenTimeout" />
          <el-tooltip class="item" effect="dark" content="If set to true, when the time expires, other people won't be able to buy this item" placement="top">
            <i class="el-icon-question" style="margin-left:10px;" />
          </el-tooltip>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="addPreCEAucToCart()">Add auction</el-button>
        <el-button @click="dialogPreCEAVisible = false">Cancel</el-button>
      </span>
    </el-dialog>
    <!-- end Dialog Pre Create|Edit Auction -->

    <!-- Dialog Create|Edit Auction -->
    <div v-if="createAuctions.length>0" style="display:inline-block">
      <el-badge :is-dot="true" class="badge-create" @click.native="openCreateAuc">
        <el-button class="badge-btn-create" size="small" type="success">
          <i class="el-icon-alarm-clock" /> S
        </el-button>
      </el-badge>

      <el-dialog v-loading="dialogCEALoading" :visible.sync="dialogCEAVisible" :width="dialogBidWidth" append-to-body>
        <div slot="title">
          <span style="padding-right: 10px;">Create|Edit Auctions</span>
          <el-button size="mini" type="primary" icon="el-icon-delete" @click="clearAllCreateAuc">Clear All</el-button>

        </div>
        <el-table :data="createAuctions" border fit highlight-current-row>
          <el-table-column min-width="80px" align="center" label="TokenId">
            <template slot-scope="{row}">
              <b style="color:#53A7FF;">{{ row.tokenId }}</b>
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="Starting Price">
            <template slot-scope="{row}">
              {{ row.startingPrice }} {{ nativeToken }}
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="Ending Price">
            <template slot-scope="{row}">
              {{ row.endingPrice }} {{ nativeToken }}
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="Duration">
            <template slot-scope="{row}">
              {{ row.duration }} hours
            </template>
          </el-table-column>

          <el-table-column width="80px" align="center" label="Close When Timeout">
            <template slot="header">
              CWT
              <el-tooltip class="item" effect="dark" content="Close When Timeout" placement="top">
                <i class="el-icon-question" />
              </el-tooltip>
            </template>
            <template slot-scope="{row}">
              <el-switch v-model="row.closeWhenTimeout" disabled />
            </template>
          </el-table-column>

          <el-table-column min-width="120px" align="center" label="Allow Transfer">
            <template slot-scope="{row}">
              <span v-if="row.actionType==1&&isApprovedForAll" style="color:#5cb85c;">approved for all</span>
              <span v-else-if="row.actionType==1&&row.approved" style="color:#5cb85c;">approved</span>
              <span v-else-if="row.actionType==1&&!row.approved" style="color:#ff0000;font-size:20px;">*
                <el-button v-loading="row.approved===undefined" type="primary" plain size="mini" @click="setApprove(row)">Approve</el-button>
              </span>
              <span v-else style="color:#5cb85c;">update auction</span>
            </template>
          </el-table-column>

          <el-table-column width="150px" label="Actions" align="center" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button size="mini" @click="editCreateAuc(row)">Edit</el-button>
              <el-button type="info" size="mini" @click="removeCreateAuc(row)">Remove</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div style="margin:18px 0 -22px 0;">
          <span v-if="!isApprovedForAll">
            <span>is Approved For All: {{ checkApprovedBtnLoading ? "....." : "false" }}</span>
            <span v-if="needApproval" style="padding-left:10px;">
              <el-button v-loading="checkApprovedBtnLoading" icon="el-icon-refresh" circle @click="recheckApprovedForAll" />
              <el-button type="primary" plain size="mini" @click="setApprovalForAll(true)">set Approval For All</el-button>
              (recommended)
            </span>
          </span>
          <span v-else>
            <span style="color:#37a237;">is Approved For All <i class="el-icon-circle-check" /></span>
            <span v-if="debug" style="padding-left:10px;">
              <el-button type="primary" plain size="mini" @click="setApprovalForAll(false)">remove Approval For All</el-button>
            </span>
          </span>

          <span style="float:right;">selected {{ createAuctions.length }}/{{ createAucMax }}</span>
        </div>
        <div slot="footer">
          <el-button type="success" @click="startCreateAuc">Submit</el-button>
          <el-button @click="dialogCEAVisible = false">Add more</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- end Dialog Create|Edit Auction -->

    <!-- Dialog Cancel Auction -->
    <div v-if="cancelAuctions.length>0" style="display:inline-block">
      <el-badge :is-dot="true" class="badge-cancel" @click.native="openCancelAuc">
        <el-button class="badge-btn-cancel" size="small" type="danger">
          <i class="el-icon-alarm-clock" />C
        </el-button>
      </el-badge>

      <el-dialog v-loading="dialogCALoading" :visible.sync="dialogCAVisible" :width="dialogCancelWidth" append-to-body>
        <div slot="title">
          <span style="padding-right: 10px;">Cancel Auctions</span>
          <el-button size="mini" type="primary" icon="el-icon-delete" @click="clearAllCancelAuc">Clear All</el-button>
        </div>
        <el-table :data="cancelAuctions" border fit highlight-current-row>
          <el-table-column align="center" label="TokenId" min-width="70">
            <template slot-scope="{row}">
              <b style="color:#53A7FF;">{{ row.tokenId }}</b>
            </template>
          </el-table-column>

          <el-table-column align="center" label="Started At (UTC)" min-width="120">
            <template slot-scope="{row}">
              {{ row.startedAt | _parseTime | parseTime('{y}-{m}-{d} {h}:{i}:{m}') }}
            </template>
          </el-table-column>

          <el-table-column label="Actions" align="center" width="90px" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button type="info" size="mini" @click="removeCancelAuc(row)">Remove</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div style="text-align:right;margin:8px 0 -22px 0;">selected {{ cancelAuctions.length }}/{{ cancelAucMax }}</div>
        <div slot="footer">
          <el-button type="success" @click="startCancelAuc">Submit</el-button>
          <el-button @click="dialogCAVisible = false">Add more</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- end Dialog Cancel Auction -->

    <!-- Dialog Notification -->
    <el-dialog :visible.sync="dialogNotifiVisible" :width="dialogNotifiWidth" append-to-body @close="onCloseDialogNotifi">
      <div slot="title">
        <span style="padding-right: 10px;">{{ dialogNotifiTitle }}</span>
      </div>
      <el-table :data="auctionResults" border fit highlight-current-row>
        <el-table-column align="center" label="TokenId" min-width="80">
          <template slot-scope="{row}">
            <b style="color:#53A7FF;">{{ row.tokenId }}</b>
          </template>
        </el-table-column>
        <el-table-column label="Status" min-width="190">
          <template slot-scope="{row}">
            <div>
              <el-tag :type="row.success ? 'success': 'danger'">
                {{ row.status }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin:20px 0 -22px 0;word-break: break-all;">
        Transaction: <el-link type="primary" :href="dialogNotifiTxLink" target="_blank"><i class="el-icon-link" />{{ dialogNotifiTxHash }}</el-link>
      </div>
      <div slot="footer">
        <el-button @click="dialogNotifiVisible = false">Close</el-button>
      </div>
    </el-dialog>
    <!-- end Dialog Notification -->
  </div>
</template>

<script>
import { isConnected } from '@/utils/validate'
import { nativeToken, explorerTx } from '@/settings'

const defaultTempPreCEAuc = {
  tokenId: '',
  startingPrice: '',
  endingPrice: '',
  duration: '',
  closeWhenTimeout: false,
  approved: false,
  actionType: 1 // 1: Create, 2: Edit
}
// return Int || '' (nen su dụng try parse)
const validateInt = (value) => {
  if (value === '' || value === null || value === undefined) return ''
  try {
    const _value = parseInt(value)
    if (isNaN(_value)) return ''
    return _value
  } catch (error) {
    return ''
  }
}

export default {
  name: 'AuctionCart',
  filters: {
    _parseTime(timestamp) {
      const t = new Date(1970, 0, 1) // Epoch
      t.setSeconds(timestamp)
      return t
    },
    fromWei(w) {
      if (typeof w !== 'object') return w
      return window.web3.utils.fromWei(w, 'ether')
    }
  },
  data() {
    const validateStartingPrice = (rule, value, callback) => {
      this.startingPriceValidated = false
      if (value === '') return callback(new Error('Starting price is required'))
      try {
        const _value = this.tempPreCEAuction.startingPrice.replace(/[^\d.]/g, '')
        const priceWei = window.web3.utils.toWei(_value, 'ether')
        this.tempPreCEAuction.startingPrice = window.web3.utils.fromWei(priceWei, 'ether')
        if (this.tempPreCEAuction.startingPrice === '0') return callback(new Error('Starting price must be greater than 0'))
        this.startingPriceValidated = true
        if (this.endingPriceValidated) {
          const a = new window.web3.utils.BN(this.tempPreCEAuction.startingPrice)
          const b = new window.web3.utils.BN(this.tempPreCEAuction.endingPrice)
          if (a.lt(b)) return callback(new Error('Starting price must be bigger than or equal to Ending price'))
        }
        return callback()
      } catch (error) {
        // console.log(error)
        return callback(new Error('invalid number value'))
      }
    }
    const validateEndingPrice = (rule, value, callback) => {
      this.endingPriceValidated = false
      if (value === '') return callback(new Error('Ending price is required'))
      try {
        const _value = this.tempPreCEAuction.endingPrice.replace(/[^\d.]/g, '')
        const priceWei = window.web3.utils.toWei(_value, 'ether')
        this.tempPreCEAuction.endingPrice = window.web3.utils.fromWei(priceWei, 'ether')
        if (this.tempPreCEAuction.endingPrice === '0') return callback(new Error('Ending price must be greater than 0'))
        this.endingPriceValidated = true
        if (this.startingPriceValidated) {
          this.$refs['startingPrice2'].focus()
          this.$nextTick(() => {
            this.$refs['startingPrice2'].blur()
          })
        }
        callback()
      } catch (error) {
        // console.log(error)
        return callback(new Error('invalid number value'))
      }
    }
    const validateDuration = (rule, value, callback) => {
      if (value === '') return callback(new Error('Duration is required'))
      try {
        let _value = parseFloat(this.tempPreCEAuction.duration)
        if (isNaN(_value)) {
          this.tempPreCEAuction.duration = undefined
          callback(new Error('invalid number value'))
        } else {
          if (_value > 8760) _value = 8760
          this.tempPreCEAuction.duration = _value
          if (Math.floor(_value * 3600) < 60) return callback(new Error('Duration must be greater than or equal to 1 minutes'))
          callback()
        }
      } catch (error) {
        // console.log(error)
        return callback(new Error('invalid number value'))
      }
    }
    //
    return {
      // general
      debug: false,
      // address: null,
      nativeToken: nativeToken,

      // Dialog Bid Bid/Offer
      dlogBidOfferVisible: false,
      dlogBidOfferLoading: false,
      createBidMax: 0,
      amountSendToContract2: new window.web3.utils.BN(),
      userBalanceInNetwork: new window.web3.utils.BN(),
      totalBidOfBidder: 0,
      userErc20Locked: {
        0: '', 1: new window.web3.utils.BN()
      },
      inputDeposit: '',
      inputDepositWei: new window.web3.utils.BN(),
      highestBid: new window.web3.utils.BN(),
      depositRequired: false,
      inputError: '',
      // general
      // dialogBidWidth: '90%',
      // checkUserBalanceBtnLoading: false,
      // totalBidPrice: new window.web3.utils.BN(),
      // userBalanceInContract: new window.web3.utils.BN(),

      cancelBidMax: 0,
      acceptBidMax: 0,

      // Dialog Bid Auction
      dialogBidAVisible: false,
      dialogBidALoading: false,
      dialogBidWidth: '90%',
      checkUserBalanceBtnLoading: false,
      bidAucMax: 0,
      totalBidPrice: new window.web3.utils.BN(),
      userBalanceInContract: new window.web3.utils.BN(),
      amountSendToContract: new window.web3.utils.BN(),
      interval01: null,

      // Dialog Pre Create|Edit Auction
      dialogPreCEAVisible: false,
      tempPreCEAuction: Object.assign({}, defaultTempPreCEAuc), // copy obj
      dialogPreCEATitle: 'Create Auction',
      dialogPreCEAWidth: '90%',
      startingPriceValidated: false,
      endingPriceValidated: false,
      CEAFormMargin: '0 50px',
      rules: {
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        startingPrice: [{ required: true, trigger: 'blur', validator: validateStartingPrice }],
        endingPrice: [{ required: true, trigger: 'blur', validator: validateEndingPrice }],
        duration: [{ required: true, trigger: 'blur', validator: validateDuration }]
      },

      // Dialog Create|Edit Auction
      dialogCEAVisible: false,
      dialogCEALoading: false,
      checkApprovedBtnLoading: false,
      needApproval: false,
      createAucMax: 0,

      // Dialog Cancel Auction
      dialogCAVisible: false,
      dialogCALoading: false,
      dialogCancelWidth: '90%',
      cancelAucMax: 0,

      // Dialog Notification
      dialogNotifiTitle: 'Created successful auctions',
      dialogNotifiTxHash: '',
      dialogNotifiTxLink: '',
      dialogNotifiVisible: false,
      dialogNotifiWidth: '90%',
      auctionResults: []
    }
  },
  computed: {
    createAuctions() {
      // console.log(this.$store.getters.createAuctions)
      return this.$store.getters.createAuctions
    },
    cancelAuctions() {
      // console.log(this.$store.getters.cancelAuctions)
      return this.$store.getters.cancelAuctions
    },
    bidAuctions() {
      // console.log(this.$store.getters.bidAuctions)
      return this.$store.getters.bidAuctions
    },
    isApprovedForAll() {
      // console.log('isApprovedForAll:', this.$store.state.user.isApprovedForAll)
      return this.$store.state.user.isApprovedForAll
    },

    // Bid/Offer -------------------------------------------
    createBidOffers() {
      return this.$store.getters.createBidOffers
    },
    cancelBidOffers() {
      return this.$store.getters.cancelBidOffers
    },
    acceptBidOffers() {
      return this.$store.getters.acceptBidOffers
    }
  },
  created() {
    this.debug && console.log('created - AuctionCart', window.selectedAccount)
    // Auction -------------------------------------------
    window.handlePreCreateAuc = this.handlePreCreateAuc
    window.handlePreUpdateAuc = this.handlePreUpdateAuc
    //
    window.openCancelAuc = this.openCancelAuc
    window.openBidAuc = this.openBidAuc
    //
    this.createAucMax = this.$store.state.auctionCart.createAucMax
    this.cancelAucMax = this.$store.state.auctionCart.cancelAucMax
    this.bidAucMax = this.$store.state.auctionCart.bidAucMax

    // Bid/Offer -------------------------------------------
    window.openCreateBidOffers = this.openCreateBidOffers
    this.createBidMax = this.$store.state.auctionCart.createBidMax
    this.cancelBidMax = this.$store.state.auctionCart.cancelBidMax
    this.acceptBidMax = this.$store.state.auctionCart.acceptBidMax
    //
    if (!isConnected()) return
    // this.subscribeEvents() // not working on VeChain
  },
  mounted() {
    // this.debug && console.log('mounted - AuctionCart')
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
  },
  beforeDestroy() {
    this.debug && console.log('beforeDestroy - AuctionCart')
    // window.openCancelAuc = undefined
    // window.openBidAuc = undefined
    clearInterval(this.interval01)
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    // @
    handleWindowResize(event) {
      // this.debug && console.log('innerWidth:', window.innerWidth)
      const w = window.innerWidth
      this.dialogBidWidth = w > 800 ? '90%' : (w > 500 ? '100%' : '500px')
      this.dialogCancelWidth = w > 800 ? '90%' : (w > 360 ? '100%' : '360px')
      this.dialogNotifiWidth = w > 800 ? '90%' : (w > 320 ? '100%' : '320px')
      this.dialogPreCEAWidth = w > 800 ? '800px' : (w > 340 ? '100%' : '340px')
      this.CEAFormMargin = w > 800 ? '0 50px' : (w > 600 ? '0 10px' : (w > 370 ? '0' : '0 -10px'))
    },

    // Create Bid/Offer -----------------------------------------------
    // @
    openCreateBidOffers() {
      this.debug && console.log('openCreateBidOffers')
      this.dlogBidOfferVisible = true
      this.calTotalBidOFPrice()
      this.checkUserBalance2()
    },
    // @
    onCloseDlogBidOf() {
      this.debug && console.log('onCloseDlogBidOf')
    },
    // @
    clearAllBidOf() {
      this.dlogBidOfferVisible = false
      this.$store.dispatch('auctionCart/clearCreateBidOf')
      this.onCloseDlogBidOf()
    },
    // @
    removeBidOf(row) {
      this.$store.dispatch('auctionCart/removeCreateBidOf', row.tokenId)
      if (this.createBidOffers.length > 0) {
        this.calTotalBidOFPrice()
      } else {
        this.dlogBidOfferVisible = false
        this.onCloseDlogBidOf()
      }
    },
    //
    calTotalBidOFPrice() {
      this.totalBidPrice = new window.web3.utils.BN()
      this.highestBid = new window.web3.utils.BN()
      for (let i = 0; i < this.createBidOffers.length; i++) {
        const price = new window.web3.utils.BN(this.createBidOffers[i].price)
        const price2 = window.web3.utils.toWei(price, 'ether')
        this.debug && console.log('price', price)
        this.totalBidPrice = this.totalBidPrice.add(new window.web3.utils.BN(price2))
        if (price2.gt(this.highestBid)) this.highestBid = price2
      }
      this.calculateAmountSend2()
    },
    // @
    async checkUserBalance2() {
      this.checkUserBalanceBtnLoading = true
      const vpuAddress = this.$store.getters.instances.VPUContract.address
      await this.$store.getters.instances.ERC721BidV1.userErc20Balance(window.selectedAccount, vpuAddress).then(result => {
        this.debug && console.log('userErc20Balance', result)
        this.userBalanceInContract = result
      }).catch(err => {
        this.debug && console.error(err.message)
      })
      //
      await this.$store.getters.instances.VPUContract.balanceOf(window.selectedAccount).then(result => {
        this.debug && console.log('balanceOf', result)
        this.userBalanceInNetwork = result
      }).catch(err => {
        this.debug && console.error(err.message)
      })
      await this.$store.getters.instances.ERC721BidV1.totalBidOfBidder(window.selectedAccount).then(result => {
        this.totalBidOfBidder = result.toNumber() // chưa tính trường hợp update
        this.debug && console.log('totalBidOfBidder', this.totalBidOfBidder)
      }).catch(err => {
        this.debug && console.error(err.message)
      })
      await this.$store.getters.instances.ERC721BidV1.userErc20Locked(window.selectedAccount).then(result => {
        this.debug && console.log('userErc20Locked', result)
        this.userErc20Locked = result
        this.calculateAmountSend2()
      }).catch(err => {
        this.debug && console.error(err.message)
      })
      this.checkUserBalanceBtnLoading = false
    },
    // @
    recheckUserBalance2() {
      if (this.checkUserBalanceBtnLoading) return
      this.checkUserBalanceBtnLoading = true
      setTimeout(() => { this.checkUserBalance2() }, 1000)
    },
    //
    calculateAmountSend2() {
      let needMore = new window.web3.utils.BN(0)
      let minimumRequirements = new window.web3.utils.BN(0)
      this.depositRequired = false
      if (this.totalBidOfBidder + this.createBidOffers.length > 1 && this.userErc20Locked[1].eq(new window.web3.utils.BN(0))) {
        needMore = new window.web3.utils.BN('300000000000000000000')
        this.depositRequired = true
      }
      if (this.userBalanceInContract.lt(this.highestBid)) minimumRequirements = this.highestBid.sub(this.userBalanceInContract)

      this.amountSendToContract = minimumRequirements.add(needMore)
      this.amountSendToContract2 = this.totalBidPrice.add(needMore) // cần kiểm tra số tiền user bid
    },
    validateInputDeposit() {
      this.debug && console.log('validateInputDeposit', this.inputDeposit)
      this.inputDeposit = validateInt(this.inputDeposit)
      this.inputDepositWei = new window.web3.utils.BN()
      if (this.inputDeposit) {
        this.inputDepositWei = window.web3.utils.toWei(new window.web3.utils.BN(this.inputDeposit), 'ether')
      }
      this.inputError = ''
      if (this.inputDepositWei.lt(this.amountSendToContract)) { // <
        const c = window.web3.utils.fromWei(this.amountSendToContract, 'ether')
        this.inputError = `Minimum deposit required ${c} VPU`
      } else if (this.inputDepositWei.gt(this.userBalanceInNetwork)) { // >
        this.inputError = 'Not enough your balance'
      }
      this.debug && console.log('inputDepositWei:', this.inputDepositWei.toString())
    },
    async startBidOF() {
      this.debug && console.log('createBidOffers', this.createBidOffers)
      if (this.dlogBidOfferLoading || this.createBidOffers.length <= 0) return
      this.validateInputDeposit()
      if (this.inputError) return
      const bidV1Address = this.$store.getters.instances.ERC721BidV1.address
      const vpuAddress = this.$store.getters.instances.VPUContract.address
      const vpunksAddress = this.$store.getters.instances.NFTContract.address
      const allowance = await this.$store.getters.instances.VPUContract.allowance(window.selectedAccount, bidV1Address).catch(() => {})
      this.debug && console.log('allowance', allowance.toString())
      if (allowance === undefined) return

      //
      let allClause = []
      if (allowance.lt(this.inputDepositWei)) { // <
        const clause = await this.$store.getters.instances.VPUContract.approve(bidV1Address, this.inputDepositWei.toString(), { getClause: true })
        allClause = allClause.concat(clause)
      }
      if (this.inputDepositWei.gt(new window.web3.utils.BN(0))) { // >
        const clause = await this.$store.getters.instances.ERC721BidV1.userDeposit(vpuAddress, this.inputDepositWei.toString(), { getClause: true })
        allClause = allClause.concat(clause)
      }
      if (this.depositRequired) {
        const clause = await this.$store.getters.instances.ERC721BidV1.lockBalance(vpuAddress, { getClause: true })
        allClause = allClause.concat(clause)
      }
      // copy createBidOffers array (copy vẫn bị thay đổi phần tử con khi sửa)
      const createBidOffers = this.createBidOffers.slice()
      for (let i = 0; i < createBidOffers.length; i++) {
        const tokenId = createBidOffers[i].tokenId
        const paymentAddress = createBidOffers[i].paymentAddress
        const price = window.web3.utils.toWei(createBidOffers[i].price.toString(), 'ether')
        this.debug && console.log('price:', price)
        let duration = '0'
        if (createBidOffers[i].duration !== '') {
          const days = parseInt(createBidOffers[i].duration)
          duration = `${days * 86400}`
        }
        const clause = await this.$store.getters.instances.ERC721BidV1.placeBid(vpunksAddress, tokenId, paymentAddress, price, duration, { getClause: true })
        allClause = allClause.concat(clause)
      }
      // this.debug && console.log('createBidOffers2', createBidOffers)
      this.debug && console.log('allClause:', allClause)
      if (allClause.length <= 0) return
      //
      this.dlogBidOfferLoading = true
      window.VeChainThor.callWithClauses(allClause, window.selectedAccount).then(async result => {
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
        this.dlogBidOfferLoading = false
        this.clearAllBidOf()
      }).catch(err => {
        console.error(err.message)
        this.dlogBidOfferLoading = false
      })
    },
    // end: Create Bid/Offer -----------------------------------------------

    // Pre Create & Edit Auction -------------------------------------------------------
    // @
    resetTempPreCEAuc() {
      this.tempPreCEAuction = Object.assign({}, defaultTempPreCEAuc) // copy obj
    },
    // @
    handlePreCreateAuc(tokenId) {
      this.debug && console.log('handlePreCreateAuc-tokenId', tokenId)
      this.resetTempPreCEAuc()
      this.tempPreCEAuction.tokenId = tokenId
      this.tempPreCEAuction.approved = undefined // undefined not ues false
      this.tempPreCEAuction.actionType = 1
      this.showDialogPreCEAuction()
    },
    // @
    handlePreUpdateAuc(row) {
      this.debug && console.log('handlePreUpdateAuc-row', row)
      this.resetTempPreCEAuc()
      this.tempPreCEAuction.tokenId = row.tokenId
      this.tempPreCEAuction.startingPrice = window.web3.utils.fromWei(row.startingPrice, 'ether')
      this.tempPreCEAuction.endingPrice = window.web3.utils.fromWei(row.endingPrice, 'ether')
      this.tempPreCEAuction.duration = (row.duration.toNumber() / 3600) // Seconds to Hours
      this.tempPreCEAuction.closeWhenTimeout = row.closeWhenTimeout
      this.tempPreCEAuction.approved = true
      this.tempPreCEAuction.actionType = 2
      this.showDialogPreCEAuction()
    },
    // @
    createAuctionEdit(row) {
      this.debug && console.log('createAuctionEdit-row', row)
      this.tempPreCEAuction = Object.assign({}, row) // copy obj
      this.showDialogPreCEAuction()
    },
    // @
    showDialogPreCEAuction() {
      this.debug && console.log('tempPreCEAuction', this.tempPreCEAuction)
      this.dialogPreCEATitle = this.tempPreCEAuction.actionType !== 2 ? 'Create Auction' : 'Edit Auction'
      this.dialogPreCEAVisible = true
      this.startingPriceValidated = false
      this.endingPriceValidated = false
      this.$nextTick(() => {
        this.$refs['CEAForm'].clearValidate()
      })
    },
    // @
    addPreCEAucToCart() {
      this.debug && console.log('addPreCEAucToCart-tempPreCEAuction', this.tempPreCEAuction)
      this.$refs['CEAForm'].validate(valid => {
        if (valid) {
          this.$store.dispatch('auctionCart/addCreateItem', this.tempPreCEAuction)
          this.openCreateAuc()
          this.dialogPreCEAVisible = false
        }
      })
    },
    // end Pre Create & Edit Auction -------------------------------------------------------

    // Create|Edit Auction -----------------------------------------------
    // @
    openCreateAuc() {
      this.dialogCEAVisible = true
      this.needApproval = false
      for (let i = 0; i < this.createAuctions.length; i++) {
        if (this.createAuctions[i].approved !== true) {
          this.needApproval = true
          break
        }
      }
      this.debug && console.log('needApproval', this.needApproval)
      this.debug && console.log('isApprovedForAll', this.isApprovedForAll)
      if (this.needApproval || this.isApprovedForAll === undefined) this.checkApprovedForAll()
    },
    // @
    checkApprovedForAll() {
      this.checkApprovedBtnLoading = true
      const operator = this.$store.getters.instances.ERC721DutchAuctionV1.address
      this.$store.getters.instances.NFTContract.isApprovedForAll(window.selectedAccount, operator).then(result => {
        this.debug && console.log('checkApprovedForAll', result)
        this.$store.state.user.isApprovedForAll = result
        if (!result && this.needApproval) {
          this.getApproved()
        } else {
          this.checkApprovedBtnLoading = false
        }
      }).catch(err => {
        this.debug && console.error(err.message)
        this.checkApprovedBtnLoading = false
      })
    },
    // @
    recheckApprovedForAll() {
      if (this.checkApprovedBtnLoading) return
      this.checkApprovedBtnLoading = true
      setTimeout(() => { this.checkApprovedForAll() }, 1000)
    },
    // @
    setApprovalForAll(approved) {
      if (this.checkApprovedBtnLoading) return
      this.dialogCEALoading = true
      const operator = this.$store.getters.instances.ERC721DutchAuctionV1.address
      this.$store.getters.instances.NFTContract.setApprovalForAll(operator, approved, { from: window.selectedAccount }).then(async result => {
        this.debug && console.log('setApprovalForAll-result', result)
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
          this.$alert(htmlStr, 'Successful transaction', {
            type: 'success',
            dangerouslyUseHTMLString: true
          }).catch(() => {})
          //
          this.$store.state.user.isApprovedForAll = approved
        }
        //
        this.dialogCEALoading = false
      }).catch(err => {
        this.debug && console.error(err.message)
        this.dialogCEALoading = false
      })
    },
    // @
    async getApproved() {
      let _needApproval = false
      for (let i = 0; i < this.createAuctions.length; i++) {
        if (this.createAuctions[i].approved !== true) {
          const allowAddress = await this.$store.getters.instances.NFTContract.getApproved(this.createAuctions[i].tokenId)
          const operator = this.$store.getters.instances.ERC721DutchAuctionV1.address.toLowerCase()
          this.debug && console.log('getApproved-result', allowAddress, operator)
          if (allowAddress && allowAddress.toLowerCase() === operator) {
            this.createAuctions[i].approved = true
          } else {
            this.createAuctions[i].approved = false
            _needApproval = true
          }
        }
      }
      this.needApproval = _needApproval
      this.checkApprovedBtnLoading = false
    },
    // @
    setApprove(row) {
      this.debug && console.log('setApprove-tokenId', row.tokenId)
      this.dialogCEALoading = true
      const operator = this.$store.getters.instances.ERC721DutchAuctionV1.address
      this.$store.getters.instances.NFTContract.approve(operator, row.tokenId, { from: window.selectedAccount }).then(async result => {
        this.debug && console.log('approve-result', result)
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
          this.$alert(htmlStr, 'Approved successfully', {
            type: 'success',
            dangerouslyUseHTMLString: true
          }).catch(() => {})
          //
          row.approved = true
        }
        //
        this.dialogCEALoading = false
        this.openCreateAuc() // for recheck Approval of all item
        /*
        this.$notify({
          title: 'Success',
          message: 'Approved successfully',
          type: 'success',
          duration: 3000
        })*/
      }).catch(err => {
        this.debug && console.error(err.message)
        this.dialogCEALoading = false
      })
    },
    // @
    clearAllCreateAuc() {
      this.dialogCEAVisible = false
      this.$store.dispatch('auctionCart/clearCreateItem')
    },
    // @
    removeCreateAuc(row) {
      this.$store.dispatch('auctionCart/removeCreateItem', row.tokenId)
      if (this.createAuctions.length > 0) {
        this.openCreateAuc() // for recheck Approval of all item
      } else {
        this.dialogCEAVisible = false
      }
    },
    // @
    editCreateAuc(row) {
      this.dialogCEAVisible = false
      this.createAuctionEdit(row)
    },
    // @
    async startCreateAuc() {
      this.debug && console.log('createAuctions', this.createAuctions)
      const auctionsUpdate = []
      for (let i = 0; i < this.createAuctions.length; i++) {
        if (this.createAuctions[i].actionType === 2) auctionsUpdate.push(this.createAuctions[i].tokenId)
      }
      this.debug && console.log('auctionsUpdate', auctionsUpdate)
      /* tam khoa
      if (auctionsUpdate.length > 0) {
        this.dialogCEALoading = true
        let changed = false
        const auctionByToken = await this.$store.getters.instances.ERC721DutchAuctionV1.auctionByTokenId(auctionsUpdate).catch(() => {})
        this.debug && console.log('auctionByToken', auctionByToken)
        if (auctionByToken !== undefined) {
          for (let i = 0; i < auctionByToken.length; i++) {
            if (auctionByToken[i].seller.toLowerCase() !== window.selectedAccount) {
              this.removeCreateAuc({ tokenId: auctionsUpdate[i] })
              changed = true
            }
          }
        }
        if (changed || auctionByToken === undefined) {
          this.dialogCEALoading = false
          this.$alert(`There have been some changes, let's do it again.`, 'Warning!!', {
            confirmButtonText: 'OK',
            type: 'warning'
          }).catch(() => {})
          return
        }
      }*/

      if (this.isApprovedForAll !== true && this.needApproval === true) {
        this.dialogCEALoading = false
        this.$alert(`You need to set ApprovalForAll or Approve for each tokenId.`, 'Warning!!', {
          confirmButtonText: 'OK',
          type: 'warning'
        }).catch(() => {})
        return
      }

      const auctionInputs = []
      const tokenIds = []
      for (let i = 0; i < this.createAuctions.length; i++) {
        const tokenId = this.createAuctions[i].tokenId
        const startingPrice = window.web3.utils.toWei(this.createAuctions[i].startingPrice, 'ether')
        const endingPrice = window.web3.utils.toWei(this.createAuctions[i].endingPrice, 'ether')
        const duration = Math.floor(this.createAuctions[i].duration * 3600).toString()
        /*
        test max value
        const startingPrice = '340282366920938463463374607431768211455'
        const endingPrice = '1'
        const duration = '18446744073709551615'*/
        const closeWhenTimeout = this.createAuctions[i].closeWhenTimeout
        auctionInputs.push([tokenId, startingPrice, endingPrice, duration, closeWhenTimeout])
        tokenIds.push(tokenId)
      }
      this.debug && console.log('auctionInputs', auctionInputs)
      // tokenIds.push('1')
      // tokenIds.push('3')

      this.dialogCEALoading = true
      this.$store.getters.instances.ERC721DutchAuctionV1.createAuction({ clauses: auctionInputs }, { from: window.selectedAccount }).then(async result => {
        this.debug && console.log('createAuction-result', result)
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
          this.$alert(htmlStr, 'Successful transaction', {
            type: 'success',
            dangerouslyUseHTMLString: true
          }).catch(() => {})
        }
        //
        this.createAuctionDone(tokenIds, transaction, tokenIds.length - auctionsUpdate.length, auctionsUpdate.length)
      }).catch(err => {
        this.debug && console.error(err.message)
        this.dialogCEALoading = false
      })

      // tuple
      /*
      this.$store.getters.instances.ERC721DutchAuctionV1.createAuctions(auctionInputs, { from: window.selectedAccount }).then(async result => {
        this.debug && console.log('createAuction-result', result)
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
          this.$alert(htmlStr, 'Successful transaction', {
            type: 'success',
            dangerouslyUseHTMLString: true
          }).catch(() => {})
        }
        //
        this.createAuctionDone(tokenIds, transaction, tokenIds.length - auctionsUpdate.length, auctionsUpdate.length)
      }).catch(err => {
        this.debug && console.error(err.message)
        this.dialogCEALoading = false
      })*/
    },
    // @
    createAuctionDone(tokenIds, result, createNum, updateNum) {
      this.dialogCEALoading = false
      this.clearAllCreateAuc()

      /* tam khoa
      this.dialogNotifiTitle = 'Created successful auctions'
      this.dialogNotifiTxHash = result.txid
      this.dialogNotifiTxLink = `${explorerTx}${result.txid}`
      this.auctionResults = []
      const successTokenIds = []
      for (let i = 0; i < tokenIds.length; i++) {
        this.auctionResults.push({ tokenId: tokenIds[i], success: false, status: 'rejected' })
      }
      for (let i = 0; i < result.logs.length; i++) {
        if (result.logs[i].event === 'AuctionCreated' || result.logs[i].event === 'AuctionUpdated') {
          const _tokenId = result.logs[i].args.tokenId
          let tokenId = _tokenId
          if (window.web3.utils.BN.isBN(_tokenId) === false) { // convert _tokenId to BN if it is not BN
            tokenId = new window.web3.utils.BN(_tokenId)
            for (const key in _tokenId) tokenId[key] = _tokenId[key]
          }
          tokenId = tokenId.toString()
          const index = this.auctionResults.findIndex(obj => { return obj.tokenId === tokenId })
          if (index >= 0) {
            this.auctionResults[index].success = true
            this.auctionResults[index].status = 'Success, pending confirmation'
            successTokenIds.push(tokenId)
          }
        }
      }
      this.dialogNotifiVisible = true
      if (window.createAuctionDone) window.createAuctionDone(successTokenIds)
      */
      // gtag
      this.$gtag.event('createAuctionDone', {
        num: tokenIds.length,
        create: createNum,
        update: updateNum
      })
      // new (temp)
      setTimeout(() => {
        this.$router.push({ path: `/my-redirect?redirect=${this.$router.history.current.path}` })
      }, 800)
    },
    // end Create|Edit Auction -----------------------------------------------

    // Cancel Auction -----------------------------------------------
    // @
    openCancelAuc() {
      this.dialogCAVisible = true
    },
    // @
    clearAllCancelAuc() {
      this.dialogCAVisible = false
      this.$store.dispatch('auctionCart/clearCancelItem')
    },
    // @
    removeCancelAuc(row) {
      this.$store.dispatch('auctionCart/removeCancelItem', row.tokenId)
      if (this.cancelAuctions.length <= 0) this.dialogCAVisible = false
    },
    // @
    async startCancelAuc() {
      this.debug && console.log('cancelAuctions', this.cancelAuctions)
      if (this.dialogCALoading || this.cancelAuctions.length <= 0) return
      const tokenIds = []
      for (let i = 0; i < this.cancelAuctions.length; i++) tokenIds[i] = this.cancelAuctions[i].tokenId
      this.debug && console.log('tokenIds', tokenIds)
      // tokenIds.push('1')
      // tokenIds.push('3')
      this.dialogCALoading = true

      /* tam khoa
      const auctionByToken = await this.$store.getters.instances.ERC721DutchAuctionV1.auctionByTokenId(tokenIds).catch(() => {})
      this.debug && console.log('auctionByToken', auctionByToken)
      let changed = false
      if (auctionByToken !== undefined) {
        for (let i = 0; i < auctionByToken.length; i++) {
          if (auctionByToken[i].seller.toLowerCase() !== window.selectedAccount) {
            this.removeCancelAuc({ tokenId: tokenIds[i] })
            changed = true
          }
        }
      }
      if (changed || auctionByToken === undefined) {
        this.dialogCALoading = false
        this.$alert(`There have been some changes, let's do it again.`, 'Warning!!', {
          confirmButtonText: 'OK',
          type: 'warning'
        }).catch(() => {})
        return
      }*/
      this.$store.getters.instances.ERC721DutchAuctionV1.cancelAuction(tokenIds, { from: window.selectedAccount }).then(async result => {
        this.debug && console.log('cancelAuction result', result)
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
          this.$alert(htmlStr, 'Successful transaction', {
            type: 'success',
            dangerouslyUseHTMLString: true
          }).catch(() => {})
        }
        this.cancelAuctionDone(tokenIds, result)
      }).catch(err => {
        this.debug && console.error(err.message)
        this.dialogCALoading = false
      })
    },
    // @
    cancelAuctionDone(tokenIds, result) {
      this.dialogCALoading = false
      this.clearAllCancelAuc()
      /* tam khoa
      this.dialogNotifiTitle = 'Cancel successful auctions'
      this.dialogNotifiTxHash = result.tx
      this.dialogNotifiTxLink = `${explorerTx}${result.tx}`
      this.auctionResults = []
      const successTokenIds = []
      for (let i = 0; i < tokenIds.length; i++) {
        this.auctionResults.push({ tokenId: tokenIds[i], success: false, status: 'rejected' })
      }
      for (let i = 0; i < result.logs.length; i++) {
        if (result.logs[i].event === 'AuctionCancelled') {
          const _tokenId = result.logs[i].args.tokenId
          let tokenId = _tokenId
          if (window.web3.utils.BN.isBN(_tokenId) === false) { // convert _tokenId to BN if it is not BN
            tokenId = new window.web3.utils.BN(_tokenId)
            for (const key in _tokenId) tokenId[key] = _tokenId[key]
          }
          tokenId = tokenId.toString()
          const index = this.auctionResults.findIndex(obj => { return obj.tokenId === tokenId })
          if (index >= 0) {
            this.auctionResults[index].success = true
            this.auctionResults[index].status = 'Success, pending confirmation'
            successTokenIds.push(tokenId)
          }
        }
      }
      this.dialogNotifiVisible = true
      if (window.cancelAuctionDone) window.cancelAuctionDone(successTokenIds)*/
      // gtag
      this.$gtag.event('cancelAuctionDone', { num: tokenIds.length })
      // new (temp)
      setTimeout(() => {
        this.$router.push({ path: `/my-redirect?redirect=${this.$router.history.current.path}` })
      }, 800)
    },
    // end Cancel Auction -----------------------------------------------

    // Bid Auction -----------------------------------------------
    // @
    openBidAuc() {
      this.dialogBidAVisible = true
      clearInterval(this.interval01)
      this.currentPriceCalculator()
      this.calculateTotalPrice()
      this.interval01 = setInterval(() => {
        this.currentPriceCalculator()
        this.calculateTotalPrice()
      }, 3000)
      this.checkUserBalance()
    },
    // @
    onCloseDialogBid() {
      this.debug && console.log('onCloseDialogBid')
      clearInterval(this.interval01)
    },
    // @
    clearAllBidAuc() {
      this.dialogBidAVisible = false
      this.$store.dispatch('auctionCart/clearBidItem')
      this.onCloseDialogBid()
    },
    // @
    removeBidAuc(row) {
      this.$store.dispatch('auctionCart/removeBidItem', row.tokenId)
      if (this.bidAuctions.length > 0) {
        this.calculateTotalPrice()
      } else {
        this.dialogBidAVisible = false
        this.onCloseDialogBid()
      }
    },
    // @
    checkUserBalance() {
      this.checkUserBalanceBtnLoading = true
      this.$store.getters.instances.ERC721DutchAuctionV1.userBalanceOf(window.selectedAccount).then(result => {
        this.userBalanceInContract = result
        this.checkUserBalanceBtnLoading = false
        this.calculateAmountSend()
      }).catch(err => {
        this.debug && console.error(err.message)
        this.checkUserBalanceBtnLoading = false
      })
    },
    // @
    recheckUserBalance() {
      if (this.checkUserBalanceBtnLoading) return
      this.checkUserBalanceBtnLoading = true
      setTimeout(() => { this.checkUserBalance() }, 1000)
    },
    // @
    calculateAmountSend() {
      this.amountSendToContract = this.totalBidPrice.sub(this.userBalanceInContract)
      if (this.amountSendToContract.lt(new window.web3.utils.BN(0))) this.amountSendToContract = new window.web3.utils.BN(0)
    },
    // @
    calculateTotalPrice() {
      this.totalBidPrice = new window.web3.utils.BN()
      for (let i = 0; i < this.bidAuctions.length; i++) {
        this.totalBidPrice = this.totalBidPrice.add(this.bidAuctions[i].currentPrice)
      }
      this.calculateAmountSend()
    },
    // @
    async startBidAuc() {
      this.debug && console.log('bidAuctions', this.bidAuctions)
      if (this.dialogBidALoading || this.bidAuctions.length <= 0) return
      // copy Auctions array, precaution removeBidAuc was called while calling auctionByTokenId
      const bidAuctions = this.bidAuctions.slice()
      const tokenIds = []
      for (let i = 0; i < bidAuctions.length; i++) tokenIds[i] = bidAuctions[i].tokenId
      this.debug && console.log('tokenIds', tokenIds)

      this.dialogBidALoading = true
      let changed = false
      /*
      // check if any auction = false: timeout or does-not-exist (cancelled, AuctionSuccessful)
      const onAuctions = await this.$store.getters.instances.ERC721DutchAuctionV1.isOnAuction(tokenIds).catch(() => {})
      this.debug && console.log('onAuctions', onAuctions)
      if (onAuctions !== undefined) {
        for (let i = 0; i < onAuctions.length; i++) {
          if (onAuctions[i] === false) {
            this.removeBidAuc({tokenId: tokenIds[i]})
            changed = true
          }
        }
      } else {
        changed = true
      }*/

      // check if any auction updated, cancelled or AuctionSuccessful, does-not-exist
      if (window.connex.version) { // builtin (v1.x.x)
        for (let i = 0; i < tokenIds.length; i++) {
          const auctionByToken = await this.$store.getters.instances.ERC721DutchAuctionV1.auctionByTokenId(tokenIds[i]).catch(() => {})
          this.debug && console.log('auctionByToken', auctionByToken)
          if (auctionByToken !== undefined) {
            if (auctionByToken[0].startedAt !== bidAuctions[i].startedAt.toString()) {
              // this.debug && console.log('startedAt change---', bidAuctions[i])
              // this.debug && console.log('startedAt change---', auctionByToken[0])
              // if (auctionByToken[i].startedAt !==  '0') The auction should be updated, not remove
              this.removeBidAuc({ tokenId: bidAuctions[i].tokenId })
              changed = true
            }
          } else {
            changed = true
          }
        }
      } else { // v2
        const auctionByToken = await this.$store.getters.instances.ERC721DutchAuctionV1.auctionsByTokenId(tokenIds).catch(() => {})
        this.debug && console.log('auctionsByTokenId', auctionByToken)
        if (auctionByToken !== undefined) {
          for (let i = 0; i < auctionByToken.length; i++) {
            if (auctionByToken[i].startedAt !== bidAuctions[i].startedAt.toString()) {
              // if (auctionByToken[i].startedAt !==  '0') The auction should be updated, not remove
              this.removeBidAuc({ tokenId: bidAuctions[i].tokenId })
              changed = true
            }
          }
        } else {
          changed = true
        }
      }
      // if any auction removed by timeout
      if (bidAuctions.length !== this.bidAuctions.length) changed = true
      //
      if (changed) {
        this.dialogBidALoading = false
        this.$alert(`There have been some changes, let's do it again.`, 'Warning!!', {
          confirmButtonText: 'OK',
          type: 'warning'
        }).catch(() => {})
        this.$nextTick(() => {
          this.$router.push({ path: `/my-redirect?redirect=${this.$router.history.current.path}` })
        })
        return
      }

      /*
      // test
      tokenIds.push('2')
      tokenIds.push('3')
      const prices = await this.$store.getters.instances.ERC721DutchAuctionV1.auctionCurrentPrice(tokenIds)
      for (let i = 0; i < prices.length; i++) prices[i] = prices[i].toString()
      this.debug && console.log(prices)
      //this.bidAucPriceCheck = new window.web3.utils.BN()
      //for (let i = 0; i < prices.length; i++) this.bidAucPriceCheck = this.bidAucPriceCheck.add(prices[i])
      return
      end test */

      this.$store.getters.instances.ERC721DutchAuctionV1.bid(tokenIds, { value: this.amountSendToContract, from: window.selectedAccount }).then(async result => {
        this.debug && console.log('bid result', result)
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
          this.$alert(htmlStr, 'Successful transaction', {
            type: 'success',
            dangerouslyUseHTMLString: true
          }).catch(() => {})
        }
        this.bidAuctionDone(tokenIds, result)
      }).catch(err => {
        this.debug && console.error(err.message)
        this.dialogBidALoading = false
      })
    },
    // @
    bidAuctionDone(tokenIds, result) {
      this.dialogBidALoading = false
      this.clearAllBidAuc()
      /* tam khoa
      this.dialogNotifiTitle = 'Bidding successful auctions'
      this.dialogNotifiTxHash = result.tx
      this.dialogNotifiTxLink = `${explorerTx}${result.tx}`
      this.auctionResults = []
      const successTokenIds = []
      for (let i = 0; i < tokenIds.length; i++) {
        this.auctionResults.push({ tokenId: tokenIds[i], success: false, status: 'rejected' })
      }
      for (let i = 0; i < result.logs.length; i++) {
        if (result.logs[i].event === 'AuctionSuccessful') {
          const _tokenId = result.logs[i].args.tokenId
          let tokenId = _tokenId
          if (window.web3.utils.BN.isBN(_tokenId) === false) { // convert _tokenId to BN if it is not BN
            tokenId = new window.web3.utils.BN(_tokenId)
            for (const key in _tokenId) tokenId[key] = _tokenId[key]
          }
          tokenId = tokenId.toString()
          const index = this.auctionResults.findIndex(obj => { return obj.tokenId === tokenId })
          if (index >= 0) {
            this.auctionResults[index].success = true
            this.auctionResults[index].status = 'Success, pending confirmation'
            successTokenIds.push(tokenId)
          }
        }
      }
      this.dialogNotifiVisible = true
      if (window.bidAuctionDone) window.bidAuctionDone(successTokenIds)*/
      // gtag
      this.$gtag.event('bidAuctionDone', { num: tokenIds.length })
      // new (temp)
      setTimeout(() => {
        this.$router.push({ path: `/my-redirect?redirect=${this.$router.history.current.path}` })
      }, 800)
    },
    // end Bid Auction -----------------------------------------------

    // Dialog Notification -----------------------------------------------
    // @
    onCloseDialogNotifi() {
      this.auctionResults = []
    },
    // end Dialog Notification -----------------------------------------------

    /* not working on VeChain
    // @
    subscribeEvents() {
      this.$store.getters.instances.ERC721DutchAuctionV1.allEvents().on('data', event => {
        this.debug && console.log('allEvents-event', event)
        // same results as the optional callback above
        if (window.onSubscribeEvents) window.onSubscribeEvents(event)
      })
    },*/

    // @
    currentPriceCalculator() {
      this.debug && console.log('currentPriceCalculator')
      const auctions = this.bidAuctions
      const currTimestamp = new window.web3.utils.BN(Math.floor(Date.now() / 1000))

      for (let i = 0; i < auctions.length; i++) {
        const startingPrice = auctions[i].startingPrice
        const endingPrice = auctions[i].endingPrice
        const secondsPassed = currTimestamp.sub(auctions[i].startedAt)
        let forSell = true
        auctions[i].secondsPassed = secondsPassed.toNumber()
        if (secondsPassed.gte(auctions[i].duration)) { // >=
          auctions[i].currentPrice = endingPrice
          auctions[i].currentPriceV = window.web3.utils.fromWei(endingPrice, 'ether')
          if (auctions[i].closeWhenTimeout) forSell = false
        } else if (startingPrice.eq(endingPrice)) { // ==
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
        if (!forSell) this.removeBidAuc(auctions[i])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.badge-bid {
  line-height: 25px;
  margin: -5px 10px 0 0;
}
.badge-btn-bid {
  padding: 8px 10px;
  background: #00c3ff;
  border-color: #00c3ff;
}
.badge-create {
  line-height: 25px;
  margin: -5px 10px 0 0;
}
.badge-btn-create {
  padding: 8px 10px;
}
.badge-cancel {
  line-height: 25px;
  margin-top: -5px;
}
.badge-btn-cancel {
  padding: 8px 10px;
}
.total-bid-info {
  font-weight: 500;
  line-height: 25px;
  margin: 8px 0 -25px 0;
}
.total-bid-info2 {
  font-weight: 500;
  line-height: 25px;
  margin: 30px -10px -10px -10px;
  padding: 10px;
  background: #00000024;
}
.dutch-auction-wiki {
  position: absolute;
  top: 40px;
  right: 80px;
  color: #ffffff9e;
}
.input-error {
  color: red;
  font-size: 13px;
}
</style>
