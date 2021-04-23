import { useEffect, useRef, useState } from "react";
import {
  BroadCasterPeer,
  MainLoopPeer,
  ListenerPeer,
  PoodnaPeerUser,
  PoodnaPeer,
  PoodnaRole,
} from "src/services/PoodnaPeer";
import { appStore } from "src/stores/appStore";
import { useRoom } from "./RoomProvider";
/*
    WEBRTC LOGIC FOR CURRENT USER
*/
const MyLogic = (p: { role: PoodnaRole; users: PoodnaPeerUser[] }) => {
  const users = useRef<PoodnaPeerUser[]>([]);
  const pp = useRef<PoodnaPeer>();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    console.log(pp.current, ready);
    if (pp.current && ready) {
      p.users
        .filter((u) => {
          return (
            !users.current.find((_u) => _u.id === u.id) &&
            u.id !== appStore.user.id
          );
        })
        .forEach((newU) => {
          console.log("new User");
          pp.current.onNewUserInRoom(newU);
        });
      users.current = p.users;
    }
  }, [ready, p.users.map((u) => u.id + "_" + u.role).join("_")]);
  useEffect(() => {
    const get_users = () => {
      return users.current;
    };
    const userId = appStore.user.id;
    const localStream = appStore.app.localStream;
    const x = {
      get_users,
      localStream,
      user: {
        id: userId,
        role: p.role,
      },
    };
    console.log("p.role", p.role);
    let peer =
      p.role === "MAIN_LOOP"
        ? new MainLoopPeer(x)
        : p.role === "BROADCASTER"
        ? new BroadCasterPeer(x)
        : p.role === "LISTENER"
        ? new ListenerPeer(x)
        : false;
    if (peer !== false) {
      pp.current = peer;
      setReady(true);
    }
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
  const mainLoops: PoodnaPeerUser[] = (r.mainloop?.list || []).map((v) => ({
    id: v.id,
    role: "MAIN_LOOP",
  }));
  const broadcasters: PoodnaPeerUser[] = (r.broadcasters?.list || []).map(
    (v) => ({
      id: v.id,
      role: "BROADCASTER",
    })
  );
  const listeners: PoodnaPeerUser[] = (r.outsider?.list || []).map((v) => ({
    id: v.id,
    role: "LISTENER",
  }));
  const users: PoodnaPeerUser[] = _.uniqBy(
    [].concat(broadcasters).concat(mainLoops).concat(listeners),
    "id"
  );

  useEffect(() => {
    const role = users.find((u) => u.id === appStore.user.id)?.role;
    if (role) {
      setMyRole(role);
    }
  }, [users.map((u) => u.id + "_" + u.role).join("_")]);
  return (
    <>
      <div key={myRole}>
        {myRole !== "UNKNOWN" && (
          <MyLogic
            users={users.filter((u) => u.id !== appStore.user.id)}
            role={myRole}
          />
        )}
      </div>
    </>
  );
};
