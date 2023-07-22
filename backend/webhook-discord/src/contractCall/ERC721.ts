import { Connex } from "@vechain/connex";
import * as ABI_balanceOf from "./abis/ERC721/balanceOf.json";
import * as ABI_safeTransferFrom from "./abis/ERC721/safeTransferFrom.json";

export default class ERC721 {
  private account: Connex.Thor.Account.Visitor;

  constructor(address: string, connex: Connex) {
    this.account = connex.thor.account(address);
  }

  async balanceOf(owner: string): Promise<string> {
    const balance: string = (
      await this.account.method(ABI_balanceOf).call(owner)
    ).decoded[0];
    return balance;
  }

  safeTransferFrom(
    from: string,
    to: string,
    tokenId: string
  ): Connex.Vendor.TxMessage[0] {
    return this.account
      .method(ABI_safeTransferFrom)
      .asClause(from, to, tokenId);
  }
}
