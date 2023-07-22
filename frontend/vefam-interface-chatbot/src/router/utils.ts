import {
  RouterHistory,
  RouteRecordRaw,
  RouteComponent,
  createWebHistory,
  createWebHashHistory,
  RouteRecordNormalized
} from "vue-router";
import { router } from "./index";
import { loadEnv } from "../../build";
import { cloneDeep } from "lodash-unified";
import { useTimeoutFn } from "@vueuse/core";
import { RouteConfigs } from "/@/layout/types";
import { buildHierarchyTree } from "@pureadmin/utils";
import { usePermissionStoreHook } from "/@/store/modules/permission";
const Layout = () => import("/@/layout/index.vue");
const IFrame = () => import("/@/layout/frameView.vue");
// https://cn.vitejs.dev/guide/features.html#glob-import
const modulesRoutes = import.meta.glob("/src/views/**/*.{vue,tsx}");

// dynamic routing
import { getAsyncRoutes } from "/@/api/routes";

// @ Sắp xếp các tuyến theo thứ tự tăng dần của rank theo meta trong route
function ascending(arr: any[]) {
  arr.forEach(v => {
    if (!v || !v.meta) return;
    // null - number = -number, undefined - number = NaN
    if (v.meta.rank === null) v.meta.rank = undefined;
    if (v.meta.rank === 0) {
      if (v.name !== "Home" && v.path !== "/") {
        console.warn("rank only the home page can be 0");
      }
    }
  });
  return arr.sort(
    (a: { meta: { rank: number } }, b: { meta: { rank: number } }) => {
      return a.meta.rank - b.meta.rank;
    }
  );
}

// @ Lọc loại bỏ các routes có showLink = false trong meta
function filterTree(data: RouteComponent[]) {
  const newTree = cloneDeep(data).filter(
    (v: { meta: { showLink: boolean } }) => v.meta && v.meta.showLink !== false
  );
  newTree.forEach(
    (v: { children }) => v.children && (v.children = filterTree(v.children))
  );
  return newTree;
}

// Delete cached routes in batches (keepalive)
function delAliveRoutes(delAliveRouteList: Array<RouteConfigs>) {
  delAliveRouteList.forEach(route => {
    usePermissionStoreHook().cacheOperate({
      mode: "delete",
      name: route && route.name
    });
  });
}

// Get parent path by path
function getParentPaths(path: string, routes: RouteRecordRaw[]) {
  // deep traversal search
  function dfs(routes: RouteRecordRaw[], path: string, parents: string[]) {
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i];
      // If the path is found, return the parent path
      if (item.path === path) return parents;
      // no recursion if children does not exist or is empty
      if (!item.children || !item.children.length) continue;
      // Push the current path to the stack when looking down
      parents.push(item.path);

      if (dfs(item.children, path, parents).length) return parents;
      // The current path is popped from the stack when the depth traversal search is not found
      parents.pop();
    }
    // Returns empty array if not found
    return [];
  }

  return dfs(routes, path, []);
}

// Find the routing information of the corresponding path
function findRouteByPath(path: string, routes: RouteRecordRaw[]) {
  let res = routes.find((item: { path: string }) => item.path == path);
  if (res) {
    return res;
  } else {
    for (let i = 0; i < routes.length; i++) {
      if (
        routes[i].children instanceof Array &&
        routes[i].children.length > 0
      ) {
        res = findRouteByPath(path, routes[i].children);
        if (res) {
          return res;
        }
      }
    }
    return null;
  }
}

