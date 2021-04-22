import { RPeer, Hop, SocketEventData, RPeer_Construct } from "./RP";
export type PoodnaRole = "BROADCASTER" | "LISTENER" | "MAIN_LOOP" | "UNKNOWN";
export interface PoodnaPeerUser {
  id: string;
  role: PoodnaRole;
}
export interface PoodnaConstructor extends RPeer_Construct {
  get_users: () => PoodnaPeerUser[];
}
export class PoodnaPeer extends RPeer {
  combinedStream = new MediaStream();
  get_users: PoodnaConstructor["get_users"];
  constructor(c: PoodnaConstructor) {
    super(c);
    this.get_users = c.get_users;
  }
  onNewUserInRoom(user: PoodnaPeerUser) {}
  mainloops() {
    return this.get_users().filter((u) => u.role === "MAIN_LOOP");
  }
  broadcasters() {
    return this.get_users().filter((u) => u.role === "BROADCASTER");
  }
  listeners() {
    return this.get_users().filter((u) => u.role === "LISTENER");
  }
}
export class MainLoopPeer extends PoodnaPeer {
  async onOffer(data: SocketEventData) {
    //Connect back if it is mainLoopIds
    if (
      this.mainloops()
        .map((u) => u.id)
        .indexOf(data.fromUserId) >= 0
    ) {
      console.log("to", data.fromUserId);
      this.callToUser(data.fromUserId);
    } else if (
      this.broadcasters()
        .map((u) => u.id)
        .indexOf(data.fromUserId) >= 0
    ) {
      this.callToUser(data.fromUserId);
    }
  }
  async shouldAcceptOffer(data: SocketEventData) {
    //Accept incoming if broadcaster or mainloop
    return (
      this.mainloops()
        .map((u) => u.id)
        .indexOf(data.fromUserId) >= 0 ||
      this.broadcasters()
        .map((u) => u.id)
        .indexOf(data.fromUserId) >= 0
    );
  }
  async onConnect(hop: Hop) {
    //Trigger on data change
  }
  onNewUserInRoom(user: PoodnaPeerUser) {
    if (user.role === "BROADCASTER") {
      this.callToUser(user.id, true);
    } else if (user.role === "MAIN_LOOP") {
      this.callToUser(user.id, true);
    }
  }
}

export class BroadCasterPeer extends PoodnaPeer {
  outsiders_outgoing: Hop[] = [];

  combinedStream = new MediaStream();

  async onOffer(data: SocketEventData) {
    //Connect back if it is mainLoopIds and outsider ids
    if (
      this.mainloops()
        .map((u) => u.id)
        .indexOf(data.fromUserId) >= 0
    ) {
      const hop = await this.callToUser(data.fromUserId);
    } else if (
      this.listeners()
        .map((u) => u.id)
        .indexOf(data.fromUserId) >= 0
    ) {
      const hop = await this.callToUser(data.fromUserId);
      if (hop) {
        this.outsiders_outgoing.push(hop);
      }
    }
  }
  async shouldAcceptOffer(data: SocketEventData) {
    //Connect accept if it is mainLoopIds
    return (
      this.mainloops()
        .map((u) => u.id)
        .indexOf(data.fromUserId) >= 0
    );
  }
  selectStream(fromId: string, toId: string) {
    //Use combine stream if it is connection to outsider
    if (
      this.listeners()
        .map((u) => u.id)
        .indexOf(toId) >= 0
    ) {
      return this.combinedStream;
    }
    return this.localStream;
  }
  async onConnect(hop: Hop) {
    //Trigger on data change
  }
  async onDeleteHop(hop: Hop) {
    for (const stream of hop.allStreams) {
      for (const t of stream.getTracks()) {
        this.combinedStream.removeTrack(t);
      }
    }
  }
  async onStream(mediaStream: MediaStream, hop: Hop) {
    //When got new stream then combined

    this.combinedStream.addTrack(mediaStream.getTracks()[0]);
    console.log("this.combinedStream", this.combinedStream.getTracks());
    for (const outsider of this.outsiders_outgoing) {
      outsider.onStreamChange();
      outsider.outgoingConnection();
    }
    return;
  }
  onNewUserInRoom(user: PoodnaPeerUser) {
    if (user.role === "BROADCASTER") {
      this.callToUser(user.id, true);
    } else if (user.role === "MAIN_LOOP") {
      this.callToUser(user.id, true);
    } else if (user.role === "LISTENER") {
      this.callToUser(user.id, true);
    }
  }
}

export class ListenerPeer extends PoodnaPeer {
  combinedStream = new MediaStream();

  async onOffer(data: SocketEventData) {
    //Do not connect back
  }
  async shouldAcceptOffer(data: SocketEventData) {
    //Do not accept any offer
    return (
      this.broadcasters()
        .map((b) => b.id)
        .indexOf(data.fromUserId) >= 0
    );
  }
  async onConnect(hop: Hop) {
    //Trigger on data change
  }
  onNewUserInRoom(user: PoodnaPeerUser) {
    if (user.role === "BROADCASTER") {
      this.callToUser(user.id, true);
    }
  }
}
