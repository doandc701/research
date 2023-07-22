import { EmbedBuilder, WebhookClient } from "discord.js";
import { fromWei } from "../../utils/formatWei";
import { handleShortHand } from "../../utils/shortHandString";
import {
  webhookClientSales,
  webhookClientListingsAndOffers,
} from "../WebHookController";
import { getTimes, addAndUpdateTime } from "./SaveTimeVpunks";
import { statusBlockTimestamp } from "../WebHookController";
import VPMarketplace from "../../contractCall/VPunksMarketPlace";
import punks_1 from "../../punks/0-9999-v3.json";

async function initialAllEventVpunks(contractCallVpunks: VPMarketplace) {
  let arrayMix: any[] = [];
  let updateTimeArrayMix: number = 0;
  const eventCreated = contractCallVpunks.getEventAuctionCreated();
  const eventUpdated = contractCallVpunks.getEventAuctionUpdated();
  const eventSuccess = contractCallVpunks.getEventAuctionSuccessful();

  const arrayAuctionCreated = await handleAllEventAuction(eventCreated);
  const arrayAuctionUpdated = await handleAllEventAuction(eventUpdated);
  const arrayAuctionSuccess = await handleAllEventAuction(eventSuccess);

  if (!arrayAuctionCreated || !arrayAuctionUpdated || !arrayAuctionSuccess) {
    console.log("Vpunks chua co thong bao  moi");
    return;
  }

  for (let iCreated in arrayAuctionCreated) {
    arrayMix.push({
      type: "AuctionCreated",
      event: arrayAuctionCreated[iCreated],
    });
  }
  for (let iUpdated in arrayAuctionUpdated) {
    arrayMix.push({
      type: "AuctionUpdated",
      event: arrayAuctionUpdated[iUpdated],
    });
  }
  for (let iSuccess in arrayAuctionSuccess) {
    arrayMix.push({
      type: "AuctionSuccess",
      event: arrayAuctionSuccess[iSuccess],
    });
  }
  if (arrayMix.length <= 0) return;
  arrayMix = arrayMix.sort(
    (a, b) => a.event.meta.blockTimestamp - b.event.meta.blockTimestamp
  );
  updateTimeArrayMix = arrayMix[arrayMix.length - 1].event.meta.blockTimestamp;
  addAndUpdateTime(updateTimeArrayMix);
  handleWebHookVpunks(arrayMix);
}

async function handleAllEventAuction(eventVpunks: Connex.Thor.Account.Event) {
  const nowDateTime = new Date().getTime();
  const timeCurrent = Math.floor(nowDateTime / 1000);
  let fromIndex = 0;
  const filterLimit = 256; // connex trả về tối đa 256 event
  let timeS: number | undefined = await getTimes();
  let fromTime: number = timeS ?? statusBlockTimestamp;
  let logResults: any = [];
  const filterAndSort = eventVpunks
    .filter([])
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
  while (results && results.length >= filterLimit) {
    fromIndex += filterLimit;
    results = await filterAndSort.apply(fromIndex, filterLimit).catch(() => {});
    if (results) {
      logResults = logResults.concat(results);
    }
  }
  return logResults;
}

async function handleWebHookVpunks(arrayData: any[]) {
  arrayData.forEach(async (itemArr) => {
    // typeEvent: 'AuctionCreated' || 'AuctionUpdated' ||  'AuctionSuccess'
    const getPunks: any = punks_1.find(
      (item) => item.id.toString() === itemArr.event.decoded.tokenId.toString()
    );
    if (!getPunks) return;
    const ranks: string = getPunks.rank;
    const listAccessories: string[] = getPunks.accessories;
    const linkUrlBlockNumber: string = ` https://vechainstats.com/transaction/${itemArr.event.meta.txID}/`;
    const linkUrlSeller: string = `https://vechainstats.com/account/${itemArr.event.decoded.seller}`;
    const linkUrlBuyer: string = `https://vechainstats.com/account/${itemArr.event.decoded.winner}`;
    const listItems: string[] = listAccessories;
    let formattedAttributes: string = "";
    const indentation = "\u2003".repeat(1); // sử dụng ký tự không khả hiệu (\u2003) tạo khoảng trắng giả
    listItems?.forEach((item) => {
      formattedAttributes += `${indentation}• ${item}\n`;
    });
    const profileSeller = await handleShortHand(itemArr.event.decoded.seller);
    const profileBuyer = await handleShortHand(itemArr.event.decoded.winner);
    if (itemArr.type == "AuctionSuccess") {
      const configEmbed: EmbedBuilder = new EmbedBuilder({
        title: `VPUNKS #${itemArr.event.decoded.tokenId}`,
        url: "https://www.vpunks.com/#/auctions/index",
        author: {
          name: "VPunks Marketplace",
        },
        thumbnail: {
          url: `https://cryptopunks.app/cryptopunks/cryptopunk${itemArr.event.decoded.tokenId}.png?size=400`,
        },
        fields: [
          { name: "\u000B", value: "\u000B" },
          { name: "\u000B", value: " " },
          {
            name: `🟥 SOLD`,
            value: " ",
          },
          {
            name: "Rarity",
            value: ranks,
            inline: true,
          },
          {
            name: "Price",
            value: `${fromWei(itemArr.event.decoded.price)} VET`,
            inline: true,
          },
          {
            name: "Block Number",
            value: `[${itemArr.event.meta.blockNumber}](${linkUrlBlockNumber})`,
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
          itemArr.event.meta.blockTimestamp * 1000
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
      // CREATED AND UPDATE
      const configEmbed: EmbedBuilder = new EmbedBuilder({
        title: `VPUNKS #${itemArr.event.decoded.tokenId} [BUY NOW]`,
        url: "https://www.vpunks.com/#/auctions/index",
        author: {
          name: "VPunks Marketplace",
        },
        thumbnail: {
          url: `https://cryptopunks.app/cryptopunks/cryptopunk${itemArr.event.decoded.tokenId}.png?size=400`,
        },
        fields: [
          { name: "\u000B", value: "\u000B" },
          { name: "\u000B", value: " " },
          {
            name: `🟩 LISTED ${
              itemArr.type == "AuctionUpdated" ? "(EDIT)" : ""
            } `,
            value: " ",
          },
          {
            name: "Rarity",
            value: ranks,
          },
          {
            name: "Block Number",
            value: `[${itemArr.event.meta.blockNumber}](${linkUrlBlockNumber})`,
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
          itemArr.event.meta.blockTimestamp * 1000
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

export { initialAllEventVpunks };
