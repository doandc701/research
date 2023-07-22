<template>
  <div class="description">
    <div>
      <h3 style="color: #00d4ff"><strong>Requirement</strong></h3>
      <ul style="list-style-type: circle">
        <li><p>You need to own at least one VPunks to play.</p></li>
      </ul>
      <h3 style="color: #00d4ff; margin-top: 30px"><strong>Rules</strong></h3>
      <ul style="list-style-type: circle">
        <li>
          <p>
            In the game there are all 25 rounds, with the milestones of 5, 10,
            15, 20, 25 players will receive 20, 40, 60, 80, 100% POWER. After
            completing 25 rounds, players must wait until the next day to play
            again.
          </p>
        </li>
        <li>
          <p>
            Each Vpunk has one turn per day, you die at any round then stop at
            that round.
          </p>
        </li>
      </ul>
      <h3 style="color: #00d4ff; margin-top: 30px"><strong>Rewards</strong></h3>
      <p>A total of <code>8,000 VPU</code> are allocated per day.</p>
      <ul style="list-style-type: circle">
        <li><p>Each VPunk has a POWER proportional to the rarity score</p></li>
        <li>
          <p>
            You pass rounds <code>5, 10, 15, 20, 25</code> in the game to get
            POWER ratio <code>20, 40, 60, 80, 100%</code> respectively
          </p>
        </li>
        <li>
          <p>
            Your reward =
            <code>8,000 / Total-POWER-of-the-players * Your-POWER</code>
          </p>
        </li>
        <li>
          <p>
            Rewards are calculated at the end of the day and added to your
            balance
          </p>
        </li>
      </ul>
      <p>
        Your reward will be added to the
        <el-link style="color: #6ce23e" href="#/account/wallet" type="primary"
          >Funding wallet</el-link
        >
      </p>
    </div>
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
