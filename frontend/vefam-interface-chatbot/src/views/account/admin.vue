<script setup lang="ts">
import { ref, computed, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
import { emitter } from "/@/utils/mitt";
import { useGlobal } from "@pureadmin/utils";
import { useAppStoreHook } from "/@/store/modules/app";
import {
  userRegisterCode,
  userSyncCode,
  // userUpdateCode,
  fundingWithdraw
} from "/@/api/user";

import {
  fundingAdminAddAmount,
  fundingAddMultiAmountAsync,
  fundingPendingList,
  withdrawPendingHandle,
  fundingSpend,
  fundingMultiSpend,
  getServerState,
  setServerState,
  getServiceStatus,
  editTokenList,
  setLastDepositCount,
  syncDeposit01,
  deposit01PendingHandle,
  depositPendingHandle,
  addAmountPendingHandle,
  createToken,
  fundingCheck01,
  fundingCheck02
} from "/@/api/admin";

import { useUserStoreHook } from "/@/store/modules/user";
import { deepDiff, updateObjectByProp } from "/@/utils";
import Address from "/@/components/Address/index.vue";
const { $connex, $dAccount } = useGlobal<GlobalPropertiesApi>();
import { toWei, formatFloatNumber } from "/@/utils/connex";
import TxInfoDialog from "/@/components/TxInfoDialog/index.vue";
import Symbol from "/@/components/Symbol/index.vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import JsonEditorVue from "json-editor-vue";
import { property } from "lodash-unified";
import * as _ from "lodash-unified";
// new value
const txInfoDialogRef = ref(null);
const dialogFunAdmin = ref(null);
const dialogType = ref("funding" as "funding" | "serverState");

const tokenList = computed(() => {
  return useAppStoreHook().tokenList;
});
//
const userStoreHook = useUserStoreHook();
//
const loading = ref(false);

// C-Account
const userName = computed(() => {
  return userStoreHook.cAccount.userName;
});
/* const roles = computed(() => {
  return userStoreHook.cAccount.role;
}); */

const adminLv = computed(() => {
  const _role = userStoreHook.cAccount.role.find(role => {
    return role.includes("admin_");
  });
  return _role ? parseInt(_role.replace(/^\D+/g, "")) : -1;
});
const cALinkedCode = computed(() => {
  return userStoreHook.cAccount.linkedCode;
});
const cATempCode = computed(() => {
  return userStoreHook.cAccount.tempCode;
});
const cALinkedAddr = computed(() => {
  return userStoreHook.cAccount.linkedAddr;
});
const cAStage = computed(() => {
  return userStoreHook.cAccount.stage;
});

// D-Account
const myAddr = computed(() => {
  return userStoreHook.dAccount.myAddr;
});
const dALinkedCode = computed(() => {
  return userStoreHook.dAccount.linkedCode;
});

// tạm
const token = computed(() => {
  return userStoreHook.cAccount.accessToken;
});

let codeString = null;

// đăng ký code để kết nối với dAccount
function userRegisterTempCode() {
  loading.value = true;
  const data = {
    address: myAddr.value
  };
  //
  userRegisterCode(data, token.value)
    .then(result => {
      console.log("userRegisterCode-result", result);
      loading.value = false;
      if (result.data.errorMess.length) {
        responseMessageHandle(result);
      } else {
        if (result.data.codeString) {
          /* trước đó đã thực hiện userRegisterTempCode() cho dù đã có dALinkedCode hay không vì vậy hãy kiểm tra lại tại đây
            nếu đã có dALinkedCode hãy cảnh báo và ngăn chặn ký giao dịch linkAccount() vì nó sẽ thất bại
          */
          if (dALinkedCode.value) {
            ElMessage({
              message: `Wallet address #${myAddr.value} has been linked to an account`,
              type: "error",
              duration: 5000
            });
            return;
          }
          codeString = result.data.codeString;
          txInfoDialogRef.value.txConfirm();
        } else if (result.data.canSync) {
          /* sync thành công, trường hợp này xảy ra khi trước đó user ký giao dịch linkAccount() thành công nhưng đã
            không thực hiện cAccountSyncCode()
          */
          if (result.data.user) {
            const user = result.data.user;
            userStoreHook.updateCAccount(
              user.local ? user.local.username : "",
              user.dAccount ? user.dAccount.tempCode : "",
              user.dAccount ? user.dAccount.linkedCode : "",
              user.dAccount ? user.dAccount.address : ""
            );
          }
        }
      }
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}

async function onConfirm(): Promise<Connex.Vendor.TxResponse | void | unknown> {
  const clauses = [
    // $dAccount.registerNameXName("tvt3", "vefam", "1000000000000000000")
    $dAccount.linkAccount(codeString)
  ];
  // console.log("ruleForm-----", ruleForm);
  // console.log("clauses-----", clauses);
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("timeout"));
    }, 50000); // recommend: 50000
  });

  try {
    return Promise.race([
      myPromise,
      $connex.vendor.sign("tx", clauses).signer(myAddr.value).request()
    ]);
  } catch (error) {
    console.error(error);
  } finally {
    // this.resetInput()
  }
}
//
function txDialogFeedback(
  mss = "success" |
    "reverted" |
    "received" |
    "submitted" |
    "confirmed" |
    "rejected"
) {
  alert("txDialogFeedback: " + mss);
  if (mss === "success") {
    syncCDAccount();
  } else {
    // Cancel, Error or reverted
    // stop();
  }
}

