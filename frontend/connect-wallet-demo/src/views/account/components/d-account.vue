<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
// import { ElMessage } from "element-plus";
import { useGlobal } from "@pureadmin/utils";
// import { useI18n } from "vue-i18n";
import { useUserStoreHook } from "/@/store/modules/user";
import { useAppStoreHook } from "/@/store/modules/app";
import { copyText } from "/@/utils";
import { emitter } from "/@/utils/mitt";
import { toAscii } from "/@/utils/connex";
import ERC20 from "/@/contractCall/ERC20";
import { userCheckCode } from "/@/api/user";

const { $connex, $dAccount } = useGlobal<GlobalPropertiesApi>();
// const { t } = useI18n();

//
import AddressDropdown from "/@/components/AddressDropdown/index.vue";
import regNameDialog from "./reg-name-dialog.vue";
import viewDialog from "./view-dialog.vue";
// Assets
import daccount from "/@/assets/img/daccount.png";
import cardVip from "/@/assets/img/cardVip.png";
import nv_card from "/@/assets/img/nv_card.png";
// import vet from "/@/assets/img/token/vet.svg?component";
import vetWhite from "/@/assets/img/token/vet-white-logo.png";
import crown from "/@/assets/crown.png";
//
const userStoreHook = useUserStoreHook();
//
const currentPage2 = computed(() => {
  return userStoreHook.dAccount.currentPage;
});

const myAddr = computed(() => {
  return userStoreHook.dAccount.myAddr;
});

const myName = computed(() => {
  return userStoreHook.dAccount.name;
});

const lv1Count = computed(() => {
  return userStoreHook.dAccount.lv1Count;
});

const lv2Count = computed(() => {
  return userStoreHook.dAccount.lv2Count;
});

const invitationLink = computed(() => {
  return `https://vefam.com/#/account?vip=${userStoreHook.dAccount.name}`;
});

const loading = ref(false);
const regNameDialogEl = ref(null);
const viewDialogEl = ref(null);
let timeout01 = null;
const bytes32ofNull =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const cAccountColor = ref("#fa8914");
const cAccountStatus = ref("no link yet");

function onchangeLayout2() {
  userStoreHook.dAccount.currentPage++;
  if (userStoreHook.dAccount.currentPage > 3)
    userStoreHook.dAccount.currentPage = 1;
  emitter.emit("connectWallet");
}
function onchangeLayout3() {
  // console.log(`Load balanceOf----------------`, regNameDialogEl);
  regNameDialogEl.value.open();
  return;
  /* userStoreHook.dAccount.currentPage++;
  if (userStoreHook.dAccount.currentPage > 3)
    userStoreHook.dAccount.currentPage = 1;
  console.log("myAddr0------", myAddr);
  new ERC20("0x8C1d95e96b69941b1b81145D2f2A100E7D259880", $connex)
    .balanceOf(myAddr.value)
    .then(result => {
      console.log(`Load balanceOf----------------`, result);
    })
    .catch(e => {
      console.log(`Load balanceOf----------------- error`, e);
    }); */

  //
}

function showVIPRegDialog() {
  regNameDialogEl.value.open();
}
function showViewDialog() {
  viewDialogEl.value.open();
}

function registerSuccess() {
  getVIPInfosxAddress();
}

//
function getPlayerInfos() {
  if (!myAddr.value) return;
  loading.value = true;
  $dAccount.getPlayer(myAddr.value).then(result => {
    console.log("getPlayer", result);
    if (result.code !== bytes32ofNull) {
      userStoreHook.dAccount.linkedCode = result.code;
      _userCheckCode(result.code);
    } else {
      loading.value = false;
    }
  });
}

//
function _userCheckCode(code: string) {
  cAccountStatus.value = "loading...";
  cAccountColor.value = "#fa8914";
  let stage = 0; // 0:error, 1: null | ok
  userCheckCode({ code })
    .then(result => {
      console.log("userCheckCode-result", result);
      if (result.data && result.data.user) {
        stage = 1;
        if (result.data.user.username) {
          cAccountStatus.value = `${result.data.user.username}`;
          cAccountColor.value = "#ffff00";
        } else {
          cAccountStatus.value = "no link yet";
        }
      }
    })
    .catch(error => {
      console.error(error);
    })
    .finally(() => {
      console.log("stage", stage);
      loading.value = false;
      if (stage === 0) {
        cAccountStatus.value = "data retrieval error";
        cAccountColor.value = "#ff5d5a";
      }
    });
}

