// responsive storage
import { App } from "vue";
import Storage from "responsive-storage";
import { routerArrays } from "/@/layout/types";
import { nullCoalescing } from "/@/utils";

const nameSpace = "responsive-";

export const injectResponsiveStorage = (app: App, config: ServerConfigs) => {
  const configObj = Object.assign(
    {
      // Internationalization Default en
      locale: nullCoalescing(Storage.getData("locale", nameSpace), {
        locale: nullCoalescing(config.Locale, "en")
      }),
      // chế độ bố cục và chủ đề
      layout: nullCoalescing(Storage.getData("layout", nameSpace), {
        layout: nullCoalescing(config.Layout, "vertical"),
        theme: nullCoalescing(config.Theme, "default"),
        darkMode: nullCoalescing(config.DarkMode, false),
        sidebarStatus: nullCoalescing(config.SidebarStatus, true),
        epThemeColor: nullCoalescing(config.EpThemeColor, "#409EFF")
      }),
      configure: nullCoalescing(Storage.getData("configure", nameSpace), {
        grey: nullCoalescing(config.Grey, false),
        weak: nullCoalescing(config.Weak, false),
        hideTabs: nullCoalescing(config.HideTabs, false),
        showLogo: nullCoalescing(config.ShowLogo, true),
        showModel: nullCoalescing(config.ShowModel, "smart"),
        multiTagsCache: nullCoalescing(config.MultiTagsCache, false)
      })
    },
    config.MultiTagsCache
      ? {
          // Thẻ trang chủ được hiển thị theo mặc định
          tags: nullCoalescing(Storage.getData("tags", nameSpace), routerArrays)
        }
      : {}
  );

  app.use(Storage, { nameSpace, memory: configObj });
};
