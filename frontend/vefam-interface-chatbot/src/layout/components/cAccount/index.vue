<script setup lang="ts">
import { ref, computed } from "vue";
import * as copy from "copy-to-clipboard";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { useAppStoreHook } from "/@/store/modules/app";
import { useUserStoreHook } from "/@/store/modules/user";
import { userGetInfo } from "/@/api/user";
//
import Picasso from "/@/components/Picasso/index.vue";
import Address from "/@/components/Address/index.vue";
import Symbol from "/@/components/symbol/index.vue";
import Amount from "/@/components/Amount/index.vue";
// Assets
import vetImg from "/img/tokens/vet.svg";
import vpuImg from "/img/tokens/vpu.png";

const { t } = useI18n();
const userStoreHook = useUserStoreHook();

let dropdownCAccount = ref(null);

// có accessToken <=> đã login
const accessToken = computed(() => {
  return userStoreHook.cAccount.accessToken;
});
const displayName = computed(() => {
  return userStoreHook.cAccount.displayName;
});
const secretName = computed(() => {
  return userStoreHook.cAccount.secretName;
});
const linkedAddr = computed(() => {
  return userStoreHook.cAccount.linkedAddr;
});

const cVET = computed(() => {
  return useAppStoreHook().cAccVET;
});

const cVPU = computed(() => {
  return useAppStoreHook().cAccVPU;
});

if (accessToken.value) {
  userStoreHook.setCAccountPage(2);
  userStoreHook.setCAccountStage(1); // 0: chưa fetch, 1: đang fetch, 2: đã fetch
  // console.log("userGetInfo-accessToken:", accessToken.value);
  userGetInfo(accessToken.value)
    .then(result => {
      // console.log("userGetInfo-result:", result);
      // return;
      const data = result.data;
      if (data.user) {
        const user = data.user;
        if (data.accessToken && data.accessToken.token) {
          userStoreHook.loggedCAccount(data.accessToken.token, user.displayName);
        }
        // displayName, username, email, tempCode, linkedCode, linkedAddr, role
        userStoreHook.updateCAccount(
          user.displayName,
          user.local ? user.local.username : "",
          user.local ? user.local.email : "",
          user.dAccount ? user.dAccount.tempCode : "",
          user.dAccount ? user.dAccount.linkedCode : "",
          user.dAccount ? user.dAccount.address : "",
          user.role ? user.role : []
        );
        useAppStoreHook().takeUserBalance();
      } else if (data.errorMess.length) {
        userStoreHook.logOut();
      }
      userStoreHook.setCAccountStage(0);
    })
    .catch(error => {
      console.error(error);
      userStoreHook.logOut();
      userStoreHook.setCAccountStage(0);
    });
}

// demo login
function logIn() {
  const name = Math.random().toString();
  userStoreHook.loggedCAccount("eyJhbGciOiJIUzUxMiJ9.testToken", name);
  // username, tempCode, linkedCode, address, role
  userStoreHook.updateCAccount(name, "", "", "");
}

function logOut() {
  dropdownCAccount.value.handleClose();
  userStoreHook.logOut();
}

function copyText(mss: string) {
  copy(mss);
  ElMessage({
    message: t("message.copySuccessfully"),
    type: "success",
    duration: 1000
  });
}
</script>

