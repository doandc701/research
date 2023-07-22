<script setup lang="ts">
/*
// issues ----------
1. chưa review css, DOM
*/
import { ref, computed, reactive, onMounted, onBeforeUnmount } from "vue";
import Address from "/@/components/Address/index.vue";
import AddressDropdown from "/@/components/AddressDropdown/index.vue";
import TransferDialog from "/@/components/TransferDialog/index.vue";
import { CollectionDetails01, ItemShow01 } from "/@/types/collection";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { getCollecAddr } from "/@/settings";
// Assets
import vetIcon from "/@/assets/img/token/vet-logo.png";

// Variables ******************************
// General
const debug = ref(false);
// Variables
const dialogVisible = ref(false);
const transferDialogEl = ref(null);
const tabActiveName = ref("details");
const showFlag = ref(false); // showtext
const ruleFormRef = ref<FormInstance>();
const collectionDetails: CollectionDetails01 = ref({});
const itemDetails: ItemShow01 = ref({});
let colectionAddress = ref("");
// View Options
const optIndexSelected = ref(0); // 0: Preview
const itemOpenPrevId = ref(-1); // token Id đã mở trước đó
const isRotate = ref(false); // rotation arrow của View Options dropdown
const itemViewOptions = ref([
  {
    label: "Preview",
    disabled: false
  },
  {
    label: "3D view",
    disabled: true
  }
]);
// end: Variables ******************************

// linkUrl
const fromCollec = ref(true);
const fromProfile = ref(false);
const linkUrl = window.location.href.split("#")[1];

// Methods ******************************
function open(item: ItemShow01, collection_details: CollectionDetails01) {
  if (debug.value) console.log("open -> item", item);
  if (debug.value)
    console.log("open -> collection_details", collection_details);
  itemDetails.value = item;
  collectionDetails.value = collection_details;
  dialogVisible.value = true;
  //
  if (item.id !== itemOpenPrevId.value) {
    optIndexSelected.value = 0;
    itemOpenPrevId.value = item.id;
  }
  //
  let urlCollec = `/collections/details/${collectionDetails.value.codename}`;
  let urlProfile = `/account/profile`;
  // console.log(urlCollec);
  if (linkUrl != urlCollec) fromCollec.value = false;
  if (linkUrl == urlProfile) fromProfile.value = true;
  colectionAddress.value = getCollecAddr(
    collectionDetails.value.codename.split()
  );
}

// TransferDialog
function showTransferDialog(itemDetails: ItemShow01) {
  if (debug.value) console.log("showTransferDialog", itemDetails);
  transferDialogEl.value.openTransferItem(itemDetails, collectionDetails);
}

// dropdown-item click
const handleOptions = index => {
  optIndexSelected.value = index;
  isRotate.value = false;
};
//

//
const receiveMessage = e => {
  // console.log("receiveMessage", e.data);
  if (e.data.event === "model-loaded") {
    itemViewOptions.value[1].disabled = false;
    optIndexSelected.value = 1; // 1 = 3D view index
  }
};

//
const getImgName = imgUrl => {
  // console.log("getImgName", imgUrl);
  if (!imgUrl || !collectionDetails.value.is_3d) return "";
  const arr = imgUrl.split("/");
  const resultImgae = arr[arr.length - 1].split(".");
  return resultImgae[0];
};

// dropdown: Open & Close
function handleVisibleChange(visible: boolean) {
  isRotate.value = visible;
}
// end: Methods ******************************

// Composition API ******************************
onMounted(() => {
  window.addEventListener("message", receiveMessage);
});

onBeforeUnmount(() => {
  window.removeEventListener("message", receiveMessage);
});
// end: Composition API ******************************

// Components using <script setup>
defineExpose({
  open
});
</script>

