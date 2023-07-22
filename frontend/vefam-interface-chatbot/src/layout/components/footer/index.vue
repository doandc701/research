<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
// Assets
import VeFam from "/@/assets/technology/VeFam.png";
import VeChain from "/@/assets/technology/VeChain.png";
import Sync2 from "/@/assets/technology/Sync2.png";
import VechainThor from "/@/assets/technology/VechainThor.png";

defineOptions({
  name: "Footer"
});

const input = ref("");
function handleSignUp() {
  ElMessage("coming soon!");
}
function tempLinkCall() {
  ElMessage("coming soon!");
}
</script>

<template>
  <div class="footer-container">
    <div class="list-footer">
      <div class="footer-1">
        <div class="stay-in-the">
          <!-- <h1>Stay in the loop</h1>
          <p>
            Join our mailing list to stay in the loop with our newest feature
            releases, NFT drops, and tips and tricks for navigating VeFam
          </p>
          <div class="signup">
            <div class="input-border">
              <div class="input">
                <el-input placeholder="Your email address" v-model="input" />
              </div>
            </div>
            <div class="button">
              <el-button size="small" @click="handleSignUp">Sign Up</el-button>
            </div>
          </div> -->
          <div class="socialmedia">
            <div class="socialmedia-gr">
              <h1>Join the community</h1>
              <div class="socia-item">
                <div class="discord">
                  <a
                    rel="noopener"
                    target="_blank"
                    href="https://t.co/VMPYtJdNrX"
                  >
                    <div class="icon">
                      <!-- <img src="/src/assets/svg/discord.svg" /> -->
                      <IconifyIconOnline icon="akar-icons:discord-fill" />
                    </div>
                  </a>
                </div>
                <div class="twitter">
                  <a
                    rel="noopener"
                    target="_blank"
                    href="https://twitter.com/vefamofficial"
                  >
                    <div class="icon">
                      <IconifyIconOnline icon="fa:twitter" />
                    </div>
                  </a>
                </div>
                <div class="chrome">
                  <a
                    rel="noopener"
                    target="_blank"
                    href="https://www.youtube.com/channel/UC2Lo-wP2fio8GbHWRM9DO4Q/videos"
                  >
                    <div class="icon">
                      <IconifyIconOnline icon="fa:youtube-play" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div class="technology">
              <div>
                <h1>Technology</h1>
                <div class="technology-gr">
                  <a><el-image class="technology-img" :src="VeFam" /></a>
                  <a
                    rel="noopener"
                    target="_blank"
                    href="https://www.vechain.org/"
                    ><el-image class="technology-img" :src="VeChain"
                  /></a>
                  <a
                    rel="noopener"
                    target="_blank"
                    href="https://docs.vechain.org/sync2/user-guide/"
                    ><el-image class="technology-img" :src="Sync2"
                  /></a>
                  <a
                    rel="noopener"
                    target="_blank"
                    href="https://www.vechain.org/"
                    ><el-image class="technology-img" :src="VechainThor"
                  /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-2">
        <div class="column-4">
          <div class="maketplace">
            <p class="title">Explore</p>
            <ul>
              <li>
                <el-link href="./#/marketplace/index">Marketplace</el-link>
              </li>
              <li>
                <el-link href="./#/collections/index">All Collections</el-link>
              </li>
              <li>
                <el-link href="./#/games/index">All Games</el-link>
              </li>
              <li>
                <el-link href="./#/minting/index">Minting Now</el-link>
              </li>
            </ul>
          </div>
          <div class="myaccount">
            <h5 class="title">Account</h5>
            <ul>
              <li>
                <el-link href="./#/account/index">Manage</el-link>
              </li>
              <li>
                <el-link href="./#/account/profile">Profile</el-link>
              </li>
              <li>
                <el-link href="./#/account/wallet"> My wallet </el-link>
              </li>
              <li>
                <el-link href="./#/account/settings">Settings </el-link>
              </li>
            </ul>
            <h5 class="title title-p">Starts</h5>
            <ul>
              <li>
                <el-link href="./#/stats/rankings">Ranking</el-link>
              </li>
              <li>
                <el-link href="./#/stats/activity">Activity </el-link>
              </li>
            </ul>
          </div>
          <div class="resouces">
            <h5 class="title">Resource</h5>
            <ul>
              <li>
                <el-link href="" @click="tempLinkCall">Help center</el-link>
              </li>
              <li>
                <el-link href="" @click="tempLinkCall">Platform status</el-link>
              </li>
              <li><el-link href="" @click="tempLinkCall">Partners</el-link></li>
              <li>
                <el-link href="" @click="tempLinkCall">Gas & Fees</el-link>
              </li>
            </ul>
          </div>
          <div class="company title-p">
            <h5 class="title">Company</h5>
            <ul>
              <li><el-link href="" @click="tempLinkCall">About</el-link></li>
              <li><el-link href="" @click="tempLinkCall">Careers</el-link></li>
              <li><el-link href="" @click="tempLinkCall">Ventures</el-link></li>
              <li><el-link href="" @click="tempLinkCall">Grants</el-link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="copy-right">
      <p>© 2022 VeFam Network</p>
      <el-link href="#/terms">Terms of Use</el-link>
    </div>
  </div>
