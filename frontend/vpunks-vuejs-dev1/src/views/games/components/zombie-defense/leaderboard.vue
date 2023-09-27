<template>
  <div>
    <el-button style="background-color: rgb(85, 140, 63); border: none; border-radius: 10px; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25)" type="primary" :loading="leaderboardBtnLoading" @click="handleLeaderboard"><i class="el-icon-s-data" /><span class="hide-text"> Leaderboard</span></el-button>
    <!-- Dialog Leaderboard -->
    <el-dialog v-loading="dialogLeaderLoading" :visible.sync="dialogLeaderVisible" :width="dialogLeaderWidth" :class="{ deviceMini: (deviceSize !== 'medium') }" append-to-body>
      <div slot="title">
        <span style="padding-right: 10px;">Leaderboard</span>
        <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select>
      </div>
      <div v-if="listQuery.sort === '2'">
        From: <el-input v-model="dateinput1" placeholder="YYYY-MM-DD" suffix-icon="el-icon-date" />
        To: <el-input v-model="dateinput2" placeholder="YYYY-MM-DD" suffix-icon="el-icon-date" />
        <p class="text-center"><el-button type="primary" @click="submitLeaderboard">Submit</el-button></p>
      </div>
      <p style="margin-top: -10px;line-height: 150%;" v-html="rewardText" />
      <el-table :size="deviceSize" :data="leaderboardList" border fit highlight-current-row>
        <el-table-column align="center" label="TokenId" min-width="70">
          <template slot-scope="{row}">
            {{ row.tokenId }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="VPunk" min-width="70">
          <template slot-scope="{row}">
            <img :src="row.image">
          </template>
        </el-table-column>

        <el-table-column label="Winner" align="center" min-width="70" class-name="small-padding">
          <template slot-scope="{row}">
            {{ row.addressV }}
          </template>
        </el-table-column>

        <el-table-column label="WinPower" align="center" min-width="70" class-name="small-padding">
          <template slot-scope="{row}">
            {{ row.winPower }}
          </template>
        </el-table-column>

      </el-table>
      <div slot="footer">
        <el-button :size="deviceSize" @click="dialogLeaderVisible = false">Close</el-button>
      </div>
    </el-dialog>
    <!-- end: Dialog Leaderboard -->
  </div>
</template>

<script>
import { nativeToken } from '@/settings'
import { game01Leaderboard } from '@/api/user'
export default {
  name: 'Leaderboard',
  data() {
    return {
      debug: false,
      address: null,
      nativeToken: nativeToken,
      deviceSize: 'medium', // medium / small / mini

      // VPunk Games
      leaderboardBtnLoading: false,

      // Dialog Leaderboard
      leaderboardList: [],
      dialogLeaderVisible: false,
      dialogLeaderLoading: false,
      dialogLeaderWidth: '90%',
      rewardText: '',
      //
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '1'
      },
      sortOptions: [{ label: 'Today', key: '1' }, { label: 'Other', key: '2' }],
      dateinput1: null,
      dateinput2: null,
      day1: 0,
      day2: 0
    }
  },
  methods: {
    // @
    handleWindowResize(event) {
      const w = window.innerWidth
      this.dialogLeaderWidth = w > 800 ? '90%' : (w > 320 ? '100%' : '320px')
      this.deviceSize = w > 500 ? 'small' : 'mini'
    },
    // Dialog Leaderboard -----------------------------------------------
    toDayNumber(dateString) {
      const d = new Date(dateString)
      const dUTC = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()))
      return Math.floor(dUTC.getTime() / 86400000)
    },
    // @
    handleLeaderboard() {
      this.debug && console.log('handleLeaderboard')
      if (this.listQuery.sort === '2') {
        this.dialogLeaderVisible = true
        return
      }
      this.leaderboardBtnLoading = true
      this.getList()
    },
    submitLeaderboard() {
      this.debug && console.log('submitLeaderboard')
      this.day1 = this.toDayNumber(this.dateinput1)
      this.day2 = 0
      if (this.dateinput2) this.day2 = this.toDayNumber(this.dateinput2)
      this.debug && console.log('day1', this.day1, 'day2', this.day2)
      if (isNaN(this.day1)) {
        this.$alert('The date (from) format is wrong', 'Error!!', {
          type: 'error'
        }).catch(() => {})
        return
      }
      if (isNaN(this.day2)) {
        this.$alert('The date (to) format is wrong', 'Error!!', {
          type: 'error'
        }).catch(() => {})
        return
      }
      if (this.day1 > 0 && this.day2 > 0 && Math.abs(this.day2 - this.day1) > 30) {
        this.$alert('Period of not more than 30 days', 'Error!!', {
          type: 'error'
        }).catch(() => {})
        return
      }
      this.dialogLeaderLoading = true
      this.getList()
    },
    // @
    handleFilter() {
      if (this.listQuery.sort === '2') return
      this.dialogLeaderLoading = true
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      const { page, limit } = this.listQuery
      let queryStr = `page=${page}&limit=${limit}`
      if (this.listQuery.sort === '1') {
        queryStr = `${queryStr}&type=1`
      } else {
        queryStr = `${queryStr}&type=2`
        if (this.day1 > 0) queryStr = `${queryStr}&day1=${this.day1}`
        if (this.day2 > 0) queryStr = `${queryStr}&day2=${this.day2}`
      }
      this.debug && console.log('queryStr', queryStr)
      game01Leaderboard(queryStr).then(result => {
        this.debug && console.log('game01Leaderboard-result', result)
        this.dialogLeaderVisible = true
        if (!result.data) return
        if (result.data.errorMess.length > 0) {
          const htmlStr = result.data.errorMess.join('<br>')
          this.$alert(htmlStr, 'Error!!', {
            type: 'error',
            dangerouslyUseHTMLString: true
          }).catch(() => {})
          return
        }
        if (!result.data.winners) return
        const data = result.data.winners
        let totalPower = 0
        this.leaderboardList = []
        for (let i = 0; i < data.length; i++) {
          totalPower += data[i].winPower
          const image = this.getVPunkImg(data[i].tokenId)
          const addressV = `${data[i].address.slice(0, 5)}...${data[i].address.slice(data[i].address.length - 3)}`
          this.leaderboardList.push({
            tokenId: data[i].tokenId,
            image: image,
            address: data[i].address,
            addressV: addressV,
            winPower: data[i].winPower
          })
        }
        const reward = Math.floor(8000 / totalPower * 100) / 100
        this.rewardText = `<b>${data.length} Winners</b> and total <b>${totalPower} winning POWER</b><br>Reward ~${reward} VPU/POWER`
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        this.leaderboardBtnLoading = false
        this.dialogLeaderLoading = false
      })
    },
    getVPunkImg(id) {
      let imgId = '000' + id
      imgId = imgId.slice(imgId.length - 4)
      // return "VPunks/punk"+imgId+".png";
      return `https://vpunks.com/images/vpunks/punk${imgId}.png`
    }
    // end: Dialog Leaderboard -----------------------------------------------
  }
}
</script>

<style>

</style>
