import { http } from "../utils/http";
import { useUserStoreHook } from "/@/store/modules/user";
import { getDomain } from "/@/settings";
/*
interface userType extends Promise<any> {
  svg?: string;
  code?: number;
  info?: object;
} */

// const vpunks_api = "https://vpunks.herokuapp.com/";
// const vefam_api = "https://vefam-dev.herokuapp.com/";
const vefam_api = getDomain("vefam-payment");

// mock_api ----------------------------------------------------------------------------
/*
// get verification code
export const getVerify = (): userType => {
  return http.request("get", "/captcha");
};
// export const searchVague = (data: object) => {
//   return http.request("post", "/searchVague", { data });
// };
*/

// Log in
export const getLogin = (data: object) => {
  return http.request("post", "/login", { data });
};

// refresh token
export const refreshToken = (data: object) => {
  return http.request("post", "/refreshToken", { data });
};
// end: mock_api ----------------------------------------------------------------------------

// vefam_api ----------------------------------------------------------------------------
export const userRegister = (data: object) => {
  return http.request("post", `${vefam_api}user/register`, { data });
};

export const userLogin = (data: object) => {
  return http.request("post", `${vefam_api}user/login`, { data });
};

// Đăng ký code lần đầu (link account)
export const userRegisterCode = (data: object, token: string) => {
  return new Promise<any>((resolve, reject) => {
    http
      .request(
        "post",
        `${vefam_api}user/caccount-register-code`,
        { data },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        useUserStoreHook().logOut();
        reject(error);
      });
  });
};
// Sync code sau khi update code trên dAccount smart contract
export const userSyncCode = (data: object, token: string) => {
  return new Promise<any>((resolve, reject) => {
    http
      .request(
        "post",
        `${vefam_api}user/caccount-sync-code`,
        { data },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        useUserStoreHook().logOut();
        reject(error);
      });
  });
};
//
export const userGetInfo = (token: string) => {
  return new Promise<any>((resolve, reject) => {
    return http
      .request("get", `${vefam_api}user/caccount-get-info`, {
        headers: { Authorization: "Bearer " + token }
      })
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        useUserStoreHook().logOut();
        reject(error);
      });
  });
};
//
export const userUpdateCode = (data: object) => {
  return http.request("post", `${vefam_api}user/caccount-update-code`, {
    data
  });
};

// kiểm tra xem có cAccount nào kết nối với dAccount thông qua linkedCode chưa
// data: { code: byte32 }
export const userCheckCode = (data: object) => {
  return http.request("post", `${vefam_api}user/caccount-check-code`, { data });
};

export const fundingBalances = (query: string) => {
  return http.request("get", `${vefam_api}user/funding-balances?${query}`);
};

export const fundingHistory = (query: string) => {
  return http.request("get", `${vefam_api}user/funding-history?${query}`);
};

export const fundingWithdraw = (data: object, token: string) => {
  return http.request(
    "post",
    `${vefam_api}user/funding-withdraw`,
    { data },
    { headers: { Authorization: "Bearer " + token } }
  );
};
// end: vefam_api ----------------------------------------------------------------------------

// vpunks_api ----------------------------------------------------------------------------
/* export const fundingBalance2 = (query: string) => {
  return http.request("get", `${vpunks_api}app/funding-balance?${query}`);
};

export const fundingWithdraw2 = (query: string) => {
  return http.request("get", `${vpunks_api}app/funding-withdraw01?${query}`);
}; */
// end: vpunks_api ----------------------------------------------------------------------------
