import Peer from "peerjs";
import Gun from "gun/gun";
import { IGunChainReference } from "gun/types/chain";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { ChatRoom, AppDB } from "@poodna/datatype";
import { Hop, RPeer, SocketEventData } from "./RP";
import { textChangeRangeIsUnchanged } from "typescript";
require("gun/lib/load.js");

export class GunManager {
  gun: IGunChainReference<AppDB, any, "pre_root">;
  userId: string;
  constructor({ userId }: { userId: string }) {
    /*
          GEN UUID
        */

    this.gun = Gun<AppDB>(["http://localhost:8765/gun"]);

    /* Register User  */
    this.gun.get("users").put({
      [userId]: {
        id: userId,
      },
    });
    this.userId = userId;
  }
  async createRoom() {
    let roomId = uuidv4();
    const r = await this.gun
      .get("rooms")
      .put({
        [roomId]: {
          id: roomId,
          ownerId: this.userId,
          maximum: 8,
          userCount: 0,
          users: {},
          mainLoopUsers: {},
          outsiders: {},
          bradcasters: {},
        },
      })
      .then?.();

    return roomId;
  }
}

export class RoomManager {
  roomId: string;
  room?: ChatRoom;
  gunManager: GunManager;
  listeners: {
    id: string;
    created_at?: number;
  }[] = [];
  broadcasters: {
    id: string;
    created_at?: number;
  }[] = [];
  mainLoopUsers: {
    id: string;
    created_at?: number;
  }[] = [];
  outsiders: {
    id: string;
    created_at?: number;
  }[] = [];
  datas: {
    data: string;
    fromUserId: string;
  }[] = [];

  peerManager?: RPeer;

  constructor({
    roomId,
    gunManager,
  }: {
    roomId: string;
    gunManager: GunManager;
  }) {
    this.roomId = roomId;
    this.gunManager = gunManager;
  }

