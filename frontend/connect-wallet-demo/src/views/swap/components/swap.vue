<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useGlobal } from "@pureadmin/utils";
import Connex from "@vechain/connex";
import BigNumber from "bignumber.js";
import {
  toWei,
  formatFloatNumber,
  estimateGas,
  calcFee
} from "/@/utils/connex";
import ERC20 from "/@/contractCall/ERC20";
import SwapV2Router03 from "/@/contractCall/swapV2Router03";
import SwapV2Router01 from "/@/contractCall/swapV2Router01";
import Symbol from "/@/components/Symbol/index.vue";
import Amount from "/@/components/Amount/index.vue";
import TxInfoDialog from "/@/components/TxInfoDialog/index.vue";
import TokenListDialog from "/@/components/tokenListDialog.vue";
// import { swapStore } from "/@/store/modules/swap";
import * as types from "/@/types";
import { useAppStoreHook } from "/@/store/modules/app";
import { useUserStoreHook } from "/@/store/modules/user";
import { emitter } from "/@/utils/mitt";
const { $connex } = useGlobal<GlobalPropertiesApi>();

const props = defineProps({
  addr: String
});
// variables
const debug = ref(false);
// const swapStore = swapStore();

// const viewDialogEl = ref(null);
const tlDialog = ref(null);
const typeTx = ref("");
const txdialog = ref(null);

//
const timer = ref(0);
const input_AError = ref("");
const input_BError = ref("");
const submitLabel = ref("");
const disableBtn = ref(false);
const loadingBtn = ref(false);
const amountChange = ref(false);
const pairError = ref(false);
const inputA = ref(null as unknown as string);
const inputB = ref(null as unknown as string);
// EFET: swapETHForExactTokens, EEFT: swapExactETHForTokens, TFEE: swapTokensForExactETH, ETFE: swapExactTokensForETH
// TFET: swapTokensForExactTokens, ETFT: swapExactTokensForTokens
const contractName = ref(
  "EFET" as unknown as "EFET" | "EEFT" | "TFEE" | "ETFE" | "TFET" | "ETFT"
);
const tolerance = ref(0.005);
const tokenItemA = ref({} as types.TokenDetails);
const tokenItemB = ref({} as types.TokenDetails);
const pairInfo = ref({} as types.PairInfo);

// TxInfoDialog
const confirmMsg = ref("");
const contents = ref([] as types.ItemBase0[]);

// TokenListDialog
const tokenListActionType = ref("tokenInputA" as "tokenInputA" | "tokenInputB");
const currentItemAddress = ref("");
const otherItemAddress = ref("");
let $addr0: string;

const $swapV2Router01 = new SwapV2Router01(
  "0xDEF9964c68Be77f54b7416AD3b302E9cAd3Ad87E",
  $connex
);
const $swapV2Router03 = new SwapV2Router03(
  "0xEB28200F2860dC72E6c7A7EcfdE9258E50b78Bdc",
  $connex
);

const myAddr = computed(() => {
  return useUserStoreHook().dAccount.myAddr;
});

// !computed
const tokenList = computed(() => {
  return useAppStoreHook().tokenList;
});

const balanceOfFrom = computed((): string => {
  if (tokenItemA.value) {
    const k = tokenList.value.find((item: types.TokenDetails) => {
      return item.address === tokenItemA.value.address;
    });
    if (k && k.balanceOf) return k.balanceOf;
  }
  return "";
});
const balanceOfTo = computed((): string => {
  if (tokenItemB.value) {
    const k = tokenList.value.find((item: types.TokenDetails) => {
      return item.address === tokenItemB.value.address;
    });
    if (k && k.balanceOf) return k.balanceOf;
  }
  return "";
});
const maxAmountPay = computed((): string => {
  return new BigNumber(balanceOfFrom.value)
    .div(`1e${tokenItemA.value.decimals}`)
    .toString(10);
});
const maxAmountOut = computed((): string => {
  if (pairInfo.value.reserveB) {
    // trừ đi 0.1 để không lỗi getAmountsIn
    return new BigNumber(pairInfo.value.reserveB)
      .minus(0.1)
      .div(`1e${tokenItemB.value.decimals}`)
      .toFixed(0, 1);
  }
  return "0.0";
});
const price = computed((): string => {
  const k = new BigNumber(inputB.value).div(inputA.value);
  if (!amountChange.value && k.isGreaterThan(0))
    return k.precision(6).toString(10);
  return "-";
});
const swapFees = computed((): string => {
  if (pairInfo.value.swapFees) {
    return `${new BigNumber(pairInfo.value.swapFees).div(100)}%`;
  }
  return "--";
});
const account = computed((): Connex.Thor.Account => {
  return useUserStoreHook().dAccount.VTHO;
});

