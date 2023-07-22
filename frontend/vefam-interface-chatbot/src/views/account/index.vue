<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Motion from "./utils/motion";
// import { useRouter } from "vue-router";
import { loginRules } from "./utils/rule";
// import phone from "./components/phone.vue";
// import qrCode from "./components/qrCode.vue";
// import update from "./components/update.vue";
import register from "./components/register.vue";
import forgotPass from "./components/forgotPass.vue";
import changePass from "./components/changePass.vue";
// import { initRouter } from "/@/router/utils";
// import { useNav } from "/@/layout/hooks/useNav";
// import { message } from "@pureadmin/components";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
// import { storageSession } from "@pureadmin/utils";
import { $t, transformI18n } from "/@/plugins/i18n";
import { ref, reactive, computed } from "vue";
// import { useLayout } from "/@/layout/hooks/useLayout";
import { useUserStoreHook } from "/@/store/modules/user";
// import { ReImageVerify } from "/@/components/ReImageVerify";
import { useRenderIcon } from "/@/components/ReIcon/src/hooks";
// import { emitter } from "/@/utils/mitt";
// import { useGlobal } from "@pureadmin/utils";
// import { getLogin, refreshToken } from "/@/api/user";
import { userLogin } from "/@/api/user";

// new components
import cAccountDetails from "./components/c-account-details.vue";
import dAccount from "./components/d-account.vue";
import faqs from "./components/FAQs.vue";
// const { $connex } = useGlobal<GlobalPropertiesApi>();

// assets
import xubay from "/@/assets/xu_bay_bay.png";
import caccount from "/@/assets/img/caccount.png";

defineOptions({
  name: "AccountManage"
});

// const router = useRouter();
const loading = ref(false);
const rememberChecked = ref(true); // Remember password
const termsChecked = ref(true);
const ruleFormRef = ref<FormInstance>();
const { t } = useI18n();

const ruleForm = reactive({
  username: "",
  password: ""
});
//
const userStoreHook = useUserStoreHook();

const currentPage = computed(() => {
  return userStoreHook.currentPage;
});
const userName = computed(() => {
  return userStoreHook.cAccount.userName;
});
/*
const linkedAddr = computed(() => {
  return userStoreHook.cAccount.linkedAddr;
});*/

// @ submit thông tin đăng ký
function onLogin() {
  const body = {
    username: ruleForm.username,
    password: ruleForm.password,
    remember: rememberChecked.value
  };
  userLogin(body)
    .then(result => {
      console.log("userLogin-result:", result);
      // userName, linkedCode, linkedAddr
      const data = result.data;
      if (data.accessToken && data.accessToken.token && data.user) {
        const user = data.user;
        userStoreHook.loggedCAccount(data.accessToken, user.displayName);
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
        userStoreHook.setCAccountPage(2);
        ElMessage({
          message: "Login successfully",
          type: "success"
        });
      } else if (data.errorMess.length) {
        const message = data.errorMess.join("<br>");
        ElMessage({
          message,
          type: "error",
          duration: 5000,
          dangerouslyUseHTMLString: true
        });
      }
      loading.value = false;
    })
    .catch(error => {
      console.error(error);
      loading.value = false;
      ElMessage({
        message: error.message,
        type: "error"
      });
    });
  /* Sync1 không hỡ trợ finally
    .finally(() => {
      loading.value = false;
    }); */
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  // ElMessage("coming soon!");
  // if (formEl) return; // tạm thời
  if (!formEl) return;

  // demo login -----------
  // const name = "admin";
  // userStoreHook.loggedCAccount("eyJhbGciOiJIUzUxMiJ9.testToken", name);
  // // username, tempCode, linkedCode, address
  // userStoreHook.updateCAccount(name, "", "", "");
  // userStoreHook.setCAccountPage(2);
  // return;
  // end: demo login ----------

  loading.value = true;
  formEl.validate(valid => {
    if (valid) {
      if (termsChecked.value) {
        onLogin();
      } else {
        loading.value = false;
        message.warning(transformI18n($t("login.tickPrivacy")));
      }
    } else {
      loading.value = false;
    }
  });

  /* formEl.validate((valid, fields) => {
    // alert(valid)
    if (valid) {
      // request mô phỏng, cần được sửa đổi theo sự phát triển thực tế
      setTimeout(() => {
        loading.value = false;
        storageSession.setItem("info", {
          username: "admin",
          accessToken: "eyJhbGciOiJIUzUxMiJ9.test"
        });
        initRouter("admin").then(() => {});
        message.success("Login successfully");
        router.push("/");
      }, 100);
    } else {
      loading.value = false;
      return fields;
    }
  }); */
};

function gotoRegister() {
  userStoreHook.setCAccountPage(1);
}

function forgotPassword() {
  userStoreHook.setCAccountPage(3);
}
// function onchangeLayout() {
//   userStoreHook.setCAccountPage(2);
// }
</script>

