import { makeAutoObservable } from "mobx";
import { AppDB, User } from "@poodna/datatype";
import { BasicAppStore } from "@poodna/design-system/src";
import Gun from "gun/gun";
import { IGunChainReference } from "gun/types/chain";

class GunStore {
  constructor() {
    makeAutoObservable(this);
  }
  gun: IGunChainReference<AppDB, any, "pre_root">;
  load_gun() {
    if (!this.gun) this.gun = Gun<AppDB>(["http://localhost:8765/gun"]);
  }
}
export const gunStore = new GunStore();
export const appStore = new BasicAppStore<User>();
