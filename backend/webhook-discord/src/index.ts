import { Server } from "colyseus";
import { createServer } from "http";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/index";
import { botDiscord } from "./controllers/BotController";
import { ChatRoom } from "./utils/chatRoomHandle";
import { connectMongoose } from "./config/connectMongoDB";
import { getDataWebHook } from "./controllers/WebHookController";
const app = express();
let port = 2000;
const corsOptions = {
  origin: "http://localhost:8848",
  credentials: true,
  optionSuccessStatus: 200,
};
// const chatServer = new Server({
//   server: createServer(app),
// });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
routes(app);
// Kết nối mongoDB
connectMongoose();
// Kết nối bot với máy chủ Discord
// botDiscord();
getDataWebHook();
// chatServer.define("chat", ChatRoom);
// chatServer.listen(port);
// console.log(`Colyseus server started on port ${port}`);
