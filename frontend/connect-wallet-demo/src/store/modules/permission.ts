import { defineStore } from "pinia";
import { store } from "/@/store";
import { cacheType } from "./types";
import { constantMenus } from "/@/router";
import { cloneDeep } from "lodash-unified";
import { RouteConfigs } from "/@/layout/types";
import { ascending, filterTree } from "/@/router/utils";

export const usePermissionStore = defineStore({
  id: "pure-permission",
  state: () => ({
    // menu được tạo bởi định tuyến tĩnh
    constantMenus,
    // Menu được tạo bởi định tuyến tổng thể (tĩnh + động)
    wholeMenus: [],
    // deep copy cây menu, không được đánh dấu bằng menu điều hướng
    menusTree: [],
    // danh sách button hiển thị các vai trò (authority) của user này
    buttonAuth: [],
    // cache page keepAlive
    cachePageList: []
  }),
  actions: {
    // @ tạo danh sách menu sau khi lấy được async routes
    asyncActionRoutes(routes) {
      if (this.wholeMenus.length > 0) return;
      // Lọc loại bỏ các routes có showLink = false trong meta
      this.wholeMenus = filterTree(
        ascending(this.constantMenus.concat(routes)) // Sắp xếp các routes theo thứ tự tăng dần của rank
      );
      // copy (tương tự như wholeMenus)
      this.menusTree = cloneDeep(
        filterTree(ascending(this.constantMenus.concat(routes)))
      );

      const getButtonAuth = (arrRoutes: Array<RouteConfigs>) => {
        if (!arrRoutes || !arrRoutes.length) return;
        arrRoutes.forEach((v: RouteConfigs) => {
          if (v.meta && v.meta.authority) {
            this.buttonAuth.push(...v.meta.authority);
          }
          if (v.children) {
            getButtonAuth(v.children);
          }
        });
      };

      getButtonAuth(this.wholeMenus);
      // console.log('this.buttonAuth', this.buttonAuth)
    },

    // @ sau khi lấy được routes mới từ server
    async changeSetting(routes) {
      await this.asyncActionRoutes(routes);
    },

    //
    cacheOperate({ mode, name }: cacheType) {
      switch (mode) {
        case "add":
          this.cachePageList.push(name);
          this.cachePageList = [...new Set(this.cachePageList)];
          break;
        case "delete":
          // eslint-disable-next-line no-case-declarations
          const delIndex = this.cachePageList.findIndex(v => v === name);
          delIndex !== -1 && this.cachePageList.splice(delIndex, 1);
          break;
      }
    },

    // @ Clear cached pages
    clearAllCachePage() {
      this.cachePageList = [];
    }
  }
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
