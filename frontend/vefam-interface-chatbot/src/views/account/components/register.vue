<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, reactive } from "vue";
import Motion from "../utils/motion";
// import { updateRules } from "../utils/rule";
import { message } from "@pureadmin/components";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
// import { useVerifyCode } from "../utils/verifyCode";
import { $t, transformI18n } from "/@/plugins/i18n";
import { useUserStoreHook } from "/@/store/modules/user";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
import { userRegister } from "/@/api/user";
import { isValidEmail } from "/@/utils/validate";

const { t } = useI18n();
const checked = ref(true); // accept Terms of Use
const loading = ref(false);
const ruleForm = reactive({
  username: "",
  password: "",
  repeatPassword: ""
});
const ruleFormRef = ref<FormInstance>();
/*
Dựa theo validate username của google
- có thể bao gồm: a-z, A-Z, 0-9 và (.)
- chứ ít nhất 1 chữ cái a-z hoặc A-Z
- dài trong khoảng: 6 đến 30 ký tự
- dấu (.) không ở đầu và cuối, không có 2 dấu (.) liên tiếp
- chữ hoa tự đổi thành chữ thường phía backend

Email: personal_info@domain
personal_info có thể chứa: a-z, A-Z, 0-9, 19 ký tự đặc biệt !#$%&'*+-/=?^_`{|}~
- dấu chấm (.) nhưng không được đặt cạnh @ và đầu hoặc cuối chuỗi
- dài trong khoảng: 6 đến 45 ký tự
*/
const usernameRule = [
  {
    validator: (rule, value, callback) => {
      value = value.trim();
      // console.log("username:", value, value.length);
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
/*
Dựa theo validate password của google
- có thể bao gồm: a-z A-Z 0-9, space và các ký tự đặc biệt !@#$%^&*()-_=+`~{}[];:'"<,>.?/\|
- space không thể ở đầu hoặc cuối
- không thể chỉ toàn số
- dài trong khoảng: 8 đến 100 ký tự
*/
const passwordRule = [
  {
    validator: (rule, value, callback) => {
      // console.log("password:", value, value.length);
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

// @ submit thông tin đăng ký
function onRegister() {
  const body = {
    username: ruleForm.username,
    password: ruleForm.password
  };
  userRegister(body)
    .then(result => {
      // console.log("userRegister-result", result);
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

// submit form
function onSubmit(formEl: FormInstance | undefined) {
  // ElMessage("coming soon!");
  // if (formEl) return; // tạm thời
  if (!formEl) return;
  loading.value = true;
  formEl.validate(valid => {
    if (valid) {
      if (checked.value) {
        onRegister();
      } else {
        loading.value = false;
        message.warning(transformI18n($t("login.tickPrivacy")));
      }
    } else {
      loading.value = false;
    }
  });

  /* loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (checked.value) {
        // Yêu cầu mô phỏng, cần được sửa đổi theo sự phát triển thực tế
        setTimeout(() => {
          message.success(transformI18n($t("login.registerSuccess")));
          loading.value = false;
        }, 2000);
      } else {
        loading.value = false;
        message.warning(transformI18n($t("login.tickPrivacy")));
      }
    } else {
      loading.value = false;
      return fields;
    }
  }); */
}

function onBackToLogin() {
  useUserStoreHook().setCAccountPage(0);
}
</script>

<template>
  <el-form ref="ruleFormRef" :model="ruleForm" size="large">
    <div class="input-group" style="padding-bottom: 8px">
      <Motion>
        <el-form-item :rules="usernameRule" prop="username">
          <el-input
            clearable
            v-model="ruleForm.username"
            :placeholder="t('login.usernameOrEmail')"
            :prefix-icon="useRenderIcon('user')"
          />
        </el-form-item>
      </Motion>
    </div>

    <div class="input-group" style="padding-bottom: 8px">
      <Motion :delay="100">
        <el-form-item :rules="passwordRule" prop="password">
          <el-input
            clearable
            show-password
            v-model="ruleForm.password"
            :placeholder="t('login.password')"
            :prefix-icon="useRenderIcon('lock')"
          />
        </el-form-item>
      </Motion>
    </div>

    <div class="input-group">
      <Motion :delay="150">
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

    <Motion :delay="200">
      <div class="warning">
        <IconifyIconOnline icon="material-symbols:info-outline-rounded" />
        <p>
          By continuing, you agree to our
          <el-link href="#/terms">Terms of Use</el-link>
        </p>
      </div>
    </Motion>

    <Motion :delay="250">
      <div class="submit">
        <el-form-item>
          <el-button
            class="w-full"
            size="default"
            type="primary"
            :loading="loading"
            @click="onSubmit(ruleFormRef)"
          >
            <IconifyIconOnline
              icon="ic:round-app-registration"
              style="margin-right: 5px"
            />
            {{ t("login.register") }}
          </el-button>
        </el-form-item>
      </div>
    </Motion>

    <Motion :delay="300">
      <div class="ask" style="padding: 0px 0px">
        <note class="icon" />
        <p>
          Already had an account?
          <el-link @click="onBackToLogin">Login</el-link>
        </p>
      </div>
    </Motion>
  </el-form>
</template>
