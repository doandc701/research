<script setup lang="ts">
import {
  ref,
  watch,
  unref,
  toRaw,
  reactive,
  nextTick,
  computed,
  ComputedRef,
  CSSProperties,
  onBeforeMount,
  getCurrentInstance
} from "vue";

import close from "/@/assets/svg/close.svg?component";
import refresh from "/@/assets/svg/refresh.svg?component";
import closeAll from "/@/assets/svg/close_all.svg?component";
import closeLeft from "/@/assets/svg/close_left.svg?component";
import closeOther from "/@/assets/svg/close_other.svg?component";
import closeRight from "/@/assets/svg/close_right.svg?component";

import { useI18n } from "vue-i18n";
import { emitter } from "/@/utils/mitt";
import { nullCoalescing } from "/@/utils";
import type { StorageConfigs } from "/#/index";
import { routerArrays } from "/@/layout/types";
import { useRoute, useRouter } from "vue-router";
import { isEqual, isEmpty } from "lodash-unified";
import { transformI18n, $t } from "/@/plugins/i18n";
import { RouteConfigs, tagsViewsType } from "../../types";
import { useSettingStoreHook } from "/@/store/modules/settings";
import { handleAliveRoute, delAliveRoutes } from "/@/router/utils";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { usePermissionStoreHook } from "/@/store/modules/permission";
import { templateRef, useResizeObserver, useDebounceFn } from "@vueuse/core";
import {
  toggleClass,
  removeClass,
  hasClass,
  storageLocal
} from "@pureadmin/utils";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const translateX = ref<number>(0);
const activeIndex = ref<number>(-1);
let refreshButton = "refresh-button";
const instance = getCurrentInstance();
const pureSetting = useSettingStoreHook();
const tabDom = templateRef<HTMLElement | null>("tabDom", null);
const containerDom = templateRef<HTMLElement | null>("containerDom", null);
const scrollbarDom = templateRef<HTMLElement | null>("scrollbarDom", null);
//
const rc = storageLocal.getItem<StorageConfigs>("responsive-configure");
const showTags = nullCoalescing(ref(rc.hideTabs), "false");
// @ts-expect-error
let multiTags: ComputedRef<Array<RouteConfigs>> = computed(() => {
  const ml = useMultiTagsStoreHook();
  return ml && ml.multiTags;
});

const linkIsActive = computed(() => {
  return item => {
    if (Object.keys(route.query).length === 0) {
      if (route.path === item.path) {
        return "is-active";
      } else {
        return "";
      }
    } else {
      if (route && item && isEqual(route.query, item.query)) {
        return "is-active";
      } else {
        return "";
      }
    }
  };
});

const scheduleIsActive = computed(() => {
  return item => {
    if (Object.keys(route.query).length === 0) {
      if (route.path === item.path) {
        return "schedule-active";
      } else {
        return "";
      }
    } else {
      if (route && item && isEqual(route.query, item.query)) {
        return "schedule-active";
      } else {
        return "";
      }
    }
  };
});

const iconIsActive = computed(() => {
  return (item, index) => {
    if (index === 0) return;
    if (Object.keys(route.query).length === 0) {
      if (route.path === item.path) {
        return true;
      } else {
        return false;
      }
    } else {
      if (route && item && isEqual(route.query, item.query)) {
        return true;
      } else {
        return false;
      }
    }
  };
});

const dynamicTagView = () => {
  const index = multiTags.value.findIndex(item => {
    if (item && item.query) {
      return isEqual(route && route.query, item.query);
    } else {
      return item.path === route.path;
    }
  });
  moveToView(index);
};

watch([route], () => {
  activeIndex.value = -1;
  dynamicTagView();
});

useResizeObserver(
  scrollbarDom,
  useDebounceFn(() => {
    dynamicTagView();
  }, 200)
);

