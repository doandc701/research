<template>
  <div class="smart-app-container staking-container">
    <!-- Finished Auctions -->
    <h3 class="app-con-title">VPU staking pool 01</h3>
    <div style="text-align:center;padding-top:20px;">
      <div class="auc-details-label"><b>APY: </b><b style="color:rgb(6 189 87);">10%</b></div>
      <div class="auc-details-label"><b>Tickets are available: </b><span style="color: #1890ff;">{{ totalTicket2 }}/5000 Tickets</span></div>
      <div class="auc-details-label"><b>All tickets: </b><span style="color: #1890ff;">~ 18000 Tickets</span></div>
      <div class="auc-details-label"><b>Rate of taking tickets: </b><span style="color: #1890ff;">1000 VPU / Ticket</span></div>
      <div class="auc-details-label"><b>Duration: </b>2 years</div>
      <p style="letter-spacing:1px;background:#334166;padding:5px;">VPU staking to get
        <el-link href="https://vemoji.io" type="primary" target="_blank">Vemojis</el-link> minting ticket ⚡
      </p>
      <p v-if="yourStaking" style="letter-spacing:1px;background:#334166;padding:5px;">
        Your Staking: {{ yourStaking | fromWei }} VPU<br>
        Your Ticket:  {{ yourTicket }}
      </p>
      <p v-if="disableStakingBtn" style="letter-spacing:1px;background:#f0f2f5;padding:5px;">Tickets sold out, wait for the next stage.</p>
      <div style="text-align:center;padding:10px 0 30px 0;">
        <!--Staking pool is full-->
        <el-button :disabled="disableStakingBtn" type="primary" icon="el-icon-wallet" @click="handleStaking('1')">Staking</el-button>
      </div>
    </div>

    <h3 class="app-con-title">VPunks staking pool 02</h3>
    <div style="text-align:center;padding-top:20px;">
      <div class="auc-details-label"><b>APY: </b><b style="color:rgb(6 189 87);">26%</b></div>
      <div class="auc-details-label"><b>Total commitment reward: </b><span style="color: #1890ff;">1M VPU</span></div>
      <div class="auc-details-label"><b>Minimum stake per VPunks: </b><span style="color: #1890ff;">200 VPU</span></div>
      <div class="auc-details-label"><b>Maximum stake per VPunks: </b><span style="color: #1890ff;">10,000 VPU</span></div>
      <div class="auc-details-label"><b>Minimum duration: </b>1 hour</div>
      <div class="auc-details-label"><b>Maximum duration: </b>2,160 hour</div>
      <p style="letter-spacing:1px;background:#334166;padding:5px;">go to
        <el-link href="#/my-account" type="primary">Your NFT page</el-link> and staking now ⚡
      </p>
    </div>

    <h3 class="app-con-title">VPunks staking pool 01</h3>
    <div style="text-align:center;padding-top:20px;">
      <div class="auc-details-label"><b>APY: </b><b style="color:rgb(6 189 87);">30%</b></div>
      <div class="auc-details-label"><b>Total commitment reward: </b><span style="color: #1890ff;">1M VPU</span></div>
      <div class="auc-details-label"><b>Minimum stake per VPunks: </b><span style="color: #1890ff;">1,000 VPU</span></div>
      <div class="auc-details-label"><b>Maximum stake per VPunks: </b><span style="color: #1890ff;">10,000 VPU</span></div>
      <div class="auc-details-label"><b>Minimum duration: </b>1 hour</div>
      <div class="auc-details-label"><b>Maximum duration: </b>2,160 hour</div>
    </div>

    <!-- Dialog Staking -->
    <el-dialog v-loading="dialogStakingLoading" :visible.sync="dialogStakingVisible" title="Staking VPU" :width="dialogStakingWidth" append-to-body>
      <el-form ref="stakingForm" :rules="rules" :model="tempStaking" label-position="left" label-width="170px" :style="{margin: stakingFormMargin}">
        <el-form-item label="Pool">
          <el-tag effect="plain" style="font-size: 18px;">{{ tempStaking.poolId }}</el-tag>
        </el-form-item>
        <el-form-item label="Staking amount" prop="stakingAmount">
          <el-input v-model="tempStaking.stakingAmount" placeholder="in VPU">
            <template slot="append">VPU</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Duration" prop="duration">
          <el-input v-model="tempStaking.duration" placeholder="in Hours" readonly>
            <template slot="append">Hours</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="submitStaking()">Submit</el-button>
        <el-button @click="dialogStakingVisible = false">Cancel</el-button>
      </span>
    </el-dialog>
    <!-- end Dialog Staking -->
  </div>
</template>

<script>
import { nativeToken, explorerTx } from '@/settings'
import { isConnected } from '@/utils/validate'

const defaultTempStaking = {
  stakingAmount: '',
  duration: '',
  poolId: '1'
}

