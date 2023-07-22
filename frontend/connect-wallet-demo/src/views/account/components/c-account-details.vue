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
const { $connex, $dAccount } = useGlobal<GlobalPropertiesApi>();
import TxInfoDialog from "/@/components/TxInfoDialog/index.vue";
const txInfoDialogRef = ref(null);

//
const userStoreHook = useUserStoreHook();
//
const loading = ref(false);

// cAccount
const userName = computed(() => {
  return userStoreHook.cAccount.userName;
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

// dAccount
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
      console.log("result", result);
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
          /* trước đó đã thực hiện userRegisterTempCode() cho dù đã có dALinkedCode hay không vì vậy hãy kiểm tra lại tại đây
            nếu đã có dALinkedCode hãy cảnh báo và ngăn chặn ký giao dịch linkAccount() vì nó sẽ thất bại
          */
          if (dALinkedCode.value) {
            ElMessage({
              message: `Wallet address #${myAddr.value} has been linked to an account`,
              type: "warning",
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
      $connex.vendor
        .sign("tx", clauses)
        .signer(myAddr.value)
        .request()
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
      console.log("result", result);
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
  console.log("cATempCode", cATempCode.value);
  console.log("dALinkedCode", dALinkedCode.value);

  // userStoreHook.SET_CURRENTPAGE(3);
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
};
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
          <h3 class="lb_text">Username:</h3>
          <div class="box">
            <p class="box_text">{{ userName }}</p>
          </div>
        </div>
      </Motion>
      <Motion :delay="150">
        <div class="item">
          <h3 class="lb_text">Link with D-Account:</h3>
          <div  v-if="cALinkedCode && cALinkedAddr" class="box">
            <p class="box_text">
              <Address
                :addr="cALinkedAddr"
              />
            </p>
          </div>
        </div>
      </Motion>
    </div>
    <Motion :delay="250">
      <div
        v-if="!cALinkedCode || !cALinkedAddr"
        class="submit"
      >
        <el-button
          class="w-full mt-4"
          size="default"
          type="primary"
          @click="connectWallet"
          v-loading="loading"
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
    <el-button @click="connectWallet" v-loading="loading">
      Link Account
    </el-button>
    <el-button @click="syncCDAccount" v-loading="loading">
      Sync code
    </el-button>
    <!-- end: test button -->
  </el-form>
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
    }
  }

  .text_wd {
    color: #45bbff;
    padding: 20px 10px;
    text-align: center;
  }
}
</style>
