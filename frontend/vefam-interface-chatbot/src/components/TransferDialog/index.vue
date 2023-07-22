<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { cloneDeep } from "lodash-unified";
import {
  CollectionDetails01,
  ItemShow01,
  TokenDetails,
  FundingTokenDetails,
  DepositTokenDetails
} from "/@/types/collection";
import { useGlobal } from "@pureadmin/utils";
import { useUserStoreHook } from "/@/store/modules/user";
import { getCollecAddr, dAccountAddr } from "/@/settings";
import {
  fromWei,
  toWei,
  toWei2,
  formatFloatNumber,
  estimateGas,
  calcFee
  //toWeiHex
} from "/@/utils/connex";
import { fundingWithdraw } from "/@/api/user";
import { useAppStoreHook } from "/@/store/modules/app";
import { MathMaxBN } from "/@/utils";

import BigNumber from "bignumber.js";
import ERC1155 from "/@/contractCall/ERC1155";
import ERC721 from "/@/contractCall/ERC721";
import ERC20 from "/@/contractCall/ERC20";
import TxInfoDialog from "/@/components/TxInfoDialog/index.vue";
import Amount from "/@/components/Amount/index.vue";

const { $connex, $dAccount } = useGlobal<GlobalPropertiesApi>();
const debug = ref(false);
const dialogTransfer = ref(false);
const txInfoDialogRef = ref(null);
const transferLoading = ref(false);
const titleDialog = ref("");
const btnContent = ref("");
const inputContent = ref("");
const collectionDetails: CollectionDetails01 = ref({});
const itemDetails: ItemShow01 = ref({});
const inputRecipient = ref(undefined);
const inputAmount = ref(undefined);
const inputAmountError = ref(null);
const inputRecipientError = ref(null);
const collectionCodename = ref("");
const colectionAddress = ref("");
const collectionStandard = ref("");
// transfer
const infoToken: TokenDetails = ref(undefined);
const inputAmountWei = ref(undefined);
const bnBalance: any = ref("");
const maxUseWei = ref("0");
const addressZero = "0x0000000000000000000000000000000000000000";
// widthdraw
const infoWithdraw: FundingTokenDetails = ref(undefined);
const withdrawAmountWei = ref(undefined);
// deposit
const infoDeposit: DepositTokenDetails = ref(undefined);
const userStoreHook = useUserStoreHook();
const cALinkedAddr = ref(null);
const actionType = ref(
  "transferItem" as "transferItem" | "transferToken" | "withdraw" | "deposit"
);

const myAddr = computed(() => {
  return userStoreHook.dAccount.myAddr;
});

const vthoAcc = computed((): string => {
  return useUserStoreHook().dAccount.VTHO;
});
// tạm
const token = computed(() => {
  return userStoreHook.cAccount.accessToken;
});

// use for withdraw send to TxInfoDialog
const withdrawInfo: Indexable = [
  {
    contents: "You will receive",
    Address: null,
    Network: "VeChain",
    Source: "Funding Wallet",
    Token: null,
    Receive: null,
    Amount: null,
    Network_Fee: null,
    decimals: null
  }
];
const titleWithdraw = "Withdraw confirmation";
const infoContents =
  "Ensure that the address is correct and on the same network. Transactions cannot be cancelled.";
const waitingMsgApi = "You are sending withdraw order to server!";
const finalContents =
  "Your withdraw order has been sent, it may take 8 hours to be processed.";
//

defineOptions({
  name: "TransferDialog"
});

