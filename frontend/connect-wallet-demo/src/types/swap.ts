export type ItemBase0 = {
  token: string;
  amount: string;
  logoURI: string;
};

export type TokenDetails = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  chainId?: number;
  balanceOf?: string;
};

export type PairInfo = {
  address: string;
  tokenA: string;
  tokenB: string;
  symbolA: string;
  symbolB: string;
  imageA: string;
  imageB: string;
  tkADecimals: number;
  tkBDecimals: number;
  reserveA?: string;
  reserveB?: string;
  totalSupply?: string;
  balanceOf?: string;
  swapFees?: string;
};