// !method
function initial(): void {
  checkBalanceOf();
  getPairInfo();
}

async function checkBalanceOf(): Promise<void> {
  if (debug.value) console.log("checkBalanceOf", props.addr);
  if (!props.addr) return;
  const _exceptList = ["VET", "VTHO"]; // không kiểm tra số dư các token này
  const requests = tokenList.value.map(item => {
    if (_exceptList.includes(item.symbol) === false) {
      return new ERC20(item.address, $connex)
        .balanceOf(props.addr as string)
        .catch(e => {
          console.log(`Load balanceOf ${item.symbol} error`, e);
        });
    }
  });
  // console.log('requests:', requests)
  await Promise.all(requests)
    .then(results => {
      // console.log('Promise.all Results:', results)
      tokenList.value.map((item: types.TokenDetails, index: number) => {
        if (_exceptList.includes(item.symbol) === false) {
          item.balanceOf = results[index] as string;
        }
      });
    })
    .catch(e => console.log("Load all balanceOf error", e));
  // console.log('tokenList 2:', tokenList)
}
function showTokenListDialog(action: "tokenInputA" | "tokenInputB"): void {
  tokenListActionType.value = action;
  currentItemAddress.value =
    action === "tokenInputA"
      ? tokenItemA.value.address
      : tokenItemB.value.address;
  otherItemAddress.value =
    action === "tokenInputB"
      ? tokenItemA.value.address
      : tokenItemB.value.address;
  //
  let dialogTitle = "";
  if (action === "tokenInputA") {
    dialogTitle = "Swap from";
  } else {
    dialogTitle = "Swap to";
  }
  const tlDialogType = "swap";
  tlDialog.value.open(
    tlDialogType,
    dialogTitle,
    currentItemAddress.value,
    otherItemAddress.value
  );
  debug.value && console.log("showTokenListDialog", action);
}
function setPairInfo(pair?: string): void {
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
  if (pair === undefined) {
    // switchToken
    const reserveA = pairInfo.value.reserveA;
    pairInfo.value.reserveA = pairInfo.value.reserveB;
    pairInfo.value.reserveB = reserveA;
  } else if (pair === $addr0) {
    // tokenChange
    pairInfo.value.reserveA = "";
    pairInfo.value.reserveB = "";
    pairInfo.value.totalSupply = "";
    pairInfo.value.balanceOf = "";
    pairInfo.value.swapFees = "";
  }
  debug.value && console.log("---------- setPairInfo->pairInfo", pairInfo);
}
async function getPairInfo(): Promise<void> {
  debug.value && console.log("getPairInfo", tokenItemA, tokenItemB);
  loadingBtn.value = true;
  amountChange.value = true;
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
        submitLabel.value = "Insufficient liquidity for this trade.";
        pairError.value = true;
        disableBtn.value = true;
      } else {
        pairError.value = false;
        disableBtn.value = false;
        submitLabel.value = props.addr ? "Swap" : "Connect Wallet";
      }
      pairInfo.value.address = reserveResults.pairs[0];
      pairInfo.value.reserveA = reserveResults.reservesA[0];
      pairInfo.value.reserveB = reserveResults.reservesB[0];
      pairInfo.value.totalSupply = reserveResults.supplies[0];
      pairInfo.value.balanceOf = reserveResults.balances[0];
      pairInfo.value.swapFees = reserveResults.swapFees[0];
      debug.value && console.log("---------- getPairInfo->pairInfo", pairInfo);
      loadingBtn.value = false;
      amountChange.value = false;
    })
    .catch(e => {
      console.log("getPairInfoByTokens error", e);
      pairError.value = true;
      disableBtn.value = props.addr !== undefined && props.addr !== "";
      submitLabel.value = props.addr ? "Connection errors" : "Connect Wallet";
      loadingBtn.value = false;
      amountChange.value = false;
    });
}

