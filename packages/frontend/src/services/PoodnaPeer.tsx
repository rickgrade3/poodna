import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "src/const";
import { SimplePeer, Instance as SimplePeerI } from "simple-peer";
import {
  SEND_DATA,
  AvailableEvents,
  AvailableEventsStr,
} from "@poodna/datatype";
import { CgNametag } from "react-icons/cg";
const Peer: SimplePeer = require("./Peer");
export type PoodnaRole = "BROADCASTER" | "LISTENER" | "MAIN_LOOP" | "UNKNOWN";

export interface PoodnaPeerUser {
  id: string;
  role: PoodnaRole;
}

export type SocketEventData = {
  toUserId: string;
  conenection_id: string;
  fromUserId: string;
  event: AvailableEventsStr;
  payload: any;
};

export interface PoodnaConstructor {
  get_users: () => PoodnaPeerUser[];
  localStream: MediaStream;
  user: PoodnaPeerUser;
}
type Hop =
  | {
      channel: string;
      userId: string;
      peer: SimplePeerI;
      conenection_id: string;
    }
  | undefined
  | null;
export class PoodnaPeer {
  combinedStream = new MediaStream();
  get_users: PoodnaConstructor["get_users"];
  localStream: MediaStream;
  users: {
    [userId: string]:
      | {
          outgoing?: Hop;
          incoming?: Hop;
          give_back_outgoing?: Hop;
          give_back_incoming?: Hop;
        }
      | undefined;
  };
  user: PoodnaPeerUser;

  socket: Socket;
  conenection_id: string;