<template>
  <el-dropdown
    :visible-arrow="false"
    ref="dropdownCAccount"
    trigger="click"
    placement="bottom-end"
    popper-class="cAccount-arrow"
  >
    <span class="dropdown-account navbar-bg-hover select-none">
      <!-- fa:user-circle, ri-user-line -->
      <IconifyIconOnline v-if="!accessToken" icon="ic:outline-account-circle" />
      <Picasso v-else style="border-radius: 50%" :value="displayName" />
    </span>
    <template #dropdown>
      <el-dropdown-menu v-if="!accessToken" class="dropdown-type1">
        <div class="dropdown-login">
          <router-link :to="'/account'">
            <el-dropdown-item
              ><!-- @click="logIn" -->
              <div>
                <IconifyIconOnline
                  icon="ri-login-circle-line"
                  style="margin: 5px"
                />
                {{ t("buttons.hslogin") }}
              </div>
            </el-dropdown-item>
          </router-link>
        </div>
      </el-dropdown-menu>
      <el-dropdown-menu v-else class="dropdown-type1">
        <div class="dropdown-menu-cont">
          <el-row align="middle" justify="space-between">
            <el-col :span="10">
              <h1 style="font-size: 16px">C-Account</h1>
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
                  <div
                    style="display: flex; align-items: center; font-size: 16px"
                  >
                    <Picasso
                      style="
                        margin-right: 12px;
                        width: 35px;
                        height: 35px;
                        border-radius: 50%;
                      "
                      :value="displayName"
                    />
                    <div>
                      <div class="user-name">{{ displayName }}</div>
                      <div class="secret-name">{{ secretName }}</div>
                    </div>
                  </div>
                </el-row>
              </el-col>
              <el-col>
                <el-row
                  :gutter="20"
                  align="middle"
                  justify="space-between"
                  style="margin-top: 20px; font-size: 16px"
                >
                  <el-col :span="20"
                    >Linked:
                    <Address
                      style="font-size: 16px; color: #ffffffc2"
                      :addr="linkedAddr"
                    />
                  </el-col>
                  <el-col :span="4" style="text-align: right">
                    <IconifyIconOnline
                      icon="ep:copy-document"
                      class="icon-copy"
                      @click="copyText(linkedAddr)"
                    />
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
        <div style="margin-top: 10px">
          <router-link :to="'/account'">
            <el-dropdown-item
              style="border-bottom: 1px solid rgb(35 44 86)"
              class="dropdown-items-manage"
            >
              <div>Manage</div>
            </el-dropdown-item>
          </router-link>
          <router-link :to="'/account/profile'">
            <el-dropdown-item class="dropdown-items-profile">
              <div>Profile</div>
            </el-dropdown-item>
          </router-link>
        </div>
        <div class="account-money">
          <el-row style="margin: 6px 0 12px 0">
            <el-col :span="12">Balance</el-col>
            <el-col :span="12" style="display: flex; justify-content: flex-end">
              <el-link type="primary" href="#/account/wallet">
                View more &#187;
              </el-link>
            </el-col>
          </el-row>
          <el-row :gutter="24" style="margin-top: 5px">
            <el-col :span="5">VET:</el-col>
            <el-col style="text-align: end; padding:0px;" :span="15">
              <Amount :balance="cVET" />
            </el-col>
            <el-col :span="4">
              <Symbol :src="vetImg" :size="20" />
            </el-col>
          </el-row>
          <el-row :gutter="24" style="margin-top: 5px">
            <el-col :span="5">VPU:</el-col>
            <el-col style="text-align: end; padding:0px;" :span="15">
              <Amount :balance="cVPU" />
            </el-col>
            <el-col :span="4">
              <Symbol :src="vpuImg" :size="20" />
            </el-col>
          </el-row>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss">
.ant-tabs-dropdown {
  z-index: 2900 !important;
}

.el-popper.is-light {
  background-color: #003a8c00 !important;
}
.cAccount-arrow {
  .el-popper__arrow::before {
    visibility: hidden;
  }
}

// .el-dropdown__popper.el-popper .el-popper__arrow {
//   display: none;
//   /*&::before {
//     // background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
//     // border-bottom: transparent !important;
//     // border: none;
//     visibility: hidden;
//     pointer-events: none;
//   }*/
// }
</style>

<style lang="scss" scoped>
.dropdown-login {
  border-radius: 10px;

  :deep(.el-dropdown-menu__item) {
    border-radius: 10px;
  }
}

.dropdown-menu-cont {
  width: 290px;
  border-radius: 10px;
  padding: 10px;

  .account-info {
    .user-name {
      width: 200px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .secret-name {
      font-size: 13px;
      color: #ffffff87;
    }
  }
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

.icon-copy {
  color: #fff !important;
  cursor: pointer;

  &:hover {
    color: #4999ff !important;
  }
}

.link-view {
  font-weight: lighter;
  color: #b2c8f4;

  &:hover {
    color: #4999ff;
  }
}

.dropdown-items-profle {
  background-color: rgba(0, 0, 0, 0.25) !important;
}

.account-money {
  padding: 10px;
  font-size: 14px;
}

.dropdown-badge {
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
  font-size: 18px;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0;
}
</style>
