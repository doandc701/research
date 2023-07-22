<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import { GameDetails01 } from "/@/types/game";
// Assets
import gameList from "/@/static/games.json";
// General
const debug = ref(false);
// Variables
const route = useRoute();
const codenameList = gameList.map(obj => obj.codename);
const gameCodename =
  codenameList.indexOf(route.params.codename) > -1
    ? route.params.codename
    : codenameList[0];
// Components
const AboutComp = defineAsyncComponent(
  () => import(`./components/${gameCodename}/about.vue`)
);
const RulesComp = defineAsyncComponent(
  () => import(`./components/${gameCodename}/rules.vue`)
);
const GuidesComp = defineAsyncComponent(
  () => import(`./components/${gameCodename}/guides.vue`)
);
const ActivityComp = defineAsyncComponent(
  () => import(`./components/${gameCodename}/activity.vue`)
);
// Variables
const gameRate = ref(3);
const activeTab = ref("first");
const gameDetails: GameDetails01 = gameList.find(obj => {
  return obj.codename === gameCodename;
});

if (debug.value) console.log("gameDetails----------", gameDetails);
</script>

<template>
  <div class="game-details-container">
    <div class="detail-container">
      <!-- game-details-header -->
      <div class="game-details-header">
        <div v-if="gameCodename == gameDetails.codename" class="thumbnail">
          <div class="image">
            <el-image :src="`./img/games/${gameDetails.img}`" loading="lazy" />
          </div>
        </div>

        <div class="title">
          <h1>{{ gameDetails.name }}</h1>
          <span>VPunks Games</span>
          <div class="header-item-row rate1">
            <el-rate
              v-model="gameRate"
              disabled
              score-template="{value} points"
            />
          </div>
          <div class="header-item-row">
            <div class="flex-space">
              <el-link
                v-if="gameDetails.url_demo"
                class="link-demo linkmr"
                :href="gameDetails.url_demo"
                target="_blank"
              >
                <el-button class="btn-demo" type="info">Demo</el-button>
              </el-link>
              <el-link
                v-if="gameDetails.url_play"
                :href="gameDetails.url_play"
                is-underline="false"
                target="_blank"
              >
                <el-button class="my-button01-medium">
                  <IconifyIconOnline
                    icon="bx:play-circle"
                    style="margin-right: 2px; font-size: 16px"
                  />
                  Play</el-button
                >
              </el-link>
            </div>
          </div>
        </div>
        <div class="number-add">
          <div class="number-flex">
            <span class="addr">0000</span>
            <IconifyIconOnline icon="fa:user" />
          </div>
        </div>
      </div>
      <!-- end: game-details-header -->

      <!-- tabs -->
      <div class="tab-component">
        <el-tabs v-model="activeTab" class="tabs-blue-color">
          <el-tab-pane label="ABOUT" name="first">
            <AboutComp />
          </el-tab-pane>

          <el-tab-pane label="RULES" name="second">
            <RulesComp />
          </el-tab-pane>

          <el-tab-pane label="GUIDES" name="third">
            <GuidesComp />
          </el-tab-pane>

          <el-tab-pane label="ACTIVITY" name="fourth">
            <ActivityComp />
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- end: tabs -->
    </div>
  </div>
</template>

<style lang="scss">
.detail-container .el-row {
  justify-content: center;
}
.tab-component {
  .el-tabs__content {
    margin: 60px 0px;
  }
  .el-tabs__item {
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>

<style lang="scss" scoped>
.game-details-container {
  .detail-container {
    max-width: 1920px;
    margin: 0 auto !important;
    color: #ffff;
  }
  .game-details-header {
    padding-bottom: 20px;
    display: flex;
    justify-content: center;
    & h1 {
      font-size: 30px;
    }
    .thumbnail {
      display: flex;
      align-content: center;
      flex-direction: column;
      .image {
        max-width: 412px;
        height: auto;
        .el-image {
          border-radius: 15px;
          width: 100%;
          height: 230px;
          min-width: 400px;
        }
      }
    }
    .title {
      width: 50%;
      padding-left: 20px;
    }
    .number-add {
      .number-flex {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .addr {
          font-weight: 600;
          padding-right: 5px;
        }
      }
    }
  }
  .el-rate {
    height: 50px;
    width: 255px;
    padding-top: 5px;
    padding-bottom: 5px;
    :deep(.el-rate__text) {
      display: none;
    }
  }
  .header-item-row {
    .linkmr {
      margin-right: 14px;
    }
    .el-link.is-underline:hover:after {
      border-bottom: none;
    }

    .btn-demo {
      position: relative;
      width: 100px;
      height: 35px;
      max-width: 100%;
      font-weight: 600;
      transition: 0.25s ease-out;
      background-clip: padding-box;
      border: 1px solid transparent;
      background-color: #191a28;
      border-radius: 20px;
      &:hover {
        box-shadow: 0 4px 15px 0 #a370ff;
      }
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: -1;
        margin: -1px;
        background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
        border-radius: inherit;
      }
    }
    .my-button01-medium {
      background: linear-gradient(
        94.9deg,
        #00f6ff 0%,
        #5d7eff 48.44%,
        #5429a0 100%
      );
      border: none;
      color: #ffff;
      border-radius: 14px;
      width: 100px;
      height: 35px;
      max-width: 100%;
      font-weight: 600;
      opacity: 0.8;
      transition: 0.25s ease-out;
      &:hover {
        opacity: 1;
        transition: 0.25s ease-in;
      }
    }
  }

  .tabs-blue-color {
    :deep(.el-tabs__nav) {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
    :deep(.el-tabs__nav-scroll) {
      display: -webkit-box;
      -webkit-box-pack: center;
    }
    :deep(.el-tabs__nav-scroll .el-tabs__item.is-active) {
      color: #1fbfbf;
    }
    :deep(.el-tabs__nav-scroll .el-tabs__active-bar) {
      background-color: #1fbfbf;
    }
    :deep(.el-tabs__nav-scroll .el-tabs__item:hover) {
      color: #1fbfbf;
    }
    :deep(.el-tabs__header .el-tabs__nav-wrap::after) {
      background-color: #525c9a;
    }
  }
  @media screen and (max-width: 400px) {
    .el-tabs {
      :deep(.el-tabs__item) {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding: 0 8px;
      }
    }
  }
}
@media only screen and(max-width:480px) {
  .flex-space {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .game-details-container .game-details-header h1 {
    font-size: 18px !important;
  }
  .game-details-container .game-details-header .thumbnail .image .el-image {
    min-width: 100%;
  }
}
@media only screen and(max-width: 739px) {
  .game-details-container {
    .game-details-header {
      flex-wrap: wrap;
      & h1 {
        font-size: 25px;
      }
      .thumbnail {
        width: 100%;
        .image {
          max-width: 100%;
          .el-image {
            height: auto;
          }
        }
      }
      .title {
        width: 50%;
        padding-left: 0px;
      }
      .number-add {
        width: 50%;
      }
    }
    .el-rate {
      :deep(.el-rate__item .el-rate__icon) {
        font-size: 30px !important;
      }
    }
  }
}

@media only screen and(min-width: 740px) and(max-width:1023px) {
  .header-item-row.rate1 {
    margin-bottom: 68px;
  }
  .el-rate {
    :deep(.el-rate__item .el-rate__icon) {
      font-size: 38px !important;
    }
  }
}
@media only screen and(min-width: 1024px) {
  .header-item-row.rate1 {
    margin-bottom: 70px;
  }
  .el-rate {
    :deep(.el-rate__item .el-rate__icon) {
      font-size: 45px;
    }
  }
}
</style>
