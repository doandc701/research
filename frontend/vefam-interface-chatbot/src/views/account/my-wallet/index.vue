<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, h } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { useUserStoreHook } from "/@/store/modules/user";
import { useAppStoreHook } from "/@/store/modules/app";
import { parseTime, timestampToUTC } from "/@/utils";
import { TableProBar } from "/@/components/ReTable";
import { getRoleList } from "/@/api/system";
import { fundingHistory, fundingBalances } from "/@/api/user";
import { fromWei } from "/@/utils/connex";
import { TokenDetails, FundingTokenDetails } from "/@/types/collection";
import { emitter } from "/@/utils/mitt";
import { useRouter } from "vue-router";

import Amount from "/@/components/Amount/index.vue";
import AddressDropdown from "/@/components/AddressDropdown/index.vue";
import AddressDialog from "/@/components/AddressDialog/index.vue";
import Symbol from "/@/components/Symbol/index.vue";
import TransferDialog from "/@/components/TransferDialog/index.vue";
import iconDthor from "/img/icons/logo-dthor.png";
import Pagination from "/@/components/Pagination/index.vue";

const router = useRouter();
const debug = ref(false);
const dialogVisible = ref(false);
const transferDialogEl = ref(null);
const dataList = ref([]);
const loading = ref(true);
const totalPage = ref(0);
// take fundingBalances
const checkBalanceBtnLoading = ref(false);
const checkBalanceVechain = ref(false);
const addressDialog = ref(null);
const txIdAddress = ref("");
const loadingAll = ref(false);
let timeout01 = null;
const leaderboardList = ref([]);
const leaderboardBtnLoading = ref(false);
const withdrawLoading = ref(false);
const activeName = ref("funding");
const activeTokenAddress = ref("");
let queryTabName = router.currentRoute.value.query.tab;
const pageQuery = ref({
  page: 1,
  limit: 30, //
  pageSizes: [20, 30, 50, 100] // recommended: [100]
});
const totalItems = ref(0);
// const tabList = ["funding", "vechain-network"];
// console.log("queryTabName", queryTabName);
const userStoreHook = useUserStoreHook();
// C-Account
const userName = computed(() => {
  return userStoreHook.cAccount.userName;
});
const cALinkedCode = computed(() => {
  return userStoreHook.cAccount.linkedCode;
});
const cALinkedAddr = computed(() => {
  return userStoreHook.cAccount.linkedAddr;
});
const cAStage = computed(() => {
  return userStoreHook.cAccount.stage;
});

// D-Account
const myAddr = computed(() => {
  return userStoreHook.dAccount.myAddr;
  // return "0xD8e60aAA58dA6492642b4b730514439F7DDbf4Cd" // test
  // return "0x04E8E6C97A0Ce564B6C5C86E46c47D80578B28D8"; // test
});

/*
Danh sách ví funding và số dư fetch từ server
● depositStatus: 3: ẩn, 4: đình chỉ nạp
    - sau đó cần kiểm tra thêm các status trên smart contract
● withdrawStatus: 3: ẩn, 4: đình chỉ rút, 5: đình chỉ rút và chi-tiêu&nhận, 6: đình chỉ chi-tiêu&nhận
# note:
- ẩn là đình chỉ tất cả và lâu dài
- depositStatus: 4, hiện đang không sử dụng ở đây
*/
const fundingWalletList = computed((): FundingTokenDetails => {
  return useAppStoreHook().fundingWalletList;
});

// danh sách token và số dư on-chain
const tokenList = computed(() => {
  return useAppStoreHook().tokenList;
});

watch(myAddr, newAddr => {
  if (newAddr) {
    checkBalanceOf();
    checkUserBalance();
  }
});

onMounted(() => {
  // dùng để thay đổi đường dẫn
  // if (tabList.includes(queryTabName)) {
  //   activeName.value = queryTabName;
  // }
  // queryTabName = "funding"; dùng để thay đổi đường dẫn
  // router.replace({
  //   name: router.currentRoute.value.name,
  //   query: { tab: queryTabName }
  // });
  // checkUserBalance();
  onSearch();
  const pass = Date.now() - useAppStoreHook().started;
  if (pass < 1500) {
    timeout01 = setTimeout(checkUserBalance, 1500 - pass);
  } else {
    checkUserBalance();
  }
});

onBeforeUnmount(() => {
  clearTimeout(timeout01);
});

function handleClick() {
  // dùng để thay đổi đường dẫn
  queryTabName = activeName.value;
  router.currentRoute.value.query.tab = queryTabName;
  // location.replace(
  //   "http://localhost:8848/app-dev/#/account/wallet?tab=" + queryTabName
  // );
  // router.replace({
  //   name: router.currentRoute.value.name,
  //   query: { tab: queryTabName }
  // });
}