//
function openTransferItem(
  item: ItemShow01,
  collection_details: CollectionDetails01
) {
  actionType.value = "transferItem";
  if (debug.value) console.log("open -> item", item);
  if (debug.value)
    console.log("open -> showTransferDialog", collection_details);
  dialogTransfer.value = true;
  collectionDetails.value = collection_details;
  itemDetails.value = item;
  handleTitle();

  // when open refresh amount & error
  inputRecipient.value = "";
  inputAmountError.value = "";
  inputRecipientError.value = "";

  collectionCodename.value = collection_details.value.codename.split();
  collectionStandard.value = collection_details.value.standard.split();
  console.log(collectionStandard.value);
  colectionAddress.value = getCollecAddr(collectionCodename.value);

  handleAmountVip();
}
//
function openTransferToken(item: TokenDetails) {
  actionType.value = "transferToken";
  if (debug.value) console.log("transferToken");
  dialogTransfer.value = true;
  infoToken.value = item;
  handleTitle();
  bnBalance.value = new BigNumber(infoToken.value.balanceOf);
  inputRecipient.value = "";
  inputAmount.value = "";
  inputAmountError.value = "";
  inputRecipientError.value = "";
}
//
function openWithdraw(withdrawToken: Indexable, cAccount: string) {
  actionType.value = "withdraw";
  if (debug.value) console.log("withdraw");
  dialogTransfer.value = true;
  infoWithdraw.value = withdrawToken;
  console.log(infoWithdraw.value);
  cALinkedAddr.value = cAccount;
  handleTitle();

  inputRecipient.value =
    cALinkedAddr.value.slice(0, 10) + "..." + cALinkedAddr.value.slice(-10); // only withdraw to user wallet using

  inputAmount.value = "";
  inputAmountError.value = "";
  inputRecipientError.value = null;
  withdrawAmountWei.value = toWei(0);
}
//
async function openDeposit(
  depositToken: DepositTokenDetails,
  cAccount: string
) {
  if (debug.value) console.log("deposit");
  transferLoading.value = true;
  actionType.value = "deposit";
  dialogTransfer.value = true;

  inputAmount.value = "";
  inputAmountError.value = "";
  inputRecipientError.value = "";
  inputRecipientError.value = null;

  infoDeposit.value = cloneDeep(depositToken);
  console.log(infoDeposit.value);
  cALinkedAddr.value = cAccount;
  infoDeposit.value.balanceOf = "0";
  handleTitle();

  inputRecipient.value =
    cALinkedAddr.value.slice(0, 10) + "..." + cALinkedAddr.value.slice(-10);

  //
  const supportedPayments: any = await $dAccount
    .supportedPayments([infoDeposit.value.address])
    .catch(e => {
      console.error(e);
    });
  if (debug.value) console.log("supportedPayments", supportedPayments);
  if (!supportedPayments) {
    transferLoading.value = true;
  }
  infoDeposit.value.enables = supportedPayments.enables[0];
  infoDeposit.value.minDeposit = supportedPayments.minAmounts[0];

  if (infoDeposit.value.address == addressZero) {
    $connex.thor
      .account(cALinkedAddr.value)
      .get()
      .then(accInfo => {
        if (debug.value)
          console.log(
            "accInfo",
            accInfo,
            new BigNumber(accInfo.balance).toString()
          );
        infoDeposit.value.balanceOf = accInfo.balance;
        transferLoading.value = false;
      });
  } else {
    transferLoading.value = true;
    new ERC20(infoDeposit.value.address, $connex)
      .balanceOf(cALinkedAddr.value)
      .then(balance => {
        infoDeposit.value.balanceOf = balance;
        transferLoading.value = false;
      });
  }
}

function handleAmountVip() {
  if (collectionStandard.value == "VIP-181") {
    itemDetails.value.quantity = 1;
    inputAmount.value = 1;
  } else {
    inputAmount.value = "";
  }
}

async function transferTokenGetEstGas() {
  if (!inputAmount.value) return;
  const vthoLocation = infoToken.value.symbol === "VTHO";
  // vthoAcc.value = new BigNumber(1); // test
  const vthoBN = new BigNumber(vthoAcc.value).div(1e18);
  if (
    inputRecipient.value &&
    vthoLocation &&
    vthoBN.minus(8).lt(new BigNumber(inputAmount.value))
  ) {
    const estGas = await estimateGas(
      $connex.thor,
      getTransferERC20Clauses(),
      0,
      myAddr.value,
      myAddr.value
    );
    return calcFee(estGas.gas, estGas.baseGasPrice, 50);
  }
  return new BigNumber(0);
}

