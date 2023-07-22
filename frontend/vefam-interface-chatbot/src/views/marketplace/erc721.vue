<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { ItemShow01, CollectionDetails01 } from "/@/types/collection";
import { cloneDeep } from "lodash-unified";
import { emitter } from "/@/utils/mitt";

import Weapon from "/@/static/minting.json";
import collectionList from "/@/static/collections.json";
import Pagination from "/@/components/Pagination/index.vue";
import SidebarMKP from "./components/sidebar.vue";
import SweepDialog from "./components/sweepDialog.vue";
import iconifyIconOnline from "/@/components/ReIcon/src/iconifyIconOnline";

defineOptions({
  name: "ERC1155"
});

const maxColWidth = ref(280); // bao gồm cả ColPadding
const minColWidth = 180; // bao gồm cả ColPadding
const maxSingleWidth = 380; // max width khi một hàng chỉ có 1 item, bao gồm cả ColPadding
const minColPadding = ref(5);
const maxColPadding = ref(12);
const colWidth = ref(maxColWidth.value);
const colPadding = ref(maxColPadding.value);
const debug = ref(false);

const isRotate1 = ref(false); // rotation arrow của View Options dropdown
const isRotate2 = ref(false);
const openSidebarMKP = ref(null);
const openSweepMKP = ref(null);
const radioSize = ref("1");
const ercOptions = ref([
  {
    label: "ERC-1155",
    value: "ERC1155"
  },
  {
    label: "ERC-721",
    value: "ERC721"
  }
]);
const selectedErc = ref(0);
const showBtnSweep = ref(false);
const itemShowList: ItemShow01[] = ref([]); // danh sách hiển thị trên trang
const pageQuery = {
  page: 1,
  limit: 15, // recommended: 100
  pageSizes: [20, 30, 50, 100] // recommended: [100]
};
const collectionDetails: CollectionDetails01 = collectionList.find(obj => {
  return obj.codename === "vpunks-weapons";
});
//
const itemList = Weapon.items; // danh sách tất cả items
const totalItems = ref(itemList.length);
getItemListShow(itemList);

onMounted(() => {
  window.addEventListener("resize", handleWindowResize);
  handleWindowResize();
  handleOptions(1);
  radioSize.value = "1";
});

onUnmounted(() => {
  window.removeEventListener("resize", handleWindowResize);
});

function changeSizeCard() {
  if (radioSize.value == "1") {
    maxColWidth.value = 280;
    minColPadding.value = 5;
    maxColPadding.value = 12;
  } else if (radioSize.value == "2") {
    maxColWidth.value = 150;
    maxColPadding.value = 5;
    minColPadding.value = 2;
  }

  handleWindowResize();
}

function handleWindowResize() {
  if (debug.value) console.log("---------- innerWidth:", window.innerWidth);
  const cpf = document.getElementById("item-card-row") as HTMLElement;
  if (debug.value) console.log("cpf", cpf);
  if (cpf) {
    const clientWidth = Math.floor(cpf.clientWidth - 1); // js luôn làm tròn clientWidth cho dù DOM là số lẻ
    let tempColWidth = maxColWidth.value;
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
      minColPadding.value +
      ((colWidth.value - minColWidth) *
        (maxColPadding.value - minColPadding.value)) /
        (maxColWidth.value - minColWidth);
    // }
  }
}

function getItemListPage(data: { page: number; limit: number }) {
  // if (debug.value) console.log("getItemListPage:", data);
  if (debug.value)
    console.log(
      "pageQuery: page:",
      pageQuery.value.page,
      ", limit:" + pageQuery.value.limit
    );
  //
  getItemListShow([]);
}

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

// new -----
function handleVisibleChange1(visible: boolean) {
  isRotate1.value = visible;
}

function handleVisibleChange2(visible: boolean) {
  isRotate2.value = visible;
}

function handldeSidebar() {
  openSidebarMKP.value.openSidebar(true);
}

function handleSort() {
  openSidebarMKP.value.openSort(true);
}

function handleSweep() {
  openSweepMKP.value.openSweep();
}

function handleOptions(index) {
  selectedErc.value = index;
  isRotate1.value = false;
}

emitter.on("resize", ({ detail }) => {
  let { width } = detail;
  width < 370 ? radioSize.value == "2" : radioSize.value == "1";
  if (window.innerWidth < 585) {
    maxColWidth.value = 280;
    showBtnSweep.value = true;
    radioSize.value = "1";
  } else {
    showBtnSweep.value = false;
  }
});
</script>

