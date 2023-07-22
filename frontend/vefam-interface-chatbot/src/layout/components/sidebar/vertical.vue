<script setup lang="ts">
import Logo from "./logo.vue";
import { useRoute } from "vue-router";
import { emitter } from "/@/utils/mitt";
import { nullCoalescing } from "/@/utils";
import SidebarItem from "./sidebarItem.vue";
import leftCollapse from "./leftCollapse.vue";
import type { StorageConfigs } from "/#/index";
import { useNav } from "/@/layout/hooks/useNav";
import { storageLocal } from "@pureadmin/utils";
import { ref, computed, watch, onBeforeMount } from "vue";
import { findRouteByPath, getParentPaths } from "/@/router/utils";
import { usePermissionStoreHook } from "/@/store/modules/permission";

const route = useRoute();
const rc = storageLocal.getItem<StorageConfigs>("responsive-configure");
const showLogo = ref(nullCoalescing(rc && rc.showLogo, true));

const { routers, device, pureApp, isCollapse, menuSelect, toggleSideBar } =
  useNav();

let subMenuData = ref([]);

const menuData = computed(() => {
  return pureApp.layout === "mix" && device.value !== "mobile"
    ? subMenuData.value
    : usePermissionStoreHook().wholeMenus;
});

function getSubMenuData(path) {
  // Array of upper-level routes of path
  const parentPathArr = getParentPaths(
    path,
    usePermissionStoreHook().wholeMenus
  );
  // The parent routing information of the current route
  const parenetRoute = findRouteByPath(
    parentPathArr[0] || path,
    usePermissionStoreHook().wholeMenus
  );
  if (!parenetRoute || !parenetRoute.children) return;
  subMenuData.value = parenetRoute.children;
}
getSubMenuData(route.path);

onBeforeMount(() => {
  emitter.on("logoChange", key => {
    showLogo.value = key;
  });
});

watch(
  () => route.path,
  () => {
    getSubMenuData(route.path);
    menuSelect(route.path, routers);
  }
);
</script>

<template>
  <div :class="['sidebar-container', showLogo ? 'has-logo' : '']">
    <Logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar
      wrap-class="scrollbar-wrapper"
      :class="[device === 'mobile' ? 'mobile' : 'pc']"
    >
      <!-- bỏ router vì không dùng router link của el-menu mà dùng thẻ a -->
      <el-menu
        mode="vertical"
        class="outer-most"
        :collapse="isCollapse"
        :default-active="route.path"
        :collapse-transition="false"
        @select="indexPath => menuSelect(indexPath, routers)"
      >
        <sidebar-item
          v-for="routes in menuData"
          :key="routes.path"
          :item="routes"
          class="outer-most"
          :base-path="routes.path"
        />
      </el-menu>
    </el-scrollbar>
    <leftCollapse
      v-if="device !== 'mobile'"
      :is-active="pureApp.sidebar.opened"
      @toggleClick="toggleSideBar"
    />
  </div>
</template>