/* @
Alert các message, bao gồm message: string[], errorMess: string[]
*/
function responseMessageHandle(result: Indexable) {
  const errorMess = [];
  if (result.meta && result.meta.status !== 200) errorMess.push(result.meta.message);
  if (result.data) {
    const data = result.data;
    if (data.success) ElMessage({ message: "Successfully", type: "success" });
    if (data.message && data.message.length) {
      const message = data.message.join("<br>");
      ElMessage({
        message,
        duration: 5000,
        dangerouslyUseHTMLString: true
      });
    }
    if (data.errorMess && data.errorMess.length) errorMess.push(...data.errorMess);
  }
  if (errorMess.length) {
    ElMessage({
      message: errorMess.join("<br>"),
      type: "error",
      duration: 5000,
      dangerouslyUseHTMLString: true
    });
  }
}

/* @
Alert các message, bao gồm message: string[], errorMess: string[]
*/
function errorMessageHandle(error) {
  console.error(error);
  const errorMess = [error.message];
  if (
    error.response &&
    error.response.data &&
    error.response.data.meta &&
    error.response.data.meta.message
  ) {
    errorMess.push(error.response.data.meta.message);
  }
  ElMessage({
    message: errorMess.join("<br>"),
    type: "error",
    duration: 5000,
    dangerouslyUseHTMLString: true
  });
}

