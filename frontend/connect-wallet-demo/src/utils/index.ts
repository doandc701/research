import { ElMessage } from "element-plus";
import copy from "copy-to-clipboard";
import { $t, transformI18n } from "/@/plugins/i18n";
// import { useI18n } from "vue-i18n";
// const { t } = useI18n();

export function copyText(mss: string) {
  copy(mss);
  ElMessage({
    message: transformI18n($t("message.copySuccessfully")), // t("message.copySuccessfully")
    type: "success",
    duration: 1000
  });
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string") {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), "/");
      }
    }

    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

export function timestampToUTC(timestamp: number) {
  const t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(timestamp);
  return parseTime(t, "{y}-{m}-{d} {h}:{i}:{m}");
}

/* thay thế cho c = a ?? b <=> c = null_coalescing(a, b)
toán tử ?? khác với || trong một số trường hợp
Toán tử ?? trả về biểu thức bên trái nếu nó khác null && undefined,
trả về biểu thức bên phải nếu nó là null hoặc undefined
*/
export function nullCoalescing(a, b) {
  return a !== null && a !== undefined ? a : b;
}
