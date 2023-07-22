<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { cloneDeep, fromPairs } from "lodash-unified";
import { useGlobal } from "@pureadmin/utils";
import { useAppStoreHook } from "/@/store/modules/app";
import { useUserStoreHook } from "/@/store/modules/user";
import ERC721 from "/@/contractCall/ERC721";
import ERC721PeripheryV1 from "/@/contractCall/ERC721PeripheryV1";
import ERC1155 from "/@/contractCall/ERC1155";
import { CollectionDetails01, ItemShow01 } from "/@/types/collection";
import { getLocalFile } from "/@/api/app";
import {
  vpunksOgAddr,
  vpunksWeaponsAddr,
  pixelPuffsAddr,
  erc721PeripheryV1
} from "/@/settings";
// Components
import Pagination from "/@/components/Pagination/index.vue";
import DetailsDialog from "/@/components/DetailsDialog/index.vue";
// import SortFill from "/@/components/SortFill/index.vue";
// Assets (test)
import vetIcon from "/@/assets/img/token/vet-logo.png";
import collectionList from "/@/static/collections.json";
// console.log("fromPairs", fromPairs);

//
defineOptions({
  name: "AccountCollected"
});

// Variables ******************************
// General ----------
const debug = ref(false);
const { $connex } = useGlobal<GlobalPropertiesApi>();
const myAddr = computed(() => {
  return useUserStoreHook().dAccount.myAddr;
  // return "0xBBD597C0c37847B75b7D650E715E165874bdCedC"; // ví community team
  // return "0xda035cc0c5a64cdaadc2f921270c14c764448c95"; // test ví có pixel puffs
  // return "0x38D680b1A29A374bB4614D76411eD9e011373388"; // test
});

watch(myAddr, newAddr => {
  // console.log("newAddr", newAddr);
  if (newAddr) {
    getBalanceOf();
  }
});

// handleResize ----------
const maxColWidth = 280; // bao gồm cả ColPadding
const minColWidth = 180; // bao gồm cả ColPadding
const maxSingleWidth = 380; // max width khi một hàng chỉ có 1 item, bao gồm cả ColPadding
const minColPadding = 5;
const maxColPadding = 12;
const colWidth = ref(maxColWidth);
const colPadding = ref(maxColPadding);

//
let timeout01 = null;
const loading = ref(false);

// dialog
const detailsDialogEl = ref(null);

//
let collectionDetails: CollectionDetails01 = {};

// tab-pane: Collected
const pageQuery = ref({
  page: 1,
  limit: 100, // recommended: 100
  pageSizes: [20, 30, 50, 100] // recommended: [100]
});
let itemList: ItemShow01[] = []; // danh sách tất cả items
const itemShowList: ItemShow01[] = ref([]); // danh sách hiển thị trên trang
const totalItems = ref(0);
const collectionCodeName = ref("");

//
const isToggle = ref(false);
interface arryOptions {
  id: number;
  value: string;
  label: string;
  image: string;
  number: number;
}
const optionsCollection: Array<arryOptions> = ref([
  {
    id: 0,
    value: 0,
    label: "VPunks OG",
    image: "/img/collections/symbols/vpunks-og.png",
    number: null
  },
  {
    id: 1,
    value: 1,
    label: "Pixel Puffs",
    image: "/img/collections/symbols/pixel-puffs.png",
    number: null
  },
  {
    id: 2,
    value: 2,
    label: "VP Weapons",
    image: "/img/collections/symbols/vpunks-weapons-100x100.png",
    number: null,
    quantity: null
  },
  {
    id: 3,
    value: 3,
    label: "VEmoji",
    image: "/img/collections/symbols/vemoji-logo-100x100.png",
    number: null,
    quantity: null
  }
]);

// Options Selected
let collSe = ref({
  id: -1,
  value: -1,
  label: "Collections",
  image: "",
  number: -1
});
let optionsSelectedIndex = -1;

