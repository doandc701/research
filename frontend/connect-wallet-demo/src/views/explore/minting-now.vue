<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { cloneDeep } from "lodash-unified";
import DetailsDialog from "/@/components/DetailsDialog/index.vue";
import { CollectionDetails01, ItemShow01 } from "/@/types/collection";

// Assets
import Weapon from "/@/static/minting.json";
import collectionList from "/@/static/collections.json";
import bannerMinting from "/@/assets/collections/minting/header-img-mint1.png";

//
defineOptions({
  name: "Minting"
});

// Variables ******************************
// General ----------
const debug = ref(false);

// handleResize ----------
const maxColWidth = 280; // bao gồm cả ColPadding
const minColWidth = 180; // bao gồm cả ColPadding
const maxSingleWidth = 380; // max width khi một hàng chỉ có 1 item, bao gồm cả ColPadding
const minColPadding = 5;
const maxColPadding = 12;
const colWidth = ref(maxColWidth);
const colPadding = ref(maxColPadding);

// dialog
const detailsDialogEl = ref(null);

// data
const collectionDetails: CollectionDetails01 = collectionList.find(obj => {
  return obj.codename === "vpunks-weapons";
});
if (debug.value) console.log("collectionDetails", collectionDetails);

// tab-pane: items
const pageQuery = {
  page: 1,
  limit: 15, // recommended: 100
  pageSizes: [20, 30, 50, 100] // recommended: [100]
};
//
const itemList = Weapon.items; // danh sách tất cả items
const itemShowList: ItemShow01[] = ref([]); // danh sách hiển thị trên trang
// console.log("itemList", itemList);
const totalItems = ref(itemList.length);
getItemListShow(itemList);

// Composition API ******************************
onMounted(() => {
  if (debug.value) console.log("---------- Minting", "onMounted");
  window.addEventListener("resize", handleWindowResize);
  handleWindowResize();
});

onBeforeUnmount(() => {
  if (debug.value) console.log("---------- Minting", "onBeforeUnmount");
  window.removeEventListener("resize", handleWindowResize);
});
// end: Composition API ******************************

// Methods ******************************
function handleWindowResize() {
  // if (debug.value) console.log("---------- innerWidth:", window.innerWidth);
  const cpf = document.getElementById("item-card-row") as HTMLElement;
  // if (debug.value) console.log("cpf", cpf);
  if (cpf) {
    const clientWidth = Math.floor(cpf.clientWidth - 1); // js luôn làm tròn clientWidth cho dù DOM là số lẻ
    let tempColWidth = maxColWidth;
    // console.log("tempColWidth", tempColWidth);
    let itemNum = Math.floor(clientWidth / tempColWidth);
    // console.log("itemNum", itemNum);
    const widthUsed = tempColWidth * itemNum;
    const excessPadding = (clientWidth - widthUsed) / itemNum;
    // console.log("excessPadding", excessPadding);
    // console.log('---------- excessPadding:', itemNum, excessPadding)
    // nếu padding dư thừa > 1/2 minColWidth thì thử tăng thêm một itemNum
    if (excessPadding > minColWidth / 2) {
      for (let i = itemNum + 1; i < itemNum + 10; i++) {
        const tempColWidth2 = Math.floor(clientWidth / i) - 1;
        if (tempColWidth2 >= minColWidth) {
          tempColWidth = tempColWidth2;
          itemNum = i;
        }
        break; // break ngay nhưng vẫn sử dụng for vì có thể thay đổi logic sau này
      }
    }
    if (itemNum === 1) {
      tempColWidth =
        clientWidth < maxSingleWidth ? clientWidth : maxSingleWidth;
    }
    colWidth.value = tempColWidth;
    colPadding.value =
      minColPadding +
      ((colWidth.value - minColWidth) * (maxColPadding - minColPadding)) /
        (maxColWidth - minColWidth);
  }
}

// lấy danh sách để hiển thị trên DOM
function getItemListShow(item_list: any[]) {
  if (debug.value) console.log("getItemListShow, item_list:", item_list);
  const start = (pageQuery.page - 1) * pageQuery.limit;
  let end = pageQuery.page * pageQuery.limit - 1;
  if (end > totalItems.value - 1) end = totalItems.value - 1;
  if (debug.value)
    console.log("getItemListShow, totalItems:" + totalItems.value);
  if (debug.value) console.log("getItemListShow, start:" + start, "end:" + end);

  // itemShowList.value.splice(0, itemShowList.value.length); // để làm rỗng mảng hãy sử dụng splice nếu không có thể có lỗi không update DOM
  itemShowList.value = [];
  for (let i = start; i <= end; i++) {
    itemShowList.value.push(getItemDetails(i));
  }
  if (debug.value) console.log("---------- itemShowList", itemShowList);
}

