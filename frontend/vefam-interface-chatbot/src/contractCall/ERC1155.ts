import { Connex } from "@vechain/connex";
import ABI_balanceOf from "./abis/ERC1155/balanceOf.json";
import ABI_balanceOfBatch from "./abis/ERC1155/balanceOfBatch.json";
import ABI_safeTransferFrom from "./abis/ERC1155/safeTransferFrom.json";
// import ABI_safeBatchTransferFrom from "./abis/ERC1155/safeBatchTransferFrom.json";

export default class ERC1155 {
  private account: Connex.Thor.Account.Visitor;

  constructor(address: string, connex: Connex) {
    this.account = connex.thor.account(address);
  }

  async balanceOf(account: string, id: string): Promise<string> {
    const balance: string = (
      await this.account.method(ABI_balanceOf).call(account, id)
    ).decoded[0];
    return balance;
  }

  async balanceOfBatch(accounts: string[], ids: string[]): Promise<string> {
    const balance: string = (
      await this.account.method(ABI_balanceOfBatch).call(accounts, ids)
    ).decoded[0];
    return balance;
  }

  safeTransferFrom(
    from: string,
    to: string,
    id: string,
    amount: string,
    data: string
  ): Connex.Vendor.TxMessage[0] {
    return this.account
      .method(ABI_safeTransferFrom)
      .asClause(from, to, id, amount, data);
  }
}
