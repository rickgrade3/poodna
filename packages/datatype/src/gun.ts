export interface ChatRoom {
  id: string;
  ownerId: string;
  maximum: number;
  userCount: number;
  users: {
    [userId: string]: {
      online: boolean;
      id: string;
      created_at?: number;
    };
  };
  bradcasters: {
    [userId: string]: {
      id: string;
      created_at?: number;
    };
  };
  mainLoopUsers: {
    [userId: string]: {
      id: string;
      created_at?: number;
    };
  };
  outsiders: {
    [userId: string]: {
      id: string;
      created_at?: number;
    };
  };
} //
export interface AppDB {
  users: {
    [userId: string]: {
      id: string;
    };
  };
  rooms: {
    [roomId: string]: ChatRoom;
  };
}
