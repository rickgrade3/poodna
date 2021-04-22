import { io, Socket } from "socket.io-client";
import _ from "lodash";
import { resolve } from "path";
import {
  SEND_DATA,
  AvailableEvents,
  AvailableEventsStr,
} from "@poodna/datatype";
import { API_BASE_URL } from "src/const";
interface HopAttr {
  hopKey: string;
  fromId: string;
  toId: string;
  rp: RPeer;
  stream: MediaStream;
}
export class Hop {
  attr: HopAttr;
  pc: RTCPeerConnection;
  allStreams: MediaStream[] = [];
  constructor(c: HopAttr) {
    this.attr = c;
    const configuration = {
      iceServers: [
        {
          url: "turn:relay.backups.cz",
          credential: "webrtc",
          username: "webrtc",
        },
        {
          url: "turn:relay.backups.cz?transport=tcp",
          credential: "webrtc",
          username: "webrtc",
        },
        {
          urls: ["stun:stun.l.google.com:19302"],
        },
        {
          urls: ["turn:0.peerjs.com:3478"],
          username: "peerjs",
          credential: "peerjsp",
        },
        {
          url: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
        {
          url: "turn:192.158.29.39:3478?transport=udp",
          credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
          username: "28224511:1379330808",
        },
        {
          url: "turn:192.158.29.39:3478?transport=tcp",
          credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
          username: "28224511:1379330808",
        },
        {
          url: "turn:turn.bistri.com:80",
          credential: "homeo",
          username: "homeo",
        },
        {
          url: "turn:turn.anyfirewall.com:443?transport=tcp",
          credential: "webrtc",
          username: "webrtc",
        },
      ],
      sdpSemantics: "unified-plan",
      // iceTransportPolicy: "relay",
    } as any;
    this.pc = new RTCPeerConnection(configuration);
    if (!this.isOutgoing) {
      const audioEl = document.createElement("audio");
      audioEl.setAttribute("autoplay", "true");
      document.getElementsByTagName("body")[0].appendChild(audioEl);
      this.pc.addEventListener("icecandidate", (e) =>
        onIceCandidate(this.pc, e)
      );
      if (this.pc) {
        this.pc.ontrack = (ev) => {
          if (audioEl) {
            console.log(
              "ONTRACK:>>",
              this.isOutgoing,
              ">>>",
              c.hopKey,
              ">>>",
              ev.streams[0].getTracks().length
            );
            audioEl.srcObject = ev.streams[0];
            this.allStreams.push(ev.streams[0]);
            this.attr.rp.onStream(ev.streams[0], this);
          }
        };
      }
    }

    this.pc.addEventListener("iceconnectionstatechange", (e) =>
      onIceStateChange(this.pc, e)
    );
    function onIceStateChange(pc: RTCPeerConnection, event: any) {
      if (pc) {
        // console.log(`pc1 ICE state: ${pc.iceConnectionState}`);
        // console.log("ICE state change event: ", event);
      }
    }
    const _this = this;
    async function onIceCandidate(pc: RTCPeerConnection, event: any) {
      console.log("On ice candidate event  >>>", event);
      console.log("On ice candidate this must not null >>>", event.candidate);
      if (_this.isOutgoing) {
        c.rp.socket.emit(SEND_DATA, {
          toUserId: c.toId,
          fromUserId: c.fromId,
          event: AvailableEvents.ice_candidate,
          payload: event.candidate,
        });
      } else {
        c.rp.socket.emit(SEND_DATA, {
          toUserId: c.fromId,
          fromUserId: c.toId,
          event: AvailableEvents.ice_candidate_reverse,
          payload: event.candidate,
        });
      }
    }
  }
  destroy() {
    this.pc.close();
    this.pc.ontrack = () => {};
  }
  senders?: RTCRtpSender[];
  set localStream(stream) {
    this.attr.stream = stream;
    this.onStreamChange();
  }
  get localStream() {
    if (this.attr.stream) {
      return this.attr.stream;
    }
    return this.attr.rp.localStream;
  }
  get isOutgoing() {
    return this.attr.rp.userId === this.attr.fromId;
  }
  async onStreamChange() {
    if (!this.localStream) {
      return;
    }
    //If it is incoming will not add stream and making connection
    if (!this.isOutgoing) {
      return;
    }
    try {
      (this.pc as any).removeStream(this.localStream);
    } catch {}

    try {
      (this.pc as any).addStream(this.localStream);
    } catch {}
  }
  async outgoingConnection(clearPC?: boolean) {
    if (this.pc.signalingState !== "stable") {
      return;
    }

    console.log("Added local stream to pc1");
    const offerOptions = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 0,
    };
    let offer;
    try {
      offer = await this.pc.createOffer(offerOptions as any);
      console.log("DONE:CREATE OFFER");
    } catch (e) {
      console.log("ERROR:CREATE OFFER", e);
    }
    if (offer) {
      try {
        await this.pc.setLocalDescription(offer);
        this.onDescriptionChange();
        console.log("DONE:SET LOCAL OFFER");
      } catch (e) {
        console.log("ERROR:SET LOCAL OFFER", e);
      }
    }
    this.attr.rp.socket.emit(SEND_DATA, {
      toUserId: this.attr.toId,
      fromUserId: this.attr.fromId,
      event: AvailableEvents.offer,
      payload: {
        offer: encodeURIComponent(JSON.stringify(offer)),
        clearPC: clearPC,
      },
    });
  }
  connected: boolean = false;
  onDescriptionChange() {
    if (
      this.pc.localDescription &&
      this.pc.remoteDescription &&
      !this.connected
    ) {
      this.connected = true;

      this.attr.rp.onConnect(this);
      console.log("CONNECTED");
    }
  }
  async onSocketAnswer(answer: RTCSessionDescriptionInit) {
    try {
      await this.pc.setRemoteDescription(answer);

      console.log("DONE:setRemoteDescriptionFromAnswer");
    } catch (e) {
      console.log("ERROR:setRemoteDescriptionFromAnswer", e);
    }
    this.onDescriptionChange();
  }
  async onSocketOffer(offer: string) {
    try {
      await this.pc.setRemoteDescription(JSON.parse(decodeURIComponent(offer)));

      console.log("DONE:setRemoteDescriptionFromOffer");
    } catch (e) {
      console.log("ERROR:setRemoteDescriptionFromOffer", e);
    }
    this.onDescriptionChange();

    const answer = await this.pc.createAnswer();
    try {
      await this.pc.setLocalDescription(answer);
      console.log("DONE:setLocalDescription");
    } catch (e) {
      console.log("ERROR:setLocalDescription", e);
    }
    this.onDescriptionChange();
    try {
      this.attr.rp.socket.emit(SEND_DATA, {
        toUserId: this.attr.fromId,
        fromUserId: this.attr.toId,
        event: AvailableEvents.answer,
        payload: answer,
      });
      console.log("DONE:SEND ANSWER");
    } catch (e) {
      console.log("ERROR:SEND ANSWER", e);
    }
  }
  async onSocketIce(candidate: RTCIceCandidateInit) {
    if (!candidate) {
      return;
    }
    try {
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("DONE:addIceCandidate");
    } catch (ex) {
      console.log("ERROR:addIceCandidate", ex, candidate);
    }
  }
}

