module.exports = {
  title: 'VPunks',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: false,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',
  appNameSpace: 'vpunks', // for localStorage
  apiUrl: 'https://vpunks.herokuapp.com', // https://vpunks.herokuapp.com, http://localhost:3000

  network: 'VeChainThor', // Ethereum
  nativeToken: 'VET', // ETH
  // explorerTx: 'https://explore.vechain.org/transactions/', // Mainnet
  // explorerAddress: 'https://explore.vechain.org/accounts/' // Mainnet
  explorerTx: 'https://vechainstats.com/transaction/', // Mainnet2
  explorerAddress: 'https://vechainstats.com/account/', // Mainnet2
  veExplorerAddress: 'https://explore.vechain.org/accounts/' // Mainnet
  // chainId: 3, // ETH (ropsten: 3, ganache: 1337),
  // explorerTx: 'https://explore-testnet.vechain.org/transactions/', // Testnet
  // explorerAddress: 'https://explore-testnet.vechain.org/accounts/' // Testnet
  // explorerTx: 'https://insight.vecha.in/#/test/txs/', // Testnet2
  // explorerAddress: 'https://insight.vecha.in/#/test/accounts/' // Testnet2
}