function tokenChange(item: types.TokenDetails): void {
  if (currentItemAddress.value === item.address || loadingBtn.value) return;
  if (otherItemAddress.value === item.address) {
    switchToken();
  } else {
    resetInput();
    resetError();
    if (tokenListActionType.value === "tokenInputA") {
      tokenItemA.value = Object.assign({}, item);
    } else {
      tokenItemB.value = Object.assign({}, item);
    }
    setPairInfo($addr0);
    getPairInfo();
  }
  tlDialog.value.close();
}

function switchToken(): void {
  if (loadingBtn.value) return;
  resetInput();
  resetError();
  const _tokenItemA = tokenItemA.value;
  tokenItemA.value = tokenItemB.value;
  tokenItemB.value = _tokenItemA;
  setPairInfo();
  //
  debug.value && console.log("tokenList", tokenList);
  debug.value && console.log("tokenList2", myAddr);
  // test swapStore
  // swapStore.fetchErc20Data()
  /*
      swapStore.increment(tokenList)
      swapStore.count++
      swapStore.increment()
      debug && console.log('swapStore', swapStore.count)
      */
}

function resetInput(): void {
  inputA.value = "";
  inputB.value = "";
}
function resetError(): void {
  input_AError.value = "";
  input_BError.value = "";
}
function isRequired(): boolean {
  input_AError.value = !inputA.value ? "Required" : "";
  input_BError.value = !inputB.value ? "Required" : "";

  return !(input_AError.value || input_BError.value);
}

function validNumber(): boolean {
  const _inputA = new BigNumber(inputA.value);
  const _inputB = new BigNumber(inputB.value);

  console.log("_inputA", _inputA);

  input_AError.value = _inputA.isNaN() ? "Invalid number" : "";
  input_BError.value = _inputB.isNaN() ? "Invalid number" : "";

  return !(input_AError.value || input_BError.value);
}
function validRange(): boolean {
  debug.value &&
    console.log("maxAmountPay", maxAmountPay, typeof maxAmountPay.value);
  const _inputA = new BigNumber(inputA.value);
  input_AError.value = _inputA.isGreaterThan(maxAmountPay.value)
    ? "Insufficient balance"
    : "";
  return !input_AError.value;
}

function validate(): boolean {
  if (!isRequired() || !validNumber() || !validRange()) {
    // if (!isRequired() || !validRange()) {
    return false;
  }
  return true;
}

function thePath(): string[] {
  return [tokenItemA.value.address, tokenItemB.value.address];
}

