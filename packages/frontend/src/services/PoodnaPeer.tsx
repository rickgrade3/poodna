import Peer, { Instance as SimplePeerI } from "simple-peer";
import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "src/const";
import {
  SEND_DATA,
  AvailableEvents,
  AvailableEventsStr,
} from "@poodna/datatype";
import { CgNametag } from "react-icons/cg";

export interface PoodnaPeerUser {
  id: string;
  name: string;
  connectionId: string;
  speaker: boolean;
  broadcaster: boolean;
  role: string;
}
export type SocketEventData = {
  toUserId: string;
  connection_id: string;
  fromUserId: string;
  event: AvailableEventsStr;
  payload: any;
};

//Recienved the sound
export class IncomingHop {
  me: PoodnaPeer;
  userId: string;
  connectionId?: string;
  onGetStream: (s: MediaStream) => void;
  constructor(c: {
    me: PoodnaPeer;
    userId: string;
    onGetStream: (s: MediaStream) => void;
  }) {
    this.me = c.me;
    this.onGetStream = c.onGetStream;
    this.userId = c.userId;

    this.me.socket.onAny(this.handleSocket.bind(this));
    this.healthcheck();
    console.log("CREATE INCOMING", this.userId, this.me.user.id);
  }
  fetchPeer(cid: string, onCreated: (peer: SimplePeerI) => void) {
    if (this.destroyed) {
      throw "Peer has been destroyed";
    }
    console.log("connectionId", cid);
    if (cid !== this.connectionId) {
      this.connectionId = cid;
      this.peer = new Peer({
        channelName: Math.random().toString(),
      });
      onCreated(this.peer);
    }
  }
  async handleSocket(e: AvailableEventsStr, data: SocketEventData) {
    if (data.fromUserId !== this.userId) {
      return;
    }
    switch (data.event) {
      case AvailableEvents.signal_to: {
        this.me.logFrom(AvailableEvents.signal_to, data.fromUserId);
        this.fetchPeer(data.connection_id, (peer) => {
          console.log("ON CREATED");
          peer.on("signal", (e) => {
            this.requestAt = new Date();
            this.me.logTo(AvailableEvents.signal_back, data.fromUserId);
            this.me.socket.emit(SEND_DATA, {
              event: AvailableEvents.signal_back,
              fromUserId: this.me.user.id,
              connection_id: data.fromUserId,
              toUserId: data.fromUserId,
              payload: JSON.stringify(e),
            });
          });
          peer.on("connect", (e) => {
            this.requestAt = new Date();
          });
          peer.on("error", (e) => {
            this.me.logFrom("ERROR:" + e, data.fromUserId);
          });
          peer.on("stream", (stream: any) => {
            this.requestAt = new Date();
            console.log(
              this.me.incomings,
              this.me.get_users(),
              stream.getTracks()
            );
            this.me.logFrom("GOT STREAM", data.fromUserId);
            if (this.audioEl) {
              this.audioEl.remove();
            }
            this.audioEl = document.createElement("audio");
            document.getElementsByTagName("body")[0].appendChild(this.audioEl);
            this.audioEl.setAttribute("autoplay", "true");
            this.stream = stream;
            this.audioEl.srcObject = stream;
            this.onGetStream(stream);
          });
          console.log("SIGNALLL");
          peer.signal(data.payload);
        });

        break;
      }
    }
  }
  request() {
    if (this.requestAt) {
      return;
    }
    this.requestAt = new Date();
    this.me.logTo(AvailableEvents.request_sound, this.me.user.id);
    this.me.socket.emit(SEND_DATA, {
      event: AvailableEvents.request_sound,
      fromUserId: this.me.user.id,
      connection_id: this.me.user.connectionId,
      toUserId: this.userId,
      payload: "",
    });
  }
  requestAt?: Date | null;
  peer?: SimplePeerI;
  stream?: MediaStream;
  audioEl?: HTMLAudioElement;

