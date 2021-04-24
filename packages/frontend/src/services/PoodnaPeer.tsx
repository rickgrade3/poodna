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
  conenection_id: string;
  fromUserId: string;
  event: AvailableEventsStr;
  payload: any;
};

//Recienved the sound
export class IncomingHop {
  me: PoodnaPeer;
  userId: string;
  constructor(c: { me: PoodnaPeer; userId: string }) {
    this.me = c.me;
    this.userId = c.userId;
    this.peer = new Peer({
      stream: this.me.localStream,
    });
    this.me.socket.onAny(this.handleSocket.bind(this));
    this.healthcheck();
  }
  async handleSocket(e: AvailableEventsStr, data: SocketEventData) {
    if (data.fromUserId !== this.userId) {
      return;
    }
    switch (data.event) {
      case AvailableEvents.signal_to: {
        this.me.logFrom(AvailableEvents.signal_to, data.fromUserId);

        this.peer.on("signal", (e) => {
          this.me.logTo(AvailableEvents.signal_back, data.fromUserId);
          this.me.socket.emit(SEND_DATA, {
            event: AvailableEvents.signal_back,
            fromUserId: this.me.user.id,
            connection_Id: this.me.user.connectionId,
            toUserId: data.fromUserId,
            payload: JSON.stringify(e),
          });
        });
        this.peer.on("connect", (e) => {
          this.me.logFrom("SOUND SENDED", data.fromUserId);
        });
        this.peer.on("error", (e) => {
          this.me.logFrom("ERROR:" + e, data.fromUserId);
        });
        this.peer.on("stream", (stream) => {
          this.me.logFrom("GOT STREAM", data.fromUserId);
          console.log(this.me.incomings, this.me.get_users());
          if (!this.audioEl) {
            this.audioEl = document.createElement("audio");
            document.getElementsByTagName("body")[0].appendChild(this.audioEl);
          }
          this.audioEl.setAttribute("autoplay", "true");
          this.stream = stream;
          this.audioEl.srcObject = stream;
        });
        if (!this.peer.destroyed) this.peer.signal(data.payload);

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
      connection_Id: this.me.user.connectionId,
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
    this.healthcheckintv = setInterval(() => {
      if (this.requestAt) {
        const diffSec = Math.abs(
          (this.requestAt.getTime() - new Date().getTime()) / 1000
        );
        if (!this.stream)
          this.me.logFrom(`<<HEALTH_CHECK>>${diffSec}s`, this.userId);
        if (diffSec > 10 && !this.stream) {
          this.requestAt = null;
          this.request();
        }
      }
    }, 5000);
  }
  destroy() {
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
  userId: string;
  constructor(c: { me: PoodnaPeer; userId: string }) {
    this.me = c.me;
    this.userId = c.userId;
    this.peer = new Peer({
      initiator: true,
      stream: this.me.localStream,
    });
    this.me.socket.onAny(this.handleSocket.bind(this));
  }
  async handleSocket(e: AvailableEventsStr, data: SocketEventData) {
    if (!data.fromUserId) {
      return;
    }
    switch (data.event) {
      case AvailableEvents.signal_back: {
        this.me.logFrom(AvailableEvents.signal_back, data.fromUserId);
        if (!this.peer.destroyed) this.peer.signal(data.payload);
        break;
      }
    }
  }
  sendAt?: Date;
  connectionId?: string;
  peer: SimplePeerI;
  send() {
    this.sendAt = new Date();
    this.peer.on("signal", (e) => {
      //Make connection to peer
      this.me.logTo(AvailableEvents.signal_to, this.userId);
      this.me.socket.emit(SEND_DATA, {
        event: AvailableEvents.signal_to,
        fromUserId: this.me.user.id,
        connection_Id: this.me.user.connectionId,
        toUserId: this.userId,
        payload: JSON.stringify(e),
      });
    });
    this.peer.on("connect", (e) => {});
    this.peer.on("error", (e) => {
      this.me.logTo("ERROR:" + e, this.userId);
    });
  }

  healthcheckintv: any;
  healthcheck() {
    this.healthcheckintv = setInterval(() => {}, 3000);
  }

  destroy() {
    if (this.healthcheckintv) {
      clearInterval(this.healthcheckintv);
    }
    this.me.socket.offAny(this.handleSocket.bind(this));
    if (this.peer) {
      this.peer.destroy();
    }
    delete this.me.outgoings[this.userId];
  }
}

export class PoodnaPeer {
  get_users: () => PoodnaPeerUser[];
  localStream: MediaStream;
  combinedStream?: MediaStream;
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
        if (this.shouldGiveSound(data.fromUserId)) {
          if (this.outgoings[data.fromUserId]) {
            this.outgoings[data.fromUserId].destroy();
          }
          this.sendSound(data.fromUserId);
        }
        break;
      }
    }
  }
  requestSoundTo(toUserId: string) {
    //1. Generate incoming Peer
    this.incomings[toUserId] =
      this.incomings[toUserId] ||
      new IncomingHop({
        me: this,
        userId: toUserId,
      });
    //2. Call request function
    this.incomings[toUserId].request();
  }
  sendSound(toUserId: string) {
    //1. Generate Outgoing Peer
    this.outgoings[toUserId] =
      this.outgoings[toUserId] ||
      new OutgoingHop({
        me: this,
        userId: toUserId,
      });
    //2. Call send function
    this.outgoings[toUserId].send();
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
  shouldGiveSound(reqeusterId: string) {
    let requestUser = this.get_users().find((u) => u.id === reqeusterId);

    let shouldGive = false;
    const self = this.user;
    switch (true) {
      case self.broadcaster && self.speaker: //SPEAKER + BC
        shouldGive = true;
        break;
      case !self.broadcaster && self.speaker: //SPEAKER
        shouldGive = requestUser?.speaker;
        break;
      case self.broadcaster && !self.speaker: //LISTENER + BC
        shouldGive = false;
        break;
      case !self.broadcaster && !self.speaker: //LISTENER
        shouldGive = false;
        break;
    }
    this.logFrom(`ShouldGiveSound-${shouldGive}`, reqeusterId);
    return shouldGive;
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
}
