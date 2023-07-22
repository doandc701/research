<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
// import vet from "/@/assets/img/token/vet.svg?component";
import Motion from "../utils/motion";
import { emitter } from "/@/utils/mitt";
import { useGlobal } from "@pureadmin/utils";
import { userRegisterCode, userSyncCode, userUpdateCode } from "/@/api/user";

import { useUserStoreHook } from "/@/store/modules/user";
import Address from "/@/components/Address/index.vue";
import TxInfoDialog from "/@/components/TxInfoDialog/index.vue";
import AddressDropdown from "/@/components/AddressDropdown/index.vue";

const txInfoDialogRef = ref(null);
const { $connex, $dAccount } = useGlobal<GlobalPropertiesApi>();

//
const userStoreHook = useUserStoreHook();
//
const loading = ref(false);

// console.log("userStoreHook.cAccount", userStoreHook.cAccount);

// C-Account
const displayName = computed(() => {
  return userStoreHook.cAccount.displayName;
});
const userName = computed(() => {
  return userStoreHook.cAccount.userName;
});
const secretName = computed(() => {
  return userStoreHook.cAccount.secretName;
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

const linkAccDialog = ref(false);

// đăng ký code để kết nối với dAccount
function userRegisterTempCode() {
  loading.value = true;
  const data = {
    address: myAddr.value
  };
  //
  userRegisterCode(data, token.value)
    .then(result => {
      // console.log("userRegisterCode-result", result);
      loading.value = false;
      linkAccDialog.value = false;
      if (result.data.errorMess.length) {
        const message = result.data.errorMess.join("<br>");
        ElMessage({
          message,
          type: "error",
          duration: 5000,
          dangerouslyUseHTMLString: true
        });
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
              user.displayName,
              user.local ? user.local.username : "",
              user.local ? user.local.email : "",
              user.dAccount ? user.dAccount.tempCode : "",
              user.dAccount ? user.dAccount.linkedCode : "",
              user.dAccount ? user.dAccount.address : "",
              user.role ? user.role : []
            );
          }
        }
      }
    })
    .catch(error => {
      console.error(error);
      loading.value = false;
      ElMessage({
        message: error.message,
        type: "error",
        duration: 5000
      });
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
  // alert("txDialogFeedback: " + mss);
  if (mss === "success") {
    syncCDAccount();
  } else {
    // Cancel, Error or reverted
    // stop();
  }
}

/*
 - sync sau khi ký giao dịch linkAccount() thành công
*/
function syncCDAccount() {
  // console.log("token", token.value);
  const data = {
    username: userName.value
  };
  userSyncCode(data, token.value)
    .then(result => {
      // console.log("userSyncCode-result", result);
      loading.value = false;
      if (result.data.errorMess.length) {
        const message = result.data.errorMess.join("<br>");
        ElMessage({
          message,
          type: "error",
          duration: 5000,
          dangerouslyUseHTMLString: true
        });
      } else {
        if (result.data.codeString) {
          codeString = result.data.codeString;
          txInfoDialogRef.value.txConfirm();
        } else if (result.data.canSync) {
          // sync ok
          if (result.data.user) {
            const user = result.data.user;
            // displayName, username, email, tempCode, linkedCode, linkedAddr, role
            userStoreHook.updateCAccount(
              user.displayName,
              user.local ? user.local.username : "",
              user.local ? user.local.email : "",
              user.dAccount ? user.dAccount.tempCode : "",
              user.dAccount ? user.dAccount.linkedCode : "",
              user.dAccount ? user.dAccount.address : "",
              user.role ? user.role : []
            );
          }
        }
      }
    })
    .catch(error => {
      console.error(error);
      loading.value = false;
      ElMessage({
        message: error.message,
        type: "error",
        duration: 5000
      });
    });
}

/*
  "Connect Wallet" hoặc "Link Account Now"
*/
function connectWallet() {
  if (loading.value) return;
  // console.log("cATempCode", cATempCode.value);
  // console.log("dALinkedCode", dALinkedCode.value);

  // userStoreHook.setCAccountPage(3);
  if (myAddr.value) {
    if (!cALinkedAddr.value) {
      /* cho dù có cATempCode và dALinkedCode vẫn thực hiện userRegisterTempCode() mà không sử dụng syncCDAccount() tại button này
      - có dALinkedCode vẫn thực hiện userRegisterTempCode() để sycn cAccount với dAccount khác nếu có
      - BE sẽ thực hiện cả sync nếu có tempCode, hơn thế nữa BE sẽ kiểm tra kỹ hơn về address được yêu cầu kết nối
      */
      // userRegisterTempCode();
      linkAccDialog.value = true;
    }
  } else {
    emitter.emit("connectWallet");
  }
}
</script>
<template>
  <TxInfoDialog
    ref="txInfoDialogRef"
    :on-confirm="onConfirm"
    @feedback="txDialogFeedback"
  />
  <el-form>
    <div class="input-group">
      <Motion :delay="100">
        <div class="item">
          <!-- <h3 class="lb_text">User:</h3> -->
          <div class="box">
            <div class="box_text">
              <div>{{ displayName }}</div>
              <div class="secret-name">{{ secretName }}</div>
            </div>
          </div>
        </div>
      </Motion>
      <Motion :delay="150">
        <div class="item">
          <h3 class="lb_text">Link with D-Account:</h3>
          <div v-if="cALinkedCode && cALinkedAddr" class="box">
            <div class="box_text">
              <Address :addr="cALinkedAddr" />
            </div>
          </div>
        </div>
      </Motion>
    </div>
    <Motion :delay="250">
      <div v-if="!cALinkedCode || !cALinkedAddr" class="submit">
        <el-button
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
    </Motion>
    <p class="text_wd">Link with D-Account to play PvP online games</p>
    <!-- test button -->
    <div v-if="adminLv > 0">
      <el-link type="danger" href="./#/account/admin">Admin >></el-link>
      <el-button @click="connectWallet" v-loading="loading">
        Link Account
      </el-button>
      <el-button @click="syncCDAccount" v-loading="loading">
        Sync code
      </el-button>
    </div>
    <!-- end: test button -->
  </el-form>

  <div class="confirm-dialog">
    <el-dialog
      v-model="linkAccDialog"
      title="Link C-Account Confirmation"
      custom-class="dialog-type2 link-cacc"
    >
      <div style="color: #fff">
        <el-row justify="center" style="font-weight: 900; font-size: 20px">
          C-Account:
          <span style="color: #9d00ff; margin-left: 5px">{{ secretName }}</span>
        </el-row>
        <el-row justify="center">
          <IconifyIconOnline
            style="font-size: 60px; margin: 15px 0px"
            icon="solar:link-bold"
          />
        </el-row>
        <el-row justify="center"> With wallet address </el-row>
        <el-row justify="center">
          <!-- <Address :addr="myAddr" /> -->
          <el-dropdown popper-class="addressDropdown-arrow">
            <span class="el-dropdown-link">
              <el-link class="link-type01">
                <Address style="font-size: 16px" :addr="myAddr" />
              </el-link>
            </span>
            <template #dropdown>
              <AddressDropdown title="View address" :account-address="myAddr" />
            </template>
          </el-dropdown>
        </el-row>
      </div>
      <template #footer>
        <el-button
          class="w-full button-type1"
          size="default"
          type="primary"
          :loading="loading"
          @click="userRegisterTempCode()"
          >Continue</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.container1 {
  .item {
    color: #ffff;

    .lb_text {
      color: rgba(255, 255, 255, 0.597);
      padding: 10px 0px;
    }

    .box {
      background: rgba(3, 3, 3, 0.25);
      border-radius: 10px;
      .box_text {
        padding: 10px 0px;
      }
      .secret-name {
        font-size: 13px;
        color: #ffffff87;
      }
    }
  }

  .text_wd {
    color: #45bbff;
    padding: 20px 10px;
    text-align: center;
  }
}
.confirm-dialog {
  :deep(.dialog-type2.link-cacc) {
    max-width: 320px;
    width: 95%;
  }
  :deep(.el-dialog__body) {
    padding: 10px;
  }
}
</style>
