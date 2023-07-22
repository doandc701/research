<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { useUserStoreHook } from "/@/store/modules/user";
import { useAppStoreHook } from "/@/store/modules/app";
import { parseTime, timestampToUTC } from "/@/utils";
import { TableProBar } from "/@/components/ReTable";
import { getRoleList } from "/@/api/system";
import { fundingHistory, fundingBalance } from "/@/api/user";
import { fromWei } from "/@/utils/connex";
import { TokenDetails } from "/@/types/collection";
import { emitter } from "/@/utils/mitt";

import Amount from "/@/components/Amount/index.vue";
import AddressDropdown from "/@/components/AddressDropdown/index.vue";
import AddressDialog from "/@/components/AddressDialog/index.vue";
import Symbol from "/@/components/Symbol/index.vue";
import TransferDialog from "/@/components/TransferDialog/index.vue";
import vpuImg from "/img/tokens/vpu.png";
import iconDthor from "/img/icons/logo-dthor.png";

const debug = ref(false);
const dialogVisible = ref(false);
const transferDialogEl = ref(null);
const dataList = ref([]);
const loading = ref(true);
const totalPage = ref(0);
// take fundingBalance
const checkBalanceBtnLoading = ref(false);
const userBalance = ref(undefined);
const addressDialog = ref(null);
const txIdAddress = ref("");
const loadingAll = ref(false);
let timeout01 = null;
const leaderboardList = ref([]);
const leaderboardBtnLoading = ref(false);
const withdrawLoading = ref(false);
const activeName = ref("first");
const activeTokenAddress = ref("");
const myAddr = computed(() => {
  return useUserStoreHook().dAccount.myAddr;
  // return "0xD8e60aAA58dA6492642b4b730514439F7DDbf4Cd" // test
  // return "0x04E8E6C97A0Ce564B6C5C86E46c47D80578B28D8"; // test
});

const tokenList = computed(() => {
  return useAppStoreHook().tokenList;
});

watch(myAddr, newAddr => {
  // console.log("newAddr", newAddr);
  if (newAddr) {
    checkUserBalance();
    checkBalanceOf();
  }
});

onMounted(() => {
  onSearch();
  const pass = Date.now() - useAppStoreHook().started;
  if (pass < 1500) {
    loadingAll.value = true;
    timeout01 = setTimeout(checkUserBalance, 1500 - pass);
  } else {
    checkUserBalance();
  }
});

onBeforeUnmount(() => {
  clearTimeout(timeout01);
});

