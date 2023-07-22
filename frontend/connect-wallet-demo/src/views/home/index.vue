<script lang="ts" setup>
import { onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStoreHook } from "/@/store/modules/user";
import { ReNormalCountTo } from "/@/components/ReCountTo";
import SendTransaction from "./components/SendTransaction.vue";
import imgDthor from "/img/home/dthor_home.png";
import ecosytem from "/img/home/ecosytem.png";
import imgSwap from "/img/home/swap.png";
import imgDashboard from "/img/home/bieudo.png";
import { emitter } from "/@/utils/mitt";
import { wagmiHandleswitchNetwork } from "/@/utils/wagmiWallet";

defineOptions({
  name: "Home"
});
// variable
const myAddr = computed(() => {
  return useUserStoreHook().dAccount.myAddr;
});

// method
function alertComing() {
  ElMessage("coming soon!");
}
function connectWallet() {
  emitter.emit("connectWallet");
}

function handlerChangeNetWork(chaisId: number): void {
  if (!myAddr.value) {
    console.log("Please, connect wallet!");
    return;
  } else {
    ElMessageBox.confirm(
      "Please make sure your wallet network is switched.",
      `Switch to Network`,
      {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        showClose: false
      }
    )
      .then(() => {
        wagmiHandleswitchNetwork(chaisId);
      })
      .catch(e => {
        console.error(e);
      });
  }
}
onMounted(() => {});
</script>
<template>
  <div class="dthor-container">
    <el-button @click="handlerChangeNetWork(137)">
      <div>Change Polygon</div>
    </el-button>
    <el-button @click="handlerChangeNetWork(1)">
      <div>ETH</div>
    </el-button>
    <el-button @click="handlerChangeNetWork(42161)">
      <div>Arbitrum</div>
    </el-button>
    <el-button @click="handlerChangeNetWork(56)">
      <div>BNB</div>
    </el-button>
    <el-button @click="handlerChangeNetWork(5)">
      <div>Testnet Goerli</div>
    </el-button>

    <SendTransaction />

    <div class="protocol">
      <div class="defi">DEFI</div>
      <div class="box-content">
        <h1 class="title">DTHOR PROTOCOL</h1>
        <p class="type-text1">Swap, tool to retrieve data for tokens VeThor</p>
        <div class="button">
          <el-button class="partial swap" size="large"
            ><router-link to="/swap/index">Swap</router-link>
            <IconifyIconOnline
              style="margin-left: 5px"
              icon="material-symbols:arrow-circle-right-outline-rounded"
          /></el-button>
          <el-button
            v-if="!myAddr"
            size="large"
            class="partial connect-wallet"
            @click="connectWallet"
            >Connect Wallet</el-button
          >
          <el-button
            v-else
            size="large"
            class="partial"
            style="background-color: #ecf5ff54; border-color: #ecf5ff00"
            @click="connectWallet"
            disabled
            >Connect Wallet</el-button
          >
        </div>
        <div class="social-media">
          <div class="social-media-item">
            <a
              class="github"
              href="https://github.com/vefam-labs"
              target="_blank"
            >
              <IconifyIconOnline icon="mdi:github" />
            </a>
          </div>
          <div class="social-media-item">
            <a
              class="twitter"
              href="https://twitter.com/dthorofficial"
              target="_blank"
            >
              <IconifyIconOnline icon="fa:twitter" />
            </a>
          </div>
          <div class="social-media-item">
            <a
              class="discord"
              href="https://discord.gg/jXhNqKTEvS"
              target="_blank"
            >
              <IconifyIconOnline icon="ic:baseline-discord" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="dthor">
      <div class="content">
        <div class="text-center">
          <h1>What is <el-image :src="imgDthor" /></h1>
          <p>
            Is a convenient, fast and reliable token converter. Not only that,
            it is also a place to retrieve data for tokens VET
          </p>
        </div>
      </div>
      <div class="count">
        <div class="count-item">
          <div class="trading">
            <p class="text-share">
              <ReNormalCountTo
                :duration="3000"
                :color="'#ffffff'"
                :fontSize="'1.5em'"
                :startVal="1"
                :endVal="5000"
              />
            </p>
            <p>Trading Volume</p>
          </div>
          <div class="integrations">
            <p class="text-share">
              <ReNormalCountTo
                :duration="3000"
                :color="'#ffffff'"
                :fontSize="'1.5em'"
                :startVal="1"
                :endVal="300"
                suffix="+"
                typeCount="number"
              />
            </p>
            <p>Integrations</p>
          </div>
          <div class="community">
            <p class="text-share flex justify-center">
              <ReNormalCountTo
                :duration="3000"
                :color="'#ffffff'"
                :fontSize="'1.5em'"
                :startVal="1"
                :endVal="4400"
                suffix="+"
                typeCount="number"
              />
            </p>
            <p>Community Delegate</p>
          </div>
        </div>
      </div>
    </div>
    <div class="ecosytem">
      <div class="ecosytem-content-text">
        <h1 class="title">DTHOR ECOSYTEM</h1>
        <p class="text1">A growing network of DeFi Apps</p>
        <span class="type-text1"
          >Developers, traders, and liquidity providers participate together in
          a financial marketplace that is open and accessible to all.</span
        >
        <div class="ecosytem-btn">
          <el-button class="partial swap" size="large" @click="alertComing()"
            >Explore
            <IconifyIconOnline
              style="margin-left: 5px"
              icon="material-symbols:arrow-circle-right-outline-rounded"
          /></el-button>
        </div>
      </div>

      <div class="ecosytem-image">
        <el-image :src="ecosytem" />
      </div>
    </div>
    <div class="easily-swap">
      <div class="easily-swap-images">
        <el-image :src="imgSwap" />
      </div>
      <div class="easily-swap-text">
        <h1 class="title">EASILY SWAP</h1>
        <p class="type-text1">
          Across multiple blockchains without wrapped/pegged assets & without a
          centralized counterparty. User-friendly interface for easy access and
          conversion
        </p>
      </div>
    </div>
    <div class="accurately">
      <div class="accurately-text">
        <h1 class="title">GET DATA QUICKLY AND ACCURATELY</h1>
        <p class="type-text1">
          Help you access VET tokens informatiHelp you access VET tokens
          information quickly, conveniently and easy to use with everyone. on
          quickly, conveniently and easy to use everyone
        </p>
      </div>
      <div class="accurately-image">
        <el-image :src="imgDashboard" />
      </div>
    </div>
  </div>
