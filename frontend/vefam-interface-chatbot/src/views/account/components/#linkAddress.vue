<script setup lang="ts">
import Motion from "../utils/motion";

// import { useUserStoreHook } from "/@/store/modules/user";

defineOptions({
  name: "LoginV"
});
/*
const onLogin = () => {
  useUserStoreHook().SET_CURRENTPAGE(4);
};*/
</script>
<template>
  <el-form>
    <div class="input-group">
      <Motion :delay="100">
        <div class="item">
          <h3 class="lb_text">Username:</h3>
          <div class="box">
            <p class="box_text">Muhamad Ramdani</p>
          </div>
          <h3 class="lb_text">Link with account:</h3>
          <div class="box">
            <p class="box_text">0x7F7a...9b7E</p>
          </div>
        </div>
      </Motion>
    </div>
    <p class="text_wd">Link with D-Account to play PvP online games</p>
  </el-form>
</template>
<style scoped lang="scss">
.container1 {
  .item {
    color: #ffff;

    .lb_text {
      color: rgba(255, 255, 255, 0.597);
      padding: 10px 0px;
    }

    .box {
      background: rgba(3, 3, 3, 0.25);
      border-radius: 25px;

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
