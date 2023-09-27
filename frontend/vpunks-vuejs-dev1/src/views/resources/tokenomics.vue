<template>
  <div class="smart-app-container tokenomics-container">
    <!--<div class="notify">This feature is coming soon.</div>-->
    <!-- Tokenomics -->
    <h2 class="app-con-title">Introducing VPU</h2>
    <p style="color: rgb(255, 255, 255, 0.8)">August 6th, 2021</p>
    <div class="blogPost">
      <ul>
        <li><p>VPU, the ecosystem utility and governance token of VPunks NFT & VPunks marketplace</p></li>
        <li><p>VPU contract address:
          <el-dropdown placement="bottom">
            <span class="el-dropdown-link">
              <el-link type="primary">{{ VPUAddress }}</el-link>
            </span>
            <AccountAddress :account-address="VPUAddress" title="Collections" />
          </el-dropdown>
        </p></li>
        <li><p>54% of the VPU genesis supply is allocated to VPunks community members, 4.13% of total supply has already been distributed to VPunks minting airdrop</p></li>
        <li><p>To start VPU spent 24% of total supply as initial liquidity pool</p></li>
      </ul>

      <p style="margin-top:40px;"><strong>VPU Allocation</strong></p>
      <p>121 million VPU have been minted at genesis and will become accessible over the course of three years. The initial three year allocation is as follows:</p>
      <ul>
        <li><p>54.00% to VPunks community members <code class="inlineCode">65,340,000 VPU</code></p></li>
        <li><p>24.00% to Initial liquidity pool <code class="inlineCode">29,040,000 VPU</code></p></li>
        <li><p>21.00% to team members and future employees with 3-year vesting <code class="inlineCode">25,410,000 VPU</code></p></li>
        <li><p>1.00% to community management team with 3-year vesting <code class="inlineCode">1,210,000 VPU</code></p></li>
      </ul>
      <p>54.00% to VPunks community members are allocated as follows:</p>
      <ul>
        <li><p>22.00% to liquidity mining rewards <code class="inlineCode">26,620,000 VPU</code></p></li>
        <li><p>18.00% to staking rewards <code class="inlineCode">21,780,000 VPU</code></p></li>
        <li><p>~9.87% to Games, Challenges, Bonus with 3-year vesting <code class="inlineCode">11,940,000 VPU</code></p></li>
        <li><p>~4.13% to VPunks minting airdrop <code class="inlineCode">5,000,000 VPU</code></p></li>
      </ul>
      <p>A <strong>perpetual inflation rate of 2% per year will start after 3 years</strong>, ensuring continued participation and contribution to VPunks at the expense of passive VPU holders.</p>
      <p style="text-align: center;">
        <a href="images/genesis_VPU_allocation-2.png" target="_blank" rel="noopener">
          <img class="gatsby-resp-image-image" alt="Genesis VPU Allocation" title="Genesis VPU Allocation" src="images/genesis_VPU_allocation-2.png" style="width:100%;max-width: 600px;" loading="lazy">
        </a>
      </p>

      <p style="margin-top:40px;"><strong>Community Treasury</strong></p>
      <p>With ~4.13% of tokens already available to be claimed by users who have minted VPunks, the governance treasury will retain ~49.87% <!-- -->[60,340,000 VPU]<!-- --> of VPU supply to distribute on <strong>liquidity mining, staking</strong>, and other programs.</p>
      <p>Product development team and community management team VPU allocations will have tokens locked up on an identical schedule.</p>
    </div>

    <h2 class="app-con-title">VPU use case</h2>
    <div class="blogPost">
      <p style="margin-top:-10px;"><strong>Staking</strong></p>
      <p>User will be able to lock up their tokens to VPunks and receive reward.</p>
      <p>VPU staking acts as an incentive for holding VPU and supporting the ecosystem. Stakers receive VPU. Stakers will eventually direct usage of The Community Treasury.</p>

      <p style="margin-top:40px;"><strong>Liquidity Mining</strong></p>
      <p>The initial liquidity mining program will work after the initial liquidity pool is launched:</p>
      <ul><li><p>VPU/VET</p></li></ul>
      <p>These VPU are not subject to vesting or lock up.</p>

      <p style="margin-top:40px;"><strong>Payment</strong></p>
      <p>VPU will be accepted as currency within the VPunks marketplace. VPU may also be used to determine eligibility for participation in certain sales/auctions conducted by the VPunks team.</p>

      <p style="margin-top:40px;"><strong>Games</strong></p>
      <p>VPunks continues to evolve alongside the blockchain gaming industry to offer you a diverse range of game modes, such as PVP auto-battle tournaments you can play in your browser and participate in P2E battles. This is just the beginning.</p>
      <p>
        <span style="position:relative;display:block;margin-left:auto;margin-right:auto;max-width:600px">
          <img class="gatsby-resp-image-image" alt="games" title="games" src="images/games.png" sizes="(max-width: 600px) 100vw, 600px" style="width:100%;margin:0;vertical-align:middle;" loading="lazy">
        </span>
      </p>

      <p style="margin-top:40px;"><strong>Governance</strong></p>
      <p>At the end of 2021 the community governance features will be available, users can use their VPU to vote for new features.</p>
    </div>
  </div>
