<script setup lang="ts">
import { ref, computed } from "vue";
import * as copy from "copy-to-clipboard";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import { useUserStoreHook } from "/@/store/modules/user";
import Picasso from "/@/components/Picasso/index.vue";
import Address from "/@/components/Address/index.vue";
import Symbol from "/@/components/symbol/index.vue";
// Assets
import vetImg from "/img/tokens/vet.svg";
import vpuImg from "/img/tokens/vpu.png";

const { t } = useI18n();

let dropdownCAccount = ref(null);

const userName = computed(() => {
  return useUserStoreHook().cAccount.userName;
});

const linkedAddr = computed(() => {
  return useUserStoreHook().cAccount.linkedAddr;
});

function logIn() {
  const name = Math.random().toString();
  useUserStoreHook().SET_CACCOUNT(
    name,
    "eyJhbGciOiJIUzUxMiJ9.test",
    "0xb568710F69c8A8e1795FF822ebcD3Dfc7A27F979"
  );
}

function logOut() {
  dropdownCAccount.value.handleClose();
  useUserStoreHook().SET_CACCOUNT("", "", "");
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
      <IconifyIconOnline v-if="!userName" icon="ic:outline-account-circle" />
      <Picasso v-else style="border-radius: 50%" :value="userName" />
    </span>
    <template #dropdown>
      <el-dropdown-menu v-if="!userName" class="dropdown-type1">
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
                      :value="userName"
                    />
                    <div class="user-name">{{ userName }}</div>
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
              style="border-bottom: 1px solid #ffffff1c"
              class="dropdown-items-manage"
            >
              <div>Manage</div>
            </el-dropdown-item>
          </router-link>
          <router-link :to="'/account/profile'">
            <el-dropdown-item class="dropdown-items-profile">
              <div>Porofile</div>
            </el-dropdown-item>
          </router-link>
        </div>
        <div class="account-money">
          <el-row style="margin-top: 10px">
            <el-col :span="12"> Balance </el-col>
            <el-col :span="11" style="text-align: right">
              <!-- <el-link>View more</el-link> -->
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 5px">
            <el-col :span="7">VET:</el-col>
            <el-col style="text-align: end" :span="13">0.00</el-col>
            <el-col :span="2">
              <Symbol :src="vetImg" :size="20" />
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 5px">
            <el-col :span="7">VPU:</el-col>
            <el-col style="text-align: end" :span="13">0.00</el-col>
            <el-col :span="2">
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
