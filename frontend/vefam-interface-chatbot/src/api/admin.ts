import { http } from "../utils/http";
// import { useUserStoreHook } from "/@/store/modules/user";
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

// vefam_api ----------------------------------------------------------------------------
// admin thêm wei amount cho một ví
export const fundingAdminAddAmount = (data: object, token: string) => {
  return http.request(
    "post",
    `${vefam_api}admin/funding-admin-add-amount`,
    { data },
    { headers: { Authorization: "Bearer " + token } }
  );
};

// admin thêm wei amount cho nhiều ví
export const fundingAddMultiAmount = (data: object, token: string) => {
    return http.request(
      "post",
      `${vefam_api}admin/funding-add-multi-amount`,
      { data },
      { headers: { Authorization: "Bearer " + token } }
    );
};

// admin thêm wei amount cho nhiều ví
export const fundingAddMultiAmountAsync = (data: object, token: string) => {
    return http.request(
      "post",
      `${vefam_api}admin/funding-add-multi-amount-async`,
      { data },
      { headers: { Authorization: "Bearer " + token } }
    );
};

// @ admin tạo jwt cho microservices
export const createToken = (data: object, token: string) => {
  return http.request(
    "post",
    `${vefam_api}admin/create-token`,
    { data },
    { headers: { Authorization: "Bearer " + token } }
  );
};

/*
User chi tiêu token
*/
export const fundingSpend = (data: object, token: string) => {
  return http.request(
    "post",
    `${vefam_api}admin/funding-spend`,
    { data },
    { headers: { Authorization: "Bearer " + token } }
  );
};

/*
Chi tiêu token cho nhiều user
*/
export const fundingMultiSpend = (data: object, token: string) => {
  return http.request(
    "post",
    `${vefam_api}admin/funding-multi-spend`,
    { data },
    { headers: { Authorization: "Bearer " + token } }
  );
};

/*
Kiểm tra nhiều User&ví, báo các lỗi nếu có: balance, nonce, wallets duplicates
*/
export const fundingCheck01 = (data: object, token: string) => {
  return http.request(
    "post",
    `${vefam_api}admin/funding-check01`,
    { data },
    { headers: { Authorization: "Bearer " + token } }
  );
};

/*
Kiểm tra một User&ví, báo các lỗi nếu có: balance, nonce, wallets duplicates
*/
export const fundingCheck02 = (data: object, token: string) => {
  return http.request(
    "post",
    `${vefam_api}admin/funding-check02`,
    { data },
    { headers: { Authorization: "Bearer " + token } }
  );
};

/* @
get fundingPendingList
in:
  stage=1: danh sách event UserDeposit chưa chuyển vào Deposit01Model
  stage=2: danh sách lệnh nạp Deposit01 chưa chuyển vào FundingHistory
  stage=3: danh sách lệnh nạp FundingHistory chưa chuyển vào FundingWallet
query {
  type: string (in, out, add, sub)
  stage?: number
}
*/
export const fundingPendingList = (query: string) => {
  return http.request("get", `${vefam_api}admin/funding-pending?${query}`);
};
// @ get server state
export const getServerState = (query: string) => {
  return http.request("get", `${vefam_api}admin/server-state?${query}`);
};

export const getServiceStatus = (query: string) => {
    return http.request("get", `${vefam_api}admin/service-status?${query}`);
};

/* @
set|update server state
*/
export const setServerState = (data: object, token: string) => {
  return http.request(
    "post",
    `${vefam_api}admin/server-state`,
    { data },
    { headers: { Authorization: "Bearer " + token } }
  );
};

/* @
add|remove|update token details trong tokenList
input {
    type: string; // isIn(["add", "remove", "update"])
    data: object;
}
return {
    success: true | false; (thành công hoặc thất bại)
    errorMess: string[]; (lỗi nếu có)
}
*/
export const editTokenList = (data: object, token: string) => {
  return http.request(
    "post",
    `${vefam_api}admin/edit-token-list`,
    { data },
    { headers: { Authorization: "Bearer " + token } }
  );
};

//
export const setLastDepositCount = (data: object, token: string) => {
  return http.request(
    "post",
    `${vefam_api}admin/last-deposit-count`,
    { data },
    { headers: { Authorization: "Bearer " + token } }
  );
};
// Yêu cầu sync các UserDeposit event (VeFamDAccount) mới vào Deposit01Model
export const syncDeposit01 = () => {
  return http.request("post", `${vefam_api}admin/sync-deposit01`);
};
// Yêu cầu kiểm tra các lệnh nạp từ Deposit01 (VeFamDAccount) đủ block quy định vào FundingHistory
export const deposit01PendingHandle = () => {
  return http.request("post", `${vefam_api}admin/deposit01-pending-handle`);
};
// Chuyển dữ liệu lệnh nạp [in] chưa xử lý từ FundingHistory vào FundingWallet
export const depositPendingHandle = () => {
  return http.request("post", `${vefam_api}admin/deposit-pending-handle`);
};
// Chuyển dữ liệu lệnh add-amount [add] chưa xử lý từ FundingHistory vào FundingWallet
export const addAmountPendingHandle = () => {
  return http.request("post", `${vefam_api}admin/add-amount-pending-handle`);
};
// Yêu cầu xử lý các lệnh rút đang chờ
export const withdrawPendingHandle = () => {
  return http.request("post", `${vefam_api}admin/withdraw-pending-handle`);
};
// end: vefam_api ----------------------------------------------------------------------------
