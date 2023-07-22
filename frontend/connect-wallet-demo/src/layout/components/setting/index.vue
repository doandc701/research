<script setup lang="ts">
import {
  ref,
  unref,
  watch,
  reactive,
  computed,
  nextTick,
  useCssModule
} from "vue";
import { getConfig } from "/@/config";
import { useRouter } from "vue-router";
import panel from "../panel/index.vue";
import { emitter } from "/@/utils/mitt";
import { nullCoalescing } from "/@/utils";
import { templateRef } from "@vueuse/core";
import { routerArrays } from "/@/layout/types";
import { useNav } from "/@/layout/hooks/useNav";
import { useAppStoreHook } from "/@/store/modules/app";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { useDataThemeChange } from "/@/layout/hooks/useDataThemeChange";
import {
  useDark,
  debounce,
  useGlobal,
  storageLocal,
  storageSession
} from "@pureadmin/utils";
import { toggleTheme } from "@pureadmin/theme/dist/browser-utils";

import dayIcon from "/@/assets/svg/day.svg?component";
import darkIcon from "/@/assets/svg/dark.svg?component";

const router = useRouter();
const { device } = useNav();
const { isDark } = useDark();
const { isSelect } = useCssModule();
const { $storage } = useGlobal<GlobalPropertiesApi>();

const mixRef = templateRef<HTMLElement | null>("mixRef", null);
const verticalRef = templateRef<HTMLElement | null>("verticalRef", null);
const horizontalRef = templateRef<HTMLElement | null>("horizontalRef", null);

const {
  body,
  dataTheme,
  layoutTheme,
  themeColors,
  dataThemeChange,
  setEpThemeColor,
  setLayoutThemeColor
} = useDataThemeChange();

/* body add to layout attributes，Acting on src/style/sidebar.scss */
if (unref(layoutTheme)) {
  let layout = unref(layoutTheme).layout;
  let theme = unref(layoutTheme).theme;
  toggleTheme({
    scopeName: `layout-theme-${theme}`
  });
  setLayoutModel(layout);
}

/** Default smart mode */
// const markValue = ref($storage.configure?.showModel ?? "smart");

const logoVal = ref(
  nullCoalescing($storage.configure && $storage.configure.showLogo, true)
);

const settings = reactive({
  greyVal: $storage.configure.grey,
  weakVal: $storage.configure.weak,
  tabsVal: $storage.configure.hideTabs,
  showLogo: $storage.configure.showLogo,
  showModel: $storage.configure.showModel,
  multiTagsCache: $storage.configure.multiTagsCache
});

const getThemeColorStyle = computed(() => {
  return color => {
    return { background: color };
  };
});

/** Không hiển thị tùy chọn chuyển đổi màu trắng sáng khi trang web ở chế độ tối */
const showThemeColors = computed(() => {
  return themeColor => {
    return themeColor === "light" && isDark.value ? false : true;
  };
});

function storageConfigureChange<T>(key: string, val: T): void {
  const storageConfigure = $storage.configure;
  storageConfigure[key] = val;
  $storage.configure = storageConfigure;
}

function toggleClass(flag: boolean, clsName: string, target?: HTMLElement) {
  const targetEl = target || document.body;
  let { className } = targetEl;
  className = className.replace(clsName, "").trim();
  targetEl.className = flag ? `${className} ${clsName} ` : className;
}

/** Cài đặt chế độ xám */
const greyChange = (value): void => {
  toggleClass(settings.greyVal, "html-grey", document.querySelector("html"));
  storageConfigureChange("grey", value);
};

/** Cài đặt chế độ điểm yếu màu */
const weekChange = (value): void => {
  toggleClass(
    settings.weakVal,
    "html-weakness",
    document.querySelector("html")
  );
  storageConfigureChange("weak", value);
};

const tagsChange = () => {
  let showVal = settings.tabsVal;
  storageConfigureChange("hideTabs", showVal);
  emitter.emit("tagViewsChange", showVal as unknown as string);
};

/*
const multiTagsCacheChange = () => {
  let multiTagsCache = settings.multiTagsCache;
  storageConfigureChange("multiTagsCache", multiTagsCache);
  useMultiTagsStoreHook().multiTagsCacheChange(multiTagsCache);
};*/

