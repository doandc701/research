import { ElMessage } from "element-plus";
import copy from "copy-to-clipboard";
import BigNumber from "bignumber.js";
import * as _ from "lodash-unified";
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
export function nullCoalescing(a: any, b: any) {
  return a !== null && a !== undefined ? a : b;
}

/**
 * MathMax for BigNumber
 */
export function MathMaxBN(a: BigNumber, b: BigNumber) {
  return a.gt(b) ? a : b;
}

/**
 * Deep diff between two object-likes
 * @param  {Object} fromObject the original object
 * @param  {Object} toObject   the updated object
 * @return {Object}            a new object which represents the diff
 */

export function deepDiff(fromObject: Indexable, toObject: Indexable): Indexable {
  const changes = {};
  const buildPath = (path: string, /* obj, */ key: string) => _.isUndefined(path) ? key : `${path}.${key}`;

  const walk = (fromObject: Indexable, toObject: Indexable, path: string) => {
    for (const key of _.keys(fromObject)) {
      const currentPath = buildPath(path, /* fromObject, */ key);
      if (!_.has(toObject, key)) {
        changes[currentPath] = {from: _.get(fromObject, key)};
      }
    }
    for (const [key, to] of _.entries(toObject)) {
      const currentPath = buildPath(path, /* toObject, */ key);
      if (!_.has(fromObject, key)) {
        changes[currentPath] = {to};
      } else {
        const from = _.get(fromObject, key);
        if (!_.isEqual(from, to)) {
          if (_.isObjectLike(to) && _.isObjectLike(from)) {
            walk(from, to, currentPath);
          } else {
            changes[currentPath] = {from, to};
          }
        }
      }
    }
  };
  walk(fromObject, toObject, undefined);
  return changes;
}

/**
 * Update Object by prop (key|path)
 * Tham khảo lodash _.set() có thể giải quyết vấn đề tương tự như method này
 * nhưng không thể delete item khi value = undefined
 */
export function updateObjectByProp(obj: Indexable, prop: string, value: any): void {
  // property not found
  if (typeof obj === "undefined") return;
  // index of next property split
  const _index = prop.indexOf(".");
  // property split found; recursive call
  if (_index > -1) {
    // get object at property (before split), pass on remainder
    return updateObjectByProp(
      obj[prop.substring(0, _index)],
      prop.substr(_index + 1),
      value
    );
  }
  // no split; get property
  if (value !== undefined) {
    const _prop = _.isArray(obj) ? parseInt(prop) : prop;
    obj[_prop] = value;
    /* Object.defineProperty(obj, prop, {
      value: value,
      writable: false
    }); */
  } else {
    if (_.isArray(obj)) {
      obj.splice(parseInt(prop), 1);
    } else {
      delete obj[prop];
    }
  }
}

/* 
export const deepDiffMapper = (function () {
  return {
    VALUE_CREATED: "created",
    VALUE_UPDATED: "updated",
    VALUE_DELETED: "deleted",
    VALUE_UNCHANGED: "unchanged",
    map: function (obj1, obj2) {
      if (this.isFunction(obj1) || this.isFunction(obj2)) {
        throw "Invalid argument. Function given, object expected.";
      }
      if (this.isValue(obj1) || this.isValue(obj2)) {
        // if (this.compareValues(obj1, obj2) == "unchanged") {
        //   obj1 = "";
        // }
        return {
          type: this.compareValues(obj1, obj2),
          data: obj1 === undefined ? obj2 : obj1
        };
      }

      const diff = {};
      for (const key in obj1) {
        if (this.isFunction(obj1[key])) {
          continue;
        }

        let value2 = undefined;
        if (obj2[key] !== undefined) {
          value2 = obj2[key];
        }

        diff[key] = this.map(obj1[key], value2);
        // const a = this.map(obj1[key]);
        console.log(this.map(obj1[key], value2));
        // console.log(this.map(obj1[key].type));
        // if (this.map(obj1[key].type)) {
        //   console.log("111");
        // }
      }

      for (const key in obj2) {
        if (this.isFunction(obj2[key]) || diff[key] !== undefined) {
          continue;
        }

        diff[key] = this.map(undefined, obj2[key]);
      }

      // if (this.isValue(obj1) || this.isValue(obj2)) {
      //   if (this.compareValues(obj1, obj2) == "unchanged") {
      //     obj2 = "";
      //   }
      // }
      // console.log("lllll", diff);

      return diff;
    },
    compareValues: function (value1, value2) {
      if (value1 === value2) {
        return this.VALUE_UNCHANGED;
      }
      if (
        this.isDate(value1) &&
        this.isDate(value2) &&
        value1.getTime() === value2.getTime()
      ) {
        return this.VALUE_UNCHANGED;
      }
      if (value2 === undefined) {
        return this.VALUE_CREATED;
      }
      if (value1 === undefined) {
        return this.VALUE_DELETED;
      }
      return this.VALUE_UPDATED;
    },
    isFunction: function (x) {
      return Object.prototype.toString.call(x) === "[object Function]";
    },
    isArray: function (x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    },
    isDate: function (x) {
      return Object.prototype.toString.call(x) === "[object Date]";
    },
    isObject: function (x) {
      return Object.prototype.toString.call(x) === "[object Object]";
    },
    isValue: function (x) {
      return !this.isObject(x) && !this.isArray(x);
    }
  };
})();

export function compareValue(val1, val2) {
  let isSame = true;
  for (const p in val1) {
    if (typeof val1[p] === "object") {
      const objectValue1 = val1[p],
        objectValue2 = val2[p];
      for (const value in objectValue1) {
        isSame = compareValue(objectValue1[value], objectValue2[value]);
        if (isSame === false) {
          return false;
        }
      }
    } else {
      if (val1 !== val2) {
        isSame = false;
      }
    }
  }
  return isSame;
} */

/* export const takeKeyObj = function () {
  return {
    map: function (obj1, obj2, key1, key2) {
      if (this.isValue(key1) || this.isValue(key2)) {
        return {};
      }
      const findKey = {};
      for (const key in obj1) {
        if (this.isFunction(obj1[key])) {
          continue;
        }
        let value2 = undefined;
        if (obj2[key] !== undefined) {
          value2 = obj2[key];
        }

        findKey[key] = this.map(obj1[key], value2);
        console.log(this.findkey);
      }
    }
  };
}; */
