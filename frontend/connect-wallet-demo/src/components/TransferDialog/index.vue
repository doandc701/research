<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import {
  CollectionDetails01,
  ItemShow01,
  TokenDetails
} from "/@/types/collection";
import { useGlobal } from "@pureadmin/utils";
import { useUserStoreHook } from "/@/store/modules/user";
import { getCollecAddr } from "/@/settings";
import { fromWei, toWei, formatFloatNumber } from "/@/utils/connex";
import { fundingWithdraw } from "/@/api/user";
import { useAppStoreHook } from "/@/store/modules/app";

import BigNumber from "bignumber.js";
import ERC1155 from "/@/contractCall/ERC1155";
import ERC721 from "/@/contractCall/ERC721";
import ERC20 from "/@/contractCall/ERC20";
import TxInfoDialog from "/@/components/TxInfoDialog/index.vue";
import Amount from "/@/components/Amount/index.vue";

const { $connex } = useGlobal<GlobalPropertiesApi>();
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
const feeAmount = ref("2");
const newInputAmount = ref(undefined);
const wei = ref(undefined);
const bnBalance: any = ref("");
const addressZero = "0x0000000000000000000000000000000000000000";
// widthdraw
const userBalanceFund = ref(undefined);
const withdrawAmountApi = ref("0");
//
const myAddr = computed(() => {
  return useUserStoreHook().dAccount.myAddr;
});
const actionType = ref(
  "transferItem" as "transferItem" | "transferToken" | "withdraw"
);
// use for withdraw
const withdrawInfo: Indexable = [
  {
    contents: "You will receive",
    Address: null,
    Network: "VeChain",
    Source: "Funding Wallet",
    Token: "VPU",
    Receive: null,
    Amount: null,
    Network_Fee: "2 VPU"
  }
];
const titleWithdraw = "Withdraw confirmation";
const infoContents = // `<ul style="list-style: circle;"><li>Ensure that the address is correct and on the same network.</li><br /><li>Transactions cannot be cancelled.</li></ul>`;
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
  inputAmount.value = "";
  inputAmountError.value = "";
  inputRecipientError.value = "";

  collectionCodename.value = collection_details.value.codename.split();
  collectionStandard.value = collection_details.value.standard.split();
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
function openWithdraw(userBalance: any) {
  actionType.value = "withdraw";
  if (debug.value) console.log("withdraw");
  dialogTransfer.value = true;
  userBalanceFund.value = userBalance;
  handleTitle();

  inputRecipient.value =
    myAddr.value.slice(0, 10) + "..." + myAddr.value.slice(-10); // only withdraw to user wallet using

  inputAmount.value = "";
  inputAmountError.value = "";
  inputRecipientError.value = "";
}

function handleAmountVip() {
  if (collectionStandard.value == "VIP-181") {
    itemDetails.value.quantity = 1;
    inputAmount.value = 1;
  } else {
    inputAmount.value = "";
  }
}

function maxValue() {
  if (actionType.value == "transferItem") {
    inputAmount.value = itemDetails.value.quantity;
  }
  if (actionType.value == "transferToken") {
    inputAmount.value = fromWei(bnBalance.value);
    handleInputTokenAmount();
  }
  if (actionType.value == "withdraw") {
    inputAmount.value = userBalanceFund.value;
    handleInputTokenAmount();
  }
}

// input error
function handleInputItemAmount() {
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
    if (actionType.value != "withdraw") {
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
  } catch (error) {
    console.log(error);
    inputRecipientError.value = "Please enter a address!";
  }
}
// -------

