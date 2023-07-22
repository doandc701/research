import axios from "axios";
import { EmbedBuilder, WebhookClient, AttachmentBuilder } from "discord.js";
import schedule from "node-schedule";
import { dataArr } from "../data";
// console.log(dataArr);

const file = new AttachmentBuilder(
  "../BEChatDiscord/public/assets/punk0003.png"
);
function scheduleStart() {
  const startTime = new Date(Date.now() + 5000);
  const endTime = new Date(startTime.getTime() + 5000);
  schedule.scheduleJob(
    { start: startTime, end: endTime, rule: "*/5 * * * * *" },
    async function () {
      console.log("giay thu 5 chay 1 lan ");
      // console.log("dataArr.url", dataArr.url);
      // const dataPost = await axios
      //   .post(dataArr.url, {
      //     embeds: arrayData,
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
      // if (!dataPost) return;
      // let finalData = JSON.parse(dataPost.config.data)?.embeds
      // console.log(finalData);

      const arrayData = [
        {
          title: "Buy",
          fields: [
            {
              name: `VPU-${Math.floor(Math.random() * 1000)}`,
              value: `${Math.floor(Math.random() * 100) / 1000}`,
            },
          ],
          description: `${Math.floor(Math.random() * 10)}`,
        },
        {
          title: "Sell",
          fields: [
            {
              name: `VET-${Math.floor(Math.random() * 1000)}`,
              value: `${Math.floor(Math.random() * 100) / 800}`,
            },
          ],
          description: `${Math.floor(Math.random() * 20)}`,
        },
        {
          title: "Buy",
          fields: [
            {
              name: `VTHO-${Math.floor(Math.random() * 1000)}`,
              value: `${Math.floor(Math.random() * 100) / 600}`,
            },
          ],
          description: `${Math.floor(Math.random() * 30)}`,
        },
      ];

      const randomTrade =
        arrayData[Math.floor(Math.random() * arrayData.length)];

      // console.log("randomTrade", randomTrade);

      let addd: any = [];
      randomTrade.fields.forEach((item1: any) => {
        // console.log(item1);
        addd.push({
          name: `Token: ${item1.name}`,
          value: `Price: ${item1.value}`,
          inline: true,
        });
      });

      const webhookClient: WebhookClient = new WebhookClient({
        id: dataArr.id,
        token: dataArr.token,
      });

      let linkTextBlockNumber: string | number = "15736627";
      let linkUrlBlockNumber: string =
        "https://vechainstats.com/transaction/0x42f3fb93414bed106a4f62b68cac3ae2aec37ba30dada82bd349640ad1d3d263/";
      let linkTextSeller: string = "Toast";
      let linkUrlSeller: string =
        "https://www.vesea.io/profile/0x048f7a02f59d648f2195811a9d8e3c2849f54930";

      let listItems: string[] = ["Peak Spike", "Frown", "Vape", "Rosy Cheeks"];
      let formattedAttributes: string = "";
      const indentation = "\u2003".repeat(1); // sử dụng ký tự không khả hiệu (\u2003) tạo khoảng trắng giả
      listItems.forEach((item) => {
        formattedAttributes += `${indentation}• ${item}\n`;
      });

      const configEmbed: EmbedBuilder = new EmbedBuilder({
        title: "VPUNKS [BUY NOW]",
        url: "https://www.vesea.io/assets?collection=vpunks",
        author: {
          name: "Vesea Marketplace",
          icon_url:
            "https://i.pinimg.com/564x/59/b0/d9/59b0d9ae1f56a9d5d631a85ed24c407b.jpg",
          url: "https://discord.js.org",
        },
        // description: "Webhook Trade Coin",
        thumbnail: {
          // url: "https://vesea-collections.s3.amazonaws.com/vpunks/images/9849.png",
          url: "attachment://punk0003.png",
          width: 500,
          height: 500,
        },
        fields: [
          { name: "\u000B", value: "\u000B" },
          { name: "\u000B", value: " " },
          {
            name: `🟩 LISTED (EDIT)`,
            value: " ",
          },
          {
            name: "Rank",
            value: "294,39",
            inline: true,
          },
          {
            name: "Price",
            value: "7,999.0 VET",
            inline: true,
          },
          {
            name: "Block Number",
            value: `[${linkTextBlockNumber}](${linkUrlBlockNumber})`,
          },
          {
            name: "Seller",
            value: `[${linkTextSeller}](${linkUrlSeller})`,
          },
          {
            name: "Attributes",
            value: `⁍  Luxurious Beard\n ${formattedAttributes}`,
          },
          {
            name: "The Free Market Bot",
            value: " ",
          },
          // {
          //   name: randomMessage.title,
          //   value: `Quantity: ${randomMessage.description}`,
          // },
          // { name: "\u200B", value: "\u200B" },
          // ...addd,
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "Vpunks always by your side",
          icon_url: "https://i.imgur.com/AfFp7pu.png",
        },
      });
      configEmbed.setColor("Random");

      await webhookClient.send({
        username: "some-username",
        avatarURL: "https://i.imgur.com/AfFp7pu.png",
        embeds: [configEmbed],
        files: [file],
      });
    }
  );
}

export { scheduleStart };
