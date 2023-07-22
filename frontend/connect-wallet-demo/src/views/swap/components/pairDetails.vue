<script lang="ts" setup>
import { ref, computed } from "vue";
import BigNumber from "bignumber.js";
import Address from "/@/components/Address/index.vue";
import Amount from "/@/components/Amount/index.vue";
import * as types from "/@/types";
import { emitter } from "/@/utils/mitt";

defineOptions({
  name: "PairDetails"
});
const props = defineProps({
  addr: {
    type: String,
    required: true
  },
  pairInfo: {
    type: Object as () => types.PairInfo,
    required: true
  }
});

const percent = ref(0);

// !computed
const reserveA = computed((): string => {
  return props.pairInfo.reserveA as string | "0";
});
const reserveB = computed((): string => {
  return props.pairInfo.reserveB as string | "0";
});
const totalSupply = computed((): string => {
  return props.pairInfo.totalSupply as string | "0";
});
const balanceOf = computed((): string => {
  return props.pairInfo.balanceOf as string | "0";
});
const hasLp = computed((): boolean => {
  const b = new BigNumber(balanceOf.value);
  return !(b.isZero() || b.isNaN());
});
const pooledPercent = computed((): BigNumber => {
  return new BigNumber(balanceOf.value).dividedBy(totalSupply.value);
});
// emitt event
const addOrRemoveLp = (type: "addLp" | "removeLp"): void => {
  emitter.emit("on-add-remove", type);
};
const percentStr = computed((): string => {
  const percent = pooledPercent.value.multipliedBy(100);
  return pooledPercent.value.isZero()
    ? "0"
    : percent.lt(0.001)
    ? "< 0.001"
    : percent.toFormat(3);
});
const pooledA = computed((): string => {
  return pooledPercent.value.multipliedBy(reserveA.value).toString();
});
const pooledB = computed((): string => {
  return pooledPercent.value.multipliedBy(reserveB.value).toString();
});
</script>

<template>
  <div class="pair-details">
    <el-row justify="spance-between" align="middle">
      <el-col :span="4" class="color-back">
        <slot />
      </el-col>
      <el-col
        :span="16"
        style="
          text-align: center;
          font-size: 20px;
          font-weight: 500;
          color: #cfebff;
        "
        >Pool Details</el-col
      >
    </el-row>

    <el-card shadow="never" class="pool-details">
      <template #header>
        <div>
          <span style="font-weight: 500; color: #cfebff"
            >{{ pairInfo.symbolA }}/{{ pairInfo.symbolB }}</span
          >
        </div>
      </template>
      <el-row justify="space-between">
        <el-col :span="12">Pool address</el-col>
        <el-col :span="12" style="text-align: right">
          <el-link
            target="_blank"
            :href="`${$explore}accounts/${pairInfo.address}`"
            ><Address :addr="pairInfo.address"
          /></el-link>
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="12"
          >{{
            pairInfo.symbolA === "VET"
              ? `w${pairInfo.symbolA}`
              : pairInfo.symbolA
          }}
          address</el-col
        >
        <el-col :span="12" style="text-align: right">
          <el-link
            target="_blank"
            :href="`${$explore}accounts/${pairInfo.tokenA}`"
            ><Address :addr="pairInfo.tokenA"
          /></el-link>
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="12"
          >{{
            pairInfo.symbolB === "VET"
              ? `w${pairInfo.symbolB}`
              : pairInfo.symbolB
          }}
          address</el-col
        >
        <el-col :span="12" style="text-align: right">
          <el-link
            target="_blank"
            :href="`${$explore}accounts/${pairInfo.tokenB}`"
            ><Address :addr="pairInfo.tokenB"
          /></el-link>
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="12">Pool {{ pairInfo.symbolA }}</el-col>
        <el-col :span="12" style="text-align: right">
          <Amount :balance="reserveA" :decimals="pairInfo.tkADecimals" />
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="12">Pool {{ pairInfo.symbolB }}</el-col>
        <el-col :span="12" style="text-align: right">
          <Amount :balance="reserveB" :decimals="pairInfo.tkBDecimals" />
        </el-col>
      </el-row>
      <el-row v-if="hasLp" justify="space-between">
        <el-col :span="12">Your {{ pairInfo.symbolA }}</el-col>
        <el-col :span="12" style="text-align: right">
          <Amount :balance="pooledA" :decimals="pairInfo.tkADecimals" />
        </el-col>
      </el-row>
      <el-row v-if="hasLp" justify="space-between">
        <el-col :span="12">Your {{ pairInfo.symbolB }}</el-col>
        <el-col :span="12" style="text-align: right">
          <Amount :balance="pooledB" :decimals="pairInfo.tkBDecimals" />
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="12">LP token supply</el-col>
        <el-col :span="12" style="text-align: right">
          <Amount :balance="totalSupply" :decimals="18" />
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="12">Your LP tokens</el-col>
        <el-col :span="12" style="text-align: right">
          <Amount :balance="balanceOf" :decimals="18" />
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="12">Your pool share</el-col>
        <el-col :span="12" style="text-align: right; color: #14c930">
          <span>{{ percentStr }}</span
          >%
        </el-col>
      </el-row>
    </el-card>

    <div style="margin: 25px 0 0 0">
      <el-row v-if="!hasLp" style="margin-top: 20px" justify="center">
        <el-button
          v-if="!addr"
          class="width100per"
          type="primary"
          round
          @click="emitter.emit('connectWallet', '')"
          >Connect Wallet</el-button
        >
        <el-button
          v-else
          class="custom-btn-connect"
          type="primary"
          round
          @click="addOrRemoveLp('addLp')"
          >Join {{ pairInfo.symbolA }}/{{ pairInfo.symbolB }} Pool</el-button
        >
      </el-row>
      <el-row
        v-if="hasLp"
        :gutter="20"
        style="margin-top: 20px"
        justify="center"
      >
        <el-col :span="12" :xs="12" :sm="12">
          <el-button
            class="custom-btn-connect"
            round
            @click="addOrRemoveLp('addLp')"
            >Add</el-button
          >
        </el-col>
        <el-col :span="12" :xs="12" :sm="12">
          <el-button
            class="custom-btn-remove"
            round
            @click="addOrRemoveLp('removeLp')"
            >Remove</el-button
          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss">
.pair-details {
  .el-card__header,
  .el-card__body {
    border: 0;
  }
}
@media only screen and (max-width: 500px) {
  .pair-details {
    .el-card__header,
    .el-card__body {
      padding: 10px;
    }
  }
}
</style>

<style lang="scss" scoped>
.pair-details {
  .el-card {
    border-radius: 20px;
    margin-top: 20px;
    box-shadow: 0px 1px 10px #2078ffc2;
    border: 0;
    background: inherit !important;
    padding: 10px;
    color: #5cc0ff;
  }
  .pool-details {
    .el-link {
      font-size: 16px;
      text-decoration: none;
      &--default {
        color: #b2c8f4;
      }
    }
    .el-row {
      margin-top: 10px;
    }
  }
}

@media screen and (max-width: 374px) {
  .pair-details .el-card {
    padding: 10px 0;
  }
}
</style>