async function onSubmit(): Promise<void> {
  debug.value && console.log("---------- onSubmit");
  if (!props.addr) {
    // $emit('connect')
    emitter.emit("connectWallet", "");
    return;
  }
  if (!contractName.value) {
    return;
  }

  if (!validate()) {
    return;
  }

  typeTx.value = "swap";

  // kiểm tra gas
  const vtho = new BigNumber(account.value.energy).div(1e18);
  if (tokenItemA.value.symbol === "VTHO" && vtho.minus(6).lt(inputA.value)) {
    // giả sử phí giao dịch tối đa 6 VTHO
    loadingBtn.value = true;
    const estGas = await estimateGas(
      $connex.thor,
      getClauses(props.addr),
      0,
      props.addr,
      props.addr
    );
    loadingBtn.value = false;
    const fee = calcFee(estGas.gas, estGas.baseGasPrice, 50).div(1e18);
    // console.log('fee', fee.toString())
    if (fee.plus(inputA.value).isGreaterThan(vtho)) {
      input_AError.value = `Max ${vtho.minus(fee).toFixed(3, 1)} allowed`;
      return;
    }
  }

  // swapExactETHForTokens, swapExactTokensForETH, swapExactTokensForTokens
  if (["EEFT", "ETFE", "ETFT"].includes(contractName.value)) {
    confirmMsg.value = `Output is estimated. You will receive at least ${new BigNumber(
      inputB.value
    )
      .multipliedBy(1 - tolerance.value)
      .toString(10)} ${
      tokenItemB.value.symbol
    } or the transaction will be reverted.`;
  } else {
    confirmMsg.value = `Output is estimated. You will pay at most ${new BigNumber(
      inputA.value
    )
      .multipliedBy(1 + tolerance.value)
      .toString(10)} ${
      tokenItemA.value.symbol
    } or the transaction will be reverted.`;
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
  txdialog.value.open();
  // ($refs.txdialog as typeof TxInfoDialog).open();
}

function getClauses(addr: string) {
  debug.value &&
    console.log("getClauses: contractName, thePath", contractName, thePath());
  const clauses: Connex.Vendor.TxMessage = [];
  const deadline = ((Date.now() + 900000) / 1000).toFixed(0); // add: 900s <-> 15m
  // debug && console.log('----- deadline', deadline)

  // amountIn: số lượng nhận, amountOut: số lưởng phải trả
  const amountWeiIn = toWei(inputA.value, tokenItemA.value.decimals);
  const amountWeiOut = toWei(inputB.value, tokenItemB.value.decimals);
  debug.value &&
    console.log("----- amountWeiIn, amountWeiOut", amountWeiIn, amountWeiOut);

  // amountOutMin: số lượng nhận tối thiểu
  const amountOutMin = new BigNumber(inputB.value)
    .multipliedBy(1 - tolerance.value)
    .toString(10);
  const amountWeiOutMin = toWei(amountOutMin, tokenItemB.value.decimals);
  debug.value &&
    console.log(
      "----- amountOutMin, amountWeiOutMin",
      amountOutMin,
      amountWeiOutMin
    );

  // amountInMax: số lượng trả tối đa
  const amountInMax = new BigNumber(inputA.value)
    .multipliedBy(1 + tolerance.value)
    .toString(10);
  const amountWeiInMax = toWei(amountInMax, tokenItemA.value.decimals);
  debug.value &&
    console.log(
      "----- amountInMax, amountWeiInMax",
      amountInMax,
      amountWeiInMax
    );

  // approve token ----------------------------------
  // swapExactTokensForETH, swapExactTokensForTokens
  if (["ETFE", "ETFT"].includes(contractName.value)) {
    clauses.push(
      new ERC20(tokenItemA.value.address, $connex).approve(
        $swapV2Router01.address,
        amountWeiIn
      )
    );
  }
  // swapTokensForExactETH, swapTokensForExactTokens
  if (["TFEE", "TFET"].includes(contractName.value)) {
    clauses.push(
      new ERC20(tokenItemA.value.address, $connex).approve(
        $swapV2Router01.address,
        amountWeiInMax
      )
    );
  }
  // end: approve token ----------------------------------

  switch (contractName.value) {
    case "ETFT": // swapExactTokensForTokens
      clauses.push(
        $swapV2Router01.swapExactTokensForTokens(
          amountWeiIn,
          amountWeiOutMin,
          thePath(),
          addr,
          deadline
        )
      );
      break;
    case "TFET": // swapTokensForExactTokens
      clauses.push(
        $swapV2Router01.swapTokensForExactTokens(
          amountWeiOut,
          amountWeiInMax,
          thePath(),
          addr,
          deadline
        )
      );
      break;
    case "TFEE": // swapTokensForExactETH
      clauses.push(
        $swapV2Router01.swapTokensForExactETH(
          amountWeiOut,
          amountWeiInMax,
          thePath(),
          addr,
          deadline
        )
      );
      break;
    case "ETFE": // swapExactTokensForETH
      clauses.push(
        $swapV2Router01.swapExactTokensForETH(
          amountWeiIn,
          amountWeiOutMin,
          thePath(),
          addr,
          deadline
        )
      );
      break;
    case "EEFT": // swapExactETHForTokens
      clauses.push(
        $swapV2Router01.swapExactETHForTokens(
          amountWeiIn,
          amountWeiOutMin,
          thePath(),
          addr,
          deadline
        )
      );
      break;
    case "EFET": // swapETHForExactTokens
      clauses.push(
        $swapV2Router01.swapETHForExactTokens(
          amountWeiInMax,
          amountWeiOut,
          thePath(),
          addr,
          deadline
        )
      );
      break;
  }
  return clauses;
}

async function onConfirm(): Promise<Connex.Vendor.TxResponse | void | unknown> {
  if (!props.addr) {
    // $emit('connect')
    emitter.emit("walletConnect", "");
    return;
  }
  const clauses = getClauses(props.addr);
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("timeout"));
    }, 50000);
  });
  try {
    return Promise.race([
      myPromise,
      $connex.vendor.sign("tx", clauses).signer(props.addr).request()
    ]);
  } catch (error) {
    console.log(error);
  } finally {
    resetInput();
  }
}

