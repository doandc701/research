<script setup lang="ts">
// import bannerDetails from "/@/assets/Rectangle 79.jpg";
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  defineAsyncComponent
} from "vue";
import { cloneDeep } from "lodash-unified";
import { useRoute } from "vue-router";
import { CollectionDetails01, ItemShow01 } from "/@/types/collection";
import { getLocalFile } from "/@/api/app";
import { fromPairs } from "lodash-unified";
// Components
import Pagination from "/@/components/Pagination/index.vue";
import DetailsDialog from "/@/components/DetailsDialog/index.vue";
import Address from "/@/components/Address/index.vue";
import AddressDropdown from "/@/components/AddressDropdown/index.vue";
import Activity from "./components/activity.vue";
import About from "./components/about.vue";
// Assets
import vetIcon from "/@/assets/img/token/vet-logo.png";
import collectionList from "/@/static/collections.json";
import { getCollecAddr } from "/@/settings";
// import Pixel from "/@/static/collections/pixel-puffs.json";
// import Weapon from "/@/static/collections/vpunks-weapons2.json";
// import Punk from "/@/static/collections/vpunks-og2.json";

//
defineOptions({
  name: "CollectionDetails"
});

// Variables ******************************
// General ----------
const debug = ref(false);
const route = useRoute();
let colectionAddress = ref("");
// handleResize ----------
const maxColWidth = 280; // bao gồm cả ColPadding
const minColWidth = 180; // bao gồm cả ColPadding
const maxSingleWidth = 380; // max width khi một hàng chỉ có 1 item, bao gồm cả ColPadding
const minColPadding = 5;
const maxColPadding = 12;
const colWidth = ref(maxColWidth);
const colPadding = ref(maxColPadding);

//
const tabActiveName = ref("first");

//
const detailsDialogEl = ref(null);

// take codename
const codenameList = collectionList.map(obj => obj.codename);
const collectionCodeName =
  codenameList.indexOf(route.params.codename) > -1
    ? route.params.codename
    : codenameList[0];
// if (debug.value) console.log("collectionCodeName", collectionCodeName);

// Dynamic Components ----------
const Banner = defineAsyncComponent(
  () => import(`./components/banner/${collectionCodeName}/banner.vue`)
);

// data
const collectionDetails: CollectionDetails01 = collectionList.find(obj => {
  return obj.codename === collectionCodeName;
});
if (debug.value) console.log("collectionDetails", collectionDetails);

// tab-pane: Items
const pageQuery = ref({
  page: 1,
  limit: 100, // recommended: 100
  pageSizes: [20, 30, 50, 100] // recommended: [100]
});
let itemList: ItemShow01[] = []; // danh sách tất cả items
const itemShowList: ItemShow01[] = ref([]); // danh sách hiển thị trên trang
const totalItems = ref(0);
// end: Variables ******************************

// Composition API ******************************
onBeforeMount(() => {
  if (debug.value)
    console.log("---------- Collection-Details", "onBeforeMount");
  if (
    !collectionDetails.meta_data.type ||
    collectionDetails.meta_data.type === "csv"
  ) {
    getLocalCsvFile();
  } else {
    getLocalJsonFile();
  }
});

onMounted(() => {
  if (debug.value) console.log("---------- Collection-Details", "mounted");
  window.addEventListener("resize", handleWindowResize);
  handleWindowResize();
  colectionAddress.value = getCollecAddr(collectionCodeName.split());
});

onBeforeUnmount(() => {
  if (debug.value)
    console.log("---------- Collection-Details", "onBeforeUnmount");
  window.removeEventListener("resize", handleWindowResize);
});
// end: Composition API ******************************

