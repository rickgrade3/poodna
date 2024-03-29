import Peer from "peerjs";
import Gun from "gun/gun";
import { IGunChainReference } from "gun/types/chain";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
import { ChatRoom, AppDB } from "@poodna/datatype";

import { useEffect, useRef, useState } from "react";
import { AlwaysDisallowedType, ArrayAsRecord } from "gun/types/types";
import { gunStore } from "src/stores/appStore";
require("gun/lib/load.js");

export const GUNApiGen = function <
  request = any,
  response = any,
  GunItem = any
>(o: {
  exec?: (
    v: request,
    g: typeof gunStore.gun,
    prevData?: response | undefined
  ) =>
    | IGunChainReference<{ [key: string]: GunItem }, any, false>
    | IGunChainReference<GunItem, any, false>;
  value: (
    v: GunItem,
    g: typeof gunStore.gun,
    prevData?: response | undefined,
    v2?: request,
    key?: string
  ) => response;
}) {
  const execute = async (p: request) => {
    return await new Promise<response>((resolve) => {
      o.exec(p, gunStore.gun).load?.((v) => {
        resolve(o.value(v, gunStore.gun, undefined, p, undefined));
      });
    });
  };
  const Hook = (p: request) => {
    const [loading, setLoading] = useState<boolean>(false);
    const vv = useRef<response | undefined>();
    const [data, setData] = useState<undefined | response>(undefined);

    useEffect(() => {
      setLoading(true);

      o.exec(p, gunStore.gun).on((v, key) => {
        let newV = o.value(v, gunStore.gun, vv.current, p, key);
        vv.current = newV;
        setData(newV);
      });
    }, []);
    return {
      loading,
      data: data,
    } as {
      loading: boolean;
      data?: response;
    };
  };
  return {
    execute,
    hook: Hook,
  };
};