const tabNavPadding = 10;
const moveToView = (index: number): void => {
  if (!instance.refs["dynamic" + index]) {
    return;
  }
  const tabItemEl = instance.refs["dynamic" + index][0] as HTMLElement;
  const tabItemElOffsetLeft = tabItemEl && tabItemEl.offsetLeft;
  const tabItemOffsetWidth = tabItemEl && tabItemEl.offsetWidth;
  // Chiều dài trực quan của thanh điều hướng trang tab (không bao gồm phần tràn)
  const scrollbarDomWidth = scrollbarDom.value
    ? scrollbarDom.value.offsetWidth
    : 0;
  // Tổng độ dài của các trang tab hiện có (bao gồm cả phần bổ sung)
  const tabDomWidth = tabDom.value ? tabDom.value.offsetWidth : 0;

  if (tabDomWidth < scrollbarDomWidth || tabItemElOffsetLeft === 0) {
    translateX.value = 0;
  } else if (tabItemElOffsetLeft < -translateX.value) {
    // Các nhãn nằm ở phía bên trái của khu vực có thể xem
    translateX.value = -tabItemElOffsetLeft + tabNavPadding;
  } else if (
    tabItemElOffsetLeft > -translateX.value &&
    tabItemElOffsetLeft + tabItemOffsetWidth <
      -translateX.value + scrollbarDomWidth
  ) {
    // nhãn trong khu vực có thể xem
    translateX.value = Math.min(
      0,
      scrollbarDomWidth -
        tabItemOffsetWidth -
        tabItemElOffsetLeft -
        tabNavPadding
    );
  } else {
    // Gắn nhãn ở bên phải của khu vực có thể xem
    translateX.value = -(
      tabItemElOffsetLeft -
      (scrollbarDomWidth - tabNavPadding - tabItemOffsetWidth)
    );
  }
};

const handleScroll = (offset: number): void => {
  const scrollbarDomWidth = scrollbarDom.value
    ? scrollbarDom.value.offsetWidth
    : 0;
  const tabDomWidth = tabDom.value ? tabDom.value.offsetWidth : 0;
  if (offset > 0) {
    translateX.value = Math.min(0, translateX.value + offset);
  } else {
    if (scrollbarDomWidth < tabDomWidth) {
      if (translateX.value >= -(tabDomWidth - scrollbarDomWidth)) {
        translateX.value = Math.max(
          translateX.value + offset,
          scrollbarDomWidth - tabDomWidth
        );
      }
    } else {
      translateX.value = 0;
    }
  }
};

const tagsViews = reactive<Array<tagsViewsType>>([
  {
    icon: refresh,
    text: $t("buttons.hsreload"),
    divided: false,
    disabled: false,
    show: true
  },
  {
    icon: close,
    text: $t("buttons.hscloseCurrentTab"),
    divided: false,
    disabled: multiTags.value.length > 1 ? false : true,
    show: true
  },
  {
    icon: closeLeft,
    text: $t("buttons.hscloseLeftTabs"),
    divided: true,
    disabled: multiTags.value.length > 1 ? false : true,
    show: true
  },
  {
    icon: closeRight,
    text: $t("buttons.hscloseRightTabs"),
    divided: false,
    disabled: multiTags.value.length > 1 ? false : true,
    show: true
  },
  {
    icon: closeOther,
    text: $t("buttons.hscloseOtherTabs"),
    divided: true,
    disabled: multiTags.value.length > 2 ? false : true,
    show: true
  },
  {
    icon: closeAll,
    text: $t("buttons.hscloseAllTabs"),
    divided: false,
    disabled: multiTags.value.length > 1 ? false : true,
    show: true
  }
]);

// Chế độ hiển thị, hiển thị chế độ thông minh mặc định
// const rc = storageLocal.getItem<StorageConfigs>("responsive-configure");
const showModel = ref((rc && rc.showModel) || "smart");
if (!showModel.value) {
  const configure = storageLocal.getItem<StorageConfigs>(
    "responsive-configure"
  );
  configure.showModel = "card";
  storageLocal.setItem("responsive-configure", configure);
}

let visible = ref(false);
let buttonLeft = ref(0);
let buttonTop = ref(0);

// Thông tin định tuyến hiện được chọn bằng cách nhấp chuột phải
let currentSelect = ref({});

function dynamicRouteTag(value: string, parentPath: string): void {
  const hasValue = multiTags.value.some(item => {
    return item.path === value;
  });

  function concatPath(arr: object[], value: string, parentPath: string) {
    if (!hasValue) {
      arr.forEach((arrItem: any) => {
        let pathConcat = parentPath + arrItem.path;
        if (arrItem.path === value || pathConcat === value) {
          useMultiTagsStoreHook().handleTags("push", {
            path: value,
            parentPath: `/${parentPath.split("/")[1]}`,
            meta: arrItem.meta,
            name: arrItem.name
          });
        } else {
          if (arrItem.children && arrItem.children.length > 0) {
            concatPath(arrItem.children, value, parentPath);
          }
        }
      });
    }
  }
  concatPath(router.options.routes as any, value, parentPath);
}

