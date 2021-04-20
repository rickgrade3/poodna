import { GUNApiGen as APIGen } from "src/services/Gun";
import { v4 as uuidv4 } from "uuid";
import { User } from "@poodna/datatype";

export default {
  list: APIGen<undefined, { list: User[] }, User>({
    exec: (p, gun) => {
      return gun.get("users");
    },
    value: (res, gun, prev) => {
      return {
        list: [...(prev?.list || []), res],
      };
    },
  }),
  get: APIGen<{ id: string }, { item: User }, User>({
    exec: (p, gun) => {
      return gun.get("users").get(p.id);
    },
    value: (res, gun, prev) => {
      return { item: res };
    },
  }),
  create: APIGen<
    Omit<User, "id" | "created_at" | "online">,
    { item: User },
    User
  >({
    exec: (p, gun) => {
      let userId = uuidv4();
      return gun
        .get("users")
        .put({
          [userId]: {
            id: userId,
            online: true,
            ...p,
          },
        })
        .back()
        .get("users")
        .get(userId);
    },
    value: (res, gun, prev) => {
      return {
        item: res,
      };
    },
  }),
  update: APIGen<Omit<User, "created_at" | "online">, { item: User }, User>({
    exec: (p, gun) => {
      let userId = p.id;
      return gun
        .get("users")
        .put({
          [userId]: {
            id: userId,
            online: true,
            ...p,
          },
        })
        .back()
        .get("users")
        .get(userId);
    },
    value: (res, gun, prev) => {
      return {
        item: res,
      };
    },
  }),
};
