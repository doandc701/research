// https://inspector.vecha.in/#/contract/detail?id=1
import Connex from "@vechain/connex";
import * as ABI_eventItemCreated from "../abis/VeSeaMarketPlace/VeseaListings/_eventItemCreated.json";
import * as ABI_eventItemEdited from "../abis/VeSeaMarketPlace/VeseaListings/_eventItemEdited.json";
import * as ABI_eventItemSold from "../abis/VeSeaMarketPlace/VeseaListings/_eventItemSold.json";

export default class VSMarketplaceListings {
  private account: Connex.Thor.Account.Visitor;

  constructor(address: string, connex: Connex) {
    this.account = connex.thor.account(address);
  }
  getEventItemCreated(): Connex.Thor.Account.Event {
    return this.account.event(ABI_eventItemCreated);
  }
  getEventItemEdited(): Connex.Thor.Account.Event {
    return this.account.event(ABI_eventItemEdited);
  }
  getEventItemSold(): Connex.Thor.Account.Event {
    return this.account.event(ABI_eventItemSold);
  }
}
