import { defineStore } from "pinia";
import { store } from "/@/store";
import { userType } from "./types";
// import { router } from "/@/router";
// import { routerArrays } from "/@/layout/types";
import { /* storageSession, */ storageLocal } from "@pureadmin/utils";
import { /* getLogin, */ refreshToken } from "/@/api/user";
import { getToken, setToken, removeToken } from "/@/utils/auth";
// import { useMultiTagsStoreHook } from "/@/store/modules/multiTags";
import { appNameSpace } from "/@/settings";
import type { UserInfoType } from "/#/index";
import { nullCoalescing } from "/@/utils";

interface IAccessToken {
  token: string,
  duration: number
}

const data = getToken();
// console.log("getToken-data", data);
let token = "";
let name = "";
if (data) {
  const dataJson = JSON.parse(data);
  if (dataJson) {
    token = dataJson.accessToken;
    name = nullCoalescing(dataJson.name, "admin");
  }
}
// console.log("appNameSpace", appNameSpace);
const userInfo = nullCoalescing(
  storageLocal.getItem<UserInfoType>(`${appNameSpace}-user-info`),
  {
    version: 1
  }
);
// console.log("userInfo", userInfo);

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // token,
    // name,
    // Mã xác minh do giao diện người dùng tạo (thay thế theo nhu cầu thực tế)
    verifyCode: "",
    // Đăng nhập thành phần hiển thị phán đoán 0: Đăng nhập 1: Đăng nhập di động 2: Đăng nhập mã QR 3: Đăng ký 4: Quên mật khẩu, mặc định 0: Đăng nhập
    currentPage: 0,
    /*
    cAccount: thông tin account từ server và các biến liên quan
    */
    cAccount: {
      displayName: name, // tên hiển thị
      accessToken: token, // accessToken
      secretName: "", // tên bí mật tạo từ userName | email
      userName: "", // tên đăng nhập
      email: "", // email đăng nhập
      role: [], // danh sách role
      tempCode: "", // code tạm thời để link account
      linkedCode: "", // code đã sử dụng để link account
      linkedAddr: "", // địa chỉ ví đã link account
      stage: 0 // 0: chưa fetch, 1: đang fetch
    },
    /*
    dAccount: thông tin account từ VeFam VIP smart contract và các biến liên quan
    */
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
    // người giới thiệu đã lưu vào storageLocal
    refer() {
      return userInfo.refer;
    }
  },
  actions: {
    /*
    SET_TOKEN(token) {
      this.token = token;
    },
    SET_NAME(name) {
      this.name = name;
    },
    SET_VERIFYCODE(verifyCode) {
      this.verifyCode = verifyCode;
    },*/

    setCAccountPage(value: number) {
      this.currentPage = value;
    },
    setCAccountStage(value: number) {
      this.cAccount.stage = value;
    },

    /*
    // login (old)
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
    }, */

    // lưu accessToken sau khi login
    loggedCAccount(accessToken: IAccessToken, displayName: string) {
      this.cAccount.accessToken = accessToken.token;
      setToken({
        name: displayName,
        token: accessToken.token,
        duration: accessToken.duration
      });
    },
    // lưu các thông tin cAccount
    updateCAccount(
      displayName: string,
      userName: string,
      email: string,
      tempCode: string,
      linkedCode: string,
      linkedAddr: string,
      role: string[] = []
    ) {
      this.cAccount.displayName = displayName;
      this.cAccount.userName = userName;
      this.cAccount.email = email;
      this.cAccount.role = role;
      this.cAccount.tempCode = tempCode;
      this.cAccount.linkedCode = linkedCode;
      this.cAccount.linkedAddr = linkedAddr;
      if (!this.dAccount.connected && linkedAddr) {
        this.dAccount.myAddr = linkedAddr;
      }
      if (this.cAccount.userName) {
        this.cAccount.secretName = `@${this.cAccount.userName}`;
      } else if (this.cAccount.email) {
        this.cAccount.secretName = this.cAccount.email;
      } else {
        this.cAccount.secretName = "";
      }
    },
    SET_ADDR(addr) {
      this.RESET_DACCOUNT();
      this.dAccount.myAddr = addr;
      this.dAccount.connected = true;
      // const userInfo = storageLocal.getItem<UserInfoType>(`${appNameSpace}-user-info`) ?? {};
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
      // const userInfo = storageLocal.getItem<UserInfoType>(`${appNameSpace}-user-info`) ?? {};
      delete userInfo.myAddr;
      this.UPDATE_USERINFO_STORAGE();
    },
    UPDATE_USERINFO_STORAGE() {
      storageLocal.setItem(`${appNameSpace}-user-info`, userInfo);
    },
    updateRefer(vip: string) {
      if (vip === userInfo.refer) return;
      userInfo.refer = vip;
      this.UPDATE_USERINFO_STORAGE();
    },
    // log out clear cache
    logOut() {
      this.token = ""; // old
      this.name = ""; // old
      this.cAccount.accessToken = "";
      this.updateCAccount("", "", "", "", "", "");
      removeToken();
      this.currentPage = 0;
    },

    /*
    // log out clear cache (old)
    logOut() {
      this.token = "";
      this.name = "";
      removeToken();
      storageSession.clear();
      useMultiTagsStoreHook().handleTags("equal", routerArrays);
      router.push("/login");
    }, */
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
