<script setup lang="ts">
// import Search from "./search/index.vue";
// import Notice from "./notice/index.vue";
import DAccount from "./dAccount/index.vue";
import CAccount from "./cAccount/index.vue";
import mixNav from "./sidebar/mixNav.vue";
// import avatars from "/@/assets/avatars.jpg";
import { useNav } from "/@/layout/hooks/useNav";
import Breadcrumb from "./sidebar/breadCrumb.vue";
import { deviceDetection } from "@pureadmin/utils";
import topCollapse from "./sidebar/topCollapse.vue";
import screenfull from "../components/screenfull/index.vue";
import { useTranslationLang } from "../hooks/useTranslationLang";
// import globalization from "/@/assets/svg/globalization.svg?component";
// Assets
import logoSymbol from "/@/assets/logo-symbol.png";
import logoText from "/@/assets/logo-text.png";

const {
  layout,
  device,
  // logout,
  onPanel,
  pureApp,
  // username,
  // avatarsStyle,
  toggleSideBar
  // getDropdownItemStyle,
  // getDropdownItemClass
} = useNav();

const { t /*, locale, translationCh, translationEn*/ } = useTranslationLang();
</script>

<template>
  <div
    class="navbar bg-[#fff] shadow-sm shadow-[rgba(0, 21, 41, 0.08)] dark:shadow-[#0d0d0d]"
  >
    <topCollapse
      v-if="device === 'mobile'"
      class="hamburger-container"
      :is-active="pureApp.sidebar.opened"
      @toggleClick="toggleSideBar"
    />
    <div v-if="device === 'mobile'">
      <transition name="sidebarLogoFade">
        <router-link key="props.collapse" class="sidebar-logo-link" to="/">
          <img style="height: 25px" :src="logoSymbol" />
          <img class="sidebar-title" :src="logoText" />
        </router-link>
      </transition>
    </div>

    <Breadcrumb
      v-if="layout !== 'mix' && device !== 'mobile'"
      class="breadcrumb-container"
    />

    <mixNav v-if="layout === 'mix'" />

    <div v-if="layout === 'vertical'" class="vertical-header-right">
      <!-- full screen -->
      <!-- <screenfull id="header-screenfull" v-show="!deviceDetection()" /> -->
      <screenfull id="header-screenfull" />
      <CAccount />
      <DAccount />
      <span
        class="el-icon-setting navbar-bg-hover"
        :title="t('buttons.hssystemSet')"
        @click="onPanel"
      >
        <IconifyIconOffline icon="setting" />
      </span>
      <!-- menu search -->
      <!-- <Search /> -->
      <!-- Notice -->
      <!-- <Notice id="header-notice" /> -->
      <!-- globalization -->
      <!-- <el-dropdown id="header-translation" trigger="click">
        <globalization
          class="navbar-bg-hover w-40px h-48px p-11px cursor-pointer outline-none"
        />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'zh')"
              :class="['!dark:color-white', getDropdownItemClass(locale, 'zh')]"
              @click="translationCh"
            >
              <IconifyIconOffline
                class="check-zh"
                v-show="locale === 'zh'"
                icon="check"
              />
              简体中文
            </el-dropdown-item>
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'en')"
              :class="['!dark:color-white', getDropdownItemClass(locale, 'en')]"
              @click="translationEn"
            >
              <span class="check-en" v-show="locale === 'en'">
                <IconifyIconOffline icon="check" />
              </span>
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown> -->

      <!-- sign out -->
      <!-- <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover">
          <img v-if="avatars" :src="avatars" :style="avatarsStyle" />
          <p v-if="username" class="dark:color-white">{{ username }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="logout">
              <IconifyIconOffline
                icon="logout-circle-r-line"
                style="margin: 5px"
              />
              {{ t("buttons.hsLoginOut") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 54px;
  overflow: hidden;
  background: #191b1f;
  display: flex;
  justify-content: space-between;

  .hamburger-container {
    font-size: 24px;
    line-height: 48px;
    height: 100%;
    float: left;
    cursor: pointer;
    color: #ffff;
  }

  .vertical-header-right {
    display: flex;
    // min-width: 280px;
    height: 54px;
    align-items: center;
    color: #ffff;
    justify-content: flex-end;

    .el-dropdown-link {
      height: 48px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      cursor: pointer;
      // color: inherit;

      p {
        font-size: 14px;
      }

      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
    }

    .el-dropdown {
      color: inherit;
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 16px;
  }

  .sidebar-logo-link {
    height: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: absolute;
    left: 50px;

    .sidebar-title {
      height: 28px;
      padding-top: 5px;
    }
  }
}

.translation {
  :deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}

.logout {
  max-width: 120px;

  :deep(.el-dropdown-menu__item) {
    min-width: 100%;
    display: inline-flex;
    flex-wrap: wrap;
  }
}
</style>