// Reload
function onFresh() {
  toggleClass(true, refreshButton, document.querySelector(".rotate"));
  const { fullPath, query } = unref(route);
  router.replace({
    path: "/redirect" + fullPath,
    query: query
  });
  setTimeout(() => {
    removeClass(document.querySelector(".rotate"), refreshButton);
  }, 600);
}

function deleteDynamicTag(obj: any, current: any, tag?: string) {
  // Store deleted cached routes
  let delAliveRouteList = [];
  let valueIndex: number = multiTags.value.findIndex((item: any) => {
    if (item.query) {
      if (item.path === obj.path) {
        return item.query === obj.query;
      }
    } else {
      return item.path === obj.path;
    }
  });

  const spliceRoute = (
    startIndex?: number,
    length?: number,
    other?: boolean
  ): void => {
    if (other) {
      useMultiTagsStoreHook().handleTags("equal", [routerArrays[0], obj]);
    } else {
      delAliveRouteList = useMultiTagsStoreHook().handleTags("splice", "", {
        startIndex,
        length
      }) as any;
    }
  };

  if (tag === "other") {
    spliceRoute(1, 1, true);
  } else if (tag === "left") {
    spliceRoute(1, valueIndex - 1);
  } else if (tag === "right") {
    spliceRoute(valueIndex + 1, multiTags.value.length);
  } else {
    // remove from currently matched paths
    spliceRoute(valueIndex, 1);
  }
  let newRoute = useMultiTagsStoreHook().handleTags("slice");
  if (current === route.path) {
    // delete cached route
    tag
      ? delAliveRoutes(delAliveRouteList)
      : handleAliveRoute(route.matched, "delete");
    // Nếu thẻ đang hoạt động hiện tại bị xóa, nó sẽ tự động chuyển sang thẻ cuối cùng
    if (tag === "left") return;
    nextTick(() => {
      router.push({
        path: newRoute[0].path,
        query: newRoute[0].query
      });
    });
  } else {
    // delete cached route
    tag ? delAliveRoutes(delAliveRouteList) : delAliveRoutes([obj]);
    if (!multiTags.value.length) return;
    let isHasActiveTag = multiTags.value.some(item => {
      return item.path === route.path;
    });
    !isHasActiveTag &&
      router.push({
        path: newRoute[0].path,
        query: newRoute[0].query
      });
  }
}

function deleteMenu(item, tag?: string) {
  deleteDynamicTag(item, item.path, tag);
}

function onClickDrop(key, item, selectRoute?: RouteConfigs) {
  if (item && item.disabled) return;

  let selectTagRoute;
  if (selectRoute) {
    selectTagRoute = {
      path: selectRoute.path,
      meta: selectRoute.meta,
      name: selectRoute.name,
      query: selectRoute.query
    };
  } else {
    selectTagRoute = { path: route.path, meta: route.meta };
  }

  // thông tin định tuyến hiện tại
  switch (key) {
    case 0:
      // Reload
      onFresh();
      break;
    case 1:
      // đóng tab hiện tại
      deleteMenu(selectTagRoute);
      break;
    case 2:
      // Đóng tab bên trái
      deleteMenu(selectTagRoute, "left");
      break;
    case 3:
      // Đóng tab bên phải
      deleteMenu(selectTagRoute, "right");
      break;
    case 4:
      // Đóng các tab khác
      deleteMenu(selectTagRoute, "other");
      break;
    case 5:
      // Đóng tất cả cửa sổ
      useMultiTagsStoreHook().handleTags("splice", "", {
        startIndex: 1,
        length: multiTags.value.length
      });
      usePermissionStoreHook().clearAllCachePage();
      router.push("/home");
      break;
  }
  setTimeout(() => {
    showMenuModel(route.fullPath, route.query);
  });
}

function handleCommand(command: any) {
  const { key, item } = command;
  onClickDrop(key, item);
}

// Trigger the click event of the right-click menu
function selectTag(key, item) {
  onClickDrop(key, item, currentSelect.value);
}

function closeMenu() {
  visible.value = false;
}

function showMenus(value: boolean) {
  Array.of(1, 2, 3, 4, 5).forEach(v => {
    tagsViews[v].show = value;
  });
}

function disabledMenus(value: boolean) {
  Array.of(1, 2, 3, 4, 5).forEach(v => {
    tagsViews[v].disabled = value;
  });
}

