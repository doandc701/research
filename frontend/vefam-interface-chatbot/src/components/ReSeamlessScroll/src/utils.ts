/**
 * @desc AnimationFrame đơn giản và tương thích với hack
 */
export const animationFrame = () => {
  window.cancelAnimationFrame = (() => {
    return (
      window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      window.msCancelAnimationFrame ||
      function (id) {
        return window.clearTimeout(id);
      }
    );
  })();
  window.requestAnimationFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  })();
};

/**
 * @desc Kiểm tra xem các mảng có bằng nhau không
 * @return {Boolean}
 * @param arr1
 * @param arr2
 */
export const arrayEqual = (arr1: Array<any>, arr2: Array<any>) => {
  if (arr1 === arr2) return true;
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

/**
 * @desc Deep and shallow merge copy
 */
export function copyObj() {
  if (!Array.isArray) {
    // @ts-expect-error
    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === "[object Array]";
    };
  }
  let name,
    options,
    src,
    copy,
    copyIsArray,
    clone,
    i = 1,
    // eslint-disable-next-line prefer-rest-params
    target = arguments[0] || {}, // Sử dụng toán tử || để loại trừ các kiểu dữ liệu bị ép buộc hoàn toàn thành false
    deep = false,
    // eslint-disable-next-line prefer-const
    len = arguments.length;
  if (typeof target === "boolean") {
    deep = target;
    // eslint-disable-next-line prefer-rest-params
    target = arguments[1] || {};
    i++;
  }
  if (typeof target !== "object" && typeof target !== "function") {
    target = {};
  }
  // nếu arguments.length === 1 hoặc typeof arguments[0] === 'boolean', and there are arguments[1], the target object is returned directly
  if (i === len) {
    return target;
  }
  for (; i < len; i++) {
    // Vì vậy, nếu kiểu dữ liệu trong đối tượng nguồn là Không xác định hoặc Null, vòng lặp này sẽ bị bỏ qua và sau đó đối tượng nguồn tiếp theo sẽ được lặp lại
    // eslint-disable-next-line prefer-rest-params
    if ((options = arguments[i]) != null) {
      // Nếu kiểu dữ liệu của đối tượng nguồn là Boolean, thì số vòng lặp for in sẽ bị bỏ qua và vòng lặp for in sẽ không được thực thi // src được sử dụng để xác định xem target có thuộc tính name hay không
      for (name in options) {
        // src được sử dụng để xác định xem target có thuộc tính name hay không
        src = target[name];
        // Thuộc tính được sao chép Thuộc tính name của đối tượng nguồn hiện tại
        copy = options[name];
        // Xác định xem bản sao có phải là một mảng hay không
        copyIsArray = Array.isArray(copy);
        // Nếu đó là một deep copy và bản sao là một đối tượng hoặc một mảng, thì cần phải đệ quy cho đến khi bản sao trở thành một kiểu dữ liệu nguyên thủy
        if (deep && copy && (typeof copy === "object" || copyIsArray)) {
          if (copyIsArray) {
            copyIsArray = false;
            // Nếu đối tượng đích có thuộc tính name và là một mảng
            // sau đó sử dụng thuộc tính name của đối tượng đích, nếu không, hãy tạo lại một mảng để sao chép
            clone = src && Array.isArray(src) ? src : [];
          } else {
            // Nếu đối tượng đích có thuộc tính name và là một đối tượng, hãy sử dụng thuộc tính name của đối tượng đích, nếu không, hãy tạo lại một đối tượng để sao chép
            clone = src && typeof src === "object" ? src : {};
          }
          // deep copy, vì vậy hàm copyObject được gọi một cách đệ quy
          // Giá trị trả về là đối tượng đích, là đối tượng nhân bản
          // copy is a source object
          // @ts-expect-error
          target[name] = copyObj(deep, clone, copy);
        } else if (copy !== undefined) {
          // Shallow copy, copy directly to the target object
          target[name] = copy;
        }
      }
    }
  }
  return target;
}
