import { defineStore } from "pinia";
import { store } from "/@/store";
import { isEqual } from "lodash-unified";
import type { StorageConfigs } from "/#/index";
import { routerArrays } from "/@/layout/types";
import { multiType, positionType } from "./types";
import { isUrl, storageLocal } from "@pureadmin/utils";
import { nullCoalescing } from "/@/utils";

export const useMultiTagsStore = defineStore({
  id: "pure-multiTags",
  state: () => ({
    // Lưu trữ thông tin tab (thông tin định tuyến)
    multiTags: storageLocal.getItem<StorageConfigs>("responsive-configure")
      .multiTagsCache
      ? storageLocal.getItem<StorageConfigs>("responsive-tags")
      : [...routerArrays],
    multiTagsCache: storageLocal.getItem<StorageConfigs>("responsive-configure")
      .multiTagsCache
  }),
  getters: {
    getMultiTagsCache() {
      return this.multiTagsCache;
    }
  },
  actions: {
    multiTagsCacheChange(multiTagsCache: boolean) {
      this.multiTagsCache = multiTagsCache;
      if (multiTagsCache) {
        storageLocal.setItem("responsive-tags", this.multiTags);
      } else {
        storageLocal.removeItem("responsive-tags");
      }
    },
    tagsCache(multiTags) {
      this.getMultiTagsCache &&
        storageLocal.setItem("responsive-tags", multiTags);
    },
    handleTags<T>(
      mode: string,
      value?: T | multiType,
      position?: positionType
    ): T {
      switch (mode) {
        case "equal":
          this.multiTags = value;
          this.tagsCache(this.multiTags);
          break;
        case "push":
          {
            if (!value) return;
            const tagVal = value as multiType;
            if (isUrl(tagVal.name)) return;
            if (tagVal.meta && tagVal.meta.title.length === 0) return;
            const tagPath = tagVal.path;
            // Kiểm tra xem thẻ đã tồn tại chưa
            const tagHasExits = this.multiTags.some(tag => {
              return tag.path === tagPath;
            });

            // Xác định xem giá trị khóa truy vấn trong thẻ có bằng nhau hay không
            const tagQueryHasExits = this.multiTags.some(tag => {
              return isEqual(tag.query, tagVal.query);
            });

            if (tagHasExits && tagQueryHasExits) return;

            // const dynamicLevel = tagVal?.meta?.dynamicLevel ?? -1;
            const dynamicLevel = nullCoalescing(
              tagVal.meta && tagVal.meta.dynamicLevel,
              -1
            );
            if (dynamicLevel > 0) {
              // dynamicLevel Số lượng các tuyến động có thể được mở
              // Nhận số lượng tuyến động đã được mở và xác định xem nó có lớn hơn dynamicLevel hay không
              if (
                this.multiTags.filter(e => e && e.path === tagPath).length >=
                dynamicLevel
              ) {
                // close the first
                const index = this.multiTags.findIndex(
                  item => item && item.path === tagPath
                );
                index !== -1 && this.multiTags.splice(index, 1);
              }
            }
            this.multiTags.push(value);
            this.tagsCache(this.multiTags);
          }
          break;
        case "splice":
          if (!position) {
            const index = this.multiTags.findIndex(v => v.path === value);
            if (index === -1) return;
            this.multiTags.splice(index, 1);
          } else {
            this.multiTags.splice(position.startIndex, position.length);
          }
          this.tagsCache(this.multiTags);
          return this.multiTags;
        case "slice":
          return this.multiTags.slice(-1);
      }
    }
  }
});

export function useMultiTagsStoreHook() {
  return useMultiTagsStore(store);
}
