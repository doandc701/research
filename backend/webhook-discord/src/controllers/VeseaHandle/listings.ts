import { EmbedBuilder, WebhookClient } from "discord.js";
import { fromWei } from "../../utils/formatWei";
import { handleShortHand } from "../../utils/shortHandString";
import {
  webhookClientSales,
  webhookClientListingsAndOffers,
  VpunksNFTAddr,
} from "../WebHookController";
import { getTimesVesea, addAndUpdateTimeVesea } from "./SaveTimeVesea";
import { statusBlockTimestamp } from "../WebHookController";
import VSMarketplaceListings from "../../contractCall/VeseaMarket/PlaceListings";
import punks_1 from "../../punks/0-9999-v3.json";

async function initialAllEventListingsVesea(
  contractCallListings: VSMarketplaceListings
) {
  let arrayMix: any[] = [];
  let updateTimeArrayMix: number = 0;
  const eventCreated = contractCallListings.getEventItemCreated();
  const eventEdited = contractCallListings.getEventItemEdited();
  const eventSold = contractCallListings.getEventItemSold();

  const arrayItemsCreated = await handleAllEventListings(eventCreated);
  const arrayItemsEdited = await handleAllEventListings(eventEdited);
  const arrayItemsSold = await handleAllEventListings(eventSold);
  if (!arrayItemsCreated || !arrayItemsEdited || !arrayItemsSold) {
    console.log("Vesea Listings chua co thong bao  moi");
    return;
  }

  for (let iCreated in arrayItemsCreated) {
    arrayMix.push({
      type: "ItemsCreated",
      event: arrayItemsCreated[iCreated],
    });
  }
  for (let iUpdated in arrayItemsEdited) {
    arrayMix.push({
      type: "ItemsEdited",
      event: arrayItemsEdited[iUpdated],
    });
  }
  for (let iSold in arrayItemsSold) {
    arrayMix.push({
      type: "ItemsSold",
      event: arrayItemsSold[iSold],
    });
  }
  if (arrayMix.length <= 0) return;
  arrayMix = arrayMix.sort(
    (a, b) => a.event.meta.blockTimestamp - b.event.meta.blockTimestamp
  );
  updateTimeArrayMix = arrayMix[arrayMix.length - 1].event.meta.blockTimestamp;
  addAndUpdateTimeVesea(updateTimeArrayMix, "listings");
  handleWebHookVeseaListings(arrayMix);
}

async function handleAllEventListings(
  eventListings: Connex.Thor.Account.Event
) {
  const nowDateTime = new Date().getTime();
  const timeCurrent = Math.floor(nowDateTime / 1000);
  let fromIndex = 0;
  const filterLimit = 256; // connex trả về tối đa 256 event
  let timeS: number | undefined = await getTimesVesea("listings");
  let fromTime: number = timeS ?? statusBlockTimestamp;
  let logResults: any = [];
  const filterAndSort = eventListings
    .filter([{ nftAddress: VpunksNFTAddr }])
    .range({
      unit: "time",
      from: fromTime,
      to: timeCurrent + 999999,
    })
    .order("asc");
  let results: any = await filterAndSort
    .apply(fromIndex, filterLimit)
    .catch(() => {});
  if (!results) return undefined;
  if (results.length < filterLimit) return results;
  logResults = logResults.concat(results);
  while (results.length >= filterLimit) {
    fromIndex += filterLimit;
    results = await filterAndSort.apply(fromIndex, filterLimit).catch(() => {});
    if (results) {
      logResults = logResults.concat(results);
    }
  }
  return logResults;
}

