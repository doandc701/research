import "dotenv/config";
import axios from "axios";
import { WebhookClient } from "discord.js";
import { Framework } from "@vechain/connex-framework";
import { Driver, SimpleNet } from "@vechain/connex-driver";
import VPMarketplace from "../contractCall/VPunksMarketPlace";
import VSMarketplaceListings from "../contractCall/VeseaMarket/PlaceListings";
import VSMarketplaceOffers from "../contractCall/VeseaMarket/PlaceOffers";
import VeseaProfiles from "../contractCall/VeseaProfiles/getProfile";
import { initialAllEventVpunks } from "./VpunksHandle";
import { initialAllEventListingsVesea } from "./VeseaHandle/listings";
import { initialAllEventOffersVesea } from "./VeseaHandle/offers";
import { Ticker } from "../utils/connex";

let webhookClientSales: WebhookClient;
let webhookClientListingsAndOffers: WebhookClient;
let $connex = {} as Connex;
let $VPMarket = {} as VPMarketplace;
let $VSMarketListings = {} as VSMarketplaceListings;
let $VSMarketOffers = {} as VSMarketplaceOffers;
let $VSProfiles = {} as VeseaProfiles;
let statusBlockTimestamp = 0;
const VpunksNFTAddr = "0xe92FDDD633008C1bca6E738725d2190cD46DF4a1";
const VPunksMarketPlaceAddr = "0x31C71f4Cd01FDDD940A46DAfd72d3291f52040a4";
const VeSeaListingsAddr = "0xDafCA4A51eA97B3b5F21171A95DAbF540894a55A";
const VeseaOffersAddr = "0xdab185Ca52b70e087eC0990aD59C612c3d7aAb14";
const VeseaProfilesAddr = "0x242035f42C59119b9A22D4270506c07Fb792e55C";

export const getDataWebHook = async () => {
  const urlSales: string = process.env.WEBHOOK_SALES || "";
  const urlListingsOffers: string = process.env.WEBHOOK_LISTINGS_OFFERS || "";
  if (!urlSales || !urlListingsOffers) return;
  const webHookListings = await axios.get(urlListingsOffers).catch(() => {});
  const webHookSales = await axios.get(urlSales).catch(() => {});
  webhookClientSales = new WebhookClient({
    id: webHookSales?.data.id,
    token: webHookSales?.data.token,
  });
  webhookClientListingsAndOffers = new WebhookClient({
    id: webHookListings?.data.id,
    token: webHookListings?.data.token,
  });
  getConnex().catch((error) => {
    console.log(error);
  });
};

async function getConnex() {
  const rpc = "mainnet"
    ? "https://mainnet.veblocks.net"
    : "https://testnet.outofgas.io";
  const net = new SimpleNet(rpc);
  Driver.connect(net)
    .then(async (driver) => {
      $connex = new Framework(driver);
      statusBlockTimestamp = $connex.thor.status.head.timestamp;
      $VPMarket = new VPMarketplace(VPunksMarketPlaceAddr, $connex);
      $VSMarketListings = new VSMarketplaceListings(VeSeaListingsAddr, $connex);
      $VSMarketOffers = new VSMarketplaceOffers(VeseaOffersAddr, $connex);
      $VSProfiles = new VeseaProfiles(VeseaProfilesAddr, $connex);
      initTicker();
    })
    .catch((e) => {
      const err = `VeChain Driver.connect error: ${e.message}`;
      console.error(`\u001B[31m !!!!! ${err} !!!!! \u001B[0m`);
    });
}
function initTicker() {
  let ticker: Ticker | null = null;
  const task = (): void => {
    if (ticker) {
      ticker.stop();
    }
    ticker = new Ticker($connex);
    console.log("initTicker");
    ticker.tick(getEventContractCall);
  };
  task();
}
function getEventContractCall(): Promise<void> {
  return isEventMix();
}
async function isEventMix() {
  initialAllEventVpunks($VPMarket);
  initialAllEventListingsVesea($VSMarketListings);
  initialAllEventOffersVesea($VSMarketOffers);
}

export {
  webhookClientSales,
  webhookClientListingsAndOffers,
  statusBlockTimestamp,
  $VSProfiles,
  VpunksNFTAddr,
};