//
function getVIPInfosxAddress() {
  if (!myAddr.value) return;
  loading.value = true;
  $dAccount.getVIPInfosxAddress(myAddr.value).then(result => {
    // console.log("getVIPInfosxAddress", result);
    loading.value = false;
    if (result.name) {
      userStoreHook.dAccount.name = toAscii(result.name).replace(/ /g, "");
      userStoreHook.dAccount.lv1Count = result.lv1Count;
      userStoreHook.dAccount.lv2Count = result.lv2Count;
      userStoreHook.dAccount.referReward = result.referReward;
      getPlayerInfos();
    } else {
      console.error("Get VIP infos error!");
    }
  });
}

//
watch(myAddr, newVal => {
  // console.log("watch myAddr-----------------", newVal);
  getVIPInfosxAddress();
  // const clauses = $dAccount.registerNameXName("k", "s", "0");
  // console.log(`DAccount-----------------`, clauses);
  // $connex.vendor.sign('tx', [clauses]).signer(myAddr.value).request();
});
//

//
onMounted(() => {
  // console.log("onMounted-----------------");
  const pass = Date.now() - useAppStoreHook().started;
  if (pass < 1500) {
    loading.value = true;
    timeout01 = setTimeout(getVIPInfosxAddress, 1500 - pass);
  } else {
    getVIPInfosxAddress();
  }
});

onBeforeUnmount(() => {
  clearTimeout(timeout01);
});
</script>

<template>
  <el-card>
    <!-- layout3 -->
    <div class="card-main">
      <div class="card-title">
        <el-image :src="daccount" fit="cover" />
      </div>
      <div class="d-account-info">
        <span v-if="!myAddr">
          Address:
          <span style="color: #fa8914">please connect wallet</span>
        </span>
        <span v-else>
          Address:
          <el-dropdown popper-class="addressDropdown-arrow">
            <span class="el-dropdown-link">
              <el-link style="color: #45bbff">{{ myAddr }}</el-link>
            </span>
            <template #dropdown>
              <AddressDropdown title="View address" :account-address="myAddr" />
            </template>
          </el-dropdown>
        </span>
        <p>
          Link with C-Account:
          <span v-if="currentPage2 === 3" style="color: #45bbff"
            >Muhamad Ramdani</span
          >
          <span v-else :style="{ color: cAccountColor }">{{
            cAccountStatus
          }}</span>
        </p>
      </div>
      <div class="card-vip">
        <div class="card-box">
          <el-image :src="cardVip" fit="cover">
            <template #placeholder>
              <div class="loader">
                <div class="inner one" />
                <div class="inner two" />
                <div class="inner three" />
              </div>
            </template>
          </el-image>

          <div class="card-top">
            <div v-if="myAddr === ''" class="card-info1">
              <div class="symbol">
                <!-- <vet class="icon" /> -->
                <el-image style="width: 50%; height: 50%" :src="vetWhite" />
              </div>
              <p />
              <div class="nv-card">
                <el-image :src="nv_card" fit="cover" />
              </div>
            </div>
            <div v-else class="card-info2">
              <div>
                Name:
                <span v-if="myName">
                  <el-link @click="showVIPRegDialog" style="color: #01e7f1">{{
                    myName
                  }}</el-link>
                </span>
                <span v-else style="color: rgb(250, 137, 20)"
                  >not registered yet
                </span>
              </div>
              <div>
                My rewards:
                <span v-if="myName">
                  <el-button
                    @click="showViewDialog"
                    class="btn-view"
                    size="small"
                  >
                    View
                  </el-button>
                </span>
                <span v-else style="color: rgb(255 196 16)">
                  Register to see your rewards
                </span>
              </div>
            </div>
          </div>
          <!-- end: card-top -->

          <div class="card-bottom">
            <div v-if="myName" class="card-info3">
              <div class="crown">
                <div class="crown_item">
                  <div class="item_image">
                    <el-image :src="crown" />
                  </div>
                  <p class="item_text_lb">Number of Lv. 1 invitations</p>
                  <p class="item_text">{{ lv1Count }}</p>
                </div>
              </div>
              <div class="crown">
                <div class="crown_item">
                  <div class="item_image">
                    <el-image :src="crown" />
                  </div>
                  <p class="item_text_lb">Number of Lv. 2 invitations</p>
                  <p class="item_text">{{ lv2Count }}</p>
                </div>
              </div>
            </div>
            <div v-else class="card-btn">
              <el-button
                v-if="myAddr"
                :loading="loading"
                @click="onchangeLayout3"
              >
                Register VIP now
              </el-button>
              <el-button v-else @click="onchangeLayout2">
                <IconifyIconOnline
                  icon="uil:wallet"
                  style="margin-right: 5px"
                />
                Connect Wallet
              </el-button>
            </div>
          </div>
          <!-- end: card-bottom -->
        </div>
        <!-- end: card-box -->
      </div>
      <!-- end: card-vip -->

      <div v-if="myName" class="share-link-bottom">
        <div class="item-inside">
          <el-row :gutter="20">
            <el-col :span="16">
              <span class="text-link">Personal invitation link:</span>
              <br />
              <el-link style="color: #84a3bf" @click="showVIPRegDialog">{{
                invitationLink
              }}</el-link>
            </el-col>
            <el-col :span="8">
              <el-button @click="copyText(invitationLink)" class="btn-copy">
                Copy
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="register-bulletedList">
        <div class="description">
          <svg
            width="13"
            height="23"
            viewBox="0 0 13 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-8.6849e-08 11.5L6.31371 0.186292L12.6274 11.5L6.31371 22.8137L-8.6849e-08 11.5Z"
              fill="#D9D9D9"
            />
          </svg>
          <p>Register VeFam VIP to invite friends and get rewards</p>
        </div>
        <div class="description">
          <svg
            width="13"
            height="23"
            viewBox="0 0 13 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-8.6849e-08 11.5L6.31371 0.186292L12.6274 11.5L6.31371 22.8137L-8.6849e-08 11.5Z"
              fill="#D9D9D9"
            />
          </svg>
          <p>30% of the membership fee used as a rebate reward</p>
        </div>
        <div class="description">
          <svg
            width="13"
            height="23"
            viewBox="0 0 13 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-8.6849e-08 11.5L6.31371 0.186292L12.6274 11.5L6.31371 22.8137L-8.6849e-08 11.5Z"
              fill="#D9D9D9"
            />
          </svg>
          <p>Connect with C-Account to join the games</p>
        </div>
      </div>
    </div>
  </el-card>
  <reg-name-dialog ref="regNameDialogEl" @register-success="registerSuccess" />
  <viewDialog ref="viewDialogEl" />
