import { GUNApiGen as APIGen } from "src/services/Gun";
import { ChatRoom, User } from "@poodna/datatype";
import { v4 as uuidv4 } from "uuid";
import { IGunChainReference } from "gun/types/chain";
export default {
  get: APIGen<{ id: string }, { item: ChatRoom }, ChatRoom>({
    exec: (p, gun) => {
      return gun.get("rooms").get(p.id);
    },
    value: (res, gun, prev) => {
      return { item: res };
    },
  }),
  create: APIGen<
    Omit<ChatRoom, "id" | "broadcasters" | "mainloops" | "outsiders">,
    { item: ChatRoom },
    ChatRoom
  >({
    exec: (p, gun) => {
      let roomId = uuidv4();
      return gun
        .get("rooms")
        .get(roomId)
        .put({
          id: roomId,
          broadcasters: {},
          mainloops: {},
          outsiders: {},
          ...p,
        })
        .back()
        .get(roomId);
    },
    value: (res, gun, prev) => {
      return {
        item: res,
      };
    },
  }),
  list: APIGen<undefined, { list: ChatRoom[] }, ChatRoom>({
    exec: (p, gun) => {
      return gun.get("rooms");
    },
    value: (res, gun, prev) => {
      return {
        list: [...(prev?.list || []), res as any],
      };
    },
  }),
  list_broadcaster: APIGen<{ id: string }, { list: User[] }, User>({
    exec: (p, gun) => {
      return gun.get("rooms").get(p.id).get("broadcasters").map();
    },
    value: (res, gun, prev) => {
      console.log(res);
      return {
        list: [...(prev?.list || []), res as any],
      };
    },
  }),
  add_broadcaster: APIGen<
    { id: string; userId: string },
    { list: User[] },
    User
  >({
    exec: (p, gun) => {
      return gun
        .get("rooms")
        .get(p.id)
        .get("broadcasters")
        .put(gun.get("users").get(p.userId) as any);
    },
    value: (res, gun, prev) => {
      return {
        list: [...(prev?.list || []), res as any],
      };
    },
  }),
  add_mainloop: APIGen<{ id: string; userId: string }, { list: User[] }, User>({
    exec: (p, gun) => {
      return gun
        .get("rooms")
        .get(p.id)
        .get("mainloops")
        .put(gun.get("users").get(p.userId) as any);
    },
    value: (res, gun, prev) => {
      console.log("res", res);
      return {
        list: [...(prev?.list || []), res as any],
      };
    },
  }),
  add_outsider: APIGen<{ id: string; userId: string }, { list: User[] }, User>({
    exec: (p, gun) => {
      return gun
        .get("rooms")
        .get(p.id)
        .get("outsiders")
        .put(gun.get("users").get(p.userId) as any);
    },
    value: (res, gun, prev) => {
      return {
        list: [...(prev?.list || []), res as any],
      };
    },
  }),
  list_mainloop: APIGen<{ id: string }, { list: User[] }, User>({
    exec: (p, gun) => {
      return gun.get("rooms").get(p.id).get("mainloops");
    },
    value: (res, gun, prev) => {
      return {
        list: [...(prev?.list || []), res],
      };
    },
  }),
  list_outsider: APIGen<{ id: string }, { list: User[] }, User>({
    exec: (p, gun) => {
      return gun.get("rooms").get(p.id).get("outsiders").map();
    },
    value: (res, gun, prev) => {
      return {
        list: [...(prev?.list || []), res as any],
      };
    },
  }),
};
