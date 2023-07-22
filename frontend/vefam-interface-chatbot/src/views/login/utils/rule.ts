import { reactive } from "vue";
import { isPhone } from "@pureadmin/utils";
import type { FormRules } from "element-plus";
import { $t, transformI18n } from "/@/plugins/i18n";
import { useUserStoreHook } from "/@/store/modules/user";

/** Mã xác minh 6 chữ số thông thường */
export const REGEXP_SIX = /^\d{6}$/;

/** Mật khẩu thông thường (định dạng mật khẩu phải là bất kỳ sự kết hợp nào của 8-18 chữ số, chữ cái và ký hiệu) */
export const REGEXP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;

/** Xác minh đăng nhập */
const loginRules = reactive(<FormRules>{
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error(transformI18n($t("login.passwordReg"))));
        } else if (!REGEXP_PWD.test(value)) {
          callback(new Error(transformI18n($t("login.passwordRuleReg"))));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  verifyCode: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error(transformI18n($t("login.verifyCodeReg"))));
        } else if (useUserStoreHook().verifyCode !== value) {
          callback(new Error(transformI18n($t("login.verifyCodeCorrectReg"))));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

/** Xác minh đăng nhập điện thoại di động */
const phoneRules = reactive(<FormRules>{
  phone: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error(transformI18n($t("login.phoneReg"))));
        } else if (!isPhone(value)) {
          callback(new Error(transformI18n($t("login.phoneCorrectReg"))));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  verifyCode: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error(transformI18n($t("login.verifyCodeReg"))));
        } else if (!REGEXP_SIX.test(value)) {
          callback(new Error(transformI18n($t("login.verifyCodeSixReg"))));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

/** Forgot password check */
const updateRules = reactive(<FormRules>{
  phone: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error(transformI18n($t("login.phoneReg"))));
        } else if (!isPhone(value)) {
          callback(new Error(transformI18n($t("login.phoneCorrectReg"))));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  verifyCode: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error(transformI18n($t("login.verifyCodeReg"))));
        } else if (!REGEXP_SIX.test(value)) {
          callback(new Error(transformI18n($t("login.verifyCodeSixReg"))));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error(transformI18n($t("login.passwordReg"))));
        } else if (!REGEXP_PWD.test(value)) {
          callback(new Error(transformI18n($t("login.passwordRuleReg"))));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

export { loginRules, phoneRules, updateRules };