  healthcheckintv: any;
  healthcheck() {
    console.log("healthcheck", this.userId);
    this.healthcheckintv = setInterval(() => {
      if (this.requestAt) {
        const diffSec = Math.abs(
          (this.requestAt.getTime() - new Date().getTime()) / 1000
        );
        if (!this.stream?.active) {
          this.me.logFrom(`<<HEALTH_CHECK>>${diffSec}s`, this.userId);
        }

        if (diffSec > 10 && !this.stream?.active) {
          this.requestAt = null;
          this.request();
        }
      }
    }, 5000);
  }
  destroyed: boolean = false;
  destroy() {
    this.destroyed = true;
    if (this.healthcheckintv) clearInterval(this.healthcheckintv);
    this.me.socket.offAny(this.handleSocket.bind(this));
    if (this.peer) {
      this.peer.destroy();
    }
    if (this.audioEl) this.audioEl.remove();

    delete this.me.incomings[this.userId];
  }
}
//Give the sound to the others
export class OutgoingHop {
  me: PoodnaPeer;
  stream: MediaStream;
  userId: string;
  connectionId?: string;
  fetchPeer(cid: string, onCreated: (peer: SimplePeerI) => void) {
    if (this.destroyed) {
      throw "Peer has been destroyed";
    }
    if (cid !== this.connectionId) {
      this.connectionId = cid;
      console.log("NEW PEER");
      this.peer = new Peer({
        channelName: Math.random().toString(),
        initiator: true,
        stream: this.stream,
      });
      onCreated(this.peer);
    } else {
      return this.peer;
    }
  }
  constructor(c: { me: PoodnaPeer; userId: string; stream: MediaStream }) {
    this.me = c.me;
    this.stream = c.stream;
    this.userId = c.userId;
    console.log("CREATE OUTGOING", this.userId, this.me.user.id);
    this.me.socket.onAny(this.handleSocket.bind(this));
  }
  async handleSocket(e: AvailableEventsStr, data: SocketEventData) {
    if (!data.fromUserId) {
      return;
    }
    switch (data.event) {
      case AvailableEvents.signal_back: {
        this.me.logFrom(AvailableEvents.signal_back, data.fromUserId);
        if (this.peer && !this.peer.destroyed) {
          console.log("TRIGGER SIGNAL BACK");
          this.peer.signal(data.payload);
        }
        break;
      }
    }
  }
  sendAt?: Date;

  peer: SimplePeerI;
  send() {
    console.log("SENDDD");
    this.sendAt = new Date();
    const cid = Math.random().toString();
    this.fetchPeer(cid, (peer) => {
      peer.on("signal", (e) => {
        //Make connection to peer
        this.me.logTo(AvailableEvents.signal_to, this.userId);
        this.me.socket.emit(SEND_DATA, {
          event: AvailableEvents.signal_to,
          fromUserId: this.me.user.id,
          connection_id: cid,
          toUserId: this.userId,
          payload: JSON.stringify(e),
        });
      });
      peer.on("connect", (e) => {});
      peer.on("error", (e) => {
        this.me.logTo("ERROR:" + e, this.userId);
      });
    });
  }

  healthcheckintv: any;
  healthcheck() {
    this.healthcheckintv = setInterval(() => {}, 3000);
  }
  destroyed: boolean = false;

  destroy() {
    this.destroyed = true;
    if (this.healthcheckintv) {
      clearInterval(this.healthcheckintv);
    }
    this.me.socket.offAny(this.handleSocket.bind(this));
    if (this.peer) {
      this.peer.destroy();
      console.log("DESTROY PEER");
    }
    delete this.me.outgoings[this.userId];
  }
}

export class PoodnaPeer {
  get_users: () => PoodnaPeerUser[];
  localStream: MediaStream;
  combinedStream: MediaStream = new MediaStream();
  user: PoodnaPeerUser;
  socket: Socket;
  incomings: {
    [userId: string]: IncomingHop;
  } = {};
  outgoings: {
    [userId: string]: OutgoingHop;
  } = {};
  constructor(c: {
    get_users: () => PoodnaPeerUser[];
    localStream: MediaStream;
    user: PoodnaPeerUser;
    onConnect: () => void;
  }) {
    this.get_users = c.get_users;
    this.user = c.user;
    this.localStream = c.localStream;
    this.localStream.getTracks().forEach((t) => {
      this.combinedStream.addTrack(t);
    });
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
    this.socket.onAny(this.handleSocket.bind(this));
  }
  async handleSocket(e: AvailableEventsStr, data: SocketEventData) {
    if (!data.fromUserId) {
      return;
    }
    switch (data.event) {
      case AvailableEvents.request_sound: {
        const stream = this.getStreamForUser(data.fromUserId);
        if (stream) {
          if (this.outgoings[data.fromUserId]) {
            this.outgoings[data.fromUserId].destroy();
          }
          this.sendSound(data.fromUserId, stream);
        }
        break;
      }
    }
  }
  requestSoundTo(toUserId: string) {
    if (this.incomings[toUserId]) {
      this.incomings[toUserId].destroy();
    }
    //1. Generate incoming Peer
    this.incomings[toUserId] =
      this.incomings[toUserId] ||
      new IncomingHop({
        me: this,
        userId: toUserId,
        onGetStream: this.combineSound.bind(this),
      });
    //2. Call request function
    this.incomings[toUserId].request();
  }

