<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useUserStoreHook } from "/@/store/modules/user";
import Swap from "./components/swap.vue";
import Pool from "./components/pool.vue";

defineOptions({
  name: "Swap"
});
const tab = ref("first");
const addr = computed(() => {
  return useUserStoreHook().dAccount.myAddr;
});
onMounted(() => {});
</script>

<template>
  <div class="swap-wrapper">
    <el-row justify="center">
      <div class="swap-container">
        <div class="swap-container-child">
          <div class="ellipse-parent" />
          <div class="ellipse-child" />
          <!-- <el-row class="tab-button-group">
            <el-radio-group v-model="tab">
              <el-radio-button class="btn-swap small" label="swap"
                >Swap</el-radio-button
              >
              <el-radio-button class="btn-pool small" label="pool"
                >Pool</el-radio-button
              >
            </el-radio-group>
          </el-row> -->
          <!-- <component :is="tab" :addr="addr" /> -->
          <!-- <component :is="tab" :addr="addr" /> -->

          <el-tabs v-model="tab" class="tabs-blue-color">
            <el-tab-pane class="btn-swap small" label="Swap" name="first">
              <Swap :addr="addr" />
            </el-tab-pane>

            <el-tab-pane class="btn-pool small" label="Pool" name="second">
              <Pool :addr="addr" />
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- <p
          v-if="$network === 'test'"
          style="text-align: center; color: #0090df"
        >
          <el-link
            type="primary"
            href="https://faucet.vecha.in/"
            target="_blank"
            ><el-icon><Link /></el-icon> VeChain TestNet Faucet</el-link
          >
        </p> -->
      </div>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
$ellip--wd: 1500px;
.swap-wrapper {
  min-height: calc(100vh - var(--el-header-height2));
  overflow: hidden;
  .ellipse-parent {
    position: absolute;
    width: $ellip--wd;
    height: $ellip--wd;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid rgba(133, 200, 242, 0.25);
    border-radius: 50%;
    filter: blur(1px);
  }
  .ellipse-child {
    position: absolute;
    width: 1178px;
    height: 1178px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 1px solid rgba(133, 200, 242, 0.25);
    filter: blur(1px);
  }
}
.swap-container {
  width: 95%;
  max-width: 560px;
  margin: 50px 2% 50px 2%;
  .swap-container-child {
    position: relative;
    padding: 20px;
    border: 2px solid #0c498d;
    border-radius: 20px;
    .tab-button-group {
      margin-bottom: 15px;
      display: block;
      .el-radio-group {
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.15);
      }
    }
    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 378px;
      height: 378px;
      background: #003a8c;
      filter: blur(100px);
      transform: translate(-50%, -50%);
      border-radius: 50%;
      z-index: -1;
    }
  }
}

@media only screen and (max-width: 900px) {
  .ellipse-parent,
  .ellipse-child {
    display: none;
  }
}
</style>

<style lang="scss">
.swap-container-child {
  .el-radio-group {
    .el-radio-button__original-radio:checked + .el-radio-button__inner {
      background: #3088bf;
      border: 0;
    }
    .btn-swap,
    .btn-pool {
      & span {
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .btn-swap {
      & span {
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
      }
    }
    .btn-pool {
      & span {
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
      }
    }
    .el-radio-button__inner:hover {
      // color:#7142FF;
    }
    .el-radio-button__inner {
      background: transparent;
      border: 0 !important;
    }
  }

  .grey-form-item {
    background: rgba(48, 136, 191, 0.25);
    padding: 10px 20px;
    border-radius: 20px;
    margin-bottom: 10px;
    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .text-from {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn-max {
          background: transparent;
          border: 0;
          color: #19a3fa;
          padding-left: 15px;
          font-weight: 500;
          cursor: pointer;
        }
      }
      .text-to {
        max-width: 50px;
        width: 100%;
        text-align: left;
      }
    }
    .text-from p,
    .text-to p {
      margin: 4px 0;
    }
    .button-token-group {
      appearance: button;
      display: inline-block;
      height: 40px;
      background-color: #3088bf;
      transition: all 0.3s ease-in-out;
      border-radius: 50px;
      text-align: center;
      border: 0;
      cursor: pointer;
      color: #ffff;
      /* box-shadow: rgb(0 0 0 / 8%) 0px 6px 10px; */
      .button-token-row {
        justify-content: center;
        width: max-content;
        .token-avatar1 {
          margin-right: 8px;
        }
        span {
          font-size: 18px;
        }
      }
    }
    .button-token-group:hover {
      /* box-shadow: 5.5px 5.5px rgba(0, 0, 0, 0.4) */
      background-color: #399ad8;
      box-shadow: 0px 2px 6px rgb(0 220 255 / 20%);
    }
    .el-form-item__content {
      align-items: center;
      display: flex;
    }
    .el-input__inner {
      height: 50px;
      line-height: 50px;
      border: 0;
      background: transparent;
      padding: 0 5px;
      font-size: 28px;
      font-weight: 500;
      font-family: "Inter custom", sans-serif;
      text-align: left;
      color: #ffff;
    }
    .el-input__inner::placeholder {
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: rgba(255, 255, 255, 0.406);
    }
    .el-input__inner:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: rgba(255, 255, 255, 0.406);
    }
    .el-input__inner::-ms-input-placeholder {
      /* Microsoft Edge */
      color: rgba(255, 255, 255, 0.406);
    }
    .el-form-item__error {
      margin-top: -10px;
      text-align: left;
      width: 100%;
      z-index: 1;
    }
  }

  .swap-card .el-form-item__label,
  .add-lp-form .el-form-item__label {
    padding-bottom: 5px;
    line-height: 20px;
    text-align: right;
    color: rgb(255, 255, 255, 0.9);
  }
  & form.el-form.el-form--label-top {
    .el-radio-button__original-radio:checked + .el-radio-button__inner {
      border-radius: 10px;
    }
  }
}

@media only screen and (max-width: 500px) {
  .swap-container-child {
    padding: 16px !important;
    .grey-form-item {
      .el-input__inner {
        height: 46px;
        line-height: 46px;
        font-size: 26px;
      }
    }
  }
}
@media only screen and (max-width: 450px) {
  .swap-container-child {
    padding: 12px !important;
    .grey-form-item {
      padding: 10px 15px;
      border-radius: 16px;
      .el-input__inner {
        height: 44px;
        line-height: 44px;
        font-size: 25px;
      }
    }
    .text-from p,
    .text-to p {
      margin: 3px 0;
    }
  }
}
@media only screen and (max-width: 400px) {
  .swap-container-child {
    .grey-form-item {
      padding: 10px;
      border-radius: 16px;
      .el-input__inner {
        height: 40px;
        line-height: 40px;
        font-size: 24px;
      }
      .label-row {
        // justify-content: end;
        .text-from p:first-child,
        .text-to {
          // display: none;
          width: 0;
          overflow: hidden;
        }
        .text-from .btn-max {
          padding-left: 5px;
        }
      }
    }
  }
}
</style>