// @ reset route
function resetRouter(): void {
  router.getRoutes().forEach(route => {
    const { name } = route;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

// @ Initialize route
function initRouter(name: string) {
  return new Promise(resolve => {
    getAsyncRoutes({ name }).then(({ info }) => {
      if (info.length === 0) {
        usePermissionStoreHook().changeSetting(info);
      } else {
        // Lọc các dynamic routes sau đó chuyển thành mảng 1 chiều
        formatFlatteningRoutes(addAsyncRoutes(info)).map(
          (v: RouteRecordRaw) => {
            // Ngăn chặn trùng lặp routing
            if (
              router.options.routes[0].children.findIndex(
                value => value.path === v.path
              ) !== -1
            ) {
              return;
            } else {
              // Hãy nhớ sử dụng addRoute sau khi pushing route to routes để route có thể nhảy bình thường
              router.options.routes[0].children.push(v);
              // final route in ascending order
              ascending(router.options.routes[0].children);
              if (!router.hasRoute(v && v.name)) router.addRoute(v);
              const flattenRouters: any = router
                .getRoutes()
                .find(n => n.path === "/");
              router.addRoute(flattenRouters);
            }
            resolve(router);
          }
        );
        // tạo danh sách menu sau khi lấy được async routes
        usePermissionStoreHook().changeSetting(info);
      }
      router.addRoute({
        path: "/:pathMatch(.*)",
        redirect: "/error/404"
      });
    });
  });
}

/**
 * Xử lý các routes lồng nhau nhiều cấp (multi-level nested routes) thành mảng một chiều
 * @param routesList incoming route
 * @returns Returns the processed 1D route
 */
function formatFlatteningRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  let hierarchyList = buildHierarchyTree(routesList);
  for (let i = 0; i < hierarchyList.length; i++) {
    if (hierarchyList[i].children) {
      hierarchyList = hierarchyList
        .slice(0, i + 1)
        .concat(hierarchyList[i].children, hierarchyList.slice(i + 1));
    }
  }
  return hierarchyList;
}

/**
 * One-dimensional arrays are processed into multi-level nested arrays (all routes of level three and above are taken as level two, keep-alive only supports level two caches)
 * https://github.com/xiaoxian521/vue-pure-admin/issues/67
 * @param routesList The processed one-dimensional routing menu array
 * @returns Returns a format that reprocesses a one-dimensional array into the specified route
 */
function formatTwoStageRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  const newRoutesList: RouteRecordRaw[] = [];
  routesList.forEach((v: RouteRecordRaw) => {
    if (v.path === "/") {
      newRoutesList.push({
        component: v.component,
        name: v.name,
        path: v.path,
        redirect: v.redirect,
        meta: v.meta,
        children: []
      });
    } else {
      newRoutesList[0].children.push({ ...v });
    }
  });
  return newRoutesList;
}

// Handling cached routes (add, delete, refresh)
function handleAliveRoute(matched: RouteRecordNormalized[], mode?: string) {
  switch (mode) {
    case "add":
      matched.forEach(v => {
        usePermissionStoreHook().cacheOperate({ mode: "add", name: v.name });
      });
      break;
    case "delete":
      usePermissionStoreHook().cacheOperate({
        mode: "delete",
        name: matched[matched.length - 1].name
      });
      break;
    default:
      usePermissionStoreHook().cacheOperate({
        mode: "delete",
        name: matched[matched.length - 1].name
      });
      useTimeoutFn(() => {
        matched.forEach(v => {
          usePermissionStoreHook().cacheOperate({ mode: "add", name: v.name });
        });
      }, 100);
  }
}

// @ Lọc các dynamic routes từ backend và tạo lại các routes chuẩn
function addAsyncRoutes(arrRoutes: Array<RouteRecordRaw>) {
  if (!arrRoutes || !arrRoutes.length) return;
  const modulesRoutesKeys = Object.keys(modulesRoutes);
  arrRoutes.forEach((v: RouteRecordRaw) => {
    if (v.redirect) {
      v.component = Layout;
    } else if (v.meta && v.meta.frameSrc) {
      v.component = IFrame;
    } else {
      // Compatible with the back-end component path passed and not passed (if the backend passes the component component path,
      // the path can be written casually, if not passed, the component component path will be the same as the root path)
      const index =
        v && v.component
          ? modulesRoutesKeys.findIndex(ev => ev.includes(v.component as any))
          : modulesRoutesKeys.findIndex(ev => ev.includes(v.path));
      v.component = modulesRoutes[modulesRoutesKeys[index]];
    }
    if (v.children) {
      addAsyncRoutes(v.children);
    }
  });
  return arrRoutes;
}

// Get route history mode https://next.router.vuejs.org/zh/guide/essentials/history-mode.html
function getHistoryMode(): RouterHistory {
  const routerHistory = loadEnv().VITE_ROUTER_HISTORY;
  // If len is 1, it means that only the historical mode is available; if it is 2, it means that the base parameter exists in the historical mode
  // https://next.router.vuejs.org/zh/api/#%E5%8F%82%E6%95%B0-1
  const historyMode = routerHistory.split(",");
  const leftMode = historyMode[0];
  const rightMode = historyMode[1];
  // no param
  if (historyMode.length === 1) {
    if (leftMode === "hash") {
      return createWebHashHistory("");
    } else if (leftMode === "h5") {
      return createWebHistory("");
    }
  } //has param
  else if (historyMode.length === 2) {
    if (leftMode === "hash") {
      return createWebHashHistory(rightMode);
    } else if (leftMode === "h5") {
      return createWebHistory(rightMode);
    }
  }
}

// Do you have permission
function hasPermissions(value: Array<string>): boolean {
  if (value && value instanceof Array && value.length > 0) {
    const roles = usePermissionStoreHook().buttonAuth;
    const permissionRoles = value;

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role);
    });

    if (!hasPermission) {
      return false;
    }
    return true;
  } else {
    return false;
  }
}

export {
  ascending,
  filterTree,
  initRouter,
  resetRouter,
  hasPermissions,
  getHistoryMode,
  addAsyncRoutes,
  delAliveRoutes,
  getParentPaths,
  findRouteByPath,
  handleAliveRoute,
  formatTwoStageRoutes,
  formatFlatteningRoutes
};
