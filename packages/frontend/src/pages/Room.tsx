import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../App";
import { RoomManager } from "../services/Gun";

export const Room = () => {
  let { roomId } = useParams<{ roomId: string }>();
  const app = useAppContext();
  useEffect(() => {
    if (app.gun) {
      const r = new RoomManager({ roomId, gunManager: app.gun });
      r.loadRoom().then(() => {
        app.setCurrentRoom(r);
      });
    }
  }, [roomId]); //
  useEffect(() => {
    if (app.room && app.room?.room) {
      app.room.addUserToRoom(app.userId || "");
      app.room.bindEvents({
        onChange: () => {
          if (!app.room) {
            return;
          }
          console.log("Change");
          app.refresh();
          const currentRole = app.room.getRole(app.userId);
          if (currentRole) {
            app.setRole(currentRole);
          }
        },
      });

      app.room.startLoadUser({
        onLoadAll: () => {
          if (!app.userId || !app.localStream || !app.room) {
            return;
          }
          const currentRole = app.room.getRole(app.userId);
          switch (currentRole) {
            case "OUTSIDER": {
              app.setRole(currentRole);
              break;
            }
            case "BROADCASTER": {
              app.setRole(currentRole);
              break;
            }
            case "MAINLOOP_USER": {
              app.setRole(currentRole);
              break;
            }
          }
          app.refresh();
        },
      });
    }
    return () => {
      app.room?.unbindEvents();
    };
  }, [app.room?.room]);

  useEffect(() => {
    if (!app.role || !app.userId || !app.localStream) {
      return;
    }
    let destroy: any;
    switch (app.role) {
      case "OUTSIDER": {
        destroy = app.room?.initOutsider(app.userId, app.localStream);
        break;
      }
      case "BROADCASTER": {
        destroy = app.room?.initBroadCaster(app.userId, app.localStream);
        break;
      }
      case "MAINLOOP_USER": {
        destroy = app.room?.initMainLoopUser(app.userId, app.localStream);
        break;
      }
    }
    return () => {
      if (destroy) {
        destroy();
      }
    };
  }, [app.role, app.userId]);
  return (
    <>
      <div style={{ fontSize: 20 }}>{app.role}</div>
      <div>-------</div>
      <div style={{ fontWeight: "bold" }}>
        {app.room?.room?.ownerId === app.userId ? "Room owner" : "Listener"}
      </div>
      <div>UserId:{app.userId}</div>
      <div>OwnerId:{app.room?.room?.ownerId}</div>

      <div>-------</div>
      <div style={{ fontWeight: "bold" }}>Users in room</div>
      <div key={app.refreshDate + "u"}>
        {app.room?.listeners.map(({ id }) => {
          return <div key={id}>{id}</div>;
        })}
      </div>
      <div>-------</div>
      <div style={{ fontWeight: "bold" }}>Broadcasters</div>
      <div key={app.refreshDate + "b"}>
        {app.room?.broadcasters.map(({ id }) => {
          return <div key={id}>{id}</div>;
        })}
      </div>
      <div>-------</div>
      <div style={{ fontWeight: "bold" }}>Outsiders</div>
      <div key={app.refreshDate + "o"}>
        {app.room?.outsiders.map(({ id }) => {
          return <div key={id}>{id}</div>;
        })}
      </div>
      <div>-------</div>
      <div style={{ fontWeight: "bold" }}>Messeges</div>
      <div>
        {(app.room?.datas || []).map(({ data, fromUserId }, i) => {
          return (
            <div key={i}>
              {fromUserId}-{data}
            </div>
          );
        })}
      </div>
    </>
  );
};
