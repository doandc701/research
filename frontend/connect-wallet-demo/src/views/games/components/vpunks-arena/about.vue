<script setup lang="ts">
// import { explorerTx } from '@/settings'

defineOptions({
  name: "VPunksArena"
});
// const txLink01: `${explorerTx}0x72c10026b3fea456fba3ab6166b52ebf9bdbec1a9330fb51ee259baab3b95d54`;
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
            src="https://www.youtube.com/embed/rMMr2wiEEso"
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
        <strong>Vpunks Arena</strong>
      </h3>
      <ul style="list-style-type: circle">
        <li>
          <p>VPunk Arena is a turn-based fighting game for owners of VPunks.</p>
        </li>
        <li><p>Build your team with a VPunk and 3 weapons to fight.</p></li>
        <li>
          <p>Learn about mutually and contrary in the five elements to win.</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss">
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
    & ul {
      list-style-type: circle;
      padding: 0px 20px;
      & li {
        padding: 10px 0px;
      }
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