export type RPeer_Construct = {
  userId: string;
  localStream: MediaStream;
};
export type SocketEventData = {
  toUserId: string;
  fromUserId: string;
  event: AvailableEventsStr;
  payload: any;
};
export class RPeer extends EventTarget {
  userId: string;
  socket: Socket;
  hops: { [key: string]: Hop } = {};
  localStream: MediaStream;

  static initLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    return stream;
  };
  streamSelector?: (userId: string) => MediaStream | undefined;
  clearPC(toId: string) {
    this.socket.emit(SEND_DATA, {
      toUserId: toId,
      fromUserId: this.userId,
      event: AvailableEvents.clearPC,
      payload: {},
    });
  }
  constructor(c: RPeer_Construct) {
    super();
    this.userId = c.userId;
    this.socket = io(`${API_BASE_URL}`, {
      query: {
        userId: this.userId,
      },
    });
    this.localStream = c.localStream;
    this.socket.onAny(async (e: AvailableEventsStr, data: SocketEventData) => {
      if (!data.fromUserId) {
        return;
      }
      console.log("EVENT>>", data.event, data);
      switch (data.event) {
        case AvailableEvents.clearPC: {
          const hop = await this.fetchHop(data.fromUserId, this.userId);
          hop.destroy();
          break;
        }
        case AvailableEvents.offer: {
          if (data.payload.clearPC) {
            this.closeHop(data.fromUserId, this.userId);
          }
          await this.onOffer(data);
          if (await this.shouldAcceptOffer(data)) {
            const hop = await this.fetchHop(data.fromUserId, this.userId);
            await hop.onSocketOffer(data.payload.offer);
          }
          break;
        }
        case AvailableEvents.answer: {
          const hop = await this.fetchHop(this.userId, data.fromUserId);
          await hop.onSocketAnswer(data.payload);

          break;
        }
        case AvailableEvents.ice_candidate: {
          const hop = await this.fetchHop(data.fromUserId, this.userId);
          await hop.onSocketIce(data.payload);
          break;
        }
        case AvailableEvents.ice_candidate_reverse: {
          const hop = await this.fetchHop(this.userId, data.fromUserId);
          await hop.onSocketIce(data.payload);
          break;
        }
      }
    });
    this.onStreamChange();
  }

  async addStream(stream: MediaStream) {
    const ts = stream.getTracks();
    for (const t of ts) {
      this.localStream.addTrack(t);
    }
    this.onStreamChange();
  }
  onStreamChange() {
    _.each(this.hops, (h) => {
      h.onStreamChange();
    });
  }

  async callToUser(toUserId: string, clearPC?: boolean) {
    const oldHop = await this.fetchHop(this.userId, toUserId);
    if (
      oldHop.pc.connectionState === "failed" ||
      oldHop.pc.connectionState === "closed" ||
      oldHop.pc.connectionState === "disconnected"
    ) {
      this.onDeleteHop(oldHop);
      delete this.hops[oldHop.attr.hopKey];
      console.log("DELETE OLD HOP");
    }
    const hop = await this.fetchHop(this.userId, toUserId);
    if (!hop.connected) {
      await hop.outgoingConnection(clearPC);
    } else {
      console.log("SKIP CALLING", hop);
    }
    return hop;
  }
  closeHop(fromId: string, toId: string) {
    const hopKey1 = `${fromId}_${toId}`;
    if (this.hops[hopKey1]) {
      this.hops[hopKey1].destroy();
      this.onDeleteHop(this.hops[hopKey1]);
      delete this.hops[hopKey1];
    }
    const hopKey2 = `${toId}_${fromId}`;
    if (this.hops[hopKey2]) {
      this.hops[hopKey2].destroy();
      this.onDeleteHop(this.hops[hopKey2]);
      delete this.hops[hopKey2];
    }
  }
  async fetchHop(fromId: string, toId: string) {
    const hopKey = `${fromId}_${toId}`;
    if (!this.hops[hopKey]) {
      this.hops[hopKey] = new Hop({
        fromId: fromId,
        toId: toId,
        hopKey,
        rp: this,
        stream: this.selectStream(fromId, toId),
      });
      console.log("hopKey", hopKey);
      this.hops[hopKey].onStreamChange();
    }
    return this.hops[hopKey];
  }
  /*
    Override
  */
  async onOffer(data: SocketEventData) {}
  async shouldAcceptOffer(data: SocketEventData) {
    return true;
  }
  selectStream(fromId: string, toId: string) {
    return this.localStream;
  }
  async onConnect(hop: Hop) {}
  async onDeleteHop(hop: Hop) {}
  async onStream(m: MediaStream, hop: Hop) {
    return;
  }
  destroy() {
    this.socket.disconnect();
    this.socket.offAny();
    _.each(this.hops, (hop) => {
      hop.destroy();
    });
  }
}