export default {
  name: 'Staking',
  filters: {
    fromWei(w) {
      if (typeof w !== 'object') return w
      return window.web3.utils.fromWei(w, 'ether')
    }
  },
  data() {
    const validateStakingAmount = (rule, value, callback) => {
      if (value === '') return callback(new Error('Staking amount is required'))
      try {
        let _value = parseInt(value)
        if (isNaN(_value)) {
          _value = ''
        } else if (_value < 1000) {
          _value = 1000
        } else if (_value > 3000000) {
          _value = 3000000
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
        } else if (_value > 17520) {
          _value = 17520
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
      address: null,
      nativeToken: nativeToken,

      //
      disableStakingBtn: false,
      yourStaking: null,
      totalTicket2: 0,

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
      totalTicket: 5000,
      yourTicket: 0
    }
  },
  created() {
    this.debug && console.log('created - Staking', window.selectedAccount)
    // if (!isConnected([true, true], [true, true]))  // vechain not check ?
    this.address = window.selectedAccount
    this.appendERC20Staking()
  },
  mounted() {
    this.debug && console.log('mounted - Staking')
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
  },
  beforeDestroy() {
    this.debug && console.log('beforeDestroy - Staking')
  },
  methods: {
    // @
    handleWindowResize(event) {
      // this.debug && console.log('innerWidth:', window.innerWidth)
      const w = window.innerWidth
      // dialog Staking
      this.dialogStakingWidth = w > 800 ? '800px' : (w > 340 ? '100%' : '340px')
      this.stakingFormMargin = w > 800 ? '0 50px' : (w > 600 ? '0 10px' : (w > 370 ? '0' : '0 -10px'))
    },

    // Staking -----------------------------------------------
    async appendERC20Staking() {
      const stakingPools = await this.$store.getters.instances.ERC20StakingV1.stakingPools('1').catch(() => {})
      this.debug && console.log('stakingPools', stakingPools)
      const stakingPoolDeeps = await this.$store.getters.instances.ERC20StakingV1.stakingPoolDeeps('1').catch(() => {})
      this.debug && console.log('stakingPoolDeeps', stakingPoolDeeps)
      if (stakingPoolDeeps === undefined) return
      const _totalTicket = new window.web3.utils.BN(stakingPoolDeeps.totalStaking).div(new window.web3.utils.BN('1000000000000000000000')).toNumber()
      this.debug && console.log('_totalTicket', _totalTicket)
      this.totalTicket2 = this.totalTicket - _totalTicket
      if (_totalTicket >= this.totalTicket) {
        this.disableStakingBtn = true
        this.totalTicket2 = 0
      }
      if (this.address) {
        const totalStakingOf = await this.$store.getters.instances.ERC20StakingV1.totalStakingOf(this.address).catch(() => {})
        this.debug && console.log('totalStakingOf', totalStakingOf)
        if (totalStakingOf === undefined) return
        if (totalStakingOf[0]) {
          const id = []
          for (let i = 0; i < Number(totalStakingOf[0]); i++) id.push(i.toString())
          const stakingsByIndexOf = await this.$store.getters.instances.ERC20StakingV1.stakingsByIndexOf(this.address, id).catch(() => {})
          this.debug && console.log('stakingsByIndexOf', stakingsByIndexOf)
          if (stakingsByIndexOf === undefined) return
          let gg = new window.web3.utils.BN(0)
          for (let i = 0; i < stakingsByIndexOf.stakeAmounts.length; i++) {
            gg = gg.add(new window.web3.utils.BN(stakingsByIndexOf.stakeAmounts[i]))
          }
          this.debug && console.log('gg', gg)
          if (gg) {
            this.yourStaking = gg
            this.yourTicket = gg.div(new window.web3.utils.BN('1000000000000000000000'))
          }
        }
      }
    },
    //
    handleStaking(poolId) {
      this.debug && console.log('handleStaking', 'poolId: ' + poolId)
      if (!isConnected([true, true], [true, true])) return
      this.tempStaking.poolId = poolId
      this.tempStaking.duration = '17520'
      this.dialogStakingVisible = true
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
      const stakingPoolDeeps = await this.$store.getters.instances.ERC20StakingV1.stakingPoolDeeps('1').catch(() => {})
      this.debug && console.log('stakingPoolDeeps', stakingPoolDeeps)
      if (stakingPoolDeeps === undefined) return
      const _totalTicket = new window.web3.utils.BN(stakingPoolDeeps.totalStaking).div(new window.web3.utils.BN('1000000000000000000000')).toNumber()
      this.debug && console.log('_totalTicket', _totalTicket)
      if (_totalTicket >= this.totalTicket) {
        this.disableStakingBtn = true
        this.dialogStakingLoading = false
        this.dialogStakingVisible = false
      }
      //
      const amount = window.web3.utils.toWei(this.tempStaking.stakingAmount.toString(), 'ether')
      this.debug && console.log('amount', amount)
      const duration = this.tempStaking.duration.toString()
      const poolId = this.tempStaking.poolId

      const erc20StakingV1Address = this.$store.getters.instances.ERC20StakingV1.address
      const approveClause = await this.$store.getters.instances.VPUContract.approve(erc20StakingV1Address, amount, { getClause: true })
      const stakeClause = await this.$store.getters.instances.ERC20StakingV1.stake(poolId, amount, duration, { getClause: true })
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
        // reload page
        setTimeout(() => {
          this.$router.push({ path: `/my-redirect?redirect=${this.$router.history.current.path}` })
        }, 800)
      }).catch(err => {
        this.debug && console.error(err.message)
        this.dialogStakingLoading = false
        this.dialogStakingVisible = false
      })
    }
    // end: Staking -----------------------------------------------
  }
}
</script>

<style lang="scss" scoped>
.staking-container {
  .auc-details-label {
    padding-bottom: 5px;
  }
}
</style>
