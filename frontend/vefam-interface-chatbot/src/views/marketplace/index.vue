<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
// import projectList from "../../../public/images/games/projects.json";
import collectionList from "/@/static/collections.json";
import { ElMessage } from "element-plus";

import Pagination from "/@/components/Pagination/index.vue";
defineOptions({
  name: "Collections"
});
onMounted(() => {
  // debug && console.log("---------- Home", "mounted");
  window.addEventListener("resize", handleWindowResize);
  handleWindowResize();
});

onUnmounted(() => {
  // debug && console.log("---------- Home", "beforeUnmount");
  window.removeEventListener("resize", handleWindowResize);
});
const maxColWidth = 360;
const minColWidth = 240;
const maxColPadding = 10;

let colWidth = maxColWidth;
let colPadding = maxColPadding;
// let debug = false;

function handleWindowResize() {
  // debug && console.log("---------- innerWidth:", window.innerWidth);
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
function handleExplore() {
  ElMessage("coming soon!");
}
</script>

<template>
  <div class="collections-container">
    <div class="title-collections-container">
      <h1>Marketplace</h1>
      <a href="https://vpunks.com/" target="blank">
        <el-button class="visit-marketplace" size="large">
          <IconifyIconOnline
            style="font-size: 18px"
            icon="ic:baseline-storefront"
          />
          Visit VPunks Marketplace
        </el-button>
      </a>
      <a
        href="https://vefam.com/projects/pixel-puffs/#/auctions/index"
        target="blank"
      >
        <el-button class="visit-marketplace" size="large">
          <IconifyIconOnline
            style="font-size: 18px"
            icon="ic:baseline-storefront"
          />
          Visit Pixel Puffs Marketplace
        </el-button>
      </a>
    </div>
    <div class="border-top-linear">
      <hr />
    </div>
    <div class="filter-btn-gr">
      <!-- <el-dropdown> -->
      <div class="border-btn">
        <el-button
          @click="handleExplore"
          type="primary"
          round
          class="btn-properties"
          >Fillter</el-button
        >
      </div>
      <!-- <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown> -->
      <!-- <el-dropdown> -->
      <div class="border-btn">
        <el-button
          @click="handleExplore"
          type="primary"
          round
          class="btn-recently"
          >IDS <IconifyIconOnline class="icon-arrow" icon="ep:arrow-down"
        /></el-button>
      </div>
      <!-- <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown> -->
    </div>
    <div style="color: #0df11f; padding: 20px 0px 20px">
      VeFam market is coming soon.
    </div>
    <div class="items-collections-list" style="display: none">
      <el-row id="collection-card-row" class="item-card-row" justify="center">
        <div
          v-for="item of collectionList"
          :key="item.id"
          class="item-card-col"
          :style="{ width: colWidth + 'px', padding: colPadding + 'px' }"
        >
          <div class="border-card-collection">
            <router-link :to="'details/' + item.id">
              <div class="item-card-body">
                <!-- <router-link :to="'details/' + item.id"> -->
                <div class="card-panel-icon-wrapper">
                  <el-image
                    class="card-panel-icon"
                    :src="`./images/games/${item.img2}`"
                    fit="cover"
                    lazy
                  />
                </div>
                <!-- </router-link> -->
                <div class="item-card-details">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div class="item-card-name">
                        {{ item.name }}
                      </div>
                      <div class="item-card-prod">{{ item.games }} Games</div>
                    </el-col>
                    <el-col
                      :span="12"
                      style="
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                      "
                    >
                      <!-- style="
                            display: flex;
                            justify-content: flex-end;
                            align-items: center;
                            font-size: 20px;
                            color: #fff;
                          " -->
                      <!-- <IconifyIconOnline icon="ic:outline-collections" /> -->
                      <div class="item-card-price-text">Price</div>
                      <div class="item-card-price">-</div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </el-row>
    </div>
    <Pagination />
  </div>
</template>

<style lang="scss" scoped>
.collections-container {
  margin: 0px !important;
  padding: 0px 24px 24px 24px;
  padding-bottom: 150px;
  .title-collections-container {
    margin-top: 50px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 30px;
    color: #45bbff;
    font-weight: bold;
    .visit-marketplace {
      margin-top: 10px;
      background-color: #13ce66;
      color: #fff;
      border: none;
      &:hover {
        background-color: #50c786;
      }
    }
  }
  .border-top-linear {
    // background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
    margin-top: 60px;
    margin-bottom: 60px;
    hr {
      height: 1px;
      color: #525c9a;
    }
  }
  .filter-btn-gr {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 50px;
    .border-btn {
      background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
      padding: 2px;
      display: flex;
      justify-content: center;
      border-radius: 20px;
      text-align: center;
      position: relative;
      margin-right: 20px;

      &:before {
        content: "";
        background: linear-gradient(
          45deg,
          #ff0000,
          #ff7300,
          #fffb00,
          #48ff00,
          #00ffd5,
          #002bff,
          #7a00ff,
          #ff00c8,
          #ff0000
        );
        position: absolute;
        top: -2px;
        left: -2px;
        background-size: 400%;
        z-index: -1;
        filter: blur(4px);
        width: calc(100% + 3px);
        height: calc(100% + 3px);
        animation: glowing 20s linear infinite;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        border-radius: 20px;
      }
      &:active {
        color: #000;
      }
      &:active:after {
        background: transparent;
      }
      &:hover:before {
        opacity: 1;
      }
      @keyframes glowing {
        0% {
          background-position: 0 0;
        }
        50% {
          background-position: 400% 0;
        }
        100% {
          background-position: 0 0;
        }
      }
    }
    .btn-properties {
      background-color: #0d1333;
      border: none;
      color: #fff;
    }
    .btn-recently {
      background-color: #0d1333;
      border: none;
      color: #fff;
    }
    .icon-arrow {
      vertical-align: middle;
      margin-left: 4px;
    }
  }
  .items-collections-list {
    .item-card-row {
      width: 100%;
      justify-content: space-around;
    }
    .item-card-col {
      width: 300px;
      .border-card-collection {
        background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
        padding: 1px;
        border-radius: 20px;
      }
      .card-panel-icon-wrapper {
        border-radius: 15px;
        background-color: #607bbf;
        width: 100%;
        // height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.5s;
        overflow: hidden;
        &:hover {
          background: #87a5f2;
          transition: all 0.5s;
        }
      }
      .card-panel-icon {
        height: 195px;
        image-rendering: pixelated;
        display: flex;
        align-items: center;
        justify-content: center;
        // transition: transform 0.5s ease;
        transition: transform 0.4s ease 0s;

        &:hover {
          transform: scale(1.1);
          // transition: transform 0.5s ease;
          transition: transform 0.4s ease 0s;
        }
      }

      .item-card-body {
        border-radius: 20px;
        // margin-bottom: 30px;
        background-color: #171b33;
        overflow: hidden;
        -webkit-transition: 0.3s;
        transition: 0.3s;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        padding: 5px;

        .item-card-details {
          padding: 5px;
          line-height: 1.5;

          .item-card-name {
            font-weight: bold;
            font-size: 18px;
            color: #fff;
          }
          .item-card-price-text {
            font-weight: bold;
            font-size: 18px;
            color: #fff;
          }
          .item-card-price {
            font-weight: 300;
            font-size: 15px;
            color: #4194ec;
          }

          .item-card-prod {
            font-weight: 300;
            font-size: 15px;
            color: #ffffffab;
          }
        }
      }
    }
  }
}
</style>
