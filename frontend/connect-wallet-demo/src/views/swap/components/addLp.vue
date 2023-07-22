<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useGlobal } from "@pureadmin/utils";
// import { Connex } from "@vechain/connex";
import BigNumber from "bignumber.js";
import Symbol from "/@/components/Symbol/index.vue";
import Amount from "/@/components/Amount/index.vue";
import TxInfoDialog from "/@/components/TxInfoDialog/index.vue";
import TokenListDialog from "/@/components/TokenListDialog/index.vue";

import ERC20 from "/@/contractCall/ERC20";
// import SwapV2Factory from "/@/contractCall/swapV2Factory";
import SwapV2Router01 from "/@/contractCall/swapV2Router01";
import SwapV2Router03 from "/@/contractCall/swapV2Router03";
import * as types from "/@/types";
import { useUserStoreHook } from "/@/store/modules/user";
import { useAppStoreHook } from "/@/store/modules/app";
import {
  /* fromWei,*/ toWei,
  formatFloatNumber,
  estimateGas,
  calcFee
} from "/@/utils/connex";
const { $connex } = useGlobal<GlobalPropertiesApi>();

defineOptions({
  name: "AddLP"
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
  pairSelected: {
    type: Object as () => types.PairInfo,
    required: true
  }
});
// variables
const debug = ref(false);
const timer = ref(0);
const input_AError = ref("");
const input_BError = ref("");
const submitLabel = ref("");
const disableBtn = ref(false);
const loadingBtn = ref(false);
const pairError = ref(false);
const receiveRatioMin = ref(0.95);
// token input group [0, 1]
const inputA = ref(null as unknown as string);
const inputB = ref(null as unknown as string);
const tokenItemA = ref({} as types.TokenDetails);
const tokenItemB = ref({} as types.TokenDetails);
const pairInfo = ref({} as types.PairInfo);
let $addr0 = "0x0000000000000000000000000000000000000000";
const txdialog = ref(null);
const tlDialog = ref(null);
const typeTx = ref("");
/*
const myAddr = computed(() => {
  return useUserStoreHook().dAccount.myAddr;
});

const myVET = computed(() => {
  return useUserStoreHook().dAccount.VET;
});
const myVTHO = computed(() => {
  return useUserStoreHook().dAccount.VTHO;
});
*/
/*
VUE_APP_FACTORY=0x8150e744Ccf61c73A8e8084CEA778A2656cc9241
VUE_APP_ROUTER01=0xDEF9964c68Be77f54b7416AD3b302E9cAd3Ad87E
VUE_APP_ROUTER03=0xEB28200F2860dC72E6c7A7EcfdE9258E50b78Bdc
VUE_APP_VTHO=0x0000000000000000000000000000456E65726779

const $swapV2Factory = new SwapV2Factory(
  "0x8150e744Ccf61c73A8e8084CEA778A2656cc9241",
  $connex
);
const $swapV2Router01 = new SwapV2Router01(
  "0xDEF9964c68Be77f54b7416AD3b302E9cAd3Ad87E",
  $connex
);
const $swapV2Router03 = new SwapV2Router03(
  "0xEB28200F2860dC72E6c7A7EcfdE9258E50b78Bdc",
  $connex
);
*/

const $swapV2Router01 = new SwapV2Router01(
  "0xDEF9964c68Be77f54b7416AD3b302E9cAd3Ad87E",
  $connex
);
const $swapV2Router03 = new SwapV2Router03(
  "0xEB28200F2860dC72E6c7A7EcfdE9258E50b78Bdc",
  $connex
);

// TxInfoDialog
const contents = ref([] as types.ItemBase0[]);

// TokenListDialog
const tokenListActionType = ref("tokenInputA" as "tokenInputA" | "tokenInputB");

