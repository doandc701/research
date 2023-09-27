<template>
  <div class="home-container">
    <div class="top-header">
      <div class="top-banner top-banner1" />
      <div class="top-banner top-banner2" />
      <div class="header-content">
        <img src="@/assets/logo02.png" loading="lazy">
        <div class="top-intro">
          <!-- <p class="title-vpunks">VPUNKS</p> -->
          <p class="top-title">
            #1 NFT project Developed on the VeChainThor blockchain
          </p>
        </div>
      </div>
    </div>

    <!-- app-container1 -->
    <div class="app-container1">
      <div class="intro-row-body">
        <div class="intro-row-content">
          <div class="intro-content2">
            <p class="intro-row-title">
              Welcome to <span style="color: #6CE23E">VPunks</span>
            </p>
            <p>
              The revolutionary NFT Project that’s integrating gaming and
              tokenization into an 8-Bit ecosystem.
            </p>
            <p>
              10,000 VPunks were minted in an increasing VET price system in only 8
              days! While minting is completely sold out, any VPunks for sale are
              now listed in the Marketplace.
            </p>
          </div>
          <router-link to="/auctions/index">
            <el-button class="btn-share" type="success"><svg-icon icon-class="shop" style="vertical-align: bottom" /> Visit the Marketplace</el-button>
          </router-link>
        </div>
        <!-- img vpunks-welcome  -->
        <div class="intro-row-img">
          <div class="intro-img">
            <img src="@/assets/vpunks-welcome.png">
          </div>
        </div>
      </div>
    </div>
    <!-- end: app-container1 -->

    <!-- app-container2 -->
    <div class="app-container2">
      <div class="intro-row-body">
        <div class="intro-row-img">
          <el-carousel indicator-position="none">
            <el-carousel-item>
              <img src="images/mint/axe.png" alt="Minting NFT" title="Minting NFT">
            </el-carousel-item>
            <el-carousel-item>
              <img src="images/mint/cub.png" alt="Minting NFT" title="Minting NFT">
            </el-carousel-item>
            <el-carousel-item>
              <img src="images/mint/nunchaku.png" alt="Minting NFT" title="Minting NFT">
            </el-carousel-item>
            <el-carousel-item>
              <img src="images/mint/spear.png" alt="Minting NFT" title="Minting NFT">
            </el-carousel-item>
            <el-carousel-item>
              <img src="images/mint/sword.png" alt="Minting NFT" title="Minting NFT">
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="intro-row-content">
          <p class="intro-row-title">
            Go to <span style="color: #6CE23E">Minting</span> now
          </p>
          <p style="line-height: 150%;">
            The Vpunks Weapons 3D collections
          </p>
          <p style="line-height: 150%;">
            Let’s collect to fight in PvP game and P2E games in the near future.
          </p>
          <el-button class="btn-share btn-minting1" type="success">
            <svg-icon icon-class="box" style="vertical-align: middle" />
            Coming soon<!-- Minting Now | 🛠 Mint VPunks -->
          </el-button>
        </div>
      </div>
      <el-button class="btn-share btn-minting2" type="success">
        <svg-icon icon-class="layers" style="vertical-align: middle" />
        Coming soon<!-- Minting Now | 🛠 Mint VPunks -->
      </el-button>
    </div>
    <!-- end: app-container2 -->

    <!-- app-container3 -->
    <div class="app-container3">
      <div class="intro-row-body-flex">
        <div class="intro-row-body-img">
          <img src="@/assets/roadmap-vpunks.png">
        </div>
        <p class="intro-row-title">
          The <span style="color: #6CE23E">VPunks</span> Roadmap
        </p>
      </div>
      <p class="intro-row-content">
        VPunks is not just a static NFT project that was ever intented to just
        stop at 10,000 mints. VPunks mission is to be the greatest NFT
        ecosystem ever built with multiple integrations and utility that is
        ready to take over the NFT world. View the full roadmap below:
      </p>
      <img alt="Roadmap" title="Roadmap" src="images/roamap2.png" class="img-roadmap" loading="lazy">
    </div>
    <!-- end: app-container3 -->

    <!-- app-container4 -->
    <div class="app-container4">
      <div style="padding: 10px; line-height: 1.5;">
        <p class="intro-row-title">
          The <span style="color: #6CE23E">Tokenomics</span>
        </p>
        <p>
          Introducing VPU - The ecosystem utility and governance token of VPunks
          NFT & VPunks marketplace.
        </p>
        <p>
          VPU use cases:<br>
          - Staking<br>
          - Liquidity Mining<br>
          - Payment<br>
          - Games
        </p>
        <router-link to="/resources/tokenomics">
          <el-button class="btn-share" type="success">The Tokenomics</el-button>
        </router-link>
      </div>
      <div class="intro-row-body">
        <div class="intro-row-img">
          <div style="position:relative">
            <img src="images/genesis_VPU_allocation.png" alt="VPU Allocation" title="VPU Allocation" style="width: 100%; object-fit: cover;" loading="lazy">
            <p class="max-width-text">Genesis VPU Allocation</p>
          </div>
        </div>
        <div class="intro-row-content">
          <ul>
            <li v-for="(box,index) in listNote" :key="index" class="note-box-container">
              <div :class="box.boxColor" />
              <p class="note-text">{{ box.text }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- end: app-container4 -->

    <!-- app-container5 -->
    <div class="app-container5">
      <p class="text-center">Need a more in depth Step-by-Step tutorial on how to purchase VPunks?</p>
      <center style="margin-top:50px">
        <a href="https://threadreaderapp.com/thread/1424894859106652160.html" target="_blank" rel="noopener">
          <el-button class="btn-share" type="success">How to buy a VPunk <svg-icon icon-class="link" style="font-size: 14px;" /></el-button>
        </a>
      </center>
    </div>
    <!-- end: app-container5 -->
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      listNote: [
        { boxColor: 'note-box-orange', text: 'Liquidity mining rewards' },
        { boxColor: 'note-box-darkGray', text: 'Staking rewards' },
        { boxColor: 'note-box-yellow', text: 'Game, challange, bonus' },
        { boxColor: 'note-box-pictonBlue', text: 'VPunks minting airdrop' },
        { boxColor: 'note-box-apple', text: 'Initial liquidity pool' },
        { boxColor: 'note-box-resolutionBlue', text: 'Product development team' },
        { boxColor: 'note-box-blue', text: 'Community management team' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  color: #fff;
  padding-bottom: 150px;
  .intro-row-title {
    margin: 1vw 0 1.5vw 0;
    font-family: PressStart2P;
    font-size: 22px;
    font-size: min(max(16px, 4vw), 32px);
    line-height: 1.8;
  }
  .btn-share {
    border-radius: 16px;
    font-size: 20px;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.20));
  }
}
.top-header {
  position: relative;
  display: flex;
  .top-banner {
    width: 100%;
    height: 100%;
    position: absolute;
    background-size: contain;
  }
  .top-banner1 {
    background-color: #454d38;
    background-image: url("~@/assets/header-bg.jpg");
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
    img {
      width: 80%;
      max-width: 700px;
      margin-top: 50px;
      vertical-align: middle;
    }
    .top-intro {
      position: relative;
      width: 80%;
      max-width: 1200px;
      margin: 80px auto 80px auto;
      margin-top: min(max(15px, 2vw), 80px);
      margin-bottom: min(max(30px, 4vw), 80px);
      padding: 0 3px;
      background-color: rgba(0, 0, 0, 0.7);
      border-width: min(max(1px, 0.3vw), 3px);
      border-style: solid;
      border-color: #22275a;
      color: #fff;
      font-weight: 500;
      text-align: center;
      letter-spacing: 1px;
      border-radius: 16px;
      .top-title {
        font-size: min(max(16px, 3vw), 24px);
      }
      /*
      .title-vpunks {
        margin: 0;
        padding-top: 30px ;
        text-align: center;
        font-family: "Press Start 2P";
        font-style: normal;
        font-weight: 400;
        font-size: 54px;
        line-height: 54px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6ce23e;
      } */
    }
  }
}