// Methods ******************************
function getLocalJsonFile() {
  getLocalFile(`metadata/collections/${collectionCodeName}.json`)
    .then(result => {
      if (debug.value) console.log("result", result);
      if (typeof result !== "object" || !result.length) return;
      itemList = [];
      for (let i = 0; i < result.length; i++) {
        const name = result[i].name || collectionDetails.item_name;
        const img = result[i].img;
        const emoji = result[i].emoji;
        const attributes = result[i].attributes;
        itemList.push({
          id: parseInt(result[i].id),
          name,
          img,
          emoji,
          attributes
        });
      }
      totalItems.value = itemList.length;

      if (
        typeof result[0].rank !== "undefined" &&
        typeof result[0].rank !== "number"
      ) {
        for (let i = 0; i < result.length; i++)
          itemList[i].rank = parseInt(result[i].rank);
      }
      if (
        typeof result[0].rarity_score !== "undefined" &&
        typeof result[0].rarity_score !== "number"
      ) {
        for (let i = 0; i < result.length; i++)
          itemList[i].rarity_score = parseFloat(result[i].rarity_score);
      }
      getItemListShow();
    })
    .catch(error => {
      console.error(error);
    });
}

function getLocalCsvFile() {
  getLocalFile(`metadata/collections/${collectionCodeName}.csv`)
    .then(result => {
      // console.log("result", result);
      const lines = result.split("\r\n");
      const header = lines[0].split(",");
      const output = lines.slice(1).map(line => {
        const fields = line.split(",");
        // Sync1 không hỗ trợ Object.fromEntries
        // return Object.fromEntries(header.map((h, i) => [h, fields[i]]));
        return fromPairs(header.map((h, i) => [h, fields[i]]));
      });
      if (debug.value)
        console.log(
          "getLocalFile, output:",
          output[0],
          output[output.length - 1]
        );
      itemList = [];
      // const general = collectionDetails.meta_data.general;
      const attributes = collectionDetails.meta_data.attributes;
      for (let i = 0; i < output.length - 1; i++) {
        if (output[i]["Id"]) {
          const attr = {};
          for (let j = 0; j < attributes.length; j++) {
            attr[attributes[j]] = output[i][attributes[j]];
            if (!attr[attributes[j]]) attr[attributes[j]] = "NONE";
          }
          const name = output[i]["Name"] || collectionDetails.item_name;
          const rank = parseInt(output[i]["Rank"]);
          const rarity_score = parseFloat(output[i]["Rarity Score"]);
          itemList.push({
            id: parseInt(output[i]["Id"]),
            name,
            attributes: attr,
            rank,
            rarity_score
          });
        }
      }
      if (debug.value) console.log("itemList[0]:", itemList[0]);
      totalItems.value = itemList.length;
      getItemListShow();
    })
    .catch(error => {
      console.error(error);
    });
}

//
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

// sự kiện trả về từ pagination
function getItemListPage(data: { page: number; limit: number }) {
  // if (debug.value) console.log("getItemListPage:", data);
  if (debug.value)
    console.log(
      "pageQuery: page:",
      pageQuery.value.page,
      ", limit:" + pageQuery.value.limit
    );
  //
  getItemListShow();
}