  sendSound(toUserId: string, stream: MediaStream) {
    //1. Generate Outgoing Peer
    this.outgoings[toUserId] =
      this.outgoings[toUserId] ||
      new OutgoingHop({
        me: this,
        stream,
        userId: toUserId,
      });
    //2. Call send function
    this.outgoings[toUserId].send();
  }
  combineSound(s: MediaStream) {
    s.getTracks().forEach((t) => {
      this.combinedStream.addTrack(t);
    });
    _.each(this.outgoings, (o) => {
      if (o.stream === this.combinedStream) {
        try {
          o.peer.addStream(this.combinedStream);
        } catch (error) {}
      }
    });
  }
  //Implement when add or remove user
  users: PoodnaPeerUser[] = [];
  onUserChanged() {
    this._log("ON USER CHANGED");
    const cus = this.get_users();
    const newus: PoodnaPeerUser[] = [];
    const rmus: PoodnaPeerUser[] = [];
    //Remove Not found users and not matching role
    this.users.forEach((u) => {
      const foundU = cus.find(
        (_u) =>
          _u.connectionId === u.connectionId &&
          u.id === _u.id &&
          u.role === _u.role
      );
      if (!foundU) {
        rmus.push(u);
        return;
      }
    });
    //And add new user
    cus.forEach((u) => {
      const foundU = this.users.find(
        (_u) =>
          _u.connectionId === u.connectionId &&
          u.id === _u.id &&
          u.role === _u.role
      );
      if (!foundU) {
        newus.push(u);
        return;
      }
    });
    rmus.forEach((u) => this.onUserRemove(u));
    newus.forEach((u) => this.onNewUser(u));
    this._log("ON USER CHANGED");
    console.log("RM", rmus);
    console.log("NEW", newus);
    this.users = cus.slice(0);
  }
  //Implement
  onNewUser(newUser: PoodnaPeerUser) {
    let shouldReqsound = false;
    const self = this.user;
    switch (true) {
      case self.broadcaster && self.speaker: //SPEAKER + BC
        shouldReqsound = newUser.speaker;

        break;
      case !self.broadcaster && self.speaker: //SPEAKER
        shouldReqsound = newUser.speaker;

        break;
      case self.broadcaster && !self.speaker: //LISTENER + BC
        shouldReqsound = newUser.speaker && newUser.broadcaster;
        break;
      case !self.broadcaster && !self.speaker: //LISTENER
        shouldReqsound = newUser.speaker && newUser.broadcaster;
        break;
    }
    if (shouldReqsound) {
      this.requestSoundTo(newUser.id);
    }
  }
  //Implement
  onUserRemove(u: PoodnaPeerUser) {
    if (this.outgoings[u.id]) {
      this.outgoings[u.id].destroy();
    }
    if (this.incomings[u.id]) {
      this.incomings[u.id].destroy();
    }
  }

  /*

    Determine if you want to give sound to user

  */
  getStreamForUser(reqeusterId: string) {
    let requestUser = this.get_users().find((u) => u.id === reqeusterId);

    let streamToGive: MediaStream | false = false;
    const self = this.user;
    switch (true) {
      case self.broadcaster && self.speaker: //SPEAKER + BC
        streamToGive = requestUser?.speaker
          ? this.localStream
          : this.combinedStream;
        break;
      case !self.broadcaster && self.speaker: //SPEAKER
        streamToGive = requestUser?.speaker ? this.localStream : false;
        break;
      case self.broadcaster && !self.speaker: //LISTENER + BC
        streamToGive = false;
        break;
      case !self.broadcaster && !self.speaker: //LISTENER
        streamToGive = false;
        break;
    }

    this.logFrom(`ShouldGiveSound-${!!streamToGive}`, reqeusterId);
    return streamToGive;
  }
  /*
    Health check
  */
  healthcheckintv: any;
  healthcheck() {
    this.healthcheckintv = setInterval(() => {}, 3000);
  }
  /*
    Cleanup
  */
  destroy() {
    this.socket.offAny(this.handleSocket.bind(this));
    clearInterval(this.healthcheckintv);
  }
  /*
    Logging
  */
  _log(m: string) {
    console.log(`${new Date().getTime()}:${this.user.role}:${m}`);
  }
  logTo(m: string, uid: string) {
    const u = this.get_users().find((u) => u.id === uid);
    let username = u ? u?.name + "/" + u?.role : uid;
    this._log(`TO:${username}:${m}`);
  }
  logFrom(m: string, uid: string) {
    const u = this.get_users().find((u) => u.id === uid);

    let username = u ? u?.name + "/" + u?.role : uid;
    this._log(`FROM:${username}:${m}`);
  }
}
