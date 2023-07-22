import Web3 from "web3";
import { useUserStoreHook } from "/@/store/modules/user";

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

let accounted: string;
export const handleConnectWalletMC = async () => {
  if (window.ethereum) {
    const web3: Web3 = new Web3(window.ethereum);
    // console.log("web3", web3);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      accounted = accounts[0];
      useUserStoreHook().SET_ADDR(accounts[0]);
      // window.location.reload();
      return web3;
    } catch (error) {
      console.error(error);
    }
  } else if (window.web3) {
    const web3 = window.web3;
    console.log("Injected web3 detected. ", window.web3);
    return web3;
  } else {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
    const web3 = new Web3(provider);
    console.log("No web3 instance injected, using local web3.");
    return web3;
  }
};

export async function getCurrenWalletConnected(): Promise<void> {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts: string = await window.ethereum.request({
        method: "eth_accounts"
      });
      // console.log(accounts[0]);
      accounted = accounts[0];
      useUserStoreHook().SET_ADDR(accounts[0]);
    } catch (error) {
      console.error(error.message);
    }
  }
}

export const addChangeAccount = async (): Promise<void> => {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      // console.log("account", accounts[0]);
      useUserStoreHook().SET_ADDR(accounts[0]);
    });
  }
};

export const handleChangeNetworkWallet = (chainIds: string): void => {
  if (!accounted) {
    console.log("Please, connect wallet");
    return;
  }
  try {
    window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIds }]
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const handleSendTransaction = () => {
  // console.log(accounted);
  if (!accounted) {
    console.log("Please, connect wallet");
    return;
  }
  const transactionParameters = {
    nonce: "0x00", // ignored by MetaMask
    gasPrice: "0x029104e28c", // customizable by user during MetaMask confirmation.
    gas: "0x2710", // customizable by user during MetaMask confirmation.
    to: "0xBDE1EAE59cE082505bB73fedBa56252b1b9C60Ce", // Required except during contract publications.
    from: accounted, // must match user's active address.
    value: "0x00", // Only required to send ether to the recipient from the initiating external account.
    // data: "0x7f7465737432000000000000000000000000000000000000000000000000000000600057", // Optional, but used for defining smart contract creation and interaction.
    data: "0x", // Optional, but used for defining smart contract creation and interaction.
    chainId: "0x3" // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
  };
  try {
    window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters]
    });
  } catch (error) {
    console.log(error);
  }
};
