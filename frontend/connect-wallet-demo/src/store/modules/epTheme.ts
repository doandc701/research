import { store } from "/@/store";
import { defineStore } from "pinia";
import { getConfig } from "/@/config";
import type { StorageConfigs } from "/#/index";
import { storageLocal } from "@pureadmin/utils";
import { nullCoalescing } from "/@/utils";

const rl = storageLocal.getItem<StorageConfigs>("responsive-layout");
export const useEpThemeStore = defineStore({
  id: "pure-epTheme",
  state: () => ({
    epThemeColor: nullCoalescing(
      rl && rl.epThemeColor,
      getConfig().EpThemeColor
    ),
    epTheme: nullCoalescing(rl && rl.theme, getConfig().Theme)
  }),
  getters: {
    getEpThemeColor() {
      return this.epThemeColor;
    },
    // điền thuộc tính cho hamburger-svg trong chế độ điều hướng hỗn hợp
    fill() {
      if (this.epTheme === "light") {
        return "#409eff";
      } else if (this.epTheme === "yellow") {
        return "#d25f00";
      } else {
        return "#fff";
      }
    }
  },
  actions: {
    setEpThemeColor(newColor: string): void {
      const layout = storageLocal.getItem<StorageConfigs>("responsive-layout");
      this.epTheme = layout && layout.theme;
      this.epThemeColor = newColor;
      layout.epThemeColor = newColor;
      storageLocal.setItem("responsive-layout", layout);
    }
  }
});

export function useEpThemeStoreHook() {
  return useEpThemeStore(store);
}