// !computed
const tokenList = computed(() => {
  return useAppStoreHook().tokenList;
});
const balanceOfA = computed((): string => {
  if (tokenItemA.value) {
    const k = tokenList.value.find(item => {
      return item.address === tokenItemA.value.address;
    });
    if (k && k.balanceOf) return k.balanceOf;
  }
  return "";
});
const balanceOfB = computed((): string => {
  if (tokenItemB.value) {
    const k = tokenList.value.find(item => {
      return item.address === tokenItemB.value.address;
    });
    if (k && k.balanceOf) return k.balanceOf;
  }
  return "";
});
const energy = computed((): string => {
  return useUserStoreHook().dAccount.VTHO;
});
const ratio = computed((): BigNumber => {
  if (pairInfo.value && pairInfo.value.reserveA && pairInfo.value.reserveB) {
    return new BigNumber(pairInfo.value.reserveB)
      .div(`1e${pairInfo.value.tkBDecimals}`)
      .div(
        new BigNumber(pairInfo.value.reserveA).div(
          `1e${pairInfo.value.tkADecimals}`
        )
      );
  }
  return new BigNumber(0);
});

// !method
const setPairInfo = (pair?: string): void => {
  debug.value && console.log("setPairInfo->pair", pair);
  if (pair) pairInfo.value.address = pair;
  pairInfo.value.tokenA = tokenItemA.value.address;
  pairInfo.value.tokenB = tokenItemB.value.address;
  pairInfo.value.symbolA = tokenItemA.value.symbol;
  pairInfo.value.symbolB = tokenItemB.value.symbol;
  pairInfo.value.imageA = tokenItemA.value.logoURI;
  pairInfo.value.imageB = tokenItemB.value.logoURI;
  pairInfo.value.tkADecimals = tokenItemA.value.decimals;
  pairInfo.value.tkBDecimals = tokenItemB.value.decimals;
  if (pair === $addr0) {
    pairInfo.value.reserveA = "";
    pairInfo.value.reserveB = "";
    pairInfo.value.totalSupply = "";
    pairInfo.value.balanceOf = "";
  }
  debug.value && console.log("---------- setPairInfo->pairInfo", pairInfo);
};

async function getPairInfo(): Promise<void> {
  debug.value && console.log("getPairInfo");
  loadingBtn.value = true;
  submitLabel.value = "";
  $swapV2Router03
    .getPairInfoByTokens(
      [tokenItemA.value.address],
      [tokenItemB.value.address],
      (props.addr as string) || $addr0
    )
    .then(reserveResults => {
      debug.value && console.log("getPairInfoByTokens", reserveResults);
      if (reserveResults.pairs[0] === $addr0) {
        if (props.addr) submitLabel.value = "Add new Pool";
        pairError.value = true;
      } else {
        submitLabel.value = props.addr ? "Add" : "Connect Wallet";
        pairError.value = false;
      }
      pairInfo.value.address = reserveResults.pairs[0];
      pairInfo.value.reserveA = reserveResults.reservesA[0];
      pairInfo.value.reserveB = reserveResults.reservesB[0];
      pairInfo.value.totalSupply = reserveResults.supplies[0];
      pairInfo.value.balanceOf = reserveResults.balances[0];
      debug.value && console.log("---------- getPairInfo->pairInfo", pairInfo);
      loadingBtn.value = false;
    })
    .catch(e => {
      console.log("getPairInfoByTokens error", e);
      loadingBtn.value = false;
    });
}

const showTokenListDialog = (action: "tokenInputA" | "tokenInputB"): void => {
  tokenListActionType.value = action;
  // const tlDialog = $refs.tlDialog as typeof TokenListDialog;
  tlDialog.value.open("addLp", "Select A Token", [
    tokenItemA.value.address,
    tokenItemB.value.address
  ]);
};

const tokenChange = (item: types.TokenDetails): void => {
  if (loadingBtn.value) return;
  inputA.value = "";
  inputB.value = "";
  //
  if (tokenListActionType.value === "tokenInputA") {
    tokenItemA.value = Object.assign({}, item);
  } else {
    tokenItemB.value = Object.assign({}, item);
  }
  //
  // ($refs.tlDialog as typeof TokenListDialog).close();
  tlDialog.value.close();
  resetError();
  setPairInfo($addr0);
  getPairInfo();
};

const onSuccessed = () => {
  props.onSuccess();
};
function resetError(): void {
  input_AError.value = "";
  input_BError.value = "";
}
const isRequired = (): boolean => {
  input_AError.value = !inputA.value ? "Required" : "";
  input_BError.value = !inputB.value ? "Required" : "";

  return !(input_AError.value || input_BError.value);
};

