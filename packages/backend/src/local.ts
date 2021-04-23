import express from "express";
import { AvailableEventsStr, SEND_DATA } from "@poodna/datatype";
var app = express();
const Gun = require("gun");
app.use(Gun.serve).use(express.static(__dirname));
app.get("/", (req, res, next) => res.send("Hello world!"));

const server = app.listen(9002);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
//
io.on("connection", (socket: any) => {
  console.log("a user connected", socket.handshake.query.userId);

  socket.join(socket.handshake.query.userId);

  socket.on(
    SEND_DATA,
    (data: {
      toUserId: string;
      fromUserId: string;
      conenection_id: string;
      event: AvailableEventsStr;
      clearPC: boolean;
      payload: any;
    }) => {
      try {
        console.log("emit");
        io.in(data.toUserId).emit(data.event, {
          toUserId: data.toUserId,
          conenection_id: data.conenection_id,
          fromUserId: data.fromUserId,
          event: data.event,
          clearPC: data.clearPC,
          payload: data.payload,
        });
      } catch (ex) {
        console.log(ex);
      }
    }
  );
});

const gun = Gun({
  file: "db",
  web: server,
  localStorage: true,
});

gun.get("users").put({});

let [u1, u2] = server.listeners("upgrade").slice(0);
server.removeAllListeners("upgrade");
server.on("upgrade", (req, socket, head) => {
  if (req.url.indexOf("/socket.io") >= 0) u1(req, socket, head);
  else if (req.url.indexOf("/gun") >= 0) u2(req, socket, head);
  else socket.destroy();
});
