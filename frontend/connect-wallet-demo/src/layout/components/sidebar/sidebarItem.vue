<script setup lang="ts">
/*
  // issues ----------
  1. cần chuyển css ra khỏi đây
  */
import path from "path";
import { childrenType } from "../../types";
import { useNav } from "/@/layout/hooks/useNav";
import { transformI18n } from "/@/plugins/i18n";
import { useAppStoreHook } from "/@/store/modules/app";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { ref, toRaw, PropType, nextTick, computed, CSSProperties } from "vue";

const { pureApp } = useNav();
const menuMode = ["vertical", "mix"].includes(pureApp.layout);

const props = defineProps({
  item: {
    type: Object as PropType<childrenType>
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ""
  }
});

const getExtraIconStyle = computed((): CSSProperties => {
  return {
    position: useAppStoreHook().getSidebarStatus ? "absolute" : "static"
  };
});

const getNoDropdownStyle = computed((): CSSProperties => {
  return {
    display: "flex",
    alignItems: "center"
  };
});

const getDivStyle = computed((): CSSProperties => {
  return {
    // width: pureApp.sidebar.opened ? "" : "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: pureApp.sidebar.opened ? "" : "hidden"
  };
});

const getMenuTextStyle = computed(() => {
  return {
    width: pureApp.sidebar.opened ? "100%" : "",
    overflow: "hidden",
    textOverflow: "ellipsis",
    outline: "none"
  };
});

const getSubTextStyle = computed((): CSSProperties => {
  return {
    // width: pureApp.sidebar.opened ? "210px" : "",
    display: "inline-block",
    overflow: "hidden",
    textOverflow: "ellipsis"
  };
});

const getSpanStyle = computed(() => {
  return {
    overflow: "hidden",
    textOverflow: "ellipsis"
  };
});

const onlyOneChild: childrenType = ref(null);
// Whether the showTooltip attribute flag exists in the storage menu
const hoverMenuMap = new WeakMap();
// Stores the menu text dom element
const menuTextRef = ref(null);

function hoverMenu(key) {
  // Nếu thuộc tính showTooltip của menu hiện tại đã tồn tại, hãy thoát khỏi phép tính
  if (hoverMenuMap.get(key)) return;

  nextTick(() => {
    // Văn bản tràn nếu chiều rộng tổng thể của nội dung văn bản lớn hơn chiều rộng nhìn thấy của nó
    menuTextRef.value &&
    menuTextRef.value.scrollWidth > menuTextRef.value.clientWidth
      ? Object.assign(key, {
          showTooltip: true
        })
      : Object.assign(key, {
          showTooltip: false
        });
    hoverMenuMap.set(key, true);
  });
}

function hasOneShowingChild(
  children: childrenType[] = [],
  parent: childrenType
) {
  const showingChildren = children.filter((item: any) => {
    onlyOneChild.value = item;
    return true;
  });

  if (
    showingChildren[0] &&
    showingChildren[0].meta &&
    showingChildren[0].meta.showParent
  ) {
    return false;
  }

  if (showingChildren.length === 1) {
    return true;
  }

  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }
  return false;
}

function resolvePath(routePath) {
  const httpReg = /^http(s?):\/\//;
  if (httpReg.test(routePath) || httpReg.test(props.basePath)) {
    return routePath || props.basePath;
  } else {
    return path.resolve(props.basePath, routePath);
  }
}

function resolveIconName(iconStr) {
  const name = resolveIconType(iconStr);
  if (name) {
    const strArray = iconStr.split(name);
    return strArray[1];
  }
  return iconStr;
}

function resolveIconType(iconStr) {
  let name = "";
  if (iconStr.includes("online:")) {
    name = "online:";
  } else if (iconStr.includes("img:")) {
    name = "img:";
  }
  return name;
}
function resolveCheckIconOnline(iconStr) {
  if (!iconStr) return false;
  return iconStr.includes("online:");
}
</script>

