import { ref } from "vue";
import { getConfig } from "/@/config";
import { find } from "lodash-unified";
import { useLayout } from "./useLayout";
import { themeColorsType } from "../types";
import { TinyColor } from "@ctrl/tinycolor";
import { useGlobal } from "@pureadmin/utils";
import { useEpThemeStoreHook } from "/@/store/modules/epTheme";
import {
  darken,
  lighten,
  toggleTheme
} from "@pureadmin/theme/dist/browser-utils";

export function useDataThemeChange() {
  const { layoutTheme } = useLayout();
  const themeColors = ref<Array<themeColorsType>>([
    /* Dodge Blue (default) */
    { color: "#1b2a47", themeColor: "default" },
    /* bright white */
    { color: "#ffffff", themeColor: "light" },
    /* scarlet */
    { color: "#f5222d", themeColor: "dusk" },
    /* orange red */
    { color: "#fa541c", themeColor: "volcano" },
    /* gold */
    { color: "#fadb14", themeColor: "yellow" },
    /* emerald */
    { color: "#13c2c2", themeColor: "mingQing" },
    /* lime green */
    { color: "#52c41a", themeColor: "auroraGreen" },
    /* dark pink */
    { color: "#eb2f96", themeColor: "pink" },
    /* deep violet */
    { color: "#722ed1", themeColor: "saucePurple" }
  ]);

  const { $storage } = useGlobal<GlobalPropertiesApi>();

  const body = document.documentElement as HTMLElement;

  /** Set the navigation theme color */
  function setLayoutThemeColor(theme = "default") {
    layoutTheme.value.theme = theme;
    toggleTheme({
      scopeName: `layout-theme-${theme}`
    });
    $storage.layout.theme = theme;
    $storage.layout.darkMode = dataTheme.value;

    if (theme === "default" || theme === "light") {
      setEpThemeColor(getConfig().EpThemeColor);
    } else {
      const colors = find(themeColors.value, { themeColor: theme });
      setEpThemeColor(colors.color);
    }
  }

  /**
   * @description Automatically calculate hover and active colors
   * @see {@link https://element-plus.org/zh-CN/component/button.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A2%9C%E8%89%B2}
   */
  const shadeBgColor = (color: string): string => {
    return new TinyColor(color).shade(10).toString();
  };

  /** Set ep theme color */
  const setEpThemeColor = (color: string) => {
    useEpThemeStoreHook().setEpThemeColor(color);
    body.style.setProperty("--el-color-primary-active", shadeBgColor(color));
    document.documentElement.style.setProperty("--el-color-primary", color);
    for (let i = 1; i <= 9; i++) {
      document.documentElement.style.setProperty(
        `--el-color-primary-light-${i}`,
        lighten(color, i / 10)
      );
    }
    for (let i = 1; i <= 2; i++) {
      document.documentElement.style.setProperty(
        `--el-color-primary-dark-${i}`,
        darken(color, i / 10)
      );
    }
  };
  const dataTheme = ref<boolean>(
    $storage && $storage.layout && $storage.layout.darkMode
  );

  /** Day and night theme switching */
  function dataThemeChange() {
    /* Nếu hiện tại là chủ đề đêm ánh sáng, hãy chuyển sang chủ đề mặc định theo mặc định */
    if (useEpThemeStoreHook().epTheme === "light" && dataTheme.value) {
      setLayoutThemeColor("default");
    } else {
      setLayoutThemeColor(useEpThemeStoreHook().epTheme);
    }

    if (dataTheme.value) {
      $storage.layout.darkMode = true;
      document.documentElement.classList.add("dark");
    } else {
      $storage.layout.darkMode = false;
      document.documentElement.classList.remove("dark");
    }
  }

  return {
    body,
    dataTheme,
    layoutTheme,
    themeColors,
    dataThemeChange,
    setEpThemeColor,
    setLayoutThemeColor
  };
}