<template>
  <div class="dialog-details">
    <el-dialog
      v-model="dialogVisible"
      title="Viewing NFT"
      custom-class="dialog-type2"
    >
      <div class="nft-details-container">
        <!---------- left-box ---------->
        <div class="left-box">
          <div class="panel-group">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper">
                <!---------- dropdown [trigger="click"] ---------->
                <el-dropdown
                  v-if="collectionDetails.is_3d"
                  popper-class="custom-dropdown"
                  trigger="click"
                  @visible-change="handleVisibleChange"
                >
                  <div class="box-options">
                    <div class="box-options-select">
                      <div class="select-about">
                        <span class="select-label">
                          {{ itemViewOptions[optIndexSelected].label }}
                        </span>
                      </div>
                      <span class="icon-down" :class="{ open: isRotate }">
                        <IconifyIconOnline icon="akar-icons:chevron-down" />
                      </span>
                    </div>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        class="dropdown-content"
                        v-for="(item, index) in itemViewOptions"
                        :key="index + item.label"
                        :disabled="item.disabled"
                        :class="optIndexSelected == index ? 'active' : ''"
                        @click="handleOptions(index)"
                      >
                        <span style="user-select: none">
                          {{ item.label }}
                        </span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <!---------- end: dropdown ---------->

                <!---------- iframe | image ---------->
                <iframe
                  v-if="collectionDetails.is_3d"
                  :src="
                    'html/weapon3d/index.html?name=' +
                    getImgName(itemDetails.img)
                  "
                  title="W3Schools Free Online Web Tutorials"
                  class="iframe3D"
                  :class="optIndexSelected == 1 ? 'img-show' : 'img-hide'"
                />
                <div v-if="itemDetails.emoji" style="font-size: 140px">
                  {{ itemDetails.emoji }}
                </div>
                <el-image
                  v-else
                  class="card-panel-icon"
                  :class="optIndexSelected == 0 ? 'img-show' : 'img-hide'"
                  fit="cover"
                  :src="itemDetails.img"
                >
                  <template #placeholder>
                    <div class="loader01">
                      <div class="inner one" />
                      <div class="inner two" />
                      <div class="inner three" />
                    </div>
                  </template>
                </el-image>
                <!---------- end: iframe | image ---------->
              </div>
              <div class="card-panel-description">
                <div class="item-card-details">
                  <el-row :gutter="20">
                    <el-col :span="14">
                      <div class="card-panel-text">
                        {{ itemDetails.name }}
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="price-text">High Offer</div>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="14">
                      <div class="tokenId-line">#{{ itemDetails.id }}</div>
                    </el-col>
                    <el-col :span="6">
                      <div class="card-panel-price">
                        <div>-</div>
                        <el-image class="vet-icon1" :src="vetIcon" />
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div class="card-panel-tags">
                  <el-tag effect="plain" class="tagName">
                    {{ collectionDetails.standard }}
                  </el-tag>
                  <el-tag
                    v-if="collectionDetails.codename == 'vpunks-weapons'"
                    effect="plain"
                    class="tagName"
                    style="position: relative; left: 5px"
                  >
                    Level: {{ itemDetails.attributes.Level }}
                  </el-tag>
                  <el-tag
                    v-else
                    effect="plain"
                    class="tagName"
                    style="position: relative; left: 5px"
                  >
                    Rank: {{ itemDetails.rank }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!---------- end: left-box ---------->

        <!---------- right-box ---------->
        <div class="right-box">
          <el-tabs v-model="tabActiveName" type="card">
            <!---------- tab-pane: details ---------->
            <el-tab-pane label="Details" name="details">
              <div v-show="!showFlag">
                <div class="introduce">
                  {{ collectionDetails.about.slice(0, 90) }}...
                  <button class="btn-show" @click="showFlag = true">
                    Show More
                  </button>
                </div>
              </div>
              <div v-show="showFlag">
                <el-row class="introduce">
                  {{ collectionDetails.about }}
                </el-row>
                <button class="btn-show" @click="showFlag = false">
                  Show Less
                </button>
              </div>
              <div class="infomation">
                <el-row :gutter="24">
                  <el-col :span="8">Name</el-col>
                  <el-col :span="1">:</el-col>
                  <el-col :span="14" class="text-blue">
                    {{
                      itemDetails.name
                        ? itemDetails.name
                        : collectionDetails.item_name
                    }}
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="8">Token ID</el-col>
                  <el-col :span="1">:</el-col>
                  <el-col :span="14">#{{ itemDetails.id }}</el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="8">Collection</el-col>
                  <el-col :span="1">:</el-col>
                  <el-col :span="14" v-if="fromCollec == false">
                    <router-link
                      :to="'/collections/details/' + collectionDetails.codename"
                    >
                      <el-link :underline="false" class="linkTo"
                        >{{ collectionDetails.name }}
                        <IconifyIconOnline icon="ep:d-arrow-right"
                      /></el-link>
                    </router-link>
                  </el-col>
                  <el-col v-else :span="14" class="text-blue">
                    {{ collectionDetails.name }}
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="8">Standard</el-col>
                  <el-col :span="1">:</el-col>
                  <el-col :span="14" class="text-blue">
                    {{ collectionDetails.standard }}
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="8">Quantity</el-col>
                  <el-col :span="1">:</el-col>
                  <el-col :span="14" v-if="itemDetails.quantity == null"
                    >- / -</el-col
                  >
                  <el-col :span="14" v-else>{{ itemDetails.quantity }}</el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="8">Blockchain</el-col>
                  <el-col :span="1">:</el-col>
                  <el-col :span="14" class="text-blue">VeChain</el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="8">Owner's Address</el-col>
                  <el-col :span="1">:</el-col>
                  <el-col :span="14" class="more-blue">- -</el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="8" class="">Contract Address</el-col>
                  <el-col :span="1">:</el-col>
                  <el-col :span="14">
                    <el-dropdown
                      style="display: flex; align-items: center"
                      popper-class="addressDropdown-arrow"
                      v-if="colectionAddress"
                    >
                      <Address
                        style="font-size: 14px"
                        class="more-blue"
                        :addr="colectionAddress"
                      />
                      <template #dropdown>
                        <AddressDropdown
                          title="View address"
                          :account-address="colectionAddress"
                        />
                      </template>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <!---------- end: tab-pane: details ---------->

            <!---------- tab-pane: attributes ---------->
            <el-tab-pane label="Attributes" name="attributes">
              <div class="attributes" v-if="itemDetails.attributes">
                <el-row
                  :gutter="24"
                  v-for="attrKey in Object.keys(itemDetails.attributes)"
                  :key="attrKey"
                >
                  <el-col :span="8">
                    {{ attrKey }}
                  </el-col>
                  <el-col :span="1">:</el-col>
                  <el-col :span="14" class="text-blue">
                    {{ itemDetails.attributes[attrKey] }}
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <!---------- end: tab-pane: attributes ---------->

            <!---------- tab-pane: high-offer ---------->
            <el-tab-pane label="High Offer" name="high-offer">
              <div class="attributes">
                <span>Comming soon!!!</span>
              </div>
            </el-tab-pane>
            <!---------- end: tab-pane: high-offer ---------->
          </el-tabs>
        </div>
        <!---------- end: right-box ---------->
      </div>
      <template #footer v-if="fromProfile == true">
        <el-button @click="showTransferDialog(itemDetails)" class="btn-transfer"
          ><IconifyIconOnline
            style="margin-right: 3px"
            icon="mingcute:transfer-fill"
          />Transfer</el-button
        >
      </template>
    </el-dialog>
    <TransferDialog ref="transferDialogEl" />
  </div>
</template>

<style lang="scss">
.block-col-2 .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
.dialog-details {
  .el-popper.is-light {
    background-color: none !important;
  }
}
.select-view-3d {
  position: absolute;
  top: 0;
  left: 5px;
  /* width: 100%; */
  z-index: 1;
  border: 2px solid;
  padding: 2px 5px;
  &.el-select-dropdown {
    background-color: #0000008f;
    border: none;
    color: rgba(255, 255, 255, 0.856);

    .el-select-dropdown__item {
      position: relative;
      height: 25px;

      & span {
        position: absolute;
        top: -5px;
      }
    }

    .el-select-dropdown__item,
    .el-select-dropdown__item.selected {
      color: #ffffff94;
      font-weight: unset;
    }

    .el-select-dropdown__item.selected {
      color: #ffff;
    }

    .el-select-dropdown__item.hover {
      background-color: unset;
    }
    .el-select-dropdown__item:hover {
      background-color: #000000c1;
    }
    .el-select-dropdown__item.is-disabled:hover {
      background-color: unset !important;
    }
  }
  .el-popper__arrow::before {
    border-bottom-color: #0000008f;
    border-right-color: #0000008f;
    background: #0000008f !important;
    border-color: #0000008f !important;
  }
}
.custom-dropdown {
  .el-dropdown-menu {
    background-color: #00000082;
    overflow: hidden;
  }
  .el-dropdown-menu__item {
    color: #ffff;
    // &.active {
    //   color: #00d4ff;
    // }
  }
  .el-dropdown-menu__item:not(.is-disabled):focus {
    background-color: rgb(46 91 141 / 45%);
    color: #ffff;
  }
  // .el-dropdown-menu__item:focus {
  //   color: #00d4ff !important;
  // }
  .dropdown-content {
    &.active {
      color: #00d4ff !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.dialog-details {
  :deep(.el-dialog.dialog-type2) {
    max-width: 705px;
    width: 100%;
  }
  :deep(.el-dialog__body) {
    padding-top: 10px;
    color: #fff;
    border-top: 1px solid #2c356d;
  }
  :deep(.el-dialog__header) {
    padding: 15px;
  }
  :deep(.el-dialog.dialog-type2 .el-dialog__title) {
    font-size: 22px;
    color: rgb(255 255 255 / 90%);
  }
  :deep(.el-dialog__headerbtn) {
    background: #1c2762;
    border-radius: 5px;
    width: 30px;
    height: 30px;
    top: 11px;
    right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s;
    &:hover {
      background: #263378;
    }
  }
  :deep(.el-dialog__headerbtn .el-dialog__close) {
    color: #ffffff8f;
    font-size: 22px;
    // &:hover {
    //   color: #fff;
    // }
  }
  :deep(.el-dialog__footer) {
    border-top: 1px solid #2c356d;
    display: flex;
    justify-content: center;
    padding: 12px;
  }
  .btn-transfer {
    background: transparent;
    color: #00d4ff;
    border: 1px solid #00d4ff;
    border-radius: 10px;
    &:hover {
      background-color: #00d4ff;
      color: #fff;
      transition: all 0.25s;
    }
  }
  .el-input {
    --el-input-placeholder-color: #6a6c6e;
  }
  :deep(.dialog-type2.versiontransfer) {
    max-width: 320px;
    width: 85%;
    .input-position {
      margin-top: 15px;
    }
  }
  :deep(.el-input__wrapper) {
    height: 40px;
    background-color: rgba(0, 0, 0, 0.2);
    box-shadow: unset;
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    // border-radius: 10px;
  }
  :deep(.el-input__inner) {
    color: #fff;
  }
  :deep(.el-input-number .el-input__inner) {
    text-align: left;
  }
  :deep(.el-input-number) {
    width: 100%;
  }
  :deep(.el-input-number.is-controls-right .el-input-number__decrease) {
    border-left: unset;
    background: #1c2762;
    color: #9ba0ba;
    &:hover {
      background: #263378;
      color: #1264f2;
      transition: all 0.25s;
    }
  }
  :deep(.el-input-number.is-controls-right .el-input-number__increase) {
    border-left: unset;
    background: #1c2762;
    color: #9ba0ba;
    border-bottom: 1px solid #0c1337;
    &:hover {
      background: #263378;
      color: #1264f2;
      transition: all 0.25s;
    }
  }
  :deep(.el-form-item) {
    margin-bottom: 10px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  :deep(.el-input__wrapper.is-focus) {
    box-shadow: #1264f2 0px 0px 1px 1px inset;
  }
  :deep(.el-input-group__append) {
    box-shadow: unset;
    background-color: #0c1337;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
  }
  .btn-versiontransfer {
    height: 40px;
    background-color: rgb(12 19 55);
    border: none;
    display: flex;
    align-items: center;
    border-top-left-radius: unset;
    border-bottom-left-radius: unset;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    // border-radius: 10px;
    &:hover {
      color: #1264f2;
      transition: all 0.25s;
    }
  }
  .btn-transfer-versiontransfer {
    margin-top: 20px;
    background-color: #1264f2;
    color: #fff;
    border: none;
    border-radius: 10px;
    &:hover {
      transition: all 0.25s;
      background-color: rgb(80, 138, 238);
    }
  }
}
//
.nft-details-container {
  display: flex;
  flex-wrap: wrap;
  .left-box {
    width: 240px;
    margin: 0 auto;
    .card-panel {
      width: 100%;
    }
  }
  .right-box {
    width: 60%;
    display: inline-block;
    padding-left: 13px;
    margin: 0 auto;
    .el-tabs {
      :deep(.el-tabs__item) {
        font-size: clamp(16px, 4vw, 20px);
        color: #fff;
        border-left: 0;
        &:hover {
          color: rgb(157, 157, 157);
        }
      }
      :deep(.el-tabs__nav-scroll) {
        background-color: #273376;
        border-radius: 12px;
        display: flex;
        justify-content: center;
      }
      :deep(.el-tabs__item.is-active) {
        color: #45bbff;
      }
      :deep(.el-tabs__item.is-top.is-active::before) {
        content: "";
        position: absolute;
        border: 8px solid transparent;
        border-top: 0;
        border-bottom-color: #0f1845;
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
      }
      :deep(.el-tabs--border-card) {
        border: 0;
        background: rgba(60, 76, 118, 1);
      }
      :deep(.el-tabs--border-card > .el-tabs__header) {
        background-color: rgba(32, 36, 64, 1);
        border: none;
      }
      :deep(.el-tabs--card > .el-tabs__header) {
        border: none;
      }
      :deep(.el-tabs--card .el-tabs__header .el-tabs__nav) {
        border: none;
      }
      :deep(.el-tabs__header .el-tabs__item.is-active) {
        border: none;
      }
      :deep(.el-tabs--card > .el-tabs__header .el-tabs__item) {
        border-left: 0px;
        font-size: 20px;
      }
      :deep(.el-tabs__nav.is-top) {
        border: none !important;
      }
      :deep(.el-tabs__header.is-top) {
        border-bottom: none !important;
      }
      :deep(.el-tabs.is-active) {
        content: " ";
        background: #fff;
        width: 50px;
        height: 50px;
        position: relative;
        margin-top: 50px;
        margin-left: 10px;
        transform: rotate(45deg);
      }
      :deep(.el-tabs__nav-prev) {
        display: none;
      }
      :deep(.el-tabs__nav-next) {
        display: none;
      }
    }
    .linkTo {
      color: #00f5d4;
      &:hover {
        color: #8cfff0;
      }
    }
  }
  .rarity-box {
    height: 600px;
    margin: 0 auto;
    color: #fff;
    overflow-y: auto;
    .rarity-mc {
      padding: 5px 10px;
    }
    .padding4 {
      border-radius: 4px;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
    }
    .rarity-total {
      text-align: center;
      background: #be185d;
      font-weight: 500;
      font-size: 16px;
      padding: 5px;
      border-radius: 6px;
      -webkit-border-radius: 6px;
      -moz-border-radius: 6px;
    }
    .rarity-total2 {
      padding: 5px;
      color: #10b981;
      background: #fff;
      font-size: 18px;
      font-weight: 800;
      margin: 5px 0;
    }
    .rarity-total3 {
      padding: 4px 5px;
    }
    .rarity-total4 {
      padding: 3px;
      font-size: 15px;
      font-weight: 500;
      color: #db2777;
      span {
        float: right;
        color: #10b981;
        font-size: 16px;
      }
    }
    .rarity-total5 {
      background: #3a65af;
      line-height: 20px;
      padding: 3px 5px;
      span {
        float: right;
        background: #234693;
        font-size: 14px;
        color: #9ca3af;
        padding: 0 5px;
        border-radius: 2px;
        -webkit-border-radius: 2px;
        -moz-border-radius: 2px;
      }
    }
  }
}

.panel-group {
  height: 100%;
  .card-panel {
    height: 100%;
    font-size: 12px;
    box-shadow: 3px 3px 30px rgb(0 0 0 / 20%);
    border-radius: 6px;
    background: #131c4c;
    // position: relative;
    .card-panel-icon-wrapper {
      width: 100%;
      height: 240px;
      position: relative;
      text-align: center;
      background: linear-gradient(to top, #11183c, #273999, #11183c);
      display: flex;
      align-items: center;
      justify-content: center;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      overflow: hidden;
      // z-index: 1;
      &:before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: url("/@/assets/x-pat.png");
        background-size: cover;
        opacity: 0.1;
      }
      // border-radius: 4px;
      .card-panel-icon {
        // height: 210px;
        width: 100%;
        height: 100%;
        image-rendering: pixelated;
        // z-index: 1;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        position: relative;
        transition: all 0.8s ease-out;
        opacity: 0;
      }
      .el-dropdown {
        position: absolute;
        top: -4px;
        left: -5px;
        padding: 2px 5px;
        z-index: 1;
      }
      .iframe3D {
        width: 100%;
        height: 100%;
        border: none;
        position: absolute;
        top: 0;
        transition: opacity 0.8s ease-out;
        opacity: 0;
      }
      .box-options {
        background-color: rgb(24 30 61 / 54%);
        border-radius: 5px;
        transition: all 0.5s;
        color: rgba(255, 255, 255, 0.7);
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        &:hover {
          background-color: rgb(35, 40, 68);
        }
        .box-options-select {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 4px 10px;

          .select-about {
            display: flex;
            align-items: center;
            padding-right: 5px;
            .select-image {
              width: 20px;
              height: 20px;
            }
            .select-label {
              user-select: none;
            }
            .select-number {
              color: var(--el-text-color-secondary);
              width: 50px;
              text-align: end;
            }
          }
          .icon-down {
            transition: all 0.25s;
            &.open {
              transform: rotate(-180deg);
              transition: all 0.25s;
            }
          }
        }
      }
      .img-show {
        opacity: 1;
        pointer-events: all;
      }
      .img-hide {
        opacity: 0;
        pointer-events: none;
      }
    }
    :deep(.el-select .el-input__wrapper) {
      background: rgba(0, 0, 0, 0.35);
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 0;
      border-top-right-radius: 0;
      border-top-left-radius: 5px;
      height: 25px;
    }
    :deep(.el-input__wrapper) {
      box-shadow: unset;
    }
    :deep(.el-select .el-input.is-focus .el-input__wrapper) {
      box-shadow: 1px 1px 5px 0px #384482 !important;
      // border: 1px solid #384482;
    }
    :deep(.el-select .el-input__wrapper.is-focus) {
      box-shadow: 1px 1px 5px 0px #384482 !important;
      // border: 1px solid #384482;
    }

    .card-panel-description {
      font-weight: bold;
      // border-bottom: 1px solid #525c9a;
      // box-shadow: 4px 4px 15px rgb(0 0 0 / 25%);
      // margin: 15px 5px 5px 5px;
      .item-card-details {
        font-weight: bold;
        padding: 10px;
      }
      .card-panel-text {
        // line-height: 18px;
        // color: #fff;
        // font-size: 18px;
        // margin-bottom: 12px;
        // h2 {
        //   display: inline;
        // }
        color: #fff;
        font-size: 16px;
        margin-bottom: 5px;
        width: 140px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .card-panel-type {
        float: right;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
      }
      .card-panel-acces {
        margin: 4px 4px 0 0;
        padding: 0.4em 0.6em;
        background-color: #c8c6e0;
        color: #606266;
        word-wrap: break-word;
        white-space: nowrap;
        display: inline-block;
        border-radius: 0.5rem;
        -webkit-border-radius: 0.5rem;
        -moz-border-radius: 0.5rem;
      }
      .price-text {
        color: #cccccc;
        position: absolute;
        right: 10px;
      }
      // .tokenId-line {
      //   font-size: 14px;
      //   color: #ebebeb;
      //   width: 90px;
      //   text-overflow: ellipsis;
      //   overflow: hidden;
      //   white-space: nowrap;
      // }
      .tokenId-line {
        font-size: 14px;
        color: #ebebeb;
        width: 90px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .card-panel-price {
        div {
          color: #53a7ff;
          font-weight: 500;
          position: absolute;
          width: 100px;
          right: 30px;
          text-align: right;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          // line-height: 20px;
          // display: flex;
        }
        .vet-icon1 {
          width: 14px;
          height: 14px;
          position: absolute;
          top: 2px;
          right: 12px;
        }
      }
      hr {
        border: none;
        height: 1px;
        background: #2e3670;
      }
      .tagName {
        background-color: #202440;
        border: 1px solid #606bbf;
        border-radius: 16px;
        color: #fff;
      }
      .card-panel-tags {
        border-top: 1px solid #2b3574;
        padding: 10px 5px;
        .tagName {
          background-color: rgb(206 206 206 / 11%);
          border: none;
          border-radius: 16px;
          color: #fffc;
        }
      }
    }
  }
}
.el-icon-share {
  position: absolute;
  top: 14px;
  right: 65px;
  font-size: 25px;
}
.el-icon-refresh {
  position: absolute;
  right: 105px;
  top: 14px;
  font-size: 25px;
}
.introduce {
  color: #00d4ff;
  word-break: break-word;
}
.btn-show {
  color: #fff;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.infomation {
  margin-top: 12px;
  .el-row {
    margin-bottom: 7px;
    word-break: break-word;
    padding: unset;
    flex-wrap: nowrap;
  }
  .el-col-1 {
    color: #fff;
    width: 20px;
  }
  .el-col-8 {
    min-width: 130px;
    width: 100%;
    word-break: break-word;
    padding-right: 0 !important;
    color: #fff;
  }
  .el-col-14 {
    width: 100%;
    padding: unset !important;
    color: #fff;
    display: flex;
    flex-wrap: wrap;
  }
  .text-blue {
    color: #45bbff;
  }
  .more-blue {
    color: #45bbff;
  }
}
.attributes {
  .el-row {
    margin-bottom: 12px;
  }
  .el-col-7 {
    width: 110px !important;
    flex: 0 0 29.1666666667%;
  }
  .text-blue {
    color: #00d4ff;
  }
}

@media screen and (max-width: 660px) {
  .left-box {
    padding-bottom: 20px;
  }
  .right-box {
    justify-content: center;
    padding-left: 0px !important;
    width: 100% !important;
    margin: unset !important;
  }
  .el-tabs {
    :deep(.el-tabs__nav-wrap.is-scrollable) {
      padding: 0px !important;
    }
  }
}

@media screen and (max-width: 360px) {
  .el-tabs {
    :deep(.el-tabs__item.is-top) {
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
  }
}
</style>
