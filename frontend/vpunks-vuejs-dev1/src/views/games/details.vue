<template>
  <div v-if="gameDetails.id!==undefined" class="smart-app-container game-details-container">
    <el-row class="game-details-header">
      <el-col :span="12">
        <h1>{{ gameDetails.name }}</h1>
        <span style="padding-left: 6px;">VPunks Games</span>
        <div class="header-item-row">
          <el-rate
            v-model="gameRate"
            disabled
            score-template="{value} points"
          />
        </div>
        <div class="header-item-row">
          <div v-if="gameId === '1'">
            <el-link href="https://vpunks.com/games-demo/vpunk-arena-220815/" target="_blank">
              <el-button class="btn-demo" type="info">Demo</el-button>
            </el-link>
          </div>
          <div v-else>
            <el-link href="https://vpunks.com/games/zombie-defense/?d=20220420" is-underline="false" target="_blank" style="margin-right: 30px;">
              <el-button class="my-button01-medium" icon="el-icon-video-play">Play</el-button>
            </el-link>
            <el-link href="https://vpunks.com/games/zombie-defense-demo/" target="_blank">
              <el-button class="btn-demo" type="info">Demo</el-button>
            </el-link>
          </div>
        </div>
      </el-col>
      <el-col v-if="gameId == gameDetails.id" :span="12">
        <div style="text-align: end;">
          <img :src="`./images/games/${gameDetails.img}`" style="width: 100%;max-width: 430px;border-radius: 15px;" loading="lazy">
        </div>
      </el-col>
    </el-row> <!-- end: game-details-header -->

    <el-row>
      <el-tabs v-model="activeTab" class="tabs-blue-color">
        <el-tab-pane label="ABOUT" name="first">
          <components :is="'About'+gameId" />
        </el-tab-pane>

        <el-tab-pane label="RULES" name="second">
          <components :is="'Rules'+gameId" />
        </el-tab-pane>

        <el-tab-pane label="GUIDES" name="third">
          <components :is="'Guides'+gameId" />
        </el-tab-pane>

        <el-tab-pane label="ACTIVITY" name="fourth">
          <components :is="'Activity'+gameId" />
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import gameList from '@/data/games.json'

export default {
  name: 'GameDetails',
  components: {
    // zombie-defense
    About0: () => import(/* webpackChunkName: "AboutZd" */ './components/zombie-defense/about.vue'),
    Rules0: () => import(/* webpackChunkName: "RulesZd" */ './components/zombie-defense/rules.vue'),
    Guides0: () => import(/* webpackChunkName: "GuidesZd" */ './components/zombie-defense/guides.vue'),
    Activity0: () => import(/* webpackChunkName: "ActivityZd" */ './components/zombie-defense/activity.vue'),
    // vpunk-arena
    About1: () => import(/* webpackChunkName: "AboutVa" */ './components/vpunk-arena/about.vue'),
    Rules1: () => import(/* webpackChunkName: "RulesVa" */ './components/vpunk-arena/rules.vue'),
    Guides1: () => import(/* webpackChunkName: "GuidesVa" */ './components/vpunk-arena/guides.vue'),
    Activity1: () => import(/* webpackChunkName: "ActivityVa" */ './components/vpunk-arena/activity.vue')
  },
  data() {
    return {
      // general
      debug: false,

      gameRate: 3,
      // gameList: gameList,
      gameDetails: {},
      activeTab: 'first',
      gameId: this.$route.params.id
    }
  },
  created() {
    this.debug && console.log('created - GameDetails')
    const gameDetails = gameList.find((game) => {
      return String(game.id) === this.gameId
    })
    if (gameDetails) this.gameDetails = gameDetails
    // console.log(this.gameDetails)
  }
}
</script>

<style lang="scss" scoped>
.game-details-container {
  .game-details-header {
    padding-bottom: 20px;
    display: flex;
    align-items: center;
  }
  .el-rate {
    height: 50px;
    width: 255px;
    padding-top: 5px;
    padding-bottom: 5px;
    ::v-deep .el-rate__text {
      display: none;
    }
    ::v-deep .el-rate__item .el-rate__icon {
      font-size: 45px !important;
    }
  }
  .header-item-row {
    margin-bottom: 10px;
    .el-link.is-underline:hover:after {
      border-bottom: none;
    }
    .btn-demo {
      border-radius: 14px;
      -webkit-border-radius: 14px;
      -moz-border-radius: 14px;
      &:hover {
        border-color: #7d7d7d;
      }
    }
  }

  .tabs-blue-color {
    ::v-deep .el-tabs__nav {
      // white-space: pre-wrap;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
    ::v-deep .el-tabs__nav-scroll {
      display: -webkit-box;
      -webkit-box-pack: center;
    }
    ::v-deep .el-tabs__nav-scroll .el-tabs__item.is-active {
      color: #1FBFBF;
    }
    ::v-deep .el-tabs__nav-scroll .el-tabs__active-bar {
      background-color: #1FBFBF00;
    }
    ::v-deep .el-tabs__nav-scroll .el-tabs__item:hover {
      color: #1FBFBF;
    }
    ::v-deep .el-tabs__header .el-tabs__nav-wrap::after {
      background-color: #525C9A;
    }
  }
  @media screen and (max-width: 650px) {
    .game-details-header {
      flex-wrap: wrap-reverse;
      display: flex;
      justify-content: center;
      .el-col-12 {
        width: auto !important;
      }
    }
  }
  @media screen and (max-width: 400px) {
    .el-tabs {
      ::v-deep .el-tabs__item {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding: 0 8px;
      }
    }
  }
}
</style>