// Kiểm tra xem có các menu khác ở cả hai bên của menu nhấp chuột phải hiện tại hay không.
// Nếu menu bên trái là trang chủ, tab đóng bên trái sẽ không được hiển thị.
// Nếu không có menu nào ở bên phải, hãy đóng tab bên phải sẽ không được hiển thị.
function showMenuModel(
  currentPath: string,
  query: object = {},
  refresh = false
) {
  let allRoute = multiTags.value;
  let routeLength = multiTags.value.length;
  let currentIndex = -1;
  if (isEmpty(query)) {
    currentIndex = allRoute.findIndex(v => v.path === currentPath);
  } else {
    currentIndex = allRoute.findIndex(v => isEqual(v.query, query));
  }

  showMenus(true);

  if (refresh) {
    tagsViews[0].show = true;
  }

  /**
   * Khi currentIndex là 1, menu bên trái là trang chủ và trang tab bên trái không được hiển thị.
   * Nếu currentIndex bằng routeLength-1 và không có menu ở bên phải, thì khi đóng tab bên phải sẽ không hiển thị
   */
  if (currentIndex === 1 && routeLength !== 2) {
    // Menu bên trái là trang chủ và có các menu khác ở bên phải
    tagsViews[2].show = false;
    Array.of(1, 3, 4, 5).forEach(v => {
      tagsViews[v].disabled = false;
    });
    tagsViews[2].disabled = true;
  } else if (currentIndex === 1 && routeLength === 2) {
    disabledMenus(false);
    // Menu bên trái là trang chủ và không có menu nào khác ở bên phải
    Array.of(2, 3, 4).forEach(v => {
      tagsViews[v].show = false;
      tagsViews[v].disabled = true;
    });
  } else if (routeLength - 1 === currentIndex && currentIndex !== 0) {
    // The current route is the last of all routes
    tagsViews[3].show = false;
    Array.of(1, 2, 4, 5).forEach(v => {
      tagsViews[v].disabled = false;
    });
    tagsViews[3].disabled = true;
  } else if (currentIndex === 0 || currentPath === "/redirect/home") {
    // The current route is the home page
    disabledMenus(true);
  } else {
    disabledMenus(false);
  }
}

function openMenu(tag, e) {
  closeMenu();
  if (tag.path === "/home") {
    // The right-click menu is the home page, only display refresh
    showMenus(false);
    tagsViews[0].show = true;
  } else if (route.path !== tag.path) {
    // The right-click menu does not match the current route, hide the refresh
    tagsViews[0].show = false;
    showMenuModel(tag.path, tag.query);
  } else if (
    // eslint-disable-next-line no-dupe-else-if
    multiTags.value.length === 2 &&
    route.path !== tag.path
  ) {
    showMenus(true);
    // Không hiển thị đóng các tab khác khi chỉ có hai tab
    tagsViews[4].show = false;
  } else if (route.path === tag.path) {
    // Right-click the currently active menu
    showMenuModel(tag.path, tag.query, true);
  }

  currentSelect.value = tag;
  const menuMinWidth = 105;
  const offsetLeft = unref(containerDom).getBoundingClientRect().left;
  const offsetWidth = unref(containerDom).offsetWidth;
  const maxLeft = offsetWidth - menuMinWidth;
  const left = e.clientX - offsetLeft + 5;
  if (left > maxLeft) {
    buttonLeft.value = maxLeft;
  } else {
    buttonLeft.value = left;
  }
  pureSetting.hiddenSideBar
    ? (buttonTop.value = e.clientY)
    : (buttonTop.value = e.clientY - 40);
  setTimeout(() => {
    visible.value = true;
  }, 10);
}

// Trigger tags tag switching
function tagOnClick(item) {
  if (!item) return;
  router.push({
    path: item.path,
    query: item.query
  });
  showMenuModel(item.path, item.query);
}

// mouse in
function onMouseenter(index) {
  if (index) activeIndex.value = index;
  if (unref(showModel) === "smart") {
    if (hasClass(instance.refs["schedule" + index][0], "schedule-active"))
      return;
    toggleClass(true, "schedule-in", instance.refs["schedule" + index][0]);
    toggleClass(false, "schedule-out", instance.refs["schedule" + index][0]);
  } else {
    if (hasClass(instance.refs["dynamic" + index][0], "card-active")) return;
    toggleClass(true, "card-in", instance.refs["dynamic" + index][0]);
    toggleClass(false, "card-out", instance.refs["dynamic" + index][0]);
  }
}

// mouse out
function onMouseleave(index) {
  activeIndex.value = -1;
  if (unref(showModel) === "smart") {
    if (hasClass(instance.refs["schedule" + index][0], "schedule-active"))
      return;
    toggleClass(false, "schedule-in", instance.refs["schedule" + index][0]);
    toggleClass(true, "schedule-out", instance.refs["schedule" + index][0]);
  } else {
    if (hasClass(instance.refs["dynamic" + index][0], "card-active")) return;
    toggleClass(false, "card-in", instance.refs["dynamic" + index][0]);
    toggleClass(true, "card-out", instance.refs["dynamic" + index][0]);
  }
}