<template>
  <div class="marketplace-container">
    <el-row justify="center" style="margin: 100px; font-size: 40px; color: lime"
      >This is header banner</el-row
    >
    <!-- New Header -->
    <div class="button-gr-top">
      <el-row class="list-button" justify="space-between">
        <div>
          <el-button
            @click="handldeSidebar()"
            class="button-type-08"
            style="margin-right: 10px"
            ><IconifyIconOnline
              icon="material-symbols:filter-alt-outline-sharp"
          /></el-button>

          <el-dropdown
            style="margin-right: 10px"
            popper-class="custom-dropdown-mkp"
            trigger="click"
            @visible-change="handleVisibleChange1"
          >
            <el-button class="button-type07">
              <el-row
                >{{ ercOptions[selectedErc].label }}
                <span class="icon-down1" :class="{ open: isRotate1 }">
                  <IconifyIconOnline icon="akar-icons:chevron-down" />
                </span>
              </el-row>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  class="dropdown-erc"
                  v-for="(item, index) in ercOptions"
                  :key="index + item.label"
                  :class="selectedErc == index ? 'active' : ''"
                  @click="handleOptions(index)"
                  ><router-link :to="item.value">
                    <span style="user-select: none">
                      {{ item.label }}
                    </span></router-link
                  ></el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-button
            @click="handleSweep()"
            v-if="!showBtnSweep"
            class="button-type-08"
            style="margin-right: 10px"
            ><IconifyIconOnline
              style="margin-right: 5px"
              icon="el:broom"
            />Sweep
            <IconifyIconOnline
              style="margin-left: 5px"
              icon="fluent-mdl2:unknown-solid"
            />
          </el-button>
        </div>

        <div class="gr-right" style="display: flex; align-items: center">
          <el-radio-group
            class="radio-resize-card"
            v-model="radioSize"
            @change="changeSizeCard()"
          >
            <el-radio-button label="1"
              ><IconifyIconOnline icon="heroicons:squares-2x2-20-solid"
            /></el-radio-button>
            <el-radio-button label="2"
              ><IconifyIconOnline icon="healthicons:ui-menu-grid"
            /></el-radio-button>
          </el-radio-group>

          <el-dropdown
            style="margin-right: 10px"
            popper-class="custom-dropdown-mkp"
            class="sort-dropdown"
            trigger="click"
            @visible-change="handleVisibleChange2"
          >
            <el-button class="button-type04">
              <el-row
                >Sort by
                <span class="icon-down2" :class="{ open: isRotate2 }">
                  <IconifyIconOnline icon="akar-icons:chevron-down" />
                </span>
              </el-row>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>Price: Low To High</el-dropdown-item>
                <el-dropdown-item>Price: High to Low</el-dropdown-item>
                <el-dropdown-item>Newest To Oldest</el-dropdown-item>
                <el-dropdown-item>Oldest To Newest</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-button
            class="button-type-08"
            @click="handleSweep()"
            v-if="showBtnSweep"
            >Sweep
          </el-button>

          <el-button class="button-type07">Sell</el-button>
        </div>
      </el-row>
    </div>
    <!-- End Header ----------------------- -->
    <div class="position-btn-sort">
      <el-button @click="handleSort()" class="sort-btn" v-if="showBtnSweep"
        ><iconifyIconOnline
          style="margin-right: 4px"
          icon="material-symbols:sort"
        />
        Sort by
      </el-button>
      <!-- <el-button @click="handleSort()" class="sort-btn" v-if="showBtnSweep"
        >Filter
      </el-button> -->
      <!-- <el-button v-if="showBtnSweep">sort </el-button> -->
    </div>

    <div class="market-collections-container">
      <div class="left-side-market">
        <SidebarMKP ref="openSidebarMKP" />
      </div>
      <div class="right-side-market">
        <div class="items-collections-list">
          <el-row id="item-card-row" class="item-card-row" justify="center">
            <div
              v-for="(item, index) in itemShowList"
              :key="item.id"
              class="item-card-col"
              :style="{ width: colWidth + 'px', padding: colPadding + 'px' }"
            >
              <router-link :to="'details/' + item.id">
                <div class="item-card-body">
                  <!-- <router-link :to="'details/' + item.id"> -->
                  <div
                    class="card-panel-icon-wrapper"
                    :style="{
                      height: colWidth - colPadding * 2 + 'px'
                    }"
                  >
                    <el-image
                      class="card-panel-icon"
                      :src="item.img"
                      :lazy="index > 20"
                      fit="cover"
                      ><template #placeholder>
                        <div class="loader01">
                          <div class="inner one" />
                          <div class="inner two" />
                          <div class="inner three" />
                        </div> </template
                    ></el-image>
                  </div>
                  <!-- </router-link> -->
                  <div class="item-card-details">
                    <el-row :gutter="20">
                      <el-col :span="14">
                        <div class="item-card-name">
                          {{ item.name }}
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div class="item-card-price-text">#{{ item.id }}</div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="20">
                        <div class="item-card-prod">
                          {{ item.name }} Project
                        </div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="17">
                        <div class="item-card-name">100 VET</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="item-card-price">Details</div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </router-link>
            </div>
          </el-row>
          <el-row id="item-card-row" class="item-card-row" justify="center">
            <div
              v-for="(item, index) in itemShowList"
              :key="item.id"
              class="item-card-col"
              :style="{ width: colWidth + 'px', padding: colPadding + 'px' }"
            >
              <router-link :to="'details/' + item.id">
                <div class="item-card-body">
                  <!-- <router-link :to="'details/' + item.id"> -->
                  <div
                    class="card-panel-icon-wrapper"
                    :style="{
                      height: colWidth - colPadding * 2 + 'px'
                    }"
                  >
                    <el-image
                      class="card-panel-icon"
                      :src="item.img"
                      :lazy="index > 20"
                      fit="cover"
                      ><template #placeholder>
                        <div class="loader01">
                          <div class="inner one" />
                          <div class="inner two" />
                          <div class="inner three" />
                        </div> </template
                    ></el-image>
                  </div>
                  <div class="item-card-details">
                    <el-row :gutter="20">
                      <el-col :span="14">
                        <div class="item-card-name">
                          {{ item.name }}
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div class="item-card-price-text">#{{ item.id }}</div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="20">
                        <div class="item-card-prod">
                          {{ item.name }} Project
                        </div>
                      </el-col>
                      <!-- <el-col :span="6">
                        <div class="item-card-price">-</div>
                        <el-image class="vet-icon" :src="vetIcon" />
                      </el-col> -->
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="17">
                        <div class="item-card-name">100 VET</div>
                      </el-col>
                      <el-col :span="3">
                        <div class="item-card-price">Details</div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </router-link>
            </div>
          </el-row>
        </div>
      </div>
    </div>
    <Pagination
      v-show="itemShowList.length > 0"
      :total="totalItems"
      v-model:page="pageQuery.page"
      v-model:limit="pageQuery.limit"
      :page-sizes="pageQuery.pageSizes"
      @pagination="getItemListPage"
    />
    <SweepDialog ref="openSweepMKP" />
  </div>