async function handleWebHookVeseaListings(arrayData: any[]) {
  arrayData.forEach(async (items) => {
    // typeEvent: 'ItemsCreated' | 'ItemsEdited' | 'ItemsSold'
    const getPunks: any = punks_1.find(
      (el) => el.id.toString() === items.event.decoded.tokenId.toString()
    );
    if (!getPunks) return;
    const ranks: string = getPunks.rank;
    const listAccessories: string[] = getPunks.accessories;
    const linkUrlBlockNumber: string = `https://vechainstats.com/transaction/${items.event.meta.txID}/`;
    const linkUrlSeller: string = `https://vechainstats.com/account/${items.event.decoded.seller}`;
    const linkUrlBuyer: string = `https://vechainstats.com/account/${items.event.decoded.buyer}`;
    const listItems: string[] = listAccessories;
    let formattedAttributes: string = "";
    const indentation = "\u2003".repeat(1); // sử dụng ký tự không khả hiệu (\u2003) tạo khoảng trắng giả
    listItems?.forEach((item) => {
      formattedAttributes += `${indentation}• ${item}\n`;
    });
    const profileSeller = await handleShortHand(items.event.decoded.seller);
    const profileBuyer = await handleShortHand(items.event.decoded.buyer);
    if (items.type == "ItemsSold") {
      const configEmbed: EmbedBuilder = new EmbedBuilder({
        title: `VPUNKS #${items.event.decoded.tokenId}`,
        url: "https://www.vesea.io/assets?collection=vpunks&id",
        author: {
          name: "Vesea Marketplace",
        },
        thumbnail: {
          url: `https://cryptopunks.app/cryptopunks/cryptopunk${items.event.decoded.tokenId}.png?size=400`,
        },
        fields: [
          { name: "\u000B", value: "\u000B" },
          { name: "\u000B", value: " " },
          {
            name: `🟥 SOLD`,
            value: " ",
          },
          {
            name: "Rank",
            value: ranks,
            inline: true,
          },
          {
            name: "Price",
            value: `${fromWei(items.event.decoded.price)} VET`,
            inline: true,
          },
          {
            name: "Block Number",
            value: `[${items.event.meta.blockNumber}](${linkUrlBlockNumber})`,
          },
          {
            name: "Seller",
            value: `[${profileSeller}](${linkUrlSeller})`,
            inline: true,
          },
          {
            name: "Buyer",
            value: `[${profileBuyer}](${linkUrlBuyer})`,
            inline: true,
          },
          {
            name: "Attributes",
            value: `${formattedAttributes}`,
          },
          {
            name: "The Free Market Bot",
            value: " ",
          },
        ],
        timestamp: new Date(
          items.event.meta.blockTimestamp * 1000
        ).toISOString(),
        footer: {
          text: "Vpunks always by your side",
        },
      });
      configEmbed.setColor("Red");

      webhookClientSales.send({
        username: "Sales",
        avatarURL: "https://vpunks.com/static/img/vpunks-welcome.45165788.png",
        embeds: [configEmbed],
      });
    } else {
      const configEmbed: EmbedBuilder = new EmbedBuilder({
        title: `VPUNKS #${items.event.decoded.tokenId} [BUY NOW]`,
        url: `https://www.vesea.io/assets?collection=vpunks&id=${items.event.decoded.tokenId}`,
        author: {
          name: "Vesea Marketplace",
        },
        thumbnail: {
          url: `https://cryptopunks.app/cryptopunks/cryptopunk${items.event.decoded.tokenId}.png?size=400`,
        },
        fields: [
          { name: "\u000B", value: "\u000B" },
          { name: "\u000B", value: " " },
          {
            name: `🟩 LISTED ${items.type == "ItemsEdited" ? "(EDIT)" : ""} `,
            value: " ",
          },
          {
            name: "Rank",
            value: ranks,
            inline: true,
          },
          {
            name: "Price",
            value: `${
              items.type == "ItemsCreated"
                ? fromWei(items.event.decoded.price)
                : fromWei(items.event.decoded.newPrice)
            } VET`,
            inline: true,
          },
          {
            name: "Block Number",
            value: `[${items.event.meta.blockNumber}](${linkUrlBlockNumber})`,
          },
          {
            name: "Seller",
            value: `[${profileSeller}](${linkUrlSeller})`,
            inline: true,
          },
          {
            name: "Attributes",
            value: `${formattedAttributes}`,
          },
          {
            name: "The Free Market Bot",
            value: " ",
          },
        ],
        timestamp: new Date(
          items.event.meta.blockTimestamp * 1000
        ).toISOString(),
        footer: {
          text: "Vpunks always by your side",
        },
      });
      configEmbed.setColor("Green");

      webhookClientListingsAndOffers.send({
        username: "Listings/Offers",
        avatarURL: "https://vpunks.com/static/img/vpunks-welcome.45165788.png",
        embeds: [configEmbed],
      });
    }
  });
}

export { initialAllEventListingsVesea };
