export const SEND_DATA = "send-data";
export enum AvailableEvents {
  offer = "offer",
  answer = "answer",
  clearPC = "clearPC",
  ice_candidate = "ice_candidate",
  ice_candidate_reverse = "ice_candidate_reverse",
}
export type AvailableEventsStr = keyof typeof AvailableEvents;
export type SocketData {
  toUserId: string;
  fromUserId: string;
  event: AvailableEventsStr;
  clearPC: boolean;
  payload: any;
}
