<script setup lang="ts">
import {
  h,
  watch,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount,
  defineComponent
} from "vue";
import { useRoute } from "vue-router";
import { ElMessageBox } from "element-plus";
import { setType } from "./types";
import { emitter } from "/@/utils/mitt";
import { Ticker } from "/@/utils/connex";
import { useLayout } from "./hooks/useLayout";
import { useAppStoreHook } from "/@/store/modules/app";
import { useSettingStoreHook } from "/@/store/modules/settings";
import { useUserStoreHook } from "/@/store/modules/user";
import { deviceDetection, useDark, useGlobal } from "@pureadmin/utils";
import { settings } from "/@/settings";
import { version } from "../../package.json";

import backTop from "/@/assets/svg/back_top.svg?component";
import fullScreen from "/@/assets/svg/full_screen.svg?component";
import exitScreen from "/@/assets/svg/exit_screen.svg?component";

import navbar from "./components/navbar.vue";
// import tag from "./components/tag/index.vue";
import appMain from "./components/appMain.vue";
import setting from "./components/setting/index.vue";
import Vertical from "./components/sidebar/vertical.vue";
import Horizontal from "./components/sidebar/horizontal.vue";
/*
Có 3 chế độ hiển thị menu:
Top:
  .header > .horizontal-header (sử dụng horizontal.vue)
    - horizontal-header-left: logo
    - menubar: main-menu
    - horizontal-header-right: right-menu
Left: sử dụng vertical.vue cho sidebar bên trái và navbar.vue cho header
  .sidebar-container (chính là file vertical.vue)
  .header > navbar
    - el-breadcrumb
    - vertical-header-right
Mix: sử dụng vertical.vue cho sidebar bên trái và navbar.vue cho header
  .sidebar-container (chính là file vertical.vue)
  .header > navbar
    - horizontal-header (import mixNav.vue vào navbar)
      - menubar
      - horizontal-header-right
*/
const { isDark } = useDark();
const { layout } = useLayout();
const isMobile = deviceDetection();
const pureSetting = useSettingStoreHook();
const { $config, $storage, $connex } = useGlobal<GlobalPropertiesApi>();

const set: setType = reactive({
  sidebar: computed(() => {
    return useAppStoreHook().sidebar;
  }),

  device: computed(() => {
    return useAppStoreHook().device;
  }),

  fixedHeader: computed(() => {
    return pureSetting.fixedHeader;
  }),

  classes: computed(() => {
    return {
      hideSidebar: !set.sidebar.opened,
      openSidebar: set.sidebar.opened,
      withoutAnimation: set.sidebar.withoutAnimation,
      mobile: set.device === "mobile"
    };
  }),

  hideTabs: computed(() => {
    return $storage.configure.hideTabs;
  })
});

const dAccountVisitor: Connex.Thor.Account.Visitor | null = computed(() => {
  if (useUserStoreHook().dAccount.myAddr) {
    return $connex.thor.account(useUserStoreHook().dAccount.myAddr);
  } else {
    return null;
  }
});

function setTheme(layoutModel: string) {
  window.document.body.setAttribute("layout", layoutModel);
  const sl = $storage.layout;
  $storage.layout = {
    layout: `${layoutModel}`,
    theme: sl && sl.theme,
    darkMode: sl && sl.darkMode,
    sidebarStatus: sl && sl.sidebarStatus,
    epThemeColor: sl && sl.epThemeColor
  };
}

function toggle(device: string, bool: boolean) {
  useAppStoreHook().toggleDevice(device);
  useAppStoreHook().toggleSideBar(bool, "resize-toggle");
}

const route = useRoute();
watch(route, newroute => {
  if (set.device === "mobile" && set.sidebar.opened)
    useAppStoreHook().toggleSideBar(false, "resize-route");
});

// so sánh 2 version string, eg: 1.2.3 > 1.1.4
// result: 0: bằng nhau, 1 lớn hơn, 2: nhỏ hơn
function compareVersion(vsStr01: string, vsStr02: string): number {
  const aArr = vsStr01.split(".").map(item => {
    return parseInt(item);
  });
  const bArr = vsStr02.split(".").map(item => {
    return parseInt(item);
  });
  let result = 0;
  const maxLength = Math.max(aArr.length, bArr.length);
  for (let i = 0; i < maxLength; i++) {
    const versionA = aArr[i] ? aArr[i] : 0;
    const versionB = bArr[i] ? bArr[i] : 0;
    if (versionA > versionB) {
      result = 1;
      break;
    } else if (versionA < versionB) {
      result = 2;
      break;
    }
  }
  return result;
}

function handleReload() {
  ElMessageBox.alert(
    "Website cached old version, Please click Reload or CTRL + F5 to refresh the page",
    "Warning",
    {
      autofocus: false,
      showClose: false,
      confirmButtonText: "Reload",
      type: "warning"
    }
  ).then(() => {
    window.location.reload(true);
  });
}

// Xác định xem có thể tự động đóng thanh menu hay không
let isAutoCloseSidebar = true;
let isMobile2 = false;

