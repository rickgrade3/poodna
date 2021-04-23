import { Loading } from "@poodna/design-system/src";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import api from "src/api";
import { appStore } from "src/stores/appStore";
import PoodnaPeer from "./PoodnaPeer";

const _useRoom = (_roomId: string) => {
  const roomId = _roomId;
  const connectionId = Math.random().toString();
  const [room, setRoom] = useState<
    PromiseVal<typeof api.ChatRoom.get.execute>
  >();
  const [conReady, setConReady] = useState(false);
  useEffect(() => {
    api.ChatRoom.get.execute({ id: roomId }).then((r) => {
      setRoom(r);
    });
  }, []);
  useEffect(() => {
    api.ChatRoom.add_connection
      .execute({
        id: roomId,
        userId: appStore.user.id,
        connectionId,
      })
      .then(() => {
        setConReady(true);
      });
  }, []);
  const {
    data: connections,
    loading: loading_connections,
  } = api.ChatRoom.list_connections.hook({
    id: roomId,
  });
  const {
    data: broadcasters,
    loading: loading_broadcasters,
  } = api.ChatRoom.list_broadcaster.hook({
    id: roomId,
  });
  const {
    data: mainloop,
    loading: loading_mainloop,
  } = api.ChatRoom.list_mainloop.hook({
    id: roomId,
  });

  const {
    data: outsider,
    loading: loading_outsider,
  } = api.ChatRoom.list_outsider.hook({
    id: roomId,
  });
  const total_broadcasters = broadcasters?.list?.length || 0;
  const total_mainloop = mainloop?.list?.length || 0;
  const total_outsider = outsider?.list?.length || 0;
  return {
    total_users: _.uniq(
      [broadcasters?.list || [], mainloop?.list || [], outsider?.list || []]
        .flat()
        .map((d) => d.id)
    ).length,
    room,
    connections,
    loading_connections,
    setRoom,
    roomId,
    broadcasters,
    total_broadcasters,
    loading_broadcasters,
    mainloop,
    total_mainloop,
    loading_mainloop,
    outsider,
    total_outsider,
    loading_outsider,
    conReady,
  };
};
const RoomContext = React.createContext<ReturnType<typeof _useRoom>>(undefined);

const Inner = (p: { children: ReactElement }) => {
  const r = useRoom();
  if (!r.room || !r.conReady) {
    return (
      <>
        <Loading />
      </>
    );
  }
  return <>{p.children}</>;
};

export const RoomProviderWrapper = (p: {
  roomId: string;
  children: ReactElement;
}) => {
  const r = _useRoom(p.roomId);
  return (
    <RoomContext.Provider value={r}>
      <Inner>
        <>
          {p.children}
          <PoodnaPeer />
        </>
      </Inner>
    </RoomContext.Provider>
  );
};
export const useRoom = () => {
  const r = useContext(RoomContext);
  return r;
};
