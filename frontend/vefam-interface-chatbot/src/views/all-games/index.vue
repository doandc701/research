<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import Pagination from "/@/components/Pagination/index.vue";
// Assets
import gameList from "/@/static/games.json";

defineOptions({
  name: "AllGames"
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
      <h1>All Games</h1>
    </div>
    <div class="discription-collections">
      <span style="width: 90%; text-align: center">
        Discover PVP and P2E games on VechainThor blockchain!!!
      </span>
    </div>
    <div class="border-top-linear">
      <hr />
    </div>
    <div class="filter-btn-gr">
      <el-dropdown disabled>
        <div class="border-btn">
          <el-button
            @click="handleExplore"
            type="primary"
            round
            class="btn-properties"
            >Fillter</el-button
          >
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown disabled>
        <div class="border-btn">
          <el-button
            @click="handleExplore"
            type="primary"
            round
            class="btn-recently"
            >IDS <IconifyIconOnline class="icon-arrow" icon="ep:arrow-down"
          /></el-button>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="items-games-container">
      <el-row id="games-card-row" class="item-card-row" justify="center">
        <div
          v-for="item of gameList"
          :key="item.id"
          class="item-card-col"
          :style="{ width: colWidth + 'px', padding: colPadding + 'px' }"
        >
          <!-- <div class="border-card-game"> -->
          <div class="item-card-body">
            <router-link :to="'details/' + item.codename">
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
            <div class="item-card-details">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="item-card-name">{{ item.name }}</div>
                  <div class="item-card-prod">{{ item.project }}</div>
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
                  <IconifyIconOnline
                    style="color: #fff"
                    icon="ion:game-controller"
                  />
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
            <!-- </div> -->
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
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    font-size: 30px;
    color: #45bbff;
    font-weight: bold;
  }
  .discription-collections {
    margin-top: 20px;
    margin-bottom: 20px;
    color: #dfedf5;
    font-size: 20px;
    // width: 75%;
    display: flex;
    justify-content: center;
  }
  .border-top-linear {
    background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
    // margin-left: 24px;
    // margin-right: 24px;
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
  .items-games-container {
    .item-card-row {
      width: 100%;
      justify-content: space-around;
    }
    .item-card-col {
      width: 300px;
      .item-card-body {
        border-radius: 20px;
        // margin-bottom: 30px;
        background-color: #273999;
        overflow: hidden;
        -webkit-transition: 0.3s;
        transition: 0.3s;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        // box-shadow: 1px 1px 15px 0px mediumpurple;
        .games-image {
          height: 200px;
          overflow: hidden;
        }
        .item-card-image {
          width: 100%;
          height: 200px;
          transition: transform 0.5s ease;
          &:hover {
            transform: scale(1.1);
            transition: transform 0.5s ease;
          }
        }

        .item-card-details {
          padding: 10px;
          line-height: 1.5;

          .item-card-name {
            font-weight: bold;
            font-size: 18px;
            color: #fff;
          }

          .item-card-prod {
            font-weight: 300;
            font-size: 15px;
            color: #ffffffab;
          }
        }
        .item-card-tags {
          padding: 10px 5px;
          border-top: 1px solid rgba(255, 255, 255, 0.25);

          .item-tag {
            background-color: rgba(255, 255, 255, 0.25);
            border: none;
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