async function transferTokenEstimateGas() {
  const etSGasWei = await transferTokenGetEstGas();
  // bnBalance.value = new BigNumber(1); // test
  maxUseWei.value = bnBalance.value.minus(etSGasWei);
  inputAmount.value = fromWei(maxUseWei.value);
  handleInputTokenAmount(false);
  // if (bnBalance.value.minus(etSGasWei).lt(1)) {
  //   inputAmountError.value = "k dủ gas";
  // }
}

async function maxValue() {
  if (actionType.value == "transferItem") {
    inputAmount.value = itemDetails.value.quantity;
  }
  if (actionType.value == "transferToken") {
    inputAmount.value = fromWei(bnBalance.value);
    maxUseWei.value = bnBalance.value;
    inputAmountWei.value = "1"; // giả lập gửi đi 1 wei
    inputAmountError.value = null;
    transferTokenEstimateGas();
  }
  if (actionType.value == "withdraw") {
    inputAmount.value = fromWei(infoWithdraw.value.balanceOf);
    handleInputTokenAmount();
  }
  if (actionType.value == "deposit") {
    (inputAmount.value = fromWei(infoDeposit.value.balanceOf)),
      infoDeposit.value.decimals;
    handleInputTokenAmount();
  }
}

// input error
function handleInputItemAmount() {
  inputAmountWei.value = inputAmount.value;
  if (!(actionType.value == "transferItem")) return;
  if (inputAmount.value <= 0) {
    inputAmountError.value = "Please enter a valid number!";
  } else if (inputAmount.value == "") {
    inputAmountError.value = "Please enter a valid number!";
  } else {
    inputAmountError.value = null;
  }
}

function handleInputRecipient() {
  if (!myAddr.value) return;
  try {
    if (actionType.value != "withdraw" && actionType.value != "deposit") {
      if (inputRecipient.value == "") {
        inputRecipientError.value = "Please enter a address!";
      } else if (inputRecipient.value == myAddr.value) {
        inputRecipientError.value = "Recipient address is overlap!";
      } else if (inputRecipient.value == colectionAddress.value) {
        inputRecipientError.value = "Recipient address is invalid!";
      } else if (
        inputRecipient.value !=
        inputRecipient.value.match(/^0x[a-fA-F0-9]{40}$/)
      ) {
        inputRecipientError.value = "Recipient address is wrong format!";
      } else {
        inputRecipientError.value = null;
      }
    }
    if (
      actionType.value == "transferToken" &&
      inputAmount.value &&
      !inputRecipientError.value
    ) {
      handleInputTokenAmount();
    }
  } catch (error) {
    console.log(error);
    inputRecipientError.value = "Please enter a address!";
  }
}
// -------

