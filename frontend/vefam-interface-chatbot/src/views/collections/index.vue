<script setup lang="ts">
// import bannerCollection from "/@/assets/Rectangle 1022.jpg";
import { onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import collectionList from "/@/static/collections.json";
// import Pagination from "/@/components/Pagination/index.vue";

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
    <!-- <div class="top-banner-collections">
      <el-image
        class="banner-collections-image"
        :src="bannerCollection"
        fit="cover"
      />
    </div> -->
    <div class="title-collections-container">
      <h1>All Collections</h1>
    </div>
    <div class="discription-collections">
      <span style="width: 90%">
        With the desire to make VeFam is the largest NFT ecosystem. We build
        many integrations and add-ons ready to take over NFT in the world.
        Experience all of our collections now!!!
      </span>
    </div>
    <div class="border-top-linear">
      <hr />
    </div>
    <div class="filter-btn-gr">
      <!-- <el-dropdown> -->
      <div class="border-btn">
        <el-button
          type="primary"
          round
          class="btn-properties"
          @click="handleExplore"
          >Properties<IconifyIconOnline class="icon-arrow" icon="ep:arrow-down"
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
        </template> -->
      <!-- </el-dropdown> -->
      <!-- <el-dropdown> -->
      <div class="border-btn">
        <el-button
          type="primary"
          round
          class="btn-recently"
          @click="handleExplore"
          >Recently Received<IconifyIconOnline
            class="icon-arrow"
            icon="ep:arrow-down"
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
        </template> -->
      <!-- </el-dropdown> -->
    </div>
    <div class="items-collections-list">
      <el-row id="collection-card-row" class="item-card-row" justify="center">
        <div
          v-for="item of collectionList"
          :key="item.id"
          class="item-card-col"
          :style="{ width: colWidth + 'px', padding: colPadding + 'px' }"
        >
          <div class="item-card-body">
            <router-link :to="'details/' + item.codename">
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
                      <router-link :to="'details/' + item.codename">{{
                        item.name
                      }}</router-link>
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
    <!-- <Pagination /> -->
  </div>
</template>

<style lang="scss" scoped>
.top-banner-collections {
  .banner-collections-image {
    width: 100%;
    height: 100%;
  }
}
.collections-container {
  margin: 0px !important;
  // padding: 0px 24px 24px 24px;
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
    // background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
    margin-left: 24px;
    margin-right: 24px;
    margin-top: 60px;
    margin-bottom: 60px;
    hr {
      height: 1px;
      color: #525c9a94;
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

      .item-card-body {
        border-radius: 8px;
        margin-bottom: 30px;
        background-color: #273999;
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
            color: #ffff;
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
}
</style>
