import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
// import './utils/error-log' // error log

import * as filters from './filters' // global filters

import i18n from './lang' // internationalization
// DAPP
import VueGtag from 'vue-gtag' // gtag
import Web3 from 'web3'
// import defaultSettings from '@/settings'

// VeChain
import Connex from '@vechain/connex'
import * as VeChainThor from './utils/contract-vechainthor.js'
import NFTContract from '../build/contracts-vet/VPunks.json'
import ERC721DutchAuctionV1 from '../build/contracts-vet/ERC721DutchAuctionV1.json'
import VPUContract from '../build/contracts-vet/VPU.json'
import ClaimVPU from '../build/contracts-vet/ClaimVPU.json'
import VPunkStakingV1 from '../build/contracts-vet/VPunkStakingV1.json'
import ERC721BidV1 from '../build/contracts-vet/ERC721BidV1.json'
import ERC721BidPeripheryV1 from '../build/contracts-vet/ERC721BidPeripheryV1.json'
import ERC20StakingV1 from '../build/contracts-vet/ERC20StakingV1.json'
import ERC721PeripheryV1 from '../build/contracts-vet/ERC721PeripheryV1.json'

// contracts-vet-testnet
// import TupleTest from '../build/contracts-vet-testnet/TupleTest.json'
// console.log(NFTContract)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
/*
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}*/

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  // locale: enLang, // 如果使用中文，无需设置，请删除
  i18n: (key, value) => i18n.t(key, value)
})

// Vue.use(Element, {
//   size: Cookies.get('size') || 'medium', // set element-ui default size
//   i18n: (key, value) => i18n.t(key, value)
// })

// gtag
Vue.use(VueGtag, {
  config: { id: 'G-6HPSNSB4R9' } // vpunks.com
}, router)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// --------------------------------------------------------------------------------------------------
const debug = false
const setMainnet = true
// Address of the selected account
window.VeChainThor = VeChainThor
window.selectedAccount = null
window.chainIdError = false

// Setup ---
function init() {
  window.web3 = new Web3()
}

// initContract ---
async function initContract() {
  // VeChain
  if (window.connex) {
    if (setMainnet && window.connex.thor.genesis.id !== '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a') window.chainIdError = true
    if (!setMainnet && window.connex.thor.genesis.id !== '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127') window.chainIdError = true
    // console.log(window.connex)
    /*
    const connex = new Connex({
      node: setMainnet ? 'https://mainnet.veblocks.net' : 'https://testnet.veblocks.net',
      network: setMainnet ? 'main' : 'test'
    })
    window.connex2 = connex*/
  } else {
    // https://mainnet.veblocks.net, https://vethor-node.vechain.com
    // https://testnet.veblocks.net, https://vethor-node-test.vechaindev.com
    const connex = new Connex({
      node: setMainnet ? 'https://mainnet.veblocks.net' : 'https://testnet.veblocks.net',
      network: setMainnet ? 'main' : 'test'
    })
    window.connex = connex
  }
  // connex.thor.genesis.id: "0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a" // Mainnet
  // connex.thor.genesis.id: "0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127" // Testnet
  // Mainnet Chain Tag: 0x4a
  // Testnet Chain Tag: 0x27

  // NFTContract
  let instance = VeChainThor.contract(NFTContract, setMainnet ? '5777' : '5778')
  store.dispatch('contracts/setInstance', { key: 'NFTContract', value: instance })
  debug && console.log('NFTContract:', instance.address)

  // ERC721DutchAuctionV1
  instance = VeChainThor.contract(ERC721DutchAuctionV1, '5777')
  store.dispatch('contracts/setInstance', { key: 'ERC721DutchAuctionV1', value: instance })
  debug && console.log('ERC721DutchAuctionV1:', instance.address)
  // VPUContract
  instance = VeChainThor.contract(VPUContract, '5777')
  store.dispatch('contracts/setInstance', { key: 'VPUContract', value: instance })
  debug && console.log('VPUContract:', instance.address)
  // ClaimVPU
  instance = VeChainThor.contract(ClaimVPU, '5777')
  store.dispatch('contracts/setInstance', { key: 'ClaimVPU', value: instance })
  debug && console.log('ClaimVPU:', instance.address)
  // VPunkStakingV1
  instance = VeChainThor.contract(VPunkStakingV1, '5777')
  store.dispatch('contracts/setInstance', { key: 'VPunkStakingV1', value: instance })
  debug && console.log('VPunkStakingV1:', instance.address)
  // ERC721BidV1
  instance = VeChainThor.contract(ERC721BidV1, '5777')
  store.dispatch('contracts/setInstance', { key: 'ERC721BidV1', value: instance })
  debug && console.log('ERC721BidV1:', instance.address)
  // ERC721BidPeripheryV1
  instance = VeChainThor.contract(ERC721BidPeripheryV1, '5777')
  store.dispatch('contracts/setInstance', { key: 'ERC721BidPeripheryV1', value: instance })
  debug && console.log('ERC721BidPeripheryV1:', instance.address)
  // ERC20StakingV1
  instance = VeChainThor.contract(ERC20StakingV1, '5777')
  store.dispatch('contracts/setInstance', { key: 'ERC20StakingV1', value: instance })
  debug && console.log('ERC20StakingV1:', instance.address)
  // ERC721PeripheryV1
  instance = VeChainThor.contract(ERC721PeripheryV1, '5777')
  store.dispatch('contracts/setInstance', { key: 'ERC721PeripheryV1', value: instance })
  debug && console.log('ERC721PeripheryV1:', instance.address)

  // Test ------------------------------
  // TupleTest
  // instance = VeChainThor.contract(TupleTest, '5777')
  /*
  instance.setNonReentrant1('2').then(async result => {
  instance.setNonReentrant1({ clauses: [['2'],['2']] }).then(async result => {
    console.log('setNonReentrant2-result', result)
    const txHash = result.txid
    const transaction = await window.VeChainThor.waitTxReceipt(txHash)
    console.log('transaction-result', transaction)
  }).catch(err => {
    console.error(err.message)
  })*/
  /*
  const c1 = await instance.setNonReentrant2('1', { getClause: true })
  // const c2 = await instance.setTuple1('1', '8', '9', { getClause: true })
  const c2 = await instance.ownerWithdraw('0xb4c760B1D39ae353ff68571039fc7383F068b7db', '1000000000000000000', { getClause: true })
  const allClause = c1.concat(c2)
  window.VeChainThor.callWithClauses(allClause).then(async result => {
    console.log('callWithClauses-result', result)
    const txHash = result.txid
    const transaction = await window.VeChainThor.waitTxReceipt(txHash)
    console.log('transaction-result', transaction)
  }).catch(err => {
    console.error(err.message)
  }) */
  // end Test
}

//
window.addEventListener('load', async() => {
  await store.dispatch('user/initWallets')
  init()
  initContract()
  //
  new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
  })
})
