import { Connex } from "@vechain/connex";
import ABI_getPairsInfoByIndex from "./abis/router03/getPairsInfoByIndex.json";
import ABI_getPairInfoByTokens from "./abis/router03/getPairInfoByTokens.json";
import ABI_getReservesByTokens from "./abis/router03/getReservesByTokens.json";
type Decoded = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [name: string]: any;
} & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: number]: any;
};
export default class SwapV2Router03 {
  private account: Connex.Thor.Account.Visitor;

  constructor(address: string, connex: Connex) {
    this.account = connex.thor.account(address);
  }

  get address(): string {
    return this.account.address;
  }

  async getPairsInfoByIndex(indexs: string[]): Promise<Decoded> {
    const decoded = (
      await this.account.method(ABI_getPairsInfoByIndex).call(indexs)
    ).decoded;
    // console.log('getPairsInfoByIndex-decoded', decoded)
    return decoded;
  }

  async getPairInfoByTokens(
    tokensA: string[],
    tokensB: string[],
    user: string
  ): Promise<Decoded> {
    const decoded = (
      await this.account
        .method(ABI_getPairInfoByTokens)
        .call(tokensA, tokensB, user)
    ).decoded;
    // console.log('getPairInfoByTokens-decoded', decoded)
    return decoded;
  }

  async getReservesByTokens(
    tokensA: string[],
    tokensB: string[],
    user: string
  ): Promise<Decoded> {
    const decoded = (
      await this.account
        .method(ABI_getReservesByTokens)
        .call(tokensA, tokensB, user)
    ).decoded;
    // console.log('getReservesByTokens-decoded', decoded)
    return decoded;
  }
}
