<script setup lang="ts">
import { ref } from "vue";
import AddressDialog from "/@/components/AddressDialog/index.vue";

const veFamDeployer01 = "0xCBC52DAA2d4eb710C2f0D6F341E0c0ac442ac801";
const vpunksDeployer01 = "0xD3EF14fF4EA3C95C076B9Fc948aA05B7a407410a";
const dAccountAddr = "0x410833A024045676D2Cfa888602c30c7EF489310";

const vpunksOgAddr = "0xe92FDDD633008C1bca6E738725d2190cD46DF4a1";
const pixelPuffsAddr = "0xEdd8acC6F79330195DA827e4693d1f877e4502Cb";
const vpunksWeaponsAddr = "0x1417e8955D16775B22771402E3F43665b5070975";
const vpunksWeaponsMinter = "0x0496Abb6262cD265Da5515f98D2f336C97A7A447";
const vemojiContract = "0x3aDc46f41467d436614B173A076791dEAdDBD67f";

//
const addressDialog = ref(null);
const addressContract = ref("");
const openAddressDialog = txId => {
  addressDialog.value.open();
  addressContract.value = txId;
};
</script>

<template>
  <div class="account-contract-container">
    <h3 class="app-con-title">VeFam Deployer 01</h3>
    <p style="letter-spacing: 1px">
      Address:
      <el-link
        class="link-type01"
        :underline="false"
        @click.prevent="openAddressDialog(veFamDeployer01)"
      >
        {{ veFamDeployer01 }}
      </el-link>
    </p>

    <!-- <router-link
      to="/account/wallet"
      style="display: flex; justify-content: center"
    >
      <div class="border-linear01 auto-run">
        <el-button class="button-type03" round
          ><IconifyIconOnline
            style="margin-right: 3px; font-size: 20px"
            class="arrow-down"
            icon="emojione-monotone:hammer-and-pick"
          />
          Claim VPU</el-button
        >
      </div>
    </router-link> -->

    <h3 class="app-con-title">VPunks Deployer 01</h3>
    <p style="letter-spacing: 1px">
      Address:
      <el-link
        class="link-type01"
        :underline="false"
        @click.prevent="openAddressDialog(vpunksDeployer01)"
      >
        {{ vpunksDeployer01 }}
      </el-link>
    </p>

    <h3 class="app-con-title">VeFam D-Account Contract</h3>
    <p style="letter-spacing: 1px">
      Address:
      <el-link
        class="link-type01"
        :underline="false"
        @click.prevent="openAddressDialog(dAccountAddr)"
      >
        {{ dAccountAddr }}
      </el-link>
    </p>

    <h3 class="app-con-title">VPunksOG VIP-181 (ERC721)</h3>
    <p style="letter-spacing: 1px">
      Address:
      <el-link
        class="link-type01"
        :underline="false"
        @click.prevent="openAddressDialog(vpunksOgAddr)"
      >
        {{ vpunksOgAddr }}
      </el-link>
    </p>

    <h3 class="app-con-title">Pixel Puffs VIP-181 (ERC721)</h3>
    <p style="letter-spacing: 1px">
      Address:
      <el-link
        class="link-type01"
        :underline="false"
        @click.prevent="openAddressDialog(pixelPuffsAddr)"
      >
        {{ pixelPuffsAddr }}
      </el-link>
    </p>

    <h3 class="app-con-title">VPunks Weapons VIP-210 (ERC1155)</h3>
    <p style="letter-spacing: 1px">
      Address:
      <el-link
        class="link-type01"
        :underline="false"
        @click.prevent="openAddressDialog(vpunksWeaponsAddr)"
      >
        {{ vpunksWeaponsAddr }}
      </el-link>
    </p>

    <h3 class="app-con-title">VPunks Weapons Minter Contract</h3>
    <p style="letter-spacing: 1px">
      Address:
      <el-link
        class="link-type01"
        :underline="false"
        @click.prevent="openAddressDialog(vpunksWeaponsMinter)"
      >
        {{ vpunksWeaponsMinter }}
      </el-link>
    </p>

    <h3 class="app-con-title">VEmoji VIP-210 (ERC1155)</h3>
    <p style="letter-spacing: 1px">
      Address:
      <el-link
        class="link-type01"
        :underline="false"
        @click.prevent="openAddressDialog(vemojiContract)"
      >
        {{ vemojiContract }}
      </el-link>
    </p>

    <AddressDialog
      ref="addressDialog"
      :account-address="addressContract"
      title="View address"
    />
  </div>
</template>

<style lang="scss" scoped>
.account-contract-container {
  text-align: center;
  color: #fff;
  padding-bottom: 100px;
  .app-con-title {
    margin-top: 30px;
  }
  :deep(.border-linear01) {
    width: 120px;
    text-align: center;
  }
  h3 {
    color: #f7f8ff;
    font-weight: bolder;
    font-size: 20px;
  }
  .el-link.link-type01 {
    word-break: break-all;
  }
  .btn-claim {
    margin-top: 10px;
    background: rgba(18, 100, 242, 0.1);
    color: #5190ff;
    border: 1px solid #1264f2;
    border-radius: 10px;
    &:hover {
      color: #74a7ff;
      background-color: #1264f2;
      color: #fff;
      transition: all 0.25s;
    }
  }
}
</style>
