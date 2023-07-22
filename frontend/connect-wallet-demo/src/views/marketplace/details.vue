<script setup lang="ts">
// import projectList from "../../../public/images/games/projects.json";
import collectionList from "/@/static/collections.json";
import { useRoute } from "vue-router";
import { ref } from "vue";
import chart from "/src/assets/chart.png";

const route = useRoute();
const projectsId = route.params.id;
let collectionsDetails = {};
const activeNames = ref(["1"]);
const handleChange = (val: string[]) => {
  console.log(val);
};
// console.log(projectsId);

let collectionsDetailsFind = collectionList.find(projects => {
  return String(projects.id) === projectsId;
});
if (collectionsDetails) collectionsDetails = collectionsDetailsFind;
console.log(collectionsDetails);

// const socialMedia = [
//   { link: "https://discord.gg/vpunks", name: "discord", target: "_blank" },
//   {
//     link: "https://twitter.com/vpunksofficial",
//     name: "twitter",
//     target: "_blank"
//   },
//   {
//     link: "https://twitter.com/vpunksofficial",
//     name: "browser",
//     target: "_blank"
//   }
// ];
const tableData = [
  {
    sale: "Win",
    item: "--",
    price: "00.00",
    quantity: "0",
    from: "--",
    to: "----",
    time: "1 second ago"
  },
  {
    sale: "Win",
    item: "--",
    price: "00.00",
    quantity: "0",
    from: "--",
    time: "1 second ago"
  }
];
</script>

