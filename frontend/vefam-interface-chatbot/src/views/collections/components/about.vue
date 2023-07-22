<script setup lang="ts">
import { ref } from "vue";

defineProps({
  collectionCodeName: String,
  about: String
});

const gameRate = ref(3);
</script>

<template>
  <div>
    <div class="description">
      <h3 style="color: #00d4ff; margin-top: 40px">
        <strong>Introduction</strong>
      </h3>
      <div>{{ about }}</div>
      <div v-if="collectionCodeName == 'vpunks-weapons'">
        <h3 style="color: #00d4ff; margin-top: 40px">
          <strong>Tokenomics</strong>
        </h3>
        <div>
          <p>Minting date: 2022/11/01</p>
          <p class="des-title">Distribution by weapon type:</p>
          AXE, Nunchaku, Spear, Sword, Cub each type 4,000 total 20,000 quantity
          <p class="des-title">Allocation by level:</p>
          <ul>
            <li>Weapon Lv1: 5x1800 (total 9,000)</li>
            <li>Weapon Lv2: 5x1200 (total 6,000)</li>
            <li>Weapon Lv3: 5x1000 (total 5,000)</li>
          </ul>

          <div>
            <p class="des-title">
              Total supply: 5 types of weapons - 15 items - 20,000 quantity
            </p>
            <ul>
              <li>50% for the public mint (10,000 quantity)</li>
              <li>
                50% allocated to: airdrop, bonus, rewards, team (no more than
                3%)
              </li>
            </ul>
          </div>

          <div>
            <p class="des-title">
              Tiered discount for VeFam VIP members (10 tiers)
            </p>
            <ul>
              <li>Tier 1: 25% (NFT is mint from 1 to 1000)</li>
              <li>Tier 2: 23% (NFT is mint from 1001 to 2000)</li>
              <li>Tier 3: 21% (NFT is mint from 2001 to 3000)</li>
              <li>Tier 4: 20% (NFT is mint from 3001 to 4000)</li>
              <li>Tier 5: 18% (NFT is mint from 4001 to 5000)</li>
              <li>Tier 6: 16% (NFT is mint from 5001 to 6000)</li>
              <li>Tier 7: 15% (NFT is mint from 6001 to 7000)</li>
              <li>Tier 8: 13% (NFT is mint from 7001 to 8000)</li>
              <li>Tier 9: 11% (NFT is mint from 8001 to 9000)</li>
              <li>Tier 10: 10% (NFT is mint from 9001 to 10000)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="border-top-linear">
      <hr />
    </div>
    <div class="rate">
      <el-row>
        <el-col style="font-size: 25px; font-weight: bold" :span="12">
          <h3>Reviews</h3>
        </el-col>
        <el-col :span="12" class="rating-game-gr">
          <el-row><h3>Rating Game</h3></el-row>
          <!-- <el-row
                  ><el-rate
                    class="rate-right"
                    v-model="gameRate"
                    disabled
                    score-template="{value} points"
                /></el-row> -->
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="12" class="rate-point">
          <el-row>
            <div class="point">8/10</div>
          </el-row>
          <el-row>
            <el-rate
              class="rate-left"
              v-model="gameRate"
              disabled
              score-template="{value} points"
            />
          </el-row>
          <el-row style="display: flex; align-items: center">
            <IconifyIconOnline
              style="font-size: 15px; margin-right: 5px; color: white"
              icon="fa-solid:user-friends"
            />00000 Total
          </el-row>
        </el-col>
        <el-col :span="12" class="rate-progress">
          <div class="progress">
            <el-progress :stroke-width="26" :percentage="100">
              <span text>1</span>
            </el-progress>
            <el-progress :stroke-width="26" :percentage="80">
              <span text>2</span>
            </el-progress>
            <el-progress :stroke-width="26" :percentage="60">
              <span text>3</span>
            </el-progress>
            <el-progress :stroke-width="26" :percentage="40">
              <span text>4</span>
            </el-progress>
            <el-progress :stroke-width="26" :percentage="20">
              <span text>5</span>
            </el-progress>
          </div></el-col
        >
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.description {
  margin: 24px;
  color: #dfedf5;
  h3 {
    font-size: 18px;
  }
  & ul {
    list-style-type: circle;
    padding: 0px 20px;
    & li {
      padding: 10px 0px;
    }
  }
  .des-title {
    font-weight: bold;
    padding-top: 20px;
    color: #1a7393;
  }
}
.border-top-linear {
  // background-: linear-gradient(to right, #00f6ff, #5d7eff, #a370ff);
  margin-top: 40px;
  margin-bottom: 40px;
  hr {
    height: 2px;
    color: #ffffff00;
    background-color: #525c9a;
  }
}
.rate {
  // display: flex;
  // flex-wrap: wrap;
  color: #fff;
  padding-left: 24px;
  padding-right: 24px;
  .rating-game-gr {
    display: flex;
    flex-direction: column;
    align-content: flex-end;
    align-items: flex-end;
  }
  .rate-right {
    height: 50px;
    // width: 255px;
    padding-top: 35px;
    padding-bottom: 5px;
    --el-rate-disabled-void-color: #858585;
    --el-rate-fill-color: #fff700;
    --el-rate-icon-size: 50px;
  }
  .rate-point {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .point {
      font-size: 50px;
      font-weight: bolder;
    }
    .rate-left {
      height: 50px;
      // width: 255px;
      padding-top: 5px;
      padding-bottom: 15px;
      --el-rate-disabled-void-color: #858585;
      --el-rate-fill-color: #fff700;
      --el-rate-icon-size: clamp(16px, 4vw, 30px);
    }
  }
  .rate-progress {
    :deep(.el-progress-bar__inner) {
      background-color: #45bbff;
    }
    :deep(.el-progress-bar__outer) {
      background-color: #ffffff12;
    }
    :deep(.el-progress__text) {
      min-width: 0;
    }
    .progress {
      display: flex;
      flex-direction: column;
      align-content: flex-end;
      align-items: flex-end;
    }
    .el-progress--line {
      margin-bottom: 15px;
      width: 80%;
    }
  }
}
</style>
