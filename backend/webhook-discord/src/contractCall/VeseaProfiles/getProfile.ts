import * as ABI_readGetProfiles from "../abis/VeSeaMarketPlace/VeseaProfiles/_readGetProfiles.json";

export default class VeseaProfiles {
  private account: Connex.Thor.Account.Visitor;

  constructor(address: string, connex: Connex) {
    this.account = connex.thor.account(address);
  }
  getProfiles(addr: string) {
    return this.account.method(ABI_readGetProfiles).call(addr);
  }
}
