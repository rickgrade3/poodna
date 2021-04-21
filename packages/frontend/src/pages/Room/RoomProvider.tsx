import { ReactElement, useContext, useEffect, useState } from "react";
import api from "src/api";

const _useRoom = (_roomId: string) => {
  const roomId = _roomId;
  const [room, setRoom] = useState<
    PromiseVal<typeof api.ChatRoom.get.execute>
  >();
  useEffect(() => {
    api.ChatRoom.get.execute({ id: roomId }).then((r) => {
      setRoom(r);
    });
  }, []);
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
  };
};
const RoomContext = React.createContext<ReturnType<typeof _useRoom>>(undefined);

export const RoomProviderWrapper = (p: {
  roomId: string;
  children: ReactElement;
}) => {
  const r = _useRoom(p.roomId);
  return <RoomContext.Provider value={r}>{p.children}</RoomContext.Provider>;
};
export const useRoom = () => {
  const r = useContext(RoomContext);
  return r;
};
