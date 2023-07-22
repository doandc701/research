<script setup lang="ts">
import { ref, reactive } from "vue";
import { $t, transformI18n } from "/@/plugins/i18n";
import { useI18n } from "vue-i18n";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { isValidEmail } from "/@/utils/validate";
import { useUserStoreHook } from "/@/store/modules/user";
import { message } from "@pureadmin/components";
import { ElMessage } from "element-plus";
import { userRegister } from "/@/api/user";
import { useAppStoreHook } from "/@/store/modules/app";
import type { FormInstance } from "element-plus";

import Motion from "../utils/motion";

const { t } = useI18n();
const loading = ref(false);

const ruleForm = reactive({
  username: "",
  password: "",
  repeatPassword: ""
});
const ruleFormRef = ref<FormInstance>();

const usernameRule = [
  {
    validator: (rule, value, callback) => {
      value = value.trim();
      console.log("username:", value, value.length);
      // chuỗi chỉ chứa các chữ cái cho phép: a-z A-Z 0-9 ".", không chứa ký tự đặc biệt
      const REGEXP_USERNAME = /^[0-9A-Za-z\.]+$/;
      const REGEXP_CONTAINS_LETTER = /[a-zA-Z]/; // chuỗi có chứa ít nhất một chữ cái a-z hoặc A-Z
      // null | undefined | ""
      if (!value) {
        callback(new Error("Enter your username or email"));
      }

      // nếu có @ hãy kiểm tra email có hợp lệ không
      if (value.includes("@")) {
        if (value.length < 6 || value.length > 45) {
          callback(
            new Error(
              "[email] Your email must be between 6 and 45 characters long."
            )
          );
        }
        if (!isValidEmail(value)) {
          callback(new Error("[email] Invalid email format"));
        }
        return callback();
      }
      // không có @, hãy kiểm tra username
      if (value.length < 6 || value.length > 30) {
        callback(
          new Error(
            "[username] Your username must be between 6 and 30 characters long."
          )
        );
      }
      if (value[0] === ".") {
        callback(
          new Error(
            "[username] The first character of your username must be an ascii letter (a-z) or number (0-9)"
          )
        );
      }
      if (value[value.length - 1] === ".") {
        callback(
          new Error(
            "[username] The last character of your username must be an ascii letter (a-z) or number (0-9)"
          )
        );
      }
      if (value.includes("..")) {
        callback(
          new Error(
            "[username] Your username cannot contain consecutive periods (.)"
          )
        );
      }

      if (!REGEXP_USERNAME.test(value)) {
        callback(
          new Error(
            "[username] Only letters (a-z), numbers (0-9), and periods (.) are allowed."
          )
        );
      }
      if (!REGEXP_CONTAINS_LETTER.test(value)) {
        callback(
          new Error(
            "[username] Your username must include at least one alphabetical character (a-z)"
          )
        );
      }
      callback();
    },
    trigger: "blur"
  }
];

function onBackToLogin() {
  useUserStoreHook().setCAccountPage(0);
}

function continueChangePass() {
  useUserStoreHook().setCAccountPage(4);
}

function onCheckSearch() {
  const body = {
    username: ruleForm.username
  };
  userRegister(body)
    .then(result => {
      console.log("userRegister-result", result);
      loading.value = false;
      if (result.data.user) {
        message.success(transformI18n($t("login.registerSuccess")));
        onBackToLogin();
      }
      if (result.data.errorMess && result.data.errorMess.length) {
        const message = result.data.errorMess.join("<br>");
        ElMessage({
          message,
          type: "error",
          dangerouslyUseHTMLString: true
        });
      }
    })
    .catch(error => {
      console.error(error);
      loading.value = false;
      ElMessage({
        message: error.message,
        type: "error"
      });
    });
}

function onSearchAcc(formEl: FormInstance | undefined) {
  // if (!formEl) return;
  loading.value = true;
  formEl.validate(valid => {
    if (valid) {
      useAppStoreHook().takeUserBalance();
      // if (checked.value) {
      //   onCheckSearch();
      // } else {
      //   loading.value = false;
      //   message.warning(transformI18n($t("login.tickPrivacy")));
      // }
      continueChangePass();
    } else {
      loading.value = false;
    }
  });
}
</script>

<template>
  <el-form ref="ruleFormRef" :model="ruleForm" size="large">
    <div class="input-group" style="padding-bottom: 8px">
      <Motion :delay="50">
        <el-row justify="center">
          <iconifyIconOnline
            style="font-size: 45px; color: #5190ff"
            icon="uis:lock-alt"
          />
        </el-row>
        <el-row
          justify="center"
          style="
            font-size: 30px;
            font-weight: 800;
            margin-bottom: 25px;
            color: #5190ff;
          "
          >Trouble logging in?</el-row
        >
      </Motion>
      <Motion :delay="100">
        <div style="margin-bottom: 8px">
          Please enter your username or email address to search for your
          account.
        </div>
      </Motion>
      <Motion :delay="150">
        <el-form-item :rules="usernameRule" prop="username">
          <el-input
            clearable
            v-model="ruleForm.username"
            :placeholder="t('login.usernameOrEmail')"
            :prefix-icon="useRenderIcon('user')"
          />
        </el-form-item>
      </Motion>

      <Motion :delay="200">
        <div class="submit" style="margin-top: 30px">
          <el-form-item>
            <el-button
              class="w-full"
              size="default"
              type="primary"
              :loading="loading"
              @click="onSearchAcc(ruleFormRef)"
            >
              <IconifyIconOnline
                icon="mdi:clipboard-text-search-outline"
                style="margin-right: 5px"
              />
              Search
            </el-button>
          </el-form-item>
        </div>
      </Motion>

      <Motion :delay="250">
        <div class="ask" style="padding: 0px 0px">
          <note class="icon" />
          <p>
            <el-link @click="onBackToLogin">Back to Login</el-link>
          </p>
        </div>
      </Motion>
    </div>
  </el-form>
</template>

<style lang="scss" scoped>
.input-group {
  color: rgba(255, 255, 255, 0.5803921569);
}
</style>