</template>

<style lang="scss" scoped>
// media -----------------------
@media only screen and (max-width: 900px) {
  .el-card .card-main {
    .register-bulletedList {
      display: block;

      .description:not(:first-child) {
        margin-left: 0;
      }
    }
  }
}
@media screen and (max-width: 600px) {
  .el-card .card-main .card-vip .card-box {
    .card-info1 {
      .symbol {
        width: 35px;
        height: 35px;

        & svg {
          transform: translate(2px, 2px);
        }
      }

      .nv-card .el-image {
        width: 50px;
      }
    }

    .card-info2 {
      font-size: 16px;
      line-height: 180%;
    }
  }
}
@media only screen and (max-width: 526px) {
  .el-card .card-main .card-vip .card-box {
    .card-info1 {
      .symbol {
        width: 30px;
        height: 30px;
        margin-left: 5px;
      }

      .nv-card .el-image {
        width: 35px;
      }
    }

    .card-info2 {
      font-size: 15px;
      line-height: 170%;
    }

    .card-bottom {
      .el-button {
        padding: 20px;

        :deep(span) {
          font-size: 15px;
        }
      }
    }
  }
}
@media only screen and (max-width: 480px) {
  .el-card .card-main {
    padding: 15px;

    .card-vip .card-box {
      .card-info2 {
        font-size: 13px;
        line-height: 160%;

        & button.el-button.el-button--mini {
          height: 28px;
          padding: 0px 10px;
        }
      }

      .card-bottom {
        .card-info3 {
          font-size: 14px;

          .crown:first-child {
            margin-bottom: 10px;
          }

          .item_image {
            width: 20px;
          }
        }
      }
    }

    .register-bulletedList {
      font-size: 15px;
    }
  }
}
@media only screen and (max-width: 420px) {
  .el-card .card-main {
    .card-vip .card-box {
      .card-bottom {
        .card-info3 {
          font-size: 12px;
          margin-bottom: -5px;

          .item_image {
            width: 15px;
          }

          .item_text_lb {
            padding: 0px 8px;
          }
        }
      }
    }
  }
}
@media only screen and (max-width: 400px) {
  .el-card .card-main {
    padding: 10px;

    .card-vip .card-box {
      .card-info1 {
        .symbol {
          width: 25px;
          height: 25px;
          margin-left: 5px;
        }

        .nv-card .el-image {
          width: 30px;
        }
      }

      .card-info2 {
        width: 85%;
        font-size: 12px;

        & button.el-button.el-button--mini {
          height: 24px;
        }
      }

      .card-bottom {
        .el-button {
          padding: 16px;

          :deep(span) {
            font-size: 14px;
          }
        }

        .card-info3 {
          .crown:first-child {
            margin-bottom: 5px;
          }
        }
        .card-btn {
          .el-button {
            padding: 5px;
          }
        }
      }
    }

    .register-bulletedList {
      font-size: 14px;
    }
  }
}

