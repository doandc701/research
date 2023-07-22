import "dotenv/config";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { getRoom, channelList } from "../data";

// Để chỉ định những sự kiện nào bạn muốn bot của mình nhận
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Channel],
});
/*
discord event -> server -> mongodb
client -> server -> mongodb -> server -> client

start server -> get 200 mess from discord -> luu vao mssArr
discord event -> server -> luu vao mssArr (mssArr.length > 200 thi xoa bot)
                        -> emit to client_conected
client first connect -> joinOrCreate from server -> emit mssArr to client
*/
// lắng nghe sự kiện bot đã sẵn sàng
export const botDiscord = () => {
  client.on("ready", async () => {
    try {
      console.log(`Bot đã sẵn sàng với tên ${client.user?.tag}!`);
      // Fetch a specific channel by its ID
      const requests = channelList.map(async (item) => {
        const channel: any = await client.channels.fetch(item.id);
        return channel.messages.fetch({ limit: 100 });
      });
      await Promise.all(requests)
        .then((result) => {
          for (let i in result) {
            result[i].forEach((message: any) => {
              channelList[i].bodyChat.unshift({
                content: message.content,
                author: message.author.username,
                avatar: message.author.avatar,
                attachments: message.attachments,
                time: message.createdTimestamp,
              });
            });
          }
        })
        .catch(function (e) {
          console.log("Load all balanceOf error", e);
        });
    } catch (error) {
      console.error("Error occurred:", error);
    }
  });

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    const mapAtt = message.attachments.map((item) => item);
    const messageDiscord = {
      content: message.content,
      author: message.author.username,
      avatar: message.author.avatar?.toString(),
      attachments: mapAtt.length > 0 ? mapAtt : [],
      time: message.createdTimestamp,
    };
    getRoom().onDiscordMess(messageDiscord, message.channelId);
  });
  // Kết nối bot với máy chủ Discord
  client.login(process.env.TOKEN_KEY);
};
