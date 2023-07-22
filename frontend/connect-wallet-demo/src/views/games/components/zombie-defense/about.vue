<script setup lang="ts">
import { ref } from "vue";
// import zombie01 from "/@/assets/img/zombie-01.png";

defineOptions({
  name: "ZombieDefense"
});
const gameRate = ref(3);
</script>

<template>
  <div class="zombie-defense-about">
    <div class="zombie-container">
      <div class="zombie-left">
        <div class="box">
          <div class="box-center">
            <div class="title">
              <h1>PROJECT</h1>
              <p style="color: #fff600; font-weight: 600">VPUNKS</p>
            </div>
            <div class="table01">
              <div class="tb-title">
                <h1>USERS</h1>
                <h1>VOLUME</h1>
              </div>
              <div class="tb-number">
                <p style="color: #45bbff">$- -K</p>
                <p style="color: #45bbff">$- -K</p>
              </div>
              <div class="tb-percent">
                <p style="color: #fff600">- -%</p>
                <p style="color: #fff600">- -%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="zombie-right">
        <!-- <div class="thumbnail">
          <el-image :src="zombie01" fit="cover" />
        </div> -->
        <div>
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/GmYG9_h6_K4"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
      </div>
    </div>
    <div class="description">
      <h3 style="color: #00d4ff; margin-top: 40px">
        <strong>Zombie Defense</strong>
      </h3>
      <ul style="list-style-type: circle">
        <li><p>Is a Play To Earn game for those who hold VPunks OG.</p></li>
        <li>
          <p>
            One day suddenly monsters attack the stronghold you live in. And
            there was an archer trying to defend against the onslaught of
            monsters. Your mission now is to help that archer repel the
            monster's attack by earning money after killing monsters and
            upgrading skills, summoning spells.
          </p>
        </li>
      </ul>
      <h3 style="margin-top: 40px; color: #00d4ff">
        <strong>Event January 2022</strong>
      </h3>
      <ul style="list-style-type: circle; margin-bottom: 40px">
        <li>
          <p>
            Rules: the most VPunks who passed the round 25 of Zombie Defense in
            January
          </p>
        </li>
        <li><p>Prizes: 5000 $VPU 🏆</p></li>
        <li>
          <p>
            <b style="color: #fff">WINNER: </b>
            <el-link
              style="color: #6ce23e"
              :href="txLink01"
              target="_blank"
              type="primary"
              >0x085...39a</el-link
            >
            with 125 VPunks winning.
          </p>
        </li>
      </ul>
    </div>
    <div class="review">
      <div class="title">
        <h1 style="padding: 20px 0px; font-size: 30px">Reviews</h1>
        <p
          style="
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-bottom: 15px;
          "
        >
          Rating Game
        </p>
        <div class="vote">
          <div class="vote-left">
            <div class="total">
              <h1>0</h1>
              <div class="rate">
                <el-rate
                  v-model="gameRate"
                  disabled
                  score-template="{value} points"
                />
              </div>
              <div class="people-total">
                <IconifyIconOnline icon="fa:user" style="margin-right: 10px" />
                <p class="num">00000 Total</p>
              </div>
            </div>
          </div>
          <div class="vote-right">
            <div class="list-vote">
              <div class="vote-item">
                <p class="mrg">5</p>
                <div class="vote-box">
                  <div class="color-box5" />
                </div>
              </div>
              <div class="vote-item">
                <p class="mrg">4</p>
                <div class="vote-box">
                  <div class="color-box4" />
                </div>
              </div>
              <div class="vote-item">
                <p class="mrg">3</p>
                <div class="vote-box">
                  <div class="color-box3" />
                </div>
              </div>
              <div class="vote-item">
                <p class="mrg">2</p>
                <div class="vote-box">
                  <div class="color-box2" />
                </div>
              </div>
              <div class="vote-item">
                <p class="mrg">1</p>
                <div class="vote-box">
                  <div class="color-box1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.rate {
  .el-icon {
    width: 2em;
    height: 2em;
    & svg {
      width: 2em;
      height: 2em;
    }
  }
}
@media only screen and(max-width: 480px) {
  .rate {
    .el-icon {
      width: 1em;
      height: 1em;
      font-size: 20px;
      & svg {
        width: 1em;
        height: 1em;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.zombie-defense-about {
  .zombie-container {
    display: flex;
    justify-content: center;

    .zombie-left {
      background-image: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
      padding: 1px;
      border-radius: 20px;
      .box {
        width: 320px;
        max-width: 100%;
        background: #171b33;
        padding: 20px;
        border-radius: 20px;
        height: 100%;
        .box-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          position: relative;
          top: 40%;
          transform: translateY(-40%);
        }
        .title {
          text-align: center;
          margin: 20px;
        }
        .table01 {
          display: flex;
          justify-content: center;
          align-items: center;

          .tb-number {
            margin: 0px 10px;
            padding: 0px 10px;
            border-left: 1px solid #5d7eff;
            border-right: 1px solid #5d7eff;
          }
          .tb-number,
          .tb-percent {
            text-align: center;
          }
        }
      }
    }
    .zombie-right {
      width: 50%;
      max-width: 560px;
      min-width: 300px;
      margin-left: 70px;
      .thumbnail {
        max-width: 600px;
      }
    }
  }
  .description {
    padding-bottom: 0px;
    border-bottom: 1px solid #525c9a;
    & ul {
      list-style-type: circle;
      padding: 0px 20px;
      & li {
        padding: 10px 0px;
      }
    }
  }
  .review {
    .title {
      .vote {
        display: flex;
        align-items: center;
        justify-content: center;
        .vote-left {
          width: 50%;
          text-align: center;
          .total {
            & h1 {
              font-size: 100px;
              font-weight: 600;
            }
            .people-total {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
        .vote-right {
          width: 50%;
          .list-vote {
            .vote-item {
              display: flex;
              align-items: center;
              margin-bottom: 20px;

              .mrg {
                margin-right: 5px;
                font-weight: 600;
              }
              .vote-box {
                width: 100%;
                background-color: #1b3d66;
                border-radius: 10px;
                .color-box1,
                .color-box2,
                .color-box3,
                .color-box4,
                .color-box5 {
                  background-color: #45bbff;
                  border-radius: 10px;
                  height: 25px;
                }
                .color-box5 {
                  width: 80%;
                }
                .color-box4 {
                  width: 60%;
                }
                .color-box3 {
                  width: 40%;
                }
                .color-box2 {
                  width: 20%;
                }
                .color-box1 {
                  width: 10%;
                }
              }
            }
          }
        }
      }
    }
  }
}
@media only screen and(max-width: 480px) {
  .zombie-defense-about .review .title .vote .vote-left .total h1 {
    font-size: 60px;
  }
  .zombie-defense-about .review .title .vote .vote-right .list-vote .vote-item {
    margin-bottom: 10px;
  }
  .vote-box {
    .color-box1,
    .color-box2,
    .color-box3,
    .color-box4,
    .color-box5 {
      height: 15px !important;
    }
  }
}
@media only screen and(max-width: 739px) {
  .zombie-defense-about .zombie-container {
    display: block;
  }
  .zombie-defense-about .zombie-container .zombie-left {
    width: 100%;
    .box {
      width: inherit;
      .box-center {
        flex-direction: row;
        transform: translateY(0%);
      }
    }
  }
  .zombie-defense-about .zombie-container .zombie-right {
    margin-top: 40px;
    margin-left: 0px;
    width: 100%;
    max-width: 100%;
  }
}
</style>
