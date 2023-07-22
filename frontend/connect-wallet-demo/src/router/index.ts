import { getConfig } from "/@/config";
import { toRouteType } from "./types";
import NProgress from "/@/utils/progress";
import { findIndex } from "lodash-unified";
import type { StorageConfigs } from "/#/index";
import { transformI18n } from "/@/plugins/i18n";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import { useUserStoreHook } from "/@/store/modules/user";
import {
  Router,
  RouteMeta,
  createRouter,
  RouteRecordRaw,
  RouteComponent,
  RouteRecordName
} from "vue-router";
import {
  ascending,
  initRouter,
  getHistoryMode,
  getParentPaths,
  findRouteByPath,
  handleAliveRoute,
  formatTwoStageRoutes,
  formatFlatteningRoutes
} from "./utils";
import {
  buildHierarchyTree,
  openLink,
  isUrl,
  storageSession
} from "@pureadmin/utils";

import homeRouter from "./modules/home";
// import collectionsRouter from "./modules/collections";
// import aboutRouter from "./modules/about";
// import errorRouter from "./modules/error";
// import guideRouter from "./modules/guide";
// import dthorRouter from "./modules/dthor";
import remainingRouter from "./modules/remaining";
// import accountRouter from "./modules/account";
// import gamesRouter from "./modules/games";
// import marketplaceRouter from "./modules/marketplace";
import swapRouter from "./modules/swap";
// import resourcesRouter from "./modules/resources";
import statsRouter from "./modules/stats";
import nftRouter from "./modules/ntf";

// Original static route (without any processing)
// const routes = [homeRouter, aboutRouter, errorRouter, guideRouter];
const routes = [
  homeRouter,
  swapRouter,
  // accountRouter,
  statsRouter,
  nftRouter
  // resourcesRouter
];

// Export the processed static routes (all routes of level 3 and above are recorded as level 2)
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes)))
);

// Used to render menus, keeping the original hierarchy
export const constantMenus: Array<RouteComponent> = ascending(routes).concat(
  ...remainingRouter
);

// Routing that does not participate in the menu
export const remainingPaths = Object.keys(remainingRouter).map(v => {
  return remainingRouter[v].path;
});

// Create a routing instance
export const router: Router = createRouter({
  history: getHistoryMode(),
  routes: constantRoutes.concat(...(remainingRouter as any)),
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number =
            document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  }
});

function handleQuery(query) {
  if (query.vip) useUserStoreHook().updateRefer(query.vip);
}

// Routing Whitelist
const whiteList = ["/login"];

router.beforeEach((to: toRouteType, _from, next) => {
  handleQuery(to.query);
  if (to.meta && to.meta.keepAlive) {
    const newMatched = to.matched;
    handleAliveRoute(newMatched, "add");
    // Overall page refresh and click tab refresh
    if (_from.name === undefined || _from.name === "Redirect") {
      handleAliveRoute(newMatched);
    }
  }
  let name = storageSession.getItem<StorageConfigs>("info");
  // giả lập guest login
  if (!name) {
    storageSession.setItem("info", {
      username: "guest",
      accessToken: "_.test"
    });
    name = storageSession.getItem<StorageConfigs>("info");
  }
  NProgress.start();
  const externalLink = isUrl(to.name as string);
  if (!externalLink)
    to.matched.some(item => {
      if (!item.meta.title) return "";
      const Title = getConfig().Title;
      if (Title)
        document.title = `${transformI18n(item.meta.title)} | ${Title}`;
      else document.title = transformI18n(item.meta.title);
    });
  // có thông tin user
  if (name) {
    if (_from.name) {
      // tên là một siêu liên kết
      if (externalLink) {
        openLink(to.name as string);
        NProgress.done();
      } else {
        next();
      }
    } else {
      // truy cập trực tiếp hoặc refresh trình duyệt
      // wholeMenus: danh sách router cho user này
      if (usePermissionStoreHook().wholeMenus.length === 0)
        initRouter(name.username).then((router: Router) => {
          if (!useMultiTagsStoreHook().getMultiTagsCache) {
            const handTag = (
              path: string,
              parentPath: string,
              name: RouteRecordName,
              meta: RouteMeta
            ): void => {
              useMultiTagsStoreHook().handleTags("push", {
                path,
                parentPath,
                name,
                meta
              });
            };
            // If the tab cache is not enabled, refresh the page and redirect to the top-level route (refer to the tab operation example, only for static routes)
            if (to.meta && to.meta.refreshRedirect) {
              const routes: any = router.options.routes;
              const { refreshRedirect } = to.meta;
              const { name, meta } = findRouteByPath(refreshRedirect, routes);
              handTag(
                refreshRedirect,
                getParentPaths(refreshRedirect, routes)[1],
                name,
                meta
              );
              return router.push(refreshRedirect);
            } else {
              const { path } = to;
              const index = findIndex(remainingRouter, v => {
                return v.path == path;
              });
              const routes: any =
                index === -1
                  ? router.options.routes[0].children
                  : router.options.routes;
              const route = findRouteByPath(path, routes);
              const routePartent = getParentPaths(path, routes);
              // If the tab cache is not enabled, refresh the page and redirect to the top-level route (refer to the tab operation example, only for dynamic routes)
              if (
                path !== routes[0].path &&
                route &&
                route.meta &&
                route.meta.rank !== 0 &&
                routePartent.length === 0
              ) {
                if (!route || !route.meta || !route.meta.refreshRedirect)
                  return;
                const { name, meta } = findRouteByPath(
                  route.meta.refreshRedirect,
                  routes
                );
                handTag(
                  route.meta.refreshRedirect,
                  getParentPaths(route.meta.refreshRedirect, routes)[0],
                  name,
                  meta
                );
                return router.push(route.meta.refreshRedirect);
              } else {
                handTag(
                  route.path,
                  routePartent[routePartent.length - 1],
                  route.name,
                  route.meta
                );
                return router.push(path);
              }
            }
          }
          router.push(to.fullPath);
        });
      next();
    }
  } else {
    // không có thông tin user
    if (to.path !== "/login") {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next({ path: "/login" });
      }
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
