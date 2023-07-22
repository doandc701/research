import { Connex } from "@vechain/connex";
import ABI_totalSupply from "./abis/VPWeaponsMinter01/totalSupply.json";
import ABI_getMintfee from "./abis/VPWeaponsMinter01/getMintfee.json";
import ABI_totalMintCount from "./abis/VPWeaponsMinter01/totalMintCount.json";
import ABI_mintNFT from "./abis/VPWeaponsMinter01/mintNFT.json";
import ABI_vetxvpu from "./abis/VPWeaponsMinter01/vetxvpu.json";

export default class ERC1155 {
  private account: Connex.Thor.Account.Visitor;

  constructor(address: string, connex: Connex) {
    this.account = connex.thor.account(address);
  }

  async totalSupply(id: string): Promise<string> {
    const balance: string = (
      await this.account.method(ABI_totalSupply).call(id)
    ).decoded[0];
    return balance;
  }

  async totalMintCount(): Promise<string> {
    const total: string = (await this.account.method(ABI_totalMintCount).call())
      .decoded[0];
    return total;
  }

  async vetxvpu(): Promise<string> {
    const x: string = (await this.account.method(ABI_vetxvpu).call())
      .decoded[0];
    return x;
  }

  async getMintfee(tokenId: string, numberOfNfts: string): Promise<Indexable> {
    const results: Indexable = (
      await this.account.method(ABI_getMintfee).call(tokenId, numberOfNfts)
    ).decoded;
    return results;
  }

  mintNFT(
    tokenId: string,
    numberOfNfts: string,
    ids: string[],
    val: string,
    mss = ""
  ): Connex.Vendor.TxMessage[0] {
    const item = this.account
      .method(ABI_mintNFT)
      .value(val)
      .asClause(tokenId, numberOfNfts, ids);
    return {
      ...item,
      comment: mss
    };
  }
}
