import { Room, Client } from "colyseus";
import { DiscordMessages, setRoom, channelList } from "../data";
export class ChatRoom extends Room {
  private channel: any;
  // This method is called when a client joins the room
  onJoin(client: any, options: any) {
    this.channel = options.channel;
    console.log("ChatRoom created!", options.channel, this.roomId);
    setRoom(this);
    const showChannelChat = channelList.map((item) => item.bodyChat);
    client.send("messages", showChannelChat);
  }

  onDiscordMess(mess: DiscordMessages, fromChannel?: any) {
    console.log("onDiscordMess", fromChannel);
    const findNameChannel: any = channelList.find(
      (item) => item.id === fromChannel
    );
    this.broadcast("sendMessages", { mess, sender: findNameChannel.name });
  }
  // This method is called when the room is disposed
  onDispose() {
    console.log("Dispose ChatRoom");
  }
}
