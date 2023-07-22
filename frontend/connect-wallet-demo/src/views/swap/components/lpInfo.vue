<script lang="ts" setup>
import { computed } from "vue";
import BigNumber from "bignumber.js";
import Symbol from "/@/components/Symbol/index.vue";
import Amount from "/@/components/Amount/index.vue";
import * as types from "/@/types";

defineOptions({
  name: "LpInfo"
});
const props = defineProps({
  pairInfo: {
    type: Object as () => types.PairInfo,
    required: true
  }
});
// !computed
const balanceOf = computed((): string => {
  return props.pairInfo.balanceOf as string | "0";
});
const totalSupply = computed((): string => {
  return props.pairInfo.totalSupply as string | "0";
});
const hasLp = computed((): boolean => {
  const b = new BigNumber(balanceOf.value);
  return !(b.isZero() || b.isNaN());
});
const pooledPercent = computed((): BigNumber => {
  return new BigNumber(balanceOf.value).dividedBy(totalSupply.value);
});
const percentStr = computed((): string => {
  const percent = pooledPercent.value.multipliedBy(100);
  return pooledPercent.value.isZero()
    ? "0"
    : percent.lt(0.001)
    ? "< 0.001"
    : percent.toFormat(3);
});
</script>

<template>
  <el-col>
    <el-row justify="space-between">
      <el-col :span="12">
        <Symbol
          :src="pairInfo.imageA"
          :size="22"
          style="margin-right: 5px; display: inline-block"
        />
        <Symbol
          :src="pairInfo.imageB"
          :size="22"
          style="margin-right: 5px; display: inline-block"
        />
        <div class="symbol" style="vertical-align: top; display: inline-block">
          <span>{{ pairInfo.symbolA }}/{{ pairInfo.symbolB }}</span>
        </div>
      </el-col>
      <el-col :span="12" style="text-align: right; line-height: 34px">
        <Amount
          :balance="pairInfo.reserveA"
          :decimals="pairInfo.tkADecimals"
        />/
        <Amount :balance="pairInfo.reserveB" :decimals="pairInfo.tkBDecimals" />
      </el-col>
    </el-row>
    <el-row v-if="hasLp" justify="space-between" style="line-height: 30px">
      <el-col :span="12">Your pool share</el-col>
      <el-col :span="12" style="text-align: right">
        <span>{{ percentStr }}</span
        >%
      </el-col>
    </el-row>
  </el-col>
</template>
