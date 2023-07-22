import { Attachment } from "discord.js";
import { ChatRoom } from "../utils/ChatRoomHandle";
import axios from "axios";

interface DiscordMessages {
  author: String;
  avatar?: String;
  content: String;
  attachments?: Attachment[];
  time: Number;
}

interface ChannelList {
  id: string;
  name: string;
  bodyChat: DiscordMessages[];
}
let dataArr: any;
const channelList: ChannelList[] = [
  {
    id: "1107579199029518399",
    name: "main-chat",
    bodyChat: [],
  },
  {
    id: "1108702691783364628",
    name: "test-chat",
    bodyChat: [],
  },
  {
    id: "1108702731868311553",
    name: "test2-chat",
    bodyChat: [],
  },
];
let rooms: Map<string, ChatRoom> = new Map();
const getRoom = (): any => {
  return rooms;
};
const setRoom = (room: any) => {
  rooms = room;
};

const getDataWebHook = async () => {
  try {
    const { data } = await axios.get(
      "https://discordapp.com/api/webhooks/1122809627407548496/qgfcC-gqOqoSUmdt9mKB7NCy9EAVG5nAS3krm3nHuaiXir2WGMSX5lxPgq7-wcrWoEZf"
    );
    console.log(data);
    dataArr = data;
  } catch (error) {
    console.log(error);
  }
};

export {
  DiscordMessages,
  channelList,
  dataArr,
  getRoom,
  setRoom,
  getDataWebHook,
};