// listening container
emitter.on("resize", ({ detail }) => {
  // trên mobile bị resize khi mở sidebar nên tạm thêm code này
  // isMobile không hoạt động trên iphone nên thêm isMobile2
  if (isMobile || isMobile2) {
    setTheme("vertical"); // DeFiX add
    return;
  }
  let { width } = detail;
  width <= 760 ? setTheme("vertical") : setTheme(useAppStoreHook().layout);
  /** width app-wrapper class container width
   * 0 < width <= 760 hide sidebar
   * 760 < width <= 990 Collapse the sidebar
   * width > 990 expand sidebar
   */
  if (width > 0 && width <= 760) {
    toggle("mobile", false);
    isAutoCloseSidebar = true;
  } else if (width > 760 && width <= 990) {
    if (isAutoCloseSidebar) {
      toggle("desktop", false);
      isAutoCloseSidebar = false;
    }
  } else if (width > 990) {
    if (!set.sidebar.isClickCollapse) {
      toggle("desktop", true);
      isAutoCloseSidebar = true;
    }
  }
});
//
async function getAccountVis() {
  // console.log("dAccountVisitor", dAccountVisitor);
  if (dAccountVisitor.value) {
    // console.log("dAccountVisitor", dAccountVisitor.value.address);
    const acc = await dAccountVisitor.value.get();
    // console.log("acc", acc);
    useUserStoreHook().dAccount.VET = acc.balance;
    useUserStoreHook().dAccount.VTHO = acc.energy;
    useAppStoreHook().tokenList[0].balanceOf = acc.balance;
    useAppStoreHook().tokenList[1].balanceOf = acc.energy;
  } else {
    // console.log("acc----");
    useUserStoreHook().dAccount.VET = "";
    useUserStoreHook().dAccount.VTHO = "";
  }
}

//
function initTicker() {
  let ticker: Ticker | null = null;
  // this.addr = sessionStorage.getItem('addr') || ''
  // this.$state.address = this.addr
  const task = (): void => {
    if (ticker) {
      ticker.stop();
    }
    // if (!this.addr) return
    ticker = new Ticker($connex);
    ticker.tick(getAccountVis);
  };

  task();
}
//
async function onConnect() {
  try {
    const resp = await $connex.vendor
      .sign("cert", {
        purpose: "identification",
        payload: {
          type: "text",
          content: "Please select a wallet to grant access to DApp."
        }
      })
      .request();
    console.log(resp);
    useUserStoreHook().SET_ADDR(resp.annex.signer);
    getAccountVis();
    // this.addr = resp.annex.signer
    // this.$state.address = resp.annex.signer
    // sessionStorage.setItem('addr', this.addr)
    // this.$router.go(0) // reload current page
  } catch (error) {
    console.log(error);
  }
}
emitter.on("connectWallet", onConnect);

onMounted(() => {
  // if (isMobile) {
  // isMobile không hoạt động trên iphone nên kiểm tra window.innerWidth
  if (isMobile || window.innerWidth <= 760) {
    isMobile2 = true;
    toggle("mobile", false);
  }
  setTimeout(initTicker, 2000);
  // initTicker();

  // kiểm tra configVersion và packageVersion
  if (compareVersion($config.Version, version) === 1) {
    handleReload();
  }
});
onBeforeUnmount(() => {
  emitter.off("connectWallet", onConnect);
});

function onFullScreen() {
  pureSetting.hiddenSideBar
    ? pureSetting.changeSetting({ key: "hiddenSideBar", value: false })
    : pureSetting.changeSetting({ key: "hiddenSideBar", value: true });
}

const layoutHeader = defineComponent({
  render() {
    return h(
      "div",
      {
        class: { "fixed-header": set.fixedHeader },
        style: [
          set.hideTabs && layout.value.includes("horizontal")
            ? isDark.value
              ? "box-shadow: 0 1px 4px #0d0d0d"
              : "box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08)"
            : ""
        ]
      },
      {
        default: () => [
          !pureSetting.hiddenSideBar &&
          (layout.value.includes("vertical") || layout.value.includes("mix"))
            ? h(navbar)
            : h("div"),
          !pureSetting.hiddenSideBar && layout.value.includes("horizontal")
            ? h(Horizontal)
            : h("div"),
          h(
            // tag,
            {},
            {
              default: () => [
                h(
                  "span",
                  {
                    onClick: onFullScreen
                  },
                  {
                    default: () => [
                      !pureSetting.hiddenSideBar
                        ? h(fullScreen, { class: "dark:color-white" })
                        : h(exitScreen, { class: "dark:color-white" })
                    ]
                  }
                )
              ]
            }
          )
        ]
      }
    );
  }
});
</script>

<template>
  <div :class="['app-wrapper', set.classes]" v-resize>
    <div v-if="settings.network === 'test'" class="testnet">Testnet</div>
    <div
      v-show="
        set.device === 'mobile' &&
        set.sidebar.opened &&
        layout.includes('vertical')
      "
      class="app-mask"
      @click="useAppStoreHook().toggleSideBar()"
    />
    <Vertical
      v-show="
        !pureSetting.hiddenSideBar &&
        (layout.includes('vertical') || layout.includes('mix'))
      "
    />
    <div
      :class="[
        'main-container',
        pureSetting.hiddenSideBar ? 'main-hidden' : ''
      ]"
    >
      <div v-if="set.fixedHeader">
        <layout-header />
        <!-- Main content -->
        <app-main :fixed-header="set.fixedHeader" />
      </div>
      <el-scrollbar v-else>
        <el-backtop
          title="Back to the top"
          target=".main-container .el-scrollbar__wrap"
        >
          <backTop />
        </el-backtop>
        <layout-header />
        <!-- Main content -->
        <app-main :fixed-header="set.fixedHeader" />
      </el-scrollbar>
    </div>
    <!-- system settings -->
    <setting />
  </div>
</template>

<style lang="scss" scoped>
@mixin clearfix {
  &::after {
    content: "";
    display: table;
    clear: both;
  }
}

.app-wrapper {
  @include clearfix;

  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }

  .testnet {
    color: #f5222d;
    position: absolute;
    top: 0;
    left: 50px;
    z-index: 2000;
  }
}

.main-hidden {
  margin-left: 0 !important;
}

.app-mask {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.re-screen {
  margin-top: 12px;
}

// new (vefam)
@media screen and(max-width: 320px) {
  .app-wrapper {
    &.mobile.openSidebar {
      position: relative;
    }
  }
}
</style>
