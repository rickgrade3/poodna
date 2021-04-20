import {
  Avatar,
  Button,
  MenuItem,
  Typography,
  X,
  Y,
} from "@poodna/design-system/src";
import { useEffect } from "react";
import { useParams } from "react-router";
import api from "src/api";
import { Icons } from "src/components/Icons";
import { appStore } from "src/stores/appStore";
import { RoomProviderWrapper, useRoom } from "./RoomProvider";

const Stat = () => {
  const r = useRoom();
  return (
    <X>
      <Typography variant="normal">{r.total_users}</Typography>
      <Typography variant="normal">{r.total_broadcasters}</Typography>
    </X>
  );
};
const ListenerHeader = () => {
  const r = useRoom();
  return <Typography variant="normal">{r.total_users}</Typography>;
};
const Title = () => {
  const r = useRoom();
  return <Typography variant="heading">{r.room.item.title}</Typography>;
};
const Users = () => {
  const r = useRoom();
  return (
    <X>
      {r.mainloop?.list.map((u) => {
        return <Avatar src={u.avatar} label={u.name} />;
      })}
    </X>
  );
};
const Listeners = () => {
  const r = useRoom();
  console.log(r.outsider);
  return (
    <X>
      {r.outsider?.list.map((u) => {
        return <Avatar src={u.avatar} label={u.name} />;
      })}
    </X>
  );
};
const Inner = () => {
  const r = useRoom();
  useEffect(() => {
    if (r.room?.item?.ownerId !== appStore.user.id) {
      console.log("Add outsider");
      api.ChatRoom.add_outsider.execute({
        id: r.room?.item.id || "",
        userId: appStore.user.id,
      });
    }
  }, [r.room?.item]);
  if (!r.room) {
    return <></>;
  }
  return (
    <>
      <Title />
      <Stat />
      <Y divider>
        <Users />
        <MenuItem icon={<Icons.FaBroadcastTower />} chevron>
          Broadcaster
        </MenuItem>
        <MenuItem icon={<Icons.FaShare />} chevron>
          Share
        </MenuItem>
        <MenuItem icon={<Icons.FaBug />} chevron>
          Debug
        </MenuItem>
      </Y>
      <Y>
        <ListenerHeader />
        <Listeners />
      </Y>
      <Button icon={<Icons.FaLink />}></Button>
    </>
  );
};
export default () => {
  return (
    <RoomProviderWrapper roomId={(useParams() as any).id}>
      <Inner />
    </RoomProviderWrapper>
  );
};