// tạm thời
let vemojiItemList: string[] = [];
let weaponsItemList: string[] = [];
interface IErc1155Item {
  id: number;
  quantity: number;
}
interface IErc1155Data {
  codename: string;
  totalQuantity: number;
  items: IErc1155Item[];
}
const erc1155List: IErc1155Data[] = [];
// end: Variables ******************************

// Composition API ******************************
onMounted(() => {
  if (debug.value) console.log("---------- AccountCollected", "onMounted");
  const pass = Date.now() - useAppStoreHook().started;
  if (pass < 1500) {
    loading.value = true;
    timeout01 = setTimeout(getBalanceOf, 1500 - pass);
  } else {
    getBalanceOf();
  }

  //
  window.addEventListener("resize", handleWindowResize);
  handleWindowResize();
});

onBeforeUnmount(() => {
  if (debug.value)
    console.log("---------- AccountCollected", "onBeforeUnmount");
  clearTimeout(timeout01);
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
    if (itemNum === 1 || itemShowList.value.length <= 1) {
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

//
const handleOptions = (id, value) => {
  isToggle.value = false;
  collSe.value = optionsCollection.value[value];
  optionsSelectedIndex = id;
  pageQuery.value.page = 1;
  getBalanceOf();
};

//
function getLocalJsonFile(itemIds: string[], erc1155Data: IErc1155Data) {
  const collectionCodeName = collectionList[collSe.value.id].codename;
  getLocalFile(`metadata/collections/${collectionCodeName}.json`)
    .then(result => {
      if (debug.value) console.log("getLocalJsonFile - result", result);
      if (typeof result !== "object" || !result.length) return;
      itemList = [];
      for (let i = 0; i < result.length; i++) {
        const index = erc1155Data.items.findIndex(
          obj => obj.id === result[i].id.toString()
        );
        if (index < 0) continue;
        // if (!itemIds.includes(String(result[i].id))) continue;
        const name = result[i].name || collectionDetails.item_name;
        const img = result[i].img;
        const emoji = result[i].emoji;
        const attributes = result[i].attributes;
        const quantity = erc1155Data.items[index].quantity;
        itemList.push({
          id: parseInt(result[i].id),
          name,
          standard: collectionDetails.standard,
          quantity,
          img,
          emoji,
          attributes
        });
      }
      totalItems.value = itemList.length;
      /*
      if (
        typeof itemList[0].rank !== "undefined" &&
        typeof itemList[0].rank !== "number"
      ) {
        for (let i = 0; i < itemList.length; i++)
          itemList[i].rank = parseInt(itemList[i].rank);
      }
      if (
        typeof itemList[0].rarity_score !== "undefined" &&
        typeof itemList[0].rarity_score !== "number"
      ) {
        for (let i = 0; i < itemList.length; i++)
          itemList[i].rarity_score = parseFloat(itemList[i].rarity_score);
      }*/
      getItemListShow();
      loading.value = false;
    })
    .catch(error => {
      console.error(error);
      loading.value = false;
    });
}

function getLocalCsvFile(itemIds: string[]) {
  const collectionCodeName = collectionList[collSe.value.id].codename;
  getLocalFile(`metadata/collections/${collectionCodeName}.csv`)
    .then(result => {
      // console.log("result", result);
      const lines = result.split("\r\n");
      const header = lines[0].split(",");
      const output = lines.slice(1).map(line => {
        const fields = line.split(",");
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
      // i < output.length - 1 vì output có thêm header
      for (let i = 0; i < output.length - 1; i++) {
        if (output[i]["Id"]) {
          if (!itemIds.includes(output[i]["Id"])) continue;
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
      loading.value = false;
    })
    .catch(error => {
      console.error(error);
      loading.value = false;
    });
}

//
function getTokenOfOwnerByIndexs() {
  loading.value = true;
  // console.log("collectionDetails", collectionDetails);
  if (collectionDetails.standard === "VIP-210") {
    const erc1155Data = erc1155List.find(
      obj => obj.codename === collectionDetails.codename
    );
    // console.log("erc1155Data44444444444", erc1155Data);
    // console.log("weaponsItemList55555555555555", weaponsItemList);
    getLocalJsonFile(weaponsItemList, erc1155Data);
    return;
  }
  // console.log("collectionDetails2", collectionDetails);
  const indexs = [];
  for (let i = 0; i < totalItems.value; i++) {
    indexs.push(i);
  }
  new ERC721PeripheryV1(erc721PeripheryV1, $connex)
    .tokenOfOwnerByIndexs(
      optionsSelectedIndex === 0 ? vpunksOgAddr : pixelPuffsAddr,
      myAddr.value,
      indexs
    )
    .then(results => {
      if (debug.value) console.log(`Load tokenIds----------------`, results);
      const itemIds = [];
      for (let i = 0; i < results.length; i++) {
        if (results[i] === "1000000000") continue;
        itemIds.push(results[i]);
      }
      if (itemIds.length <= 0) {
        loading.value = false;
        itemShowList.value = [];
        return;
      }
      if (
        !collectionDetails.meta_data.type ||
        collectionDetails.meta_data.type === "csv"
      ) {
        getLocalCsvFile(itemIds);
      } else {
        getLocalJsonFile(itemIds);
      }
    })
    .catch(e => {
      console.error(`Load tokenIds----------------- error`, e);
      loading.value = false;
    });
}

//
async function getBalanceOf() {
  loading.value = myAddr.value ? true : false;
  if (!myAddr.value) return;
  // collectionDetails = {};

  const vemojiAddr = "0x3aDc46f41467d436614B173A076791dEAdDBD67f";
  const accounts = [];
  const ids = [];
  for (let i = 1; i <= 500; i++) {
    ids.push(i);
    accounts.push(myAddr.value);
  }
  await new ERC1155(vemojiAddr, $connex)
    .balanceOfBatch(accounts, ids)
    .then(results => {
      // console.log(`vemoji:balanceOf----------------`, results);
      const codename = "vemoji";
      let total_items = 0;
      const erc1155Data: IErc1155Data = {
        codename,
        totalQuantity: 0,
        items: []
      };
      vemojiItemList = [];
      for (let i = 0; i < results.length; i++) {
        const quantity = parseInt(results[i]);
        if (quantity > 0) {
          total_items++;
          erc1155Data.totalQuantity += quantity;
          erc1155Data.items.push({
            id: `${i + 1}`,
            quantity
          });
          vemojiItemList.push(`${i + 1}`);
        }
      }
      optionsCollection.value[2].number = total_items;
      const index = erc1155List.findIndex(obj => obj.codename === codename);
      if (index < 0) {
        erc1155List.push(erc1155Data);
      } else {
        erc1155List[index] = erc1155Data;
      }
      optionsCollection.value[3].number = total_items;
      optionsCollection.value[3].quantity = erc1155Data.totalQuantity;
      // console.log(`vemoji:total----------------`, total);
    })
    .catch(e => {
      console.error("vemoji:balanceOf error-----------------", e);
    });

  //
  const accounts2 = [];
  const ids2 = [];
  for (let i = 1; i <= 15; i++) {
    ids2.push(i);
    accounts2.push(myAddr.value);
  }
  await new ERC1155(vpunksWeaponsAddr, $connex)
    .balanceOfBatch(accounts2, ids2)
    .then(results => {
      // console.log(`vpunksWeapons:balanceOf----------------`, results);
      const codename = "vpunks-weapons";
      let total_items = 0;
      const erc1155Data: IErc1155Data = {
        codename,
        totalQuantity: 0,
        items: []
      };
      weaponsItemList = [];
      for (let i = 0; i < results.length; i++) {
        const quantity = parseInt(results[i]);
        if (quantity > 0) {
          total_items++;
          erc1155Data.totalQuantity += quantity;
          erc1155Data.items.push({
            id: `${i + 1}`,
            quantity
          });
          weaponsItemList.push(`${i + 1}`);
        }
      }
      const index = erc1155List.findIndex(obj => obj.codename === codename);
      if (index < 0) {
        erc1155List.push(erc1155Data);
      } else {
        erc1155List[index] = erc1155Data;
      }
      // console.log("vpunksWeapons:erc1155Data----------------", erc1155Data);
      // console.log("vpunksWeapons:erc1155List----------------", erc1155List);
      optionsCollection.value[2].number = total_items;
      optionsCollection.value[2].quantity = erc1155Data.totalQuantity;
    })
    .catch(e => {
      console.error("vpunksWeapons:balanceOf error-----------------", e);
    });

  await new ERC721(vpunksOgAddr, $connex)
    .balanceOf(myAddr.value)
    .then(results => {
      if (debug.value) console.log(`vpunks:balanceOf----------------`, results);
      const total = parseInt(results);
      totalItems.value = total;
      optionsCollection.value[0].number = total;
      if (debug.value)
        console.log(
          `Load optionsCollection----------------`,
          optionsCollection
        );
    })
    .catch(e => {
      console.error("vpunks:getBalanceOf error -----------------", e);
    });
  //
  await new ERC721(pixelPuffsAddr, $connex)
    .balanceOf(myAddr.value)
    .then(results => {
      if (debug.value)
        console.log(
          `pixelPuffs:balanceOf----------------`,
          results,
          collSe.value.value
        );
      optionsCollection.value[1].number = parseInt(results);
      if (debug.value)
        console.log(
          `Load optionsCollection----------------`,
          optionsCollection
        );
      if (optionsSelectedIndex < 0) {
        for (let i = 0; i < optionsCollection.value.length; i++) {
          if (optionsCollection.value[i].number > 0) {
            optionsSelectedIndex = i;
            collSe.value = optionsCollection.value[i];
            break;
          }
        }
      }
      if (optionsSelectedIndex >= 0) {
        collectionDetails = collectionList[optionsSelectedIndex];
        totalItems.value = optionsCollection.value[collSe.value.value].number;
        getTokenOfOwnerByIndexs();
      } else {
        loading.value = false;
      }
    })
    .catch(e => {
      console.error("pixelPuffs:BalanceOf error -----------------", e);
      loading.value = false;
    });
  //
  collSe.value = optionsCollection.value[optionsSelectedIndex];
  collectionCodeName.value = collectionDetails.codename;
  // console.log("collSe.value", collSe.value);
  // console.log("collectionDetails3", collectionDetails);
}

// sự kiện trả về từ pagination
function getItemListPage(data: { page: number; limit: number }) {
  // hiện tại pagination chưa sync được pageQuery[page, limit] nên update thủ công
  pageQuery.value.page = data.page;
  pageQuery.value.limit = data.limit;
  if (debug.value) console.log("getItemListPage:", data);
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
  handleWindowResize();
  if (debug.value) console.log("---------- itemShowList", itemShowList);
}

//
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

function getStandard() {
  return collectionList[optionsSelectedIndex].standard;
}

// dialog
function showDetailsDialog(item: ItemShow01) {
  if (debug.value) console.log("showDetailsDialog, item", item);
  detailsDialogEl.value.open(item, collectionDetails);
}
// end: Methods ******************************
</script>

<template>
  <!-- Your NFTs -->
  <div class="account-nfts-container" v-loading.fullscreen.lock="loading">
    <div class="btn-gr-header">
      <el-dropdown trigger="click" popper-class="my-account-dropdow-arrow">
        <div class="box-options">
          <div class="box-options-select">
            <div class="select-about">
              <div v-if="collSe.image">
                <el-image class="select-image" :src="collSe.image" />
              </div>
              <span class="select-label">{{ collSe.label }}</span>
            </div>
            <span class="select-number">{{
              collSe.quantity ? collSe.quantity : collSe.number
            }}</span>
            <span class="icon-down" :class="{ open: isToggle }">
              <IconifyIconOnline icon="akar-icons:chevron-down" />
            </span>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              class="dropdown-content"
              v-for="item in optionsCollection"
              :class="collSe.label == item.label ? 'active' : ''"
              :key="item.id"
              :label="item.label"
              :value="item.value"
              @click="handleOptions(item.id, item.value)"
            >
              <div style="display: flex; align-items: center">
                <el-image
                  class="icon-option"
                  style="width: 20px; height: 20px"
                  :src="item.image"
                />
                <span style="font-weight: 600; padding: 0px 5px">{{
                  item.label
                }}</span>
                <div class="number-position-dropdown">
                  <span
                    style="
                      font-size: 13px;
                      background-color: #1f264cb0;
                      text-align: end;
                    "
                  >
                    {{ item.quantity ? item.quantity : item.number }}
                  </span>
                </div>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- <SortFill /> -->
    </div>
    <!-- v-bind data -->
    <div class="list-collected">
      <div class="bg-item">
        <div class="box-item" v-for="item in collectedJson" :key="item.id">
          <div class="item">
            <el-link href="#">
              <div class="thumbnail">
                <el-image :src="item.image" />
              </div>
            </el-link>
            <div class="infor">
              <div class="infor-left">
                <p style="color: #cccccc">{{ item.name }}</p>
                <p style="color: #ebebeb">#{{ item.id }}</p>
              </div>
              <div class="infor-right">
                <p style="color: #cccccc">Price</p>
                <p style="color: #53a7ff">{{ item.price }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
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
                  </div>
                  <div class="item-card-details">
                    <el-row :gutter="24">
                      <el-col :span="18">
                        <div class="item-card-name">
                          {{ item.name }}
                          <span v-if="item.standard == 'VIP-210'"
                            >#{{ item.id }}</span
                          >
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div class="item-card-price-text">Price</div>
                      </el-col>
                    </el-row>
                    <el-row :gutter="24">
                      <el-col :span="18">
                        <div
                          v-if="item.standard == 'VIP-210'"
                          class="item-card-qtity"
                        >
                          Quantity: {{ item.quantity }}
                        </div>
                        <div v-else class="item-card-prod">#{{ item.id }}</div>
                      </el-col>
                      <el-col :span="6">
                        <div class="item-card-price">-</div>
                        <el-image class="vet-icon" :src="vetIcon" />
                      </el-col>
                    </el-row>
                    <el-row>
                      <div class="card-panel-tags">
                        <el-tag effect="plain" class="tagName">
                          {{ getStandard() }}
                        </el-tag>
                        <el-tag
                          effect="plain"
                          class="tagName"
                          style="position: relative; left: 5px"
                        >
                          <template
                            v-if="collectionCodeName == 'vpunks-weapons'"
                          >
                            Level: {{ item.attributes.Level }}
                          </template>
                          <template v-else> Rank: {{ item.rank }} </template>
                        </el-tag>
                      </div>
                    </el-row>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-row>
      </div>
    </div>
  </div>
  <pagination
    v-show="itemShowList.length > 0"
    :total="totalItems"
    v-model:page="pageQuery.page"
    v-model:limit="pageQuery.limit"
    :page-sizes="pageQuery.pageSizes"
    @pagination="getItemListPage"
  />
  <DetailsDialog ref="detailsDialogEl" />
</template>

<style lang="scss">
.my-account-dropdow-arrow {
  .el-popper__arrow::before {
    border-bottom-color: transparent !important;
    border-right-color: transparent !important;
    border-left-color: transparent !important;
    background: #1f264c !important;
    border: 1px solid #1264f2 !important;
    border-top-left-radius: unset;
    // visibility: hidden;
  }
  .el-popper__arrow {
    z-index: 10;
    position: relative;
  }
  .el-dropdown-menu {
    padding: 5px 0 !important;
    background-color: #1f264c;
    border: 1px solid #1264f2;
    border-radius: 10px;
    max-width: 210px;
    min-width: 210px;
  }
  .dropdown-content {
    &.active {
      font-weight: 600;
      color: #1264f2 !important;
    }
    .number-position-dropdown {
      align-items: center;
      justify-content: flex-end;
      display: flex;
      right: 15px;
      position: absolute;
      color: #909399;
    }
  }
}
.el-scrollbar {
  position: relative;
  overflow: unset;
  // &::before {
  //   position: absolute;
  //   content: " ";
  //   left: 50%;
  //   top: -5px;
  //   width: 10px;
  //   height: 10px;
  //   z-index: -1;
  //   /* transform: translateX(-50%); */
  //   transform: rotate(45deg);
  //   background: #293366;
  //   box-sizing: border-box;
  // }
}
</style>

<style lang="scss" scoped>
.account-nfts-container {
  max-width: 1920px;
  margin: 0px auto;
  .btn-gr-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .list-collected {
    .bg-item {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: -20px;
      flex-wrap: wrap;

      .box-item {
        width: calc(15% - 20px);
        max-width: 260px;
        min-width: 200px;
        margin-left: 20px;
        margin-top: 20px;
        background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
        padding: 1px;
        border-radius: 12px;
        .item {
          background: #171b33;
          padding: 10px;
          border-radius: 12px;
          & a {
            position: unset;
          }
          .thumbnail {
            .el-image {
              min-width: 100%;
              max-width: 100%;
              min-height: 100%;
              max-height: 100%;
              border-radius: 10px;
              opacity: 0.9;
              transition: transform 0.5s ease, -webkit-transform 0.5s ease;
              &:hover {
                opacity: 1;
                transition: transform 0.5s ease, -webkit-transform 0.5s ease;
              }
            }
          }
          .infor {
            display: flex;
            justify-content: center;
            align-items: center;

            .infor-left {
              width: 50%;
            }
            .infor-right {
              text-align: end;
              width: 50%;
            }
          }
        }
      }
    }
  }
  .example-showcase .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
  .box-options {
    // background-color: #454e85;
    background-color: #1f264c;
    border: 1px solid #1264f2;
    padding: 1px;
    border-radius: 10px;
    transition: all 0.5s;
    max-width: 184px;
    min-width: 184px;
    color: rgba(255, 255, 255, 0.7);
    // margin-top: 20px;
    &:hover {
      // box-shadow: 0 0 0 1px #3077f2;
      border: 1px solid #4885ee;
    }
    .box-options-select {
      display: flex;
      background: #1f264c;
      position: relative;
      align-items: center;
      padding: 5px 10px;
      height: 32px;
      border-radius: 10px;

      .select-about {
        display: flex;
        align-items: center;
        padding-right: 5px;
        .select-image {
          width: 20px;
          height: 20px;
          background-color: #3792cd;
          border-radius: 50%;
        }
        .select-label {
          font-weight: 600;
          padding: 0px 5px;
          position: relative;
        }
      }
      .select-number {
        color: var(--el-text-color-secondary);
        position: absolute;
        right: 30px;
        background-color: #1f264cb0;
        padding-left: 5px;
      }
      .icon-down {
        transition: all 0.25s;
        position: absolute;
        right: 5px;

        &.open {
          transform: rotate(-180deg);
          transition: all 0.25s;
        }
      }
    }
  }
  .dropdownMenu {
    border: 1px solid #1264f2;
  }
  // css card
  .items-collections-list {
    padding-top: 20px;
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
          opacity: 0.1;
        }
      }
      .card-panel-icon-wrapper {
        width: 100%;
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
        height: 100%;
        width: 100%;
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
            text-align: right;
            margin-left: -6px;
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

:deep(.el-select-dropdown__item) {
  display: flex;
  align-items: center;
}
:deep(.el-select__popper.el-popper[data-popper-placement^="bottom"]
    .el-popper__arrow::before) {
  visibility: hidden;
  pointer-events: none;
}
:deep(.el-input__wrapper) {
  background: rgb(24, 30, 61);
  box-shadow: 0 0 0 1px #dcdfe633 inset;
}
:deep(.el-dropdown-menu__item) {
  color: #fff;
}
:deep(.el-dropdown-menu__item:hover) {
  background-color: #1264f21a;
  color: #fff;
}
@media screen and (max-width: 350px) {
  .btn-gr-header {
    padding-left: 5px !important;
    padding-right: 5px !important;
  }
}
</style>