async function onSearch() {
  loading.value = true;
  let { data } = await getRoleList();
  dataList.value = data.list;
  totalPage.value = data.total;
  setTimeout(() => {
    loading.value = false;
  }, 500);
}

function getItemListPage(data: { page: number; limit: number }) {
  getList();
  if (debug.value) console.log("getItemListPage:", data);
  if (debug.value)
    console.log(
      "pageQuery: page:",
      pageQuery.value.page,
      ", limit:" + pageQuery.value.limit
    );
}

function getItemListShow() {
  if (debug.value) console.log("getItemListShow");
  const start = (pageQuery.value.page - 1) * pageQuery.value.limit;
  let end = pageQuery.value.page * pageQuery.value.limit - 1;
  if (end > totalItems.value - 1) end = totalItems.value - 1;
  if (debug.value)
    console.log("getItemListShow, totalItems:" + totalItems.value);
  if (debug.value) console.log("getItemListShow, start:" + start, "end:" + end);
}

function handleLeaderboard() {
  if (debug.value) console.log("handleLeaderboard");
  dialogVisible.value = true;
  getList();
}

function getList() {
  leaderboardBtnLoading.value = true;
  fundingHistory(
    `address=${cALinkedAddr.value}&page=${pageQuery.value.page}&limit=${pageQuery.value.limit}`
  )
    .then(result => {
      if (debug.value)
        console.log("fundingHistory-result", result.data.fundHistoryList);
      totalItems.value = result.data.total;
      dialogVisible.value = true;
      if (result.data && result.data.fundHistoryList) {
        const data = result.data.fundHistoryList;
        // console.log("fundHistoryList", data);
        leaderboardList.value = [];
        for (let i = 0; i < data.length; i++) {
          const tokenDetails = tokenList.value.find(token => {
            return token.address.toLowerCase() === data[i].tokenAddress;
          });

          let note = data[i].note;
          // let noteDeposit = data[i];
          if (data[i].type === "out") {
            note = data[i].txId
              ? "Successful withdraw"
              : "Pending, can be up to 8 hours";
          }
          if (data[i].type === "in") {
            note =
              data[i].status === 0
                ? "Pending, can take a few minute"
                : "Successful deposit";
          }
          if (data[i].type === "add" || data[i].type === "sub") {
            if (data[i].note === undefined) {
              note = "";
            }
          }
          let gameDay = "";
          if (data[i].type === "add" && data[i].memo) {
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
            date,
            symbol: tokenDetails && tokenDetails.symbol
          });
        }
      }
      leaderboardBtnLoading.value = false;
      getItemListShow();
    })
    .catch(error => {
      console.log(error);
      leaderboardBtnLoading.value = false;
    });
}

async function checkUserBalance() {
  if (!cALinkedCode.value || !cALinkedAddr.value) return;
  useAppStoreHook().takeUserBalance();
  checkBalanceOf();
  loadingAll.value = true;
  checkBalanceBtnLoading.value = true;
  withdrawLoading.value = false;
  fundingBalances(`address=${cALinkedAddr.value}`)
    .then(result => {
      if (debug.value) console.log("fundingBalances-result", result); //
      if (debug.value)
        console.log("fundingWalletList", fundingWalletList.value);
      loadingAll.value = false;
      checkBalanceBtnLoading.value = false;
      withdrawLoading.value = false;
    })
    .catch(error => {
      console.log(error);
      checkBalanceBtnLoading.value = false;
      withdrawLoading.value = false;
      loadingAll.value = false;
    });
}

async function recheckUserBalance() {
  if (checkBalanceBtnLoading.value || loadingAll.value) return;
  checkBalanceBtnLoading.value = true;
  let refreshIcon = document.getElementById("refresh-icon");
  refreshIcon.style.animationDuration = "0.5s";
  setTimeout(() => {
    refreshIcon.style.animationDuration = "0s";
    useAppStoreHook().takeUserBalance();
    checkBalanceBtnLoading.value = false;
    // loadingAll.value = false;
    // checkUserBalance();
  }, 1000);
}

function recheckBalanceOf() {
  // checkBalanceOf();
  if (checkBalanceVechain.value) return;
  checkBalanceVechain.value = true;
  let refreshIcon = document.getElementById("refresh-vechain");
  refreshIcon.style.animationDuration = "0.5s";
  setTimeout(() => {
    refreshIcon.style.animationDuration = "0s";
    checkBalanceOf();
  }, 1000);
}

