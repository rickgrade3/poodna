import React from "react";
import { ReactElement, useContext, useEffect, useState } from "react";

export type OverlayModel = {
  id?: string;
  width?: "lg" | "xs" | "sm" | "md" | "xl";
  variant?: "MODAL" | "DRAWER";
  title: any;
  description?: any;
  content: (props: { back: () => void }) => JSX.Element;
  onSubmit?: () => Promise<void>;
  submitText?: any;
  onCancel?: () => Promise<void>;
  cancelText?: any;
};
const _use = () => {
  const [overlays, setOverlays] = useState<OverlayModel[]>([]);
  return {
    overlays,
    setOverlays,
    hideOverlay: (id: string) => {
      setOverlays(overlays.filter((o) => o.id !== id));
    },
    showOverlay: (ov: OverlayModel) => {
      setOverlays([...overlays, ov]);
    },
  };
};
const OverlayContext = React.createContext<ReturnType<typeof _use>>(undefined);

export default (p: { children: ReactElement }) => {
  const r = _use();
  return (
    <OverlayContext.Provider value={r}>{p.children}</OverlayContext.Provider>
  );
};
export const useOverlay = () => {
  const r = useContext(OverlayContext);
  return r;
};