/** Xóa bộ nhớ cache và quay lại trang đăng nhập */
function onReset() {
  router.push("/");
  const { Grey, Weak, MultiTagsCache, EpThemeColor, Layout } = getConfig();
  useAppStoreHook().setLayout(Layout);
  setEpThemeColor(EpThemeColor);
  useMultiTagsStoreHook().multiTagsCacheChange(MultiTagsCache);
  toggleClass(Grey, "html-grey", document.querySelector("html"));
  toggleClass(Weak, "html-weakness", document.querySelector("html"));
  useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
  storageLocal.clear();
  storageSession.clear();
}
/*
function onChange(label) {
  storageConfigureChange("showModel", label);
  emitter.emit("tagViewsShowModel", label);
}*/

/** sidebar logo */
function logoChange() {
  unref(logoVal)
    ? storageConfigureChange("showLogo", true)
    : storageConfigureChange("showLogo", false);
  emitter.emit("logoChange", unref(logoVal));
}

function setFalse(Doms): any {
  Doms.forEach(v => {
    toggleClass(false, isSelect, unref(v));
  });
}

watch($storage, ({ layout }) => {
  /* Đặt màu chủ đề wangeditorV5 */
  body.style.setProperty("--w-e-toolbar-active-color", layout["epThemeColor"]);
  switch (layout["layout"]) {
    case "vertical":
      toggleClass(true, isSelect, unref(verticalRef));
      debounce(setFalse([horizontalRef]), 50);
      debounce(setFalse([mixRef]), 50);
      break;
    case "horizontal":
      toggleClass(true, isSelect, unref(horizontalRef));
      debounce(setFalse([verticalRef]), 50);
      debounce(setFalse([mixRef]), 50);
      break;
    case "mix":
      toggleClass(true, isSelect, unref(mixRef));
      debounce(setFalse([verticalRef]), 50);
      debounce(setFalse([horizontalRef]), 50);
      break;
  }
});

/** Theme color Activation selection */
const getThemeColor = computed(() => {
  return current => {
    if (
      current === layoutTheme.value.theme &&
      layoutTheme.value.theme !== "light"
    ) {
      return "#fff";
    } else if (
      current === layoutTheme.value.theme &&
      layoutTheme.value.theme === "light"
    ) {
      return "#1d2b45";
    } else {
      return "transparent";
    }
  };
});

/** Set Navigation Mode */
function setLayoutModel(layout: string) {
  layoutTheme.value.layout = layout;
  window.document.body.setAttribute("layout", layout);
  $storage.layout = {
    layout,
    theme: layoutTheme.value.theme,
    darkMode: $storage.layout.darkMode,
    sidebarStatus: $storage.layout.sidebarStatus
  };
  useAppStoreHook().setLayout(layout);
}

/* Khởi tạo cấu hình dự án */
nextTick(() => {
  const dom = document.querySelector("html");
  if (dom) {
    settings.greyVal && dom.setAttribute("class", "html-grey");
    settings.weakVal && dom.setAttribute("class", "html-weakness");
  }
  settings.tabsVal && tagsChange();
  dataThemeChange();
});
</script>

