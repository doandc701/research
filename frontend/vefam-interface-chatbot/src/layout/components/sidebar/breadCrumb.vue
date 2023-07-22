<script setup lang="ts">
import { ref, watch } from "vue";
import { isEqual } from "lodash-unified";
import { transformI18n } from "/@/plugins/i18n";
import { getParentPaths, findRouteByPath } from "/@/router/utils";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { useRoute, useRouter, RouteLocationMatched } from "vue-router";

const route = useRoute();
const levelList = ref([]);
const router = useRouter();
const routes: any = router.options.routes;
const multiTags: any = useMultiTagsStoreHook().multiTags;

const isDashboard = (route: RouteLocationMatched): boolean | string => {
  const name = route && (route.name as string);
  if (!name) {
    return false;
  }
  return name.trim().toLocaleLowerCase() === "Home".toLocaleLowerCase();
};

const getBreadcrumb = (): void => {
  // thông tin định tuyến hiện tại
  let currentRoute;
  if (Object.keys(route.query).length > 0) {
    multiTags.forEach(item => {
      if (isEqual(route.query, item && item.query)) {
        currentRoute = item;
      }
    });
  } else {
    currentRoute = findRouteByPath(router.currentRoute.value.path, multiTags);
  }
  // An array of parent paths of the current route
  const parentRoutes = getParentPaths(router.currentRoute.value.path, routes);
  // An array to store the crumbs that make up the breadcrumbs
  let matched = [];
  // Nhận thông tin định tuyến tương ứng với từng đường dẫn mẹ
  parentRoutes.forEach(path => {
    if (path !== "/") {
      matched.push(findRouteByPath(path, routes));
    }
  });
  if (
    router.currentRoute.value.meta &&
    router.currentRoute.value.meta.refreshRedirect
  ) {
    matched.unshift(
      findRouteByPath(
        router.currentRoute.value.meta.refreshRedirect as string,
        routes
      )
    );
  } else {
    // Filter parent routes with the same title as children
    matched = matched.filter(item => {
      return !item.redirect || (item.redirect && item.children.length !== 1);
    });
  }
  if (currentRoute && currentRoute.path !== "/home") {
    matched.push(currentRoute);
  }

  const first = matched[0];
  if (!isDashboard(first)) {
    matched = [
      {
        path: "/home",
        parentPath: "/",
        meta: { title: "menus.hshome" }
      } as unknown as RouteLocationMatched
    ].concat(matched);
  }

  levelList.value = matched.filter(
    item => item && item.meta && item.meta.title !== false
  );
};

getBreadcrumb();

watch(
  () => route.path,
  () => getBreadcrumb()
);

watch(
  () => route.query,
  () => getBreadcrumb()
);

const handleLink = (item: RouteLocationMatched): any => {
  const { redirect, path } = item;
  if (redirect) {
    router.push(redirect.toString());
    return;
  }
  router.push(path);
};
</script>

<template>
  <el-breadcrumb class="app-breadcrumb select-none" separator="/">
    <transition-group appear name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
        >
          {{ transformI18n(item.meta.title) }}
        </span>
        <a v-else @click.prevent="handleLink(item)">
          {{ transformI18n(item.meta.title) }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