div[class*="app-container"]:nth-child(odd) {
  background-color: #334166;
}

div[class*="app-container"] {
  padding: 30px 20px 40px 20px;
  padding-left: min(max(5px, 3vw), 20px);
  padding-right: min(max(5px, 3vw), 20px);
  font-size: min(max(15px, 1.6vw), 20px);
}
// app-container* -> intro-row-body
.intro-row-body {
  max-width: 1600px;
  margin: auto;
  display: flex;
}
.app-container1 {
  .intro-row-body {
    justify-content: space-between;
    align-items: center;
    .intro-row-img {
      width: 50%;
      min-width: 220px;
      max-width: 320px;
      height: fit-content;
      border: 5px solid #5567F2;
      border-radius: 32px;
      overflow: hidden;
      font-size: 0;
      .intro-img {
        width:100%;
        padding:25px 10px 0px 10px;
        & img {
          width: 100%;
          object-fit: cover;
        }
      }
    }
    .intro-row-content {
      padding: 2vw;
      line-height: 1.5;
      .intro-content2 {
        margin: 0px auto 80px auto;
        margin-bottom: min(max(40px, 4vw), 80px);
        letter-spacing: 1px;
      }
    }
  }
}
.app-container2 {
  text-align: center;
  .intro-row-body {
    padding: 20px;
    justify-content: center;
    align-items: center;
    .intro-row-img {
      width: 20%;
      min-width: 220px;
      max-width: 260px;
      height: fit-content;
      border: 5px solid #5567F2;
      border-radius: 32px;
      overflow: hidden;
      font-size: 0;
      & img {
        width: 100%;
        object-fit: cover;
      }
    }
    .intro-row-content {
      text-align: center;
      letter-spacing: 1px;
      padding-left: 40px;
      .btn-minting1 {
        margin-top: 40px;
      }
    }
    .intro-row-title {
      text-align: center;
      margin-bottom: 45px;
    }
  }
  .btn-minting2 {
    display: none;
  }
}
.app-container3 {
  text-align: center;
    line-height: 1.5;
  .intro-row-body-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    .intro-row-title {
      margin: 2vw 0 0 20px;
      text-align: left;
    }
  }
  .intro-row-body-img {
    width: 80px;
    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .intro-row-content {
    padding-inline: 20px;
  }
  .img-roadmap {
    width: 100%;
    max-width: 1000px;
    margin: 0;
    vertical-align: middle;
  }
}
.app-container4 {
  text-align: center;
  .intro-row-body {
    padding: 40px 0;
    justify-content: center;
    align-items: center;
    .intro-row-img {
      width: 40%;
      max-width: 360px;
      height: fit-content;
      & img {
        width: 100%;
        object-fit: cover;
      }
      .max-width-text {
        font-size: 18px;
        font-size: min(max(18px, 3vw), 30px);
        width: 72%;
        position: absolute;
        top: 43%;
        left: 50%;
        transform: translate(-50%, -46%);
      }
    }
    .intro-row-content {
      text-align: left;
      & ul li {
        list-style: none !important;
      }
      .note-box-container {
        display: flex;
        margin-bottom: 25px;
        div:first-child {
          width: 50px;
          height: 25px;
        }
      }
      // variale
      .note-box-blue {
        background:#4472C4;
      }
      .note-box-orange {
        background:#ED7D31;
      }
      .note-box-darkGray {
        background:#A5A5A5;
      }
      .note-box-yellow {
        background:#FFC000;
      }
      .note-box-pictonBlue {
        background:#5B9BD5;
      }
      .note-box-apple {
        background:#70AD47;
      }
      .note-box-resolutionBlue {
        background:#264478;
      }
      .note-text {
        margin: 0;
        padding-left: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
.app-container5 {
  .text-center {
    text-align: center;
    color: #6ce23e;
    font-family: PressStart2P;
    font-weight: 400;
    line-height: 2;
    font-size: 20px;
  }
}

// begin mobile ---------------------
@media screen and (max-width: 860px) {
  .app-container1 {
    .intro-row-body {
      justify-content: center;
      flex-wrap: wrap-reverse;
      .intro-row-img {
        width: 35%;
        min-width: 160px;
        max-width: 240px;
        margin-bottom: 20px;
        border: 3px solid #5567F2;
      }
      .intro-row-content {
        width: 100%;
      }
    }
  }
  .app-container2 {
    .intro-row-body {
      padding: 0 0 40px 0;
      flex-wrap: wrap-reverse;
      .intro-row-img {
        width: 60%;
        border: 3px solid #5567F2;
      }
      .intro-row-content {
        width: 100%;
        padding-left: 0px;
        .btn-minting1 {
          display: none;
        }
      }
    }
    .btn-minting2 {
      display: inline-block;
    }
  }
}
@media screen and (max-width: 739px) {
  .app-container3 {
    .intro-row-body-flex {
      .intro-row-title {
        margin: 2vw 0 0 5px;
      }
    }
    .intro-row-body-img {
      width: 60px;
    }
    .intro-row-content {
      padding-inline: 0px;
    }
  }
  .app-container4 {
    .intro-row-body {
      padding: 40px 0 0 0;
      flex-wrap: wrap;
      .intro-row-img {
        width: 70%;
        max-width: 300px;
      }
      .intro-row-content {
        width: 100%;
        margin-top: 20px;
      }
    }
  }
  .app-container5 {
    .text-center {
      font-size: 14px;
    }
  }
}
// end: begin mobile ---------------------
</style>
