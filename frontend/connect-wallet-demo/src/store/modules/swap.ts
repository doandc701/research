import Vue from "vue";
import { defineStore } from "pinia";
// import * as types from '@/types'
// import TokenList from '@/static/tokenList.json'

const time = 0;
export const swapStore = defineStore("swap", {
  state: () => ({
    count: 0,
    count2: "gggg0"
    // tokenList: TokenList as types.TokenDetails[]
  }),
  getters: {
    double: state => state.count * 2
  },
  actions: {
    async fetchErc20Data(/* instance: typeof Vue, force = false */) {
      // tokenList: types.TokenDetails[], force = false
      const passTime = Date.now() - time; // 180000 = 3mut
      console.log("passTime", passTime);
      // if (passTime < 180000 && !force || !instance.$state.address) return
    }
  }
});
