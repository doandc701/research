<script setup lang="ts">
import { ref, watch, computed, onUnmounted, onMounted } from "vue";
import { cloneDeep } from "lodash-unified";
import Weapon from "/@/static/minting.json";
import { useRoute } from "vue-router";
import { CollectionDetails01, ItemShow01 } from "/@/types/collection";
import collectionList from "/@/static/collections.json";
import Aura from "/@/assets/aura.png";
import BoxMystery from "/@/assets/box-mystery.png";
import Amount from "/@/components/Amount/index.vue";
import { BigNumber } from "bignumber.js";
import { weaponsMinterAddr, vpuTokenAddr } from "/@/settings";
import Minter from "/@/contractCall/Minter";
import ERC20 from "/@/contractCall/ERC20";
import { useGlobal } from "@pureadmin/utils";
import { useAppStoreHook } from "/@/store/modules/app";
const { $connex, $dAccount } = useGlobal<GlobalPropertiesApi>();
import TxInfoDialog from "/@/components/TxInfoDialog/index.vue";
import { useUserStoreHook } from "/@/store/modules/user";
import { ElMessage } from "element-plus";
import { emitter } from "/@/utils/mitt";
import { fromWeiFormat } from "/@/utils/connex";
const txInfoDialogRef = ref(null);

const debug = ref(false);
const route = useRoute();
const weaponCodeName = route.params.codename;
const myAddr = computed(() => {
  return useUserStoreHook().dAccount.myAddr;
  // return "0xda035cc0c5a64cdaadc2f921270c14c764448c95"; // test ví có pixel puffs
  // return "0x38D680b1A29A374bB4614D76411eD9e011373388"; // test
});

// const BgCard = `/app-dev/src/assets/mintCardBg/${weaponCodeName}.jpg`;
const BgCard = `img/minting/mintCardBg/${weaponCodeName}.jpg`;

// console.log("Weapon", Weapon);

const pageQuery = {
  page: 1,
  limit: 15, // recommended: 100
  pageSizes: [20, 30, 50, 100] // recommended: [100]
};
let itemShowList: ItemShow01[] = ref([]); // danh sách hiển thị trên trang
const collectionDetails: CollectionDetails01 = collectionList.find(obj => {
  return obj.codename === "vpunks-weapons";
});
const itemList = Weapon.items; // danh sách tất cả items
const totalItems = ref(itemList.length);

const itemDetails = itemList.find(obj => {
  return obj.codename === weaponCodeName;
});
// console.log("itemList", itemList);
// console.log("itemDetails", itemDetails);

getItemListShow(itemList);

if (debug.value) console.log("collectionDetails", collectionDetails);
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
    if (itemList[i].codename !== weaponCodeName) continue;
    itemShowList.value.push(getItemDetails(i));
  }
  if (debug.value) console.log("---------- itemShowList", itemShowList);
}

function getItemDetails(index) {
  if (debug.value)
    console.log("getItemDetails, index:", index, itemList[index]);
  const item = cloneDeep(itemList[index]);
  let img = "";
  let imgnonebg = "";
  const item_image = collectionDetails.item_image;
  if (itemList[index].img) {
    img = `${item_image.base_url}${itemList[index].img}`;
    imgnonebg = `${item_image.base_url}${itemList[index].imgnonebg}`;
  } else {
    let imgId = item.id;
    if (item_image.min_length && item_image.min_length > 1) {
      imgId = `00000000000000000000${item.id}`;
      imgId = imgId.slice(imgId.length - item_image.min_length);
    }
    img = `${item_image.base_url}${imgId}.${item_image.file_extension}`;
  }
  item.img = img;
  item.imgnonebg = imgnonebg;
  return item;
}