<template>
  <panel>
    <el-divider>Theme</el-divider>
    <el-switch
      v-model="dataTheme"
      inline-prompt
      class="pure-datatheme"
      :active-icon="dayIcon"
      :inactive-icon="darkIcon"
      @change="dataThemeChange"
    />

    <div v-if="device !== 'mobile'">
      <el-divider>NavigationBarMode</el-divider>
      <ul class="pure-theme">
        <el-tooltip class="item" content="Left mode" placement="bottom">
          <li
            :class="layoutTheme.layout === 'vertical' ? $style.isSelect : ''"
            ref="verticalRef"
            @click="setLayoutModel('vertical')"
          >
            <div />
            <div />
          </li>
        </el-tooltip>

        <el-tooltip class="item" content="Top mode" placement="bottom">
          <li
            :class="layoutTheme.layout === 'horizontal' ? $style.isSelect : ''"
            ref="horizontalRef"
            @click="setLayoutModel('horizontal')"
          >
            <div />
            <div />
          </li>
        </el-tooltip>

        <el-tooltip class="item" content="Blend mode" placement="bottom">
          <li
            :class="layoutTheme.layout === 'mix' ? $style.isSelect : ''"
            ref="mixRef"
            @click="setLayoutModel('mix')"
          >
            <div />
            <div />
          </li>
        </el-tooltip>
      </ul>
    </div>

    <!-- <el-divider>Theme-Color</el-divider>
    <ul class="theme-color">
      <li
        v-for="(item, index) in themeColors"
        :key="index"
        v-show="showThemeColors(item.themeColor)"
        :style="getThemeColorStyle(item.color)"
        @click="setLayoutThemeColor(item.themeColor)"
      >
        <el-icon
          style="margin: 0.1em 0.1em 0 0"
          :size="17"
          :color="getThemeColor(item.themeColor)"
        >
          <IconifyIconOffline icon="check" />
        </el-icon>
      </li>
    </ul> -->

    <el-divider>InterfaceDisplay</el-divider>
    <ul class="setting">
      <li>
        <span>Gray mode</span>
        <el-switch
          v-model="settings.greyVal"
          inline-prompt
          inactive-color="#a6a6a6"
          active-text="On"
          inactive-text="Off"
          @change="greyChange"
        />
      </li>
      <li>
        <span>Color weakness mode</span>
        <el-switch
          v-model="settings.weakVal"
          inline-prompt
          inactive-color="#a6a6a6"
          active-text="On"
          inactive-text="Off"
          @change="weekChange"
        />
      </li>
      <!-- <li>
        <span>Hide tab</span>
        <el-switch
          v-model="settings.tabsVal"
          inline-prompt
          inactive-color="#a6a6a6"
          active-text="On"
          inactive-text="Off"
          @change="tagsChange"
        />
      </li> -->
      <li>
        <span>Sidebar logo</span>
        <el-switch
          v-model="logoVal"
          inline-prompt
          :active-value="true"
          :inactive-value="false"
          inactive-color="#a6a6a6"
          active-text="On"
          inactive-text="Off"
          @change="logoChange"
        />
      </li>
      <!-- <li>
        <span>Tab persistence</span>
        <el-switch
          v-model="settings.multiTagsCache"
          inline-prompt
          inactive-color="#a6a6a6"
          active-text="On"
          inactive-text="Off"
          @change="multiTagsCacheChange"
        />
      </li>

      <li>
        <span>Label style</span>
        <el-radio-group v-model="markValue" size="small" @change="onChange">
          <el-radio label="card">Card</el-radio>
          <el-radio label="smart">Smart</el-radio>
        </el-radio-group>
      </li> -->
    </ul>

    <el-divider />
    <el-button
      type="danger"
      style="width: 90%; margin: 24px 15px"
      @click="onReset"
    >
      <IconifyIconOffline
        icon="fa-sign-out"
        width="15"
        height="15"
        style="margin-right: 4px"
      />
      Clear cache and return to home page
    </el-button>
  </panel>
</template>

<style scoped module>
.isSelect {
  border: 2px solid var(--el-color-primary);
}
</style>

<style lang="scss" scoped>
.setting {
  width: 100%;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 25px;
  }
}

:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: 700;
  background-color: #1f2128;
  color: #fff;
}

.pure-datatheme {
  width: 100%;
  height: 50px;
  text-align: center;
  display: block;
  padding-top: 25px;
}

.pure-theme {
  margin-top: 25px;
  width: 100%;
  height: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  li {
    width: 18%;
    height: 45px;
    background: #f0f2f5;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border-radius: 4px;
    box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);

    &:nth-child(1) {
      div {
        &:nth-child(1) {
          width: 30%;
          height: 100%;
          background: #1b2a47;
        }

        &:nth-child(2) {
          width: 70%;
          height: 30%;
          top: 0;
          right: 0;
          background: #fff;
          box-shadow: 0 0 1px #888;
          position: absolute;
        }
      }
    }

    &:nth-child(2) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &:nth-child(3) {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }

        &:nth-child(2) {
          width: 30%;
          height: 70%;
          bottom: 0;
          left: 0;
          background: #fff;
          box-shadow: 0 0 1px #888;
          position: absolute;
        }
      }
    }
  }
}

.theme-color {
  width: 100%;
  height: 40px;
  margin-top: 20px;
  display: flex;
  justify-content: center;

  li {
    float: left;
    width: 20px;
    height: 20px;
    margin-top: 8px;
    margin-right: 8px;
    font-weight: 700;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:nth-child(2) {
      border: 1px solid #ddd;
    }
  }
}
</style>
