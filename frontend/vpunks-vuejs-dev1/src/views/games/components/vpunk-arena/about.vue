<template>
  <div>
    <h3 style="color: #00D4FF"><strong>Vpunks Arena</strong></h3>
    <ul style="list-style-type: circle;">
      <li><p>VPunk Arena is a turn-based fighting game for owners of VPunks.</p></li>
      <li><p>Build your team with a VPunk and 3 weapons to fight.</p></li>
      <li><p>Learn about mutually and contrary in the five elements to win.</p></li>
    </ul>
    <div style="max-width: 560px; margin-top:40px">
      <iframe width="100%" height="315" src="https://www.youtube.com/embed/rMMr2wiEEso" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
    </div>
  </div>
</template>

<script>
import { explorerTx } from '@/settings'

export default {
  name: 'VPunksArena',
  components: {

  },
  data() {
    return {
      txLink01: `${explorerTx}0x72c10026b3fea456fba3ab6166b52ebf9bdbec1a9330fb51ee259baab3b95d54`
    }
  }
}
</script>

<style>

</style>
