<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStoreHook } from "/@/store/modules/user";
import Picasso from "/@/components/Picasso/index.vue";
import Address from "/@/components/Address/index.vue";
import Amount from "/@/components/Amount/index.vue";
import Symbol from "/@/components/symbol/index.vue";
import { copyText } from "/@/utils";
import { emitter } from "/@/utils/mitt";
import { getExplorers } from "/@/settings";

//
import vetImg from "/img/tokens/vet.svg";
import vthoImg from "/img/tokens/vtho.svg";

const { t } = useI18n();
const explorers = getExplorers();
const userStoreHook = useUserStoreHook();

let dropdownDAccount = ref(null);

const myName = computed(() => {
  return userStoreHook.dAccount.name;
});
const myAddr = computed(() => {
  return userStoreHook.dAccount.myAddr;
});

const myVET = computed(() => {
  return userStoreHook.dAccount.VET;
});
const myVTHO = computed(() => {
  return userStoreHook.dAccount.VTHO;
});

function connectWallet() {
  emitter.emit("connectWallet");
}

function changeAccount() {
  emitter.emit("connectWallet");
}

function logOut() {
  dropdownDAccount.value.handleClose();
  userStoreHook.RESET_DACCOUNT();
}
</script>

<template>
  <el-dropdown
    :visible-arrow="false"
    ref="dropdownDAccount"
    trigger="click"
    placement="bottom-end"
    popper-class="dAccount-arrow"
  >
    <span
      class="dropdown-account navbar-bg-hover select-none"
      :class="{ 'daccount-connected': myAddr }"
    >
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
                      <el-col>
                        <div style="display: inline-flex; align-items: center">
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
                        <div
                          v-if="myName"
                          style="
                            font-size: 13px;
                            color: #e4d53d;
                            font-weight: 500;
                          "
                        >
                          VIP membership
                        </div>
                        <!--  -->
                      </el-col>
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
                  :key="exp.txs"
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
              <el-link
                type="primary"
                href="#/account/wallet?tab=vechain-network"
              >
                View more &#187;
              </el-link>
            </el-col>
          </el-row>
          <el-row :gutter="24" style="margin-top: 5px">
            <el-col :span="5">VET:</el-col>
            <el-col :span="15" style="text-align: end; padding:0px;">
              <Amount :balance="myVET" />
            </el-col>
            <el-col :span="4">
              <Symbol :src="vetImg" :size="20" />
            </el-col>
          </el-row>
          <el-row :gutter="24" style="margin-top: 5px">
            <el-col :span="5" style="padding-right:0px;">VTHO:</el-col>
            <el-col :span="15" style="text-align: end; padding:0px;">
              <Amount :balance="myVTHO" :precision="10" />
            </el-col>
            <el-col :span="4">
              <Symbol :src="vthoImg" :size="20" />
            </el-col>
          </el-row>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
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
</style>

<style lang="scss" scoped>
.daccount-connected {
  color: rgb(255 255 255 / 89%) !important;
}
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
