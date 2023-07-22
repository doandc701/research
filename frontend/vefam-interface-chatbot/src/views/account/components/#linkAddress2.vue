<script setup lang="ts">
import daccount from "/@/assets/img/daccount.png";
import cardVip from "/@/assets/img/cardVip.png";

import { useUserStoreHook } from "/@/store/modules/user";

defineOptions({
  name: "LoginV"
});
const onLogin = () => {
  useUserStoreHook().dAccount.currentPage++;
  if (useUserStoreHook().dAccount.currentPage > 3)
    useUserStoreHook().dAccount.currentPage = 1;
};
</script>
<template>
  <div class="car-main">
    <div class="form-text">
      <el-image :src="daccount" fit="cover" lazy />
    </div>
    <div class="add-link">
      <p>Address: <el-link style="color: #45bbff">0x7F7a...9b7E</el-link></p>
      <p>
        Link with C account:
        <span style="color: #45bbff">Muhamad Ramdani</span>
      </p>
    </div>
    <div class="card-vip">
      <el-image class="img" :src="cardVip" fit="cover" lazy />
      <div class="address">
        <div class="address-description">
          <div class="text_about">
            <p>Name: <span style="color: #fff600">Not linked yet </span></p>
            <p>
              My rewards:
              <span style="color: #fff600">Register to see your rewards </span>
            </p>
          </div>
        </div>
      </div>
      <!-- btn connect -->
      <div class="btn">
        <div class="btn-connect">
          <el-button @click="onLogin">Register VIP now</el-button>
        </div>
      </div>
    </div>
    <div class="register-bulletedList">
      <div class="description">
        <svg
          width="13"
          height="23"
          viewBox="0 0 13 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-8.6849e-08 11.5L6.31371 0.186292L12.6274 11.5L6.31371 22.8137L-8.6849e-08 11.5Z"
            fill="#D9D9D9"
          />
        </svg>
        <p>A place to stash your digital items & currencies.</p>
      </div>
      <div class="description">
        <svg
          width="13"
          height="23"
          viewBox="0 0 13 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-8.6849e-08 11.5L6.31371 0.186292L12.6274 11.5L6.31371 22.8137L-8.6849e-08 11.5Z"
            fill="#D9D9D9"
          />
        </svg>
        <p>Đăng ký VeFam VIP để mời bạn bè và kiếm phần thưởng.</p>
      </div>
      <div class="description">
        <svg
          width="13"
          height="23"
          viewBox="0 0 13 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-8.6849e-08 11.5L6.31371 0.186292L12.6274 11.5L6.31371 22.8137L-8.6849e-08 11.5Z"
            fill="#D9D9D9"
          />
        </svg>
        <p>Kết nối với C-account để tham gia các trò chơi</p>
      </div>
      <el-link style="color: #45bbff"
        >Resigter VIP VeFam to invite your friend and collect gift</el-link
      >
    </div>
  </div>
</template>
<style scoped lang="scss">
.login-container .container2 .el-card .car-main .card-vip .address {
  background: unset !important;
  backdrop-filter: unset !important;
}
@media only screen and (max-width: 480px) {
  .login-container .container2 .el-card .car-main .card-vip .address {
    .address-description {
      .text_about {
        & p,
        & span {
          font-size: 11px;
        }
      }
    }
  }
}
</style>
