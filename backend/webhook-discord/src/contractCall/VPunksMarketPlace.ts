// https://inspector.vecha.in/#/contract/detail?id=1
import Connex from "@vechain/connex";
import * as ABI_eventAuctionCreated from "./abis/VPunksMarketPlace/_eventAuctionCreated.json";
import * as ABI_eventAuctionSuccessful from "./abis/VPunksMarketPlace/_eventAuctionSuccessful.json";
import * as ABI_eventAuctionUpdated from "./abis/VPunksMarketPlace/_eventAuctionUpdated.json";

export default class VPMarketplace {
  private account: Connex.Thor.Account.Visitor;

  constructor(address: string, connex: Connex) {
    this.account = connex.thor.account(address);
  }
  getEventAuctionCreated(): Connex.Thor.Account.Event {
    return this.account.event(ABI_eventAuctionCreated);
  }
  getEventAuctionUpdated(): Connex.Thor.Account.Event {
    return this.account.event(ABI_eventAuctionUpdated);
  }
  getEventAuctionSuccessful(): Connex.Thor.Account.Event {
    return this.account.event(ABI_eventAuctionSuccessful);
  }
}
