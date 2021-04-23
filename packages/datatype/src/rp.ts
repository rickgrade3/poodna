export const SEND_DATA = "send-data";
export enum AvailableEvents {
  signal_to_force = "signal_to_force",
  signal_to = "signal_to",
  signal_back = "signal_back",
  data = "data",
  stream = "stream",
  track = "track",
  close = "close",
  newConnection = "newConnection",
  requestVideo = "requestVideo",
}
export type AvailableEventsStr = keyof typeof AvailableEvents;
export type SocketData = {
  toUserId: string;
  fromUserId: string;
  event: AvailableEventsStr;
  clearPC: boolean;
  payload: any;
};
