import BigNumber from "bignumber.js";
import { Connex } from "@vechain/connex";
import ABI_GET_IN from "./abis/router01/getAmountsIn.json";
import ABI_GET_OUT from "./abis/router01/getAmountsOut.json";
import ABI_SWAP_EEFT from "./abis/router01/swapExactVETForTokens.json";
import ABI_SWAP_EFET from "./abis/router01/swapVETForExactTokens.json";
import ABI_SWAP_ETFE from "./abis/router01/swapExactTokensForVET.json";
import ABI_SWAP_TFEE from "./abis/router01/swapTokensForExactVET.json";
import ABI_SWAP_ETFT from "./abis/router01/swapExactTokensForTokens.json";
import ABI_SWAP_TFET from "./abis/router01/swapTokensForExactTokens.json";
import ABI_ADD_LIQUIDITY_T from "./abis/router01/addLiquidity.json";
import ABI_ADD_LIQUIDITY_VET from "./abis/router01/addLiquidityVET.json";
import ABI_REMOVE_LIQUIDITY_T from "./abis/router01/removeLiquidity.json";
import ABI_REMOVE_LIQUIDITY_VET from "./abis/router01/removeLiquidityVET.json";

export default class SwapV2Router01 {
  private account: Connex.Thor.Account.Visitor;

  constructor(address: string, connex: Connex) {
    this.account = connex.thor.account(address);
  }

  get address(): string {
    return this.account.address;
  }

  async getAmountsIn(amount: string, path: string[]): Promise<BigNumber> {
    const decoded = (await this.account.method(ABI_GET_IN).call(amount, path))
      .decoded;
    // console.log('getAmountsIn->decoded', decoded)
    if (decoded[0] && decoded[0][0]) return new BigNumber(decoded[0][0]);
    return new BigNumber(-1);
  }

  async getAmountsOut(amount: string, path: string[]): Promise<BigNumber> {
    const m = this.account.method(ABI_GET_OUT);
    const decoded = (await m.call(amount, path)).decoded;
    // console.log('getAmountsOut->decoded', decoded)
    if (decoded[0] && decoded[0][1]) return new BigNumber(decoded[0][1]);
    return new BigNumber(-1);
  }

  addLiquidity(
    tokenA: string,
    tokenB: string,
    amountADesired: string,
    amountBDesired: string,
    amountAMin: string,
    amountBMin: string,
    to: string,
    deadline: string
  ): Connex.Vendor.TxMessage[0] {
    return this.account
      .method(ABI_ADD_LIQUIDITY_T)
      .asClause(
        tokenA,
        tokenB,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        to,
        deadline
      );
  }

  addLiquidityVET(
    val: string,
    token: string,
    amountTokenDesired: string,
    amountTokenMin: string,
    amountVETMin: string,
    to: string,
    deadline: string
  ): Connex.Vendor.TxMessage[0] {
    return this.account
      .method(ABI_ADD_LIQUIDITY_VET)
      .value(val)
      .asClause(
        token,
        amountTokenDesired,
        amountTokenMin,
        amountVETMin,
        to,
        deadline
      );
  }

  removeLiquidity(
    tokenA: string,
    tokenB: string,
    liquidity: string,
    amountAMin: string,
    amountBMin: string,
    to: string,
    deadline: string
  ): Connex.Vendor.TxMessage[0] {
    return this.account
      .method(ABI_REMOVE_LIQUIDITY_T)
      .asClause(
        tokenA,
        tokenB,
        liquidity,
        amountAMin,
        amountBMin,
        to,
        deadline
      );
  }

  removeLiquidityVET(
    token: string,
    liquidity: string,
    amountTokenMin: string,
    amountVETMin: string,
    to: string,
    deadline: string
  ): Connex.Vendor.TxMessage[0] {
    return this.account
      .method(ABI_REMOVE_LIQUIDITY_VET)
      .asClause(token, liquidity, amountTokenMin, amountVETMin, to, deadline);
  }

  swapExactETHForTokens(
    value: string,
    amountOutMin: string,
    path: string[],
    to: string,
    deadline: string
  ): Connex.Vendor.TxMessage[0] {
    return this.account
      .method(ABI_SWAP_EEFT)
      .value(value)
      .asClause(amountOutMin, path, to, deadline);
    // return this.account.method(ABI_SWAP_EEFT).value(value).asClause(amountOutMin, path, to, deadline)
  }

  swapETHForExactTokens(
    value: string,
    amountOut: string,
    path: string[],
    to: string,
    deadline: string
  ): Connex.Vendor.TxMessage[0] {
    return this.account
      .method(ABI_SWAP_EFET)
      .value(value)
      .asClause(amountOut, path, to, deadline);
  }

  swapExactTokensForETH(
    amountIn: string,
    amountOutMin: string,
    path: string[],
    to: string,
    deadline: string
  ): Connex.Vendor.TxMessage[0] {
    return this.account
      .method(ABI_SWAP_ETFE)
      .asClause(amountIn, amountOutMin, path, to, deadline);
  }

  swapTokensForExactETH(
    amountOut: string,
    amountInMax: string,
    path: string[],
    to: string,
    deadline: string
  ): Connex.Vendor.TxMessage[0] {
    return this.account
      .method(ABI_SWAP_TFEE)
      .asClause(amountOut, amountInMax, path, to, deadline);
  }

  swapExactTokensForTokens(
    amountIn: string,
    amountOutMin: string,
    path: string[],
    to: string,
    deadline: string
  ): Connex.Vendor.TxMessage[0] {
    return this.account
      .method(ABI_SWAP_ETFT)
      .asClause(amountIn, amountOutMin, path, to, deadline);
  }

  swapTokensForExactTokens(
    amountOut: string,
    amountInMax: string,
    path: string[],
    to: string,
    deadline: string
  ): Connex.Vendor.TxMessage[0] {
    return this.account
      .method(ABI_SWAP_TFET)
      .asClause(amountOut, amountInMax, path, to, deadline);
  }
}
