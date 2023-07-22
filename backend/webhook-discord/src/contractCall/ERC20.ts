import Connex from "@vechain/connex";
import * as ABI_APPROVE from "./abis/ERC20/approve.json";
import * as ABI_BALANCE_OF from "./abis/ERC20/balanceOf.json";
import * as ABI_transfer from "./abis/ERC20/transfer.json";

export default class ERC20 {
	private account: Connex.Thor.Account.Visitor;

	constructor(address: string, connex: Connex) {
		this.account = connex.thor.account(address);
	}

	async balanceOf(addr: string): Promise<string> {
		const balance: string = (
			await this.account.method(ABI_BALANCE_OF).call(addr)
		).decoded[0];
		return balance;
	}

	// SignedRequest functions ------------------------------------------------------
	approve(
		addr: string,
		amount: string,
		mss = "Approve token",
	): Connex.Vendor.TxMessage[0] {
		const item = this.account.method(ABI_APPROVE).asClause(addr, amount);
		return {
			...item,
			comment: mss,
		};
	}

	transfer(
		recipient: string,
		amount: string,
		mss = "Transfer token",
	): Connex.Vendor.TxMessage[0] {
		const item = this.account.method(ABI_transfer).asClause(recipient, amount);
		return {
			...item,
			comment: mss,
		};
	}
}
