<script setup lang="ts">
import { ref, onUnmounted, onMounted } from "vue";
import Weapon from "/@/static/collections/vpunks-weapons.json";
import { useRoute } from "vue-router";

const route = useRoute();
const WeaponId = route.params.id;
console.log(WeaponId);

let mintDetails = {
  id: "",
  name: "",
  games: "",
  img: "",
  attributes: ""
};

const dataNew = Weapon.map(itemNew => {
  return itemNew.items;
});

let newData = [];
for (let i = 0; i < dataNew.length; i++) {
  newData.push(dataNew[i]);
}
const finalData = newData[0];

let mintDetailsFind = finalData.find(weapon => {
  return String(weapon.id) === WeaponId;
});

if (mintDetails) mintDetails = mintDetailsFind;
console.log(mintDetails);
//
const numberOfNfts = undefined;
// const isConnected = ref(false);
const mintButtonText = "Mint VPunks";
const costToMint1 = [
  { order: "0 to 999", cost: "No Data yet" },
  { order: "1000 to 1999", cost: "No Data yet" },
  { order: "2000 to 2999", cost: "No Data yet" },
  { order: "3000 to 3999", cost: "No Data yet" },
  { order: "4000 to 4999", cost: "No Data yet" }
];
const costToMint2 = [
  { order: "5000 to 5999", cost: "No Data yet" },
  { order: "6000 to 6999", cost: "No Data yet" },
  { order: "7000 to 7999", cost: "No Data yet" },
  { order: "8000 to 8999", cost: "No Data yet" },
  { order: "9000 to 9999", cost: "No Data yet" }
];
let splitColClass = "split-col50";
const recentlyMinted = [];

onMounted(() => {
  // debug && console.log("---------- Home", "mounted");
  window.addEventListener("resize", handleWindowResize);
  handleWindowResize();
});

onUnmounted(() => {
  // debug && console.log("---------- Home", "beforeUnmount");
  window.removeEventListener("resize", handleWindowResize);
});
let gutter = 40;
let elColXS = 12;
// const maxColWidth = 225;
// const minColWidth = 200;
// const maxColPadding = 10;
// // console.log(Punk.items);
// let colWidth = maxColWidth;
// let colPadding = maxColPadding;

function handleWindowResize() {
  // debug && console.log("---------- innerWidth:", window.innerWidth);
  const cpf = document.getElementById("mint-card-row") as HTMLElement;
  // if (cpf) {
  //   const clientWidth = Math.floor(cpf.clientWidth - 1); // js luôn làm tròn clientWidth cho dù DOM là số lẻ
  //   const tempColWidth = maxColWidth + maxColPadding * 2;
  //   const itemNum = Math.floor(clientWidth / tempColWidth);
  //   const widthUsed = tempColWidth * itemNum;
  //   const excessPadding = (clientWidth - widthUsed) / itemNum;
  //   colPadding = clientWidth < 400 ? 0 : maxColPadding;
  //   // console.log('---------- excessPadding:', itemNum, excessPadding)
  //   let colWidthUpdate = false;
  //   if (excessPadding > minColWidth / 2) {
  //     for (let i = itemNum + 1; i < itemNum + 10; i++) {
  //       const tempColWidth2 = Math.floor(clientWidth / i) - 1;
  //       if (tempColWidth2 >= minColWidth) {
  //         colWidth = tempColWidth2 - colPadding * 2;
  //         colWidthUpdate = true;
  //       }
  //       break; // break ngay nhưng vẫn sử dụng for vì có thể thay đổi logic sau này
  //     }
  //   }
  //   if (!colWidthUpdate) colWidth = tempColWidth - colPadding * 2;
  // }

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
</script>

<template>
  <div class="mint-details-container">
    <div v-if="WeaponId == mintDetails.id">
      <div class="min-box">
        <div class="min-box-item">
          <div class="image">
            <el-image
              :src="`./images/collections/vpunks-weapons/${mintDetails.img}`"
              alt=""
              fit="cover"
              lazy
            />
          </div>
          <div class="min-box-item-right">
            <div class="min-box-item-right-text">
              <h4>{{ mintDetails.name }}</h4>
              <p>Lv.{{ mintDetails.attributes.Level }}</p>
            </div>
            <div class="min-box-item-right-scores">
              <span>- / -</span>
            </div>
          </div>
        </div>
        <div class="min-box-description">
          <h2>Mint <span style="color: #00d4ff">VPunks</span></h2>
          <p style="letter-spacing: 1px">
            Current cost is
            <span style="color: #00d4ff">3900 VET</span>
            to mint one VPunk
          </p>
          <p style="letter-spacing: 1px; padding: 5px">
            ☂️Airdrop⚡ For each VPunk minted you will receive 500 VPU
            <el-link href="#/token-and-contract" style="color: #00d4ff"
              >(more info)</el-link
            >
          </p>
          <p style="letter-spacing: 1px">VPunks left : 0</p>
          <p>
            <el-input
              v-model="numberOfNfts"
              placeholder="Amount of NFTs to mint"
              class="number-of-nfts"
            /><br />
          </p>
          <el-button type="success">🛠 {{ mintButtonText }}</el-button>
        </div>
      </div>
      <h3 style="margin: 50px 0 20px 0">Cost to mint a VPunk</h3>
      <div ref="splitContainer" class="dou-table">
        <div :class="splitColClass" class="split-col">
          <el-table :data="costToMint1" border fit highlight-current-row>
            <el-table-column
              align="center"
              label="Order of NFT is minted"
              min-width="160"
            >
              <template v-slot="{ row }">
                <b style="color: #00d4ff">{{ row.order }}</b>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Cost" min-width="160">
              <template v-slot="{ row }">
                {{ row.cost }}
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
                <b style="color: #00d4ff">{{ row.order }}</b>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Cost" min-width="160">
              <template v-slot="{ row }">
                {{ row.cost }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div style="margin-top: 50px">
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
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mint-details-container {
  color: #fff;
  .min-box {
    border: 2px dashed #3f51b5;
    border-radius: 10px;
    padding: 10px;
    padding: min(max(5px, 3vw), 20px);
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(120px);
    // flex-wrap: wrap;
    &-item {
      width: 270px;
      // margin:10px 0px 0px 14px;
      box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.25);
      border-radius: 25px;
      background-color: #202440;
      .image {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #202440;
        border-top: 1px solid transparent;
        border-top-left-radius: 25px;
        border-top-right-radius: 25px;
        .el-image {
          width: 100%;
          height: 200px;
          border-top-left-radius: 25px;
          border-top-right-radius: 25px;
        }
      }
      &-right {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        &-text {
          flex-grow: 1;
        }
        &-scores {
          flex-grow: 1;
          background: #96969621;
          border-radius: 16px;
          line-height: 30px;
          text-align: center;
        }
      }
    }
    &-description {
      :deep(.el-input__wrapper) {
        background: #d9d9d9;
        border-radius: 16px;
        color: #000;
        line-height: 40px;
        height: 40px;
      }
      & button {
        filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.25));
        border-radius: 18px;
        background-color: #00d4ff;
        border: none;
        &:hover {
          background-color: #06badf;
        }
      }
      flex-grow: 8;
      text-align: center;
      .number-of-nfts {
        font-size: 18px;
        padding-left: 15px;
        padding: 20px;
      }
      .error {
        color: rgb(2, 234, 44);
        font-size: 15px;
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
@media screen and (max-width: 700px) {
  .mint-details-container {
    .min-box {
      flex-wrap: wrap;
      .min-box-description {
        margin-top: 20px;
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
