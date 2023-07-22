<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, reactive, computed } from "vue";
import { useUserStoreHook } from "/@/store/modules/user";
import { emitter } from "/@/utils/mitt";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { useGlobal } from "@pureadmin/utils";
import type { FormInstance } from "element-plus";

import Motion from "../utils/motion";
import TxInfoDialog from "/@/components/TxInfoDialog/index.vue";

const ruleForm = reactive({
  username: "",
  password: "",
  repeatPassword: ""
});
const { t } = useI18n();
const { $connex, $dAccount } = useGlobal<GlobalPropertiesApi>();
const ruleFormRef = ref<FormInstance>();
const txInfoDialogRef = ref(null);
const myAddr = computed(() => {
  return useUserStoreHook().dAccount.myAddr;
});
let codeString = null;

const passwordRule = [
  {
    validator: (rule, value, callback) => {
      console.log("password:", value, value.length);
      // issues: đưa REGEXP_PWD ra ngoài sẽ hoạt động không đúng khi "blur"
      // a-z A-Z 0-9, space và các ký tự đặc biệt !@#$%^&*()-_=+`~{}[];:'"<,>.?/\|
      const REGEXP_PWD =
        /^[a-zA-Z0-9 `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]+$/g;

      // null | undefined | ""
      if (!value) {
        callback(new Error("Enter a password"));
      }
      if (value.length < 8) {
        callback(new Error("Use 8 characters or more for your password"));
      } else if (value.length > 100) {
        callback(new Error("Use 100 characters or fewer for your password"));
      } else if (value[0] === " " || value[value.length - 1] === " ") {
        callback(
          new Error("Your password can’t start or end with a blank space")
        );
      } else if (!REGEXP_PWD.test(value)) {
        callback(
          new Error(
            "Only use letters, numbers and common punctuation characters"
          )
        );
      } else {
        callback();
      }
    },
    trigger: "blur"
  }
];

const repeatPasswordRule = [
  {
    validator: (rule, value, callback) => {
      if (value === "") {
        // callback(new Error(transformI18n($t("login.passwordSureReg"))));
        callback(new Error("Confirm your password"));
      } else if (ruleForm.password !== value) {
        // callback(new Error(transformI18n($t("login.passwordDifferentReg"))));
        callback(new Error("Those passwords didn’t match. Try again."));
      } else {
        callback();
      }
    },
    trigger: "blur"
  }
];

function onBackToLogin() {
  useUserStoreHook().setCAccountPage(0);
}

function signToChange() {
  emitter.emit("connectWallet");
  console.log("ruleForm", ruleForm.username);
  txInfoDialogRef.value.txConfirm();

  // useUserStoreHook().setCAccountPage(0);
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
    useUserStoreHook().setCAccountPage(0);
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
</script>

<template>
  <TxInfoDialog
    ref="txInfoDialogRef"
    :on-confirm="onConfirm"
    @feedback="txDialogFeedback"
  />
  <div>
    <el-form ref="ruleFormRef" :model="ruleForm" size="large">
      <div class="input-group" style="padding-bottom: 8px">
        <Motion :delay="50">
          <el-row>Your C-Account: abcdef</el-row>
          <el-row>Link with this address: 0x16cd1...004d</el-row>
        </Motion>

        <Motion :delay="100">
          <el-row
            justify="center"
            style="
              font-size: 30px;
              font-weight: 800;
              margin-bottom: 15px;
              color: #5190ff;
            "
            >Change your password</el-row
          >
        </Motion>

        <Motion :delay="150">
          <el-form-item :rules="passwordRule" prop="password">
            <el-input
              clearable
              show-password
              v-model="ruleForm.password"
              placeholder="New password"
              :prefix-icon="useRenderIcon('lock')"
            />
          </el-form-item>
        </Motion>
      </div>

      <div class="input-group">
        <Motion :delay="200">
          <el-form-item :rules="repeatPasswordRule" prop="repeatPassword">
            <el-input
              clearable
              show-password
              v-model="ruleForm.repeatPassword"
              :placeholder="t('login.reType')"
              :prefix-icon="useRenderIcon('lock')"
            />
          </el-form-item>
        </Motion>
      </div>

      <Motion :delay="250">
        <div class="warning">
          <IconifyIconOnline icon="material-symbols:info-outline-rounded" />
          <p>
            After enter your new password you must to click continue and sign
            your wallet to complete your changes.
          </p>
        </div>
      </Motion>

      <div class="submit">
        <Motion :delay="300">
          <el-button
            @click="signToChange()"
            class="w-full mt-4"
            size="default"
            type="primary"
          >
            Continue
          </el-button>
        </Motion>
      </div>

      <Motion :delay="350">
        <div class="ask" style="margin-top: 0px">
          <note class="icon" />
          <p>
            <el-link @click="onBackToLogin">Back to Login</el-link>
          </p>
        </div>
      </Motion>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.input-group {
  color: rgba(255, 255, 255, 0.5803921569);
}
</style>
