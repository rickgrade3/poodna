import { useEffect, useRef, useState } from "react";
import {
  BroadCasterPeer,
  MainLoopPeer,
  ListenerPeer,
  PoodnaPeerUser,
  PoodnaRole,
} from "src/services/PoodnaPeer";
import { appStore } from "src/stores/appStore";
import { useRoom } from "./RoomProvider";
/*
    WEBRTC LOGIC FOR CURRENT USER
*/
const MyLogic = (p: { role: PoodnaRole; users: PoodnaPeerUser[] }) => {
  const users = useRef<PoodnaPeerUser[]>([]);
  useEffect(() => {}, [p.users.map((u) => u.id + "_" + u.role)]);
  useEffect(() => {
    const get_users = () => {
      return users.current;
    };
    const userId = appStore.user.id;
    const localStream = appStore.app.localStream;
    const x = {
      userId,
      get_users,
      localStream,
    };
    let peer =
      p.role === "MAIN_LOOP"
        ? new MainLoopPeer(x)
        : p.role === "BROADCASTER"
        ? new BroadCasterPeer(x)
        : p.role === "LISTENER"
        ? new ListenerPeer(x)
        : false;
    return () => {
      if (peer !== true && peer !== false) {
        peer.destroy();
      }
    };
  }, []);
  return <></>;
};
export default () => {
  const r = useRoom();
  const [myRole, setMyRole] = useState<PoodnaRole>("UNKNOWN");
  const mainLoops: PoodnaPeerUser[] = (r.broadcasters?.list || []).map((v) => ({
    id: v.id,
    role: "MAIN_LOOP",
  }));
  const broadcasters: PoodnaPeerUser[] = (r.broadcasters?.list || []).map(
    (v) => ({
      id: v.id,
      role: "LISTENER",
    })
  );
  const listeners: PoodnaPeerUser[] = (r.broadcasters?.list || []).map((v) => ({
    id: v.id,
    role: "LISTENER",
  }));
  const users: PoodnaPeerUser[] = []
    .concat(mainLoops)
    .concat(listeners)
    .concat(broadcasters);

  return (
    <>
      <div key={myRole}>
        {myRole !== "UNKNOWN" && <MyLogic users={users} role={myRole} />}
      </div>
    </>
  );
};