</template>

<script>
import { nativeToken, explorerAddress } from '@/settings'
import AccountAddress from '@/components/AccountAddress'

export default {
  name: 'Games',
  components: {
    AccountAddress
  },
  filters: {
    fromWei(w) {
      if (typeof w !== 'object') return w
      return window.web3.utils.fromWei(w, 'ether')
    }
  },
  data() {
    return {
      // general
      debug: false,
      address: null,
      nativeToken: nativeToken,
      //
      VPUAddress: null,
      VPULink: null
    }
  },
  created() {
    this.debug && console.log('created - Games', window.selectedAccount)
    // if (!isConnected(true)) return  // vechain not check
    this.address = window.selectedAccount

    this.VPUAddress = this.$store.getters.instances.VPUContract.address
    this.VPULink = `${explorerAddress}${this.VPUAddress}`
  },
  beforeDestroy() {
    this.debug && console.log('beforeDestroy - Games')
  }
}
</script>

<style lang="scss" scoped>
.tokenomics-container {
  // background: #fffbff;
  color: rgb(255, 255, 255, 0.95);
  .notify {
    padding: 5px 0 5px 10px;
    font-size: 18px;
    color: #1c9631;
    text-align: center;
    line-height: 40px;
  }
  .blogPost {
    padding: 30px 0 30px 30px;
    padding-left: min(max(5px, 3vw), 30px);
    margin-right: min(max(0px, 3vw), 50px);
    font-size: 18px;
    font-weight: 400 !important;
    line-height: 1.5;
    word-break: break-word;
  }
  strong {
    font-weight: bold;
    color: #0df11f;
  }
  fieldset, table {
    padding: 0;
    margin: 0 0 1.45rem;
  }
  table {
    font-size: 1rem;
    line-height: 1.45rem;
    border-collapse: collapse;
    border-spacing: 2px;
    border-color: grey;
    width: 100%;
    display: table;
    box-sizing: border-box;
    text-indent: initial;
  }
  tbody {
      display: table-row-group;
      vertical-align: middle;
      border-color: inherit;
  }
  thead {
      display: table-header-group;
      vertical-align: middle;
      border-color: inherit;
  }
  tr {
      display: table-row;
      vertical-align: inherit;
      border-color: inherit;
  }
  td, th, thead {
    text-align: left;
  }
  td:first-child, th:first-child {
      padding-left: 0;
  }
  td, th {
      font-weight: 700;
      border-bottom: 1px solid rgba(0,0,0,.12);
      font-feature-settings: "tnum";
      -moz-font-feature-settings: "tnum";
      -ms-font-feature-settings: "tnum";
      -webkit-font-feature-settings: "tnum";
      padding: .725rem .96667rem calc(.725rem - 1px);
  }
}
</style>
