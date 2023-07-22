import { http } from "../utils/http";
/*
interface userType extends Promise<any> {
  svg?: string;
  code?: number;
  info?: object;
} */

const vpunks_api = "https://vpunks.herokuapp.com/";
const vefam_api = "http://localhost:3000/";

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

// ----------------------------------------------------------------------------
export const userRegister = (data: object) => {
  return http.request("post", `${vefam_api}user/register`, { data });
};

export const userLogin = (data: object) => {
  return http.request("post", `${vefam_api}user/login`, { data });
};

// Đăng ký code lần đầu (link account)
export const userRegisterCode = (data: object, token: string) => {
  return http.request(
    "post",
    `${vefam_api}user/caccount-register-code`,
    { data },
    { headers: { Authorization: "Bearer " + token } }
  );
};
// Sync code sau khi update code trên dAccount smart contract
export const userSyncCode = (data: object, token: string) => {
  return http.request(
    "post",
    `${vefam_api}user/caccount-sync-code`,
    { data },
    { headers: { Authorization: "Bearer " + token } }
  );
};
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

// ----------------------------------------------------------------------------
export const fundingHistory = (query: string) => {
  return http.request("get", `${vpunks_api}app/funding-history?${query}`);
};

export const fundingBalance = (query: string) => {
  return http.request("get", `${vpunks_api}app/funding-balance?${query}`);
};

export const fundingWithdraw = (query: string) => {
  return http.request("get", `${vpunks_api}app/funding-withdraw01?${query}`);
};
