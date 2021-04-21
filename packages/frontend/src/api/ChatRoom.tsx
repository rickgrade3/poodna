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
      return gun.get("rooms").map();
    },
    value: (res, gun, prev) => {
      return {
        list: _.uniqBy([...(prev?.list || []), res], "id"),
      };
    },
  }),
  list_by_user: APIGen<{ id: string }, { list: ChatRoom[] }, ChatRoom>({
    exec: (p, gun) => {
      return gun.get("rooms").map();
    },
    value: (res, gun, prev, p) => {
      if (res.ownerId !== p.id) {
        return {
          list: prev?.list || [],
        };
      }
      return {
        list: _.uniqBy([...(prev?.list || []), res], "id"),
      };
    },
  }),

  add_mainloop: APIGen<{ id: string; userId: string }, { list: User[] }, User>({
    exec: (p, gun) => {
      return gun
        .get("rooms")
        .get(p.id)
        .get("mainloops")
        .get(p.userId)
        .put(gun.get("users").get(p.userId) as any);
    },
    value: (res, gun, prev) => {
      console.log("res", res);
      return {
        list: _.uniqBy([...(prev?.list || []), res], "id"),
      };
    },
  }),
  remove_listener: APIGen<
    { id: string; userId: string },
    { list: User[] },
    User
  >({
    exec: (p, gun) => {
      return gun
        .get("rooms")
        .get(p.id)
        .get("outsiders")
        .get(p.userId)
        .put(null)
        .back();
    },
    value: (res, gun, prev) => {
      console.log("del", res);
      return {
        list: _.uniqBy([...(prev?.list || []), res], "id"),
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
        .get(p.userId)
        .put(gun.get("users").get(p.userId) as any);
    },
    value: (res, gun, prev) => {
      return {
        list: [...(prev?.list || []), res],
      };
    },
  }),
  remove_broadcaster: APIGen<
    { id: string; userId: string },
    { list: User[] },
    User
  >({
    exec: (p, gun) => {
      return gun
        .get("rooms")
        .get(p.id)
        .get("broadcasters")
        .get(p.userId)
        .put(null)
        .back();
    },
    value: (res, gun, prev) => {
      console.log("del", res);
      return {
        list: _.uniqBy([...(prev?.list || []), res], "id"),
      };
    },
  }),
  add_outsider: APIGen<{ id: string; userId: string }, { list: User[] }, User>({
    exec: (p, gun) => {
      return gun
        .get("rooms")
        .get(p.id)
        .get("outsiders")
        .get(p.userId)
        .put(gun.get("users").get(p.userId) as any);
    },
    value: (res, gun, prev) => {
      return {
        list: [...(prev?.list || []), res],
      };
    },
  }),
  list_broadcaster: APIGen<{ id: string }, { list: User[] }, User>({
    exec: (p, gun) => {
      return gun.get("rooms").get(p.id).get("broadcasters").map();
    },
    value: (res, gun, prev, req, key) => {
      console.log("resres", res);
      if (!res && key) {
        return {
          list: (prev?.list || []).filter((d) => d.id !== key),
        };
      }
      return {
        list: _.uniqBy([...(prev?.list || []), res], "id").filter((v) => v),
      };
    },
  }),
  list_mainloop: APIGen<{ id: string }, { list: User[] }, User>({
    exec: (p, gun) => {
      return gun.get("rooms").get(p.id).get("mainloops").map();
    },
    value: (res, gun, prev, req, key) => {
      if (!res && key) {
        return {
          list: (prev?.list || []).filter((d) => d.id !== key),
        };
      }
      return {
        list: _.uniqBy([...(prev?.list || []), res], "id").filter((v) => v),
      };
    },
  }),
  list_outsider: APIGen<{ id: string }, { list: User[] }, User>({
    exec: (p, gun) => {
      return gun.get("rooms").get(p.id).get("outsiders").map();
    },
    value: (res, gun, prev, req, key) => {
      if (!res && key) {
        return {
          list: (prev?.list || []).filter((d) => d.id !== key),
        };
      }
      return {
        list: _.uniqBy([...(prev?.list || []), res], "id").filter((v) => v),
      };
    },
  }),
};
