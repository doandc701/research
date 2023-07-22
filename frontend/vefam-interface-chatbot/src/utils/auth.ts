import Cookies from "js-cookie";
// import { useUserStoreHook } from "/@/store/modules/user";
import { appNameSpace } from "/@/settings";
// console.log("appNameSpace", appNameSpace);

const TokenKey = `${appNameSpace}-authorized-token`;

type paramsMapType = {
  name: string;
  expires: number;
  accessToken: string;
};

// get token
export function getToken() {
  // Điều này cũng giống như TokenKey, cách viết này giải quyết được lỗi TokenKey không tồn tại trong Cookie trong quá trình khởi tạo.
  return Cookies.get(TokenKey);
}

// Đặt mã thông báo và thời gian hết hạn (một cho cookie và một cho sessionStorage)
// Phần phụ trợ cần trả lại thông tin người dùng, mã thông báo và thời gian hết hạn cho giao diện người dùng và thời gian hết hạn chủ yếu được sử dụng để làm mới mã thông báo
export function setToken(data) {
  console.log("setToken-data", data);
  const { name, token, duration } = data;
  // Trích xuất thông tin chính để lưu trữ
  const paramsMap: paramsMapType = {
    name,
    accessToken: token,
    expires: Date.now() + parseInt(duration) * 1000
  };
  const dataString = JSON.stringify(paramsMap);
  // useUserStoreHook().SET_TOKEN(accessToken);
  // useUserStoreHook().SET_NAME(name);
  duration > 0
    ? Cookies.set(TokenKey, dataString, {
        expires: duration / 86400
      })
    : Cookies.set(TokenKey, dataString);
  // sessionStorage.setItem(TokenKey, dataString);
}

// delete token
export function removeToken() {
  Cookies.remove(TokenKey);
  sessionStorage.removeItem(TokenKey);
}
