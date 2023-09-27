<template>
  <div v-loading="challengesLoading" class="smart-app-container challenge-container">
    <!--<div class="notify">This feature is coming soon.</div>-->
    <!-- Challenges -->
    <h3 class="app-con-title">Challenges</h3>
    <el-alert
      title="The challenge has been stopped indefinitely according to user votes, we will notify if the challenge is reopened."
      type="warning"
      effect="dark"
      style="margin-bottom:10px;"
    />
    <div v-for="(item, index) of challengeList" :key="item.tokenId" :class="{ 'challenge-row-odd' : index%2 === 0 }" class="challenge-row">
      <div class="auc-details-label"><b>Day </b><b style="font-size: 20px;color:rgb(6 189 87);">{{ item.day - 18895 }}</b></div>
      <div class="auc-details-label"><b>{{ item.createdAt.substr(0, 10) }}</b> <span v-if="item.day===challengeCurrDay">🚩</span></div>
      <div class="auc-details-label"><b>Reward/slot: </b><span style="color: #1890ff;">{{ item.reward }} VPU</span></div>
      <div class="auc-details-label"><b>Total slot: </b><span style="color: #1890ff;">{{ item.slot }}</span></div>
      <div class="auc-details-label"><b>Total winners: </b><span style="color: #1890ff;">{{ item.winner }}</span></div>
      <div style="padding-top:10px;"><el-link type="primary" @click="challengeViewWinners(item)">View winners<i class="el-icon-d-arrow-right" /></el-link></div>
      <div v-if="item.day===challengeCurrDay" style="padding:20px 0;letter-spacing:0;">
        <div v-if="myChallengeData.success" class="min-box">
          <b>- Your Challenge -</b>
          <p><b>Slot:</b> {{ myChallengeData.slot }}</p>
          <p style="font-size:15px;"><b>Suggestion list:</b> <el-tag v-for="suItem of myChallengeData.suggest" :key="'suggestion'+suItem" class="suggestion-tag">{{ suItem }}</el-tag></p>
          <p><b>- Challenge Guide -</b></p>
          <p style="text-align:left;">
            <b>Step 1:</b> Go to the <el-link href="#/auctions/index?challenge=true" type="primary">My Challenge List</el-link> in auctions page and buy one of the VPunks in the suggested list
            (You can buy many VPunks in the suggested list and get up to {{ myChallengeData.slot }} rewards because you have {{ myChallengeData.slot }} slots)
          </p>
          <p style="text-align:left;">
            <b>Step 2:</b> After you buy one or more VPunks in the list of suggestions come back here and press the [Claim Reward] button.
          </p>
          <p style="text-align:left;"><b>Note:</b> there are {{ item.slot }} slots in total, if you claim the reward late you may not get the reward even if you completed the challenge.</p>
          <div style="padding-top:10px;">
            <el-button v-loading="getChallBtnLoading" type="primary" @click="claimRewardChallenge(item)">🛠 Claim Reward</el-button>
          </div>
          <p><b>- Result -</b></p>
          <p v-for="cData of myChallengeData.data" :key="cData.tokenId+'data'">
            <b>You win:</b> slot {{ cData.slot }} - reward {{ cData.reward }} VPU - tokenId {{ cData.tokenId }} - paid [{{ cData.paid ? 'completed' : 'pending' }}]
          </p>
        </div>
        <div v-else>
          <el-button v-loading="getChallBtnLoading" type="primary" @click="registerChallenge(item)">🛠 Get challenge</el-button>
        </div>
      </div>
      <div v-if="item.day!==challengeCurrDay" style="padding:20px 0;">
        The challenge is over 🏁
      </div>
    </div>

    <!-- Dialog Challenge01 Winners -->
    <el-dialog v-loading="dialogTransferLoading" :visible.sync="dialogTransferVisible" :width="dialogTransferWidth" :class="{ deviceMini: (deviceSize !== 'medium') }" append-to-body>
      <div slot="title">
        <span style="font-weight:bold;">Winners ({{ dialogWinnersDay }})</span>
        <p>{{ transferTokens.length }} accounts, {{ dialogWinnersSlots }} slots</p>
      </div>
      <el-table :size="deviceSize" :data="transferTokens" border fit highlight-current-row>
        <el-table-column label="Slots" align="center" width="55px" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            {{ row.winSlots }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="Reward (VPU)" min-width="70">
          <template slot-scope="{row}">
            {{ row.amount }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="Winner" min-width="170">
          <template slot-scope="{row}">
            <el-link :href="row.link" target="_blank">{{ row.address }}</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button :size="deviceSize" @click="dialogTransferVisible = false">Close</el-button>
      </div>
    </el-dialog>
    <!-- end Dialog Challenge01 Winners -->
  </div>
</template>

<script>
import { nativeToken, explorerAddress } from '@/settings'
import { isConnected } from '@/utils/validate'
import {
  getChallenges,
  getMyChallenges,
  registerChallenge,
  claimRewardChallenge,
  challenge01Winners
} from '@/api/user'

export default {
  name: 'Challenges',
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
      address: null,
      nativeToken: nativeToken,
      deviceSize: 'medium', // medium / small / mini

      // Challenges
      challengesLoading: false,
      challengeList: [], // [{day, reward, slot, winner, createdAt}]
      challengeCurrDay: null,

      //
      myChallengeData: {}, // {accountTokens, auctionTokens, tokensJoined, slot, suggest, data, success}
      getChallBtnLoading: false,

      // Dialog Winners
      dialogWinnersDay: '',
      dialogWinnersSlots: 0,
      transferTokens: [],
      dialogTransferVisible: false,
      dialogTransferLoading: false,
      dialogTransferWidth: '90%'
    }
  },
  created() {
    this.debug && console.log('created - Challenges', window.selectedAccount)
    // if (!isConnected([true, true], [false, false])) return  // vechain not check ?
    this.address = window.selectedAccount
    // this.address = '0xbfb005444d4530aa40f4c90fc1b04291165f34a5' // test
    this.appendChallenges()
  },
  beforeDestroy() {
    this.debug && console.log('beforeDestroy - Challenges')
  },
  methods: {
    // @
    handleWindowResize(event) {
      const w = window.innerWidth
      this.dialogTransferWidth = w > 800 ? '90%' : (w > 320 ? '100%' : '320px')
      this.deviceSize = w > 500 ? 'small' : 'mini'
    },

    // Challenges -------------------------------------------------------
    // @
    appendChallenges() {
      if (this.challengesLoading) return
      this.challengesLoading = true
      //
      getChallenges().then(result => {
        this.debug && console.log('getChallenges-result', result)
        const { data } = result
        this.challengeList = []
        if (data.day) this.challengeCurrDay = data.day
        if (data.challenges && data.challenges.length > 0) {
          for (let i = 0; i < data.challenges.length; i++) {
            this.challengeList.push({
              day: data.challenges[i].day,
              reward: data.challenges[i].reward,
              slot: data.challenges[i].slot,
              winner: data.challenges[i].winner,
              createdAt: data.challenges[i].createdAt
            })
          }
        }
        this.appendMyChallenge()
      }).catch(error => {
        this.debug && console.log(error)
      }).finally(() => {
        this.challengesLoading = false
      })
    },

    // @
    appendMyChallenge() {
      if (!isConnected([true, false], [true, false])) return // checkChainId, checkWallet
      if (this.getChallBtnLoading) return
      this.getChallBtnLoading = true
      getMyChallenges(`address=${this.address}`).then(result => {
        this.debug && console.log('getMyChallenges-result', result)
        if (result.data) this.myChallengeData = result.data // result.data: {accountTokens, auctionTokens, tokensJoined, slot, suggest, data, success}
        // this.myChallengeData.data = [{slot: 1, reward: 200, tokenId: 120, paid: false}, {slot: 13, reward: 200, tokenId: 256, paid: true}]
      }).catch(error => {
        this.debug && console.log(error)
      }).finally(() => {
        this.getChallBtnLoading = false
      })
    },

    // @
    registerChallenge(item) {
      if (!isConnected([true, true], [true, true])) return // checkChainId, checkWallet
      if (this.getChallBtnLoading) return
      if (item.winner >= item.slot) {
        this.$alert('The challenge has run out of slots.', 'Alert').catch(() => {})
        return
      }
      this.getChallBtnLoading = true
      registerChallenge(`address=${this.address}`).then(result => {
        this.debug && console.log('registerChallenge-result', result)
        if (result.data) {
          if (result.data.success) this.myChallengeData = result.data
          if (result.data.tokensJoined === 0) {
            this.$alert(`All your tokens have been registered to today's challenge by someone. Come back tomorrow!`, 'Alert').catch(() => {})
          }
        } else {
          this.$alert(`There's an error`, 'Alert', { type: 'warning' }).catch(() => {})
        }
      }).catch(error => {
        this.debug && console.log(error)
      }).finally(() => {
        this.getChallBtnLoading = false
      })
    },

    // @
    claimRewardChallenge(item) {
      if (!isConnected([true, true], [true, true])) return // checkChainId, checkWallet
      if (this.getChallBtnLoading) return
      if (this.myChallengeData.data.length >= this.myChallengeData.slot) {
        this.$alert(`You have won max ${this.myChallengeData.slot} slots.`, 'Alert').catch(() => {})
        return
      } else if (item.winner >= item.slot) {
        this.$alert('The challenge has run out of slots.', 'Alert').catch(() => {})
        return
      }
      //
      this.getChallBtnLoading = true
      claimRewardChallenge(`address=${this.address}&day=${item.day}`).then(result => {
        this.debug && console.log('claimRewardChallenge-result', result)
        if (result.data) {
          this.myChallengeData.data = result.data
        } else {
          this.$alert('No change', 'Alert').catch(() => {})
        }
      }).catch(error => {
        this.debug && console.log(error)
      }).finally(() => {
        this.getChallBtnLoading = false
      })
    },

    //
    challengeViewWinners(item) {
      this.debug && console.log(item)
      this.dialogWinnersDay = item.createdAt.substr(0, 10)
      this.dialogTransferVisible = true
      this.dialogTransferLoading = true
      this.transferTokens = []
      this.dialogWinnersSlots = 0
      challenge01Winners(`day=${item.day}`).then(result => {
        this.debug && console.log('challenge01Winners-result', result)
        if (result.data) {
          for (let i = 0; i < result.data.length; i++) {
            const data = result.data[i].data
            if (!data || data.length <= 0) continue
            this.dialogWinnersSlots += data.length
            const amount = data.reduce((total, ojb) => {
              return total + ojb.reward
            }, 0)
            const address = result.data[i].address
            const link = `${explorerAddress}${address}`
            this.transferTokens.push({ winSlots: data.length, amount, address, link })
          }
        } else {
          this.$alert('There is no winner.', 'Alert').catch(() => {})
        }
      }).catch(error => {
        this.debug && console.log(error)
      }).finally(() => {
        this.dialogTransferLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.challenge-container {
  /*
  .notify {
    padding: 5px 0 5px 10px;
    font-size: 18px;
    color: #1c9631;
    text-align: center;
    line-height: 40px;
  }*/
  .challenge-row {
    text-align: center;
    line-height: 130%;
    letter-spacing: 1px;
    padding: 20px 0;
  }
  .challenge-row-odd {
    background: #334166;
  }
  .min-box {
    text-align:center;
    border: 2px dashed #bbb;
    padding: 10px;
    padding: min(max(5px, 3vw), 20px);
    background-color: #f6f7f9;
  }
  .suggestion-tag {
    font-weight: bold;
    margin-right: 5px;
  }
}
</style>
