<script lang="ts" setup>
import { ref, onMounted, watch, computed } from "vue";
import { useGlobal } from "@pureadmin/utils";
import { fromWei } from "/@/utils/connex";
import * as types from "/@/types";
import LpInfo from "./lpInfo.vue";
import PairDetails from "./pairDetails.vue";
import RemoveLp from "./removeLp.vue";
import AddLp from "./addLp.vue";
import { useAppStoreHook } from "/@/store/modules/app";
import SwapV2Router03 from "/@/contractCall/swapV2Router03";
const { $connex } = useGlobal<GlobalPropertiesApi>();

const props = defineProps({
  addr: String
});
// variables
const debug = ref(false);
const tab = ref("info" as "info" | "addLp" | "removeLp");
const loading = ref(false);
const btnText = ref("Select a Pool");
const allPairsInfo = ref([] as types.PairInfo[]);
const activePairsInfo = ref([] as types.PairInfo[]);
const pairSelected = ref({} as types.PairInfo);
const input = ref("");

let $addr0: string;

const $swapV2Router03 = new SwapV2Router03(
  "0xEB28200F2860dC72E6c7A7EcfdE9258E50b78Bdc",
  $connex
);
// !computed
const tokenList = computed(() => {
  return useAppStoreHook().tokenList;
});
// !method
const addOrRemoveLp = (type: "addLp" | "removeLp"): void => {
  tab.value = type;
};
const success = (): void => {
  tab.value = "info";
  getPairsInfo();
};
const selectPairsInfo = (pair: types.PairInfo): void => {
  pairSelected.value = pair;
  btnText.value = `View ${pair.symbolA}/${pair.symbolB} Pool`;
};
const selectActivePairsInfo = (pair: types.PairInfo): void => {
  pairSelected.value = pair;
  btnText.value = `View ${pair.symbolA}/${pair.symbolB} Pool`;
};
async function getPairsInfo(): Promise<void> {
  loading.value = true;
  const indexs = [] as string[];
  await this.$factory
    .allPairsLength()
    .then(results => {
      debug.value && console.log("allPairsLength Results:", results);
      for (let i = 0; i < Number(results); i++) indexs.push(`${i}`);
    })
    .catch(e => console.log("allPairsLength error", e));

  $swapV2Router03
    .getPairsInfoByIndex(indexs)
    .then(results => {
      debug.value && console.log("getPairsInfoByIndex", results);
      if (results && results.pairs) {
        let allPairsTemp = [] as types.PairInfo[];
        for (let i = 0; i < results.pairs.length; i++) {
          const token0Json = tokenList.value.find(
            o => o.address.toLowerCase() === results.tokens0[i].toLowerCase()
          );
          const token1Json = tokenList.value.find(
            o => o.address.toLowerCase() === results.tokens1[i].toLowerCase()
          );
          debug.value && console.log("token0Json:", token0Json);
          const pairsInfo: types.PairInfo = {
            address: results.pairs[i],
            tokenA: results.tokens0[i],
            tokenB: results.tokens1[i],
            symbolA: token0Json ? token0Json.symbol : "",
            symbolB: token1Json ? token1Json.symbol : "",
            imageA: token0Json ? token0Json.logoURI : "",
            imageB: token1Json ? token1Json.logoURI : "",
            tkADecimals: token0Json ? token0Json.decimals : 18,
            tkBDecimals: token1Json ? token1Json.decimals : 18
          };
          allPairsTemp.push(pairsInfo);
        }
        //
        $swapV2Router03
          .getReservesByTokens(
            results.tokens0,
            results.tokens1,
            (props.addr as string) || $addr0
          )
          .then(reserveResults => {
            debug.value && console.log("getReservesByTokens", reserveResults);
            allPairsInfo.value = [];
            activePairsInfo.value = [];
            const preSelectedAddr = pairSelected.value.address;
            pairSelected.value = {} as types.PairInfo;
            for (let i = 0; i < results.pairs.length; i++) {
              allPairsTemp[i].reserveA = reserveResults.reservesA[i];
              allPairsTemp[i].reserveB = reserveResults.reservesB[i];
              allPairsTemp[i].totalSupply = reserveResults.supplies[i];
              allPairsTemp[i].balanceOf = reserveResults.balances[i];
            }
            for (let i = 0; i < allPairsTemp.length; i++) {
              if (
                allPairsTemp[i].balanceOf &&
                allPairsTemp[i].balanceOf !== "0"
              ) {
                activePairsInfo.value.push(allPairsTemp[i]);
              } else {
                allPairsInfo.value.push(allPairsTemp[i]);
              }
              if (preSelectedAddr === allPairsTemp[i].address)
                pairSelected.value = allPairsTemp[i];
            }
            allPairsTemp = [];
            loading.value = false;
            debug.value && console.log("this.allPairsInfo", allPairsInfo);
            debug.value && console.log("this.activePairsInfo", activePairsInfo);
          })
          .catch(e => {
            console.log("getReservesByTokens error", e);
          });
      }
    })
    .catch(e => {
      console.log("getPairsInfoByIndex error", e);
    });
}

onMounted(() => {
  watch("addr", (nv: string, ov: string) => {
    if (nv.toLowerCase() !== ov.toLowerCase()) {
      success();
    }
    getPairsInfo();
  });
});
</script>

