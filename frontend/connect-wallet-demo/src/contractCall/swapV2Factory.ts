import Connex from "@vechain/connex";
import ABI_BALANCE_OF from "./abis/pair/balanceOf.json";
import ABI_ALL_PAIRS_LENGTH from "./abis/factory/allPairsLength.json";

export default class SwapV2Factory {
  // private connex: Connex
  private account: Connex.Thor.Account.Visitor;

  constructor(address: string, connex: Connex) {
    // this.connex = connex
    this.account = connex.thor.account(address);
  }

  async balanceOf(addr: string): Promise<string> {
    const balance: string = (
      await this.account.method(ABI_BALANCE_OF).call(addr)
    ).decoded[0];

    return balance;
  }

  async allPairsLength(): Promise<string> {
    // const total2 = await this.account.method(ABI_ALL_PAIRS_LENGTH).call()
    const total: string = (
      await this.account.method(ABI_ALL_PAIRS_LENGTH).call()
    ).decoded[0];
    return total;
  }
}