</template>

<style lang="scss">
.custom-dropdown-mkp {
  .el-dropdown-menu {
    background-color: #0f1845;
    overflow: hidden;
  }
  .el-dropdown-menu__item {
    color: #fff;
  }
  .el-dropdown-menu__item:not(.is-disabled):focus {
    background-color: #293366;
    color: #ffff;
  }
  .dropdown-erc {
    &.active {
      font-weight: 600;
      color: #00d4ff !important;
    }
  }
  .el-popper__arrow::before {
    border-bottom-color: #0f1845;
    border-right-color: #0f1845;
    background: #0f1845 !important;
    border-color: #0f1845 !important;
  }
}
</style>

<style lang="scss" scoped>
.marketplace-container {
  margin: 0px !important;
  padding: 0px 0px 0px 0px;
  padding-bottom: 150px;
  // new
  .button-gr-top {
    background-color: #0d1333;
    position: sticky !important;
    top: 0px;
    z-index: 1;
    padding: 10px 10px 10px 10px;
  }
  .icon-down1 {
    transition: all 0.25s;
    margin-left: 4px;
    &.open {
      transform: rotate(-180deg);
      transition: all 0.25s;
    }
  }
  .icon-down2 {
    transition: all 0.25s;
    margin-left: 4px;
    &.open {
      transform: rotate(-180deg);
      transition: all 0.25s;
    }
  }
  .market-collections-container {
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    font-size: 30px;
    color: #45bbff;
    font-weight: bold;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .sort-btn {
    background: rgb(255, 255, 255);
    box-shadow: #fff 0px 4px 20px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
  }

  .left-side-market {
    position: sticky !important;
    top: 80px;
    height: auto;
    margin: 0;
    padding: 0;
    order: 0;
  }

  .right-side-market {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  :deep(.el-radio-button__inner) {
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }

  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    border: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.2);
    border: 0;
    border-radius: 10px;
  }

  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    box-shadow: unset;
    border: 1px solid rgb(61 66 92);
  }

  .el-radio-button {
    margin-right: 10px;
  }

  @media only screen and(max-width: 586px) {
    .radio-resize-card {
      display: none;
    }
    .sort-dropdown {
      display: none;
    }
    .button-type-08 {
      margin-right: 5px !important;
      display: unset;
    }
    .button-type07 {
      margin-left: 0px !important;
    }
  }

  // for card
  .items-collections-list {
    .item-card-row {
      width: 100%;
      justify-content: center;
    }
    .item-card-col {
      .card-panel-icon-wrapper {
        border-radius: 15px;
        width: 100%;
        position: relative;
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
        width: 100%;
        height: 100%;
        image-rendering: pixelated;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.4s ease 0s;

        &:hover {
          transform: scale(1.1);
          transition: transform 0.4s ease 0s;
        }
      }

      .item-card-body {
        border-radius: 20px;
        background-size: contain;
        background-color: rgba(63, 63, 63, 0.2);
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
            font-size: 16px;
            color: #fff;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .item-card-price-text {
            font-weight: bold;
            font-size: 18px;
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
            right: 10px;
            text-align: right;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }

          .item-card-prod {
            font-weight: 300;
            font-size: 15px;
            color: #ffffffab;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }

  .position-btn-sort {
    position: fixed;
    display: flex;
    bottom: calc(44px);
    left: 0px;
    right: 0px;
    z-index: 4;
    -webkit-box-pack: center;
    justify-content: center;
  }
}
</style>