function getItemDetails(index) {
  if (debug.value)
    console.log("getItemDetails, index:", index, itemList[index]);
  const item = cloneDeep(itemList[index]);
  let img = "";
  const item_image = collectionDetails.item_image;
  if (itemList[index].img) {
    img = `${item_image.base_url}${itemList[index].img}`;
  } else {
    let imgId = item.id;
    if (item_image.min_length && item_image.min_length > 1) {
      imgId = `00000000000000000000${item.id}`;
      imgId = imgId.slice(imgId.length - item_image.min_length);
    }
    img = `${item_image.base_url}${imgId}.${item_image.file_extension}`;
  }
  item.img = img;
  return item;
}

function showDetailsDialog(item: ItemShow01) {
  if (debug.value) console.log("showDetailsDialog, item", item);
  detailsDialogEl.value.open(item, collectionDetails);
}

// countdown
/*
function transformSlotProps(props) {
  const formattedProps = {};

  Object.entries(props).forEach(([key, value]) => {
    formattedProps[key] = value < 10 ? `0${value}` : String(value);
  });

  return formattedProps;
} */

// date
const now = new Date();
// startTime là UTC
const startTime = new Date(2022, 10, 1, 13, 15, 0); // tháng bắt đầu từ 0 đến 11
const timezone = now.getTimezoneOffset();
const countdownTime = startTime.getTime() - (now.getTime() + timezone * 60000);
const timeEnd = ref(countdownTime <= 0);
/* const onCountdownEnd = () => {
  timeEnd.value = true;
}; */
// console.log("countdownTime", countdownTime);
// end: Methods ******************************
</script>

<template>
  <div class="minting-container">
    <div class="minting-header">
      <div class="top-banner top-banner1">
        <el-image class="banner" :src="bannerMinting" alt="" fit="contain">
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
    <h1 class="title-minting">Minting Now</h1>
    <!-- <vue-countdown
      v-if="!timeEnd"
      class="countdown-mc"
      :time="countdownTime"
      :transform="transformSlotProps"
      @end="onCountdownEnd"
      v-slot="{ days, hours, minutes, seconds }"
    >
      <div v-if="days" class="countdown__block">
        <div class="countdown__digit">{{ days }}</div>
        <div class="countdown__text">DAY</div>
      </div>
      <div v-if="days" class="countdown__block">
        <div class="countdown__digit">{{ hours }}</div>
        <div class="countdown__text">HOUR</div>
      </div>
      <div v-if="days" class="countdown__block">
        <div class="countdown__digit">{{ minutes }}</div>
        <div class="countdown__text">MIN</div>
      </div>
      <div v-if="days" class="countdown__block">
        <div class="countdown__digit">{{ seconds }}</div>
        <div class="countdown__text">SEC</div>
      </div>
    </vue-countdown> -->

    <div class="items-collections-list">
      <el-row id="item-card-row" class="item-card-row" justify="center">
        <div
          v-for="(item, index) in itemShowList"
          :key="item.id"
          class="item-card-col"
          :style="{
            width: colWidth + 'px',
            padding: colPadding + 'px'
          }"
        >
          <div class="bg-card-collection">
            <div class="bg-img-card-collection">
              <div class="item-card-body">
                <div
                  class="card-panel-icon-wrapper"
                  :style="{
                    height: colWidth - colPadding * 2 + 'px'
                  }"
                  @click="showDetailsDialog(item)"
                >
                  <el-image
                    class="card-panel-icon"
                    :src="item.img"
                    fit="cover"
                    :lazy="index >= 8"
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
                <div class="item-card-details" style="position: relative">
                  <div class="image-description">
                    <div class="image-description-text">
                      <h4>{{ item.name }}</h4>
                      <p>Lv.{{ item.attributes.Level }}</p>
                    </div>
                    <div class="image-description-scores">
                      <div class="image-description-scores-box">
                        <span>- / -</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="timeEnd" class="btn-minting-now">
                    <router-link :to="'/minting/details/' + item.codename">
                      <el-button class="show-minting-now">
                        Minting Now
                      </el-button>
                    </router-link>
                  </div>
                  <div v-else class="btn-detail">
                    <el-button class="coming-soon-btn">Coming soon</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-row>
    </div>
    <div class="footer-banner">
      <span class="footer-banner-textSale">
        Up to <span style="color: #d95102">25% discount </span>
        when referred by
        <span style="color: #d95102">VeFam VIP</span>
      </span>
    </div>
    <DetailsDialog ref="detailsDialogEl" />
  </div>
</template>