// input token
async function handleInputTokenAmount(checkGas = true) {
  if (!myAddr.value) return;
  inputAmountError.value = null;
  try {
    if (actionType.value == "transferToken") {
      inputAmount.value = inputAmount.value.replace(/[^\d.]/g, "");
      inputAmount.value = formatFloatNumber(
        inputAmount.value,
        infoToken.value.decimals,
        30
      );

      inputAmountWei.value = toWei(inputAmount.value, infoToken.value.decimals);
      let amountBN = new BigNumber(inputAmountWei.value);
      const userBalanceBN = new BigNumber(bnBalance.value);

      if (checkGas) {
        const etSGasWei = await transferTokenGetEstGas();
        maxUseWei.value = bnBalance.value.minus(etSGasWei);
      }

      if (inputAmountWei.value == "") {
        inputAmountError.value = "Please enter a valid number!";
      } else if (inputAmount.value == "") {
        inputAmountError.value = "Please enter a valid number!";
      } else if (amountBN.gt(userBalanceBN)) {
        inputAmountError.value = "Not enough balance";
      } else if (amountBN.gt(maxUseWei.value)) {
        inputAmountError.value = `Max ${fromWei(maxUseWei.value.toString())} ${
          infoToken.value.symbol
        } allowed`;
      } else if (inputAmount.value <= 0) {
        inputAmountError.value = "Please enter a valid number!";
      } else {
        inputAmountError.value = null;
      }
    }

    if (actionType.value == "withdraw") {
      inputAmount.value = inputAmount.value.replace(/[^\d.]/g, "");
      inputAmount.value = formatFloatNumber(
        inputAmount.value,
        infoWithdraw.value.decimals,
        30
      );
      inputAmountWei.value = toWei2(
        inputAmount.value,
        infoWithdraw.value.decimals
      );
      //
      const inputAmountWeiBN = new BigNumber(inputAmountWei.value);
      const withdrawFeeWeiBN = new BigNumber(infoWithdraw.value.withdrawFee);
      
      withdrawAmountWei.value = inputAmountWeiBN.minus(withdrawFeeWeiBN);
      // console.log("weeeee", inputAmount.value);

      // const _minWithdrawWeiBN = new BigNumber(infoWithdraw.value.minWithdraw);
      // const withdrawFeePlusWeiBN = new BigNumber(
      //   infoWithdraw.value.withdrawFee
      // ).plus("1");

      /* const minWithdrawWeiBN = _minWithdrawWeiBN.gt(withdrawFeePlusWeiBN)
        ? _minWithdrawWeiBN
        : withdrawFeePlusWeiBN; */

      const minWithdrawWeiBN = MathMaxBN(
        new BigNumber(infoWithdraw.value.minWithdraw),
        new BigNumber(infoWithdraw.value.withdrawFee).plus("1")
      );

      const userBalanceFundBN = new BigNumber(infoWithdraw.value.balanceOf);

      withdrawInfo[0].Address = cALinkedAddr.value;
      withdrawInfo[0].Receive = withdrawAmountWei.value;
      withdrawInfo[0].Amount = inputAmount.value;
      withdrawInfo[0].Token = infoWithdraw.value.symbol;
      withdrawInfo[0].Network_Fee = fromWei(infoWithdraw.value.withdrawFee);
      withdrawInfo[0].decimals = infoWithdraw.value.decimals;

      if (inputAmountWeiBN.lt(minWithdrawWeiBN)) {
        inputAmountError.value = `Withdraw amount must be at least ${fromWei(
          minWithdrawWeiBN.toString()
        )} ${infoWithdraw.value.symbol}`;
        return;
      }
      if (inputAmount.value == "") {
        inputAmountError.value = "Please enter a valid number!";
      } else if (inputAmountWeiBN.gt(userBalanceFundBN)) {
        inputAmountError.value = "Not enough balance!";
      } else {
        inputAmountError.value = null;
      }
    }

    if (actionType.value == "deposit") {
      inputAmount.value = formatFloatNumber(
        inputAmount.value,
        infoDeposit.value.decimals,
        30
      );
      inputAmountWei.value = toWei2(
        inputAmount.value,
        infoDeposit.value.decimals
      );

      const inputAmountWeiBN = new BigNumber(inputAmountWei.value);
      const userBalanceDepositBN = new BigNumber(infoDeposit.value.balanceOf);
      const minDepositBN = new BigNumber(infoDeposit.value.minDeposit);

      if (inputAmount.value == "") {
        inputAmountError.value = "Please enter a valid number!";
      } else if (inputAmountWeiBN.gt(userBalanceDepositBN)) {
        inputAmountError.value = "Not enough balance!";
      } else if (inputAmountWeiBN.lt(minDepositBN)) {
        inputAmountError.value = `Deposit amount must be at least ${fromWei(
          infoDeposit.value.minDeposit
        )} ${infoDeposit.value.symbol}`;
      } else {
        inputAmountError.value = null;
      }
    }
  } catch (error) {
    console.log(error);
    inputAmountError.value = "Please enter a valid number!";
    return;
  }
}
// -------

// ------
function handleTitle() {
  switch (actionType.value) {
    case "transferItem":
      titleDialog.value = `Transfer ${itemDetails.value.name}`;
      inputContent.value = "Quantity";
      btnContent.value = "Transfer";
      break;
    case "transferToken":
      titleDialog.value = `Transfer ${infoToken.value.symbol}`;
      inputContent.value = "Amount";
      btnContent.value = "Transfer";
      break;
    case "withdraw":
      titleDialog.value = `Withdraw ${infoWithdraw.value.symbol}`;
      inputContent.value = "Amount";
      btnContent.value = "Withdraw";
      break;
    case "deposit":
      titleDialog.value = `Deposit ${infoDeposit.value.symbol}`;
      inputContent.value = "Amount";
      btnContent.value = "Deposit";
      break;
  }
}
//

