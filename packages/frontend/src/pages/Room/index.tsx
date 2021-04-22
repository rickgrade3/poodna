import { css } from "@emotion/react";
import {
  Avatar,
  Button,
  MenuItem,
  Typography,
  X,
  Y,
} from "@poodna/design-system/src";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import api from "src/api";
import { Icons } from "src/components/Icons";
import { appStore } from "src/stores/appStore";
import BroadcasterSetting from "./BroadcasterSetting";
import MainloopSetting from "./MainloopSetting";
import { RoomProviderWrapper, useRoom } from "./RoomProvider";

const Stat = () => {
  const r = useRoom();
  return (
    <X justify="start">
      <Typography variant="normal">
        Speaker : {r.total_mainloop}/{r.room.item.maximum}
      </Typography>
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
    <X wrap gap={0} align="center" py={4} justify="start">
      {Array(r.room.item.maximum)
        .fill(0)
        .map((d, i) => {
          console.log("x");
          const isBroadCaster = (r.broadcasters?.list || []).find(
            (_d) =>
              r.mainloop?.list?.[i] &&
              _d.id &&
              _d.id === r.mainloop?.list?.[i].id
          );
          return (
            <Y className="w-1/4" autoW={true}>
              <Button
                onClick={() => {
                  if (r.mainloop?.list?.[i] && isBroadCaster) {
                    api.ChatRoom.remove_broadcaster
                      .execute({
                        id: r.roomId,
                        userId: r.mainloop?.list?.[i].id,
                      })
                      .then(() => {
                        appStore.info_noti("Unset Broadcaster");
                      });
                  } else if (r.mainloop?.list?.[i] && !isBroadCaster) {
                    api.ChatRoom.add_broadcaster
                      .execute({
                        id: r.roomId,
                        userId: r.mainloop?.list?.[i].id,
                      })
                      .then(() => {
                        appStore.success_noti("Promote to Broadcaster");
                      });
                  } else if (!r.mainloop?.list?.[i])
                    appStore.openDialog({
                      variant: "DRAWER",
                      title: "Main Loop Setting",
                      content: ({ back }) => {
                        return (
                          <MainloopSetting roomId={r.roomId} onSubmit={back} />
                        );
                      },
                    });
                }}
                size="auto"
                style={{ padding: "1rem" }}
                variant="text_gray"
              >
                <Avatar
                  left={
                    !!isBroadCaster ? (
                      <Icons.FaBroadcastTower style={{ color: "white" }} />
                    ) : undefined
                  }
                  size="lg"
                  background={"rgba(0,0,0,0.1)"}
                  src={
                    r.mainloop?.list?.[i]?.avatar ||
                    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  }
                  label={r.mainloop?.list?.[i]?.name || `Set user ${i + 1}`}
                />
              </Button>
            </Y>
          );
        })}
    </X>
  );
};
const Listeners = () => {
  const r = useRoom();

  return (
    <X wrap gap={0} align="center" py={4} justify="start">
      {r.outsider?.list.map((u) => {
        return (
          <Y className="w-1/4" autoW={true}>
            <Avatar size="lg" src={u.avatar} label={u.name} />
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
    <Y gap={4}>
      <Y gap={2} justify="start" align="start">
        <Title />
        <Stat />
      </Y>
      <Users />
      <Y divider gap={0}>
        <MenuItem
          onClick={() => {
            appStore.openDialog({
              variant: "DRAWER",
              title: "Set broadcaster",
              content: ({ back }) => {
                return <BroadcasterSetting roomId={r.roomId} onSubmit={back} />;
              },
            });
          }}
          icon={<Icons.FaBroadcastTower />}
          chevron
        >
          Set broadcaster
        </MenuItem>
        <MenuItem
          onClick={() => {
            try {
              appStore.copyURLToClipboard();
              appStore.success_noti("คัดลอก URL สำเร็จ");
            } catch {
              appStore.error_noti("คัดลอก URL ไม่สำเร็จ");
            }
          }}
          icon={<Icons.FaShare />}
          chevron
        >
          Share
        </MenuItem>
        {/* <MenuItem icon={<Icons.FaBug />} chevron>
          Debug
        </MenuItem> */}
      </Y>
      <Y>
        <ListenerHeader />
        <Listeners />
      </Y>
      <Button
        css={css`
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: auto;
        `}
        onClick={() => {
          try {
            appStore.copyURLToClipboard();
            appStore.success_noti("คัดลอก URL สำเร็จ");
          } catch {
            appStore.error_noti("คัดลอก URL ไม่สำเร็จ");
          }
        }}
        size="xl"
        variant="primary"
        full={false}
        icon={<Icons.FaLink />}
      ></Button>
    </Y>
  );
};
export default () => {
  return (
    <RoomProviderWrapper roomId={(useParams() as any).id}>
      <Inner />
    </RoomProviderWrapper>
  );
};
