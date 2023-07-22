import App from "./App.vue";
import router from "./router";
import { setupStore } from "/@/store";
import ElementPlus from "element-plus";
import { getServerConfig } from "./config";
import { createApp, Directive } from "vue";
import { useI18n } from "../src/plugins/i18n";
import { MotionPlugin } from "@vueuse/motion";
import { useEcharts } from "/@/plugins/echarts";
import VirtualScroller from "vue-virtual-scroller";
import { useTable } from "../src/plugins/vxe-table";
import { injectResponsiveStorage } from "/@/utils/responsive";
import VueCountdown from "@chenfengyuan/vue-countdown";

import Table from "@pureadmin/table";
import PureDescriptions from "@pureadmin/descriptions";
// new
import Connex from "@vechain/connex";
import VueGtag from "vue-gtag";
import DAccount from "/@/contractCall/dAccount";
// import { loadEnv } from "@build/index";
import { settings, dAccountAddr } from "./settings";

// const { VITE_APP_NETWORK } = loadEnv();
// console.log(
//   "VUE_APP_NETWORK",
//   settings.appName,
//   settings.network,
//   getExplorers()
// );

import "uno.css";
import "animate.css";
// Introduce reset styles
import "./style/reset.scss";
// Import public styles
import "./style/index.scss";
import "element-plus/dist/index.css";
import "@pureadmin/components/dist/index.css";
import "@pureadmin/components/dist/theme.css";
import "@pureadmin/components/dist/dark.scss";
// Import font icons
import "./assets/iconfont/iconfont.js";
import "./assets/iconfont/iconfont.css";
import "v-contextmenu/dist/themes/default.css";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

const app = createApp(App);

// new
const connex = new Connex({
  node: settings.node,
  network: settings.network
});
app.config.globalProperties.$connex = connex;

const dAccount = new DAccount(dAccountAddr, connex);
app.config.globalProperties.$dAccount = dAccount;

// custom directive
import * as directives from "/@/directives";
Object.keys(directives).forEach(key => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

// Register the `@iconify/vue` icon library globally
import {
  IconifyIconOffline,
  IconifyIconOnline,
  FontIcon
} from "./components/ReIcon";
app.component("IconifyIconOffline", IconifyIconOffline);
app.component("IconifyIconOnline", IconifyIconOnline);
app.component("FontIcon", FontIcon);
app.component(VueCountdown.name, VueCountdown);

getServerConfig(app).then(async config => {
  app.use(router);
  await router.isReady();
  injectResponsiveStorage(app, config);
  setupStore(app);
  app
    .use(MotionPlugin)
    .use(useI18n)
    .use(ElementPlus)
    .use(Table)
    .use(PureDescriptions)
    .use(useTable)
    .use(useEcharts)
    .use(VirtualScroller)
    .use(
      VueGtag,
      {
        config: { id: "G-NNM3PMFCBF" } // vefam.com
      },
      router
    );
  app.mount("#app");
});