const numberOfNfts = ref(null);
const mintButtonText = "Mint " + itemDetails.name;
const costToMint1 = [
  { order: "1 to 1000", cost: "25%" }, // No Data yet
  { order: "1001 to 2000", cost: "23%" },
  { order: "2001 to 3000", cost: "21%" },
  { order: "3001 to 4000", cost: "20%" },
  { order: "4001 to 5000", cost: "18%" }
];
const costToMint2 = [
  { order: "5001 to 6000", cost: "16%" },
  { order: "6001 to 7000", cost: "15%" },
  { order: "7001 to 8000", cost: "13%" },
  { order: "8001 to 9000", cost: "11%" },
  { order: "9001 to 10000", cost: "10%" }
];
let splitColClass = "split-col50";
// const recentlyMinted = [];

// new
const mintButtonLoading = ref(false);
let mintConnectWallet = ref(false);
const vetPrice = ref("200e+18");
const vpuPrice = ref(null);
const mintingPrice = ref("200e+18");
const totalCost = ref("");
const totalDiscount = ref("");
let totalDiscount2 = "";
const totalPayble = ref("");
const itemLeft = ref("--");
const paybleSymbol = ref("VET");
let ids = [];

function getMintingInfos() {
  handleNumOfNfts(true);
  new Minter(weaponsMinterAddr, $connex)
    .totalMintCount()
    .then(results => {
      // console.log(`vpunksWeapons:totalMintCount----------------`, results);
      itemLeft.value = new BigNumber(10000).minus(results);
      mintButtonLoading.value = false;
    })
    .catch(e => {
      console.error("vpunksWeapons:totalMintCount error-----------------", e);
      mintButtonLoading.value = false;
    });
}
//

let timeout01 = null;
let timeout02 = null;
onMounted(() => {
  // debug && console.log("---------- Home", "mounted");
  const pass = Date.now() - useAppStoreHook().started;
  if (pass < 1500) {
    mintButtonLoading.value = true;
    timeout01 = setTimeout(getMintingInfos, 1500 - pass);
  } else {
    getMintingInfos();
  }
  //
  window.addEventListener("resize", handleWindowResize);
  handleWindowResize();
});

onUnmounted(() => {
  // debug && console.log("---------- Home", "beforeUnmount");
  window.removeEventListener("resize", handleWindowResize);
  clearTimeout(timeout01);
  clearTimeout(timeout02);
});
let gutter = 40;
let elColXS = 12;
function handleWindowResize() {
  // debug && console.log("---------- innerWidth:", window.innerWidth);
  const cpf = document.getElementById("mint-card-row") as HTMLElement;

  if (window.innerWidth > 420) {
    elColXS = 12;
  } else {
    elColXS = 24;
  }

  if (cpf && cpf.clientWidth > 0) {
    gutter = (cpf.clientWidth / 150) * 15 - 5;
  } else {
    gutter = (window.innerWidth / 320) * 10;
  }
  if (gutter > 35) gutter = 35;
  else if (gutter < 10) gutter = 10;
  if (ref.clientWidth >= 900) {
    splitColClass = "split-col50";
  } else {
    splitColClass = "split-col100";
  }
}

// [select-options] VET/VTHO
const isRotate = ref(false);
interface arryOptions {
  id: number;
  value: string;
  label: string;
}
const optionsCollection: Array<arryOptions> = ref([
  {
    id: 0,
    value: 0,
    label: "Using VET"
  },
  {
    id: 1,
    value: 1,
    label: "Using VPU"
  }
]);
// Options Selected
let collSe = ref({
  id: 0,
  value: 0,
  label: "Using VET"
});
//
const handleOptions = (id, value) => {
  // console.log("vipId !", useUserStoreHook().dAccount.vipId);
  isRotate.value = false;
  collSe.value = optionsCollection.value[value];
  paybleSymbol.value = id === 0 ? "VET" : "VPU";
  handleNumOfNfts(true);
  if (paybleSymbol.value === "VPU") {
    mintingPrice.value = vpuPrice.value;
    if (vpuPrice.value) return;
    new Minter(weaponsMinterAddr, $connex)
      .vetxvpu()
      .then(results => {
        // console.log(`vpunksWeapons:vetxvpu----------------`, results);
        vpuPrice.value = new BigNumber(vetPrice.value)
          .multipliedBy(results)
          .dividedBy(10);
        mintingPrice.value = vpuPrice.value;
      })
      .catch(e => {
        console.error("vpunksWeapons:vetxvpu error-----------------", e);
      });
  } else {
    mintingPrice.value = vetPrice.value;
  }
};