function onChange(action: "amountIn" | "amountOut"): void {
  debug.value && console.log("inputA, inputB----", inputA, inputB);
  amountChange.value = true;
  if (pairError.value) {
    if (action === "amountIn") {
      inputA.value = "";
    } else {
      inputB.value = "";
    }
    return;
  }
  if (action === "amountIn") {
    inputB.value = formatFloatNumber(inputB.value, tokenItemB.value.decimals);
  } else {
    inputA.value = formatFloatNumber(inputA.value, tokenItemA.value.decimals);
  }
  resetError();
  if (timer.value) {
    window.clearTimeout(timer.value);
    timer.value = 0;
  }
  timer.value = window.setTimeout(async () => {
    loadingBtn.value = true;

    try {
      if (action === "amountIn") {
        debug.value && console.log("-------maxAmountOut", maxAmountOut);
        if (new BigNumber(inputB.value).isGreaterThan(maxAmountOut.value)) {
          inputB.value = maxAmountOut.value;
        }
        await amountIn();
      } else {
        await amountOut();
      }
      debug.value && console.log("---------- pairInfo", pairInfo);
    } catch (error) {
      console.error(error);
    }
    loadingBtn.value = false;
    amountChange.value = false;
  }, 600);
}

async function amountIn(): Promise<void> {
  if (!inputB.value || inputB.value === "0") {
    inputA.value = "";
    return;
  }
  const inputBBN = new BigNumber(inputB.value);
  if (!inputBBN.isGreaterThan(0)) {
    inputA.value = "";
    return;
  }
  const inputBWei = toWei(inputBBN.toString(10), tokenItemB.value.decimals);
  debug.value &&
    console.log("-------getAmountsIn", inputBWei, inputBBN.toString(10));
  // TFEE: swapTokensForExactETH, EFET: swapETHForExactTokens, TFET: swapTokensForExactTokens
  contractName.value =
    tokenItemB.value.symbol === "VET"
      ? "TFEE"
      : tokenItemA.value.symbol === "VET"
      ? "EFET"
      : "TFET";
  const temp = (await $swapV2Router01.getAmountsIn(inputBWei, thePath())).div(
    `1e${tokenItemA.value.decimals}`
  );
  // console.log('getAmountsIn temp', temp.toString(10))
  if (temp.isLessThanOrEqualTo(0)) {
    input_BError.value = "Try smaller amount";
    inputA.value = "";
  } else if (temp.isLessThan(1)) {
    inputA.value = new BigNumber(temp.toPrecision(8, 1)).toFixed();
  } else {
    inputA.value = new BigNumber(temp.toPrecision(7, 1)).toFixed();
  }
}

