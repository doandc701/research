<template>
  <div class="description">
    <h3 style="color: #00d4ff"><strong>Main functions in the game:</strong></h3>
    <ul>
      <li>
        <p>
          VPunk: the player will choose the Vpunk he wants to use from his
          collection.
        </p>
      </li>
      <li><p>Leaderboard: a table showing all Vpunk Win-Power.</p></li>
      <li><p>Menu: move to the top scene.</p></li>
      <li>
        <p>
          Upgrading: shows all the skills, auxiliary that the player can upgrade
          in the game.
        </p>
      </li>
      <li>
        <p>Coins: displays the number of coins the player has available.</p>
      </li>
      <li><p>Buy: click to upgrade the selected player's skill.</p></li>
      <li><p>Next: go to the game screen.</p></li>
    </ul>
    <h3 style="color: #00d4ff; margin-top: 30px">
      <strong>How to play:</strong>
    </h3>
    <ul>
      <li>
        <p>
          In the game: In the game, the player will control the archer to attack
          the Zombies from the castle. The player will align and adjust the
          direction to attack the Zombie. After completing a level, the player
          will receive a corresponding amount of gold, with which the player
          will use to upgrade skills and spells to use for the following levels.
        </p>
      </li>
    </ul>
    <h3 style="color: #00d4ff; margin-top: 30px"><strong>Skills</strong></h3>
    <div class="skills-game">
      <img
        style="width: 60px; height: 60px"
        src="/src/assets/games/zombie-defense/icon-skill/1.png"
      />
      <p>Upgrading will increase the reload speed of your bow.</p>
    </div>
    <div class="skills-game">
      <img
        style="width: 60px; height: 60px"
        src="/src/assets/games/zombie-defense/icon-skill/2.png"
      />
      <p>Upgrading will increase the damege of each arrow.</p>
    </div>
    <div class="skills-game">
      <img
        style="width: 60px; height: 60px"
        src="/src/assets/games/zombie-defense/icon-skill/3.png"
      />
      <p>Upgrading will increase the number of arrows for each shoot.</p>
    </div>
    <div class="skills-game">
      <img
        style="width: 60px; height: 60px"
        src="/src/assets/games/zombie-defense/icon-skill/4.png"
      />
      <p>Upgrading will increase the health of the castle.</p>
    </div>
    <div class="skills-game">
      <img
        style="width: 60px; height: 60px"
        src="/src/assets/games/zombie-defense/icon-skill/5.png"
      />
      <p>Monster can hide no where from the arrow rain.</p>
    </div>
    <h3 style="color: #00d4ff; margin-top: 30px">
      <strong>Summoning spells</strong>
    </h3>
    <div class="skills-game">
      <img
        style="width: 60px; height: 60px"
        src="/src/assets/games/zombie-defense/icon-skill/6.png"
      />
      <p>Monster will be frozen in few seconds by this magic.</p>
    </div>
    <div class="skills-game">
      <img
        style="width: 60px; height: 60px"
        src="/src/assets/games/zombie-defense/icon-skill/7.png"
      />
      <p>This magic hammer can repair your castle.</p>
    </div>
    <div class="skills-game">
      <img
        style="width: 60px; height: 60px"
        src="/src/assets/games/zombie-defense/icon-skill/8.png"
      />
      <p>This is the end of the world for monsters.</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.skills-game {
  display: flex;
  align-items: center;
  margin-top: 20px;
  p {
    margin-left: 20px;
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
</style>
