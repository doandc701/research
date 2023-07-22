/*export default {
  title: 'DThor swap 2'
}*/
import { loadEnv } from "@build/index";
const { VITE_APP_NETWORK, VITE_APP_DOMAIN_ENV } = loadEnv();

export const appName = "vefam";
export const network = VITE_APP_NETWORK === "main" ? "main" : "test";
export const appNameSpace = `${appName}-${network}`;
// https://mainnet.veblocks.net, https://vethor-node.vechain.com
// https://testnet.veblocks.net, https://vethor-node-test.vechaindev.com
const domainEnv = VITE_APP_DOMAIN_ENV as "main" | "dev" | "local";
const domains = {
  vpunk: {
    main: "https://vpunks.herokuapp.com/",
    dev: "https://vpunks.herokuapp.com/",
    local: "http://localhost:3000/"
  },
  "vefam-payment": {
    main: "https://vefam-core.herokuapp.com/",
    dev: "https://vefam-dev.herokuapp.com/",
    local: "http://localhost:3000/"
  }
};
const address = {
  "vpunks-og": {
    main: "0xe92FDDD633008C1bca6E738725d2190cD46DF4a1",
    test: "0xb82AefA664b555CCe01d19644FC8A6903Fd6e7a2"
  },
  "vpunks-weapons": {
    main: "0x1417e8955D16775B22771402E3F43665b5070975",
    test: "0xA69ab36A41b23e087eAF64ac174A94F03ae598E9"
  },
  "pixel-puffs": {
    main: "0xEdd8acC6F79330195DA827e4693d1f877e4502Cb",
    test: "0xb82AefA664b555CCe01d19644FC8A6903Fd6e7a2"
  },
  vemoji: {
    main: "0x3aDc46f41467d436614B173A076791dEAdDBD67f",
    test: "0x3aDc46f41467d436614B173A076791dEAdDBD67f"
  }
};

const node =
  network === "main"
    ? "https://mainnet.veblocks.net"
    : "https://testnet.outofgas.io";

export const settings = {
  appName,
  network,
  node
};

export const dAccountAddr =
  network === "main"
    ? "0x410833A024045676D2Cfa888602c30c7EF489310"
    : "0x4364930A00d3EC92c228d1aBb7884F1BfA6a73Fc";
export const vpunksOgAddr =
  network === "main"
    ? "0xe92FDDD633008C1bca6E738725d2190cD46DF4a1"
    : "0xb82AefA664b555CCe01d19644FC8A6903Fd6e7a2";
export const vpunksWeaponsAddr =
  network === "main"
    ? "0x1417e8955D16775B22771402E3F43665b5070975"
    : "0xA69ab36A41b23e087eAF64ac174A94F03ae598E9";
export const weaponsMinterAddr =
  network === "main"
    ? "0x0496Abb6262cD265Da5515f98D2f336C97A7A447"
    : "0x2086fE8Ea017840bB59E1DD748a9902c89d4eE83";
export const pixelPuffsAddr =
  network === "main"
    ? "0xEdd8acC6F79330195DA827e4693d1f877e4502Cb"
    : "0xb82AefA664b555CCe01d19644FC8A6903Fd6e7a2";
export const erc721PeripheryV1 =
  network === "main"
    ? "0xA635F25BF03bD420131DC20554986c8658189c7B"
    : "0xa96c4E1E51058e74f7F1c297Fb0b3E28b57a6378";
export const vpuTokenAddr =
  network === "main"
    ? "0xb0821559723dB89e0Bd14FEE81E13a3aaE007e65"
    : "0x8C1d95e96b69941b1b81145D2f2A100E7D259880";

export function getCollecAddr(codename: string, _network?: string) {
  return _network ? address[codename][_network] : address[codename][network];
}

export function getDomain(codename: string, env?: string) {
  return env ? domains[codename][env] : domains[codename][domainEnv];
}

export function getExplorers() {
  if (network === "main") {
    return [
      {
        name: "VeChain Stats",
        accounts: "https://vechainstats.com/accounts/",
        txs: "https://vechainstats.com/transactions/"
      },
      {
        name: "VeChain Explorer",
        accounts: "https://explore.vechain.org/accounts/",
        txs: "https://explore.vechain.org/transactions/"
      }
    ];
  } else {
    return [
      {
        name: "VeBlocks Insight",
        accounts: "https://explore.veblocks.net/#/test/accounts/",
        txs: "https://explore.veblocks.net/#/test/txs/"
      },
      {
        name: "VeChain Explorer",
        accounts: "https://explore-testnet.vechain.org/accounts/",
        txs: "https://explore-testnet.vechain.org/transactions/"
      }
    ];
  }
}