// input token
function handleInputTokenAmount() {
  if (!myAddr.value) return;
  try {
    inputAmount.value = inputAmount.value.replace(/[^\d.]/g, "");
    inputAmount.value = formatFloatNumber(inputAmount.value, 18, 25);
    newInputAmount.value = inputAmount.value;
    wei.value = toWei(inputAmount.value, 18, 25);
    newInputAmount.value = fromWei(wei.value);
    const amountBN = new BigNumber(newInputAmount.value);
    const userBalanceBN = new BigNumber(fromWei(bnBalance.value));

    if (actionType.value == "transferToken") {
      if (wei.value == "") {
        inputAmountError.value = "Please enter a valid number!";
      } else if (inputAmount.value == "") {
        inputAmountError.value = "Please enter a valid number!";
      } else if (amountBN.gt(userBalanceBN)) {
        inputAmountError.value = "Not enough balance";
      } else if (inputAmount.value <= 0) {
        inputAmountError.value = "Please enter a valid number!";
      } else {
        inputAmountError.value = null;
      }
    }

    if (actionType.value == "withdraw") {
      withdrawAmountApi.value = fromWei(
        new BigNumber(wei.value).minus(toWei(feeAmount.value))
      );
      const minWeiBN = new BigNumber("50");
      const userBalanceFundBN = new BigNumber(
        fromWei(toWei(userBalanceFund.value, 18, 25))
      );

      if (inputAmount.value > 0 && inputAmount.value % 1 == 0) {
        inputAmount.value = fromWei(wei.value).replace(".", "");
        withdrawAmountApi.value = withdrawAmountApi.value.replace(".", "");
      }

      withdrawInfo[0].Address = myAddr.value;
      withdrawInfo[0].Receive = withdrawAmountApi.value;
      withdrawInfo[0].Amount = inputAmount.value;

      if (amountBN.lt(minWeiBN)) {
        inputAmountError.value = "Withdraw amount must be at least 50 VPU";
        return;
      }
      if (inputAmount.value == "") {
        inputAmountError.value = "Please enter a valid number!";
      } else if (amountBN.gt(userBalanceFundBN)) {
        inputAmountError.value = "Not enough balance!";
      } else {
        inputAmountError.value = null;
      }
    }

    if (inputAmount.value > 0 && inputAmount.value % 1 == 0) {
      inputAmount.value = fromWei(wei.value).replace(".", "");
      withdrawAmountApi.value = withdrawAmountApi.value.replace(".", "");
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
      titleDialog.value = `Withdraw VPU`;
      inputContent.value = "Amount";
      btnContent.value = "Withdraw";
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
    "rejected"
) {
  if (mss === "success") {
    transferLoading.value = false;
    if (actionType.value === "transferToken") {
      return useAppStoreHook().updateTokenList();
    }
  } else {
    // Cancel, Error or reverted
    transferLoading.value = false;
  }
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
    // console.log("wei.value", wei.value);
    if (infoToken.value.address === addressZero) {
      clauses.push({
        to: inputRecipient.value,
        value: wei.value,
        data: "0x",
        comment: mss
      });
    } else {
      clauses.push(
        new ERC20(infoToken.value.address, $connex).transfer(
          inputRecipient.value,
          wei.value,
          mss
        )
      );
    }
  } else {
    transferLoading.value = true;
  }
  try {
    if (actionType.value == "withdraw") {
      // console.log(wei.value);
      return Promise.race([
        myPromise,
        fundingWithdraw(`address=${myAddr.value}&amount=${wei.value}`)
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
    wei.value == undefined
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
  openWithdraw
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
        ['transferItem', 'transferToken', 'withdraw'].includes(actionType)
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
      <div class="input-position">
        <span style="font-size: 16px">Recipient Address</span>
        <div style="margin-top: 10px">
          <el-input
            id="paste-bin"
            class="input-recipient"
            v-model="inputRecipient"
            :disabled="actionType == 'withdraw'"
            placeholder="Press and hold to paste"
            @change="handleInputRecipient()"
          >
            <template #append>
              <el-tooltip effect="dark" content="Paste" placement="top-start">
                <el-button
                  :disabled="actionType == 'withdraw'"
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
          v-if="'transferToken' === actionType || 'withdraw' === actionType"
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
          {{ userBalanceFund }} VPU
        </el-row>
        <el-row
          ><span style="color: #ffffff80; margin-right: 5px"
            >Receive amount:
            <span style="color: #ffffff">{{ withdrawAmountApi }} VPU</span>
            (Network fee
            <span style="color: #ffffff">{{ feeAmount }} VPU</span>)</span
          ></el-row
        >
      </div>
      <div style="display: flex; justify-content: center">
        <el-button
          class="btn-transfer-versiontransfer"
          :loading="transferLoading"
          @click="handleTransfer()"
          ><el-row v-if="'withdraw' == actionType">{{ btnContent }}</el-row>
          <el-row v-else>
            <IconifyIconOnline
              style="margin-right: 3px"
              icon="mingcute:transfer-fill"
            />Transfer
          </el-row>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.transfer-dialog {
  // for dialog---------
  :deep(.dialog-type2.versiontransfer) {
    max-width: 320px;
    width: 85%;
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
    margin-top: 5px;
    font-size: 14px;
    transition: all 0.25s;
  }
}
</style>
