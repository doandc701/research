import "dotenv/config";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { scheduleStart } from "../service/scheduleWebHook";

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
// lắng nghe sự kiện bot đã sẵn sàng
export const handleWebHook = () => {
  client.on("ready", async () => {
    try {
      console.log(`Bot đã sẵn sàng với tên ${client.user?.tag}!`);
      scheduleStart();
    } catch (error) {
      console.error("Error occurred:", error);
    }
  });
  // Kết nối bot với máy chủ Discord
  client.login(process.env.CLIENT_TOKEN);
};
