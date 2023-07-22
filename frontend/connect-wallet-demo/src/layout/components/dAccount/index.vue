<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStoreHook } from "/@/store/modules/user";
import Picasso from "/@/components/Picasso/index.vue";
import Address from "/@/components/Address/index.vue";
import Amount from "/@/components/Amount/index.vue";
import Symbol from "/@/components/symbol/index.vue";
import { copyText } from "/@/utils";
import { emitter } from "/@/utils/mitt";
import { getExplorers } from "/@/settings";
import {
  wagmiHandleConnect,
  wagmiHandleDisconnect
} from "/@/utils/wagmiWallet";
import { web3modal } from "/@/utils/walletconect";
import vetImg from "/img/tokens/vet.svg";
import vthoImg from "/img/tokens/vtho.svg";
const { t } = useI18n();
const explorers = getExplorers();
const dialogMultiWallet = ref(false);
let dropdownDAccount = ref(null);

const textActive = ref("Ethereum");
const renderObjWallets = ref([]);

const arrayNetwork = ["Ethereum", "VeChain", "BNBChain"];
const objWallets = [
  {
    name: "Sync2",
    typeNetwork: "VeChain",
    image:
      "data:image/png;base64,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"
  },
  {
    name: "MetaMask",
    typeNetwork: "Ethereum,BNBChain",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png"
  },
  {
    name: "Coinbase Wallet",
    typeNetwork: "Ethereum,BNBChain",
    image:
      "https://is1-ssl.mzstatic.com/image/thumb/Purple114/v4/23/b8/87/23b8872a-be21-7fb6-d084-a81fffe7dcfd/AppIcon-0-0-1x_U007emarketing-0-0-0-5-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1024x1024bb.png"
  },
  {
    name: "Wallet Connect",
    typeNetwork: "Ethereum,BNBChain",
    image: "https://walleth.org/assets/img/walletconnect.jpg"
  },
  {
    name: "Binance Chain Wallet",
    typeNetwork: "Ethereum,BNBChain",
    image:
      "https://public.bnbstatic.com/20190405/eb2349c3-b2f8-4a93-a286-8f86a62ea9d8.png"
  },
  {
    name: "Ledger",
    typeNetwork: "BNBChain",
    image:
      "https://static.techspot.com/images2/downloads/topdownload/2016/05/pendrive.png"
  }
];

const myAddr = computed(() => {
  return useUserStoreHook().dAccount.myAddr;
});

const myVET = computed(() => {
  return useUserStoreHook().dAccount.VET;
});
const myVTHO = computed(() => {
  return useUserStoreHook().dAccount.VTHO;
});

function handleSelectNetWork(type: string): void {
  textActive.value = type;
  const fillterObj = objWallets.filter(item => item.typeNetwork.includes(type));
  renderObjWallets.value = fillterObj;
}

function connectWallet() {
  // emitter.emit("connectWallet");
  dialogMultiWallet.value = true;
}

async function openConnect(typeWallet?: string) {
  switch (typeWallet) {
    case "Sync2":
      emitter.emit("connectWallet");
      break;
    case "MetaMask":
      wagmiHandleConnect(0);
      break;
    case "Coinbase Wallet":
      wagmiHandleConnect(1);
      break;
    case "Wallet Connect":
      web3modal.openModal({ route: "ConnectWallet" });
      break;
    case "Ledger":
      wagmiHandleConnect(2);
      break;
  }
  dialogMultiWallet.value = false;
  wagmiHandleDisconnect();
  useUserStoreHook().RESET_DACCOUNT();
}

function changeAccount() {
  dialogMultiWallet.value = true;
  dropdownDAccount.value.handleClose();
}

function logOut() {
  dropdownDAccount.value.handleClose();
  useUserStoreHook().RESET_DACCOUNT();
  wagmiHandleDisconnect();
}

onMounted(() => {
  if (textActive.value) {
    const fillterObj = objWallets.filter(item =>
      item.typeNetwork.includes(textActive.value)
    );
    renderObjWallets.value = fillterObj;
  }
});
</script>

