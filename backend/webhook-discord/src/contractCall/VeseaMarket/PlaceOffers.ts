// https://inspector.vecha.in/#/contract/detail?id=1
import Connex from "@vechain/connex";
import * as ABI_eventOfferCreated from "../abis/VeSeaMarketPlace/VeseaOffers/_eventOfferCreated.json";
import * as ABI_eventOfferPriceEdited from "../abis/VeSeaMarketPlace/VeseaOffers/_eventOfferPriceEdited.json";
import * as ABI_eventAccepted from "../abis/VeSeaMarketPlace/VeseaOffers/_eventOfferAccepted.json";

export default class VSMarketplaceOffers {
  private account: Connex.Thor.Account.Visitor;

  constructor(address: string, connex: Connex) {
    this.account = connex.thor.account(address);
  }
  getEventOfferCreated(): Connex.Thor.Account.Event {
    return this.account.event(ABI_eventOfferCreated);
  }
  getEventOfferPriceEdited(): Connex.Thor.Account.Event {
    return this.account.event(ABI_eventOfferPriceEdited);
  }
  getEventOfferAccepted(): Connex.Thor.Account.Event {
    return this.account.event(ABI_eventAccepted);
  }
}
