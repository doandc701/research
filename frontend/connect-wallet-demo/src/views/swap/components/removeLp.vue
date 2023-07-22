<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useGlobal } from "@pureadmin/utils";
import { Connex } from "@vechain/connex";
import BigNumber from "bignumber.js";
import SwapV2Pair from "/@/contractCall/swapV2Pair";
import SwapV2Router01 from "/@/contractCall/swapV2Router01";
import Amount from "/@/components/Amount/index.vue";
import TxInfoDialog from "/@/components/TxInfoDialog/index.vue";
import * as types from "/@/types";
const { $connex } = useGlobal<GlobalPropertiesApi>();

defineOptions({
  name: "RemoveLp"
});
const props = defineProps({
  onSuccess: {
    type: Function,
    required: true
  },
  addr: {
    type: String,
    required: true
  },
  pairInfo: {
    type: Object as () => types.PairInfo,
    required: true
  }
});

// variables
const debug = ref(false);
const percent = ref(0);
const receiveRatioMin = ref(0.97);
const confirmMsg = ref("");
const contents = ref([] as types.ItemBase0[]);
const $swapV2Router01 = new SwapV2Router01(
  "0xDEF9964c68Be77f54b7416AD3b302E9cAd3Ad87E",
  $connex
);
const innerWidth = ref();
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
const bigPercent = computed((): string => {
  return new BigNumber(percent.value).dividedBy(100).toString();
});
const pooledPercent = computed((): BigNumber => {
  return new BigNumber(balanceOf.value).dividedBy(totalSupply.value);
});
const receiveTokenA = computed((): string => {
  return pooledPercent.value
    .multipliedBy(reserveA.value)
    .multipliedBy(bigPercent.value)
    .toString();
});
const receiveTokenB = computed((): string => {
  return pooledPercent.value
    .multipliedBy(reserveB.value)
    .multipliedBy(bigPercent.value)
    .toString();
});
const minTokenA = computed((): string => {
  return new BigNumber(receiveTokenA.value)
    .div(`1e${props.pairInfo.tkADecimals}`)
    .multipliedBy(receiveRatioMin.value)
    .toFixed(3);
});
const minTokenB = computed((): string => {
  return new BigNumber(receiveTokenB.value)
    .div(`1e${props.pairInfo.tkBDecimals}`)
    .multipliedBy(receiveRatioMin.value)
    .toFixed(3);
});

onMounted(() => {
  debug.value && console.log("---------- RemoveLp Component", "created");
  debug.value && console.log("---------- created->pairInfo", props.pairInfo);
});

// !method
const onSuccessed = () => {
  onSuccessed();
};
const onSubmit = () => {
  debug.value && console.log("this.receiveTokenA", receiveTokenA.value);
  debug.value && console.log("this.receiveTokenB", receiveTokenB.value);
  debug.value && console.log("this.minTokenA", minTokenA.value);
  debug.value && console.log("this.minTokenB", minTokenB.value);

  confirmMsg.value = `Output is estimated. You will receive at least ${minTokenA.value} ${props.pairInfo.symbolA} and at least ${minTokenB.value} ${props.pairInfo.symbolB} or the transaction will revert.`;
  contents.value = [
    {
      token: props.pairInfo.symbolA,
      logoURI: props.pairInfo.imageA,
      amount: new BigNumber(receiveTokenA.value)
        .div(`1e${props.pairInfo.tkADecimals}`)
        .toFixed(3)
    },
    {
      token: props.pairInfo.symbolB,
      logoURI: props.pairInfo.imageB,
      amount: new BigNumber(receiveTokenB.value)
        .div(`1e${props.pairInfo.tkBDecimals}`)
        .toFixed(3)
    }
  ];
  // (this.$refs.txdialog as typeof TxInfoDialog).open();
};
const getClauses = () => {
  const clauses: Connex.Vendor.TxMessage = [];
  const deadline = ((Date.now() + 900000) / 1000).toFixed(); // add: 900s <-> 15m
  const balance = new BigNumber(balanceOf.value)
    .multipliedBy(bigPercent.value)
    .toFixed(0, 1);
  const tokenAWeiMin = new BigNumber(receiveTokenA.value)
    .multipliedBy(receiveRatioMin.value)
    .toFixed(0, 1);
  const tokenBWeiMin = new BigNumber(receiveTokenB.value)
    .multipliedBy(receiveRatioMin.value)
    .toFixed(0, 1);
  // debug.value && console.log('---------- pairInfo.value', pairInfo.value)
  clauses.push(
    new SwapV2Pair(props.pairInfo.address, $connex).approve(
      $swapV2Router01.address,
      balanceOf.value
    )
  );
  if (props.pairInfo.symbolA === "VET" || props.pairInfo.symbolB === "VET") {
    const tokenAddr =
      props.pairInfo.symbolA === "VET"
        ? props.pairInfo.tokenB
        : props.pairInfo.tokenA;
    const amountTokenMin =
      props.pairInfo.symbolA === "VET" ? tokenBWeiMin : tokenAWeiMin;
    const amountVETMin =
      props.pairInfo.symbolA === "VET" ? tokenAWeiMin : tokenBWeiMin;
    clauses.push(
      $swapV2Router01.removeLiquidityVET(
        tokenAddr, // token
        balance, // liquidity
        amountTokenMin, // amountTokenMin
        amountVETMin, // amountVETMin
        props.addr, // to
        deadline
      )
    );
  } else {
    clauses.push(
      $swapV2Router01.removeLiquidity(
        props.pairInfo.tokenA, // tokenA
        props.pairInfo.tokenB, // tokenB
        balance, // liquidity
        tokenAWeiMin, // amountAMin
        tokenBWeiMin, // amountBMin
        props.addr, // to
        deadline
      )
    );
  }
  return clauses;
};
async function onConfirm(): Promise<Connex.Vendor.TxResponse | void | unknown> {
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("timeout"));
    }, 50000);
  });

  try {
    const clauses = getClauses();
    return Promise.race([
      myPromise,
      $connex.vendor.sign("tx", clauses).signer(props.addr).request()
    ]);
  } catch (error) {
    console.log(error);
  } finally {
    percent.value = 0;
  }
}
</script>