// lấy danh sách để hiển thị trên DOM
function getItemListShow() {
  if (debug.value) console.log("getItemListShow");
  const start = (pageQuery.value.page - 1) * pageQuery.value.limit;
  let end = pageQuery.value.page * pageQuery.value.limit - 1;
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
function transformSlotProps(props) {
  const formattedProps = {};

  Object.entries(props).forEach(([key, value]) => {
    formattedProps[key] = value < 10 ? `0${value}` : String(value);
  });

  return formattedProps;
}

function onCountdownEnd() {
  timeEnd.value = true;
}

// date
const now = new Date();
// startTime là UTC (2022, 10, 1, 8, 0, 0)
const startTime = new Date(2022, 10, 1, 12, 0, 0); // tháng bắt đầu từ 0 đến 11
const timezone = now.getTimezoneOffset();
const countdownTime = startTime.getTime() - (now.getTime() + timezone * 60000);
const timeEnd = ref(countdownTime <= 0);
// end: Methods ******************************
</script>

<template>
  <div class="details-container">
    <div>
      <Banner />
    </div>
    <div class="header-content">
      <div class="avatar-cont">
        <el-avatar
          class="avatar-circle"
          style="box-shadow: rgb(130 123 253) 0px 0px 15px 0px"
          :size="150"
          :src="`./img/collections/avatars/${collectionDetails.avatar}`"
        >
          <template #placeholder>
            <div class="loader01">
              <div class="inner one" />
              <div class="inner two" />
              <div class="inner three" />
            </div>
          </template>
        </el-avatar>
      </div>
    </div>
    <div class="name-gallery">
      <h3>{{ collectionDetails.name }}</h3>
      <el-dropdown popper-class="addressDropdown-arrow" v-if="colectionAddress">
        <span class="el-dropdown-link">
          <el-tag class="btn-address">
            <Address :addr="colectionAddress" />
          </el-tag>
        </span>
        <template #dropdown>
          <AddressDropdown
            title="View address"
            :account-address="colectionAddress"
          />
        </template>
      </el-dropdown>
    </div>
    <div
      v-if="collectionCodeName == 'vpunks-weapons'"
      class="countdown-container"
    >
      <div v-if="timeEnd">
        <div class="border-linear01 auto-run">
          <router-link to="/minting/index">
            <el-button
              style="height: 36px; padding: 12px 19px"
              class="button-type03"
              size="large"
              round
            >
              Minting Now
            </el-button>
          </router-link>
        </div>
      </div>
      <div v-else>
        <div class="title">Minting time countdown</div>
        <vue-countdown
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
        </vue-countdown>
      </div>
    </div>
    <div class="position-card">
      <div class="card-statistics">
        <el-card class="statistics">
          <el-row>
            <el-row class="list-statistics">
              <div class="list-statistics-items">
                <el-col class="statistics-item">
                  <el-row class="statistics-item-number">
                    {{ collectionDetails.items }}
                  </el-row>
                  <el-row class="statistics-item-text">Items</el-row>
                </el-col>
              </div>
              <div class="list-statistics-items">
                <el-col class="statistics-item">
                  <el-row class="statistics-item-number">- - k</el-row>
                  <el-row class="statistics-item-text">Owners</el-row>
                </el-col>
              </div>
              <div class="list-statistics-items">
                <el-col class="statistics-item">
                  <el-row class="statistics-item-number">
                    <el-image class="vet-icon1" :src="vetIcon" />- -
                  </el-row>
                  <el-row class="statistics-item-text">Floor price</el-row>
                </el-col>
              </div>
              <div class="list-statistics-items">
                <el-col class="statistics-item">
                  <el-row class="statistics-item-number">
                    <el-image class="vet-icon2" :src="vetIcon" />- -
                  </el-row>
                  <el-row class="statistics-item-text">Volume</el-row>
                </el-col>
              </div>
            </el-row>
          </el-row></el-card
        >
      </div>
    </div>
    <div id="tab" class="tab-mode">
      <el-tabs v-model="tabActiveName" class="demo-tabs">
        <el-tab-pane label="Items" name="first">
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
                        <!-- <el-image
                          class="card-panel-icon"
                          v-if="
                            collectionDetails.codename == 'vpunks-weapons'
                          "
                          :src="item.img"
                          fit="cover"
                          style="width: 100%"
                        >
                          <template #placeholder>
                            <div class="loader01">
                              <div class="inner one" />
                              <div class="inner two" />
                              <div class="inner three" />
                            </div> </template
                        ></el-image> -->
                        <div
                          v-if="item.emoji"
                          :style="{ fontSize: colWidth * 0.5 + 'px' }"
                        >
                          {{ item.emoji }}
                        </div>
                        <el-image
                          v-else
                          class="card-panel-icon"
                          :src="item.img"
                          fit="cover"
                          :lazy="index > 12"
                          style="width: 100%"
                        >
                          <template #placeholder>
                            <div class="loader01">
                              <div class="inner one" />
                              <div class="inner two" />
                              <div class="inner three" />
                            </div>
                          </template>
                        </el-image>
                        <div
                          v-if="collectionDetails.is_3d"
                          class="bottom-right-icon"
                        >
                          <IconifyIconOnline icon="bi:badge-3d" />
                        </div>
                      </div>
                      <div class="item-card-details">
                        <el-row :gutter="20">
                          <el-col :span="14">
                            <div class="item-card-name">
                              {{ item.name }}
                            </div>
                          </el-col>
                          <el-col :span="6">
                            <div class="item-card-price-text">Price</div>
                          </el-col>
                        </el-row>
                        <el-row :gutter="20">
                          <el-col :span="14">
                            <div class="item-card-prod">#{{ item.id }}</div>
                          </el-col>
                          <el-col :span="6">
                            <div class="item-card-price">-</div>
                            <el-image class="vet-icon" :src="vetIcon" />
                          </el-col>
                        </el-row>
                        <el-row>
                          <div class="card-panel-tags">
                            <el-tag effect="plain" class="tagName">
                              {{ collectionDetails.standard }}
                            </el-tag>
                            <el-tag
                              effect="plain"
                              class="tagName"
                              style="position: relative; left: 5px"
                            >
                              <template
                                v-if="
                                  collectionDetails.codename == 'vpunks-weapons'
                                "
                              >
                                Level: {{ item.attributes.Level }}
                              </template>
                              <template v-else>
                                Rank: {{ item.rank }}
                              </template>
                            </el-tag>
                          </div>
                        </el-row>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-row>
            <pagination
              v-show="itemShowList.length > 0"
              :total="totalItems"
              v-model:page="pageQuery.page"
              v-model:limit="pageQuery.limit"
              :page-sizes="pageQuery.pageSizes"
              @pagination="getItemListPage"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="About" name="second">
          <About
            :collection-codeName="collectionCodeName"
            :about="collectionDetails.about"
          />
        </el-tab-pane>
        <el-tab-pane label="Activity" name="third">
          <Activity />
        </el-tab-pane>
      </el-tabs>
    </div>
    <DetailsDialog ref="detailsDialogEl" />
  </div>
</template>

<style lang="scss" scoped>
.top-banner-details {
  .banner-details-image {
    width: 100%;
    height: 100%;
  }
}
.details-container {
  margin: 0 0 100px 0 !important;
  .header-content {
    height: 0;
  }
  .avatar-cont {
    position: relative;
    bottom: 35px;
    text-align: center;
    .avt-loop {
      .el-carousel {
        background: #3e949b;
      }
    }
  }
  .el-avatar {
    --el-avatar-bg-color: #091f59;
  }
  .name-gallery {
    display: flex;
    justify-content: center;
    margin-top: 125px;
    flex-direction: column;
    align-items: center;
    align-content: center;
    color: #ffff;
    font-weight: bold;
    font-size: 25px;
    .btn-address {
      background: rgba(0, 0, 0, 0.2);
      color: #ffff;
      border-radius: 46px;
      border: none;
      box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.25);
      font-size: 15px;
      cursor: pointer;
      margin-top: 10px;
    }
  }
  .position-card {
    display: flex;
    justify-content: center;
    padding-right: 5px;
    padding-left: 5px;
  }
  .card-statistics {
    background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
    padding: 2px;
    display: flex;
    justify-content: center;
    border-radius: 14px;
    text-align: center;
    position: relative;
    margin-top: 20px;

    :deep(.el-card__body) {
      padding: 0px;
    }
    .statistics {
      background-color: #0d1333;
      color: #fff;
      border: none;
      border-radius: 12px;
      .el-row {
        display: flex;
        flex-wrap: wrap;
        position: relative;
        box-sizing: border-box;
        justify-content: center;
      }
      .list-statistics {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        .list-statistics-items {
          padding: 8px;
        }
      }
      .statistics-item {
        text-align: center;
        // font-size: 13px;
        width: 100%;
        height: 100%;
        border-radius: 12px;
        padding-right: 15px;
        padding-left: 15px;
        .statistics-item-number {
          color: #53a7ff;
          font-weight: bold;
          display: flex;
          align-items: center;
        }
        .statistics-item-text {
          font-size: 14px;
          color: #dbdbdb;
        }
        .vet-icon1 {
          width: 14px;
          height: 14px;
          position: absolute;
          top: 5px;
          left: 5px;
        }
        .vet-icon2 {
          width: 14px;
          height: 14px;
          position: absolute;
          top: 5px;
          left: -5px;
        }
      }
    }
  }
  .tab-mode {
    padding-top: 24px;
    .about-content {
      margin-top: 20px;
      margin-bottom: 20px;
      color: #ffffff;
      font-size: 15px;
      display: flex;
      justify-content: center;
      span {
        width: 70%;
      }
    }
    .border-top-linear {
      background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
      margin-top: 40px;
      margin-bottom: 40px;
      hr {
        height: 1px;
        color: #ffffff00;
      }
    }
    :deep(.el-tabs__nav-scroll) {
      display: -webkit-box;
      -webkit-box-pack: center;
    }
    :deep(.el-tabs__item.is-active) {
      color: #fff !important;
      font-weight: bold;
    }
    :deep(.el-tabs__item) {
      color: rgb(150, 150, 150);
      font-weight: bold;
      &:hover {
        color: rgb(201, 201, 201);
      }
    }
    :deep(.el-tabs__header .el-tabs__nav-wrap::after) {
      background-color: #525c9a;
      // opacity: 0.4;
    }
    :deep(.el-tabs__nav-scroll .el-tabs__active-bar) {
      background-color: #e53fa3;
      height: 2px;
    }
    :deep(.el-tabs__header) {
      padding: 0;
      position: relative;
      margin: 0 0 15px;
      padding-left: 24px;
      padding-right: 24px;
    }
  }
  .items-collections-list {
    padding: 20px 6px 0 6px;
    .item-card-row {
      width: 100%;
      justify-content: center;
    }
    .item-card-col {
      width: 300px;
      .bg-card-collection {
        background-image: linear-gradient(to bottom, #091f59, #5e2189, #ff7070);
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
          opacity: 0.2;
        }
      }
      .card-panel-icon-wrapper {
        position: relative;
        width: 100%;
        // height: 100%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.5s;
        overflow: hidden;
        &:hover {
          background: #87a5f238;
          transition: all 0.5s;
        }
        .bottom-right-icon {
          position: absolute;
          right: 8px;
          bottom: 5px;
          font-size: 18px;
          color: #9493aa;
        }
      }
      .card-panel-icon {
        height: 100%;
        width: 100%;
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
        background-size: contain;
        overflow: hidden;
        -webkit-transition: 0.3s;
        transition: 0.3s;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        position: relative;
        // padding: 5px;
        .item-card-details {
          background-color: rgb(20 34 63 / 59%);
          padding: 7px;
          line-height: 1.5;

          .item-card-name {
            width: 150px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-weight: bold;
            font-size: 16px;
            color: #fff;
          }
          .item-card-price-text {
            font-weight: bold;
            font-size: 16px;
            color: #fff;
            position: absolute;
            right: 10px;
          }
          .item-card-price {
            font-weight: 300;
            font-size: 15px;
            color: #4194ec;
            position: absolute;
            width: 115px;
            right: 30px;
            text-align: right;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .vet-icon {
            width: 14px;
            height: 14px;
            position: absolute;
            top: 4px;
            right: 11px;
          }

          .item-card-prod {
            font-weight: 300;
            font-size: 15px;
            color: #ffffffab;
          }
          .card-panel-tags {
            margin-top: 3px;
            border-top: 1px solid rgba(217, 217, 217, 0.5);
            padding: 5px 0px 0px 0px;
            width: 100%;
            .tagName {
              background-color: #cecece40;
              border: 0px solid #606bbf;
              border-radius: 16px;
              color: #fff;
              // padding: 0px 10px;
            }
          }
        }
      }
    }
  }
}

.countdown-container {
  margin-top: 10px;
  background-color: #0a0f29;
  text-align: center;
  display: flex;
  justify-content: center;
  // border-top: 1px solid #17225e;
  // border-bottom: 1px solid #17225e;
  .title {
    color: #00d4ff;
    font-size: 20px;
    padding: 5px 0;
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
