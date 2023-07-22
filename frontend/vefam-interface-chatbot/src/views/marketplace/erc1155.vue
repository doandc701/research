<script setup lang="ts">
import { onMounted, ref } from "vue";
import { emitter } from "/@/utils/mitt";
import collectionList from "/@/static/collections.json";
import SidebarMKP from "./components/sidebar.vue";
import SweepDialog from "./components/sweepDialog.vue";

defineOptions({
  name: "ERC721"
});

const maxColWidth = 325; // bao gồm cả ColPadding
const minColWidth = 280; // bao gồm cả ColPadding
const maxSingleWidth = 350; // max width khi một hàng chỉ có 1 item, bao gồm cả ColPadding
const minColPadding = 5;
const maxColPadding = 15;
const colWidth = ref(maxColWidth);
const colPadding = ref(maxColPadding);

const debug = ref(false);
const showBtnSweep = ref(false);
const isRotate1 = ref(false); // rotation arrow của View Options dropdown
const isRotate2 = ref(false);
const openSidebarMKP = ref(null);
const cardNFT = ref("nft" as "nft" | "collection");
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
const selectedErc = ref(1);
const openSweepMKP = ref(null);

const nftOrCollection = (type: "nft" | "collection"): void => {
  cardNFT.value = type;
};

onMounted(() => {
  window.addEventListener("resize", handleWindowResize);
  handleWindowResize();
  radioSize.value = "1";
  handleOptions(0);
  // handleNFTvsCollec();
  if (debug.value) console.log("cardNFT.value", cardNFT.value);
});
// new -----
function handleVisibleChange1(visible: boolean) {
  isRotate1.value = visible;
}

function handleVisibleChange2(visible: boolean) {
  isRotate2.value = visible;
}

function handleSort() {
  openSidebarMKP.value.openSort(true);
}

function handldeSidebar() {
  openSidebarMKP.value.openSidebar(true);
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
  if (window.innerWidth < 475) {
    showBtnSweep.value = true;
  } else {
    showBtnSweep.value = false;
  }
});