<style lang="scss" scoped>
.minting-container {
  margin: 0 !important;
  .minting-header {
    position: relative;
    display: flex;
    height: 320px;
    .top-banner {
      width: 100%;
      height: 320px;
      position: absolute;
      background-size: contain;
    }
    .top-banner1 {
      background-image: url("/@/assets/collections/minting/header-img-mint.jpg");
      display: flex;
      align-items: center;
      justify-content: center;
      .banner {
        position: relative;
        width: 90%;
        max-width: 770px;
      }
    }
  }
  .title-minting {
    display: flex;
    justify-content: center;
    font-size: 30px;
    color: #45bbff;
    font-weight: bold;
    padding-top: 20px;
  }
  .items-collections-list {
    padding-top: 20px;
    padding-bottom: 20px;
    .item-card-row {
      width: 100%;
      justify-content: center;
    }
    .item-card-col {
      width: 300px;
      .bg-card-collection {
        background-image: linear-gradient(to bottom, #081129, #212e89, #9e9e9e);
        // background-image: linear-gradient(to bottom, #091f59, #601f8f, #939292);
        padding: 0px;
        border-radius: 20px;
        position: relative;
      }
      .bg-img-card-collection {
        position: relative;
        border-radius: 20px;
        &:before {
          border-radius: 20px;
          content: "";
          position: absolute;
          top: 0px;
          left: 0px;
          width: 100%;
          height: 100%;
          background-image: url("/@/assets/x-pat.png");
          background-size: cover;
          opacity: 0.3;
        }
      }
      .card-panel-icon-wrapper {
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.5s;
        overflow: hidden;
        cursor: pointer;
        &:hover {
          background: #87a5f238;
          transition: all 0.5s;
        }
      }
      .card-panel-icon {
        width: 100%;
        height: 100%;
        image-rendering: pixelated;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.4s ease 0s;
        &:hover {
          transform: scale(1.1);
          // transition: transform 0.5s ease;
          transition: transform 0.4s ease 0s;
        }
      }

      .item-card-body {
        border-radius: 20px;
        background-size: contain;
        overflow: hidden;
        -webkit-transition: 0.3s;
        transition: 0.3s;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        position: relative;
        // padding: 5px;
        .item-card-details {
          color: #fff;
          background-color: rgb(20 34 63 / 59%);
          // padding: 7px;
          line-height: 1.5;
          .image-description {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px;
            .image-description-text {
              flex-grow: 1;
              font-size: 14px;
            }
            .image-description-scores {
              display: flex;
              justify-content: flex-end;
              flex-grow: 1;
              line-height: 30px;
              text-align: center;
            }
          }
          .show-minting-now {
            width: 100%;
            height: 56px;
            text-align: center;
            border: none;
            position: relative;
            border-top: 1px solid #0d1333;
            background-color: #20244000;
            padding: 0;
            border-radius: 0;
            color: #fff;
            overflow: hidden;
            z-index: 1;
            &:hover {
              transform: scale(1.1);
            }
            &:before {
              content: "";
              position: absolute;
              transition: top 0.09s ease-in;
              background: #0f184573;
              bottom: 0;
              left: 0;
              right: 0;
              top: 100%;
              z-index: -1;
            }
            &:hover:before {
              top: 0;
            }
            &:after {
              content: "";
              background-color: rgba(255, 255, 255, 0.112);
              height: 100%;
              width: 3em;
              position: absolute;
              top: 0;
              left: -4.5em;
              transition: all 550ms cubic-bezier(0.19, 1, 0.22, 1);
              z-index: 10;
            }
          }

          .coming-soon-btn {
            width: 100%;
            height: 50px;
            text-align: center;
            border: none;
            border-top: 1px solid #0d1333;
            background-color: #ffffff00;
            padding: 0;
            border-radius: 0;
            color: #fff;
          }
        }
      }
      //
      @for $i from 1 through 40 {
        &:nth-child(#{$i}) {
          $delay: ($i * 200) + ms;
          .show-minting-now::after {
            transform: skewX(-45deg) translateX(350px);
            animation: slide 2s infinite;
            transition: all 0.5s ease-in-out;
            animation-delay: $delay;
          }
        }
      }
      @keyframes slide {
        0% {
          transform: skewX(-45deg) translateX(0);
        }

        50% {
          transform: skewX(-45deg) translateX(86);
        }

        100% {
          transform: skewX(-45deg) translateX(172);
        }
      }
      // end animation button
    }
  }
  .footer-banner {
    text-align: center;
    margin: 50px 10px;
    .footer-banner-textSale {
      color: #fff;
      font-family: monospace;
      margin: 1vw 0 1.5vw 0;
      font-size: 30px;
      font-size: min(max(15px, 4vw), 30px);
    }
  }
  @media screen and (max-width: 960px) {
    .minting-header {
      .top-banner {
        background-size: cover;
      }
    }
  }
  @media screen and (max-width: 530px) {
    .minting-header {
      height: 200px;
      .top-banner1 {
        height: 200px;
      }
    }
  }
}

.countdown-mc {
  display: flex;
  justify-content: center;
  color: #fff;
  .countdown__block {
    text-align: center;
    padding: 0px 15px;
    position: relative;
    &:first-child {
      padding-left: 0;
      .countdown__digit {
        &:before {
          display: none;
        }
      }
    }
    &:last-child {
      padding-right: 0;
    }
  }
  .countdown__text {
    text-transform: uppercase;
    margin-bottom: 5px;
  }
  .countdown__digit {
    font-size: 46px;
    font-weight: bold;
    line-height: 1;
    margin-bottom: 5px;
    &:before {
      content: ":";
      position: absolute;
      left: -5px;
    }
  }
}
</style>
