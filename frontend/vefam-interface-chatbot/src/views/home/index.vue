<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
// import { ElMessage } from "element-plus";
// Assets
import bannerImg from "/src/assets/image-banner.png";
import collectionList from "/@/static/collections.json";
import gameList from "/@/static/games.json";

//
defineOptions({
  name: "Home"
});

// Variables ******************************
// General
const debug = ref(false);
// Variables
const maxColWidth = 360;
const minColWidth = 240;
const maxColPadding = 10;
let colWidth = maxColWidth;
let colPadding = maxColPadding;
// end: Variables ******************************

// Composition API ******************************
onMounted(() => {
  if (debug.value) console.log("---------- Home", "onMounted");
  window.addEventListener("resize", handleWindowResize);
  handleWindowResize();
});

onBeforeUnmount(() => {
  if (debug.value) console.log("---------- Home", "onBeforeUnmount");
  window.removeEventListener("resize", handleWindowResize);
});
// end: Composition API ******************************

// Methods ******************************
function handleWindowResize() {
  // if (debug.value) console.log("---------- innerWidth:", window.innerWidth);
  const cpf = document.getElementById("games-card-row") as HTMLElement;
  if (cpf) {
    const clientWidth = Math.floor(cpf.clientWidth - 1); // js luôn làm tròn clientWidth cho dù DOM là số lẻ
    const tempColWidth = maxColWidth + maxColPadding * 2;
    const itemNum = Math.floor(clientWidth / tempColWidth);
    const widthUsed = tempColWidth * itemNum;
    const excessPadding = (clientWidth - widthUsed) / itemNum;
    colPadding = clientWidth < 400 ? 0 : maxColPadding;
    // console.log('---------- excessPadding:', itemNum, excessPadding)
    let colWidthUpdate = false;
    if (excessPadding > minColWidth / 2) {
      for (let i = itemNum + 1; i < itemNum + 10; i++) {
        const tempColWidth2 = Math.floor(clientWidth / i) - 1;
        if (tempColWidth2 >= minColWidth) {
          colWidth = tempColWidth2 - colPadding * 2;
          colWidthUpdate = true;
        }
        break; // break ngay nhưng vẫn sử dụng for vì có thể thay đổi logic sau này
      }
    }
    if (!colWidthUpdate) colWidth = tempColWidth - colPadding * 2;
  }
}

/*
function handleExplore() {
  ElMessage("coming soon!");
} */
// end: Methods ******************************
</script>

<template>
  <div class="home-container">
    <!-- Banner -->
    <div class="banner">
      <div class="banner-text">
        <div class="text-item">
          <h3 style="color: #4fecff">
            Discover, collect, play and sell extraordinary NFTs
          </h3>
          <p>
            VeFam distributes and incubates GameFi projects, including unique
            NFT collections and highly entertaining games
          </p>
        </div>
        <div class="button">
          <!-- <div class="button-explore">
            <el-button size="large" @click="handleExplore"> Explore </el-button>
          </div> -->

          <div class="border-linear01" style="z-index: 90">
            <router-link to="/games">
              <el-button
                style="height: 36px"
                class="button-type03"
                size="large"
                round
              >
                Play
              </el-button>
            </router-link>
          </div>

          <div
            class="border-linear01 auto-run"
            style="margin-left: 10px; z-index: 90"
          >
            <router-link to="/minting/index">
              <el-button
                style="height: 36px"
                class="button-type03"
                size="large"
                round
              >
                <IconifyIconOnline
                  style="margin-right: 6px; font-size: 20px"
                  class="arrow-down"
                  icon="emojione-monotone:hammer-and-pick"
                />Minting Now
              </el-button>
            </router-link>
          </div>
        </div>
      </div>
      <div class="banner-thumbnail">
        <div class="image">
          <el-image :src="bannerImg" fit="cover">
            <template #placeholder>
              <div class="loader01">
                <div class="inner one" />
                <div class="inner two" />
                <div class="inner three" />
              </div>
            </template>
          </el-image>
        </div>
      </div>
    </div>
    <!---------- Collections ---------->
    <h3 style="text-align: center; font-size: 1.5em">Collections</h3>
    <div class="items-container">
      <el-row id="collection-card-row" class="item-card-row" justify="center">
        <div
          v-for="item of collectionList"
          :key="item.id"
          class="item-card-col"
          :style="{ width: colWidth + 'px', padding: colPadding + 'px' }"
        >
          <div class="item-card-body">
            <router-link :to="'collections/details/' + item.codename">
              <div class="collection-image">
                <el-image
                  class="item-card-image"
                  :src="`./img/collections/${item.img}`"
                  fit="cover"
                >
                  <template #placeholder>
                    <div class="loader01">
                      <div class="inner one" />
                      <div class="inner two" />
                      <div class="inner three" />
                    </div>
                  </template>
                </el-image>
              </div>
            </router-link>
            <div class="item-card-footer">
              <div class="item-card-details">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <div class="item-card-name">
                      <router-link :to="'collections/details/' + item.codename">
                        {{ item.name }}
                      </router-link>
                      <div class="item-card-proj">
                        {{ item.project }} Project
                      </div>
                    </div>
                  </el-col>
                  <el-col
                    :span="12"
                    style="
                      display: flex;
                      justify-content: flex-end;
                      align-items: center;
                      font-size: 20px;
                    "
                  >
                    <div class="amount-items">{{ item.items }} Items</div>
                  </el-col>
                </el-row>
              </div>
              <div class="item-card-tags">
                <el-tag effect="plain" round class="item-tag">
                  {{ item.collections }} Collections
                </el-tag>
                <el-tag effect="plain" round class="item-tag ml-2">
                  {{ item.games }} Games
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-row>
    </div>
    <!---------- end: Collections ---------->

    <!---------- Games ---------->
    <h3 style="text-align: center; font-size: 1.5em; margin-top: 80px">
      Games
    </h3>
    <div class="items-container" style="margin-bottom: 100px">
      <el-row id="games-card-row" class="item-card-row" justify="center">
        <div
          v-for="item of gameList"
          :key="item.id"
          class="item-card-col"
          :style="{ width: colWidth + 'px', padding: colPadding + 'px' }"
        >
          <div class="item-card-body">
            <router-link :to="'games/details/' + item.codename">
              <div class="games-image">
                <el-image
                  class="item-card-image"
                  :src="`./img/games/${item.img}`"
                  fit="cover"
                >
                  <template #placeholder>
                    <div class="loader01">
                      <div class="inner one" />
                      <div class="inner two" />
                      <div class="inner three" />
                    </div>
                  </template>
                </el-image>
              </div>
            </router-link>
            <div class="item-card-footer">
              <div class="item-card-details">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <div class="item-card-name">
                      <router-link :to="'games/details/' + item.codename">{{
                        item.name
                      }}</router-link>
                    </div>
                    <div class="item-card-proj">{{ item.project }} Project</div>
                  </el-col>
                  <el-col
                    :span="12"
                    style="
                      display: flex;
                      justify-content: flex-end;
                      align-items: center;
                      font-size: 20px;
                    "
                  >
                    <IconifyIconOnline icon="ion:game-controller" />
                  </el-col>
                </el-row>
              </div>
              <div class="item-card-tags">
                <el-tag
                  v-for="(tag, index) of item.tags"
                  :key="tag + index"
                  effect="plain"
                  round
                  class="item-tag"
                  :class="{ 'ml-2': index > 0 }"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-row>
    </div>
    <!---------- end: Games ---------->
  </div>