<template>
  <el-dropdown
    :visible-arrow="false"
    ref="dropdownDAccount"
    trigger="click"
    placement="bottom-end"
    popper-class="dAccount-arrow"
  >
    <span class="dropdown-account navbar-bg-hover select-none">
      <!-- ep:wallet-filled -->
      <IconifyIconOnline
        icon="material-symbols:account-balance-wallet-outline"
      />
    </span>
    <template #dropdown>
      <el-dropdown-menu v-if="!myAddr" class="dropdown-type1">
        <div class="dropdown-daccount1">
          <!-- <router-link :to="'/account'"> -->
          <el-dropdown-item @click="connectWallet">
            <div>
              <IconifyIconOnline
                icon="ri-login-circle-line"
                style="margin: 5px"
              />
              {{ t("buttons.hsConnectWallet") }}
            </div>
          </el-dropdown-item>
          <!-- </router-link> -->
        </div>
      </el-dropdown-menu>
      <el-dropdown-menu v-else class="dropdown-type1">
        <div class="dropdown-menu-cont">
          <el-row align="middle" justify="space-between">
            <el-col :span="10">
              <h1 style="font-size: 16px">D-Account</h1>
            </el-col>
            <el-col :span="10" style="text-align: right">
              <el-button @click="logOut" class="btn-disconect">
                <IconifyIconOnline icon="fa-solid:power-off"
              /></el-button>
            </el-col>
          </el-row>
          <div class="account-info">
            <el-row
              :gutter="20"
              align="middle"
              justify="space-between"
              style="margin-top: 10px"
            >
              <el-col :span="16">
                <el-row align="middle">
                  <div>
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        font-size: 16px;
                      "
                    >
                      <Picasso
                        class="hidden-md-and-up"
                        style="
                          margin-right: 12px;
                          width: 32px;
                          height: 32px;
                          border-radius: 50%;
                        "
                        :value="myAddr"
                      />
                      <Address
                        style="font-size: 16px; color: #ffffffc2"
                        :addr="myAddr"
                      />
                      <IconifyIconOnline
                        icon="ep:copy-document"
                        class="icon-copy"
                        @click="copyText(myAddr)"
                      />
                    </div>
                  </div>
                </el-row>
              </el-col>
              <el-col :span="8" style="text-align: right">
                <div class="border-btn-change">
                  <el-button
                    type="primary"
                    size="small"
                    plain
                    round
                    class="btn-change"
                    @click="changeAccount"
                    >Change</el-button
                  >
                </div>
              </el-col>
              <el-col style="margin-top: 15px" :span="24">
                <el-link
                  v-for="exp in explorers"
                  :underline="false"
                  class="link-type01"
                  target="_blank"
                  rel="noopener"
                  :href="exp.accounts + myAddr"
                >
                  <IconifyIconOnline
                    icon="fa-solid:link"
                    style="margin-right: 5px"
                  />
                  View on {{ exp.name }}
                </el-link>
              </el-col>
            </el-row>
          </div>
        </div>
        <div style="margin-top: 10px">
          <router-link :to="'/account?scrollto=d-account'">
            <el-dropdown-item
              style="border-bottom: 1px solid rgb(35 44 86)"
              class="dropdown-items-manage"
            >
              Manage
            </el-dropdown-item>
          </router-link>
          <router-link :to="'/account/profile'">
            <el-dropdown-item class="dropdown-items-profile">
              Profile
            </el-dropdown-item>
          </router-link>
        </div>
        <div class="account-money">
          <el-row style="margin: 6px 0 12px 0">
            <el-col :span="12">On chain</el-col>
            <el-col :span="12" style="display: flex; justify-content: flex-end">
              <el-link type="primary" href="#/account/wallet">
                View more &#187;
              </el-link>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 5px">
            <el-col :span="7">VET:</el-col>
            <el-col style="text-align: end" :span="13">
              <Amount :balance="myVET" />
            </el-col>
            <el-col :span="2">
              <Symbol :src="vetImg" :size="20" />
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 5px">
            <el-col :span="7">VTHO:</el-col>
            <el-col style="text-align: end" :span="13">
              <Amount :balance="myVTHO" :precision="10" />
            </el-col>
            <el-col :span="2">
              <Symbol :src="vthoImg" :size="20" />
            </el-col>
          </el-row>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <el-dialog
    v-model="dialogMultiWallet"
    title="Connect Wallet"
    custom-class="modalNetwork"
  >
    <p class="options">Select Network</p>
    <div class="table-options">
      <el-button
        v-for="item in arrayNetwork"
        :key="item"
        :style="{ 'background-color': textActive === item ? '#151c25' : '' }"
        @click="handleSelectNetWork(item)"
        >{{ item }}</el-button
      >
    </div>
    <p class="options">Choose Your Wallet</p>
    <div class="table-wallet">
      <div v-for="item in renderObjWallets" :key="item.name" class="wallet">
        <el-button class="wallet-item" @click="openConnect(item.name)">
          <el-image style="border-radius: 50%" :src="item.image" />
        </el-button>
        <p class="nameWallet">
          {{ item.name }}
        </p>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.dAccount-arrow {
  .el-popper__arrow::before {
    visibility: hidden;
  }
}
.ant-tabs-dropdown {
  z-index: 2900 !important;
}