</template>
<style>
.scroll-num {
  color: #ffff;
}
</style>
<style lang="scss" scoped>
.dthor-container.main-content {
  margin: 0px;
}
.dthor-container {
  color: #ffff;

  .title {
    font-size: 30px;
    font-weight: 600;
  }
  .type-text1 {
    font-size: 20px;
  }
  .protocol .box-content,
  .ecosytem,
  .easily-swap,
  .accurately {
    transition: all 0.3s;
  }
  .partial {
    color: #ffff;
    border-color: #3676e0;
    border-radius: 20px;
    padding: 8px 20px;
    &.swap {
      background-color: #3676e0;
      &:hover {
        background-color: #4a84e1;
      }
    }
    &.connect-wallet {
      background-color: transparent;
      transition: 0.35s;
      &:hover {
        box-shadow: inset 135px 0 0 0 #3676e0;
      }
    }
  }
  .protocol {
    position: relative;
    background-image: url("/@/assets/home.png");
    height: 590px;
    background-repeat: no-repeat;
    .defi {
      position: absolute;
      font-size: 40px;
      color: #27282b;
      bottom: 0;
      font-size: 280px;
      font-style: italic;
      font-weight: bold;
      z-index: -1;
      user-select: none;
    }
    .box-content {
      position: absolute;
      bottom: 100px;
      margin-left: 60px;

      .button {
        margin: 20px 0px;
      }
      .social-media {
        display: flex;
        .social-media-item {
          width: 60px;
          text-align: center;
          a {
            display: inline-block;
            overflow: hidden;
            transition: 0.25s;
            opacity: 0.8;
            svg {
              width: 35px;
              height: 35px;
            }
            &:hover {
              opacity: 1;
            }
          }
        }
        ul {
          display: flex;
          li {
            text-align: center;
            a {
              // padding-right: 10px;
              cursor: pointer;
              display: inline-block;
              margin: 10px;
            }
            &:hover {
              color: #00aced;
              box-shadow: 0 0 23px 0 #00aced;
            }
          }
        }
      }
    }
  }
  .dthor {
    padding: 20px;
    margin-bottom: 30px;
    .content {
      margin-bottom: 50px;
      .text-center {
        h1 {
          font-size: 30px;
          font-weight: 600;
          margin: 10px 0px;
        }
        .el-image {
          margin-left: 5px;
          max-width: 100px;
          width: 100%;
          vertical-align: middle;
        }
        p {
          max-width: 500px;
          margin: 0px auto;
          font-size: 20px;
        }
      }
    }
    .count {
      .count-item {
        justify-content: space-between;
        display: flex;
        max-width: 1200px;
        margin: 0px auto;
        font-size: 22px;
        p {
          text-align: center;
        }
        .text-share {
          font-weight: 600;
        }
      }
    }
  }
  .ecosytem {
    background-color: #00000010;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 60px;
    margin-bottom: 30px;
    .ecosytem-content-text {
      max-width: 800px;
      .text1 {
        font-size: 18px;
        font-weight: 600;
        padding: 10px 0px;
      }
      .ecosytem-btn {
        margin-top: 30px;
      }
    }
    .ecosytem-image {
      .el-image {
        width: 590px;
      }
    }
  }
  .easily-swap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 60px;
    margin-bottom: 30px;

    .easily-swap-text {
      padding-left: 20px;
      max-width: 1140px;
    }
    .easily-swap-images {
      .el-image {
        width: 590px;
      }
    }
  }
  .accurately {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 60px;
    margin: 30px 0px;
    .accurately-text {
      max-width: 600px;
      padding-right: 20px;
    }
    .accurately-image {
      .el-image {
        width: 650px;
      }
    }
  }
}
@media screen and(min-width: 740px) {
  .dthor-container {
    .title {
      font-size: 40px;
    }
  }
}
@media screen and(max-width: 999px) {
  .dthor-container {
    .ecosytem {
      flex-direction: column;
      align-items: normal;
      .ecosytem-content-text {
        max-width: 100%;
      }
      .ecosytem-image .el-image {
        width: 100%;
      }
    }
    .easily-swap {
      flex-direction: column-reverse;
      align-items: normal;
      .easily-swap-text {
        padding-left: 0px;
        padding-bottom: 20px;
      }
      .easily-swap-images {
        .el-image {
          width: 100%;
        }
      }
    }
    .accurately {
      flex-direction: column;
      .accurately-text {
        padding-right: 0;
        padding-bottom: 20px;
        width: 100%;
        max-width: 100%;
      }
      .accurately-image {
        .el-image {
          width: 100%;
        }
      }
    }
  }
}

@media screen and(max-width: 580px) {
  .dthor-container {
    .type-text1,
    .dthor .content .text-center p,
    .dthor .count .count-item {
      font-size: 18px;
    }
    .dthor .count .count-item .integrations {
      padding: 0px 15px;
    }

    .protocol .box-content {
      margin-left: 20px;
      transition: all 0.3s;
    }
    .ecosytem,
    .easily-swap,
    .accurately {
      padding: 20px 20px;
      transition: all 0.3s;
    }
  }
}
</style>