<template>
  <div class="login-container">
    <div class="container1">
      <div class="image">
        <el-image :src="xubay" alt="" fit="cover">
          <template #placeholder>
            <div class="loader">
              <div class="inner one" />
              <div class="inner two" />
              <div class="inner three" />
            </div>
          </template>
        </el-image>
      </div>
      <div class="card">
        <el-card>
          <div class="card-form">
            <div class="card-title">
              <el-image :src="caccount" fit="cover" />
            </div>
            <el-form
              v-if="currentPage === 0"
              ref="ruleFormRef"
              :model="ruleForm"
              size="large"
              @keyup.enter="onSubmit(ruleFormRef)"
            >
              <div class="input-group">
                <Motion :delay="100">
                  <el-form-item
                    :rules="[
                      {
                        required: true,
                        message: transformI18n($t('login.usernameReg')),
                        trigger: 'blur'
                      }
                    ]"
                    prop="username"
                  >
                    <el-input
                      clearable
                      v-model="ruleForm.username"
                      :placeholder="t('login.usernameOrEmail')"
                      :prefix-icon="useRenderIcon('user')"
                    />
                  </el-form-item>
                </Motion>
              </div>
              <div class="input-group">
                <Motion :delay="150">
                  <el-form-item prop="password">
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

              <Motion :delay="200">
                <el-form-item>
                  <div
                    class="w-full h-20px flex justify-between items-center"
                    style="padding-top: 10px"
                  >
                    <el-checkbox v-model="rememberChecked">
                      {{ t("login.remember") }}
                    </el-checkbox>
                  </div>
                </el-form-item>
                <div class="warning">
                  <IconifyIconOnline
                    icon="material-symbols:info-outline-rounded"
                  />
                  <p>
                    By continuing, you agree to our
                    <el-link href="#/terms">Terms of Use</el-link>
                  </p>
                </div>
              </Motion>
              <div class="submit">
                <Motion :delay="250">
                  <el-button
                    class="w-full mt-4"
                    size="default"
                    type="primary"
                    :loading="loading"
                    @click="onSubmit(ruleFormRef)"
                  >
                    <IconifyIconOnline
                      icon="ri:login-circle-line"
                      style="margin-right: 5px"
                    />
                    {{ t("login.login") }}
                  </el-button>
                </Motion>
                <!-- <Motion :delay="250">
                  <el-button
                    class="w-full mt-4"
                    size="default"
                    type="primary"
                    @click="onchangeLayout"
                  >
                    Test Login
                  </el-button>
                </Motion> -->
              </div>
              <div class="ask">
                <Motion :delay="300">
                  <!-- <p>
                    <el-link @click="forgotPassword"
                      >Forgotten password?</el-link
                    >
                  </p>
                  <el-row justify="center">
                    <el-divider content-position="center">Or</el-divider>
                  </el-row> -->
                  <!-- <note class="icon" /> -->
                  <p>
                    Don’t have an account?
                    <el-link @click="gotoRegister">Register</el-link>
                  </p>
                </Motion>
              </div>
            </el-form>
            <!-- form register -->
            <register v-else-if="currentPage === 1" />
            <!-- c-account-details -->
            <c-account-details v-else-if="currentPage === 2" />
            <forgotPass v-else-if="currentPage === 3" />
            <changePass v-else-if="currentPage === 4" />
          </div>
        </el-card>
      </div>
    </div>
    <div id="d-account" class="container2">
      <d-account />
    </div>
    <div class="container3">
      <faqs />
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-divider__text) {
  font-size: 16px;
  font-weight: 700;
  background-color: #171b33;
  color: rgb(82 92 154);
}

:deep(.el-divider--horizontal) {
  // display: flex;
  // justify-content: center;
  width: 70%;
  border-top: 1px solid rgb(82 92 154);
}
</style>

