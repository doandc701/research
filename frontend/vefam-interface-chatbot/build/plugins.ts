import { resolve } from "path";
import Unocss from "unocss/vite";
import vue from "@vitejs/plugin-vue";
import { viteBuildInfo } from "./info";
import svgLoader from "vite-svg-loader";
import legacy from "@vitejs/plugin-legacy";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { viteMockServe } from "vite-plugin-mock";
import VueI18n from "@intlify/vite-plugin-vue-i18n";
import { visualizer } from "rollup-plugin-visualizer";
import removeConsole from "vite-plugin-remove-console";
import themePreprocessorPlugin from "@pureadmin/theme";
import { genScssMultipleScopeVars } from "/@/layout/theme";
import DefineOptions from "unplugin-vue-define-options/vite";

export function getPluginsList(command, VITE_LEGACY) {
  const prodMock = true;
  const lifecycle = process.env.npm_lifecycle_event;
  return [
    vue(),
    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [resolve("locales/**")]
    }),
    // jsx, tsx Syntax support
    vueJsx(),
    Unocss(),
    DefineOptions(),
    // Online environment delete console
    removeConsole({ external: ["src/assets/iconfont/iconfont.js"] }),
    viteBuildInfo(),
    // custom theme
    themePreprocessorPlugin({
      scss: {
        multipleScopeVars: genScssMultipleScopeVars(),
        // Whether to extract independent theme css files in production mode, extract is true and the following properties are valid
        extract: true,
        // The theme css file corresponding to defaultScopeName will be selected to add link in html
        themeLinkTagId: "head",
        // "head"||"head-prepend" || "body" ||"body-prepend"
        themeLinkTagInjectTo: "head",
        // Whether to remove the weight class name corresponding to scopeName in the extracted css file
        removeCssScopeName: false
      }
    }),
    // svg componentization support
    svgLoader(),
    // mock support
    viteMockServe({
      mockPath: "mock",
      localEnabled: command === "serve",
      prodEnabled: command !== "serve" && prodMock,
      injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `,
      logger: false
    }),
    // Whether to provide legacy browser compatibility support for packaged files
    VITE_LEGACY
      ? legacy({
          targets: ["ie >= 11"],
          additionalLegacyPolyfills: ["regenerator-runtime/runtime"]
        })
      : null,
    // Packaging Analysis
    lifecycle === "report"
      ? visualizer({ open: true, brotliSize: true, filename: "report.html" })
      : null
  ];
}