</template>

<style lang="scss">
.footer-1 .stay-in-the .signup .input-border .el-input__wrapper {
  background-color: transparent;
  border-radius: unset;
  box-shadow: unset;
  height: 40px;
}

.footer-1 .stay-in-the .signup .input-border .el-input__inner {
  color: #ffff;
}
</style>

<style lang="scss" scoped>
.footer-container {
  display: grid;
  padding: 0 50px;
  color: #ffff;
  background: rgba(74, 78, 138, 0.1);

  .list-footer {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-bottom: 40px;
    margin-top: 50px;
    border-bottom: 1px solid rgba(229, 232, 235, 0.25);

    .footer-1 {
      width: 34%;
      align-items: flex-start;
      text-align: left;

      .stay-in-the {
        & h1 {
          font-size: 25px;
          font-weight: 600;
        }

        & p {
          padding: 10px 0px;
        }

        .signup {
          display: flex;
          align-items: center;

          .input-border {
            width: 300px;
            max-width: 100%;
            background-image: linear-gradient(
              to right,
              #00f6ff,
              #5d7eff,
              #a370ff
            );
            padding: 1px;
            border-radius: 20px;
            margin: 20px 0px;

            .input {
              width: 100%;
              height: 100%;
              background: #171b33;
              border-radius: 20px;
            }
          }

          .button {
            padding: 0px 10px;

            .el-button {
              width: 100px;
              height: 40px;
              background: linear-gradient(
                94.9deg,
                #00f6ff 0%,
                #5d7eff 48.44%,
                #5429a0 100%
              );
              border-radius: 20px;
              border: none;
              color: #ffff;
              opacity: 0.8;
              transition: all 0.3s ease-in;
              font-weight: 700;

              &:hover {
                opacity: 1;
              }
            }
          }
        }

        .socialmedia {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .socia-item {
            display: flex;
            align-items: center;
            width: 232px;
            max-width: 100%;
            padding: 20px 20px;

            .icon {
              display: flex;
              width: 54px;
              height: 54px;
              align-items: center;
              justify-content: center;
              font-size: 26px;
            }

            .discord .icon {
              font-size: 40px;
              animation: 3.5s infinite alternate shake;
            }
            @keyframes shake {
              0%,
              100% {
                transform: rotate(0);
              }
              10%,
              30%,
              50%,
              70%,
              90% {
                transform: rotate(-15deg);
              }
              20%,
              40%,
              60%,
              80% {
                transform: rotate(15deg);
              }
            }

            .discord,
            .twitter,
            .chrome {
              background: linear-gradient(
                94.9deg,
                #00f6ff 0%,
                #5d7eff 48.44%,
                #5429a0 100%
              );
              border-radius: 20px;
              margin-right: 10px;
              opacity: 0.8;
              transition: all 0.3s ease-in;
              font-weight: 700;

              & a {
                width: 54px;
                height: 54px;
              }

              &:hover {
                opacity: 1;
              }
            }
          }
          h1 {
            display: flex;
            justify-content: center;
          }
          .technology {
            display: flex;
            justify-content: center;
            .technology-gr {
              display: flex;
              justify-content: center;
              flex-wrap: wrap;
              margin-top: 15px;
            }
            .technology-img {
              width: 100%;
              max-width: 125px;
              margin: 10px;
              transition: transform 0.4s ease 0s;
              &:hover {
                transform: scale(1.1);
              }
            }
          }
        }
      }
    }

    .footer-2 {
      width: 66%;
      align-items: flex-start;
      padding-left: 72px;
      flex-wrap: wrap;

      .column-4 {
        display: flex;

        .maketplace,
        .resouces,
        .company,
        .myaccount {
          padding: 0px 10px;
          width: 25%;

          & a {
            padding: 10px 0px;
            color: rgba(251, 253, 255, 0.815);

            &:hover {
              color: rgb(251, 253, 255);
            }
          }

          .el-link.is-underline:hover:after {
            content: none;
          }
        }
      }
    }

    .title {
      font-size: 20px;
      font-weight: 600;
    }
  }

  .copy-right {
    margin: 20px 0px;
    line-height: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    .el-link {
      margin-right: 50px;
      color: rgba(251, 253, 255, 0.815);

      &:hover {
        color: rgb(251, 253, 255);
      }
    }

    .el-link.is-underline:hover:after {
      content: none;
    }
  }
}
@media screen and (min-width: 1310px) {
  .footer-container .list-footer .footer-2 .column-4 {
    .maketplace,
    .myaccount,
    .resouces,
    .company {
      width: 25%;
    }
  }
}
@media screen and (max-width: 1024px) {
  .list-footer {
    flex-wrap: wrap-reverse !important;
  }
  .footer-container .list-footer .footer-1 {
    width: 100%;

    .stay-in-the .signup .input-border {
      width: 100%;
    }
    .socialmedia {
      display: flex;
      .socia-item {
        width: 0px;
      }
      .technology {
        h1 {
          // display: flex;
          // justify-content: flex-end;
        }
        .technology-gr {
          // justify-content: flex-end !important;
        }
      }
    }
  }

  .footer-container .list-footer .footer-2 {
    width: 100%;
    padding-left: 0px;

    .column-4 {
      display: flex;

      .maketplace,
      .resouces,
      .company,
      .myaccount {
        width: 25%;
      }
    }
  }
}
@media screen and (max-width: 815px) {
  .footer-container {
    .list-footer {
      .title-p {
        margin-top: 28px;
      }

      .footer-2 {
        width: 100%;

        .column-4 {
          display: flex;
          flex-wrap: wrap;
          text-align: center;

          .maketplace,
          .resouces,
          .company,
          .myaccount {
            width: 50%;
          }
        }
      }
    }

    .copy-right {
      justify-content: center;

      & p {
        width: 100%;
        text-align: center;
        margin: 20px 0px;
      }

      .el-link {
        margin-right: 0;
      }
    }
    .socialmedia {
      .socia-item {
        width: unset;
      }
    }
  }
}
@media screen and (max-width: 632px) {
  .socialmedia {
    margin-top: 20px;
    flex-wrap: wrap;
    .technology {
      h1 {
        // justify-content: flex-start !important;
      }
    }
    .technology-gr {
      justify-content: center !important;
    }
  }
}
@media screen and (max-width: 480px) {
  .footer-container {
    padding: 0px 15px;

    .list-footer {
      margin-top: 30px;

      .footer-1 .stay-in-the {
        & h1 {
          font-size: 20px;
        }

        & p {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
