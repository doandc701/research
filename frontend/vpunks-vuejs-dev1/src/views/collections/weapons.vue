<template>
  <div class="weapons-container">
    <div class="weapons-header">
      <div class="top-banner top-banner1">
        <el-image class="banner" :src="bannerWp" alt="" fit="cover">
          <div slot="placeholder" class="image-slot">
            <i class="el-icon-loading" />
          </div>
        </el-image>
      </div>
    </div>
    <div class="header-content">
      <div class="avatar-cont">
        <el-avatar class="avatar-circle" style="box-shadow: rgb(0 0 0 / 50%) 4px 4px 15px;" :size="150">
          <div class="avt-loop">
            <el-carousel :interval="1500" height="200px" indicator-position="none" arrow="never">
              <el-carousel-item v-for="item in weaponsCollection" :key="item.name+item.id">
                <el-image class="item-card-image" :src="'./images/mint/' + item.img" alt="" fit="cover">
                  <div slot="placeholder" class="image-slot">
                    <i class="el-icon-loading" />
                  </div>
                </el-image>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-avatar>
      </div>
    </div>
    <div class="icon-setup-gr">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-button slot="reference" class="btn-share"><i class="el-icon-share" /></el-button>
        </span>
        <div class="dropdown-item">
          <el-dropdown-menu slot="dropdown" style="background-color: #202440; border-color: #4A5495; border-radius: 10px;">
            <el-dropdown-item style="color: #ffff"><div @click="copyUrl($event)"><i class="el-icon-link" />Get link</div></el-dropdown-item>
            <el-dropdown-item style="color: #ffff"><a rel="noopener" target="_blank" :href="twitterUrl"><i class="el-icon-circle-plus" />Share on Twitter</a></el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </el-dropdown>
    </div>
    <div class="name-gallery">
      <h3>VPunks Weapons</h3>
      <el-button v-if="address===null" slot="reference" class="btn-address-vpo">...</el-button>
      <el-dropdown v-show="address!==null" placement="bottom">
        <span class="el-dropdown-link">
          <el-button slot="reference" class="btn-address-vpo">{{ tokenAddressView }}</el-button>
        </span>
        <AccountAddress :account-address="tokenAddress" title="Collections" />
      </el-dropdown>
    </div>
    <div class="card-statistics">
      <el-card class="statistics">
        <el-row>
          <el-row class="list-statistics">
            <div class="list-statistics-items">
              <el-col class="statistics-item">
                <el-row class="statistics-item-number">15</el-row>
                <el-row class="statistics-item-text">Items</el-row>
              </el-col>
            </div>
            <div class="list-statistics-items">
              <el-col class="statistics-item">
                <el-row class="statistics-item-number">--k</el-row>
                <el-row class="statistics-item-text">Owners</el-row>
              </el-col>
            </div>
            <div class="list-statistics-items">
              <el-col class="statistics-item">
                <el-row class="statistics-item-number">--<img class="vet-icon1" src="@/assets/tokens-symbol/vet.svg"></el-row>
                <el-row class="statistics-item-text">Floor price</el-row>
              </el-col>
            </div>
            <div class="list-statistics-items">
              <el-col class="statistics-item">
                <el-row class="statistics-item-number">--<img class="vet-icon2" src="@/assets/tokens-symbol/vet.svg"></el-row>
                <el-row class="statistics-item-text">Volume</el-row>
              </el-col>
            </div>
          </el-row>
        </el-row>
      </el-card>
    </div>
    <div class="tab-mode">
      <el-tabs v-model="activeName">
        <el-tab-pane name="items">
          <span slot="label"><i style="margin-right: 2px;" class="el-icon-menu" /> Items</span>
          <div class="weapons-container-list">
            <div class="items-container">
              <el-row class="weapons-card-row" justify="center">
                <div
                  v-for="item in weaponsCollection"
                  :key="item.name+item.id"
                  class="weapons-container-list-item"
                >
                  <div class="weapons-card-body">
                    <div class="image">
                      <el-image class="item-card-image" :src="'./images/mint/' + item.img" alt="" fit="cover" lazy @click.prevent="viewItemDetails(item.id)">
                        <div slot="placeholder" class="image-slot">
                          <i class="el-icon-loading" />
                        </div>
                      </el-image>
                    </div>
                    <div class="item-card-details">
                      <el-row :gutter="20">
                        <el-col :span="14"><div class="card-panel-text" @click.prevent="viewItemDetails(item.id)">{{ item.name }}</div></el-col>
                        <el-col :span="6"><div class="price-text">Best price</div></el-col>
                      </el-row>
                      <el-row :gutter="20">
                        <el-col :span="14"><div class="tokenId-line">#{{ item.id }}</div></el-col>
                        <el-col :span="6">
                          <div class="card-panel-price">
                            <div>-</div>
                            <img src="@/assets/tokens-symbol/vet.svg">
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="card-panel-tags">
                      <el-tag effect="plain" class="tagName">VIP-210</el-tag>
                      <el-tag effect="plain" class="tagName" style="position: relative; left: 5px;">Level: {{ item.level }}</el-tag>
                    </div>
                  </div>
                </div>
              </el-row>
            </div>
            <ERC1155Details />
          </div>
        </el-tab-pane>
        <el-tab-pane name="about">
          <span slot="label"><i style="margin-right: 2px;" class="el-icon-info" /> About</span>
          <p style="padding-right: 15px; padding-left: 15px; color: #00D4FF;">A collection weapon of Vpunk Arena Fighter. This collection for fight in game, let's collect and Play!!!</p>
        </el-tab-pane>
        <el-tab-pane name="activity">
          <span slot="label"><svg-icon icon-class="activity" /> Activity</span>
          <p style="padding-right: 15px; padding-left: 15px; color: #0df11f;">This feature is coming soon.</p>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- <p class="introduce">A collection weapon of Vpunk Arena Fighter. This collection for fight in game, let's collect and Play!!!</p> -->
  </div>