// dropdown: Open & Close
function handleVisibleChange(visible: boolean) {
  isRotate.value = visible;
}

watch(myAddr, newMyAddr => {
  // console.log("watch-newMyAddr", typeof newMyAddr);
  if (newMyAddr) {
    handleNumOfNfts(true);
  } else {
    vipId = null;
  }
});

async function checkVip() {
  if (vipId === null && !vipChecking && myAddr.value) {
    vipChecking = true;
    mintButtonLoading.value = true;
    vipId = await $dAccount.getVipIDxAddr(myAddr.value);
    vipChecking = false;
    mintButtonLoading.value = false;
    // console.log("vipId1--", vipId);
  }
}

//
let vipId = null;
let vipChecking = false;
async function handleNumOfNfts(notCheckZero?: boolean) {
  numberOfNfts.value = parseInt(numberOfNfts.value);
  // console.log("handleNumOfNfts", numberOfNfts.value, typeof numberOfNfts.value);
  numNftError.value = null;
  if (isNaN(numberOfNfts.value)) {
    numberOfNfts.value = null;
    if (!notCheckZero) numNftError.value = "Please enter a valid number";
  } else if (!notCheckZero && numberOfNfts.value <= 0) {
    numNftError.value = "Number must be greater than 0";
  } else if (numberOfNfts.value > itemLeft.value) {
    numNftError.value = "Exceeded the number of remaining items";
  } else if (numberOfNfts.value > 20) {
    numberOfNfts.value = 20;
  }
  const num = numberOfNfts.value !== null ? numberOfNfts.value : 0;
  //
  // const aBn = new BigNumber(num);
  // const mintingPrice = ref("1");
  // totalCost.value = aBn.multipliedBy(mintingPrice.value);
  totalCost.value = "";
  totalDiscount.value = "";
  totalDiscount2 = "";
  totalPayble.value = "";
  // totalPayble.value = totalCost.value.minus(totalDiscount.value);
  // const totalDiscount = ref("1");
  // const totalPayble = ref("1");
  // if (vipId === null && !vipChecking && myAddr.value) {
  //   vipChecking = true;
  //   mintButtonLoading.value = true;
  //   vipId = await $dAccount.getVipIDxAddr(myAddr.value);
  //   vipChecking = false;
  //   mintButtonLoading.value = false;
  //   console.log("vipId1--", vipId);
  // }
  await checkVip();
  // console.log("vipId2--", vipId);
  if (num === 0 || vipChecking) return;
  clearTimeout(timeout02);
  timeout02 = setTimeout(handleNumOfNfts02, 1000);
}