<template>
  <el-form class="remove-lp-form" @submit.stop.prevent="onSubmit">
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
      >
        Remove {{ pairInfo.symbolA }}/{{ pairInfo.symbolB }} Liquidity
      </el-col>
    </el-row>
    <div
      style="
        margin: 20px 0 10px;
        font-size: 60px;
        font-weight: 600;
        color: #cfebff;
      "
    >
      <span>{{ percent }}%</span>
    </div>
    <el-slider
      v-model="percent"
      :show-tooltip="false"
      style="margin: 20px 0 30px 0"
    />

    <el-row v-if="innerWidth.value > 500" justify="space-between">
      <el-col :span="6" style="text-align: center">
        <el-radio v-model="percent" border :label="25" size="small"
          >25%</el-radio
        >
      </el-col>
      <el-col :span="6" style="text-align: center">
        <el-radio v-model="percent" border :label="50" size="small"
          >50%</el-radio
        >
      </el-col>
      <el-col :span="6" style="text-align: center">
        <el-radio v-model="percent" border :label="75" size="small"
          >75%</el-radio
        >
      </el-col>
      <el-col :span="6" style="text-align: center">
        <el-radio v-model="percent" border :label="100" size="small"
          >100%</el-radio
        >
      </el-col>
    </el-row>

    <div v-else style="text-align: center">
      <el-radio-group v-model="percent" size="small">
        <el-radio-button :label="25">25%</el-radio-button>
        <el-radio-button :label="50">50%</el-radio-button>
        <el-radio-button :label="75">75%</el-radio-button>
        <el-radio-button :label="100">100%</el-radio-button>
      </el-radio-group>
    </div>

    <el-card shadow="never">
      <template #header>
        <strong>You will receive</strong>
      </template>
      <el-row justify="space-between" style="margin-bottom: 5px">
        <el-col :span="6">{{ pairInfo.symbolA }}</el-col>
        <el-col :span="16" style="text-align: right">
          <Amount :balance="receiveTokenA" :decimals="pairInfo.tkADecimals" />
        </el-col>
      </el-row>
      <el-row justify="space-between">
        <el-col :span="6">{{ pairInfo.symbolB }}</el-col>
        <el-col :span="16" style="text-align: right">
          <Amount :balance="receiveTokenB" :decimals="pairInfo.tkBDecimals" />
        </el-col>
      </el-row>
    </el-card>
    <el-form-item style="text-align: center; margin-top: 20px">
      <el-button
        :disabled="!percent"
        class="custom-btn-remove"
        native-type="submit"
        round
        >Remove</el-button
      >
    </el-form-item>
    <TxInfoDialog
      ref="txdialog"
      :confirm-msg="confirmMsg"
      type="remove"
      :contents="contents"
      :on-confirm="onConfirm"
      @successed="onSuccessed"
    />
  </el-form>
</template>

<style lang="scss">
.remove-lp-form {
  .el-card__header,
  .el-card__body {
    border: 0;
    padding: 10px;
  }
  .el-radio-button__original-radio:checked + .el-radio-button__inner {
    border-radius: 10px !important;
  }
}
</style>

<style lang="scss" scoped>
.remove-lp-form {
  .el-card {
    margin-top: 20px;
    border: 0;
    background: inherit !important;
    padding: 10px;
    color: #5cc0ff;
  }

  .el-radio {
    color: #ffff;
  }
  .el-radio__input {
    display: none;
  }
  .el-radio.is-bordered {
    padding: 6px 10px 0 10px;
    .el-radio__label {
      padding-left: 0;
    }
  }

  .el-radio-group {
    border-radius: 20px;
    background: #0002;
  }
}

@media screen and (max-width: 374px) {
  .remove-lp-form .el-card {
    padding: 10px 0;
  }
}
</style>
