import { defineStore } from "pinia";
import { store } from "/@/store";
import { userType } from "./types";
import { router } from "/@/router";
import { routerArrays } from "/@/layout/types";
import { storageSession, storageLocal } from "@pureadmin/utils";
import { getLogin, refreshToken } from "/@/api/user";
import { getToken, setToken, removeToken } from "/@/utils/auth";
import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { settings } from "/@/settings";
import type { UserInfoType } from "/#/index";
import { nullCoalescing } from "/@/utils";

const data = getToken();
let token = "";
let name = "";
if (data) {
  const dataJson = JSON.parse(data);
  if (dataJson) {
    token = dataJson.accessToken;
    name = nullCoalescing(dataJson.name, "admin");
  }
}
const nameSpace = `${settings.appName}-${settings.network}`;
// console.log("nameSpace", nameSpace);
const userInfo = nullCoalescing(
  storageLocal.getItem<UserInfoType>(`${nameSpace}-user-info`),
  {}
);
// console.log("userInfo", userInfo);

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    token,
    name,
    // Mã xác minh do giao diện người dùng tạo (thay thế theo nhu cầu thực tế)
    verifyCode: "",
    // Đăng nhập thành phần hiển thị phán đoán 0: Đăng nhập 1: Đăng nhập di động 2: Đăng nhập mã QR 3: Đăng ký 4: Quên mật khẩu, mặc định 0: Đăng nhập
    currentPage: 0,
    cAccount: {
      userName: "",
      tempCode: "",
      linkedCode: "",
      linkedAddr: ""
    },
    dAccount: {
      myAddr: userInfo.myAddr,
      name: "",
      vipId: "",
      lv1Count: "",
      lv2Count: "",
      referReward: "",
      linkedCode: "",
      currentPage: 1,
      connected: userInfo.myAddr ? true : false, // đã kết nối ví hoặc myAddr lấy từ cAccount
      VET: "",
      VTHO: ""
    }
  }),
  getters: {
    refer() {
      return userInfo.refer;
    }
  },
  actions: {
    SET_TOKEN(token) {
      this.token = token;
    },
    SET_NAME(name) {
      this.name = name;
    },
    SET_VERIFYCODE(verifyCode) {
      this.verifyCode = verifyCode;
    },
    SET_CURRENTPAGE(value) {
      this.currentPage = value;
      // console.log($connex);
    },
    async SET_CURRENTPAGE2() {},
    //
    updateCAccount(userName, tempCode, linkedCode, linkedAddr) {
      this.cAccount.userName = userName;
      this.cAccount.tempCode = tempCode;
      this.cAccount.linkedCode = linkedCode;
      this.cAccount.linkedAddr = linkedAddr;
      if (!this.dAccount.connected && linkedAddr)
        this.dAccount.myAddr = linkedAddr;
    },
    SET_ADDR(addr) {
      this.RESET_DACCOUNT();
      this.dAccount.myAddr = addr;
      this.dAccount.connected = true;
      // const userInfo = storageLocal.getItem<UserInfoType>(`${nameSpace}-user-info`) ?? {};
      userInfo.myAddr = addr;
      this.UPDATE_USERINFO_STORAGE();
    },
    SET_DACCOUNT(linkedCode) {
      this.dAccount.linkedCode = linkedCode;
      this.dAccount.connected = true;
    },
    // call khi D-Account logout, trước khi SET_ADDR
    RESET_DACCOUNT() {
      this.dAccount.myAddr = "";
      this.dAccount.name = "";
      this.dAccount.vipId = "";
      this.dAccount.lv1Count = "";
      this.dAccount.lv2Count = "";
      this.dAccount.referReward = "";
      this.dAccount.linkedCode = "";
      this.dAccount.connected = false;
      // const userInfo = storageLocal.getItem<UserInfoType>(`${nameSpace}-user-info`) ?? {};
      delete userInfo.myAddr;
      this.UPDATE_USERINFO_STORAGE();
    },
    UPDATE_USERINFO_STORAGE() {
      storageLocal.setItem(`${nameSpace}-user-info`, userInfo);
    },
    updateRefer(vip: string) {
      if (vip === userInfo.refer) return;
      userInfo.refer = vip;
      this.UPDATE_USERINFO_STORAGE();
    },
    // login
    async loginByUsername(data) {
      return new Promise<void>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            if (data) {
              setToken(data);
              resolve();
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // log out clear cache
    logOut() {
      this.token = "";
      this.name = "";
      removeToken();
      storageSession.clear();
      useMultiTagsStoreHook().handleTags("equal", routerArrays);
      router.push("/login");
    },
    // refresh token
    async refreshToken(data) {
      return refreshToken(data).then(data => {
        if (data) {
          setToken(data);
          return data;
        }
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