// message when doesn't connect wallet
const openMess = item => {
  ElMessageBox({
    title: `Withdraw ${item.symbol}`,
    message: h("p", null, [
      h("span", null, "This token is temporarily suspended from withdrawal")
    ]),
    // closeOnClickModal: false,
    autofocus: false,
    customClass: "mess-box-type1",
    showCancelButton: false,
    confirmButtonText: "OK",
    type: "warning"
  }).catch(() => {});
};

// mesage comming soon
function handleExplore() {
  ElMessage("This feature is not available!");
}

// dialog Address
const openAddressDialog = txId => {
  addressDialog.value.open();
  txIdAddress.value = txId;
  if (debug.value) console.log(txId);
};

async function checkBalanceOf() {
  checkBalanceVechain.value = false;
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
function showWithdrawDialog(item: void) {
  if (debug.value) console.log("showWithdrawDialog", item);
  const address = cALinkedAddr.value;
  transferDialogEl.value.openWithdraw(item, address);
}
function showDepositDialog(item: void) {
  if (debug.value) console.log("showDepositDialog", item);
  const address = cALinkedAddr.value;
  transferDialogEl.value.openDeposit(item, address);
}
</script>

<template>
  <div class="your-wallet-container" v-loading.fullscreen.lock="loadingAll">
    <h3 class="app-con-title">Your Wallet</h3>
    <div class="myWallet-tab">
      <el-tabs
        v-model="activeName"
        class="tabs-type01"
        @tab-change="handleClick()"
      >
        <el-tab-pane label="Funding" name="funding">
          <div
            v-if="!cALinkedAddr"
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
            <el-row>
              <IconifyIconOnline
                style="font-size: 50px"
                icon="pajamas:warning-solid"
              />
            </el-row>
            <el-row>{{
              userName
                ? "Please link C-Account with D-Account!"
                : "Please login C-Account!"
            }}</el-row>
            <router-link to="/account/index">
              <el-button v-if="!cALinkedAddr" class="btn-connect-wallet">
                <!-- <IconifyIconOnline
                  style="margin-right: 6px; font-size: 17px"
                  class="arrow-down"
                  icon="ic:baseline-link"
                /> -->
                <IconifyIconOnline
                  style="margin-right: 6px; font-size: 17px"
                  class="arrow-down"
                  icon="ri:login-circle-line"
                />
                {{ userName ? "Link Account" : "Go to Login" }}
              </el-button>
            </router-link>
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
                    <el-link class="num-break-all">{{ cALinkedAddr }}</el-link>
                  </span>
                  <template #dropdown>
                    <AddressDropdown
                      title="View address"
                      :account-address="cALinkedAddr"
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
            <el-skeleton :loading="loadingAll" :rows="5" animated>
              <div class="token-list" v-if="!loadingAll">
                <div v-for="item in fundingWalletList" :key="item.address">
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
                          <el-col>
                            <div style="display: flex">
                              <div>
                                <div class="text-info-token-right">
                                  <div
                                    v-if="checkBalanceBtnLoading"
                                    style="text-align: end"
                                  >
                                    ...
                                  </div>
                                  <Amount
                                    v-else
                                    class="text-info-token-right"
                                    :balance="item.balanceOf"
                                    :decimals="item.decimals"
                                    :precision="10"
                                  />
                                </div>
                                <div
                                  style="color: #797979; font-size: 14px"
                                  class="text-info-token-right"
                                >
                                  - / - USD
                                </div>
                              </div>
                              <div style="display: flex; align-items: center">
                                <IconifyIconOnline
                                  style="
                                    font-size: 30px;
                                    color: #525c9a;
                                    margin-right: -12px;
                                    margin-left: -5px;
                                  "
                                  icon="material-symbols:more-vert"
                                />
                              </div>
                            </div>
                          </el-col>
                        </div>
                      </template>
                      <div class="btn-gr-position">
                        <div class="btn-gr-position">
                          <el-button
                            @click="handleExplore()"
                            v-if="item.depositStatus == '3'"
                            class="button-type05"
                            >Deposit</el-button
                          >
                          <el-button
                            v-else
                            @click="showDepositDialog(item)"
                            class="button-type04"
                            >Deposit</el-button
                          >
                          <el-button
                            @click="handleExplore()"
                            v-if="item.withdrawStatus == '3'"
                            class="button-type05"
                            >Withdraw</el-button
                          >
                          <el-button
                            v-else-if="
                              item.withdrawStatus == '4' ||
                              item.withdrawStatus == '5'
                            "
                            @click="openMess(item)"
                            class="button-type06"
                            >Withdraw</el-button
                          >
                          <el-button
                            v-else
                            @click="showWithdrawDialog(item)"
                            class="button-type04"
                            >Withdraw</el-button
                          >
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
            </el-skeleton>
            <el-row
              style="margin-top: 15px; display: flex; justify-content: center"
              class="button-position"
            >
              <el-button
                :loading="leaderboardBtnLoading"
                class="button-type1"
                style="color: #ffff"
                @click="handleLeaderboard"
                >History</el-button
              ></el-row
            >
          </div>
        </el-tab-pane>
        <el-tab-pane label="Vechain Network" name="vechain-network">
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
            <el-row>Please connect your wallet!</el-row>
            <el-button
              v-if="!myAddr"
              @click="connectWallet"
              class="btn-connect-wallet"
            >
              <IconifyIconOnline
                style="margin-right: 6px; font-size: 17px"
                class="arrow-down"
                icon="uil:wallet"
              />Connect Wallet</el-button
            >
          </div>
          <div v-else class="bg-tab">
            <div>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
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
                <el-row>
                  <el-button
                    id="refresh-button"
                    class="refresh-end"
                    @click="recheckBalanceOf()"
                  >
                    <IconifyIconOffline
                      id="refresh-vechain"
                      class="refresh-start"
                      icon="refresh-right"
                    />
                  </el-button>
                </el-row>
              </div>
              <el-row style="margin-bottom: 15px; color: #fa8914"
                >This is your on-chain asset we do not manage, we only
                show.</el-row
              >
            </div>
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
                          <div style="display: flex">
                            <div>
                              <div>
                                <div
                                  v-if="checkBalanceVechain"
                                  style="text-align: end"
                                >
                                  ...
                                </div>
                                <Amount
                                  v-else
                                  class="text-info-token-right"
                                  :balance="item.balanceOf"
                                  :decimals="item.decimals"
                                  :precision="10"
                                />
                              </div>
                              <div
                                style="color: #797979; font-size: 14px"
                                class="text-info-token-right"
                              >
                                - / - USD
                              </div>
                            </div>
                            <div style="display: flex; align-items: center">
                              <IconifyIconOnline
                                style="
                                  font-size: 30px;
                                  color: #525c9a;
                                  margin-right: -12px;
                                  margin-left: -5px;
                                "
                                icon="material-symbols:more-vert"
                              />
                            </div>
                          </div>
                        </el-col>
                      </div>
                    </template>
                    <div class="btn-gr-position">
                      <el-button
                        @click="showTransferDialog(item)"
                        class="button-type04"
                        >Transfer</el-button
                      >
                      <router-link style="margin-left: 12px" to="/dthor">
                        <el-button class="button-type04">
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
        custom-class="dialog-type1 history"
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
            <!-- <el-row class="content">Last 30 transactions</el-row> -->
            <el-table
              border
              :size="size"
              :data="leaderboardList"
              v-loading="leaderboardBtnLoading"
              style="width: 100%"
              fit
              highlight-current-row
            >
              <el-table-column align="center" label="Type" min-width="65">
                <template v-slot="{ row }">
                  <div
                    :color="
                      row.type === 'add'
                        ? '#74bfa0'
                        : row.type === 'in'
                        ? '#25c877'
                        : row.type === 'sub'
                        ? '#bf6f71'
                        : '#CE4B4B'
                    "
                  >
                    {{ row.type }}
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                label="Amount"
                align="center"
                min-width="200"
                class-name="small-padding"
              >
                <template v-slot="{ row }">
                  {{ row.amount }}
                  {{ row.symbol }}
                </template>
              </el-table-column>

              <el-table-column
                label="Note"
                align="center"
                min-width="280"
                class-name="small-padding"
              >
                <template v-slot="{ row }">
                  <div
                    :color="
                      row.note === 'Pending, can be up to 8 hours'
                        ? '#ff8c00'
                        : '#bbb'
                    "
                  >
                    {{ row.note }}
                  </div>
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
            <pagination
              v-show="leaderboardList.length > 0"
              :total="totalItems"
              v-model:page="pageQuery.page"
              v-model:limit="pageQuery.limit"
              :page-sizes="pageQuery.pageSizes"
              @pagination="getItemListPage"
            />
          </template>
        </TableProBar>
        <template #footer>
          <div style="display: flex; justify-content: flex-end">
            <el-button class="button-type05" @click="dialogVisible = false">
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
  :deep(.dialog-type1.history) {
    max-width: 1250px;
    width: 95%;
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
  :deep(.el-skeleton) {
    --el-skeleton-color: #8e898928;
    --el-skeleton-to-color: #0d1333;
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

  :deep(.el-skeleton) {
    --el-skeleton-color: #8e898928;
    --el-skeleton-to-color: #0d1333;
  }
  // end collapse

  // mess box
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