async function amountOut(): Promise<void> {
  if (!inputA.value || inputA.value === "0") {
    inputB.value = "";
    return;
  }
  const inputABN = new BigNumber(inputA.value);
  if (!inputABN.isGreaterThan(0)) {
    inputB.value = "";
    return;
  }
  const inputAWei = toWei(inputABN.toString(10), tokenItemA.value.decimals);
  // EEFT: swapExactETHForTokens, ETFE: swapExactTokensForETH, ETFT: swapExactTokensForTokens
  contractName.value =
    tokenItemA.value.symbol === "VET"
      ? "EEFT"
      : tokenItemB.value.symbol === "VET"
      ? "ETFE"
      : "ETFT";
  debug.value && console.log("-------getAmountsOut", inputAWei, thePath());
  const temp = (await $swapV2Router01.getAmountsOut(inputAWei, thePath())).div(
    `1e${tokenItemB.value.decimals}`
  );
  console.log("temmmmmmmmmmmmmmmmmmmmmmmm", temp.toString());

  if (temp.isLessThan(0)) {
    input_AError.value = "Try smaller amount";
    inputB.value = "";
  } else if (temp.isEqualTo(0)) {
    input_AError.value = "Try smaller amount";
    inputB.value = "";
  } else if (temp.isLessThan(1)) {
    inputB.value = new BigNumber(temp.toPrecision(6, 1)).toFixed();
  } else {
    inputB.value = new BigNumber(temp.toPrecision(5, 1)).toFixed();
  }
}

async function handleMaxValue() {
  if (!props.addr) return;
  inputA.value = maxAmountPay.value;
  if (!pairError.value) {
    loadingBtn.value = true;
    await amountOut();
    const vtho = new BigNumber(account.value.energy).div(1e18);
    if (tokenItemA.value.symbol === "VTHO" && vtho.minus(6).lt(inputA.value)) {
      // giả sử phí giao dịch tối đa 6 VTHO
      const estGas = await estimateGas(
        $connex.thor,
        getClauses(props.addr),
        0,
        props.addr,
        props.addr
      );
      const fee = calcFee(estGas.gas, estGas.baseGasPrice, 50).div(1e18);
      // console.log('fee', fee.toString())
      inputA.value = vtho.minus(fee).toFixed(3, 1);
      await amountOut();
    }
    loadingBtn.value = false;
  }
}

