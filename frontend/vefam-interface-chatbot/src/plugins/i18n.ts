// Quốc tế hóa thư viện nhiều thành phần tương thích với quốc tế hóa dự án địa phương
import { App, WritableComputedRef } from "vue";
import type { StorageConfigs } from "/#/index";
import { storageLocal } from "@pureadmin/utils";
import { type I18n, createI18n } from "vue-i18n";
import { fromPairs, toPairs } from "lodash-unified";
import { nullCoalescing } from "/@/utils";

// element-plus internationalization
import enLocale from "element-plus/lib/locale/lang/en";
import zhLocale from "element-plus/lib/locale/lang/zh-cn";

function siphonI18n(prefix = "en") {
  return fromPairs(
    toPairs(import.meta.glob("../../locales/*.y(a)?ml", { eager: true })).map(
      ([key, value]: any) => {
        const matched = key.match(/([A-Za-z0-9-_]+)\./i)[1];
        return [matched, value.default];
      }
    )
  )[prefix];
}

export const localesConfigs = {
  zh: {
    ...siphonI18n("zh-CN"),
    ...zhLocale
  },
  en: {
    ...siphonI18n("en"),
    ...enLocale
  }
};

/**
 * Chức năng công cụ chuyển đổi quốc tế hóa (tự động đọc tệp trong thư mục ngôn ngữ của thư mục gốc để đối sánh quốc tế hóa)
 * @param message message
 * @returns Tin nhắn được chuyển đổi
 */
export function transformI18n(message: any = "") {
  if (!message) {
    return "";
  }

  // Xử lý tiêu đề, định dạng để lưu trữ định tuyến động {zh:"",en:""}
  if (typeof message === "object") {
    const locale: string | WritableComputedRef<string> | any =
      i18n.global.locale;
    return message[locale && locale.value];
  }

  const key = message.match(/(\S*)\./) && message.match(/(\S*)\./)[1];
  if (key && Object.keys(siphonI18n("en")).includes(key)) {
    return i18n.global.t.call(i18n.global.locale, message);
  } else if (!key && Object.keys(siphonI18n("en")).includes(message)) {
    // Tương thích với các hình thức quốc tế hóa không lồng ghép
    return i18n.global.t.call(i18n.global.locale, message);
  } else {
    return message;
  }
}

// Chức năng này chỉ được sử dụng với trình cắm i18n Ally cho lời nhắc thông minh quốc tế hóa và không có ý nghĩa thực tế (chỉ dành cho lời nhắc),
// nếu bạn không cần quốc tế hóa, bạn có thể xóa nó
export const $t = (key: string) => key;

const rl = storageLocal.getItem<StorageConfigs>("responsive-locale");
export const i18n: I18n = createI18n({
  legacy: false,
  locale: nullCoalescing(rl && rl.locale, "en"),
  fallbackLocale: "en",
  messages: localesConfigs
});

export function useI18n(app: App) {
  app.use(i18n);
}
