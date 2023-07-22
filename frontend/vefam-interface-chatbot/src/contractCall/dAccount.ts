import Connex from "@vechain/connex";
import ABI_registerNameXName from "./abis/d-account/registerNameXName.json";
import ABI_registrationFee from "./abis/d-account/_registrationFee.json";
import ABI_checkIfNameValid from "./abis/d-account/checkIfNameValid.json";
import ABI_getVIPInfoxAddress from "./abis/d-account/getVIPInfoxAddress.json";
import ABI_getVIPInfosxAddress from "./abis/d-account/getVIPInfosxAddress.json";
import ABI_vipIDxName from "./abis/d-account/_vipIDxName.json";
import ABI_eveRegisterName from "./abis/d-account/eveRegisterName.json";
import ABI_vips from "./abis/d-account/_vips.json";
import ABI_vipIDxAddr from "./abis/d-account/_vipIDxAddr.json";
import ABI_claim from "./abis/d-account/claim.json";
// import ABI_getValidCode from "./abis/d-account/getValidCode.json";
import ABI_linkAccount from "./abis/d-account/linkAccount.json";
import ABI_players from "./abis/d-account/_players.json";
import ABI_depositCount from "./abis/d-account/_depositCount.json";
import ABI_eveUserDeposit from "./abis/d-account/eveUserDeposit.json";
import ABI_supportedPayments from "./abis/d-account/supportedPayments.json";
import ABI_userDeposit from "./abis/d-account/userDeposit.json";

/*
// chưa sử dụng
changeCode, _addrxCode, _whitelists, userDeposit
// event chưa sử dụng

// không sử dụng
  _supportedPaymentMap: đã sử dụng "supportedPayments"
*/

export default class DAccount {
  // private connex: Connex
  private account: Connex.Thor.Account.Visitor;

  constructor(address: string, connex: Connex) {
    // this.connex = connex
    this.account = connex.thor.account(address);
  }

  /*
  Lấy thông tin supportedPayments
  input {
    tokenAddresses: string[] (danh sách địa chỉ ví)
  }
  return {
    minAmounts: uint256[], (số lượng nạp tối thiểu [wei])
    enables: bool[] (được hỗ trợ hoặc không)
  }
  */
  async supportedPayments(tokenAddresses: string[]): Promise<Indexable> {
    return (
      await this.account.method(ABI_supportedPayments).call(tokenAddresses)
    ).decoded;
  }

  async getDepositCount(): Promise<string> {
    return (await this.account.method(ABI_depositCount).call()).decoded[0];
  }

  async getRegistrationFee(): Promise<string> {
    return (await this.account.method(ABI_registrationFee).call()).decoded[0];
  }

  async getPlayer(from: string): Promise<Indexable> {
    return (await this.account.method(ABI_players).call(from)).decoded;
  }

  async getVipIDxName(hex: string): Promise<string> {
    return (await this.account.method(ABI_vipIDxName).call(hex)).decoded[0];
  }

  async checkIfNameValid(nameString: string): Promise<string> {
    return (await this.account.method(ABI_checkIfNameValid).call(nameString))
      .decoded[0];
  }

  async getVIPInfoxAddress(from: string): Promise<Indexable> {
    return (await this.account.method(ABI_getVIPInfoxAddress).call(from))
      .decoded;
  }

  async getVipIDxAddr(from: string): Promise<string> {
    return (await this.account.method(ABI_vipIDxAddr).call(from)).decoded[0];
  }

  // để lấy nameCount vì không có method nào trả về nameCount
  async getVIPInfoxVIPId(vipID: string): Promise<Indexable> {
    return (await this.account.method(ABI_vips).call(vipID)).decoded;
  }

  async getVIPInfosxAddress(from: string): Promise<Indexable> {
    return (await this.account.method(ABI_getVIPInfosxAddress).call(from))
      .decoded;
  }

  // truyền vào một string và trả về bytes32 code nếu code này chưa sử dụng cho Address nào liên kết
  // kiểm tra trước khi sử dụng cho changeCode, linkAccount
  /* async getValidCode(codeString: string): Promise<string> {
    return (await this.account.method(ABI_getValidCode).call(codeString))
      .decoded[0];
  } */

  // Events ------------------------------------------------------
  async getEveRegisterName(): Promise<Connex.Thor.Account.Event> {
    return this.account.event(ABI_eveRegisterName);
  }
  async getEveUserDeposit(): Promise<Connex.Thor.Account.Event> {
    return this.account.event(ABI_eveUserDeposit);
  }

  // SignedRequest functions ------------------------------------------------------
  registerNameXName(
    nameString: string,
    affCode: string,
    val: string
  ): Connex.Vendor.TxMessage[0] {
    return this.account
      .method(ABI_registerNameXName)
      .value(val)
      .asClause(nameString, affCode);
  }
  // User rút phần thưởng từ giới thiệu thành viên VIP
  claim(): Connex.Vendor.TxMessage[0] {
    return this.account.method(ABI_claim).asClause();
  }
  // liên kết C-Account với D-Account thông qua codeString
  linkAccount(codeString: string): Connex.Vendor.TxMessage[0] {
    return this.account.method(ABI_linkAccount).asClause(codeString);
  }

  /*
  User nạp token
  input {
    tokenAddresses: address (địa chỉ token, native coin sử dụng address zero)
    amount: uint256 (số wei nạp)
  }
  */
  userDeposit(
    tokenAddresses: string,
    amount: string,
    val: string,
    mss = ""
  ): Connex.Vendor.TxMessage[0] {
    const item = this.account
      .method(ABI_userDeposit)
      .value(val)
      .asClause(tokenAddresses, amount);
    return {
      ...item,
      comment: mss
    };
  }
}