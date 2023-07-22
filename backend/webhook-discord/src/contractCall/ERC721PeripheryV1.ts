import { Connex } from "@vechain/connex";
import * as ABI_tokenOfOwnerByIndexs from "./abis/ERC721PeripheryV1/tokenOfOwnerByIndexs.json";

export default class ERC721PeripheryV1 {
  private account: Connex.Thor.Account.Visitor;

  constructor(address: string, connex: Connex) {
    this.account = connex.thor.account(address);
  }

  async tokenOfOwnerByIndexs(
    addr: string,
    owner: string,
    indexs: string[]
  ): Promise<string> {
    const tokenIds: string = (
      await this.account
        .method(ABI_tokenOfOwnerByIndexs)
        .call(addr, owner, indexs)
    ).decoded[0];
    return tokenIds;
  }
}
