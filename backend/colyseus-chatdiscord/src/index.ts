import { Server } from "colyseus";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index";
import { eventDiscord } from "./controllers/BotController";
import { handleWebHook } from "./controllers/WebHookController";
import { getDataWebHook } from "./data";
import { ChatRoom } from "./utils/ChatRoomHandle";
const app = express();
let port = 2000;
const corsOptions = {
  origin: "http://localhost:8848",
  credentials: true,
  optionSuccessStatus: 200,
};
const chatServer = new Server({
  server: createServer(app),
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
routes(app);
// Kết nối bot với máy chủ Discord
try {
  eventDiscord();
  handleWebHook();
} catch (error) {
  console.log(error);
}
getDataWebHook();
chatServer.define("chat", ChatRoom);
chatServer.listen(port);
console.log(`Colyseus server started on port ${port}`);
