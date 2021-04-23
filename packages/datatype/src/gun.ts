export interface User {
  online: boolean;
  id: string;
  created_at?: number;
  avatar: string;
  name: string;
}
export interface ChatRoom {
  id: string;
  title: string;
  maximum: number;
  ownerId: string;
  auto_pick_broadcaster: boolean;
  connections: {
    [userId: string]: {
      connectionId: string;
      userId: string;
    };
  };
  broadcasters: {
    [userId: string]: User;
  };
  mainloops: {
    [userId: string]: User;
  };
  outsiders: {
    [userId: string]: User;
  };
} //
export interface AppDB {
  users: {
    [userId: string]: User;
  };
  rooms: {
    [roomId: string]: ChatRoom;
  };
}