function handleWindowResize() {
  if (debug.value) console.log("---------- innerWidth:", window.innerWidth);
  const cpf = document.getElementById("item-card-row") as HTMLElement;
  if (debug.value) console.log("cpf", cpf);
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
</script>

<template>
  <div class="marketplace-container">
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
                  :class="selectedErc == index ? 'active' : ''"
                  :key="index + item.label"
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
            v-if="!showBtnSweep"
            @click="handleSweep()"
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
          <el-dropdown
            style="margin-right: 5px"
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
            v-if="showBtnSweep"
            @click="handleSweep()"
            >Sweep
          </el-button>

          <el-button class="button-type07">Sell</el-button>
        </div>
      </el-row>
    </div>

    <div class="position-btn-sort">
      <el-button @click="handleSort()" class="sort-btn" v-if="showBtnSweep"
        ><iconifyIconOnline
          style="margin-right: 4px"
          icon="material-symbols:sort"
        />
        Sort by
      </el-button>
    </div>

    <div class="market-collections-container">
      <div class="left-side-market">
        <SidebarMKP ref="openSidebarMKP" @nft-or-collection="nftOrCollection" />
      </div>
      <div class="right-side-market">
        <el-row align="middle" justify="center" v-if="cardNFT === 'nft'">
          <el-row
            class="item-market-list"
            align="middle"
            v-for="(item, index) in collectionList"
            :key="item.id"
          >
            <div style="display: flex" class="rightside-card">
              <el-row align="middle" style="margin-right: 10px"
                ><el-image
                  class="icon-img-list"
                  :src="`./img/collections/${item.img}`"
                  :lazy="index > 20"
                  fit="cover"
                  ><template #placeholder>
                    <div class="loader01">
                      <div class="inner one" />
                      <div class="inner two" />
                      <div class="inner three" />
                    </div> </template></el-image
              ></el-row>
              <el-row justify="center" style="flex-direction: column">
                <el-row>{{ item.name }} #000</el-row>
                <el-row style="font-size: 14px">{{ item.name }} Project</el-row>
              </el-row>
            </div>
            <hr />
            <div style="display: flex" class="leftside-card">
              <div class="position-text">
                <el-row style="font-size: 12px">Highest price</el-row>
                <el-row>$1.500</el-row>
              </div>
              <div class="position-text">
                <el-row style="font-size: 12px">Lowest price</el-row>
                <el-row>$2.300</el-row>
              </div>
              <div class="position-text" style="margin-right: 0">
                <el-row style="font-size: 12px">Quantity</el-row>
                <el-row>70</el-row>
              </div>
            </div>
          </el-row>
        </el-row>
        <el-row
          v-if="cardNFT === 'collection'"
          id="item-card-row"
          class="item-card-row"
        >
          <!-- max-width: 325px;
              width: 98%;
              margin: 10px;
            padding: 5px; -->
          <div
            class="card-collection"
            :style="{ width: colWidth + 'px', padding: colPadding + 'px' }"
            v-for="(item, index) in collectionList"
            :key="item.id"
          >
            <div
              style="
                background-color: rgba(63, 63, 63, 0.2);
                border-radius: 10px;
                padding: 10px;
              "
            >
              <!-- <el-row> -->
              <el-row class="img-card">
                <el-image
                  style="width: 100%; height: 220px; border-radius: 10px"
                  :src="`./img/collections/${item.img}`"
                  :lazy="index > 20"
                  fit="cover"
                  ><template #placeholder>
                    <div class="loader01">
                      <div class="inner one" />
                      <div class="inner two" />
                      <div class="inner three" />
                    </div> </template
                ></el-image>
              </el-row>
              <el-row
                class="name-card"
                style="
                  font-size: 16px;
                  color: #fff;
                  margin-top: 10px;
                  margin-bottom: 10px;
                "
                justify="space-between"
              >
                <div>Vpunks OG</div>
                <div>Vpunks Project</div>
              </el-row>
              <div class="info-card">
                <el-row justify="space-between">
                  <div class="position-info">
                    <el-row>Total item</el-row>
                    <el-row>10.000</el-row>
                  </div>
                  <div class="position-info">
                    <el-row>Listed</el-row>
                    <el-row>2406</el-row>
                  </div>
                </el-row>
                <el-row justify="space-between">
                  <div class="position-info" style="margin-bottom: 0">
                    <el-row>Highest price</el-row>
                    <el-row>100 VPU</el-row>
                  </div>
                  <div class="position-info" style="margin-bottom: 0">
                    <el-row>Lowest price</el-row>
                    <el-row>10 VPU</el-row>
                  </div>
                </el-row>
              </div>
              <!-- </el-row> -->
            </div>
          </div>
        </el-row>
      </div>
      <SweepDialog ref="openSweepMKP" />
    </div>
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
  .dropdown-content {
    &.active {
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
    font-size: 30px;
    color: #45bbff;
    font-weight: bold;
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
    // display: flex;
    // flex-direction: column;
    // align-items: center;
  }

  .item-card-row {
    width: 100%;
    justify-content: center;
  }

  :deep(.el-radio-button__inner) {
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }

  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    // border-color: unset;
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

  // new item card list
  .item-market-list {
    background-color: #3f3f3f33;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 15px;
    font-size: 16px;
    color: #dcdcdc;
    justify-content: space-between;
    width: 95%;
  }

  .position-text {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-right: 15px;
  }

  .icon-img-list {
    image-rendering: pixelated;
    height: 60px;
    width: 60px;
    border-radius: 10px;
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

  .sort-btn {
    background: rgb(255, 255, 255);
    box-shadow: #fff 0px 4px 20px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
  }

  .info-card {
    font-size: 16px;
    color: #fff;
    .position-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.1);
      margin-bottom: 7px;
      padding: 10px;
      border-radius: 10px;
      max-width: 150px;
      width: 48%;
      min-width: 100px;
    }
  }

  @media only screen and(max-width: 500px) {
    .item-market-list {
      flex-wrap: wrap;
      justify-content: center;
      flex-direction: column;
      width: 80%;
    }
    .rightside-card {
      margin-bottom: 15px;
    }
    hr {
      width: 55%;
      color: #555555;
      margin-bottom: 5px;
    }
  }

  @media only screen and(max-width: 475px) {
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
}
</style>