<style lang="scss">
.login-container {
  color: #ffff;
  padding: 0px 50px;
  max-width: 1920px;
  margin: 0 auto !important;

  .el-link {
    font-size: 16px;
  }

  .container1 {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 32px;
    padding-top: 40px;

    .image {
      width: 450px;
      height: 450px;
      overflow: unset;

      .el-image {
        bottom: -50px;
        padding-right: 20px;
      }
    }

    .card {
      width: 500px;
      max-width: 100%;

      .el-card {
        border: unset;
        background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
        padding: 1px;
        border-radius: 12px;

        &__body {
          padding: 0px;
        }

        .card-form {
          background: #171b33;
          padding: 20px;
          border-radius: 12px;
        }
        .el-form {
          .input-group {
            .el-form-item {
              .el-input__wrapper {
                background-color: rgba(0, 0, 0, 0.3);
                padding: 6px 10px;
                border-radius: 12px;
                box-shadow: 0 0 0 1px #000000;
                transition: 0.5s ease-out;
                &:hover {
                  transition: 0.5s ease-out;
                  box-shadow: 0 0 0 1px #767676;
                }
                &:focus-within {
                  transition: 0.5s ease-out;
                  box-shadow: 0 0 0 1px #45bbff !important;
                }
              }
            }

            .el-form-item.is-error .el-input__wrapper {
              transition: 0.5s ease-out;
              box-shadow: 0 0 0 1px rgba(255, 100, 100, 0.872) inset;
            }

            .el-input__inner {
              color: #ffff;
            }
          }

          .warning {
            color: #ffffff94;
          }

          .warning,
          .ask {
            display: flex;
            align-items: center;
            padding-bottom: 20px;
            color: #ffffff94;

            & svg {
              margin-right: 8px;
              width: 25px;
            }

            & p {
              .el-link {
                color: #45bbff;
              }
            }
          }

          .submit {
            .el-button {
              width: 100%;
              height: 40px;
              background: linear-gradient(
                94.9deg,
                #00f6ff 0%,
                #5d7eff 48.44%,
                #5429a0 100%
              );
              border-radius: 56px;
              border: none;
              transition: 0.5s ease-out;
              opacity: 0.8;

              & > span {
                font-style: normal;
                font-weight: 700;
                font-size: 18px;
                color: #ffff;
                div {
                  display: contents;
                }
                svg {
                  font-size: 20px;
                }
              }

              &:hover {
                opacity: 1;
              }
            }
          }

          .ask {
            display: block;
            text-align: center;
            padding-top: 20px;
            padding-bottom: 0px;
          }
        }
      }
    }

    .item .box .box_text {
      padding: 10px 10px;
    }
  }

  .container2 {
    margin-bottom: 60px;
  }

  .container3 {
    padding-bottom: 120px;

    .el-card {
      border: unset;
      background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
      padding: 1px;
      border-radius: 12px;
      color: #ffff;

      &__body {
        padding: 0px;
      }

      .collapse {
        width: 100%;
        height: 100%;
        background: #171b33;
        padding: 20px;
        border-radius: 12px;

        .el-collapse {
          --el-collapse-border-color: unset;

          &-item {
            border-bottom: 1px solid #5d7eff;

            &.is-active {
              .el-collapse-item__header {
                color: #3ea3e1;
              }
            }

            .el-collapse-item__wrap {
              background-color: inherit;
            }

            .el-collapse-item__content {
              color: #ffff;
            }
          }
        }

        .el-collapse-item__header {
          color: #ffff;
          background-color: inherit;
          font-size: 16px;
        }

        .el-collapse-item:last-child {
          border-bottom: unset;
        }
      }
    }
  }

  .card-title {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;

    .el-image {
      width: 80%;
      max-width: 250px;
    }
  }
  // custome .loader
  .image,
  .card-vip {
    @keyframes rotate-one {
      0% {
        transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
      }

      100% {
        transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
      }
    }

    @keyframes rotate-two {
      0% {
        transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
      }

      100% {
        transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
      }
    }

    @keyframes rotate-three {
      0% {
        transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
      }

      100% {
        transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
      }
    }

    .loader {
      position: absolute;
      top: calc(50% - 32px);
      left: calc(50% - 32px);
      width: 64px;
      height: 64px;
      border-radius: 50%;
      perspective: 800px;
    }

    .inner {
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    .inner.one {
      left: 0%;
      top: 0%;
      animation: rotate-one 1s linear infinite;
      border-bottom: 3px solid #efeffa;
    }

    .inner.two {
      right: 0%;
      top: 0%;
      animation: rotate-two 1s linear infinite;
      border-right: 3px solid #efeffa;
    }

    .inner.three {
      right: 0%;
      bottom: 0%;
      animation: rotate-three 1s linear infinite;
      border-top: 3px solid #efeffa;
    }
  }
}

@media screen and (max-width: 600px) {
  .login-container {
    padding: 0px 15px;
    position: relative;

    .container1 {
      flex-direction: column-reverse;
      padding-top: 20px;

      .image {
        width: 220px;
        height: 100%;

        .el-image {
          bottom: -20px;
          padding-right: 0px;
        }
      }
    }
  }
}

@media only screen and (max-width: 480px) {
  .login-container {
    padding: 0px 10px;
    font-size: 15px;

    .el-link {
      font-size: 15px;
    }

    .container1 .card .el-card {
      .card-form {
        padding: 10px;
      }
    }

    .container3 .el-card .collapse {
      padding: 8px;

      .el-collapse-item__header {
        font-size: 13px;
      }
    }
  }
}

@media only screen and (max-width: 400px) {
  .login-container {
    font-size: 14px;

    .el-link {
      font-size: 14px;
    }

    .container1 .card .el-card {
      .el-form .submit .el-button {
        height: 34px;
        & > span {
          font-weight: 600;
          font-size: 16px;
          svg {
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