.el-popper.is-light {
  background-color: #003a8c00 !important;
}

// .el-dropdown__popper.el-popper[data-popper-placement^="bottom"]
//   .el-popper__arrow::before {
//   // background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
//   // border-bottom: transparent !important;
//   // border: none;
//   visibility: hidden;
//   pointer-events: none;
// }

.modalNetwork {
  max-width: 95%;
  width: 420px;
  background-color: #33363f;
  border-radius: 5px;
  border: none;
  .el-dialog__title {
    color: #ffff;
  }
  .options {
    font-size: 15px;
    font-weight: 600;
    color: #ffffffd2;
  }
  .table-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    // grid-template-rows: 100px 100px;
    justify-content: space-between;
    grid-gap: 10px;
    padding: 20px 0px 20px 0px;
    .el-button {
      margin-left: 0;
      background-color: #484a53;
      border: none;
      color: #ffff;
      font-weight: 600;
      &:hover {
        background-color: #585a62;
      }
    }
  }
  .table-wallet {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-content: center;

    grid-gap: 20px;
    padding: 20px 0px 20px 0px;
    .wallet {
      display: inline-flex;
      align-items: center;
      user-select: none;
      flex-direction: column;
      color: rgb(255, 255, 255);
      .wallet-item {
        position: relative;
        user-select: none;
        margin-left: 0;
        background-color: #484a53;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        border: none;

        &:hover {
          background-color: #585a62;
        }
        .icon-svg {
          & svg {
            width: 35px;
            height: 35px;
          }
        }
      }
    }
    .nameWallet {
      width: 100px;
      text-align: center;
    }
  }
}
</style>

<style lang="scss" scoped>
.dropdown-daccount1 {
  border-radius: 10px;

  :deep(.el-dropdown-menu__item) {
    border-radius: 10px;
  }
}

.dropdown-menu-cont {
  width: 290px;
  border-radius: 10px;
  padding: 10px;
}

.btn-disconect {
  // background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
  border: 0px solid rgb(56 68 130);
  color: rgb(214, 214, 214);
  font-size: 18px;
  background-color: rgba(0, 0, 0, 0);
  width: 38px;

  &:hover {
    border: 2px solid rgb(56 68 130);
    align-items: center;
    color: #4999ff;
  }
}
.el-col-8 {
  flex: unset;
}
.border-btn-change {
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
  background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
  padding: 2px;
  // width: 84%;
  display: flex;
  justify-content: center;
  border-radius: 20px;
  text-align: center;
  position: relative;

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
}

.btn-change {
  background-color: #293366;
  border: none;
  color: #fff;
}

.icon-copy {
  color: #fff !important;
  margin-left: 5px;
  cursor: pointer;

  &:hover {
    color: #4999ff !important;
  }
}

.dropdown-items-profle {
  background-color: rgba(0, 0, 0, 0.25) !important;
}

:deep(.el-dropdown-menu__item) {
  background-color: rgb(24 30 61) !important;
  color: #fff;
  transition: all 0.2s linear 0s;

  &:before {
    content: "\f105";
    font-family: FontAwesome;
    position: relative;
    top: 0;
    left: 0px;
    height: 100%;
    width: 5px;
    background-color: rgb(24 30 61);
    border-radius: 0 50% 50% 0;
    transform: scale(0, 1);
    transform-origin: left center;
    transition: all 0.1s linear 0s;
  }

  &:hover {
    // text-indent: 10px;
    &:before {
      transform: scale(1, 1);
      // text-indent: 0;
    }
  }
}

.account-money {
  padding: 10px;
  font-size: 14px;
}

.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 40px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}

.horizontal-header .horizontal-header-right .dropdown-badge {
  width: 36px;
}

.layout-theme-default
  body[layout="horizontal"]
  .horizontal-header
  .horizontal-header-right
  .dropdown-badge {
  color: #ffffff;
  font-size: 19px;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0;
}
</style>