<template>
  <div class="pool-card">
    <!-- Pool list -->
    <div v-if="tab === 'info'" class="pool-info">
      <el-row
        type="flex"
        style="justify-content: space-between; align-items: center"
      >
        <h3>Available Pool</h3>
        <el-button
          :disabled="!addr"
          size="mini"
          round
          @click="addOrRemoveLp('addLp')"
          >+ New Position</el-button
        >
      </el-row>
      <!-- search -->
      <!--<div class="pool-card-search">
        <el-input v-model="input" placeholder="Search for a Pool" />
        <el-button size="mini"><span style="vertical-align: middle;margin-right: 5px;"><el-icon><Search /></el-icon></span>Search</el-button>
      </div>-->
      <!-- search -->
      <el-scrollbar height="300px" class="token-list-body">
        <div class="token-list1">
          <h3>Your active pools</h3>
          <el-row justify="center">
            <div
              v-if="!loading && activePairsInfo.length <= 0"
              style="color: rgb(252 185 54)"
            >
              {{
                addr ? "No liquidity was found" : "Wallet connection required"
              }}
            </div>
            <el-icon v-if="loading" class="is-loading" :size="30" color="#fff">
              <Loading />
            </el-icon>
          </el-row>
          <div class="pools-symbol-center">
            <el-row
              v-for="item in activePairsInfo"
              :key="item.address"
              class="token-item1"
              :class="[pairSelected.address == item.address ? 'active' : '']"
              justify="space-between"
              align="middle"
              @click="selectActivePairsInfo(item)"
            >
              <LpInfo :pair-info="item" />
            </el-row>
          </div>
        </div>

        <div class="pools-symbol-center">
          <div v-if="!loading" class="token-list1">
            <h3>Other pools</h3>
            <el-row
              v-if="!loading && allPairsInfo.length <= 0"
              justify="center"
            >
              No data to display
            </el-row>
            <el-row
              v-for="item in allPairsInfo"
              :key="item.address"
              class="token-item1"
              :class="[pairSelected.address == item.address ? 'active' : '']"
              justify="space-between"
              align="middle"
              @click="selectPairsInfo(item)"
            >
              <LpInfo :pair-info="item" />
            </el-row>
          </div>
        </div>
      </el-scrollbar>

      <div style="margin: 25px 0 0 0" class="pool-list-footer">
        <el-row style="margin-top: 20px" justify="center">
          <el-button
            v-if="addr"
            class="custom-btn-connect"
            round
            :disabled="!pairSelected.address"
            @click="tab = 'pairDetails'"
            >{{ btnText }}</el-button
          >
          <el-button
            v-else
            class="custom-btn-connect"
            round
            @click="$emitter.emit('walletConnect', '')"
            >Connect Wallet</el-button
          >
        </el-row>
      </div>
    </div>
    <!-- end: Pool list -->

    <!-- PairDetails -->
    <PairDetails
      v-else-if="tab === 'pairDetails'"
      :addr="addr"
      :pair-info="pairSelected"
      @on-add-remove="addOrRemoveLp"
    >
      <el-link href="javascript:;" :underline="false" @click="tab = 'info'">
        <el-icon :size="20"><Back /></el-icon>
      </el-link>
    </PairDetails>
    <!-- end: PairDetails -->

    <!-- AddLp -->
    <AddLp
      v-else-if="tab === 'addLp'"
      :on-success="success"
      :addr="addr"
      :pair-selected="pairSelected"
    >
      <el-link href="javascript:;" :underline="false" @click="tab = 'info'">
        <el-icon :size="20"><Back /></el-icon>
      </el-link>
    </AddLp>
    <!-- end: AddLp -->

    <!-- RemoveLp -->
    <RemoveLp
      v-else-if="tab === 'removeLp'"
      :on-success="success"
      :addr="addr"
      :pair-info="pairSelected"
    >
      <el-link href="javascript:;" :underline="false" @click="tab = 'info'">
        <el-icon :size="20"><Back /></el-icon>
      </el-link>
    </RemoveLp>
    <!-- end: RemoveLp -->
  </div>
</template>

<style lang="scss">
.pool-card {
  .pool-card-search {
    & input {
      padding-right: 115px;
      background: rgba(134, 89, 178, 0.15);
      border: 0;
      border-radius: 10px;
      color: #fff;
    }
  }
  .pools-symbol-center {
    .token-item1 {
      .el-col.el-col-12 {
        .symbol {
          position: relative;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.pool-card {
  .pool-info {
    color: #cfebff;
  }
  /* + New Position btn */
  & button.el-button.el-button--default.el-button--mini.is-round {
    background: transparent;
    border-color: transparent;
    color: #85c8f2;
    font-size: 14px;
  }
  .pool-card-search {
    position: relative;
    & button {
      position: absolute;
      right: 0;
      padding-block: 10px;
      border-radius: 10px;
      border-color: #012c67;
      color: #ffff;
    }
  }
  .token-list-body {
    background: #0000000a;
    margin-top: 20px;
    padding: 0 5px;
    border: 1px dashed #0f5398;
    .token-list1 {
      padding: 10px 0;
      h3 {
        padding-left: 5px;
        font-weight: 500;
        font-size: 1.1em;
      }
    }
  }
  .token-item1 {
    padding: 10px;
    // border-bottom: 1px dashed #002040;
    // border-radius: 20px;
    background: rgb(255 255 255 / 2%);
    margin-top: 5px;
    cursor: pointer;
    opacity: 1;
    &:hover {
      opacity: 0.8;
    }
  }
  .active {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
  }
  .pool-list-footer .btn {
    width: 100%;
    font-size: 16px;
  }
  .el-link.el-link--default {
    color: #809fb5;
    &:hover {
      color: var(--el-link-default-active-color);
    }
  }
}
</style>