</template>

<style lang="scss">
.size {
  height: 335px;
}
</style>

<style lang="scss" scoped>
.main-content {
  margin: 0 !important;
}

.home-container {
  // padding: 30px 20px 30px 20px;
  color: #ffff;
  max-width: 1920px;
  margin: 0 auto !important;

  .banner {
    background-image: url("/@/assets/img/bgbanner.png");
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;

    .banner-text {
      width: 50%;
      display: flex;
      padding: 20px 20px 20px 50px;
      align-items: flex-start;
      flex-direction: column;

      .text-item {
        width: 750px;
        max-width: 100%;

        & h3,
        & p {
          margin-bottom: 15px;
        }

        & h3 {
          font-size: 24px;
        }

        & p {
          color: #5a8fdc;
        }
      }

      .button {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .button-explore {
          padding-right: 30px;

          .el-button {
            background: linear-gradient(
              94.9deg,
              #00f6ff 0%,
              #5d7eff 48.44%,
              #5429a0 100%
            );
            transition: 0.5s ease-out;
            opacity: 0.8;

            &:hover {
              opacity: 1;
            }
          }
        }

        .el-button {
          font-weight: 700;
          width: 120px;
          height: 40px;
          border-radius: 20px;
          color: #ffff;
          border: none;
          transition: all 0.25s ease-in;

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }

    .banner-thumbnail {
      width: 50%;
      align-items: flex-end;
      display: flex;
      align-content: center;
      flex-direction: column;

      .image {
        max-width: 600px;
      }
    }
  }

  .item-card-row {
    width: 100%;
    justify-content: space-around;
  }

  .item-card-col {
    width: 300px;

    .item-card-body {
      border-radius: 8px;
      margin-bottom: 30px;
      background-color: #3e239b;
      overflow: hidden;
      -webkit-transition: 0.3s;
      transition: 0.3s;
      -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      .games-image {
        height: 200px;
        overflow: hidden;
        background-color: #f5f7fa08;
      }
      .collection-image {
        height: 200px;
        overflow: hidden;
        background-color: #f5f7fa08;
      }
      .item-card-image {
        width: 100%;
        height: 200px;
        transition: transform 0.5s ease;
        overflow: hidden;
        &:hover {
          transform: scale(1.1);
          transition: transform 0.5s ease;
        }
      }

      .item-card-footer {
        background-image: linear-gradient(22deg, #3f249c 0%, #311f98 80%);
        // background-image: linear-gradient(22deg, #362462 0%, #231d52 40%);
      }
      .item-card-details {
        padding: 10px;
        line-height: 1.5;

        .item-card-name {
          font-size: 20px;
          font-weight: bold;
          &:hover {
            color: #bfc9ff;
          }
        }

        .item-card-proj {
          font-weight: 300;
          font-size: 15px;
          color: #ffffffab;
        }

        .amount-items {
          color: #45bbff;
          font-size: 15px;
        }
      }

      .item-card-tags {
        padding: 10px 5px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);

        .item-tag {
          background-color: rgba(0, 0, 0, 0.2);
          border: 1px solid #606bbf00;
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
@media screen and(max-width: 480px) {
  .banner {
    .banner-text .text-item {
      & h3 {
        font-size: 22px !important;
      }
    }
  }
}
@media screen and(min-width: 1024px) {
  .banner {
    .banner-text .text-item {
      & h3 {
        font-size: 35px !important;
      }

      & p {
        font-size: 20px;
      }
    }
  }
}

@media screen and(min-width: 1200px) {
  .banner {
    .banner-text .text-item {
      h3 {
        font-size: 45px !important;
      }

      p {
        font-size: 25px;
      }
    }
  }
}
@media screen and(max-width: 800px) {
  .home-container {
    // padding: 0px 20px 30px 20px;

    .banner {
      flex-direction: column-reverse;
      padding: 0px 10px 20px 10px;

      .banner-text {
        width: 100%;
        padding: unset;
      }

      .banner-thumbnail {
        width: 80%;
        max-width: 400px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