<template>
  <template
    v-if="
      hasOneShowingChild(props.item.children, props.item) &&
      (!onlyOneChild.children || onlyOneChild.noShowingChildren)
    "
  >
    <router-link :to="resolvePath(onlyOneChild.path)">
      <el-menu-item
        :index="resolvePath(onlyOneChild.path)"
        :class="{ 'submenu-title-noDropdown': !isNest }"
        :style="getNoDropdownStyle"
      >
        <div class="sub-menu-icon" v-if="toRaw(props.item.meta.icon)">
          <img
            v-if="resolveIconType(props.item.meta.icon) == 'img:'"
            :src="resolveIconName(props.item.meta.icon)"
          />
          <component
            v-else
            :is="
              useRenderIcon(
                toRaw(resolveIconName(onlyOneChild.meta.icon)) ||
                  (props.item.meta &&
                    toRaw(resolveIconName(props.item.meta.icon))),
                {
                  online: resolveCheckIconOnline(props.item.meta.icon)
                }
              )
            "
          />
        </div>
        <div
          v-if="
            !pureApp.sidebar.opened &&
            pureApp.layout === 'mix' &&
            props.item &&
            props.item.pathList &&
            props.item.pathList.length === 2
          "
          :style="getDivStyle"
        >
          1
          <span :style="getMenuTextStyle">
            {{ transformI18n(onlyOneChild.meta.title) }}
          </span>
        </div>
        <template #title>
          <div :style="getDivStyle">
            <span v-if="!menuMode">
              {{ transformI18n(onlyOneChild.meta.title) }}
            </span>
            <el-tooltip
              v-else
              placement="top"
              :offset="-10"
              :disabled="!onlyOneChild.showTooltip"
            >
              <template #content>
                {{ transformI18n(onlyOneChild.meta.title) }}
              </template>
              <span
                ref="menuTextRef"
                :style="getMenuTextStyle"
                @mouseover="hoverMenu(onlyOneChild)"
              >
                {{ transformI18n(onlyOneChild.meta.title) }}
              </span>
            </el-tooltip>
            <!-- <FontIcon
              v-if="onlyOneChild.meta.extraIcon"
              width="30px"
              height="30px"
              :style="getExtraIconStyle"
              :icon="onlyOneChild.meta.extraIcon.name"
              :svg="onlyOneChild.meta.extraIcon.svg ? true : false"
            /> -->
            <div
              v-if="onlyOneChild.meta.extraIcon"
              :style="getExtraIconStyle"
              class="extra-icon"
              :class="onlyOneChild.meta.extraIcon.position"
            >
              <el-image
                v-if="onlyOneChild.meta.extraIcon.icon === 0"
                :src="onlyOneChild.meta.extraIcon.name"
                class="extra-image"
              />
              <IconifyIconOnline
                v-else-if="onlyOneChild.meta.extraIcon.icon === 1"
                :icon="onlyOneChild.meta.extraIcon.name"
              />
              <span
                v-else-if="onlyOneChild.meta.extraIcon.icon === 2"
                :class="
                  'tag-' +
                  onlyOneChild.meta.extraIcon.name.toLowerCase() +
                  ' share-tag'
                "
              >
                <span>{{ onlyOneChild.meta.extraIcon.name }}</span>
              </span>
            </div>
          </div>
        </template>
      </el-menu-item>
    </router-link>
  </template>

  <el-sub-menu
    v-else
    ref="subMenu"
    :index="resolvePath(props.item.path)"
    popper-class="submenu-style01"
  >
    <template #title>
      <div v-if="toRaw(props.item.meta.icon)" class="sub-menu-icon">
        <img
          v-if="resolveIconType(props.item.meta.icon) == 'img:'"
          :src="resolveIconName(props.item.meta.icon)"
        />
        <component
          v-else
          :is="
            useRenderIcon(
              props.item.meta && toRaw(resolveIconName(props.item.meta.icon)),
              {
                online: resolveCheckIconOnline(props.item.meta.icon)
              }
            )
          "
        />
      </div>
      <span v-if="!menuMode"> {{ transformI18n(props.item.meta.title) }}</span>
      <el-tooltip
        v-else
        placement="top"
        :offset="-10"
        :disabled="!pureApp.sidebar.opened || !props.item.showTooltip"
      >
        <template #content>
          {{ transformI18n(props.item.meta.title) }}
        </template>
        <div
          ref="menuTextRef"
          :style="getSubTextStyle"
          @mouseover="hoverMenu(props.item)"
        >
          <span :style="getSpanStyle">
            {{ transformI18n(props.item.meta.title) }}
          </span>
        </div>
      </el-tooltip>
      <FontIcon
        v-if="props.item.meta.extraIcon"
        width="30px"
        height="30px"
        style="position: absolute; right: 10px"
        :icon="props.item.meta.extraIcon.name"
        :svg="props.item.meta.extraIcon.svg ? true : false"
      />
    </template>
    <sidebar-item
      v-for="child in props.item.children"
      :key="child.path"
      :is-nest="true"
      :item="child"
      :base-path="resolvePath(child.path)"
      class="nest-menu"
    />
  </el-sub-menu>
</template>

<style lang="scss" scoped>
.extra-icon {
  position: absolute !important;
  right: 10px;
  display: flex;
  align-items: center;
  font-size: 18px;
  &.left {
    position: static !important;
    margin: -5px 0px 0px 10px;
    .extra-image {
      width: 30px;
      height: 10px;
    }
  }
  .share-tag {
    box-sizing: border-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    position: relative;
    border-radius: 4px;
    margin-left: 4px;
    padding: 0 4px;
    font-size: 12px !important;
    line-height: 18px;
    color: #ffffff;
    &::before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      left: -3px;
      top: 2px;
      border-left: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-right: 6px solid;
    }
    span {
      margin-top: -1px;
    }
  }
  .tag {
    &-new {
      background-color: #e3a11d;
      &::before {
        border-right-color: #e3a11d;
      }
    }
    &-hot {
      background-color: #ba202d;
      &::before {
        border-right-color: #ba202d;
      }
    }
    &-soon {
      background-color: #1c64cc;
      &::before {
        border-right-color: #1c64cc;
      }
    }
  }
}
</style>