// paste
async function handlePaste() {
  const bin = ref(document.getElementById("paste-bin"));
  const read = await navigator.clipboard.readText();
  bin.value = inputRecipient.value;
  inputRecipient.value = read;
  ElMessage({
    message: "Paste successfully",
    type: "success"
  });
  handleInputRecipient();
}
// ------

// for TxInfoDialog
function txDialogFeedback(
  mss = "success" |
    "reverted" |
    "received" |
    "submitted" |
    "confirmed" |
    "rejected" |
    "withdraw"
) {
  if (mss === "success") {
    transferLoading.value = false;
    if (actionType.value === "transferToken") {
      useAppStoreHook().updateTokenList();
    }
    if (actionType.value === "withdraw") {
      useAppStoreHook().takeUserBalance();
    }
  } else {
    // Cancel, Error or reverted
    transferLoading.value = false;
  }
}

//
function getTransferERC20Clauses() {
  const clauses: Connex.Vendor.TxMessage = [];
  const mss = `Transfer ${infoToken.value.symbol}`;
  if (infoToken.value.address === addressZero) {
    clauses.push({
      to: inputRecipient.value,
      value: inputAmountWei.value,
      data: "0x",
      comment: mss
    });
  } else {
    clauses.push(
      new ERC20(infoToken.value.address, $connex).transfer(
        inputRecipient.value,
        inputAmountWei.value,
        mss
      )
    );
    if (debug.value) console.log("clauses", clauses);
  }
  return clauses;
}

async function onConfirm(): Promise<Connex.Vendor.TxResponse | void | unknown> {
  const clauses = [];
  const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Time out"));
    }, 50000); // recommend: 50000
  });
  if (actionType.value == "transferItem") {
    if (collectionStandard.value == "VIP-210") {
      console.log("run-here");
      clauses.push(
        new ERC1155(
          getCollecAddr(collectionCodename.value),
          $connex
        ).safeTransferFrom(
          myAddr.value,
          inputRecipient.value,
          itemDetails.value.id,
          inputAmount.value,
          "0x" //data
        )
      );
    } else {
      clauses.push(
        new ERC721(
          getCollecAddr(collectionCodename.value),
          $connex
        ).safeTransferFrom(
          myAddr.value,
          inputRecipient.value,
          itemDetails.value.id
        )
      );
    }
  } else if (actionType.value == "transferToken") {
    const mss = `Transfer ${infoToken.value.symbol}`;
    if (infoToken.value.symbol === "VET") {
      clauses.push({
        to: inputRecipient.value,
        value: inputAmountWei.value,
        data: "0x",
        comment: mss
      });
    } else {
      clauses.push(
        new ERC20(infoToken.value.address, $connex).transfer(
          inputRecipient.value,
          inputAmountWei.value,
          mss
        )
      );
    }
  } else if (actionType.value == "deposit") {
    const mss = `Deposit ${inputAmount.value} ${infoDeposit.value.symbol}`;
    if (infoDeposit.value.symbol !== "VET") {
      const mss2 = `Approve for ${inputAmount.value} ${infoDeposit.value.symbol} transfer`;
      clauses.push(
        new ERC20(infoDeposit.value.address, $connex).approve(
          dAccountAddr,
          inputAmountWei.value,
          mss2
        )
      );
      //
      clauses.push(
        $dAccount.userDeposit(
          infoDeposit.value.address,
          inputAmountWei.value,
          "0",
          mss
        )
      );
    } else {
      clauses.push(
        $dAccount.userDeposit(
          infoDeposit.value.address,
          "0",
          inputAmountWei.value,
          mss
        )
      );
    }
  } else {
    transferLoading.value = true;
  }
  try {
    if (actionType.value == "withdraw") {
      const data = {
        userAddress: cALinkedAddr.value,
        tokenAddress: infoWithdraw.value.address,
        amount: inputAmountWei.value
      };
      return Promise.race([myPromise, fundingWithdraw(data, token.value)]);
    } else if (actionType.value == "deposit") {
      return Promise.race([
        myPromise,
        $connex.vendor.sign("tx", clauses).signer(cALinkedAddr.value).request()
      ]);
    } else {
      return Promise.race([
        myPromise,
        $connex.vendor.sign("tx", clauses).signer(myAddr.value).request()
      ]);
    }
  } catch (error) {
    console.error(error);
  } finally {
    inputAmount.value = "";
    transferLoading.value = false;
    dialogTransfer.value = false;
  }
}
// end TxInfoDialog

