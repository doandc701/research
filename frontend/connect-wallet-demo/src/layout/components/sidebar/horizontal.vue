<script setup lang="ts">
// import Search from "../search/index.vue";
// import Notice from "../notice/index.vue";
import CAccount from "../cAccount/index.vue";
import DAccount from "../dAccount/index.vue";
import SidebarItem from "./sidebarItem.vue";
// import avatars from "/@/assets/avatars.jpg";
import { useNav } from "/@/layout/hooks/useNav";
import screenfull from "../screenfull/index.vue";
import { deviceDetection } from "@pureadmin/utils";
import { useTranslationLang } from "../../hooks/useTranslationLang";
import { usePermissionStoreHook } from "/@/store/modules/permission";
// import globalization from "/@/assets/svg/globalization.svg?component";
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import logoDthor from "/img/icons/logo-dthor.png";
import logoText from "/img/icons/logo-text.png";

const menuRef = ref();

const { t, route /*, locale, translationCh, translationEn*/ } =
  useTranslationLang(menuRef);
const {
  routers,
  // logout,
  backHome,
  onPanel,
  handleResize,
  menuSelect
  // username,
  // avatarsStyle,
  // getDropdownItemStyle,
  // getDropdownItemClass
} = useNav();

function onResizeMenu() {
  nextTick(() => {
    handleResize(menuRef.value);
  });
}

onMounted(() => {
  window.addEventListener("resize", onResizeMenu);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResizeMenu);
});

watch(
  () => route.path,
  () => {
    menuSelect(route.path, routers);
  }
);
</script>

<template>
  <div class="horizontal-header">
    <div class="horizontal-header-left" @click="backHome">
      <img style="height: 35px" :src="logoDthor" />
      <img class="sidebar-title" style="height: 35px" :src="logoText" />
    </div>
    <!-- bỏ router vì không dùng router link của el-menu mà dùng thẻ a -->
    <!-- menu-trigger="click" -->
    <el-menu
      ref="menuRef"
      mode="horizontal"
      class="horizontal-header-menu"
      :default-active="route.path"
      @select="indexPath => menuSelect(indexPath, routers)"
    >
      <sidebar-item
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
    <div class="horizontal-header-right">
      <!-- full screen -->
      <screenfull id="header-screenfull" v-show="!deviceDetection()" />
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
              <span class="check-zh" v-show="locale === 'zh'">
                <IconifyIconOffline icon="check" />
              </span>
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

.sidebar-title {
  color: #1890ff;
  font-weight: 600;
  font-size: 20px;
  // margin-top: 10px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
}
</style>
