// code: https://docs.walletconnect.com/2.0/web3modal/html-js/installation
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { configureChains, createClient, getAccount } from "@wagmi/core";
import { arbitrum, mainnet, polygon, goerli } from "@wagmi/core/chains";
import { useUserStoreHook } from "/@/store/modules/user";

const chains = [arbitrum, mainnet, polygon, goerli];
const projectId = "a4f12bcc92f1d7055114b422bbff8dfb";

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider
});

const ethereumClient = new EthereumClient(wagmiClient, chains);

export const web3modal = new Web3Modal({ projectId }, ethereumClient);

web3modal.setTheme({
  themeMode: "dark",
  themeVariables: {
    "--w3m-font-family": "Roboto, sans-serif",
    "--w3m-accent-color": "#F5841F"
  }
});

// subscribeModal: thay đổi trạng thái của modal từ đó có thế cập nhật được trạng thái connect
web3modal.subscribeModal(newState => {
  // console.log("newState", newState.open);
  const { address } = getAccount();
  // console.log(address);
  if (address) {
    useUserStoreHook().SET_ADDR(address);
  } else {
    web3modal.openModal({ route: "ConnectWallet" });
  }
});