async function onSearch() {
  loading.value = true;
  let { data } = await getRoleList();
  dataList.value = data.list;
  totalPage.value = data.total;
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

function handleLeaderboard() {
  if (debug.value) console.log("handleLeaderboard");
  getList();
}

function getList() {
  leaderboardBtnLoading.value = true;
  fundingHistory(`address=${myAddr.value.toLowerCase()}&page=1&limit=20`)
    .then(result => {
      if (debug.value) console.log("fundingHistory-result", result);
      dialogVisible.value = true;
      if (result.data && result.data.fundHistoryList) {
        const data = result.data.fundHistoryList;
        // console.log("fundHistoryList", data);
        leaderboardList.value = [];
        for (let i = 0; i < data.length; i++) {
          let note = data[i].note;
          if (data[i].type === "out") {
            note = data[i].txId
              ? "Successful transaction"
              : "Pending, can be up to 8 hours";
          }
          let gameDay = "";
          if (data[i].type === "in" && data[i].memo) {
            const arr = data[i].memo.split("_");
            if (arr.length >= 2) {
              const day = parseInt(arr[1]);
              gameDay = " - " + timestampToUTC(day * 86400, "{y}-{m}-{d}");
            }
          }
          const date = parseTime(new Date(data[i].createdAt));
          leaderboardList.value.push({
            type: data[i].type,
            amount: fromWei(data[i].amount), // new window.web3.utils.BN(data[i].amount),
            note: `${note}${gameDay}`,
            addressV: "addressV",
            txId: data[i].txId,
            date
          });
        }
      }
      leaderboardBtnLoading.value = false;
    })
    .catch(error => {
      console.log(error);
      leaderboardBtnLoading.value = false;
    });
}

async function checkUserBalance() {
  loadingAll.value = myAddr.value ? true : false;
  if (!myAddr.value) return;
  checkBalanceOf();
  checkBalanceBtnLoading.value = true;
  withdrawLoading.value = true;
  fundingBalance(`address=${myAddr.value}`)
    .then(result => {
      // if (debug.value) console.log("fundingBalance-result", result);
      checkBalanceBtnLoading.value = false;
      withdrawLoading.value = false;
      if (!result.data || !result.data.success) return;
      userBalance.value = fromWei(result.data.balance);
      loadingAll.value = false;
    })
    .catch(error => {
      console.log(error);
      checkBalanceBtnLoading.value = false;
      withdrawLoading.value = false;
      loadingAll.value = false;
    });
}

function recheckUserBalance() {
  if (checkBalanceBtnLoading.value) return;
  checkBalanceBtnLoading.value = true;
  let refreshIcon = document.getElementById("refresh-icon");
  refreshIcon.style.animationDuration = "0.5s";
  setTimeout(() => {
    refreshIcon.style.animationDuration = "0s";
    checkUserBalance();
  }, 1000);
}

// message when doesn't connect wallet
const openMess = () => {
  if (!myAddr.value) {
    ElMessageBox.alert(
      "Please connect your wallet.",
      "Missing wallet address",
      {
        confirmButtonText: "OK",
        type: "warning"
      }
    );
  }
};

// mesage comming soon
function handleExplore() {
  ElMessage("coming soon!");
}

// dialog Address
const openAddressDialog = txId => {
  addressDialog.value.open();
  txIdAddress.value = txId;
  if (debug.value) console.log(txId);
};

function checkBalanceOf() {
  return useAppStoreHook().updateTokenList();
}

function connectWallet() {
  emitter.emit("connectWallet");
}

// TransferDialog
function showTransferDialog(item: TokenDetails) {
  if (debug.value) console.log("showTransferDialog", item);
  transferDialogEl.value.openTransferToken(item);
}
function showWithdrawDialog(userBalance: void) {
  if (debug.value) console.log("showWithdrawDialog", userBalance);
  transferDialogEl.value.openWithdraw(userBalance);
}
</script>

<template>
  <div class="your-wallet-container" v-loading.fullscreen.lock="loadingAll">
    <h3 class="app-con-title">Your Wallet</h3>
    <div class="myWallet-tab">
      <el-tabs v-model="activeName" class="tabs-type01">
        <el-tab-pane label="Funding" name="first">
          <div
            v-if="!myAddr"
            class="bg-tab"
            style="
              width: 100%;
              height: 350px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: rgba(255, 255, 255, 0.75);
            "
          >
            <el-row
              ><IconifyIconOnline
                style="font-size: 50px"
                icon="pajamas:warning-solid"
            /></el-row>
            <el-row>Please link your wallet !</el-row>
            <el-button
              v-if="!myAddr"
              @click="connectWallet"
              class="btn-connect-wallet"
            >
              <IconifyIconOnline
                style="margin-right: 6px; font-size: 17px"
                class="arrow-down"
                icon="ic:baseline-link"
              /><IconifyIconOnline
                style="margin-right: 6px; font-size: 17px"
                class="arrow-down"
                icon="ri:login-circle-line"
              />Linked wallet</el-button
            >
          </div>
          <div class="bg-tab" v-else>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 15px;
              "
            >
              <el-row
                style="letter-spacing: 1px; color: #fff; align-items: center"
              >
                Address:
                <el-dropdown popper-class="addressDropdown-arrow">
                  <span class="el-dropdown-link">
                    <el-link class="num-break-all">{{ myAddr }}</el-link>
                  </span>
                  <template #dropdown>
                    <AddressDropdown
                      title="View address"
                      :account-address="myAddr"
                    />
                  </template>
                </el-dropdown>
              </el-row>
              <el-row>
                <el-button
                  id="refresh-button"
                  class="refresh-end"
                  @click="recheckUserBalance"
                >
                  <IconifyIconOffline
                    id="refresh-icon"
                    class="refresh-start"
                    icon="refresh-right"
                  />
                </el-button>
              </el-row>
            </div>
            <el-collapse accordion v-model="activeTokenAddress">
              <el-collapse-item>
                <template #title>
                  <div style="display: inline-flex">
                    <Symbol
                      style="
                        margin-right: 7px;
                        display: flex;
                        align-items: center;
                      "
                      :src="vpuImg"
                      :size="30"
                    />
                    <el-col>
                      <div class="text-info-token">VPU</div>
                      <div
                        style="color: #797979; font-size: 14px"
                        class="text-info-token"
                      >
                        Vpunks Token
                      </div>
                    </el-col>
                  </div>
                  <div style="display: inline-flex">
                    <el-col>
                      <div class="text-info-token-right">
                        {{ checkBalanceBtnLoading ? "..." : userBalance }}
                      </div>
                      <div
                        style="color: #797979; font-size: 14px"
                        class="text-info-token-right"
                      >
                        - / - USDT
                      </div>
                    </el-col>
                  </div>
                </template>
                <div class="btn-gr-position">
                  <div class="btn-gr-position">
                    <el-button @click="handleExplore" class="btn-gr-address"
                      >Deposit</el-button
                    >
                    <el-button
                      @click="showWithdrawDialog(userBalance)"
                      class="btn-gr-address"
                      >Withdraw</el-button
                    >
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
            <el-row
              style="margin-top: 15px; display: flex; justify-content: center"
              class="button-position"
            >
              <el-button
                @click="openMess"
                v-if="!myAddr"
                class="button-type1"
                style="color: #ffff"
                >History</el-button
              >
              <el-button
                v-else
                :loading="leaderboardBtnLoading"
                class="button-type1"
                style="color: #ffff"
                @click="handleLeaderboard"
                >History</el-button
              ></el-row
            >
          </div>
        </el-tab-pane>
        <el-tab-pane label="Vechain Network" name="second">
          <div
            v-if="!myAddr"
            class="bg-tab"
            style="
              width: 100%;
              height: 350px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: rgba(255, 255, 255, 0.75);
            "
          >
            <el-row
              ><IconifyIconOnline
                style="font-size: 50px"
                icon="pajamas:warning-solid"
            /></el-row>
            <el-row>Please connect your wallet !</el-row>
            <el-button
              v-if="!myAddr"
              @click="connectWallet"
              class="btn-connect-wallet"
            >
              <IconifyIconOnline
                style="margin-right: 6px; font-size: 17px"
                class="arrow-down"
                icon="uil:wallet"
              />Connect wallet</el-button
            >
          </div>
          <div v-else class="bg-tab">
            <el-row
              style="
                letter-spacing: 1px;
                color: #fff;
                align-items: center;
                margin-bottom: 5px;
              "
            >
              Address:
              <el-dropdown popper-class="addressDropdown-arrow">
                <span class="el-dropdown-link">
                  <el-link class="num-break-all">{{ myAddr }}</el-link>
                </span>
                <template #dropdown>
                  <AddressDropdown
                    title="View address"
                    :account-address="myAddr"
                  />
                </template>
              </el-dropdown>
            </el-row>
            <el-row style="margin-bottom: 15px; color: #fa8914"
              >This is your on-chain asset we do not manage, we only
              show.</el-row
            >
            <div class="token-list">
              <div v-for="item in tokenList" :key="item.address">
                <el-collapse accordion v-model="activeTokenAddress">
                  <el-collapse-item>
                    <template #title>
                      <div style="display: inline-flex">
                        <Symbol
                          style="
                            margin-right: 7px;
                            display: flex;
                            align-items: center;
                          "
                          :src="item.logoURI"
                          :size="30"
                        />
                        <el-col>
                          <div class="text-info-token">{{ item.symbol }}</div>
                          <div
                            style="color: #797979; font-size: 14px"
                            class="text-info-token"
                          >
                            {{ item.name }}
                          </div>
                        </el-col>
                      </div>
                      <div style="display: inline-flex">
                        <el-col class="positon-right">
                          <div>
                            <Amount
                              class="text-info-token-right"
                              :balance="item.balanceOf"
                              :decimals="item.decimals"
                              :precision="6"
                            />
                          </div>
                          <div
                            style="color: #797979; font-size: 14px"
                            class="text-info-token-right"
                          >
                            - / - USDT
                          </div>
                        </el-col>
                      </div>
                    </template>
                    <div class="btn-gr-position">
                      <el-button
                        @click="showTransferDialog(item)"
                        class="btn-gr-address"
                        >Transfer</el-button
                      >
                      <router-link style="margin-left: 12px" to="/dthor">
                        <el-button class="btn-gr-address">
                          <el-image
                            style="width: 18px; margin-right: 3px"
                            :src="iconDthor" />Dthor Swap<IconifyIconOnline
                            style="margin-left: 3px"
                            icon="uil:external-link-alt"
                        /></el-button>
                      </router-link>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- dialog History -->
      <el-dialog
        v-model="dialogVisible"
        title="History"
        custom-class="dialog-type1"
        :show-close="true"
      >
        <AddressDialog
          ref="addressDialog"
          :account-address="txIdAddress"
          title="View transaction"
        />
        <TableProBar
          title="Last 20 transactions"
          :dataList="dataList"
          :loading="false"
          :tableRef="{
            size: false
          }"
          @refresh="onSearch"
          class="tableProBar"
          style="
            background-color: #c0c0c000;
            margin: 7px;
            padding: 0px;
            margin-right: 0 !important;
          "
        >
          <template #buttons>
            <el-button type="primary" />
          </template>
          <template v-slot="{ size }">
            <el-row class="content">Last 30 transactions</el-row>
            <el-table
              border
              :size="size"
              :data="leaderboardList"
              style="width: 100%"
              fit
              highlight-current-row
            >
              <el-table-column align="center" label="Type" min-width="65">
                <template v-slot="{ row }">
                  {{ row.type }}
                </template>
              </el-table-column>

              <el-table-column
                label="Amount"
                align="center"
                min-width="185"
                class-name="small-padding"
              >
                <template v-slot="{ row }">
                  {{ row.amount }}
                </template>
              </el-table-column>

              <el-table-column
                label="Note"
                align="center"
                min-width="310"
                class-name="small-padding"
              >
                <template v-slot="{ row }">
                  {{ row.note }}
                </template>
              </el-table-column>
              <el-table-column
                label="Processed Time"
                align="center"
                min-width="125"
                class-name="small-padding"
              >
                <template v-slot="{ row }">
                  <template v-if="row.txId">
                    <el-link
                      rel="noopener"
                      type="primary"
                      @click.prevent="openAddressDialog(row.txId)"
                    >
                      {{ row.date }}
                    </el-link>
                  </template>
                  <template v-else>
                    {{ row.date }}
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </TableProBar>
        <template #footer>
          <div style="display: flex; justify-content: flex-end">
            <el-button
              class="btn-close"
              type="info"
              plain
              @click="dialogVisible = false"
            >
              Close
              <IconifyIconOnline icon="ep:close" />
            </el-button>
          </div>
        </template>
      </el-dialog>
      <!-- end dialog History -->
      <TransferDialog ref="transferDialogEl" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.your-wallet-container {
  color: #fff;
  h3 {
    font-size: 20px;
  }
  .app-con-title {
    margin: 20px 0;
    display: block;
    margin-block-start: 1.33em;
    margin-block-end: 1.33em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
  .content {
    color: #c2c2c2;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .num-break-all {
    margin-left: 5px;
    color: #53a7ff;
    word-break: break-all;
  }
  .button-position {
    display: flex;
    justify-content: center;
    margin-top: 50px;
  }
  .refresh-end {
    background: transparent;
    border: 1px solid rgb(42, 51, 96);
    color: rgb(214, 214, 214);
    display: flex;
    align-items: center;
    .refresh-start {
      font-size: 16px;
    }
    &:hover {
      border: 1px solid rgb(56, 68, 130);
      color: #4999ff;
    }
  }
  :deep(.el-dialog.dialog-type1) {
    width: 90%;
  }
  :deep(.el-dialog__body) {
    // padding: 0px;
    padding-right: 13px;
    padding-left: 13px;
  }
  // for table
  :deep(.el-table th.el-table__cell) {
    background: #202956;
    color: #fff;
    // border: none;
  }
  :deep(.el-table__row) {
    background: #0d1333;
    &:hover {
      background: #152166;
    }
  }
  :deep(.el-table--enable-row-hover
      .el-table__body
      tr:hover
      > td.el-table__cell) {
    background: #1a224d;
  }
  :deep(.el-table__body tr.current-row > td.el-table__cell) {
    background-color: #1a224d;
  }
  :deep(.el-table tr) {
    // background-color: #9b3737 !important;
    background-color: #37469b !important;
  }
  .el-table {
    // --el-table-border-color: #37469b;
    border-radius: 0px;
    --el-table-border-color: #37469b;
    // --el-table-border: 1px solid #37469b;
  }
  :deep(.el-table .cell) {
    word-break: break-word !important;
  }
  :deep(.el-table__empty-block) {
    background-color: #0f1845;
  }
  :deep(.el-table--enable-row-transition .el-table__body td.el-table__cell) {
    background-color: #0f1845;
    color: #bbb;
  }
  .btn-max {
    background-color: #2a3969;
    color: #fff;
    border: none;
    &:hover {
      background-color: #3d5295;
      color: #fff;
    }
  }
  .btn-close {
    --el-button-bg-color: #293366;
    --el-button-border-color: #384482;
    --el-button-hover-bg-color: #293366;
    --el-button-hover-border-color: #485bb9;
    --el-button-active-text-color: #415ce3 !important;
  }
  // end for table ---------

  // newww css here
  // collapse begin
  :deep(.el-collapse) {
    --el-collapse-border-color: transparent;
    --el-collapse-header-text-color: #fff;
    --el-collapse-header-font-size: 16px;
    --el-collapse-content-text-color: #fff;
    --el-collapse-content-bg-color: transparent;
  }
  :deep(.el-collapse-item__header) {
    line-height: unset;
    background-color: transparent;
    border-bottom: 0px;
    padding: 15px;
    height: 60px;
    justify-content: space-between;
    &:hover {
      background-color: #0b102b;
      border-radius: 10px;
    }
  }
  :deep(.el-collapse-item__arrow) {
    display: none;
  }
  :deep(.el-collapse-item__content) {
    padding-bottom: 10px;
    padding-top: 10px;
  }
  :deep(.el-collapse-item.is-active) {
    background-color: #0b102b;
    border-radius: 15px;
    padding: 10px;
    transition: 0.25s linear all;
    .positon-right {
      transition: 0.25s linear all;
    }
  }
  :deep(.el-collapse-item) {
    transition: 0.25s linear all;
  }
  // end collapse

  .myWallet-tab {
    .bg-tab {
      background-color: #171b33;
      padding: 15px;
      border-radius: 15px;
    }
    .text-info-token-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .text-info-token {
      display: flex;
      align-items: center;
      font-weight: bold;
    }
    .btn-gr-position {
      margin-top: 10px;
      display: flex;
      justify-content: center;
    }
    .btn-gr-address {
      background-color: transparent;
      border: 1px solid #1264f2;
      border-radius: 10px;
      color: #cccccc;
      &:hover {
        background-color: #1264f2;
      }
    }
    .refresh-end {
      background: transparent;
      border: 1px solid rgb(42, 51, 96);
      color: rgb(214, 214, 214);
      display: flex;
      align-items: center;
      .refresh-start {
        font-size: 16px;
      }
      &:hover {
        border: 1px solid rgb(56, 68, 130);
        color: #4999ff;
      }
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .refresh-start {
    animation-name: rotate;
    animation-duration: 0s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-play-state: running;
  }
  .refresh-end {
    animation-play-state: paused !important;
  }
  #refresh-button {
    animation-play-state: running;
  }
}
@media only screen and(max-width: 460px) {
  .your-wallet-container {
    margin: 10px !important;
    .myWallet-tab {
      .bg-tab {
        padding: 8px;
      }
      :deep(.el-collapse-item__header) {
        padding: 4px;
      }
      :deep(.el-collapse-item.is-active) {
        padding: 5px;
      }
    }
  }
}
</style>