  get currentRoom() {
    return this.gunManager.gun.get("rooms").get(this.roomId);
  }
  async loadRoom() {
    this.gunManager.gun.get("rooms", (g) => {});
    await new Promise((resolve) => {
      this.currentRoom
        .on((r) => {
          this.room = r;
          console.log("set");
          resolve(null);
        })
        .then?.();
    });

    return this.room;
  }
  addUserToRoom(userId: string) {
    if (!this.room) {
      return;
    }

    this.currentRoom.get("users").put({
      [userId]: {
        id: userId,
        online: true,
      },
    });
    this.currentRoom
      .get("users")
      .get(userId)
      .on((d: { id: string; created_at?: number }) => {
        if (!d.created_at) {
          this.currentRoom.get("users").put({
            [d.id]: {
              id: d.id,
              online: true,
              created_at: new Date().getTime(),
            },
          });
        }
      });
  }
  onChange?: () => void;
  bindEvents({ onChange }: { onChange: () => void }) {
    this.onChange = onChange;
    this.currentRoom.on(
      (r) => {
        // this.room = r;
        onChange();
        this.startLoadUser({
          onLoadUser: () => {
            onChange();
          },
          onLoadBroadCaster: () => {
            onChange();
          },
          onLoadOutsider: () => {
            onChange();
          },
        });
      },
      {
        change: true,
      }
    );
  }
  unbindEvents() {
    this.gunManager.gun.get("rooms").get(this.roomId).off();
  }
  startLoadUser(p: {
    onLoadUser?: (userId: string) => void;
    onLoadBroadCaster?: (userId: string) => void;
    onLoadOutsider?: (userId: string) => void;
    onLoadAll?: () => void;
  }) {
    const db = _.debounce(() => {
      console.log(this.listeners);
      const addAndSort = (
        original: { id: string; created_at?: number }[],
        newItem: any
      ) => {
        return _.chain([...original, newItem])
          .uniqBy((v) => {
            return v.id;
          })
          .filter((v) => v.created_at)
          .sortBy("created_at")
          .value();
      };

      this.listeners.forEach((d, i) => {
        const MAX_PEOPLE_INDEX = this.room?.maximum || 1;

        if (i < 0) {
          return undefined;
        }

        if (_.keys(this.room?.bradcasters || []).indexOf(d.id) >= 0) {
          this.broadcasters = addAndSort(this.broadcasters, d);
          if (p.onLoadBroadCaster) {
            p.onLoadBroadCaster(d.id);
          }
          return undefined;
        } else if (i <= MAX_PEOPLE_INDEX) {
          this.mainLoopUsers = addAndSort(this.mainLoopUsers, d);
          if (p.onLoadUser) {
            p.onLoadUser(d.id);
          }
          return undefined;
        } else if (i > MAX_PEOPLE_INDEX) {
          this.outsiders = addAndSort(this.outsiders, d);
          if (p.onLoadOutsider) {
            p.onLoadOutsider(d.id);
          }
          return undefined;
        }
      });

      if (p.onLoadAll) {
        p.onLoadAll();
      }
    }, 1500);
    this.currentRoom.get("users").load?.((all) => {
      this.listeners = _.chain(all)
        .filter((v) => !!v.created_at)
        .sortBy("created_at")
        .value();
      db();
    });
  }
  getRole(userId: string | null | undefined) {
    if (!userId) {
      return;
    }
    if (this.outsiders.map(({ id }) => id).indexOf(userId) >= 0) {
      return "OUTSIDER";
    }
    if (this.broadcasters.map(({ id }) => id).indexOf(userId) >= 0) {
      return "BROADCASTER";
    }
    if (this.mainLoopUsers.map(({ id }) => id).indexOf(userId) >= 0) {
      return "MAINLOOP_USER";
    }
  }
  /*
    JOIN ROOM AS MAINLOOP
  */
  initMainLoopUser(userId: string, localStream: MediaStream) {
    const _room = this;
    class MainLoopPeer extends RPeer {
      mainLoop_outgoing: Hop[] = [];
      combinedStream = new MediaStream();
      async onOffer(data: SocketEventData) {
        //Connect back if it is mainLoopIds
        if (
          _room.mainLoopUsers.map((u) => u.id).indexOf(data.fromUserId) >= 0
        ) {
          this.callToUser(data.fromUserId);
        } else if (
          _room.broadcasters.map((u) => u.id).indexOf(data.fromUserId) >= 0
        ) {
          this.callToUser(data.fromUserId);
        }
      }
      async shouldAcceptOffer(data: SocketEventData) {
        //Connect accept if it is mainLoopIds
        return (
          _room.mainLoopUsers.map((u) => u.id).indexOf(data.fromUserId) >= 0 ||
          _room.broadcasters.map((u) => u.id).indexOf(data.fromUserId) >= 0
        );
      }
      async onConnect(hop: Hop) {
        //Trigger on data change
        _room.datas.push({
          fromUserId: hop.attr.fromId,
          data: `Connection from ${hop.attr.fromId} -> ${hop.attr.toId}`,
        });
        if (_room.onChange) _room.onChange();
      }
    }
    const mainLoop = new MainLoopPeer({
      localStream: localStream,
      userId,
    });
    this.peerManager = mainLoop;
    //Listen to main loop
    this.startLoadUser({
      async onLoadUser(id: string) {
        if (id === userId) {
          return;
        }

        const ml = await mainLoop.callToUser(id, true);
        mainLoop.mainLoop_outgoing.push(ml);
      },
      async onLoadBroadCaster(id: string) {
        if (id === userId) {
          return;
        }

        const ml = await mainLoop.callToUser(id, true);
        mainLoop.mainLoop_outgoing.push(ml);
      },
    });
    return () => {
      mainLoop.destroy();
      this.peerManager = undefined;
    };
  }
  /*
    JOIN ROOM AS BROADCASTER
  */
  initBroadCaster(userId: string, localStream: MediaStream) {
    const _room = this;
    class BroadCasterPeer extends RPeer {
      outsiders_outgoing: Hop[] = [];
      mainLoop_outgoing: Hop[] = [];
      combinedStream = new MediaStream();
      async onOffer(data: SocketEventData) {
        //Connect back if it is mainLoopIds and outsider ids
        if (
          _room.mainLoopUsers.map((u) => u.id).indexOf(data.fromUserId) >= 0
        ) {
          const hop = await this.callToUser(data.fromUserId);
          if (hop) {
            this.mainLoop_outgoing.push(hop);
          }
        } else if (
          _room.outsiders.map((u) => u.id).indexOf(data.fromUserId) >= 0
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
          _room.mainLoopUsers.map((u) => u.id).indexOf(data.fromUserId) >= 0
        );
      }
      selectStream(fromId: string, toId: string) {
        //Use combine stream if it is connection to outsider
        if (_room.outsiders.map((u) => u.id).indexOf(toId) >= 0) {
          return this.combinedStream;
        }
        return this.localStream;
      }
      async onConnect(hop: Hop) {
        //Trigger on data change
        _room.datas.push({
          fromUserId: hop.attr.fromId,
          data: `Connection from ${hop.attr.fromId} -> ${hop.attr.toId}`,
        });
        if (_room.onChange) _room.onChange();
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
    }
    const broadCaster = new BroadCasterPeer({
      localStream: localStream,
      userId,
    });
    broadCaster.combinedStream.addTrack(localStream.getTracks()[0]);
    this.peerManager = broadCaster;
    this.startLoadUser({
      onLoadUser: async (id: string) => {
        if (id === userId) {
          return;
        }

        const ml = await broadCaster.callToUser(id, true);
        broadCaster.mainLoop_outgoing.push(ml);
      },
      onLoadOutsider: async (id: string) => {
        if (id === userId) {
          return;
        }
        const h = await broadCaster.callToUser(id, true);
        broadCaster.outsiders_outgoing.push(h);
      },
    });
    return () => {
      broadCaster.destroy();
      this.peerManager = undefined;
    };
  }
  /*
    JOIN ROOM AS OUTSIDER
  */
  initOutsider(userId: string, localStream: MediaStream) {
    const _room = this;
    class OutsiderPeer extends RPeer {
      mainLoop_outgoing: Hop[] = [];
      combinedStream = new MediaStream();
      async onOffer(data: SocketEventData) {
        //Do not connect back
      }
      async shouldAcceptOffer(data: SocketEventData) {
        //Do not accept any offer
        return (
          _room.broadcasters.map((b) => b.id).indexOf(data.fromUserId) >= 0
        );
      }
      async onConnect(hop: Hop) {
        //Trigger on data change
        _room.datas.push({
          fromUserId: hop.attr.fromId,
          data: `Connection from ${hop.attr.fromId} -> ${hop.attr.toId}`,
        });
        if (_room.onChange) _room.onChange();
      }
    }
    const outsider = new OutsiderPeer({
      localStream: localStream,
      userId,
    });
    this.peerManager = outsider;
    //Listen to broadcaster
    this.startLoadUser({
      async onLoadBroadCaster(id: string) {
        await outsider.callToUser(id, true);
      },
    });

    return () => {
      outsider.destroy();
      this.peerManager = undefined;
    };
  }
}