onMounted(() => {
  debug.value && console.log("---------- Swap Component", "created");
  debug.value && console.log("account", account);
  debug.value && console.log("tokenList", tokenList);
  debug.value && console.log("tokenList.length", tokenList.value.length);
  if (tokenList.value && tokenList.value.length > 0) {
    tokenItemA.value = Object.assign({}, tokenList.value[0]);
    tokenItemB.value = Object.assign({}, tokenList.value[1]);
  }
  setPairInfo($addr0);
  // const _self = this
  // alert(window.connex.version + '-' + _self.$connex.version)
  setTimeout(() => initial(), 1000);
});
watch(myAddr, newAddr => {
  if (!myAddr.value) {
    submitLabel.value = "Connect Wallet";

    tokenList.value.map(item => {
      item.balanceOf = "";
      // console.log(item.symbol)
    });
  } else {
    submitLabel.value = "Swap";
  }
  if (newAddr) {
    checkBalanceOf();
  }
});
</script>
<template>
  <el-row class="swap-card">
    <el-form label-position="top" @submit.stop.prevent="function () {}">
      <!-- @submit.stop.prevent="onSubmit" -->
      <el-form-item
        :error="input_AError"
        :show-message="!!input_AError"
        class="grey-form-item"
      >
        <template #label>
          <div class="label-row">
            <div class="text-from">
              <p>From</p>
              <p v-if="addr" class="btn-max" @click="handleMaxValue">Max</p>
            </div>
            <div class="balance">
              <template v-if="balanceOfFrom">
                Balance:
                <Amount
                  :balance="balanceOfFrom"
                  :decimals="tokenItemA.decimals"
                  :format="3"
                />
              </template>
              <span v-else />
            </div>
          </div>
        </template>

        <el-input
          v-model="inputA"
          class="cus-input"
          placeholder="0.0"
          @input="onChange('amountOut')"
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
      <el-row justify="center" style="margin: -25px 0 -20px 0">
        <el-link
          href="javascript:;"
          :underline="false"
          class="button-switch-token"
          @click="switchToken()"
        >
          <el-icon :size="20">
            <bottom />
          </el-icon>
        </el-link>
      </el-row>
      <el-form-item
        :error="input_BError"
        :show-message="!!input_BError"
        class="grey-form-item"
        style="margin-top: 5px"
      >
        <template #label>
          <div class="label-row">
            <div class="text-to"><p>To</p></div>
            <div class="balance">
              <template v-if="balanceOfTo">
                Balance:
                <Amount
                  :balance="balanceOfTo"
                  :decimals="tokenItemB.decimals"
                  :format="3"
                />
              </template>
              <span v-else />
            </div>
          </div>
        </template>

        <el-input
          v-model="inputB"
          placeholder="0.0"
          class="cus-input"
          @input="onChange('amountIn')"
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
      </el-form-item>
      <el-row align="middle" class="slippage-tolerance">
        <el-col :span="12" :xs="10" :sm="8">
          <span style="display: flex; align-items: center; white-space: nowrap">
            Slippage tolerance
            <el-popover
              placement="right"
              :width="200"
              trigger="click"
              content="Your transaction will be reverted if the price changes unfavorably by more than this percentage."
            >
              <template #reference>
                <el-icon
                  style="display: flex; margin-left: 2px; margin-top: 2px"
                >
                  <Warning />
                </el-icon>
              </template>
            </el-popover>
          </span>
        </el-col>
        <el-col :span="12" :xs="14" :sm="16" style="text-align: right">
          <el-radio-group v-model="tolerance" size="mini">
            <el-radio-button :label="0.001">0.1%</el-radio-button>
            <el-radio-button :label="0.005">0.5%</el-radio-button>
            <el-radio-button :label="0.01">1%</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0">
        <el-col :span="12">
          <span style="font-size: 12px">Deadline</span>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <span style="font-size: 12px">15 minutes</span>
        </el-col>
      </el-row>
      <el-row style="margin: 14px 0; font-size: 12px">
        <el-col :span="4"> Price </el-col>
        <el-col :span="20" style="text-align: right">
          <span style="color: #19a3fa; font-weight: 500">{{ price }}</span>
          {{ tokenItemB.symbol }} per {{ tokenItemA.symbol }}
        </el-col>
      </el-row>
      <el-row style="margin: 14px 0; font-size: 12px">
        <el-col :span="12"> Swap Fees </el-col>
        <el-col :span="12" style="text-align: right">
          {{ swapFees }}
        </el-col>
      </el-row>
      <el-form-item style="margin-top: 20px">
        <el-button
          :loading="loadingBtn"
          :disabled="disableBtn"
          class="custom-btn-connect"
          native-type="submit"
          round
          @click="onSubmit"
        >
          {{ submitLabel }}
        </el-button>
      </el-form-item>
    </el-form>

    <TxInfoDialog
      ref="txdialog"
      :type="typeTx"
      :confirm-msg="confirmMsg"
      :contents="contents"
      :on-confirm="onConfirm"
    />
    <TokenListDialog ref="tlDialog" @on-select="tokenChange" />
    <!-- @on-select="tokenChange" -->
  </el-row>
</template>

<style lang="scss">
@media screen and (max-width: 374px) {
  .slippage-tolerance .el-radio-button__inner {
    padding: 6px 12px;
  }
}
</style>

<style lang="scss" scoped>
// input
:deep(.el-input__wrapper) {
  background-color: transparent;
}
// end input----
.swap-card {
  justify-content: center;
  .el-radio-group {
    border-radius: 20px;
    background: #0002;
  }
  .button-switch-token.el-link.el-link--default {
    background: #0d488b;
    border-radius: 10px;
    border: 4px solid #00347d;
    padding: 2px 4px;
    color: #fff;
  }
  .slippage-tolerance {
    margin-top: 20px;
    font-size: 12px;
  }
}
</style>