async function handleTransfer() {
  handleInputRecipient();
  handleInputItemAmount();
  handleInputTokenAmount();

  if (
    inputRecipientError.value != null ||
    inputAmountError.value != null ||
    inputAmountWei.value == undefined
  )
    return;
  transferLoading.value = true;
  if (actionType.value == "withdraw") {
    txInfoDialogRef.value.apiOpenConfirm(
      titleWithdraw,
      infoContents,
      withdrawInfo,
      waitingMsgApi,
      finalContents
    );
  } else {
    txInfoDialogRef.value.txConfirm();
  }
}

defineExpose({
  openTransferItem,
  openTransferToken,
  openWithdraw,
  openDeposit
});
</script>

<template>
  <TxInfoDialog
    ref="txInfoDialogRef"
    :on-confirm="onConfirm"
    @feedback="txDialogFeedback"
  />
  <div class="transfer-dialog">
    <el-dialog
      v-if="dialogTransfer"
      custom-class="dialog-type2 versiontransfer"
      v-model="dialogTransfer"
      :show-close="
        ['transferItem', 'transferToken', 'withdraw', 'deposit'].includes(
          actionType
        )
      "
    >
      <template #header="{ titleId, titleClass }">
        <div class="my-header">
          <h4
            style="display: flex; align-items: flex-end"
            :id="titleId"
            :class="titleClass"
          >
            <div>{{ titleDialog }}</div>
            <el-tooltip
              effect="dark"
              content="More infomation"
              placement="top-start"
              ><IconifyIconOnline
                style="
                  margin-left: 3px;
                  font-size: 16px;
                  color: #808080;
                  cursor: pointer;
                "
                icon="ep:info-filled"
            /></el-tooltip>
          </h4>
        </div>
      </template>
      <el-row justify="center"
        ><el-icon
          v-if="transferLoading"
          class="is-loading"
          :size="30"
          color="#c3dcff"
          style="margin-top: 20px"
        >
          <IconifyIconOnline icon="lucide:loader" /> </el-icon
      ></el-row>
      <div
        v-if="
          actionType == 'withdraw' ||
          actionType == 'transferItem' ||
          actionType == 'transferToken' ||
          (actionType == 'deposit' && infoDeposit.enables)
        "
      >
        <div class="input-position">
          <span style="font-size: 16px">Recipient Address</span>
          <div style="margin-top: 10px">
            <el-input
              id="paste-bin"
              class="input-recipient"
              v-model="inputRecipient"
              :disabled="actionType == 'withdraw' || actionType == 'deposit'"
              placeholder="Press and hold to paste"
              @change="handleInputRecipient()"
            >
              <template #append>
                <el-tooltip effect="dark" content="Paste" placement="top-start">
                  <el-button
                    :disabled="
                      actionType == 'withdraw' || actionType == 'deposit'
                    "
                    @click="handlePaste()"
                    id="paste-content"
                    class="btn-versiontransfer"
                    ><IconifyIconOnline
                      style="font-size: 25px"
                      icon="material-symbols:content-paste-go-rounded"
                  /></el-button>
                </el-tooltip>
              </template>
            </el-input>
          </div>
          <div v-show="inputRecipientError != null" class="error">
            {{ inputRecipientError }}
          </div>
        </div>
        <div class="input-position">
          <span style="font-size: 16px">{{ inputContent }}</span>
          <div
            v-if="'transferItem' === actionType"
            style="display: flex; align-items: center; margin-top: 10px"
          >
            <el-input-number
              :disabled="collectionStandard == 'VIP-181'"
              v-model="inputAmount"
              size="large"
              placeholder="Enter number here"
              :min="1"
              :max="itemDetails.quantity"
              :precision="0.0"
              controls-position="right"
              @change="handleInputItemAmount()"
            />
            <el-button class="btn-versiontransfer" @click="maxValue()"
              >Max</el-button
            >
          </div>
          <div
            style="display: flex; align-items: center; margin-top: 10px"
            v-if="
              'transferToken' === actionType ||
              'withdraw' === actionType ||
              'deposit' === actionType
            "
          >
            <el-input
              v-model="inputAmount"
              @change="handleInputTokenAmount()"
              placeholder="Enter number here"
            >
              <template #append>
                <el-button class="btn-versiontransfer" @click="maxValue()"
                  >MAX</el-button
                ></template
              >
            </el-input>
          </div>
          <div v-show="inputAmountError != null" class="error">
            {{ inputAmountError }}
          </div>
        </div>
        <div
          v-if="'transferItem' === actionType"
          style="margin-top: 5px; color: #c2c2c2"
        >
          Availability:
          <span style="color: #45bbff">{{ itemDetails.quantity }}</span>
          {{ itemDetails.name }}#{{ itemDetails.id }}
        </div>
        <div
          style="margin-top: 5px; color: #ffffff80"
          v-if="'transferToken' === actionType"
        >
          <el-row>
            <span>Availability:</span>
            <Amount
              style="margin-right: 5px; margin-left: 5px; color: #ffffff"
              :balance="infoToken.balanceOf"
              :decimals="infoToken.decimals"
              :precision="100"
            />
            <span style="color: #ffffff">{{ infoToken.symbol }}</span>
          </el-row>
        </div>
        <div
          style="margin-top: 5px; color: #ffffff; word-break: break-word"
          v-if="'withdraw' === actionType"
        >
          <el-row
            ><span style="color: #ffffff80; margin-right: 5px"
              >Availability:
            </span>
            <Amount
              style="margin-right: 5px; margin-left: 5px; color: #ffffff"
              :balance="infoWithdraw.balanceOf"
              :decimals="infoWithdraw.decimals"
              :precision="100"
            />
            <span style="color: #ffffff">{{ infoWithdraw.symbol }}</span>
          </el-row>
          <el-row
            ><span style="color: #ffffff80; margin-right: 5px"
              >Receive amount:
              <span style="color: #ffffff"
                ><Amount
                  style="margin-right: 5px; margin-left: 5px; color: #ffffff"
                  :balance="withdrawAmountWei.toString()"
                  :decimals="infoWithdraw.decimals"
                  :precision="100"
                />
                {{ infoWithdraw.symbol }}</span
              >
              (Network fee
              <span style="color: #ffffff"
                ><Amount
                  style="margin-right: 5px; margin-left: 5px; color: #ffffff"
                  :balance="infoWithdraw.withdrawFee"
                  :decimals="infoWithdraw.decimals"
                  :precision="100"
                />
                {{ infoWithdraw.symbol }}</span
              >)</span
            ></el-row
          >
        </div>
        <div
          style="margin-top: 5px; color: #ffffff; word-break: break-word"
          v-if="'deposit' == actionType"
        >
          <el-row
            ><span style="color: #ffffff80; margin-right: 5px"
              >Availability:
            </span>
            <Amount
              style="margin-right: 5px; margin-left: 5px; color: #ffffff"
              :balance="infoDeposit.balanceOf"
              :decimals="infoDeposit.decimals"
              :precision="100"
            />
            <span style="color: #ffffff">{{ infoDeposit.symbol }}</span>
          </el-row>
          <el-row
            ><span style="color: #ffffff80; margin-right: 5px"
              >Min Deposit:
              <span style="color: #ffffff">
                <Amount
                  style="margin-right: 5px; margin-left: 5px; color: #ffffff"
                  :balance="infoDeposit.minDeposit"
                  :decimals="infoDeposit.decimals"
                  :precision="100"
                />
                {{ infoDeposit.symbol }}</span
              >
            </span></el-row
          >
        </div>
        <div style="display: flex; justify-content: center">
          <el-button
            class="btn-transfer-versiontransfer"
            :loading="transferLoading"
            @click="handleTransfer()"
          >
            <el-row
              v-if="'withdraw' == actionType || 'deposit' == actionType"
              >{{ btnContent }}</el-row
            >
            <el-row v-else>
              <IconifyIconOnline
                style="margin-right: 3px"
                icon="mingcute:transfer-fill"
              />Transfer
            </el-row>
          </el-button>
        </div>
      </div>
      <div v-if="'deposit' == actionType">
        <div
          v-if="
            !infoDeposit.enables && 'deposit' == actionType && !transferLoading
          "
          class="disable-deposit"
        >
          <div>
            <IconifyIconOnline
              style="font-size: 50px; color: #ce4b4b"
              icon="ic:baseline-do-not-disturb"
            />
          </div>
          <div style="word-break: break-word; text-align: center">
            <span> This token is temporarily suspended from deposit</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.transfer-dialog {
  // for dialog---------
  :deep(.dialog-type2.versiontransfer) {
    max-width: 480px;
    width: 95%;
  }
  :deep(.el-dialog__body) {
    padding-top: 10px;
    color: #fff;
    border-top: 1px solid #2c356d;
  }
  :deep(.el-dialog__header) {
    padding: 15px;
  }
  :deep(.el-dialog.dialog-type2 .el-dialog__title) {
    font-size: 22px;
    color: rgb(255 255 255 / 90%);
  }
  :deep(.el-dialog__headerbtn) {
    background: #1c2762;
    border-radius: 5px;
    width: 30px;
    height: 30px;
    top: 11px;
    right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s;
    &:hover {
      background: #263378;
    }
  }
  :deep(.el-dialog__headerbtn .el-dialog__close) {
    color: #ffffff8f;
    font-size: 22px;
  }
  // end dialog---------

  // for input-------------------
  .input-position {
    margin-top: 15px;
  }
  :deep(.el-input__wrapper) {
    height: 40px;
    background-color: rgba(0, 0, 0, 0.2);
    box-shadow: unset;
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    --el-input-placeholder-color: #6a6c6e;
  }
  :deep(.el-input__inner) {
    color: #fff;
    text-overflow: ellipsis;
  }
  :deep(.el-input-number .el-input__inner) {
    text-align: left;
  }
  :deep(.el-input-number) {
    width: 100%;
  }
  :deep(.el-input-number.is-controls-right .el-input-number__decrease) {
    border-left: unset;
    background: #1c2762;
    color: #9ba0ba;
    &:hover {
      background: #263378;
      color: #1264f2;
      transition: all 0.25s;
    }
  }
  :deep(.el-input-number.is-controls-right .el-input-number__increase) {
    border-left: unset;
    background: #1c2762;
    color: #9ba0ba;
    border-bottom: 1px solid #0c1337;
    &:hover {
      background: #263378;
      color: #1264f2;
      transition: all 0.25s;
    }
  }
  :deep(.el-form-item) {
    margin-bottom: 10px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  :deep(.el-input__wrapper.is-focus) {
    box-shadow: #1264f2 0px 0px 1px 1px inset;
  }
  :deep(.el-input-group__append) {
    box-shadow: unset;
    background-color: #0c1337;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
  }
  // end input-------------------

  .disable-deposit {
    margin-top: 15px;
    border-radius: 5px;
    font-size: 16px;
    // border: 1px dashed #1c2862;
    color: #9ba0ba;
    padding: 10px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .btn-versiontransfer {
    height: 40px;
    background-color: rgb(12 19 55);
    border: none;
    display: flex;
    align-items: center;
    border-top-left-radius: unset;
    border-bottom-left-radius: unset;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    font-weight: bolder;
    &:hover {
      color: #1264f2;
      background-color: rgb(12 19 55);
      transition: all 0.25s;
    }
  }
  .btn-transfer-versiontransfer {
    margin-top: 20px;
    background-color: #1264f2;
    color: #fff;
    border: none;
    border-radius: 10px;
    &:hover {
      transition: all 0.25s;
      background-color: #3177ef;
    }
  }
  .error {
    color: #ff4545;
    word-break: break-word;
    margin-top: 5px;
    font-size: 14px;
    transition: all 0.25s;
  }
}
</style>
