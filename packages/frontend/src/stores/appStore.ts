import { makeAutoObservable } from "mobx";
import { AppDB, User } from "@poodna/datatype";
import { BasicAppStore } from "@poodna/design-system/src";
import Gun from "gun/gun";
import { IGunChainReference } from "gun/types/chain";
import { API_BASE_URL } from "src/const";

class GunStore {
  constructor() {
    makeAutoObservable(this);
  }
  gun: IGunChainReference<AppDB, any, "pre_root">;
  load_gun() {
    if (!this.gun) this.gun = Gun<AppDB>([`${API_BASE_URL}gun`]);
  }
}
export const gunStore = new GunStore();
type CustomData = {
  localStream: MediaStream;
};
export const appStore = new BasicAppStore<User, CustomData>();
