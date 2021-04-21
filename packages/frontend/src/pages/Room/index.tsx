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
    <X justify="start">
      <Typography variant="normal">Users : {r.total_users}</Typography>
      <Typography variant="normal">
        Broadcasters : {r.total_broadcasters}
      </Typography>
    </X>
  );
};
const ListenerHeader = () => {
  const r = useRoom();
  return (
    <Typography variant="heading" size="text_xl">
      Listeners
    </Typography>
  );
};
const Title = () => {
  const r = useRoom();
  return (
    <Typography size="text_3xl" variant="heading">
      {r.room.item.title}
    </Typography>
  );
};
const Users = () => {
  const r = useRoom();
  return (
    <X align="center" p={4} justify="start">
      {r.mainloop?.list.map((u) => {
        return (
          <Y className="w-1/4" autoW={true}>
            <Avatar src={u.avatar} label={u.name} />
          </Y>
        );
      })}
    </X>
  );
};
const Listeners = () => {
  const r = useRoom();
  console.log(r.outsider);
  return (
    <X align="center" p={4} justify="start">
      {r.outsider?.list.map((u) => {
        return (
          <Y className="w-1/4" autoW={true}>
            <Avatar src={u.avatar} label={u.name} />
          </Y>
        );
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
      <Y gap={2} justify="start" align="start">
        <Title />
        <Stat />
      </Y>
      <Users />
      <Y divider gap={0}>
        <MenuItem icon={<Icons.FaBroadcastTower />} chevron>
          Broadcaster Setting
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