/*
 - sync sau khi ký giao dịch linkAccount() thành công
*/
function syncCDAccount() {
  console.log("token", token.value);
  const data = {
    username: userName.value
  };
  userSyncCode(data, token.value)
    .then(result => {
      console.log("userSyncCode-result", result);
      loading.value = false;
      if (result.data.errorMess.length) {
        responseMessageHandle(result);
      } else {
        if (result.data.codeString) {
          codeString = result.data.codeString;
          txInfoDialogRef.value.txConfirm();
        } else if (result.data.canSync) {
          // sync ok
          if (result.data.user) {
            const user = result.data.user;
            userStoreHook.updateCAccount(
              user.local ? user.local.username : "",
              user.dAccount ? user.dAccount.tempCode : "",
              user.dAccount ? user.dAccount.linkedCode : "",
              user.dAccount ? user.dAccount.address : ""
            );
          }
        }
      }
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}

/*
  Login , "Connect Wallet" hoặc "Link Account Now"
*/
function connectWallet() {
  if (loading.value) return;
  console.log("userName", userName.value);
  console.log("cATempCode", cATempCode.value);
  console.log("dALinkedCode", dALinkedCode.value);

  if (userName.value) {
    if (myAddr.value) {
      if (!cALinkedAddr.value) {
        /* cho dù có cATempCode và dALinkedCode vẫn thực hiện userRegisterTempCode() mà không sử dụng syncCDAccount() tại button này
        - có dALinkedCode vẫn thực hiện userRegisterTempCode() để sycn cAccount với dAccount khác nếu có
        - BE sẽ thực hiện cả sync nếu có tempCode, hơn thế nữa BE sẽ kiểm tra kỹ hơn về address được yêu cầu kết nối
        */
        userRegisterTempCode();
      }
    } else {
      emitter.emit("connectWallet");
    }
  } else {
  }
}

/*
 *** for admin ***
 - admin thêm số dư một token cho một địa chỉ ví
 input:
  userAddress: địa chỉ ví user
  tokenAddress: địa chỉ token
  amount: số wei (số dương)
*/
function fundingAddAmount() {
  loading.value = true;
  // const tkAddr = [
  //   "0x8C1d95e96b69941b1b81145D2f2A100E7D259880", // VPU
  //   "0x0000000000000000000000000000456E65726779", // VTHO
  //   "0xC2e176E90B995cDfd29B8c5152B4E4fE768556C0", // T01
  //   "0x0000000000000000000000000000000000000000" // VET
  // ];
  const data = {
    userAddress: inputRecipient.value, // cALinkedAddr.value // cALinkedAddr.value || myAddr.value
    tokenAddress: inputTokenAddr.value, // T01
    amount: sendingAmount.value, // inputAmount.value,
    from: "admin-tvt",
    note: "tra thuong event 02",
    uniqueKey: "    ",
    memo: "dddd"
  };
  fundingAdminAddAmount(data, token.value)
    .then(result => {
      console.log("fundingAdminAddAmount-result", result);
      loading.value = false;
      responseMessageHandle(result);
      if (result.data.success) {
        ElMessage({
          message: "Successful",
          type: "success"
        });
        inputAmount.value = "";
        errorMessFun.value = "";
      } else if (result.data.errorMess.length) {
        errorMessFun.value = result.data.errorMess;
      }
    })
    .catch(error => {
      errorMessageHandle(error);
      // inputRecipient.value = "";
      loading.value = false;
    });
}

/* @
admin tạo jwt cho microservices, yêu cầu adminLevel >= 1000
đồng thời cũng decode token nếu được cung cấp
*/
function _createToken() {
  loading.value = true;
  const data = {
    data: {
      domain: ""
    },
    token: ""
  };
  createToken(data, token.value)
    .then(result => {
      console.log("createToken-result", result);
      loading.value = false;
      responseMessageHandle(result);
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}

/**
 * Kiểm tra nhiều ví
 */
function _fundingCheck01() {
  loading.value = true;
  // type in ["userAddress", "userName", "email", "id"]
  const data = { page: 1, limit: 100 };
  fundingCheck01(data, token.value)
    .then(result => {
      console.log("fundingCheck01-result", result);
      loading.value = false;
      responseMessageHandle(result);
      if (result.data.success) {
        const { page, limit, total, fundingWallets } = result.data;
        const start = (page - 1) * limit + 1;
        const to = start + fundingWallets - 1;
        ElMessage({
          message: `Everything good: ${start} - ${to} of ${total}`,
          type: "success"
        });
      }
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}

/**
 * Kiểm tra một ví
 */
function _fundingCheck02() {
  loading.value = true;
  // type in ["userAddress", "userName", "email", "id"]
  const data = [
    { type: "userAddress", value: myAddr.value || cALinkedAddr.value },
    { type: "userName", value: "admin3" },
    { type: "email", value: "admin3@gmail.com" },
    { type: "id", value: "637f1735fd8d01c416f92963" }
  ];
  // update status: trạng thái: ↴
	// - 3: ẩn, 4: đình chỉ rút, 5: đình chỉ rút và chi tiêu, 6: đình chỉ chi tiêu
  /*
  tokenAddress: ["all"] sẽ áp dụng cho tất cả, address phải là chữ thường
  status: là số hoặc string-number, sử dụng text "undefined" để xóa
  */
  const statusUpdate = {
    tokenAddress: ["all"],
    status: ["6"]
  }
  fundingCheck02({ ...data[0], statusUpdate }, token.value)
    .then(result => {
      console.log("fundingCheck02-result", result);
      loading.value = false;
      responseMessageHandle(result);
      if (result.data.success) {
        ElMessage({
          message: "Everything good!",
          type: "success"
        });
      }
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}

// 170: VPU, VTHO, T01
// 10a: VET, VPU, VTHO, T01

// test chi tiêu nhiều user
function _fundingMultiSpend() {
  const data = {
    userAddress: ["0x8233f97147d776176b25a7b72728f2ef0e6cc170","0x8233f97147d776176b25a7b72728f2ef0e6cc170", 
      "0xD3EF14fF4EA3C95C076B9Fc948aA05B7a407410a", "0xD3EF14fF4EA3C95C076B9Fc948aA05B7a407410a",
      "0x8233f97147d776176b25a7b72728f2ef0e6cc170"
    ],
    tokenAddress: ["0x8C1d95e96b69941b1b81145D2f2A100E7D259880","0xC2e176E90B995cDfd29B8c5152B4E4fE768556C0",
      "0x8C1d95e96b69941b1b81145D2f2A100E7D259880", "0x0000000000000000000000000000000000000000",
      "0x0000000000000000000000000000456E65726779"
    ],
    amount: ["1","2","1","1","3"],
    quite: 1,
    note: "   play game 03   ",
    // status: 1,
    // uniqueKey: [16," 17  ",18,19,20],
    memo: "   ppppp   ",
    to: "  tvt17   "
  };
  loading.value = true;
  fundingMultiSpend(data, token.value)
    .then(result => {
      console.log("fundingMultiSpend-result", result);
      loading.value = false;
      responseMessageHandle(result.data.response);
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}

/*
Admin thêm wei amount cho nhiều FundingWallet cùng lúc
*/
function _fundingAddMultiAmountAsync() {
  const data = {
    userAddress: [" 0x8233F97147D776176b25a7B72728f2Ef0E6cC170 ","0x8233F97147D776176b25a7B72728f2Ef0E6cC170   ", 
      " 0x8233F97147D776176b25a7B72728f2Ef0E6cC170  ", "   0x8233F97147D776176b25a7B72728f2Ef0E6cC170   ",
      "  0x8233F97147D776176b25a7B72728f2Ef0E6cC170 "
    ],
    tokenAddress: [
      " 0x8C1d95e96b69941b1b81145D2f2A100E7D259880 ", // VPU
      " 0xC2e176E90B995cDfd29B8c5152B4E4fE768556C0 ", // T01
      "  0x8C1d95e96b69941b1b81145D2f2A100E7D259880 ", // VPU
      " 0x0000000000000000000000000000000000000000 ", // VET
      "   0x0000000000000000000000000000456E65726779 " // VTHO
    ],
    amount: [" 1 ","       0000000020 "," 03 ",4," 5 "],
    memo: ["   memo1   ", "memo2 ", "   memo3  ", "   "],
    note: ["   note1   ", "note2 ", " note3  ", " note4"],
    uniqueKey: [/* 36," 40  ",41, 42, 43 */],
    from: "  tvt17   "
  };
  loading.value = true;
  fundingAddMultiAmountAsync(data, token.value)
    .then(result => {
      console.log("fundingAddMultiAmountAsync-result", result);
      loading.value = false;
      responseMessageHandle(result.data.response);
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}

// test user chi tiêu token
function _fundingSpend(index = 0) {
  const tkAddr = [
    "0x8C1d95e96b69941b1b81145D2f2A100E7D259880", // VPU
    "0x0000000000000000000000000000456E65726779", // VTHO
    "0xC2e176E90B995cDfd29B8c5152B4E4fE768556C0", // T01
    "0x0000000000000000000000000000000000000000" // VET
  ];
  const data = {
    userAddress: cALinkedAddr.value || myAddr.value,
    tokenAddress: tkAddr[index],
    amount: "1",
    note: "chi tiêu game 02",
    status: 1,
    uniqueKey2: "  45545  ",
    memo: "bbb",
    to: "game01"
  };
  loading.value = true;
  fundingSpend(data, token.value)
    .then(result => {
      console.log("fundingSpend-result", result);
      loading.value = false;
      responseMessageHandle(result.data.response);
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}

// @
function _fundingWithdraw(index) {
  const tkAddr = [
    "0x8C1d95e96b69941b1b81145D2f2A100E7D259880", // VPU
    "0x0000000000000000000000000000456E65726779", // VTHO
    "0xC2e176E90B995cDfd29B8c5152B4E4fE768556C0", // T01
    "0x0000000000000000000000000000000000000000" // VET
  ];
  const data = {
    userAddress: cALinkedAddr.value || myAddr.value,
    tokenAddress: tkAddr[index],
    amount: "5"
  };
  loading.value = true;
  fundingWithdraw(data, token.value)
    .then(result => {
      console.log("fundingWithdraw-result", result);
      loading.value = false;
      responseMessageHandle(result);
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}

// @
function _fundingPendingList(type: string, stage?: string) {
  loading.value = true;
  const page = 1;
  const limit = 1000;
  const query = `type=${type}&stage=${stage}&page=${page}&limit=${limit}`;
  fundingPendingList(query)
    .then(result => {
      console.log(`fundingPendingList-${query}`, result);
      loading.value = false;
      responseMessageHandle(result);
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}
// @
function _withdrawPendingHandle() {
  loading.value = true;
  withdrawPendingHandle()
    .then(result => {
      console.log("withdrawPendingHandle-result", result);
      loading.value = false;
      responseMessageHandle(result);
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}
// test
async function _getEveUserDeposit() {
  loading.value = true;
  const vipInfo = await $dAccount.getDepositCount().catch(e => {
    console.error(e);
    loading.value = false;
  });
  console.log("getDepositCount-result", vipInfo);
  //
  const fromIndex = 0;
  const event = await $dAccount.getEveUserDeposit();
  const filter = event
    .filter([{ addr: useUserStoreHook().dAccount.myAddr }])
    .order("desc"); // Work from the last event
  const logResults = await filter.apply(fromIndex, 256).catch(() => {}); // this.listQuery.limit
  console.log("getEveUserDeposit-result", logResults);

  loading.value = false;
}


// @
async function _setLastDepositCount() {
  const data = {
    amount: 12
  };
  loading.value = true;
  setLastDepositCount(data, token.value)
    .then(result => {
      console.log("setLastDepositCount-result", result);
      loading.value = false;
      responseMessageHandle(result);
    })
    .catch(error => {
      errorMessageHandle(error)
      loading.value = false;
    });
}
// @
function _syncDeposit01() {
  loading.value = true;
  syncDeposit01()
    .then(result => {
      console.log("syncDeposit01-result", result);
      loading.value = false;
      responseMessageHandle(result);
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}
// @
function _deposit01PendingHandle() {
  loading.value = true;
  deposit01PendingHandle()
    .then(result => {
      console.log("deposit01PendingHandle-result", result);
      loading.value = false;
      responseMessageHandle(result);
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}
// @
function _depositPendingHandle() {
  console.log("depositPendingHandle----------");
  loading.value = true;
  depositPendingHandle()
    .then(result => {
      console.log("depositPendingHandle-result", result);
      loading.value = false;
      responseMessageHandle(result);
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}
/* @
Chuyển dữ liệu lệnh add-amount [add] chưa xử lý từ FundingHistory vào FundingWallet
*/
function _addAmountPendingHandle() {
  loading.value = true;
  addAmountPendingHandle()
    .then(result => {
      console.log("addAmountPendingHandle-result", result);
      loading.value = false;
      responseMessageHandle(result);
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}

// new
async function handlePaste() {
  const bin = ref(document.getElementById("paste-bin"));
  const read = await navigator.clipboard.readText();
  bin.value = inputRecipient.value;
  inputRecipient.value = read;
  ElMessage({
    message: "Paste successfully",
    type: "success"
  });
}
// new
const inputRecipient = ref(undefined);
const inputTokenAddr = ref(undefined);
const inputAmount = ref("");
const sendingAmount = ref(undefined); // dùng để gửi amount đi toWei hay Ether
const selectToken = ref("");
const selectTypeAmount = ref("");
const errorMessFun = ref("");
const optionAmount = [
  {
    value: "Wei",
    label: "Wei"
  },
  {
    value: "Ether",
    label: "Ether"
  }
];
function handleInputTokenAmount() {
  inputAmount.value = formatFloatNumber(inputAmount.value, 18, 25);
  handleSelectTypeAmount();
}
function handleSelectToken() {
  console.log(selectToken.value);
  inputTokenAddr.value = selectToken.value;
  // selectToken.value = inputTokenAddr.value;
}
function handleInputTokenAddr() {
  console.log(inputTokenAddr.value);
  // inputTokenAddr.value = selectToken.value; // this make input allways = token address

  if (inputTokenAddr.value !== selectToken.value) {
    selectToken.value = "???";
  }
}
function handleSelectTypeAmount() {
  sendingAmount.value = inputAmount.value;
  if (selectTypeAmount.value == optionAmount[0].value) {
    console.log("Keep Wei");
  } else if (selectTypeAmount.value == optionAmount[1].value) {
    sendingAmount.value = toWei(sendingAmount.value);
  }
  console.log("sendingAmount", sendingAmount.value);
}
function openFunding() {
  dialogType.value = "funding";
  dialogFunAdmin.value = true;
  inputRecipient.value = cALinkedAddr.value;
  inputAmount.value = "";
}
function openServerState() {
  dialogType.value = "serverState";
  dialogFunAdmin.value = true;
  _getServerState();
}

// view|update Server State ----------------------------------------
const severStateModifiableData = ref({}); // Server State data có thể sửa đổi
const serverStateViewData = ref({}); // Server State data view-only
const ss_ModifiableLabelList = ["state", "stateView"]; // danh sách các key|path đối tượng có thể sửa đổi
const ss_ModifiableDataEditor = ref(undefined); // Server State data có thể sửa đổi clone cho JsonEditor
const ss_ModifiedList = ref([]); // danh sách các key/value đã sửa đổi

// cài đặt cho VueJsonPretty
const jsonPrettySettings = ref({
  showLine: true,
  showLineNumber: false,
  showDoubleQuotes: true,
  showLength: true,
  editable: false,
  showIcon: true,
  editableTrigger: "dblclick",
  deep: 3
});

// @ get server state
function _getServerState() {
  // console.log("getServerState----------");
  loading.value = true;
  getServerState()
    .then(result => {
      console.log("getServerState-result", result);
      handleServerState(result.data);
      loading.value = false;
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}
// @ get service state
function _getServiceStatus() {
  // console.log("getServiceStatus----------");
  loading.value = true;
  getServiceStatus()
    .then(result => {
      console.log("getServiceStatus-result", result);
      responseMessageHandle(result.data.response);
      loading.value = false;
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}

// submit server state
function _submitServerState() {
  console.log("submitServerState:ss_ModifiedList", ss_ModifiedList.value);
  if (ss_ModifiedList.value.length <= 0) return;
  const data = {
    data: ss_ModifiedList.value
  };
  setServerState(data, token.value)
    .then(result => {
      console.log("setServerState-result", result);
      if (result.data.serverState) handleServerState(result.data.serverState);
      responseMessageHandle(result);
      if (result.data.success) {
        ElMessage({
          message: "Update successful",
          type: "success"
        });
      }
      loading.value = false;
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}

//
function handleServerState(serverState) {
  for (const [key, value] of Object.entries(serverState)) {
    if (ss_ModifiableLabelList.includes(key)) {
      severStateModifiableData.value[key] = value;
    } else {
      serverStateViewData.value[key] = value;
    }
  }
  ss_ModifiableDataEditor.value = _.cloneDeep(severStateModifiableData.value);
}

/**
 * Theo dõi data thay đổi bởi tương tác JsonEditorVue
 */
watch(
  () => ss_ModifiableDataEditor.value, (/* newVal */) => {
    generateModifiedList();
  }
);

// sử dụng onChange thay cho watch
function updatedContent() {
  // generateModifiedList();
}

/**
 * Hủy bỏ một key/value đã thay đổi
 */
function cancelModifiedItem(item) {
  const cobj = _.cloneDeep(ss_ModifiableDataEditor.value);
  updateObjectByProp(cobj, item[0], item[1].from);
  // _.set(cobj, item[0], item[1].from);
  ss_ModifiableDataEditor.value = cobj;
  // console.log("ss_ModifiableDataEditor", ss_ModifiableDataEditor.value);
  generateModifiedList();
}

/**
 * So sánh thay đổi trong severStateModifiableData
 */
function generateModifiedList() {
  const diffList = deepDiff(
    severStateModifiableData.value,
    ss_ModifiableDataEditor.value
  );
  ss_ModifiedList.value = _.toPairs(diffList); // _.toPairs <=> Object.entries;
  // console.log("ss_ModifiedList", ss_ModifiedList.value);
}
// end: view|update Server State ----------------------------------------

// add|remove|update token details trong tokenList ----------------------------------------
function _editTokenList() {
  /* const data1 = {
    type: "add",
    tokenAddress: "0xC2e176E90B995cdfd29b8c5152b4e4fe768556c4", // T01
    data: {
      name: "T05 Token",
      symbol: "T05",
      decimals: 18,
      logoURI: "https://vefam.com/img/tokens/T05.png",
      withdrawFee: "2",
      address: "0x000000", // (không có tác dụng vì sẽ sử dụng tokenAddress)
      balanceOf: "23232323" // (không có tác dụng vì không cho phép update)
    }
  }; */
  /* const data2 = {
    type: "remove",
    tokenAddress: "0xC2e176E90B995cDfd29B8c5152B4E4fE768556C0", // T01
    data: {} // data không sử dụng nhưng vẫn phải cung cấp một object rỗng
  }; */
  const data3 = {
    type: "update",
    tokenAddress: "0x8C1d95e96b69941b1b81145D2f2A100E7D259880", // VPU
    data: {
      withdrawStatus: "5",
      // depositStatus: 5,
    }
  };
  editTokenList(data3, token.value)
    .then(result => {
      console.log("editTokenList-result", result);
      // if (result.data.serverState) handleServerState(result.data.serverState);
      responseMessageHandle(result);
      if (result.data.success) {
        ElMessage({
          message: "Update successful",
          type: "success"
        });
      }
      loading.value = false;
    })
    .catch(error => {
      errorMessageHandle(error);
      loading.value = false;
    });
}
// end: add|remove|update token details trong tokenList ----------------------------------------
</script>

<template>
  <div v-loading="loading" class="admin-container">
    <el-form style="margin-bottom: 40px">
      <div>
        <div>
          Username: <span class="highlights">{{ userName }}</span
          >, Admin Level: <span class="highlights">{{ adminLv }}</span>
        </div>
        <div>
          Link with D-Account:
          <span v-if="cALinkedCode && cALinkedAddr" class="highlights">
            {{ cALinkedAddr }}
          </span>
        </div>
      </div>

      <div v-if="!myAddr || !cALinkedCode || !cALinkedAddr">
        <router-link v-if="!userName" :to="'/account'">
          <el-button
            class="w-full mt-4"
            size="large"
            type="primary"
          >
            Login
          </el-button>
        </router-link>
        <el-button
          v-else
          class="w-full mt-4"
          size="large"
          type="primary"
          @click="connectWallet"
          v-loading="loading || cAStage !== 0"
        >
          <div v-if="!myAddr">
            <IconifyIconOnline icon="uil:wallet" style="margin-right: 5px" />
            Connect Wallet
          </div>
          <div v-else>
            Link Account Now
            <IconifyIconOffline icon="link" style="margin-left: 5px" />
          </div>
        </el-button>
      </div>
    </el-form>

    <div class="feature-group">
      <p class="group-title" style="color: #0f94ff;">Account settings:</p>
      <el-button @click="connectWallet">Link Account</el-button>
      <el-button @click="syncCDAccount">Sync code</el-button>
      User features
    </div>

    <div class="feature-group">
      <p class="group-title">Server state:</p>
      <div class="feature-box">
        <div class="feature-line">
          <el-button type="warning" plain @click="openServerState()"
            >getServerState</el-button
          >
          (Open Dialog)
        </div>
        <div class="feature-line">
          <el-button type="danger" plain @click="_editTokenList">
            editTokenList
          </el-button>
          Edit Token List <span class="danger"> (require admin level >= 1000)</span>
        </div>
      </div>
    </div>
    <div class="feature-group">
      <p class="group-title">Funding:</p>
      <div class="feature-box">
        <!-- <el-button type="danger" plain @click="fundingAddAmount(0)"
          >fundingAddAmount[VPU]</el-button
        >
        <el-button type="danger" plain @click="fundingAddAmount(1)"
          >fundingAddAmount[VTHO]</el-button
          @click="_getServerState"
        > -->
        <div class="feature-line">
          <el-button type="danger" plain @click="openFunding()">fundingAddAmount</el-button>
          (Open Dialog) test Admin add một số token cho một ví bất kỳ
        </div>
        <div class="feature-line">
          <el-button type="danger" plain @click="_fundingAddMultiAmountAsync">fundingAddMultiAmountAsync</el-button>
          Admin thêm wei amount cho nhiều FundingWallet <span class="danger">(require admin level >= 1000)</span>
        </div>
      </div>
      <div class="feature-box">
        <p class="feature-title">
          Admin Spend Amount: test Admin chi tiêu token của một ví bất kỳ
          <span class="danger"> (require admin level >= 1000)</span>
        </p>
        <el-button type="danger" plain @click="_fundingSpend(0)">fundingSpend[VPU]</el-button>
        <el-button type="danger" plain @click="_fundingSpend(1)">fundingSpend[VTHO]</el-button>
        <el-button type="danger" plain @click="_fundingMultiSpend">fundingMultiSpend</el-button>
      </div>
      <div class="feature-box">
        <p class="feature-title">Withdraw:</p>
        <el-button @click="_fundingWithdraw(0)">fundingWithdraw[VPU]</el-button>
        <el-button @click="_fundingWithdraw(1)"
          >fundingWithdraw[VTHO]</el-button
        >
        User features
        <div class="feature-line">
          <el-button type="warning" plain @click="_fundingPendingList('out')"
            >withdrawPendingList</el-button
          >
          Lấy danh sách lệnh rút FundingHistory chưa xử lý (chưa chuyển token)
        </div>
        <div class="feature-line">
          <el-button type="danger" plain @click="_withdrawPendingHandle"
            >withdrawPendingHandle</el-button
          >
          Yêu cầu xử lý các lệnh rút đang chờ, chuyển token cho user
        </div>
      </div>
      <div class="feature-box">
        <p class="feature-title">Deposit:</p>
        <el-button @click="_getEveUserDeposit">getEveUserDeposit</el-button>
        <div class="feature-line">
          <el-button type="warning" plain @click="_fundingPendingList('in', 1)"
            >deposit01Pending01</el-button
          >
          Lấy danh sách event UserDeposit chưa chuyển vào Deposit01Model
        </div>
        <div class="feature-line">
          <el-button type="warning" plain @click="_fundingPendingList('in', 2)"
            >deposit01Pending02</el-button
          >
          Lấy danh sách lệnh nạp Deposit01 chưa chuyển vào FundingHistory
        </div>
        <div class="feature-line">
          <el-button type="warning" plain @click="_fundingPendingList('in', 3)"
            >deposit01Pending03</el-button
          >
          Lấy danh sách lệnh nạp FundingHistory chưa chuyển vào FundingWallet
        </div>
        <div class="feature-line">
          <el-button type="danger" plain @click="_setLastDepositCount"
            >setLastDepositCount
          </el-button>
          <span class="danger"> Require admin level >= 1000</span>
        </div>
        <div class="feature-line">
          <el-button type="danger" plain @click="_syncDeposit01"
            >1. syncDeposit01</el-button
          >
          Yêu cầu sync các lệnh nạp (event) mới vào Deposit01Model
        </div>
        <div class="feature-line">
          <el-button type="danger" plain @click="_deposit01PendingHandle"
            >2. deposit01PendingHandle</el-button
          >
          Xử lý thêm wei amount nạp từ Deposit01 (VeFamDAccount) vào
          FundingHistory
        </div>
        <div class="feature-line">
          <el-button type="danger" plain @click="_depositPendingHandle"
            >3. depositPendingHandle</el-button
          >
          Chuyển dữ liệu các lệnh nạp chưa xử lý từ FundingHistory vào
          FundingWallet
        </div>
      </div>

      <div class="feature-box">
        <p class="feature-title">Add balance:</p>
        <div class="feature-line">
          <el-button type="warning" plain @click="_fundingPendingList('add')">
            addAmountPending-List
          </el-button>
          Lấy danh sách các lệnh add-amount [add] tại FundingHistory chưa chuyển vào FundingWallet
        </div>
        <div class="feature-line">
          <el-button type="danger" plain @click="_addAmountPendingHandle">
            addAmountPending-Handle
          </el-button>
          Chuyển dữ liệu các lệnh add-amount chưa xử lý từ FundingHistory vào FundingWallet
        </div>
      </div>

      <div class="feature-group">
        <p class="group-title">Khác:</p>
        <div class="feature-box">
          <p class="feature-title">Khác:</p>
          <div class="feature-line">
            <el-button @click="_createToken">createToken</el-button>
            Tạo token cho microservices <span class="danger"> (require admin level >= 1000)</span>
          </div>
          <div class="feature-line">
            <el-button @click="_getServiceStatus">getServiceStatus</el-button>
            Get service status như một microservices <span class="danger"> (require admin level >= 1000)</span>
          </div>
          <div class="feature-line">
            <el-button @click="_fundingCheck01">fundingCheck01</el-button>
            Kiểm tra nhiều ví, báo các lỗi nếu có: balance, nonce
          </div>
          <div class="feature-line">
            <el-button @click="_fundingCheck02">fundingCheck02</el-button>
            Kiểm tra một User&ví, báo các lỗi nếu có: balance, nonce, wallets duplicates
          </div>
        </div>
      </div>
    </div>

    <TxInfoDialog
      ref="txInfoDialogRef"
      :on-confirm="onConfirm"
      @feedback="txDialogFeedback"
    />
    <el-dialog
      v-if="dialogFunAdmin"
      custom-class="dialog-type2 dialogAdmin"
      v-model="dialogFunAdmin"
      ><template #header="{ titleId, titleClass }">
        <div class="my-header">
          <h4
            style="display: flex; align-items: flex-end"
            :id="titleId"
            :class="titleClass"
          >
            <div v-if="'funding' === dialogType">Funding Add Amount</div>
            <div v-if="'serverState' === dialogType">
              Server State
            </div>
          </h4>
        </div>
      </template>
      <div v-if="['funding'].includes(dialogType)">
        <!-- v-if="dialogType === 'funding'" -->
        <div class="input-position">
          <span style="font-size: 16px">Recipient Address</span>
          <div style="margin-top: 10px">
            <el-input
              id="paste-bin"
              class="input-recipient"
              v-model="inputRecipient"
              placeholder="Press and hold to paste"
            >
              <!-- @change="handleInputRecipient()" -->
              <template #append>
                <el-tooltip effect="dark" content="Paste" placement="top-start">
                  <el-button
                    @click="handlePaste()"
                    id="paste-content"
                    class="btn-versiontransfer"
                  >
                    <IconifyIconOnline
                      style="font-size: 20px"
                      icon="material-symbols:content-paste-go-rounded"
                    />
                  </el-button>
                </el-tooltip>
              </template>
            </el-input>
          </div>
        </div>
        <div class="input-position">
          <span style="font-size: 16px">Input Token Address</span>
          <div style="margin-top: 10px">
            <el-input
              v-model="inputTokenAddr"
              placeholder="Please input token address"
              @change="handleInputTokenAddr()"
              ><template #append>
                <el-select
                  class="btn-versiontransfer"
                  v-model="selectToken"
                  placeholder="Select"
                  style="width: 115px"
                  @change="handleSelectToken()"
                >
                  <el-option
                    v-for="item in tokenList"
                    :key="item.address"
                    :label="item.symbol"
                    :value="item.address"
                    style="
                      display: flex;
                      align-items: center;
                      color: #000;
                      background: #fff;
                    "
                  >
                    <div style="float: left">
                      <Symbol
                        style="
                          margin-right: 7px;
                          display: flex;
                          align-items: center;
                        "
                        :src="item.logoURI"
                        :size="20"
                      />
                    </div>
                    <div style="float: right">
                      {{ item.symbol }}
                    </div>
                  </el-option>
                </el-select>
              </template></el-input
            >
          </div>
        </div>
        <div class="input-position">
          <span style="font-size: 16px">Input Amount</span>
          <div style="margin-top: 10px">
            <el-input
              v-model="inputAmount"
              placeholder="Enter number here"
              @change="handleInputTokenAmount()"
            >
              <template #append>
                <el-select
                  class="btn-versiontransfer"
                  v-model="selectTypeAmount"
                  :placeholder="optionAmount[0].value"
                  style="width: 115px"
                  @change="handleSelectTypeAmount()"
                >
                  <el-option
                    style="background: #fff"
                    v-for="item in optionAmount"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select> </template
            ></el-input>
          </div>
        </div>
        <el-row style="color: #f56c6c; margin-top: 5px">
          {{ errorMessFun.toString() }}
        </el-row>
        <el-row justify="center" style="margin-top: 30px">
          <el-button
            @click="fundingAddAmount()"
            class="button-type04"
            v-loading="loading"
            >Submit</el-button
          >
          <p class="danger" style="width: 100%;text-align: center;">(Require admin level >= 1000)</p>
        </el-row>
      </div>

      <!--serverState-->
      <div v-if="['serverState'].includes(dialogType)">
        <span>Editable server data: (chỉ nên xóa một phần tử trong một mảng mỗi lần)</span>
        <JsonEditorVue
          v-model="ss_ModifiableDataEditor"
          v-bind="{
            /* local props & attrs */
          }"
          v-loading="loading"
          :onChange="updatedContent"
        />

        <div>
          <div>Server data list edited:</div>
          <div
            v-for="item in ss_ModifiedList"
            :key="item.value"
            v-loading="loading"
          >
            <el-row style="align-items: center; margin-top: 10px">
              <el-button
                style="margin-right: 10px"
                size="small"
                type="danger"
                @click="cancelModifiedItem(item)"
                >Cancel</el-button
              >
              <el-tag
                v-if="item[1].to !== undefined && item[1].from !== undefined"
                effect="dark"
                round
                style="margin-right: 10px"
                >Edit</el-tag
              >
              <el-tag
                v-if="item[1].from !== undefined && item[1].to === undefined"
                effect="dark"
                round
                type="warning"
                style="margin-right: 10px"
                >Delete</el-tag
              >
              <el-tag
                v-if="item[1].from === undefined && item[1].to !== undefined"
                effect="dark"
                round
                type="success"
                style="margin-right: 10px"
                >Add</el-tag
              >
              <div style="margin-right: 10px">
                Path:
                <span style="color: #13ce66">{{ item[0] }}</span>
              </div>
              <div style="margin-right: 10px">
                Old:
                <span style="color: #f09439;">{{ item[1].from }}</span>
              </div>
              <div style="margin-right: 10px">
                > New: <span style="color: red">{{ item[1].to }}</span>
              </div>
            </el-row>
          </div>
        </div>

        <el-row justify="center" style="margin-top: 30px">
          <el-button class="button-type04" @click="_submitServerState">
            Submit
          </el-button>
          <p class="danger" style="width: 100%;text-align: center;">(Require admin level >= 1000)</p>
        </el-row>

        <el-row justify="space-between">
          <span>Server data view only:</span>
        </el-row>
        <!-- @nodeClick="changeData
          @change="changeData(ss_ModifiableDataEditor)"
          @selected-change="changeData"  -->
        <VueJsonPretty
          v-model:data="serverStateViewData"
          :deep="jsonPrettySettings.deep"
          :show-double-quotes="jsonPrettySettings.showDoubleQuotes"
          :show-line="jsonPrettySettings.showLine"
          :show-length="jsonPrettySettings.showLength"
          :show-icon="jsonPrettySettings.showIcon"
          :show-line-number="jsonPrettySettings.showLineNumber"
          :editable="jsonPrettySettings.editable"
          :editable-trigger="jsonPrettySettings.editableTrigger"
        />
      </div>
      <!--end: serverState-->
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.admin-container {
  color: #fff;
  .highlights {
    color: #52c41a;
  }
  .danger {
    color: #f56c6c;
  }
  .feature-group {
    padding: 10px 0 20px 0;
    border-top: 1px solid #c1c1c169;
    p.group-title {
      color: #ce2e2e;
      font-size: 28px;
      padding-bottom: 10px;
    }
  }
  .feature-box {
    padding: 10px 0 20px 0;
    .feature-line {
      padding-top: 5px;
    }
  }
  p.feature-title {
    padding-bottom: 10px;
  }

  // for dialog
  :deep(.dialog-type2.dialogAdmin) {
    max-width: 800px;
    width: 95%;
  }
  :deep(.el-dialog__body) {
    padding-top: 10px;
    color: #fff;
    border-top: 1px solid #2c356d;
  }
  :deep(.el-dialog__header) {
    padding: 15px;
  }
  :deep(.el-dialog.dialog-type2 .el-dialog__title) {
    font-size: 22px;
    color: rgb(255 255 255 / 90%);
  }
  :deep(.el-dialog__headerbtn) {
    background: #1c2762;
    border-radius: 5px;
    width: 30px;
    height: 30px;
    top: 11px;
    right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s;
    &:hover {
      background: #263378;
    }
  }
  :deep(.el-dialog__headerbtn .el-dialog__close) {
    color: #ffffff8f;
    font-size: 22px;
  }

  .input-position {
    margin-top: 15px;
  }
  :deep(.el-input__wrapper) {
    height: 40px;
    background-color: rgba(0, 0, 0, 0.2);
    box-shadow: unset;
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    --el-input-placeholder-color: #6a6c6e;
  }
  :deep(.el-input__inner) {
    color: #fff;
    text-overflow: ellipsis;
  }
  :deep(.el-input-number .el-input__inner) {
    text-align: left;
  }
  :deep(.el-input-number) {
    width: 100%;
  }
  :deep(.el-input-number.is-controls-right .el-input-number__decrease) {
    border-left: unset;
    background: #1c2762;
    color: #9ba0ba;
    &:hover {
      background: #263378;
      color: #1264f2;
      transition: all 0.25s;
    }
  }
  :deep(.el-input-number.is-controls-right .el-input-number__increase) {
    border-left: unset;
    background: #1c2762;
    color: #9ba0ba;
    border-bottom: 1px solid #0c1337;
    &:hover {
      background: #263378;
      color: #1264f2;
      transition: all 0.25s;
    }
  }
  :deep(.el-form-item) {
    margin-bottom: 10px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  :deep(.el-input__wrapper.is-focus) {
    box-shadow: #1264f2 0px 0px 1px 1px inset;
  }
  :deep(.el-input-group__append) {
    box-shadow: unset;
    background-color: #0c1337;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
  }
  :deep(.el-input-group--append
      .el-input-group__append
      .el-select
      .el-input
      .el-input__wrapper) {
    box-shadow: unset;
  }
  .btn-versiontransfer {
    height: 40px;
    background-color: rgb(12 19 55);
    border: none;
    display: flex;
    align-items: center;
    border-top-left-radius: unset;
    border-bottom-left-radius: unset;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    font-weight: bolder;
    &:hover {
      color: #1264f2;
      background-color: rgb(12 19 55);
      transition: all 0.25s;
    }
  }
  :deep(.el-select__popper.el-popper) {
    background-color: aliceblue !important;
  }
}
</style>

<style>
.vjs-tree-node.is-highlight,
.vjs-tree-node:hover {
  background-color: #fcfcfc29;
}
</style>
