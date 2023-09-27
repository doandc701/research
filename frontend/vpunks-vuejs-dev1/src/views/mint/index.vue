<template>
  <div class="mint-container">
    <h3>Minting Now</h3>
    <div v-loading.fullscreen.lock="fullscreenLoading" :v-model="openFullScreen1" class="mint-container-list">
      <div class="items-container">
        <el-row id="mint-card-row" class="mint-card-row" justify="center">
          <div
            v-for="item in mintingList"
            :key="item.name+item.id"
            class="mint-container-list-item"
          >
            <div class="mint-card-body">
              <!--<router-link :to="'detail/' + item.id">-->
              <div class="mint-image">
                <el-image class="item-card-image" style="width: 100%; height: 225px" :src="'./images/mint/' + item.img" alt="" fit="cover" @click.prevent="viewItemDetails(item.id)">
                  <div slot="placeholder" class="image-slot">
                    <i class="el-icon-loading" />
                  </div>
                </el-image>
              </div>
              <!--</router-link>-->
              <div class="item-card-details" style="position: relative;">
                <div class="image-description">
                  <div class="image-description-text">
                    <h4>{{ item.name }}</h4>
                    <p>Lv.{{ item.level }}</p>
                  </div>
                  <div class="image-description-scores">
                    <div class="image-description-scores-box">
                      <span>-/-</span>
                    </div>
                  </div>
                </div>
                <!-- <div class="btn-minting-now">
                  <router-link :to="'detail/' + item.id">
                    <el-button
                      class="show-minting-now"
                    >Minting Now</el-button>
                  </router-link>
                </div> -->
                <div class="btn-detail">
                  <el-button class="coming-soon-btn">Coming soon</el-button>
                </div>
              </div>
            </div>
            <ERC1155Details />
          </div>
        </el-row>
      </div>
    </div>
    <div class="footer-banner">
      <el-image class="banner" :src="bannerWp" alt="" fit="cover">
        <div slot="placeholder" class="image-slot">
          <i class="el-icon-loading" />
        </div>
      </el-image>
    </div>
  </div>
</template>

<script>
import { mintingList } from '@/data/mintingList.js'
import ERC1155Details from '@/components/ERC1155Details'

const bannerWp = require('@/assets/collections/weapons/header-img-wp1.png')

export default {
  name: 'Mint',
  components: {
    ERC1155Details
  },
  data() {
    return {
      mintingList: mintingList,
      fullscreenLoading: false,
      bannerWp
    }
  },
  methods: {
    openFullScreen1() {
      this.fullscreenLoading = true
      setTimeout(() => {
        this.fullscreenLoading = false
      }, 2000)
    },
    viewItemDetails(id) {
      if (window.showNFTDetails) window.showNFTDetails(id)
    }
  }
}
</script>

<style lang="scss">
.mint-container {
  padding: 30px 20px 150px 20px;
  .mint-container-list {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin-right: -20px;
    .mint-container-list-item {
      overflow: hidden;
      margin-bottom: 32px;
      margin-right: 20px;
      box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.25);
      border-radius: 16px;
      background-color: #202440;
      }
      .image-description {
        display: flex;
        justify-content:center;
        align-items: center;
        padding: 0 10px;
        .image-description-text {
          flex-grow: 1;
        }
        .image-description-scores {
          flex-grow: 1;
          background: #558C3F;
          border-radius: 16px;
          line-height: 30px;
          text-align: center;
        }
      }
      // use hover same as openSea
      // .btn-minting-now {
      //     position: absolute;
      //     bottom: -112px;
      //     width: 100%;
      //     visibility: hidden;
      //     transition: bottom 0.5s ease 0s, visibility 0s ease 0.25s;
      //   }
        // .show-minting-now {
        //   width: 100%;
        //   height: 56px;
        //   text-align: center;
        //   border: none;
        //   border-top: 1px solid #525C9A;
        //   background-color: #2e4073;
        //   padding: 0;
        //   border-radius: 0;
        //   color: #fff;
        //   z-index: 2;
        //   &:hover {
        //     background-color: #3d5085;
        //   }
        // }
      .show-minting-now {
        width: 100%;
        height: 56px;
        text-align: center;
        border: none;
        position: relative;
        border-top: 1px solid #525C9A;
        background-color: #202440;
        padding: 0;
        border-radius: 0;
        color: #fff;
        overflow:hidden;
        z-index: 1;
        &:hover {
          font-size: 17px;
          font-weight: bold;
        }
        &:before {
          content: "";
          position: absolute;
          transition: top 0.09s ease-in;
          background: #64d17d;
          bottom: 0;
          left: 0;
          right: 0;
          top: 100%;
          z-index: -1;
        }
        &:hover:before {
          top: 0;
        }
      }
      .coming-soon-btn {
        width: 100%;
        height: 56px;
        text-align: center;
        border: none;
        border-top: 1px solid #525C9A;
        background-color: #202440;
        padding: 0;
        border-radius: 0;
        color: #fff;
        // z-index: 1;
      }
    }
    .items-container {
      display: flex;
      justify-content: space-around;
      .mint-container-list {
        margin-right: -20px;
      }
      .mint-card-row {
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
      .mint-card-col {
        // max-width: 300px;
        // min-width: 191px;
      .mint-card-body {
        height: 375px;
        position: relative;
        border-radius: 12px;
        margin-bottom: 30px;
        background-color: #202440;
        overflow: hidden;
        -webkit-transition: 0.3s;
        transition: 0.3s;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 4px 4px 15px rgb(0 0 0 / 25%);
        .item-card-details {
          position: relative;
          padding: 10px;
          line-height: 1.5;
          .item-card-name {
            font-weight: bold;
          }
        }
      }
    }
    .mint-image {
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
  }
  // use hover same as openSea
  // .mint-container-list-item:hover .item-card-image {
  //   transform: scale(1.2);
  //   transition: transform .5s ease;
  // }
  // .mint-container-list-item:hover .btn-minting-now {
  //   bottom: -56px;
  //   visibility: visible;
  //   transition: bottom 0.5s ease 0s;
  // }
  .footer-banner {
    text-align: center;
    margin-top: 50px;
  }
}

@media only screen and (min-width: 1201px)
{
  .mint-container {
    &-list {
      &-item {
        width: 270px
      }
    }
  }
}
@media only screen and (min-width: 768px) and (max-width: 1200px)
 {
  .mint-container {
    &-list {
      &-item {
          width: calc(25% - 20px);
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .mint-container {
     &-list {
      &-item {
        width: calc(33.3333333333% - 20px);
        }
      }
    }
}
@media screen  and (min-width: 465px) and (max-width: 600px) {
  .mint-container {
     &-list {
      &-item {
        width: calc(50% - 20px);
      }
    }
    }
}
@media screen and (max-width: 464px) {
  .mint-container {
     &-list {
      &-item {
        width: 270px;
      }
    }
  }
}
</style>

