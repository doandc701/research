// thư viện: https://wagmi.sh/core/getting-started
// tạo projectId : https://cloud.walletconnect.com/sign-in
// tạo apikey: https://infura.io/login
// tạo apikey: https://dashboard.alchemyapi.io/
import {
  configureChains,
  createClient,
  switchNetwork,
  connect,
  disconnect
  // signMessage
} from "@wagmi/core";
import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";
import { InjectedConnector } from "@wagmi/core/connectors/injected";
// import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";
// import { WalletConnectLegacyConnector } from "@wagmi/core/connectors/walletConnectLegacy";
import { LedgerConnector } from "@wagmi/core/connectors/ledger";
import {
  mainnet,
  optimism,
  polygon,
  avalanche,
  arbitrum,
  bsc,
  goerli
} from "@wagmi/core/chains";
import { publicProvider } from "@wagmi/core/providers/public"; // định cấu hình chuỗi bằng URL RPC công khai và cũng cung cấp
import { alchemyProvider } from "@wagmi/core/providers/alchemy"; // Yêu cầu apiKey trên alchemyProvider
import { infuraProvider } from "@wagmi/core/providers/infura"; //định cấu hình chuỗi bằng URL Infura RPC và cũng cung cấp
import { useUserStoreHook } from "/@/store/modules/user";

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygon, optimism, avalanche, arbitrum, bsc, goerli],
  [
    publicProvider(),
    alchemyProvider({ apiKey: "HcARpW4YNjf8KxpsQwNSJ-DdtaZZ8osy" }),
    infuraProvider({ apiKey: "55fd2d2c3d234a87a9824e69dafff13c" })
  ]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true, //mô phỏng hành vi ngắt kết nối bằng cách theo dõi trạng thái kết nối trong bộ lưu trữ
        UNSTABLE_shimOnConnectSelectAccount: true // cho phép người dùng có thể chọn tài khoản khác khi ngắn kết nối
      }
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true
      }
    }),
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     projectId: "f7b93c2924560fd13863c850b86b1c83",
    //     showQrModal: true
    //   }
    // }),
    // new WalletConnectLegacyConnector({
    //   chains,
    //   options: {
    //     qrcode: true
    //   }
    // }),
    new LedgerConnector({
      chains,
      options: {
        enableDebugLogs: true, //Chuyển đổi ghi nhật ký gỡ lỗi cho Ledger Connect Kit.
        rpc: {
          1: "https://eth-mainnet.alchemyapi.io/v2/f7b93c2924560fd13863c850b86b1c83" //cấu hình chuỗi với URL RPC mà bạn chỉ định và cũng cung cấp
        }
      }
    })
  ],
  provider,
  webSocketProvider
});

export const wagmiHandleConnect = async (selected: number) => {
  try {
    const result = await connect({
      connector: wagmiClient.config.connectors[selected]
    });
    console.log("result", result);
    // signMessage :tạo chữ ký
    // const signature = await signMessage({
    //   message: "gm wagmi frens" // có thể tùy chỉnh
    // });
    // console.log("signature", signature);
    useUserStoreHook().SET_ADDR(result.account);
  } catch (error) {
    console.log(error);
  }
};

export async function wagmiHandleDisconnect() {
  await disconnect(); // chỉ xóa địa chỉ trong localStorage
}
export async function wagmiHandleswitchNetwork(idNetWork: number) {
  try {
    await switchNetwork({
      chainId: idNetWork
    });
  } catch (error) {
    console.log(error);
  }
}
