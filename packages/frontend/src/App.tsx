import React, { useContext, useEffect, useState } from "react";
import "./App.css";

import { v4 as uuidv4 } from "uuid";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Room } from "./pages/Room";
import { RoomCreate } from "./pages/RoomCreate";
import gun from "gun/gun";
import { GunManager, RoomManager } from "./services/Gun";

import { RPeer } from "./services/RP";

const useAppContextState = () => {
  const [userId, setUserId] = useState<string | null>();

  const [gun, setGun] = useState<GunManager | null>();
  const [room, setCurrentRoom] = useState<RoomManager | null>();
  const [role, setRole] = useState<
    "UNKNOWN" | "MAINLOOP_USER" | "BROADCASTER" | "OUTSIDER"
  >("UNKNOWN");
  const [refreshDate, setRefreshDate] = useState<number>(Math.random());
  const [localStream, setLocalStream] = useState<MediaStream | null>();
  const refresh = () => {
    setRefreshDate(Math.random());
  };
  useEffect(() => {
    if (!userId) {
      return;
    }

    const g = new GunManager({ userId });

    setGun(g);
  }, [userId]);
  useEffect(() => {
    RPeer.initLocalStream().then((v) => setLocalStream(v));
  }, []);

  useEffect(() => {
    let uid = localStorage.getItem("userId");
    if (!uid) {
      uid = uuidv4();
      localStorage.setItem("userId", uid);
      setUserId(uid);
    } else {
      setUserId(uid);
    }
  }, []);
  const ready = !!userId && !!localStream && !!gun;
  return {
    role,
    setRole,
    userId,
    ready,
    refresh,
    setUserId,
    refreshDate,
    localStream,
    room,
    setCurrentRoom,
    gun,
  };
};
interface AppContextType extends ReturnType<typeof useAppContextState> {}
const AppContext = React.createContext<AppContextType | undefined>(undefined);
export const useAppContext = () => {
  const app = useContext(AppContext);
  if (!app) {
    throw new Error("Need to be inside provider");
  }
  return app;
};
const AppInner = () => {
  const app = useAppContext();
  if (!app.ready) {
    return <>Loading</>;
  }
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <RoomCreate />
        </Route>
        <Route exact path="/room/:roomId">
          <Room />
        </Route>
      </Switch>
      <audio autoPlay />
    </Router>
  );
};
function App() {
  const state = useAppContextState();
  return (
    <AppContext.Provider value={state}>
      <AppInner />
    </AppContext.Provider>
  );
}

export default App;