function handleNumOfNfts02() {
  const num = numberOfNfts.value !== null ? numberOfNfts.value : 0;
  if (num === 0) return;
  mintButtonLoading.value = true;
  let idLv1 = 0;
  if (weaponCodeName === "axe") {
    idLv1 = 1;
  } else if (weaponCodeName === "nunchaku") {
    idLv1 = 4;
  } else if (weaponCodeName === "spear") {
    idLv1 = 7;
  } else if (weaponCodeName === "sword") {
    idLv1 = 10;
  } else if (weaponCodeName === "cub") {
    idLv1 = 13;
  }
  if (idLv1 === 0) return;
  const idsTemp = [];
  for (let i = 0; i < num * 9; i++) {
    idsTemp.push(idLv1);
  }
  for (let i = 0; i < num * 6; i++) {
    idsTemp.push(idLv1 + 1);
  }
  for (let i = 0; i < num * 5; i++) {
    idsTemp.push(idLv1 + 2);
  }
  ids = [];
  while (ids.length < num) {
    const index = Math.floor(Math.random() * idsTemp.length);
    const id = idsTemp.splice(index, 1);
    ids.push(id);
  }

  // console.log("idsTemp", idsTemp);
  // console.log("ids", ids);
  //
  // await new Minter(weaponsMinterAddr, $connex)
  //   .totalSupply("1")
  //   .then(results => {
  //     console.log(`vpunksWeapons:totalSupply----------------`, results);
  //   })
  //   .catch(e => {
  //     console.error("vpunksWeapons:totalSupply error-----------------", e);
  //   });
  //
  new Minter(weaponsMinterAddr, $connex)
    .getMintfee(paybleSymbol.value === "VET" ? "0" : "1", num)
    .then(results => {
      // console.log(`vpunksWeapons:getMintfee----------------`, results);
      mintButtonLoading.value = false;
      totalCost.value = results[0];
      totalDiscount.value = vipId > 0 ? results[1] : "0";
      totalPayble.value = vipId > 0 ? results[2] : results[0];
      totalDiscount2 = results[1];
    })
    .catch(e => {
      console.error("vpunksWeapons:getMintfee error-----------------", e);
      mintButtonLoading.value = false;
    });
}

async function handleMint() {
  // console.log("numNftError.value", numNftError.value);
  if (numberOfNfts.value <= 0) {
    numNftError.value = "Number must be greater than 0";
  }
  if (numNftError.value != null) return;
  if (!myAddr.value) {
    ElMessage("Please connect wallet");
    return;
  }
  if (ids.length <= 0) return;
  mintButtonLoading.value = true;
  txInfoDialogRef.value.txConfirm();
}

async function onConfirm(): Promise<Connex.Vendor.TxResponse | void | unknown> {
  /*
  new Minter(weaponsMinterAddr, $connex)
    .mintNFT(tokenId, numberOfNfts, ids, totalPayble.value)
    .then(results => {
      console.log(`vpunksWeapons:getMintfee----------------`, results);
    })
    .catch(e => {
      console.error("vpunksWeapons:getMintfee error-----------------", e);
      mintButtonLoading.value = false;
    });*/

  const tokenId = paybleSymbol.value === "VET" ? "0" : "1";
  const numberOfNfts = ids.length;
  // const ids = ["2","3"];
  const clauses: Connex.Vendor.TxMessage = [];
  if (paybleSymbol.value === "VET") {
  } else if (paybleSymbol.value === "VPU") {
    // chế độ đúc bằng VPU luôn là VIP nên cần gửi thêm
    let _totalPayble = totalPayble.value;
    // console.log("totalPayble.vipId", vipId);
    if (vipId === null || vipId === "0") {
      const h = fromWeiFormat(totalDiscount2);
      const mss = `Transfer ${h} ${paybleSymbol.value}`;
      // console.log("totalDiscount2", h);
      clauses.push(
        new ERC20(vpuTokenAddr, $connex).transfer(
          weaponsMinterAddr,
          totalDiscount2,
          mss
        )
      );
      _totalPayble = new BigNumber(totalPayble.value)
        .minus(totalDiscount2)
        .toString();
    }
    const k = fromWeiFormat(_totalPayble);
    // console.log("totalPayble.value", k);
    const mss = `Approve for ${k} ${paybleSymbol.value} transfer`;
    clauses.push(
      new ERC20(vpuTokenAddr, $connex).approve(
        weaponsMinterAddr,
        _totalPayble,
        mss
      )
    );
  }
  clauses.push(
    new Minter(weaponsMinterAddr, $connex).mintNFT(
      tokenId,
      numberOfNfts,
      ids,
      paybleSymbol.value === "VET" ? totalPayble.value : 0,
      `Minting ${numberOfNfts} Weapons`
    )
  );
  // console.log("ruleForm-----", ruleForm);
  // console.log("clauses-----", clauses);
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("timeout"));
    }, 50000); // recommend: 50000
  });
  try {
    return Promise.race([
      myPromise,
      $connex.vendor.sign("tx", clauses).signer(myAddr.value).request()
    ]);
  } catch (error) {
    console.error(error);
  } finally {
    // this.resetInput()
  }
}
//
function txDialogFeedback(
  mss = "success" |
    "reverted" |
    "received" |
    "submitted" |
    "confirmed" |
    "rejected"
) {
  // alert("txDialogFeedback: " + mss);
  if (mss === "success") {
    mintButtonLoading.value = false;
    ids = [];
    numberOfNfts.value = null;
    totalCost.value = "";
    totalDiscount.value = "";
    totalPayble.value = "";
    totalDiscount2 = "";
    getMintingInfos();
  } else {
    // Cancel, Error or reverted
    mintButtonLoading.value = false;
  }
}