watch(
  () => visible.value,
  val => {
    if (val) {
      document.body.addEventListener("click", closeMenu);
    } else {
      document.body.removeEventListener("click", closeMenu);
    }
  }
);

onBeforeMount(() => {
  if (!instance) return;

  // Khởi tạo trạng thái tắt của tab hành động dựa trên tuyến đường hiện tại
  showMenuModel(route.fullPath);

  // trigger hidden tab
  emitter.on("tagViewsChange", (key: any) => {
    if (unref(showTags as any) === key) return;
    (showTags as any).value = key;
  });

  // thay đổi kiểu nhãn
  emitter.on("tagViewsShowModel", key => {
    showModel.value = key;
  });

  //  Receive the parameters passed by the sidebar switch
  emitter.on("changLayoutRoute", ({ indexPath, parentPath }) => {
    dynamicRouteTag(indexPath, parentPath);
    setTimeout(() => {
      showMenuModel(indexPath);
    });
  });
});

const getTabStyle = computed((): CSSProperties => {
  return {
    transform: `translateX(${translateX.value}px)`
  };
});

const getContextMenuStyle = computed((): CSSProperties => {
  return { left: buttonLeft.value + "px", top: buttonTop.value + "px" };
});
</script>

<template>
  <div ref="containerDom" class="tags-view" v-if="!showTags">
    <div class="arrow-left">
      <IconifyIconOffline icon="arrow-left-s-line" @click="handleScroll(200)" />
    </div>
    <div ref="scrollbarDom" class="scroll-container">
      <div class="tab" ref="tabDom" :style="getTabStyle">
        <div
          :ref="'dynamic' + index"
          v-for="(item, index) in multiTags"
          :key="index"
          :class="[
            'scroll-item is-closable',
            linkIsActive(item),
            $route.path === item.path && showModel === 'card'
              ? 'card-active'
              : ''
          ]"
          @contextmenu.prevent="openMenu(item, $event)"
          @mouseenter.prevent="onMouseenter(index)"
          @mouseleave.prevent="onMouseleave(index)"
          @click="tagOnClick(item)"
        >
          <router-link
            :to="item.path"
            class="!dark:color-text_color_primary !dark:hover:color-primary"
          >
            {{ transformI18n(item.meta.title) }}
          </router-link>
          <span
            v-if="
              iconIsActive(item, index) ||
              (index === activeIndex && index !== 0)
            "
            class="el-icon-close"
            @click.stop="deleteMenu(item)"
          >
            <IconifyIconOffline icon="close-bold" />
          </span>
          <div
            :ref="'schedule' + index"
            v-if="showModel !== 'card'"
            :class="[scheduleIsActive(item)]"
          />
        </div>
      </div>
    </div>
    <span class="arrow-right">
      <IconifyIconOffline
        icon="arrow-right-s-line"
        @click="handleScroll(-200)"
      />
    </span>
    <!-- right-click menu button -->
    <transition name="el-zoom-in-top">
      <ul
        v-show="visible"
        :key="Math.random()"
        :style="getContextMenuStyle"
        class="contextmenu"
      >
        <div
          v-for="(item, key) in tagsViews"
          :key="key"
          style="display: flex; align-items: center"
        >
          <li v-if="item.show" @click="selectTag(key, item)">
            <component :is="toRaw(item.icon)" :key="key" />
            {{ t(item.text) }}
          </li>
        </div>
      </ul>
    </transition>
    <!-- Right function button -->
    <ul class="right-button">
      <li>
        <span
          :title="t('buttons.hsrefreshRoute')"
          class="el-icon-refresh-right rotate"
          @click="onFresh"
        >
          <IconifyIconOffline icon="refresh-right" />
        </span>
      </li>
      <li>
        <el-dropdown
          trigger="click"
          placement="bottom-end"
          @command="handleCommand"
        >
          <IconifyIconOffline icon="arrow-down" class="dark:color-white" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, key) in tagsViews"
                :key="key"
                :command="{ key, item }"
                :divided="item.divided"
                :disabled="item.disabled"
              >
                <component
                  :is="toRaw(item.icon)"
                  :key="key"
                  style="margin-right: 6px"
                />
                {{ t(item.text) }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
      <li>
        <slot />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>