</template>

<script>
import { weapons } from '@/data/weapons.js'
import ERC1155Details from '@/components/ERC1155Details'
import AccountAddress from '@/components/AccountAddress'
import clip from '@/utils/clipboard' // use clipboard directly

const bannerWp = require('@/assets/collections/weapons/header-img-wp1.png')

export default {
  name: 'CollectionsWeapons',
  components: {
    ERC1155Details,
    AccountAddress
  },
  data() {
    return {
      weaponsCollection: weapons,
      linkUrl: null,
      twitterUrl: '',
      address: null,
      tokenAddress: '',
      tokenAddressView: null,
      // tab
      activeName: 'items',
      bannerWp
    }
  },
  created() {
    this.linkUrl = window.location.href
    //
    let myUrl = window.location.href.split('?')[0]
    // myUrl = 'http://vpunks.com/#/collections/weapons'
    myUrl = myUrl.replace('#', '%23')

    // console.log('myUrl', myUrl)
    const caption = 'Check out this collection on Vpunks Weapons'
    //
    const linkTwitter = `?text=${caption}&url=${myUrl}&via=vpunksofficial&original_referer=${myUrl}`
    // const encodeLink = encodeURIComponent(linkTwitter)
    this.twitterUrl = `https://twitter.com/intent/tweet${linkTwitter}`
  },
  methods: {
    viewItemDetails(id) {
      if (window.showNFTDetails) window.showNFTDetails(id)
    },
    copyUrl(event) {
      clip(this.linkUrl, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.weapons-container {
  .introduce {
    color: #00ff27;
    text-align: center;
    font-size: 18px;
    padding: 0 0 20px 0;
    border-bottom: 1px solid #50599f;
  }
}
</style>

<style lang="scss" scoped>
// header
.weapons-header {
  position: relative;
  display: flex;
  height: 320px;
  .top-banner {
    width: 100%;
    height: 320px;
    position: absolute;
    background-size: contain;
  }
  .top-banner1 {
    background-image: url("~@/assets/collections/weapons/header-img-wp.jpg");
    display: flex;
    align-items: center;
    justify-content: center;
    .banner {
      position: relative;
      width: 90%;
      max-width: 770px;
    }
  }
}
.header-content {
  height: 0;
}
.avatar-cont {
  position: relative;
  bottom: 35px;
  text-align: center;
  .avt-loop {
    .el-carousel {
      background: #638596;
    }
  }
}
.icon-setup-gr {
  position: absolute;
  right: 10px;
  font-size: 20px;
  padding: 15px 0px 0px 0px;
  .btn-share {
    background-color: transparent;
    color: #ffff;
    width: 42px;
    border-color: #525C9A;
    .el-icon-share {
      display: flex;
      justify-content: center;
    }
  }
  .el-button:hover, .el-button:focus {
    border-color: #747fc5;
  }
}
::v-deep .el-dropdown .el-dropdown-menu .el-dropdown-menu__item:not(.is-disabled):hover, .el-dropdown-menu__item:hover {
  background-color: rgb(46, 54, 112) !important;
}
.tab-mode {
  margin-top: 5px;
  ::v-deep .el-tabs__nav {
    // white-space: pre-wrap;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  ::v-deep .el-tabs__nav {
    span {
      display: flex;
      align-items: center;
    }
  }
  ::v-deep .el-tabs__nav-scroll {
    display: -webkit-box;
    -webkit-box-pack: center;
    svg {
      width: 16px;
      height: 16px;
      margin-right: 2px;
    }
  }
  ::v-deep .el-tabs__nav-scroll .el-tabs__item.is-active {
    color: #ffffff;
  }
  ::v-deep .el-tabs__nav-scroll .el-tabs__active-bar {
    background-color: #45BBFF;
    height: 2px;
  }
  ::v-deep .el-tabs__nav-scroll .el-tabs__item:hover {
    color: #45BBFF;
  }
  ::v-deep .el-tabs__header .el-tabs__nav-wrap::after {
    background-color: #2e3670;
  }
}
.name-gallery {
  display: flex;
  justify-content: center;
  margin-top: 120px;
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
.card-statistics {
  display: flex;
  justify-content: center;
  padding-right: 7px;
  padding-left: 7px;
  ::v-deep .el-card__body {
    padding: 0px;
  }
  .statistics {
    background-color: #c4c8d000;
    color: #fff;
    border: 2px solid #2e3670;
    border-radius: 12px;
    margin-bottom: 15px;
    margin-top: 25px;
    .list-statistics {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .list-statistics-items {
        padding: 8px;
      }
    }
    .statistics-item {
      text-align: center;
      // font-size: 13px;
      width: 100%;
      height: 100%;
      border-radius: 12px;
      padding-right: 15px;
      padding-left: 15px;
      .statistics-item-number {
        color: #53A7FF;
        font-weight: bold;
      }
      .statistics-item-text {
        font-size: 14px;
        color: #dbdbdb;
      }
      .vet-icon1 {
        width: 14px;
        height: 14px;
        position: absolute;
        top: 2px;
        left: 5px;
      }
      .vet-icon2 {
        width: 14px;
        height: 14px;
        position: absolute;
        top: 2px;
        left: -5px;
      }
    }
  }
}
.weapons-container {
  padding-bottom: 150px;
  .weapons-container-list {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-right: -20px;
    .weapons-container-list-item {
      overflow: hidden;
      margin-bottom: 32px;
      margin-right: 20px;
      box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.25);
      border-radius: 16px;
      background-color: #202440;
      }
    }
    .items-container {
      display: flex;
      justify-content: space-around;
      .weapons-container-list {
        margin-right: -20px;
      }
      .weapons-card-row {
        margin-top: 18px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
      }
      .weapons-card-body {
        border-radius: 12px;
        background-color: #202440;
        overflow: hidden;
        -webkit-transition: 0.3s;
        transition: 0.3s;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 4px 4px 15px rgb(0 0 0 / 25%);
        .image {
          overflow: hidden;
          height: 225px;
        }
        .item-card-image {
          width: 100%;
          height: 225px;
          cursor: pointer;
          transition: transform .5s ease;
          &:hover {
            transform: scale(1.2);
            transition: transform .5s ease;
          }
        }
        .item-card-details {
          font-weight: bold;
          padding: 10px;
          .card-panel-text {
          color: #fff;
          font-size: 16px;
          margin-bottom: 5px;
          width: 140px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          cursor: pointer;
          &:hover {
            color: #00D4FF;
          }
          }
          .price-text {
            color: #CCCCCC;
            position: absolute;
            right:10px;
          }
          .tokenId-line {
            font-size: 14px;
            color: #ebebeb;
            width: 90px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .card-panel-price {
            div {
              color:#53A7FF;
              font-weight: 500;
              position: absolute;
              width: 100px;
              right: 25px;
              text-align: right;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            img {
              width: 14px;
              height: 14px;
              position: absolute;
              top: 0px;
              right: 10px;
            }
          }
          hr {
            border: none;
            height: 1px;
            background: #2e3670;
          }
        }
        .card-panel-tags {
          border-top: 1px solid #525C9A;
          padding: 10px 5px;
          .tagName {
            background-color: #202440 ;
            border: 1px solid #606BBF;
            border-radius: 16px;
            color: #fff;
          }
        }
        &.hover-effect {
          cursor: pointer;
          transition: background .3s;
        }
        // &:hover {
        //   background-color: #151938 ;
        // }
      }
    }
  }

@media only screen and (min-width: 1201px)
{
  .weapons-container {
    &-list {
      &-item {
        width: 270px
      }
    }
  }
}
@media only screen and (min-width: 768px) and (max-width: 1200px)
 {
  .weapons-container {
    &-list {
      &-item {
        width: 270px
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .weapons-container {
     &-list {
      &-item {
        width: 270px
        }
      }
    }
}
@media screen  and (min-width: 465px) and (max-width: 600px) {
  .weapons-container {
     &-list {
      &-item {
        width: 270px
      }
    }
    }
}
@media screen and (max-width: 464px) {
  .weapons-container {
     &-list {
      &-item {
        width: 270px
      }
    }
  }
}
// for banner
@media screen and (max-width: 530px) {
  .weapons-container {
    .header-content {
      .avatar-cont {
        .avatar-circle {
          height: 125px !important;
          width: 125px !important;
          line-height: 125px !important;
        }
      }
    }
    .weapons-header {
      height: 200px;
      .top-banner1 {
        height: 200px;
      }
    }
    .name-gallery {
      margin-top: 95px;
    }
  }
}
</style>
