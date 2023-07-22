<script setup lang="ts">
import daccount from "/@/assets/img/daccount.png";
import cardVip from "/@/assets/img/cardVip.png";
import crown from "/@/assets/crown.png";
import Motion from "../utils/motion";

defineOptions({
  name: "LoginV"
});
</script>
<template>
  <div class="car-main">
    <div class="form-text">
      <el-image :src="daccount" fit="cover" lazy />
    </div>
    <div class="add-link">
      <p>
        Address: <el-link style="color: #45bbff">{{ myAddr }}</el-link>
      </p>
      <p>
        Link with C account:
        <span style="color: #45bbff">Muhamad Ramdani</span>
      </p>
    </div>
    <Motion>
      <div class="card-vip">
        <el-image class="img" :src="cardVip" fit="cover" lazy />
        <div class="address">
          <div class="address-description">
            <div class="text_about">
              <p>Name: <span style="color: #45bbff">Satoshi </span></p>
              <p>
                My rewards:
                <span><el-button size="mini">View</el-button> </span>
              </p>
            </div>
          </div>
        </div>
        <!-- btn connect -->
        <div class="btn">
          <div class="crown" style="margin-bottom: 10px">
            <div class="crown_item">
              <div class="item_image">
                <el-image :src="crown" />
              </div>
              <p class="item_text_lb">Number of level 1 invitations</p>
              <p class="item_text">0</p>
            </div>
          </div>
          <div class="crown">
            <div class="crown_item">
              <div class="item_image">
                <el-image :src="crown" />
              </div>
              <p class="item_text_lb">Number of level 1 invitations</p>
              <p class="item_text">0</p>
            </div>
          </div>
        </div>
      </div>
    </Motion>
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
.login-container .container2 .el-card .car-main .card-vip {
  .address {
    background: unset;
    backdrop-filter: unset;

    .address-description {
      .text_about {
        & button.el-button.el-button--mini {
          background: linear-gradient(
            94.9deg,
            #00f6ff 0%,
            #5d7eff 48.44%,
            #5429a0 100%
          );
          border-radius: 8px;
          border: none;
          color: #fff600;
          transition: all 0.3s ease-out;
          opacity: 0.8;

          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }

  .btn {
    bottom: 60px !important;

    .crown {
      background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
      padding: 1px;
      border-radius: 12px;

      .crown_item {
        width: 100%;
        height: 100%;
        background: #171b33;
        padding: 5px 5px 2px 5px;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;

        .item_text_lb {
          flex-grow: 1;
          padding: 0px 10px;
        }
      }
    }
  }
}
@media only screen and (min-width: 526px) and (max-width: 568px) {
  .login-container .container2 .el-card .car-main .card-vip .btn {
    height: auto;
  }
}
@media only screen and (max-width: 526px) {
  .login-container .container2 .el-card .car-main .card-vip .btn {
    width: auto;
    height: auto;
    bottom: 40px !important;
  }
}
@media only screen and (max-width: 480px) {
  .login-container .container2 .el-card .car-main .card-vip .address {
    width: 250px !important;
    top: 40px !important;
  }
}
@media only screen and (max-width: 420px) {
  .login-container .container2 .el-card .car-main .card-vip {
    .address {
      .address-description {
        .text_about {
          & p,
          & span {
            font-size: 11px;
          }

          & button.el-button.el-button--mini {
            height: 20px;
          }
        }
      }
    }

    .btn {
      bottom: 2px !important;
      width: 230px !important;
      margin-bottom: 5px;

      .crown {
        .crown_item {
          & p {
            font-size: 12px;
          }

          .item_image {
            width: 15px;
          }

          .item_text_lb {
            flex-grow: 1;
            padding: 0px 10px;
          }
        }
      }
    }
  }
}
</style>
