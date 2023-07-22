<template>
  <div class="description">
    <h3 style="color: #00d4ff">
      <strong>P2E game rules</strong>
    </h3>
    <ul>
      <li><p>A total of 8,000 VPU are allocated per day.</p></li>
      <li><p>Each VPunk has a POWER proportional to the rarity score</p></li>
      <li>
        <p>
          You pass rounds 5, 10, 15, 20, 25 in the game to get POWER ratio
          20,40, 60, 80, 100% respectively
        </p>
      </li>
      <li>
        <p>Your reward = 8,000 / Total-POWER-of-the-players * Your-POWER</p>
      </li>
      <li>
        <p>
          Rewards are calculated at the end of the day and added to your balance
        </p>
      </li>
      <li>
        <p>
          Your reward will be added to the
          <el-link href="#" style="color: #19f4df; font-size: 15px"
            >Funding wallet</el-link
          >
        </p>
      </li>
    </ul>
    <h3 style="margin-top: 40px; color: #00d4ff">
      <strong>Event January 2022</strong>
    </h3>
    <ul>
      <li>
        <p>
          Rules: the most VPunks who passed the round 25 of Zombie Defense in
          January
        </p>
      </li>
      <li>
        <p>Prizes: 5000 $VPU 🏆 WINNER:</p>
      </li>
      <li>
        <p>
          <b style="color: #00d4ff">WINNER: </b>
          <el-link style="color: #19f4df" target="_blank" type="primary"
            >0x085...39a
            <!--   :href="txLink01" -->
          </el-link>
          with 5 VPunks winning.
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.description {
  & ul {
    list-style-type: circle;
    padding: 0px 20px;
    & li {
      padding: 10px 0px;
    }
  }
}
</style>
