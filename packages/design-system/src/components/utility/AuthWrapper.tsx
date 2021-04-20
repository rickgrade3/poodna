import React, { Children, ReactElement, useEffect } from "react";
import { Loading } from "../..";
export default function <User, Error>() {
  return (p: {
    children: ReactElement;
    getToken: () => string;
    clearToken: () => any;
    getUser: (token: string) => Promise<User>;
    isNotAuthorizeError: (e: Error) => boolean;
    setUser: (u: User) => any;
    unsetUser: () => any;
    toFallback: () => any;
    isLogin?: () => boolean;
  }) => {
    useEffect(() => {
      let loading = false;
      const reloadAdmin = () => {
        if (loading) {
          return false;
        }
        if (!p.getToken()) {
          p.toFallback();
          return false;
        }
        loading = true;
        const logout = () => {
          p.clearToken();
          p.unsetUser();
          p.toFallback();
        };

        p.getUser(p.getToken())
          .then((res) => {
            if (res) {
              loading = false;
              p.setUser(res);
            } else {
              logout();
            }
          })
          .catch((res: Error) => {
            if (p.isNotAuthorizeError(res)) {
              logout();
            } else {
              loading = false;
            }
          });
      };
      const intv = setInterval(reloadAdmin, 1 * 60 * 1000);
      reloadAdmin();
      return () => {
        clearInterval(intv);
      };
    }, []);
    if (!p.isLogin()) {
      return (
        <div tw="mt-20 mx-auto text-center">
          <Loading tw="mx-auto" />
        </div>
      );
    }
    return <div>{p.children}</div>;
  };
}
