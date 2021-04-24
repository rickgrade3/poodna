import { useEffect, useRef, useState } from "react";
import api from "src/api";
import { PoodnaPeerUser, PoodnaPeer } from "src/services/PoodnaPeer";
import { appStore } from "src/stores/appStore";
import { useRoom } from "./RoomProvider";
/*
    WEBRTC LOGIC FOR CURRENT USER
*/
const MyLogic = (p: {
  roomId: string;
  me: PoodnaPeerUser;
  users: PoodnaPeerUser[];
}) => {
  const users = useRef<PoodnaPeerUser[]>([]);
  const pp = useRef<PoodnaPeer>();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (pp.current && ready) {
      users.current = p.users;
      pp.current.onUserChanged();
    }
  }, [
    ready,
    p.users.map((u) => u.connectionId + "_" + u.id + "_" + u.role).join("_"),
  ]);

  useEffect(() => {
    pp.current = new PoodnaPeer({
      get_users: () => {
        return users.current;
      },
      localStream: appStore.app.localStream,
      user: p.me,
      onConnect: () => {
        const connectionId = Math.random().toString();
        api.ChatRoom.add_connection
          .execute({
            id: p.roomId,
            userId: appStore.user.id,
            connectionId,
          })
          .then(() => {
            setReady(true);
          });
      },
    });
    return () => {
      pp.current.destroy();
    };
  }, []);
  return <></>;
};
export default () => {
  const r = useRoom();

  const [myRole, setMyRole] = useState<string>("UNKNOWN");

  const users: PoodnaPeerUser[] = _.uniqBy(
    (r.mainloop?.list || [])
      .concat(r.broadcasters?.list || [])
      .concat(r.outsider?.list || []),
    "id"
  ).map((u) => {
    const isSpeaker =
      (r.mainloop?.list || []).map((d) => d.id).indexOf(u.id) >= 0;
    const isBroadCaster =
      (r.broadcasters?.list || []).map((d) => d.id).indexOf(u.id) >= 0;
    return {
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      connectionId:
        (r.connections?.list || []).find((d) => d.userId === u.id)
          ?.connectionId || "NONE",
      speaker: isSpeaker,
      broadcaster: isBroadCaster,
      role: `${isSpeaker ? "SPEAKER" : "LISTENER"}${
        isBroadCaster ? "+BROADCASTER" : ""
      }`,
    };
  });
  const me = users.find((u) => u.id === appStore.user.id && u.connectionId);
  useEffect(() => {
    const r = users.find((u) => u.id === appStore.user.id)?.role;
    if (r) {
      setMyRole(r);
    }
  }, [users.map((u) => u.id + "_" + u.role).join("_")]);

  return (
    <>
      <div key={myRole}>
        {myRole !== "UNKNOWN" && r.room?.item && (
          <MyLogic
            roomId={r.room.item.id}
            me={me}
            users={users.filter(
              (u) => u.id !== appStore.user.id && u.connectionId
            )}
          />
        )}
      </div>
    </>
  );
};
