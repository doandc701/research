import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { routerArrays } from "../types";
import { useGlobal } from "@pureadmin/utils";
import { useMultiTagsStore } from "/@/store/modules/multiTags";
import { nullCoalescing } from "/@/utils";

export function useLayout() {
  const { $storage, $config } = useGlobal<GlobalPropertiesApi>();

  const initStorage = () => {
    /** routing */
    if (
      useMultiTagsStore().multiTagsCache &&
      (!$storage.tags || $storage.tags.length === 0)
    ) {
      $storage.tags = routerArrays;
    }
    /** globalization */
    if (!$storage.locale) {
      $storage.locale = {
        locale: nullCoalescing($config && $config.Locale, "en")
      };
      useI18n().locale.value = nullCoalescing($config && $config.Locale, "en");
    }
    /** navigation */
    if (!$storage.layout) {
      $storage.layout = {
        layout: nullCoalescing($config && $config.Layout, "vertical"),
        theme: nullCoalescing($config && $config.Theme, "default"),
        darkMode: nullCoalescing($config && $config.DarkMode, false),
        sidebarStatus: nullCoalescing($config && $config.SidebarStatus, true),
        epThemeColor: nullCoalescing($config && $config.EpThemeColor, "#409EFF")
      };
    }
    /** Gray Mode, Color Weak Mode, Hidden Tabs */
    if (!$storage.configure) {
      $storage.configure = {
        grey: nullCoalescing($config && $config.Grey, false),
        weak: nullCoalescing($config && $config.Weak, false),
        hideTabs: nullCoalescing($config && $config.HideTabs, false),
        showLogo: nullCoalescing($config && $config.ShowLogo, true),
        showModel: nullCoalescing($config && $config.ShowModel, "smart"),
        multiTagsCache: nullCoalescing($config && $config.MultiTagsCache, false)
      };
    }
  };

  /** Sau khi xóa bộ nhớ cache, hãy đọc cấu hình mặc định từ serverConfig.json và gán nó vào bộ nhớ */
  const layout = computed(() => {
    return $storage.layout.layout;
  });

  const layoutTheme = computed(() => {
    return $storage.layout;
  });

  return {
    layout,
    layoutTheme,
    initStorage
  };
}
