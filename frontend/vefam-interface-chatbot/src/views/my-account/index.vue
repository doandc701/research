<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStoreHook } from "/@/store/modules/user";
import { emitter } from "/@/utils/mitt";

import Address from "/@/components/Address/index.vue";
import Picasso from "/@/components/Picasso/index.vue";
import AddressDropdown from "/@/components/AddressDropdown/index.vue";

import Collected from "./components/collected.vue";
import Favorited from "./components/favorited.vue";
import Activity from "./components/activity.vue";
import Offer from "./components/offer.vue";
import Listings from "./components/listings.vue";
import Staking from "./components/staking.vue";
import imaCover from "/@/assets/banner-my-profile.png";

defineOptions({
  name: "MyProfile"
});

const activeName = ref("first");
const myAddr = computed(() => {
  return useUserStoreHook().dAccount.myAddr;
});

function connectWallet() {
  emitter.emit("connectWallet");
}
</script>

<template>
  <div class="myaccount-container">
    <div class="top-banner-details">
      <el-image class="banner-details-image" :src="imaCover" fit="cover" />
    </div>
    <div class="header-content">
      <div class="avatar">
        <el-avatar
          v-if="!myAddr"
          class="avatar-circle"
          style="box-shadow: rgb(70 84 159) 0px 0px 15px 0px"
          :size="150"
          ><IconifyIconOnline
            class="none-user-avt"
            style="font-size: 150px; color: #ffffff24"
            icon="fa:user"
        /></el-avatar>
        <Picasso
          v-else
          class="picasso-avatar"
          style="width: 150px; border-radius: 50%"
          :value="myAddr"
        />
      </div>
    </div>
    <div class="name-gallery">
      <h3>Welcome!</h3>
      <el-tag v-if="!myAddr" class="btn-address">
        <el-row style="color: #fa8914" @click="connectWallet()">
          Please connect wallet
        </el-row>
      </el-tag>
      <el-dropdown v-else popper-class="addressDropdown-arrow">
        <span class="el-dropdown-link">
          <el-tag class="btn-address">
            <Address style="font-size: 16px" :addr="myAddr" />
          </el-tag>
        </span>
        <template #dropdown>
          <AddressDropdown title="View address" :account-address="myAddr" />
        </template>
      </el-dropdown>
    </div>
    <div class="tab-list">
      <el-tabs v-model="activeName" class="tabs-blue-color">
        <el-tab-pane name="first">
          <template #label>
            <span class="custom-tabs-label">
              <IconifyIconOnline icon="fluent:app-folder-48-filled" />
              <span>Collected</span>
            </span>
          </template>
        </el-tab-pane>

        <!-- <el-tab-pane v-model="activeName" name="second">
          <template #label>
            <span class="custom-tabs-label">
              <IconifyIconOnline icon="ant-design:heart-filled" />
              <span>Favorited</span>
              <span class="item-number">?</span>
            </span>
          </template>
        </el-tab-pane> -->

        <el-tab-pane v-model="activeName" name="third">
          <template #label>
            <span class="custom-tabs-label">
              <IconifyIconOnline icon="jam:world" />
              <span>Activity</span>
            </span>
          </template>
        </el-tab-pane>

        <el-tab-pane v-model="activeName" name="fourth">
          <template #label>
            <span class="custom-tabs-label">
              <IconifyIconOnline icon="akar-icons:hand" />
              <span>Offer</span>
              <span class="item-number">?</span>
            </span>
          </template>
        </el-tab-pane>

        <el-tab-pane v-model="activeName" name="five">
          <template #label>
            <span class="custom-tabs-label">
              <IconifyIconOnline icon="bytesize:tag" />
              <span>Listings</span>
            </span>
          </template>
        </el-tab-pane>

        <el-tab-pane v-model="activeName" name="six">
          <template #label>
            <span class="custom-tabs-label">
              <IconifyIconOnline icon="bx:layer" />
              <span>Staking</span>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="tab-content">
      <Collected v-if="activeName === 'first'" />
      <Favorited v-if="activeName === 'second'" />
      <Activity v-if="activeName === 'third'" />
      <Offer v-if="activeName === 'fourth'" />
      <Listings v-if="activeName === 'five'" />
      <Staking v-if="activeName === 'six'" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.top-banner-details {
  .banner-details-image {
    width: 100%;
    height: 100%;
  }
}
.myaccount-container {
  color: #ffff;
  margin: 0px !important;
  padding-bottom: 50px;
  .header-content {
    height: 0;
    .picasso-avatar {
      height: 150px;
    }
  }
  .avatar {
    position: relative;
    bottom: 35px;
    width: 100%;
    display: flex;
    justify-content: center;
    text-align: center;
    .avt-loop {
      .el-carousel {
        background: #3e949b;
      }
    }
  }
  .el-avatar {
    --el-avatar-bg-color: #091f59;
    image-rendering: pixelated;
  }
  .name-gallery {
    display: flex;
    justify-content: center;
    margin-top: 125px;
    flex-direction: column;
    align-items: center;
    align-content: center;
    color: #ffff;
    font-weight: bold;
    font-size: 25px;
    .btn-address {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 46px;
      border: none;
      box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.25);
      font-size: 15px;
      cursor: pointer;
      margin-top: 10px;
      .el-link {
        color: #ffff;
        &:hover {
          color: rgb(69, 187, 255);
        }
      }
    }
  }
  .tab-list {
    margin: 0px 24px;
    :deep(.el-tabs__nav.is-top),
    :deep(.el-tabs__nav-scroll) {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
    :deep(.el-tabs__nav.is-top) {
      padding: 20px 5px;
    }
    :deep(.el-tabs__item) {
      color: #ffff;
      font-size: 18px;
      // height: 100%;
    }
    :deep(.el-tabs__item.is-active) {
      color: #45bbff;
    }
    :deep(.el-tabs__active-bar) {
      background-color: unset;
    }
    :deep(.el-tabs__nav-wrap::after) {
      background-color: #525c9a;
      opacity: 0.8;
    }
    .custom-tabs-label {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .el-icon {
        vertical-align: middle;
      }
      .badge {
        margin-top: -15px;
        // margin-right: 40px;
      }
      .item-number {
        color: #fff;
        padding: 2px 5px;
        font-size: 12px;
        font-family: Barlow, sans-serif;
        background: #7155f9;
        margin-left: 10px;
        border-radius: 2px;
        position: relative;
        &::before {
          position: absolute;
          content: "";
          left: -5px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-color: transparent #7155f9 transparent transparent;
          border-style: solid;
          border-width: 5px 8.7px 5px 0;
        }
      }
      & span {
        vertical-align: middle;
        margin-left: 4px;
        height: 20px;
        line-height: 20px;
      }
      &:hover {
        color: rgb(104 171 210);
      }
    }
    :deep(.el-tabs--top .el-tabs__item.is-top:nth-child(2)) {
      padding-left: 20px;
    }
    :deep(.el-tabs--top .el-tabs__item.is-top:last-child) {
      padding-right: 20px;
    }
  }
  .tab-content {
    margin: 0px 6px;
  }
}
@media screen and (max-width: 530px) {
  .header-content {
    .avatar-circle {
      height: 125px !important;
      width: 125px !important;
      line-height: 125px !important;
    }
    .picasso-avatar {
      width: 125px !important;
      height: auto !important;
    }
    .none-user-avt {
      font-size: 125px !important;
    }
  }
}
@media only screen and(max-width:400px) {
  :deep(.el-tabs__item) {
    padding: 0 10px;
  }
  :deep(.el-tabs--top .el-tabs__item.is-top:nth-child(2)) {
    padding-left: 10px !important;
  }
  :deep(.el-tabs--top .el-tabs__item.is-top:last-child) {
    padding-right: 10px !important;
  }
}
</style>