.el-card {
  border: unset;
  background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
  padding: 1px;
  border-radius: 12px;

  :deep(.el-card__body) {
    padding: 0px;
  }

  .card-main {
    width: 100%;
    height: 100%;
    background: #171b33;
    padding: 20px;
    border-radius: 12px;
    color: #ffff;

    .d-account-info {
      margin-bottom: 32px;
      text-align: center;
      word-break: break-all;
      line-height: 120%;

      p {
        padding-bottom: 5px;
      }
    }

    .card-vip {
      display: flex;
      justify-content: center;
      margin-bottom: 32px;

      .card-box {
        width: 100%;
        max-width: 600px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .card-top {
          width: 100%;
          height: 66%;
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          top: 0;
        }

        .card-info1 {
          width: 80%;
          height: 30%;
          background: rgba(0, 0, 0, 0.21);
          backdrop-filter: blur(16px);
          border-radius: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          & p {
            flex-grow: 1;
            padding-left: 10px;
          }

          .symbol {
            width: 9%;
            height: 66%;
            background: linear-gradient(
              109.58deg,
              #00f6ff 0.96%,
              #a370ff 61.33%
            );
            border-radius: 50px;
            margin-left: 10px;
            display: flex;
            justify-content: center;
            align-items: center;

            & svg {
              transform: translate(8px, 10px);
              vertical-align: middle;
            }
          }

          .nv-card {
            .el-image {
              max-width: 60px;
            }
          }
        }

        .card-info2 {
          width: 80%;
          line-height: 200%;

          & button.el-button.el-button--small {
            background: linear-gradient(
              94.9deg,
              #00f6ff 0%,
              #5d7eff 48.44%,
              #5429a0 100%
            );
            height: 26px;
            border-radius: 8px;
            border: none;
            color: #fff600;
            transition: all 0.3s ease-out;
            opacity: 0.8;

            &:hover {
              opacity: 1;
            }
          }
        }

        .card-bottom {
          width: 100%;
          height: 46%;
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          bottom: 0;

          .card-btn {
            width: 70%;
            max-width: 420px;
          }

          .el-button {
            width: 100%;
            // padding: 25px;
            background: linear-gradient(
              94.9deg,
              #00f6ff 0%,
              #5d7eff 48.44%,
              #5429a0 100%
            );
            opacity: 0.8;
            border-radius: 56px;
            border: unset;
            transition: 0.5s ease-out;
            &:hover {
              opacity: 1;
            }

            :deep(span) {
              color: #ffffff;
              font-weight: 700;
              font-size: 16px;
            }
            :deep(.el-icon) {
              color: #ffffff;
            }
          }

          .card-info3 {
            width: 85%;
            max-width: 480px;

            .crown:first-child {
              margin-bottom: 15px;
            }

            .crown {
              background-image: linear-gradient(
                to right,
                #00f6ff,
                #5d7eff,
                #a370ff
              );
              padding: 1px;
              border-radius: 12px;

              .crown_item {
                background: #171b33;
                padding: 5px 10px 2px 5px;
                border-radius: 12px;
                display: flex;
                justify-content: center;
                align-items: center;

                .item_text_lb {
                  flex-grow: 1;
                  padding: 0px 10px;
                  color: #84a3bf;
                }

                .item_text {
                  font-weight: bold;
                }
              }
            }
          }
        }
      }
    }

    .share-link-bottom {
      display: flex;
      justify-content: center;
      margin-bottom: 32px;
      .item-inside {
        display: flex;
        justify-content: center;
        border: 1px solid #7f75fb;
        border-radius: 15px;
        padding: 15px;
        max-width: 550px;
        width: 100%;
      }
      .el-row {
        align-items: center;
        width: 100%;
      }
      .el-col-8 {
        display: flex;
        justify-content: flex-end;
      }
      .text-link {
        font-size: clamp(12px, 4vw, 16px);
      }
      .btn-copy {
        display: inline-block;
        position: sticky;
        background-color: rgba(255, 255, 255, 0);
        border: none;
        // padding: 15px 25px;
        color: #b1c2f1;
        text-decoration: none;
        &:before {
          position: absolute;
          z-index: -1;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          content: "";
          background: #242b57;
          width: 100%;
          height: 100%;
          transition: 0.2s;
          -webkit-backface-visibility: hidden;
        }
        &:before {
          -webkit-transform: skewX(-20deg);
          -moz-transform: skewX(-20deg);
          -ms-transform: skewX(-20deg);
          transform: skewX(-20deg);
        }

        &:hover:before {
          -webkit-transform: skewX(0deg);
          -moz-transform: skewX(0deg);
          -ms-transform: skewX(0deg);
          transform: skewX(0deg);
          background: #434b8d;
        }
      }
    }

    .register-bulletedList {
      padding: 20px 0;
      display: flex;
      justify-content: space-evenly;
      color: #01e7f1;

      .description {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        & svg {
          margin-right: 8px;
        }
      }

      .description:not(:first-child) {
        margin-left: 20px;
      }
    }
  }
}
</style>
