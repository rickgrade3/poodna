import Peer, { Instance as SimplePeerI } from "simple-peer";
import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "src/const";

import {
  SEND_DATA,
  AvailableEvents,
  AvailableEventsStr,
} from "@poodna/datatype";
import { CgNametag } from "react-icons/cg";

export type PoodnaRole = "BROADCASTER" | "LISTENER" | "MAIN_LOOP" | "UNKNOWN";

export interface PoodnaPeerUser {
  id: string;
  name?: string;
  avatar?: string;
  connectionId?: string;
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
  onConnect: () => any;
}
type Hop =
  | {
      channel: string;
      userId: string;
      peer: SimplePeerI;
      audioEl?: HTMLAudioElement;
      stream?: MediaStream;
      conenection_id: string;
      activityAt: Date;
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
          createdAt: Date;
        }
      | undefined;
  };
  user: PoodnaPeerUser;

  socket: Socket;
  conenection_id: string;

  _log(m: string) {
    console.log(`${new Date().getTime()}:${this.user.role}:${m}`);
  }
  logTo(m: string, toUserId: string) {
    const u = this.get_users().find((u) => u.id === toUserId);
    let username = u ? u?.name + "/" + u?.role : toUserId;

    this._log(`TO:${username}:${m}`);
  }
  logFrom(m: string, toUserId: string) {
    const u = this.get_users().find((u) => u.id === toUserId);
    let username = u ? u?.name + "/" + u?.role : toUserId;
    this._log(`FROM:${username}:${m}`);
  }

  healthcheckintv: any;
  healthcheck() {
    this.healthcheckintv = setInterval(() => {
      this._log("HEALTH_CHECK");
      _.each(this.users, (u, uid) => {
        /*

          Request retry connection ถ้าเกิดยังไม่ได้ stream จาก user คนนั้น

        */
        let lastActivity = u.createdAt;

        let stream;
        if (u.incoming) {
          lastActivity = u.incoming.activityAt;
          stream = u.incoming.stream;
          u.incoming.activityAt = new Date();
        }
        const diffSec = Math.abs(
          (lastActivity.getTime() - lastActivity.getTime()) / 1000
        );
        if (diffSec > 5 && !stream) {
          this.logTo(AvailableEvents.need_retry, uid);
          this.socket.emit(SEND_DATA, {
            event: AvailableEvents.need_retry,
            conenection_id: Math.random().toString(),
            fromUserId: this.user.id,
            toUserId: uid,
          });
        }
      });
    }, 3000);
  }

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
    this.socket.on("connect", () => {
      this._log(">>Socket IO Connected<<");
      this._log(`me: ${this.user.id}`);
      this._log(`role: ${this.user.role}`);
      c.onConnect();
      this.healthcheck();
    });
    this.socket.onAny(async (e: AvailableEventsStr, data: SocketEventData) => {
      if (!data.fromUserId) {
        return;
      }

      switch (data.event) {
        case AvailableEvents.need_retry: {
          this.logFrom(AvailableEvents.need_retry, data.fromUserId);
          this.outgoingCall(data.fromUserId, Math.random().toString());
          break;
        }
        case AvailableEvents.signal_to: {
          this.logFrom(AvailableEvents.signal_to, data.fromUserId);
          const h = this.fetchHop(data.fromUserId, data.conenection_id, false, {
            onCreated: (peer) => {
              peer.on("signal", (e) => {
                this.logTo(AvailableEvents.signal_back, data.fromUserId);
                this.socket.emit(SEND_DATA, {
                  event: AvailableEvents.signal_back,
                  conenection_id: data.conenection_id,
                  fromUserId: this.user.id,
                  toUserId: data.fromUserId,
                  payload: JSON.stringify(e),
                });
              });
              peer.on("connect", (e) => {});
              peer.on("error", (e) => {
                this.logFrom("ERROR:" + e, data.fromUserId);
              });
              peer.on("stream", (stream) => {
                this.logFrom("GOT STREAM", data.fromUserId);
                if (!h.audioEl) {
                  h.audioEl = document.createElement("audio");
                  document
                    .getElementsByTagName("body")[0]
                    .appendChild(h.audioEl);
                }

                h.audioEl.setAttribute("autoplay", "true");
                h.stream = stream;
                h.audioEl.srcObject = stream;
              });
            },
          });
          h.peer.signal(data.payload);

          break;
        }
        case AvailableEvents.signal_back: {
          //Fetch outging hop
          this.logFrom(AvailableEvents.signal_back, data.fromUserId);
          const h = this.fetchHop(data.fromUserId, data.conenection_id, true, {
            onCreated: () => {},
          });
          h.peer.signal(data.payload);
          break;
        }
      }
    });
    this.socket.emit("");
  }
  async onOffer(data: SocketEventData) {}
  onNewUserInRoom(user: PoodnaPeerUser) {
    this._log("NEW USER:" + JSON.stringify(user));
    this.outgoingCall(user.id, Math.random().toString());
  }
  clearHop(userId: string) {
    if (this.users[userId]?.outgoing) {
      this.users[userId].outgoing?.peer.destroy();
      if (this.users[userId].outgoing.audioEl) {
        this.users[userId].outgoing.audioEl.remove();
      }
      delete this.users[userId].outgoing;
    }
    if (this.users[userId]?.incoming) {
      this.users[userId].incoming?.peer.destroy();
      if (this.users[userId].incoming.audioEl) {
        this.users[userId].incoming.audioEl.remove();
      }
      delete this.users[userId].incoming;
    }
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
      if (this.users[userId].outgoing.audioEl) {
        this.users[userId].outgoing.audioEl.remove();
      }
      delete this.users[userId].outgoing;
    }
    if (
      !outgoing &&
      this.users[userId]?.incoming &&
      this.users[userId]?.incoming.conenection_id !== conenection_id
    ) {
      this.users[userId].incoming?.peer.destroy();
      if (this.users[userId].incoming.audioEl) {
        this.users[userId].incoming.audioEl.remove();
      }
      delete this.users[userId].incoming;
    }
    let h = this.users[userId];

    if (!h) {
      h = {
        outgoing: null,
        incoming: null,
        createdAt: new Date(),
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
        activityAt: new Date(),
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
        activityAt: new Date(),
      };
    }
    if (outgoing) {
      this.users[userId].outgoing.activityAt = new Date();
      return this.users[userId].outgoing;
    } else {
      this.users[userId].outgoing.activityAt = new Date();
      return this.users[userId].incoming;
    }
  }
  outgoingCall(userId: string, connectionId: string) {
    this.logTo("OUTGOING CALL", userId);
    const h = this.fetchHop(userId, connectionId, true, {
      onCreated: (peer) => {
        peer.on("signal", (e) => {
          //Make connection to peer
          this.logTo(AvailableEvents.signal_to, userId);
          this.socket.emit(SEND_DATA, {
            event: AvailableEvents.signal_to,
            fromUserId: this.user.id,
            conenection_id: connectionId,
            toUserId: userId,
            payload: JSON.stringify(e),
          });
        });
        peer.on("connect", (e) => {});
        peer.on("error", (e) => {
          this.logTo("ERROR:" + e, userId);
        });
      },
    });
  }
  destroy() {
    if (this.healthcheckintv) {
      clearInterval(this.healthcheckintv);
    }
    _.each(this.users, (v) => {
      v.incoming?.peer.destroy();
      v.outgoing?.peer.destroy();
      if (v.incoming?.audioEl) {
        v.incoming?.audioEl.remove();
      }
      if (v.outgoing?.audioEl) {
        v.outgoing?.audioEl.remove();
      }
    });
    this.socket.disconnect();
    this.socket.offAny();
  }
}

export class MainLoopPeer extends PoodnaPeer {}

export class BroadCasterPeer extends PoodnaPeer {}

export class ListenerPeer extends PoodnaPeer {}
