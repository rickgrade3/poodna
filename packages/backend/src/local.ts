import express from "express";
import { AvailableEventsStr, SEND_DATA } from "@poodna/datatype";
var app = express();

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
      event: AvailableEventsStr;
      clearPC: boolean;
      payload: any;
    }) => {
      try {
        console.log("emit");
        io.in(data.toUserId).emit(data.event, {
          toUserId: data.toUserId,
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

const Gun = require("gun");
const gun = Gun({
  file: "db",
  web: require("http")
    .createServer(Gun.serve(__dirname))
    .listen(8765),
  localStorage: true,
});

gun.get("users").put({});
