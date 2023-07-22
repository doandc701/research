import { store } from "/@/store";
import { appType } from "./types";
import { defineStore } from "pinia";
import { getConfig } from "/@/config";
import type { StorageConfigs } from "/#/index";
import { deviceDetection, storageLocal } from "@pureadmin/utils";
import { TokenDetails, FundingTokenDetails } from "/@/types/collection";
import tokenList from "/@/static/tokenList.json";
import { useUserStoreHook } from "/@/store/modules/user";
import ERC20 from "/@/contractCall/ERC20";
import { useGlobal } from "@pureadmin/utils";
import { nullCoalescing } from "/@/utils";
import { settings } from "/@/settings";
import { fundingBalances } from "/@/api/user";

const rl = storageLocal.getItem<StorageConfigs>("responsive-layout");
// console.log("getConfig", getConfig());
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
    tokenList: tokenList[settings.network] as TokenDetails[],
    $connex: useGlobal<GlobalPropertiesApi>().$connex,
    fundingWalletList: [] as FundingTokenDetails[],
    cAccVET: "" as string,
    cAccVPU: "" as string
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
      // console.log("tokenList", this.tokenList);
      // console.log("this.$connex", this.$connex);
      const _exceptList = ["VET", "VTHO"];
      const myAddr = useUserStoreHook().dAccount.myAddr;
      const requests = this.tokenList.map(item => {
        if (_exceptList.includes(item.symbol) === false) {
          // console.log("item.address", item.address);
          return new ERC20(item.address, this.$connex)
            .balanceOf(myAddr)
            .catch(e => {
              console.log(`Load all balanceOf ${item.symbol}`, e);
            });
        }
      });
      // console.log("requests:", requests);
      // await Promise.all(requests).catch(function (e) { console.log("Load all balanceOf error", e)});
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
    },
    async takeUserBalance() {
      const cALinkedCode = useUserStoreHook().cAccount.linkedCode;
      const cALinkedAddr = useUserStoreHook().cAccount.linkedAddr;
      if (!cALinkedCode || !cALinkedAddr) return;

      fundingBalances(`address=${cALinkedAddr}`)
        .then(result => {
          // console.log("fundingBalances-result", result);
          if (result.data && result.data.success) {
            this.fundingWalletList = result.data
              .fundingWallets as FundingTokenDetails[];
            this.cAccVET = this.fundingWalletList[0].balanceOf;
            this.cAccVPU = this.fundingWalletList[2].balanceOf;
          } else {
            this.fundingWalletList = [];
            this.cAccVET = "";
            this.cAccVPU = "";
          }
          // console.log("this.fundingWalletList", this.fundingWalletList);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
});

export function useAppStoreHook() {
  return useAppStore(store);
}
