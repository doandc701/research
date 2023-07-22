<template>
  <div class="description">
    <h3 style="color: #00d4ff"><strong>Main functions in the game:</strong></h3>
    <ul style="list-style-type: circle">
      <li>
        <p>Inventory : Contains the Vpunks and Weapons that the player has</p>
      </li>
      <li><p>My team : set up the teams that the player has set up</p></li>
      <li><p>Setting : setting language, game sound, sound effects</p></li>
      <li><p>Arena : Includes 2 modes</p></li>
      <p>+ Solo : players create rooms and invite friends to play together</p>
      <p>
        + Versus : player enters a pre-made room to compete with other players
      </p>
    </ul>
    <h3 style="color: #00d4ff; margin-top: 30px">
      <strong>How to play:</strong>
    </h3>
    <ul style="list-style-type: circle">
      <li>
        <p>Now , VPunks Arena Fighter has 3 levels & 5 elements per weapon.</p>
      </li>
      <li>
        <p>
          Elements: the game has 5 main elements: Metal, Wood, Water, Fire, and
          Earth. Elements have mutuality and contrast with each other.
        </p>
      </li>
    </ul>
    <div class="img-element">
      <img
        style="width: 247px; height: 175px"
        src="/src/assets/games/vpunk-arena/elements-circle.png"
      />
    </div>
    <ul>
      <p>
        + Five elements are born in the same way: Wood gives birth to Fire, Fire
        gives birth to Earth, Earth gives birth to Metal, Metal gives birth to
        Water, Water gives birth to Wood.
      </p>
    </ul>
    <div class="img-element">
      <img
        style="width: 250px; height: 175px"
        src="/src/assets/games/vpunk-arena/elements-star.png"
      />
    </div>
    <ul>
      <p>
        + The Five Elements are incompatible: Fire meets Metal, Metal meets
        Wood, Wood meets Earth, Earth meets Water, Water meets Fire.
      </p>
      <li>
        <p>
          Vpunk and Weapons: Each player can own multiple Vpunk and Weapons.
          Each Vpunk and Weapons has a different element.
        </p>
      </li>
      <li>
        <p>
          When adding a type to Vpunk, you can get 10% of weapon damage if the
          weapon is of the same type as VPunks.
        </p>
      </li>
      <li>
        <p>
          Systems are an important part of your battle strategy. Weapons have
          their default system, you can add them to your VPunks NFT. Using them
          properly can increase your attack power. Please learn the following
          algorithms carefully to be able to come up with the best strategy in
          your match.
        </p>
      </li>
    </ul>
    <h3 style="color: #00d4ff; margin-top: 30px">
      <strong>Skill & Buff:</strong>
    </h3>
    <ul style="list-style-type: circle">
      <li><p>Choose skills:</p></li>
    </ul>
    <div class="img-element">
      <img
        style="max-width: 100%"
        src="/src/assets/games/vpunk-arena/weapon-card.png"
      />
    </div>
    <ul style="list-style-type: circle">
      <p>+ Skill_power: random in the range [80-120, 60-140 or 40-160].</p>
      <p>
        + For example: when you select “80 ~ 120” skill_power will be randomly
        between 80 and 120.
      </p>
      <li><p>Buff Features:</p></li>
      <p>+ During your attack, you can choose Buff</p>
      <p>+ Randomly results in one of the following two cases:</p>
      <ul style="list-style-type: square">
        <li>
          <p>Buff_dame has a random value between 10% and 50% of true_dame.</p>
        </li>
      </ul>
      <ul style="list-style-type: square">
        <li><p>You lose attack turn and heal randomly from 1% to 3%.</p></li>
      </ul>
    </ul>
    <div class="img-element">
      <img
        style="width: 1480px; height: auto"
        src="/src/assets/games/vpunk-arena/chart-weapon.png"
      />
    </div>
    <h3 style="color: #00d4ff"><strong>How to hit:</strong></h3>
    <ul style="list-style-type: circle">
      <li>
        <p>
          When hitting, the player will be selected by the system in that turn
          to be defensive or offensive.
        </p>
      </li>
      <li>
        <p>
          At the beginning, players can hit themselves or choose auto mode for
          the system to hit themselves.
        </p>
      </li>
      <li><p>When hitting yourself:</p></li>
      <p>
        + Attack side: Players will choose weapons and techniques to attack the
        opponent. Or you can choose to buff to be able to receive healing or
        attack the opponent.
      </p>
      <p>
        + Defensive side: The player chooses a weapon to defend against an
        attacking opponent.
      </p>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Guides"
});
// const fits = ["fill", "contain", "cover", "none", "scale-down"];
</script>

<style lang="scss" scoped>
.img-element {
  display: flex;
  justify-content: center;
  margin: 25px;
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
