import { store } from "/@/store";
import { appType } from "./types";
import { defineStore } from "pinia";
import { getConfig } from "/@/config";
import type { StorageConfigs } from "/#/index";
import { deviceDetection, storageLocal } from "@pureadmin/utils";
import { TokenDetails } from "/@/types/collection";
import { useUserStoreHook } from "/@/store/modules/user";
import ERC20 from "/@/contractCall/ERC20";
import { useGlobal } from "@pureadmin/utils";
import { nullCoalescing } from "/@/utils";
import { network } from "/@/settings";
import tokenList from "/@/static/tokenList.json";

const rl = storageLocal.getItem<StorageConfigs>("responsive-layout");
export const useAppStore = defineStore({
  id: "pure-app",
  state: (): appType => ({
    sidebar: {
      opened: nullCoalescing(rl && rl.sidebarStatus, getConfig().SidebarStatus),
      withoutAnimation: false,
      isClickCollapse: false
    },
    // Bố cục ở đây được sử dụng để khôi phục chế độ điều hướng tương ứng sau khi nghe vùng chứa drag
    layout: nullCoalescing(rl && rl.layout, getConfig().Layout),
    device: deviceDetection() ? "mobile" : "desktop",
    started: Date.now(),
    tokenList: tokenList[network],
    $connex: useGlobal<GlobalPropertiesApi>().$connex
  }),
  getters: {
    getSidebarStatus() {
      return this.sidebar.opened;
    },
    getDevice() {
      return this.device;
    }
  },
  actions: {
    TOGGLE_SIDEBAR(opened?: boolean, resize?: string) {
      const layout = storageLocal.getItem<StorageConfigs>("responsive-layout");
      if (opened && resize) {
        this.sidebar.withoutAnimation = true;
        this.sidebar.opened = true;
        layout.sidebarStatus = true;
      } else if (!opened && resize) {
        this.sidebar.withoutAnimation = true;
        this.sidebar.opened = false;
        layout.sidebarStatus = false;
      } else if (!opened && !resize) {
        this.sidebar.withoutAnimation = false;
        this.sidebar.opened = !this.sidebar.opened;
        this.sidebar.isClickCollapse = !this.sidebar.opened;
        layout.sidebarStatus = this.sidebar.opened;
      }
      storageLocal.setItem("responsive-layout", layout);
    },
    toggleSideBar(opened?: boolean, resize?: string) {
      // alert("A:" + opened + "-" + resize);
      this.TOGGLE_SIDEBAR(opened, resize);
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    setLayout(layout) {
      this.layout = layout;
    },
    // fetch balance của các token
    async updateTokenList(): Promise<void> {
      const myAddr = useUserStoreHook().dAccount.myAddr;
      // console.log("tokenList", this.tokenList);
      // console.log("this.$connex", this.$connex);
      const _exceptList = ["VET", "VTHO"];
      const requests = this.tokenList.map(item => {
        if (_exceptList.includes(item.symbol) === false) {
          // console.log("item.address", item.address);
          try {
            return new ERC20(item.address, this.$connex)
              .balanceOf(myAddr as string)
              .catch(e => {
                console.log(`Load all balanceOf ${item.symbol}`, e);
              });
          } catch (e) {
            console.log("e:", e);
          }
        }
      });
      // console.log("requests:", requests);
      await Promise.all(requests)
        .then(result => {
          this.tokenList.map((item: TokenDetails, index: number) => {
            if (_exceptList.includes(item.symbol) === false) {
              item.balanceOf = result[index] as string;
            }
          });
        })
        .catch(function (e) {
          console.log("Load all balanceOf error", e);
        });
    }
  }
});

export function useAppStoreHook() {
  return useAppStore(store);
}