<template>
  <div class="list-item-container" v-if="projectsId == collectionsDetails.id">
    <el-row :gutter="20" class="list-items">
      <el-col :span="8">
        <div class="img-hidden1">
          <div class="card-border-linear">
            <el-card class="card-img">
              <template #header>
                <div class="card-header">
                  <span>Buy now</span>
                </div>
              </template>
              <el-row class="item-img1">
                <el-image
                  style="height: 205px; image-rendering: pixelated"
                  :src="`./images/games/${collectionsDetails.img}`"
                />
              </el-row>
            </el-card>
          </div>
        </div>
        <div class="card-border-linear">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>Description</span>
              </div>
            </template>
            <span style="color: #c2c2c2"
              >Created by<span style="color: #00a6ff">#1654564</span></span
            >
            <br />
            <span
              >Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a</span
            >
          </el-card>
        </div>
        <div class="card-border-linear">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>Properties</span>
              </div>
            </template>
            <el-row class="list-properties">
              <div class="list-properties-items">
                <el-col class="properties-item">
                  <el-row style="color: #00a6ff">Lorem Ipsum</el-row>
                  <el-row>Lorem Ipsum</el-row>
                  <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                </el-col>
              </div>
              <div class="list-properties-items">
                <el-col class="properties-item">
                  <el-row style="color: #00a6ff">Lorem Ipsum</el-row>
                  <el-row>Lorem Ipsum</el-row>
                  <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                </el-col>
              </div>
              <div class="list-properties-items">
                <el-col class="properties-item">
                  <el-row style="color: #00a6ff">Lorem Ipsum</el-row>
                  <el-row>Lorem Ipsum</el-row>
                  <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                </el-col>
              </div>
              <div class="list-properties-items">
                <el-col class="properties-item">
                  <el-row style="color: #00a6ff">Lorem Ipsum</el-row>
                  <el-row>Lorem Ipsum</el-row>
                  <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                </el-col>
              </div>
              <div class="list-properties-items">
                <el-col class="properties-item">
                  <el-row style="color: #00a6ff">Lorem Ipsum</el-row>
                  <el-row>Lorem Ipsum</el-row>
                  <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                </el-col>
              </div>
              <div class="list-properties-items">
                <el-col class="properties-item">
                  <el-row style="color: #00a6ff">Lorem Ipsum</el-row>
                  <el-row>Lorem Ipsum</el-row>
                  <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                </el-col>
              </div>
              <div class="list-properties-items">
                <el-col class="properties-item">
                  <el-row style="color: #00a6ff">Lorem Ipsum</el-row>
                  <el-row>Lorem Ipsum</el-row>
                  <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                </el-col>
              </div>
              <div class="list-properties-items">
                <el-col class="properties-item">
                  <el-row style="color: #00a6ff">Lorem Ipsum</el-row>
                  <el-row>Lorem Ipsum</el-row>
                  <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                </el-col>
              </div>
              <div class="list-properties-items">
                <el-col class="properties-item">
                  <el-row style="color: #00a6ff">Lorem Ipsum</el-row>
                  <el-row>Lorem Ipsum</el-row>
                  <el-row style="color: #c2c2c2">0% Lorem Ipsum</el-row>
                </el-col>
              </div>
            </el-row>
          </el-card>
        </div>
        <div class="card-border-linear">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>About Name Exsample</span>
              </div>
            </template>
            <span
              >Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged</span
            >
            <div class="socia-item">
              <div class="discord">
                <a
                  rel="noopener"
                  target="_blank"
                  href="https://t.co/VMPYtJdNrX"
                >
                  <div class="icon">
                    <IconifyIconOnline icon="akar-icons:discord-fill" />
                  </div>
                </a>
              </div>
              <div class="twitter">
                <a
                  rel="noopener"
                  target="_blank"
                  href="https://twitter.com/vefamofficial"
                >
                  <div class="icon">
                    <IconifyIconOnline icon="fa:twitter" />
                  </div>
                </a>
              </div>
              <div class="chrome">
                <a
                  rel="noopener"
                  target="_blank"
                  href="https://www.youtube.com/channel/UC2Lo-wP2fio8GbHWRM9DO4Q/videos"
                >
                  <div class="icon">
                    <IconifyIconOnline icon="fa:youtube-play" />
                  </div>
                </a>
              </div>
            </div>
          </el-card>
        </div>
        <div class="card-border-linear">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>Details</span>
              </div>
            </template>
            <div class="infomation">
              <el-row :gutter="24">
                <el-col :span="10">Contract Address</el-col>
                <el-col
                  :span="14"
                  style="
                    color: #00d4ff;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                  "
                  >911</el-col
                >
              </el-row>
              <el-row :gutter="24">
                <el-col :span="10">Token ID</el-col>
                <el-col :span="14">{{ collectionsDetails.id }}</el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="10">Token Standard</el-col>
                <el-col :span="14" class="text-blue">ABC-000</el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="10">Blockchain</el-col>
                <el-col :span="14" class="text-blue">Vechain</el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="name-item">
          <h1 style="color: #00d4ff; font-size: 30px">
            {{ collectionsDetails.name }}
          </h1>
          <div class="img-hidden2">
            <div class="card-border-linear">
              <el-card class="card-img">
                <template #header>
                  <div class="card-header">
                    <span>Buy now</span>
                  </div>
                </template>
                <el-row class="item-img1">
                  <el-image
                    style="height: 205px; image-rendering: pixelated"
                    :src="`./images/games/${collectionsDetails.img}`"
                  />
                </el-row>
              </el-card>
            </div>
          </div>
          <!-- <el-row class="item-img2">
            <img :src="VNFTData.img" />
          </el-row> -->
          <h3 style="color: #00d4ff">
            Token Id
            <span style="color: #ffff; font-size: 20px"
              >#00{{ collectionsDetails.id }}</span
            >
          </h3>
          <h3 style="color: #fff">
            Owned by <span style="color: #00a6ff">911</span>
          </h3>
        </div>
        <div class="card-border-linear" style="margin-top: 10px">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>Current Price</span>
              </div>
            </template>
            <el-row :gutter="24">
              <el-col :span="7">Start</el-col>
              <el-col :span="14">1 ETH - (2.914,63 USD)</el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="7">Price</el-col>
              <el-col :span="14" class="text-blue"
                >1 ETH - (2.914,63 USD)</el-col
              >
            </el-row>
            <el-row :gutter="24">
              <el-col :span="7"
                >End <i style="color: #ffff" class="el-icon-timer"
              /></el-col>
              <el-col :span="14" class="text-blue"
                >1 ETH - (2.914,63 USD)</el-col
              >
            </el-row>
            <el-row class="btn-gr">
              <el-button size="large" round class="btn-buy-now"
                >Buy now
              </el-button>
              <div class="border-btn">
                <el-button type="primary" round class="btn-make-offer"
                  >Make offer</el-button
                >
              </div>
            </el-row>
          </el-card>
        </div>
        <!--           style="
            border-bottom-right-radius: 0px !important;
            border-bottom-left-radius: 0px !important;
          " -->
        <!-- <div
          class="card-border-linear"
          style="
            border-bottom-right-radius: 0px !important;
            border-bottom-left-radius: 0px !important;
          "
        >
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="Consistency" name="1">
              <span>
                Consistent with real life: in line with the process and logic of
                real life, and comply with languages and habits that the users
                are used to; Consistent within interface: all elements should be
                consistent, such as: design style, icons and texts, position of
                elements, etc.
              </span>
            </el-collapse-item>
          </el-collapse>
        </div> -->
        <div
          class="card-border-linear"
          style="
            border-bottom-right-radius: 0px !important;
            border-bottom-left-radius: 0px !important;
          "
        >
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="Price History" name="1">
              <el-dropdown>
                <div class="border-btn">
                  <el-button type="primary" round class="btn-make-offer"
                    >Last 90 days
                    <IconifyIconOnline class="icon-arrow" icon="ep:arrow-down"
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
              <el-row class="chart-img">
                <img style="max-width: 100%; padding: 20px" :src="chart" />
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div
          class="card-border-linear"
          style="
            border-bottom-right-radius: 0px !important;
            border-bottom-left-radius: 0px !important;
          "
        >
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="Listing" name="2">
              <div class="listing-item">
                <el-table
                  :data="tableData"
                  fit
                  highlight-current-row
                  style="max-width: 95%"
                >
                  <el-table-column
                    prop="price"
                    label="Price"
                    min-width="100px"
                    align="center"
                  />
                  <el-table-column
                    prop="usdPrice"
                    label="USD price"
                    min-width="145px"
                    align="center"
                  />
                  <el-table-column
                    prop="expriation"
                    label="Expiration"
                    min-width="100px"
                    align="center"
                  />
                  <el-table-column
                    prop="from"
                    label="From"
                    min-width="145px"
                    align="center"
                  />
                  <el-table-column role="cell" min-width="145px" align="center">
                    <el-button class="btn-buy-now">Buy </el-button>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div
          class="card-border-linear"
          style="
            border-bottom-right-radius: 0px !important;
            border-bottom-left-radius: 0px !important;
          "
        >
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="Ofer" name="3">
              <div class="offer-table">
                <el-table
                  :data="tableData"
                  fit
                  highlight-current-row
                  style="max-width: 95%"
                >
                  <el-table-column
                    prop="price"
                    label="Price"
                    min-width="100px"
                    align="center"
                  />
                  <el-table-column
                    prop="usdPrice"
                    label="USD Price"
                    min-width="145px"
                    align="center"
                  />
                  <el-table-column
                    prop="floorDifference"
                    label="Floor Difference"
                    width="145px"
                    align="center"
                  />
                  <el-table-column
                    prop="expiration"
                    label="Expiration"
                    min-width="100px"
                    align="center"
                  />
                  <el-table-column
                    prop="from"
                    label="From"
                    max-width="145px"
                    align="center"
                  />
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
    </el-row>
    <div class="list-item-below">
      <div
        class="card-border-linear"
        style="
          border-bottom-right-radius: 0px !important;
          border-bottom-left-radius: 0px !important;
        "
      >
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="Item Activity" name="4">
            <div class="offer-table">
              <el-table
                :data="tableData"
                fit
                highlight-current-row
                style="max-width: 95%"
              >
                <el-table-column
                  prop="price"
                  label="Price"
                  min-width="100px"
                  align="center"
                />
                <el-table-column
                  prop="usdPrice"
                  label="USD Price"
                  min-width="145px"
                  align="center"
                />
                <el-table-column
                  prop="floorDifference"
                  label="Floor Difference"
                  width="145px"
                  align="center"
                />
                <el-table-column
                  prop="expiration"
                  label="Expiration"
                  min-width="100px"
                  align="center"
                />
                <el-table-column
                  prop="from"
                  label="From"
                  max-width="145px"
                  align="center"
                />
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="card-border-linear">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>More from this</span>
          </div>
        </template>
        <span style="color: #00a6ff">Coming soon</span>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-item-container {
  padding-right: min(50px, 2%);
  padding-left: min(50px, 2%);
  .list-items {
    display: flex;
    justify-content: center;
  }
  .el-col-8 {
    max-width: 100%;
    min-width: 268px;
  }
  .el-col-16 {
    max-width: 100%;
    min-width: 268px;
  }
  .list-item-below {
    max-width: 100%;
    min-width: 268px;
  }
  .card-border-linear {
    background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
    padding: 1px;
    border-radius: 10px;
    max-width: 1787px;
    min-width: 268px;
    margin-bottom: 15px;
    z-index: 200;
    // &:active:after::before {
    //   border-bottom-right-radius: 0px !important;
    //   border-bottom-left-radius: 0px !important;
    // }
  }
  .el-card {
    color: #fff;
    background-color: #171b33 !important;
    border-radius: 10px !important;
    border: none;
    max-width: 1787px;
    min-width: 265px;
    :deep(.el-card__header) {
      border-image-slice: 1;
      border-image-source: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
    }
  }
  .card-img {
    :deep(.el-card__body) {
      padding: 0 !important;
    }
  }
  .item-img1 {
    display: flex;
    justify-content: center;
  }
  .list-properties {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    &-items {
      padding: 5px;
    }
  }
  .properties-item {
    background-color: rgba(0, 0, 0, 0.2);
    text-align: center;
    font-size: 13px;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    padding: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    // padding-inline: 10px;
  }
  .socia-item {
    display: flex;
    align-items: center;
    width: 300px;
    max-width: 100%;
    padding: 20px 20px 0px 0px;
    .icon {
      display: flex;
      width: 54px;
      height: 54px;
      align-items: center;
      font-size: 25px;
      display: flex;
      justify-content: center;
      // & svg {
      //   width: 100%;
      //   height: 22px;
      // }
    }
    .discord,
    .twitter,
    .chrome {
      background: linear-gradient(
        94.9deg,
        #00f6ff 0%,
        #5d7eff 48.44%,
        #5429a0 100%
      );
      border-radius: 20px;
      margin-right: 10px;
      opacity: 0.8;
      transition: all 0.3s ease-in;
      font-weight: 700;
      & a {
        width: 54px;
        height: 54px;
      }
      &:hover {
        opacity: 1;
      }
    }
  }
  .btn-buy-now {
    background-image: linear-gradient(
      94.9deg,
      #00f6ff 0%,
      #5d7eff 48.44%,
      #5429a0 100%
    );
    border-radius: 20px;
    border: none;
    color: #ffff;
    &:hover {
      opacity: 0.9;
    }
  }
  .btn-gr {
    margin-top: 10px;
    .btn-make-offer {
      background-color: #171b33;
      border: none;
      color: #fff;
    }
  }
  .border-btn {
    background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
    padding: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    text-align: center;
    position: relative;
    margin-left: 20px;
    z-index: 100;
    height: 100%;
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

  .btn-make-offer {
    background-color: #171b33;
    border: none;
    color: #fff;
  }
  // .el-collapse {
  //   --el-collapse-border-color: #171b3300;
  //   // border-top: none;
  //   // border-bottom: none;
  //   --el-collapse-header-bg-color: #171b33;
  //   --el-collapse-content-bg-color: #171b33;
  //   --el-collapse-content-text-color: #fff;
  //   border-bottom-right-radius: 10px;

  //   :deep(.el-collapse-item__header) {
  //     color: #fff;
  //     border-image-slice: 1;
  //     border-image-source: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
  //     border-top-right-radius: 10px;
  //     border-top-left-radius: 10px;
  //     border-top: none;
  //   }
  //   :deep(.el-collapse-item__wrap) {
  //     // border: 2px solid red;
  //     // border-bottom-right-radius: 10px;
  //     border-top: 0;
  //     border-bottom-right-radius: 10px;
  //     border-bottom-left-radius: 10px;
  //   }
  // }
  .el-collapse {
    border-top: 0;
    border-radius: 10px;
    // margin-bottom: 10px;
    --el-collapse-content-text-color: #fff;
    :deep(.el-collapse-item__header) {
      color: #fff;
      background-color: #171b33;
      // border: 1px solid #001859;
      border-top: none;
      // border-bottom: none;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      padding: 31px 20px;
      font-size: 16px;
      // border: none;
      border-image-slice: 1;
      border-image-source: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
      z-index: 1;
      // border-bottom-right-radius: 10px;
      // border-bottom-left-radius: 10px;
      // &:before {
      //   border-bottom: none;
      // border-bottom-color: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
      // border-bottom-right-radius: 10px;
      // border-bottom-left-radius: 10px;
      // }
    }
    :deep(.el-collapse-item__wrap) {
      background-color: #171b33;
      // border-bottom: none;
      // padding-top: 25px;
      // border-image-slice: 1;
      // border-image-source: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
      // border: 1px solid #001859;
      // border-image-slice: 2;
      // border-image-source: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
      border: none;
      // border-top: 0;
      // z-index: 2;
      // border-bottom-right-radius: 10px !important;
      // border-bottom-left-radius: 10px !important;
      border-image-slice: 1;
      // border-image-repeat: round;
      border-image-source: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
    }
    :deep(.el-collapse-item__content) {
      padding-top: 25px;
      // border-image-slice: 30;
      // border-image-source: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
      // // border: 1px solid rgba(255, 255, 255, 0.622);
      border-bottom-right-radius: 10px !important;
      border-bottom-left-radius: 10px !important;
    }
  }
  .icon-arrow {
    vertical-align: middle;
    margin-left: 4px;
  }
  .el-table th.is-leaf,
  .el-table td {
    border-bottom: 0px solid #00000050 !important;
    padding: 10px;
    margin: 0;
  }
  .el-table::before,
  .el-table--group::after,
  .el-table--border::after {
    background-color: #000 !important;
  }
  :deep(.el-table tr),
  :deep(.el-table thead),
  :deep(.el-table__cell.is-leaf),
  :deep(.el-table__cell),
  :deep(.el-table__inner-wrapper::before) {
    background-color: #171b33 !important;
    border: none;
  }
  :deep(.el-table thead),
  :deep(.el-table__cell.is-leaf),
  :deep(.el-table__cell) {
    color: white;
  }
}
@media screen and (min-width: 950px) {
  .name-item {
    .img-hidden2 {
      display: none;
    }
  }
}
@media screen and (max-width: 951px) {
  .list-items {
    flex-direction: column-reverse;
    flex-wrap: wrap-reverse !important;
    align-items: center;
    // .el-col-8 {
    //   width: 100% !important;
    // }
  }
  .img-hidden1 {
    display: none;
  }
}
</style>
