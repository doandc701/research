import { Attachment } from "discord.js";
import { ChatRoom } from "../utils/chatRoomHandle";

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

export { DiscordMessages, channelList, getRoom, setRoom };