const validateNumber = (): boolean => {
  const _inputA = new BigNumber(inputA.value);
  const _inputB = new BigNumber(inputB.value);

  input_AError.value =
    _inputA.isNaN() || _inputA.isZero() ? "Invalid number" : "";
  input_BError.value =
    _inputB.isNaN() || _inputB.isZero() ? "Invalid number" : "";

  return !(input_AError.value || input_BError.value);
};
const validateRange = (): boolean => {
  const _inputA = new BigNumber(inputA.value);
  const _inputB = new BigNumber(inputB.value);
  input_AError.value = _inputA.isGreaterThan(
    new BigNumber(balanceOfA.value).div(`1e${tokenItemA.value.decimals}`)
  )
    ? "Insufficient balance"
    : "";
  input_BError.value = _inputB.isGreaterThan(
    new BigNumber(balanceOfB.value).div(`1e${tokenItemB.value.decimals}`)
  )
    ? "Insufficient balance"
    : "";

  debug.value && console.log("input_AError", input_AError, input_BError);
  return !(input_AError.value || input_BError);
};

function validate(): boolean {
  if (!isRequired() || !validateNumber() || !validateRange()) {
    return false;
  }
  return true;
}

const onChange = (action: "amountA" | "amountB"): void => {
  if (action === "amountA") {
    inputA.value = formatFloatNumber(
      inputA.value,
      tokenItemA.value.decimals,
      20
    );
  } else {
    inputB.value = formatFloatNumber(
      inputB.value,
      tokenItemB.value.decimals,
      20
    );
  }
  resetError();
  if (timer.value) {
    window.clearTimeout(timer.value);
    timer.value = 0;
  }
  if (
    !pairInfo.value ||
    !pairInfo.value.address ||
    pairInfo.value.address === $addr0
  )
    return;
  //
  timer.value = window.setTimeout(() => {
    loadingBtn.value = true;
    if (action === "amountA" && inputA) {
      const temp = ratio.value.multipliedBy(inputA.value);
      if (temp.isLessThan(1)) {
        inputB.value = new BigNumber(temp.toPrecision(6, 1)).toFixed();
      } else {
        inputB.value = temp.toFixed(2, 1);
      }
    } else if (action === "amountB" && inputB) {
      const temp = new BigNumber(inputB.value).div(ratio.value);
      if (temp.isLessThan(1)) {
        inputA.value = new BigNumber(temp.toPrecision(6, 1)).toFixed();
      } else {
        inputA.value = temp.toFixed(2, 1);
      }
    }
    loadingBtn.value = false;
  }, 300);
};
async function onSubmit(): Promise<void> {
  if (!props.addr) return;
  typeTx.value = "add";
  txdialog.value.open();
  validate();

  // if (!props.addr || !validate()) {
  //   return;
  // }
  if (!validate()) return;

  // kiểm tra gas
  const vthoLocation =
    tokenItemA.value.symbol === "VTHO"
      ? 0
      : tokenItemB.value.symbol === "VTHO"
      ? 1
      : -1;
  const vtho = new BigNumber(energy.value).div(1e18);
  const inputVtho = vthoLocation === 0 ? inputA : inputB;
  if (vthoLocation >= 0 && vtho.minus(8).lt(inputVtho.value)) {
    // giả sử phí giao dịch tối đa 8 VTHO
    loadingBtn.value = true;
    const estGas = await estimateGas(
      $connex.thor,
      getClauses(),
      0,
      props.addr,
      props.addr
    );
    loadingBtn.value = false;
    const fee = calcFee(estGas.gas, estGas.baseGasPrice, 50).div(1e18);
    // console.log('fee', fee.toString())
    if (fee.plus(inputVtho.value).isGreaterThan(vtho)) {
      // isGreaterThan<=>gt: >
      const mss = `Max ${vtho.minus(fee).toFixed(3, 1)} allowed`;
      if (vthoLocation === 0) {
        input_AError.value = mss;
      } else {
        input_BError.value = mss;
      }
      return;
    }
  }

  contents.value = [
    {
      token: tokenItemA.value.symbol,
      logoURI: tokenItemA.value.logoURI,
      amount: new BigNumber(inputA.value).toString(10)
    },
    {
      token: tokenItemB.value.symbol,
      logoURI: tokenItemB.value.logoURI,
      amount: new BigNumber(inputB.value).toString(10)
    }
  ];
  console.log("token-----------", contents.value);
  // txdialog.value.open();
}
const getClauses = () => {
  const clauses: Connex.Vendor.TxMessage = [];
  const deadline = ((Date.now() + 900000) / 1000).toFixed(0); // add: 900s <-> 15m
  const _inputA = new BigNumber(inputA.value);
  const _inputB = new BigNumber(inputB.value);
  const inputAWei = toWei(inputA.value.toString(), pairInfo.value.tkADecimals);
  const inputBWei = toWei(inputB.value.toString(), pairInfo.value.tkBDecimals);
  const inputAWeiMin = toWei(
    _inputA.multipliedBy(receiveRatioMin.value).toString(),
    pairInfo.value.tkADecimals
  );
  const inputBWeiMin = toWei(
    _inputB.multipliedBy(receiveRatioMin.value).toString(),
    pairInfo.value.tkBDecimals
  );
  const vetLocation =
    pairInfo.value.symbolA === "VET"
      ? "A"
      : pairInfo.value.symbolB === "VET"
      ? "B"
      : "";
  //
  /*
      console.log('------ ggg', inputB.multipliedBy(receiveRatioMin).toString())
      console.log('------ inputAWei', inputAWei)
      console.log('------ inputBWei', inputBWei)
      console.log('------ inputAWeiMin', inputAWeiMin)
      console.log('------ inputBWeiMin', inputBWeiMin)*/
  //

  if (vetLocation !== "A") {
    const mss = `Approve for ${inputA.value.toString()} ${
      pairInfo.value.symbolA
    } transfer`;
    clauses.push(
      new ERC20(pairInfo.value.tokenA, $connex).approve(
        $swapV2Router01.address,
        inputAWei,
        mss
      )
    );
  }
  if (vetLocation !== "B") {
    const mss = `Approve for ${inputB.value.toString()} ${
      pairInfo.value.symbolB
    } transfer`;
    clauses.push(
      new ERC20(pairInfo.value.tokenB, $connex).approve(
        $swapV2Router01.address,
        inputBWei,
        mss
      )
    );
  }
  // const appr = $vtho.approve($swapV2Router01.address, toWei(inputB))
  /*
        uint value
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountVETMin,
        address to,
        uint deadline
      */
  if (vetLocation === "A") {
    clauses.push(
      $swapV2Router01.addLiquidityVET(
        inputAWei,
        pairInfo.value.tokenB,
        inputBWei,
        inputBWeiMin,
        inputAWeiMin,
        props.addr,
        deadline
      )
    );
  } else if (vetLocation === "B") {
    clauses.push(
      $swapV2Router01.addLiquidityVET(
        inputBWei,
        pairInfo.value.tokenA,
        inputAWei,
        inputAWeiMin,
        inputBWeiMin,
        props.addr,
        deadline
      )
    );
  } else {
    /*
        tokenA: string,
        tokenB: string,
        amountADesired: string,
        amountBDesired: string,
        amountAMin: string,
        amountBMin: string,
        to: string,
        deadline: string
        */
    clauses.push(
      $swapV2Router01.addLiquidity(
        pairInfo.value.tokenA,
        pairInfo.value.tokenB,
        inputAWei,
        inputBWei,
        inputAWeiMin,
        inputBWeiMin,
        props.addr,
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
    inputA.value = "";
    inputB.value = "";
  }
}
//
onMounted(() => {
  debug.value && console.log("---------- AddLP Component", "created");
  debug.value && console.log("---------- created->pairInfo", pairInfo);
  debug.value &&
    console.log("---------- created->pairSelected", props.pairSelected);

  //
  debug.value && console.log("tokenList", tokenList);
  if (
    props.pairSelected &&
    props.pairSelected.tokenA &&
    props.pairSelected.tokenB
  ) {
    tokenItemA.value = tokenList.value.find(item => {
      return (
        item.address.toLowerCase() === props.pairSelected.tokenA.toLowerCase()
      );
    }) as types.TokenDetails;
    tokenItemB.value = tokenList.value.find(item => {
      return (
        item.address.toLowerCase() === props.pairSelected.tokenB.toLowerCase()
      );
    }) as types.TokenDetails;
  }
  if (!tokenItemA.value.symbol || !tokenItemB.value.symbol) {
    if (tokenList.value && tokenList.value.length > 0) {
      tokenItemA.value = Object.assign({}, tokenList.value[0]);
      tokenItemB.value = Object.assign({}, tokenList.value[1]);
      // this.checkBalanceOf()
    }
  }
  setPairInfo();
  getPairInfo();
});
</script>
<template>
  <el-form
    class="add-lp-form"
    label-position="top"
    @submit.stop.prevent="function () {}"
  >
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
        >Add Liquidity</el-col
      >
    </el-row>
    <el-form-item
      :error="input_AError"
      :show-message="!!input_AError"
      class="grey-form-item"
      style="margin-top: 20px"
    >
      <template #label>
        Balance:
        <Amount
          :balance="balanceOfA"
          :decimals="tokenItemA.decimals"
          :format="3"
        />
      </template>

      <!-- token input group 0 -->
      <el-input
        v-model="inputA"
        :readonly="loadingBtn"
        placeholder="0.0"
        @input="onChange('amountA')"
      />
      <button
        class="button-token-group"
        @click="showTokenListDialog('tokenInputA')"
      >
        <el-row class="button-token-row" justify="middle" align="middle">
          <Symbol class="token-avatar1" :src="tokenItemA.logoURI" />
          <span :span="12"
            >{{ tokenItemA.symbol }}
            <el-icon><ArrowDownBold /></el-icon>
          </span>
        </el-row>
      </button>
      <!-- end: token input group 0 -->
    </el-form-item>

    <el-row justify="center">
      <el-icon :size="20">
        <Plus />
      </el-icon>
    </el-row>

    <el-form-item
      :error="input_BError"
      :show-message="!!input_BError"
      class="grey-form-item"
      style="margin-top: 10px"
    >
      <template #label>
        Balance:
        <Amount
          :balance="balanceOfB"
          :decimals="tokenItemB.decimals"
          :format="3"
        />
      </template>

      <!-- token input group 1 -->
      <el-input
        v-model="inputB"
        :readonly="loadingBtn"
        placeholder="0.0"
        @input="onChange('amountB')"
      />
      <button
        class="button-token-group"
        @click="showTokenListDialog('tokenInputB')"
      >
        <el-row class="button-token-row" justify="middle" align="middle">
          <Symbol class="token-avatar1" :src="tokenItemB.logoURI" />
          <span :span="12"
            >{{ tokenItemB.symbol }}
            <el-icon><ArrowDownBold /></el-icon>
          </span>
        </el-row>
      </button>
      <!-- end: token input group 1 -->
    </el-form-item>

    <el-form-item v-if="!pairError" style="padding-left: 10px; color: #f6c9c9"
      >Ratio: {{ ratio.precision(6) }} {{ tokenItemB.symbol }} per
      {{ tokenItemA.symbol }}</el-form-item
    >
    <div v-else class="new-pool-note">
      <p><b>You are the first liquidity provider.</b></p>
      <p>The ratio of tokens you add will set the price of this pool.</p>
      <p>Once you are happy with the rate click supply to review.</p>
    </div>

    <el-form-item style="margin-top: 20px">
      <el-button
        :loading="loadingBtn"
        class="custom-btn-connect"
        native-type="submit"
        round
        @click="onSubmit"
      >
        {{ submitLabel }}
      </el-button>
    </el-form-item>

    <TokenListDialog ref="tlDialog" @on-select="tokenChange" />
    <TxInfoDialog
      ref="txdialog"
      :type="typeTx"
      :contents="contents"
      :on-confirm="onConfirm"
      @successed="onSuccessed"
    />
  </el-form>
</template>

<style lang="scss" scoped>
// input
:deep(.el-input__wrapper) {
  background-color: transparent;
}
// end input----
.new-pool-note {
  border-radius: 20px;
  border: 1px solid #712181;
  padding: 0 10px;
  color: #f6c9c9;
}
</style>