  constructor(c: PoodnaConstructor) {
    this.get_users = c.get_users;
    this.conenection_id = Math.random().toString();
    this.users = {};
    this.localStream = c.localStream;
    this.user = c.user;

    this.socket = io(`${API_BASE_URL}`, {
      query: {
        userId: this.user.id,
      },
    });
    this.socket.onAny(async (e: AvailableEventsStr, data: SocketEventData) => {
      if (!data.fromUserId) {
        return;
      }
      console.log("<<SOCKET>>", data.event, data);
      switch (data.event) {
        case AvailableEvents.requestVideo: {
          this.outgoingCall(data.fromUserId, data.conenection_id, true);
          break;
        }
        case AvailableEvents.signal_to: {
          const h = this.fetchHop(data.fromUserId, data.conenection_id, false, {
            onCreated: (peer) => {
              console.log("BINDSIGNAL");
              peer.on("signal", (e) => {
                console.log("EMIT SIGNAL IN");
                this.socket.emit(SEND_DATA, {
                  event: AvailableEvents.signal_back,
                  conenection_id: data.conenection_id,
                  fromUserId: this.user.id,
                  toUserId: data.fromUserId,
                  payload: JSON.stringify(e),
                });
              });
              peer.on("connect", (e) => {
                console.log(
                  "<<CONNECT>>",
                  data.fromUserId,
                  this.users[data.fromUserId]
                );
              });
              peer.on("error", (e) => {
                console.log("<<ERROR>>", e, data.fromUserId);
              });
              peer.on("stream", (stream) => {
                console.log("<<STREAM>>", stream, data.fromUserId);
                const audioEl = document.createElement("audio");
                audioEl.setAttribute("autoplay", "true");
                // audioEl.setAttribute("controls", "true");
                document.getElementsByTagName("body")[0].appendChild(audioEl);
                audioEl.srcObject = stream;
              });
            },
          });
          h.peer.signal(data.payload);

          break;
        }
        case AvailableEvents.signal_back: {
          //Fetch outging hop
          const h = this.fetchHop(data.fromUserId, data.conenection_id, true, {
            onCreated: () => {
              console.log("MUST NOT HAPPEN");
            },
          });
          h.peer.signal(data.payload);
          break;
        }
      }
    });
    this.socket.emit("");
  }
  async onOffer(data: SocketEventData) {
    console.log("<<EMIT ONOFFER>>", this.users, data);
    this.outgoingCall(data.fromUserId, data.conenection_id);
  }
  onNewUserInRoom(user: PoodnaPeerUser) {
    this.outgoingCall(user.id, Math.random().toString());
  }
  mainloops() {
    return this.get_users().filter((u) => u.role === "MAIN_LOOP");
  }
  broadcasters() {
    return this.get_users().filter((u) => u.role === "BROADCASTER");
  }
  listeners() {
    return this.get_users().filter((u) => u.role === "LISTENER");
  }
  fetchHop(
    userId: string,
    conenection_id: string,
    outgoing: boolean,
    cb: { onCreated?: (p: SimplePeerI) => void }
  ) {
    if (
      outgoing &&
      this.users[userId]?.outgoing &&
      this.users[userId]?.outgoing.conenection_id !== conenection_id
    ) {
      this.users[userId].outgoing?.peer.destroy();
      delete this.users[userId].outgoing;
      console.log("CLEAR OUTGOING");
    }
    if (
      !outgoing &&
      this.users[userId]?.incoming &&
      this.users[userId]?.incoming.conenection_id !== conenection_id
    ) {
      this.users[userId].incoming?.peer.destroy();
      delete this.users[userId].incoming;
      console.log("CLEAR INCOMING");
    }
    let h = this.users[userId];

    if (!h) {
      h = {
        outgoing: null,
        incoming: null,
      };
      this.users[userId] = h;
    }
    const _onCreated = (p: SimplePeerI) => {
      cb.onCreated?.(p);
    };
    if (outgoing && (!h.outgoing || h.outgoing.peer.destroyed)) {
      const channel = Math.random().toString();
      let op = new Peer({
        channelName: channel,
        initiator: true,
        stream: this.localStream,
      });
      _onCreated(op);
      h.outgoing = {
        conenection_id,
        peer: op,
        channel,
        userId,
      };
    } else if (!outgoing && (!h.incoming || h.incoming.peer.destroyed)) {
      const channel = Math.random().toString();
      let op = new Peer({
        channelName: channel,
      });
      _onCreated(op);

      h.incoming = {
        conenection_id,
        peer: op,
        channel,
        userId,
      };
    }
    if (outgoing) {
      return this.users[userId].outgoing;
    } else {
      return this.users[userId].incoming;
    }
  }
  outgoingCall(
    userId: string,
    connectionId: string,
    disableGiveback?: boolean
  ) {
    const h = this.fetchHop(userId, connectionId, true, {
      onCreated: (peer) => {
        console.log("BINDSIGNAL");
        peer.on("signal", (e) => {
          //Make connection to peer
          console.log("EMIT SIGNAL OUT");
          this.socket.emit(SEND_DATA, {
            event: AvailableEvents.signal_to,
            fromUserId: this.user.id,
            conenection_id: connectionId,
            toUserId: userId,
            payload: JSON.stringify(e),
          });
        });
        peer.on("connect", (e) => {
          console.log("<<CONNECT>>", userId, this.users[userId]);
          if (!disableGiveback) {
            console.log("<<EMIT REQUEST VIDEO>>");
            this.socket.emit(SEND_DATA, {
              event: AvailableEvents.requestVideo,
              fromUserId: this.user.id,
              conenection_id: connectionId,
              toUserId: userId,
            });
          }
        });
        peer.on("error", (e) => {
          console.log("<<ERROR>>", e, userId);
        });
      },
    });
  }
  destroy() {
    _.each(this.users, (v) => {
      v.incoming?.peer.destroy();
      v.outgoing?.peer.destroy();
    });
    this.socket.disconnect();
    this.socket.offAny();
  }
}

export class MainLoopPeer extends PoodnaPeer {}

export class BroadCasterPeer extends PoodnaPeer {}

export class ListenerPeer extends PoodnaPeer {}
