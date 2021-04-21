import { User } from "@poodna/datatype";
import { AuthWrapper, BG, X, Y } from "@poodna/design-system/src";
import React, { ReactElement } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import api from "./api";
import CreateRoom from "./pages/CreateRoom";
import Register from "./pages/Register";
import Room from "./pages/Room";
import { appStore } from "./stores/appStore";
import { observer } from "mobx-react-lite";
import Navbar from "./components/Navbar";
const AW = observer(AuthWrapper<User, any>());
const Auth = (p: { children: ReactElement }) => {
  const router = useHistory();
  return (
    <AW
      {...{
        getToken: () => {
          return localStorage.getItem("userId") || "";
        },
        clearToken: () => {
          localStorage.removeItem("userId");
        },
        isNotAuthorizeError: (error) => {
          return true;
        },
        getUser: async (token) => {
          const u = await api.User.get.execute({ id: token });
          return u.item;
        },
        isLogin: () => {
          return !!appStore.user?.id;
        },
        setUser: (u) => {
          appStore.setUser(u);
          return;
        },
        unsetUser: () => {
          appStore.setUser(undefined);
          return;
        },
        toFallback: () => {
          router.push("/register");
        },
      }}
    >
      {p.children}
    </AW>
  );
};
export default () => {
  return (
    <Y variant={["page-wrapper"]}>
      <Switch>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/room/:id">
          <Auth>
            <>
              <Navbar>
                <Room />
              </Navbar>
              <BG color="white" />
            </>
          </Auth>
        </Route>
        <Route exact path="/create_room">
          <Auth>
            <Navbar>
              <CreateRoom />
            </Navbar>
          </Auth>
        </Route>
        <Route exact path="/">
          <Auth>
            <Navbar>
              <CreateRoom />
            </Navbar>
          </Auth>
        </Route>
      </Switch>
    </Y>
  );
};
