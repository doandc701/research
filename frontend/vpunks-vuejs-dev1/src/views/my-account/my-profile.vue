<template>
  <div class="my-profile-container">
    <div class="my-profile-header">
      <div class="top-banner top-banner1" />
      <div class="top-banner top-banner2" />
      <div class="header-content">
        <div class="avt">
          <el-avatar style="box-shadow: 4px 4px 15px rgb(0 0 0 / 40%);" :size="150" src="/img/avatar/default.png" />
        </div>
      </div>
    </div>
    <div class="icon-setup-gr">
      <i class="el-icon-share" />
      <i class="el-icon-setting" />
    </div>
    <div class="name-profile">
      <h1>Welcome!</h1>
      <el-dropdown v-show="address!==null" placement="bottom" style="font-size: 16px">
        <span class="el-dropdown-link">
          <el-button slot="reference" class="btn-address-vpo">{{ addressV }}</el-button>
        </span>
        <AccountAddress :account-address="address" title="Your Wallet" />
      </el-dropdown>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane name="first">
        <span slot="label"><i style="margin-right: 3px;" class="el-icon-menu" /> Collected</span>
        <div>
          <Collected />
        </div>
      </el-tab-pane>
      <!--<el-tab-pane name="second">
        <span slot="label"><svg-icon icon-class="hand" /> Favorited</span>
        Nothing yet
      </el-tab-pane>-->
      <el-tab-pane name="third">
        <span slot="label"><svg-icon icon-class="activity" /> Activity</span>
        <Activity />
      </el-tab-pane>
      <el-tab-pane name="fourth">
        <span slot="label"><svg-icon icon-class="hand" /> Offer</span>
        <Offer />
      </el-tab-pane>
      <el-tab-pane name="fifth">
        <span slot="label"><svg-icon icon-class="tag" /> Listings</span>
        <Listings />
      </el-tab-pane>
      <el-tab-pane name="sixth">
        <span slot="label"><svg-icon icon-class="staking" /> Staking</span>
        <Staking />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Activity from './components/activity.vue'
import Offer from './components/offer.vue'
import Listings from './components/listings.vue'
import Staking from './components/staking.vue'
import Collected from './components/collected.vue'
import AccountAddress from '@/components/AccountAddress'

export default {
  name: 'MyProfile',
  components: {
    Activity,
    Offer,
    Listings,
    Staking,
    Collected,
    AccountAddress
  },
  data() {
    return {
      // general
      debug: false,
      address: null,
      addressV: '',

      //
      activeName: 'first'
    }
  },
  created() {
    this.address = window.selectedAccount
    if (this.address) this.addressV = `${this.address.slice(0, 5)}.....${this.address.slice(this.address.length - 3)}`
  },
  methods: {
  }
}
</script>

<style lang="scss">
.my-profile-container {
  color: #fff;
  padding-bottom: 150px;
    .my-profile-header {
    position: relative;
    display: flex;
    .top-banner {
      width: 100%;
      height: 100%;
      position: absolute;
      background-size: contain;
    }
    .top-banner1 {
      // background-color: #c8c8c8;
      background-color: #709dd1;
      opacity: 0.3;
    }
    .top-banner2 {
      background-image: url("~@/assets/header-bg2.png");
      background-position-x: center;
      opacity: 0.8;
    }
    .header-content {
      width: 100%;
      height: 100%;
      position: relative;
      text-align: center;
    }
  }
  .icon-setup-gr {
    display: none;
    position: absolute;
    right: 10px;
    font-size: 20px;
    padding: 15px 0px 0px 0px;
    .el-icon-share {
      margin-right: 5px;
    }
    .el-icon-share, .el-icon-setting {
      border: 1px solid #828ccb;
      padding: 3px;
      border-radius: 6px;
    }
  }
  .avt {
    position: relative;
    top: 50px;
    margin-bottom: 10px;
  }
  .name-profile {
    display: flex;
    justify-content: center;
    padding-top: 35px;
    flex-direction: column;
    align-items: center;
    align-content: center;
    .btn-address-vpo {
      background: #3C4C76;
      color: #ffff;
      border-radius: 46px;
      border: none;
      box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.25);
      font-size: 15px;
      cursor: pointer;
    }
    .el-button:hover {
      background-color: #414f76;;
    }
  }
  .el-tabs {
    margin-top: 10px;
    .el-tabs__nav {
      // white-space: pre-wrap;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      span {
        display: flex;
        align-items: center;
      }
      .el-tabs__nav.is-active {
        border-bottom: 1px solid #ffff;
      }
    }
    .el-tabs__content {
      position: relative;
      padding: 30px 30px 10px 30px;
      padding-left: min(max(10px, 4vw), 30px);
      padding-right: min(max(10px, 4vw), 30px);
    }
    .el-tabs__nav-scroll {
      display: -webkit-box;
      -webkit-box-pack: center;
      svg {
        width: 16px;
        height: 16px;
        margin-right: 3px;
      }
    }
    .el-tabs__item.is-active {
      color: #6CE23E;
      // border-bottom: 1px solid #6CE23E;
    }
    .el-tabs__active-bar {
      background-color: #6ce23e00
    }
    .el-tabs__item:hover {
      color: #a0d38c;
    }
    .el-tabs__nav-wrap::after {
      background-color: #525C9A;
    }
  }
  @media screen and (max-width: 470px) {
    .el-tabs {
      .el-tabs__item {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding: 0 8px;
      }
    }
  }
}
</style>
