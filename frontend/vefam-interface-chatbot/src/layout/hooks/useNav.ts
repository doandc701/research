import { computed } from "vue";
import { router } from "/@/router";
import { getConfig } from "/@/config";
import { useRouter } from "vue-router";
import { emitter } from "/@/utils/mitt";
import { routeMetaType } from "../types";
import { remainingPaths } from "/@/router";
import type { StorageConfigs } from "/#/index";
import { routerArrays } from "/@/layout/types";
import { transformI18n } from "/@/plugins/i18n";
import { useAppStoreHook } from "/@/store/modules/app";
import { i18nChangeLanguage } from "@wangeditor/editor";
import { storageSession, useGlobal } from "@pureadmin/utils";
import { useEpThemeStoreHook } from "/@/store/modules/epTheme";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";

const errorInfo =
  "The current routing configuration is incorrect, please check the configuration";

export function useNav() {
  const pureApp = useAppStoreHook();
  const routers = useRouter().options.routes;
  const infoSC = storageSession.getItem<StorageConfigs>("info");
  /** username */
  const username: string = infoSC && infoSC.username;

  /** Set the style after internationalization is selected */
  const getDropdownItemStyle = computed(() => {
    return (locale, t) => {
      return {
        background: locale === t ? useEpThemeStoreHook().epThemeColor : "",
        color: locale === t ? "#f4f4f5" : "#000"
      };
    };
  });

  const getDropdownItemClass = computed(() => {
    return (locale, t) => {
      return locale === t ? "" : "!dark:hover:color-primary";
    };
  });

  const avatarsStyle = computed(() => {
    return username ? { marginRight: "10px" } : "";
  });

  const isCollapse = computed(() => {
    return !pureApp.getSidebarStatus;
  });

  const device = computed(() => {
    return pureApp.getDevice;
  });

  const { $storage, $config } = useGlobal<GlobalPropertiesApi>();
  const layout = computed(() => {
    return $storage.layout && $storage.layout.layout;
  });

  const title = computed(() => {
    return $config.Title;
  });

  /** dynamic title */
  function changeTitle(meta: routeMetaType) {
    const Title = getConfig().Title;
    if (Title) document.title = `${transformI18n(meta.title)} | ${Title}`;
    else document.title = transformI18n(meta.title);
  }

  /** sign out */
  function logout() {
    useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
    storageSession.removeItem("info");
    router.push("/login");
  }

  function backHome() {
    router.push("/");
  }

  function onPanel() {
    emitter.emit("openPanel");
  }

  function toggleSideBar() {
    pureApp.toggleSideBar();
  }

  function handleResize(menuRef) {
    menuRef && menuRef.handleResize();
  }

  function resolvePath(route) {
    if (!route.children) return console.error(errorInfo);
    const httpReg = /^http(s?):\/\//;
    const routeChildPath = route.children[0] && route.children[0].path;
    if (httpReg.test(routeChildPath)) {
      return route.path + "/" + routeChildPath;
    } else {
      return routeChildPath;
    }
  }

  function menuSelect(indexPath: string, routers): void {
    if (isRemaining(indexPath)) return;
    let parentPath = "";
    const parentPathIndex = indexPath.lastIndexOf("/");
    if (parentPathIndex > 0) {
      parentPath = indexPath.slice(0, parentPathIndex);
    }
    /** Tìm thông tin về tuyến đường hiện tại */
    function findCurrentRoute(indexPath: string, routes) {
      if (!routes) return console.error(errorInfo);
      return routes.map(item => {
        if (item.path === indexPath) {
          if (item.redirect) {
            findCurrentRoute(item.redirect, item.children);
          } else {
            /** Toggle left menu Notifications tab */
            emitter.emit("changLayoutRoute", {
              indexPath,
              parentPath
            });
          }
        } else {
          if (item.children) findCurrentRoute(indexPath, item.children);
        }
      });
    }
    findCurrentRoute(indexPath, routers);
  }

  /** Xác định xem đường dẫn có tham gia vào menu hay không */
  function isRemaining(path: string): boolean {
    return remainingPaths.includes(path);
  }

  /**
   * Switch wangEditorV5 internationalization
   * @param language string giá trị tùy chọn en, zh-CN
   * @returns void
   */
  function changeWangeditorLanguage(language: string): void {
    i18nChangeLanguage(language);
  }

  return {
    title,
    device,
    layout,
    logout,
    routers,
    $storage,
    backHome,
    onPanel,
    changeTitle,
    toggleSideBar,
    menuSelect,
    handleResize,
    resolvePath,
    isCollapse,
    pureApp,
    username,
    avatarsStyle,
    getDropdownItemStyle,
    getDropdownItemClass,
    changeWangeditorLanguage
  };
}