// for input error
const numNftError = ref(null);

// connectWallet
function connectWallet() {
  mintConnectWallet.value = true;
  emitter.emit("connectWallet");
}
</script>

<template>
  <div>
    <TxInfoDialog
      ref="txInfoDialogRef"
      :on-confirm="onConfirm"
      @feedback="txDialogFeedback"
    />
    <div class="mint-details-container">
      <div class="min-box">
        <div class="min-box-item">
          <!-- card-mint:style="{ backgroundImage: 'url(' + BgCard + ')' }" -->
          <div
            class="card-mint"
            :style="{ backgroundImage: 'url(' + BgCard + ')' }"
          >
            <div style="display: flex; justify-content: center; height: 280px">
              <el-image class="aura-img" :src="Aura">
                <template #placeholder />
              </el-image>
              <el-image class="aura-img2" :src="Aura">
                <template #placeholder />
              </el-image>
              <el-image
                style="position: absolute; width: 190px; top: 65px"
                :src="BoxMystery"
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
            <div class="position-text">
              <p class="random-text">Random Level</p>
              <IconifyIconOnline
                class="arrow-down"
                icon="dashicons:arrow-down-alt"
              />
            </div>
            <div
              class="weapon-items"
              style="display: flex; justify-content: space-around"
            >
              <div
                class="weapon-list"
                v-for="item in itemShowList"
                :key="item.id"
              >
                <div
                  class="border-weapon"
                  v-if="weaponCodeName === item.codename"
                >
                  <el-image
                    style="width: 60%; margin-top: clamp(10px, 2vw, 15px)"
                    fit="contain"
                    :src="item.imgnonebg"
                  >
                    <template #placeholder>
                      <div class="loader01">
                        <div class="inner one" />
                        <div class="inner two" />
                        <div class="inner three" />
                      </div>
                    </template>
                  </el-image>
                  <p style="font-size: 15px">Lv.{{ item.attributes.Level }}</p>
                </div>
              </div>
            </div>
          </div>
          <el-link
            style="display: flex; margin-top: 20px"
            class="link-type01"
            :underline="false"
            href="#/collections/details/vpunks-weapons"
            ><IconifyIconOnline
              icon="fa-solid:link"
              style="margin-right: 5px"
            />Information & tokenomics
          </el-link>
        </div>
        <div class="min-box-description">
          <el-dropdown
            class="select-mint"
            popper-class="mint-popper"
            trigger="click"
            @visible-change="handleVisibleChange"
          >
            <span class="el-dropdown-link"
              >{{ collSe.label }}
              <span class="icon-down" :class="{ open: isRotate }">
                <IconifyIconOnline
                  class="arrow-down"
                  icon="akar-icons:chevron-down"
                />
              </span>
            </span>
            <template #dropdown>
              <el-dropdown-menu
                class="dropdown-mint"
                style="color: #fff !important; border-radius: 5px"
              >
                <el-dropdown-item
                  v-for="item in optionsCollection"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                  @click="handleOptions(item.id, item.value)"
                >
                  <span
                    class="el-dropdown-link"
                    style="padding: 0px 5px; user-select: none"
                    >{{ item.label }}</span
                  >
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <h2 style="font-size: 30px; font-weight: bolder; padding: 5px 0">
            Mint <span style="color: #45bbff">{{ itemDetails.name }}</span>
          </h2>
          <p style="letter-spacing: 1px">
            Fixed cost of
            <span style="color: #45bbff">
              <Amount :balance="mintingPrice" /> {{ paybleSymbol }}
            </span>
            to mint one Weapon
          </p>
          <p style="letter-spacing: 1px; padding: 5px">
            ⚡Up to 25% discount for
            <el-link href="#/account/index" style="color: #45bbff">
              VeFam VIP
            </el-link>
            members
          </p>
          <p style="letter-spacing: 1px">Weapons left : {{ itemLeft }}</p>
          <div class="input-number-gr">
            <!-- <p>
              <el-input
                v-model="numberOfNfts"
                placeholder="Amount of NFTs to mint"
                class="number-of-nfts"
                :disabled="mintButtonLoading"
                @blur="handleNumOfNfts"
              />
            </p> -->
            <el-input-number
              v-model="numberOfNfts"
              class="number-of-nfts"
              placeholder="Amount of NFTs to mint"
              :disabled="mintButtonLoading"
              :min="1"
              :max="20"
              @change="handleNumOfNfts"
            />
            <span v-if="myAddr && numNftError != null" class="error">{{
              numNftError
            }}</span>
          </div>
          <div class="group" style="font-size: 15px">
            <div>
              Total cost: <Amount :balance="totalCost" /> {{ paybleSymbol }}
            </div>
            <div>
              Discount: <Amount :balance="totalDiscount" /> {{ paybleSymbol }}
            </div>
            <div>
              Payble: <Amount :balance="totalPayble" style="color: #43b7fa" />
              {{ paybleSymbol }}
            </div>
          </div>
          <div v-if="!myAddr" style="margin: 5px 0 0px 0">
            <p v-if="!myAddr" class="error" style="margin: 0px 0 0px 0">
              Please connect wallet!
            </p>
            <el-button
              v-if="!myAddr"
              @click="connectWallet"
              :loading="mintButtonLoading"
              class="btn-connect"
            >
              <IconifyIconOnline
                style="margin-right: 6px; font-size: 17px"
                class="arrow-down"
                icon="uil:wallet"
              />Connect wallet</el-button
            >
          </div>
          <el-button
            v-else
            class="mint-button"
            style="margin-top: 20px"
            type="success"
            size="large"
            :loading="mintButtonLoading"
            @click="handleMint()"
          >
            <IconifyIconOnline
              style="margin-right: 6px; font-size: 20px"
              class="arrow-down"
              icon="emojione-monotone:hammer-and-pick"
            />{{ mintButtonText }}
          </el-button>
        </div>
      </div>
      <h3 style="margin: 50px 0 20px 0">
        Tiered discount for VeFam VIP members
      </h3>
      <div ref="splitContainer" class="dou-table">
        <div :class="splitColClass" class="split-col">
          <el-table :data="costToMint1" border fit highlight-current-row>
            <el-table-column
              align="center"
              label="Order of NFT is minted"
              min-width="160"
            >
              <template v-slot="{ row }">
                <b style="color: #45bbff">{{ row.order }}</b>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Discount" min-width="160">
              <template v-slot="{ row }">
                <span style="color: #fff">{{ row.cost }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div :class="splitColClass" class="split-col">
          <el-table :data="costToMint2" border fit highlight-current-row>
            <el-table-column
              align="center"
              label="Order of NFT is minted"
              min-width="160"
            >
              <template v-slot="{ row }">
                <b style="color: #45bbff">{{ row.order }}</b>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Discount" min-width="160">
              <template v-slot="{ row }">
                <span style="color: #fff">{{ row.cost }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- <div style="margin-top: 50px">
        <h3 style="margin: 20px 0 20px 0">Recently Minted</h3>
        <el-row :gutter="gutter" class="panel-group">
          <el-col
            v-for="(item, index) of recentlyMinted"
            :key="item.id"
            :xs="elColXS"
            :sm="12"
            :lg="6"
            class="card-panel-col"
          >
            <div :id="index === 0 && 'mint-card-row'" class="card-panel">
              <div class="card-panel-icon-wrapper icon-people">
                <img :src="item.img" class="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  VPunk {{ item.id }}
                  <span class="card-panel-type">{{ item.type }}</span>
                </div>
                <span
                  v-for="(acces, index2) of item.accessories"
                  :key="item.id + '-' + index2"
                  class="card-panel-acces"
                  >{{ acces }}</span
                >
              </div>
              <div style="clear: both; text-align: center" />
            </div>
          </el-col>
        </el-row>
        <div
          v-if="recentlyMinted.length === 0"
          style="text-align: center; font-size: 14px"
        >
          <span class="el-table__empty-text">No Data</span>
        </div>
      </div> -->
    </div>
    <!-- </div> -->
  </div>
</template>

<style lang="scss">
.mint-popper {
  .el-popper__arrow::before {
    background: #19457a82 !important;
    border-color: #19457a82 !important;
  }
  .el-dropdown-menu {
    background-color: #0d2a4c !important;
    border: unset !important;
    overflow: hidden;
  }
  .el-dropdown-menu__item:not(.is-disabled):focus {
    background-color: rgb(46 91 141 / 45%);
  }
}
</style>

<style lang="scss" scoped>
.mint-details-container {
  color: #fff;
  .min-box {
    border-radius: 10px;
    padding: 10px;
    padding: min(max(5px, 3vw), 20px);
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(120px);
    .min-box-item {
      overflow: hidden;
      max-width: 400px;
      width: 100%;
      height: 100%;
      z-index: 3;
      .card-mint {
        overflow: hidden;
        position: relative;
        width: 100%;
        height: 100%;
        z-index: 4;
        overflow: hidden;
        // background-image: ${{BgCard}};
        background-color: #0b102b;
        border-radius: 15px;
        box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.25);

        .aura-img {
          position: absolute;
          top: 5px;
          width: 310px;
          animation: shake 10.5s linear infinite;
          mix-blend-mode: screen;
        }
        @keyframes shake {
          100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }
        .aura-img2 {
          position: absolute;
          top: -25px;
          width: 370px;
          animation: shakerevert 8.5s linear infinite;
          mix-blend-mode: plus-lighter;
        }
        @keyframes shakerevert {
          100% {
            -webkit-transform: rotate(-360deg);
            transform: rotate(-360deg);
          }
        }

        .position-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .random-text {
            font-size: 16px;
            letter-spacing: 3px;
          }
          .arrow-down {
            margin-top: 10px;
            margin-bottom: 10px;
            font-size: 16px;
          }
        }
        .weapon-list {
          width: 31%;
          .border-weapon {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-image: url("/@/assets/border-minting-card.png");
            margin-bottom: 40px;
            width: 100%;
            height: 100%;
            background-size: contain;
            background-repeat: no-repeat;
            // background-color: #0000004f;
          }
        }
      }
    }
    .min-box-description {
      font-size: clamp(16px, 4vw, 20px);
      .mint-button {
        filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.25));
        border-radius: 14px;
        background-color: #1264f2;
        border: none;
        &:hover {
          background-color: #2b74f1;
        }
      }
      flex-grow: 8;
      text-align: center;
      .input-number-gr {
        padding-top: 15px;
        padding-bottom: 15px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        .number-of-nfts {
          font-size: 18px;
          max-width: 300px;
          width: 100%;
          text-align: center;
          :deep(.el-input__wrapper) {
            background: #fff;
            color: #000;
            height: 40px;
            box-shadow: unset;
            border-radius: 20px;
          }
          :deep(.el-input__wrapper.is-focus) {
            box-shadow: #1264f2 0px 0px 15px 2px;
          }
          :deep(.el-input-number__decrease, .el-input-number__increase) {
            left: 5px;
            top: 5px;
            background-color: #b0b0b0;
            border-right: 0px solid #45bbff;
            border: 0px solid #45bbff;
            border-radius: 30px;
            width: 30px;
            height: 30px;
            color: #fff;
            font-weight: bolder;
            &:hover {
              background-color: #878787;
              transition: all 0.25s;
            }
          }
          :deep(.el-input-number__increase) {
            right: 5px;
            top: 5px;
            background-color: #b0b0b0;
            border-left: 0px solid #45bbff;
            border: 0px solid #45bbff;
            border-radius: 30px;
            width: 30px;
            height: 30px;
            color: #fff;
            font-weight: bolder;
            &:hover {
              background-color: #878787;
              transition: all 0.25s;
            }
          }
          :deep(.el-input__inner) {
            color: #2f2f2f;
            font-weight: bolder;
            font-size: 17px;
          }
        }
      }
      .btn-connect {
        margin-top: 10px;
        background: rgba(18, 100, 242, 0.1);
        color: #5190ff;
        border: 1px solid #1264f2;
        border-radius: 10px;
        font-size: 17px;
        height: 100%;
        &:hover {
          color: #74a7ff;
          background-color: #1264f2;
          color: #fff;
          transition: all 0.25s;
        }
      }
      .error {
        color: #ff4545;
        margin: 5px 0 -15px 0;
        font-size: 14px;
      }
    }
  }
  :deep(.el-table th.el-table__cell) {
    background: #191f3d;
    // border: none;
  }
  :deep(.el-table__row) {
    background: #0d1333;
    // border: none;
  }
  :deep(.el-table--enable-row-hover
      .el-table__body
      tr:hover
      > td.el-table__cell) {
    background: #192460;
  }
  :deep(.el-table__body tr.current-row > td.el-table__cell) {
    background-color: #192460;
  }
  .el-table {
    --el-table-border-color: #37469b;
    border-radius: 10px;
  }
  :deep(.el-table .cell) {
    word-break: break-word !important;
  }
  .split-col {
    display: inline-block;
    padding: 15px 10px;
    padding-left: min(max(0px, 2vw), 20px);
    padding-right: min(max(0px, 2vw), 20px);
    word-break: break-word !important;
  }
  .split-col50 {
    width: 50%;
  }
  .split-col100 {
    width: 100%;
  }
}
// dropdown
.select-mint {
  display: flex;
  justify-content: flex-end;
  .el-dropdown-link {
    display: flex;
    color: #fff;
    background-color: #242d5a;
    padding: 8px 20px;
    border-radius: 12px;
    user-select: none;
    .icon-down {
      transition: all 0.25s;
      margin-left: 10px;

      &.open {
        transform: rotate(-180deg);
        transition: all 0.25s;
      }
    }
  }
}
:deep(.el-dropdown-menu__item) {
  color: #fff !important;
  &:hover {
    background-color: #445195;
  }
}

@media screen and (max-width: 700px) {
  .main-content {
    margin: 10px !important;
  }
  .mint-details-container {
    .min-box {
      flex-wrap: wrap;
      .min-box-description {
        margin: 20px 0;
        .number-of-nfts {
          padding-left: 0;
        }
      }
    }
    .dou-table {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      .split-col50 {
        width: 100%;
      }
    }
  }
}
</style>
