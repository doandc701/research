<template>
  <div class="zombie-defense-about">
    <h3 style="color: #00D4FF"><strong>Zombie Defense</strong></h3>
    <ul style="list-style-type: circle;">
      <li><p>Is a Play To Earn game for those who hold VPunks OG.</p></li>
      <li><p>One day suddenly monsters attack the stronghold you live in. And there was an archer trying to defend against the onslaught of monsters. Your mission now is to help that archer repel the monster's attack by earning money after killing monsters and upgrading skills, summoning spells.</p></li>
    </ul>
    <div style="max-width: 560px; margin-top:40px">
      <iframe width="100%" height="315" src="https://www.youtube.com/embed/GmYG9_h6_K4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
    </div>
    <h3 style="margin-top:40px;color: #00D4FF;"><strong>Event January 2022</strong></h3>
    <ul style="list-style-type: circle;">
      <li><p>Rules: the most VPunks who passed the round 25 of Zombie Defense in January</p></li>
      <li><p>Prizes: 5000 $VPU 🏆</p></li>
      <li><p>
        <b style="color: #fff;">WINNER: </b>
        <el-link style="color: #6CE23E" :href="txLink01" target="_blank" type="primary">0x085...39a</el-link> with 125 VPunks winning.</p></li>
    </ul>
  </div>
</template>

<script>
// const VPunksArena = () => ({
//   component: import(/* webpackChunkName: "VPunksArena" */ '@/components/VPunksArena/index.vue')
// })
import { explorerTx } from '@/settings'
// const id = 0
// const ZombieDefense = () => import(/* webpackChunkName: "ZombieDefense" */ id === '0' ? '@/components/ZombieDefense/index.vue' : '@/components/VPunksArena/index.vue')

export default {
  name: 'ZombieDefense',
  components: {
  },
  data() {
    return {
      txLink01: `${explorerTx}0x72c10026b3fea456fba3ab6166b52ebf9bdbec1a9330fb51ee259baab3b95d54`
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
