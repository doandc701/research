<template>
  <div class="smart-app-container vpunk-games-container">
    <!-- <div class="notify">This feature is coming soon.</div> -->
    <!---------- Games ---------->
    <h3 class="app-con-title">VPunk Games</h3>

    <div class="items-container">
      <el-row id="games-card-row" class="item-card-row" justify="center">
        <div
          v-for="item of gameList"
          :key="item.id"
          class="item-card-col"
          :style="{ width: colWidth + 'px', padding: colPadding + 'px'}"
        >
          <div class="item-card-body">
            <div class="games-image">
              <router-link :to="'details/' + item.id">
                <el-image class="item-card-image" :src="`./images/games/${item.img}`" fit="cover" lazy>
                  <div slot="placeholder" class="image-slot">
                    <i class="el-icon-loading" />
                  </div>
                </el-image>
              </router-link>
            </div>
            <div class="item-card-details">
              <div class="item-card-name">
                <router-link :to="'details/' + item.id">{{ item.name }}</router-link>
              </div>
              <div class="item-card-proj">{{ item.project }}</div>
            </div>
            <div class="item-card-tags">
              <el-tag
                v-for="(tag, index) of item.tags"
                :key="tag+index"
                size="mini"
                class="item-tag"
                :class="{ 'ml-2': index > 0 }"
              >
                #{{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-row>
    </div> <!-- end: items-container -->
    <!---------- end: Games ---------->
  </div>
</template>

<script>
import gameList from '@/data/games.json'

const maxColWidth = 360
const minColWidth = 240
const maxColPadding = 10

export default {
  name: 'Games',
  data() {
    return {
      // general
      debug: false,
      address: null,

      // games
      gameList: gameList,
      colWidth: maxColWidth,
      colPadding: maxColPadding
    }
  },
  created() {
    this.debug && console.log('created - Games', window.selectedAccount)
    this.address = window.selectedAccount
  },
  mounted() {
    this.debug && console.log('mounted - Games')
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
  },
  beforeDestroy() {
    this.debug && console.log('beforeDestroy - Games')
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    // @
    handleWindowResize() {
      this.debug && console.log('---------- innerWidth:', window.innerWidth)
      const cpf = document.getElementById('games-card-row')
      if (cpf) {
        const clientWidth = Math.floor(cpf.clientWidth - 1) // js luôn làm tròn clientWidth cho dù DOM là số lẻ
        const tempColWidth = maxColWidth + maxColPadding * 2
        const itemNum = Math.floor(clientWidth / tempColWidth)
        const widthUsed = tempColWidth * itemNum
        const excessPadding = (clientWidth - widthUsed) / itemNum
        this.colPadding = clientWidth < 400 ? 0 : maxColPadding
        // console.log('---------- excessPadding:', itemNum, excessPadding)
        let colWidthUpdate = false
        if (excessPadding > minColWidth / 2) {
          for (let i = itemNum + 1; i < itemNum + 10; i++) {
            const tempColWidth2 = Math.floor(clientWidth / i) - 1
            if (tempColWidth2 >= minColWidth) {
              this.colWidth = tempColWidth2 - (this.colPadding * 2)
              colWidthUpdate = true
            }
            break // break ngay nhưng vẫn sử dụng for vì có thể thay đổi logic sau này
          }
        }
        if (!colWidthUpdate) this.colWidth = tempColWidth - (this.colPadding * 2)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.vpunk-games-container {
  .notify {
    padding: 5px 0 5px 10px;
    font-size: 18px;
    color: #1c9631;
    text-align: center;
    line-height: 40px;
  }
  .items-container {
    padding-top: 20px;
    .item-card-row {
      width: 100%;
      justify-content: space-around;
      display: flex;
      flex-wrap: wrap;
      &::before, &::after {
        display: none;
      }
    }
    .item-card-col {
      width: 300px;
      .item-card-body {
        border-radius: 12px;
        margin-bottom: 30px;
        background-color: #202440;
        overflow: hidden;
        -webkit-transition: 0.3s;
        transition: 0.3s;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 4px 4px 15px rgb(0 0 0 / 25%);
        .games-image {
          height: 225px;
          overflow: hidden;
        }
        .item-card-image {
          width: 100%;
          height: 225px;
          transition: transform .5s ease;
          &:hover {
            transform: scale(1.1);
            transition: transform .5s ease;
          }
        }
        .item-card-details {
          padding: 10px;
          line-height: 1.5;
          .item-card-name {
            font-weight: bold;
            &:hover {
              color: rgb(0 212 243);
            }
          }
          .item-card-proj {
            font-weight: 300;
            font-size: 15px;
            color: #ffffffab;
          }
        }
        .item-card-tags {
          padding: 10px 5px;
          border-top: 1px solid #525C9A;
          .item-tag {
            background-color: #0085CC;
            border: 1px solid #0085CC;
            border-radius: 16px;
            color: #ddd;
          }
          .ml-2 {
            margin-left: 0.5rem;
          }
        }
      }
    }
  }
}
</style>
