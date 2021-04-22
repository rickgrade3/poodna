import { makeAutoObservable } from "mobx";
import React from "react";
/*
    Basic functionality of App
*/
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
type SnackBarTrigger = (p: {
  message: string;
  key: string;
  variant: "default" | "error" | "success" | "warning" | "info";
  autoHideDuration: number;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "center" | "left" | "right";
  };
}) => any;

type DialogTrigger<Model> = {
  show: (m: Model) => void;
  hide: (m: { id: string }) => void;
};

export class BasicAppStore<User, AppData> {
  user: User;
  overlays: OverlayModel[];
  history?: any;
  app?: AppData;
  set_app(app: AppData | null) {
    this.app = app;
  }
  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: User | null) {
    this.user = user;
  }
  set_history(history: any) {
    this.history = history;
  }
  on(event: string, callback: (d: any) => any) {
    document.addEventListener(event, (e: any) => callback(e.detail));
  }
  dispatch(event: string, data?: any) {
    document.dispatchEvent(new CustomEvent(event));
  }
  off(event: string, callback: (d: any) => any) {
    document.removeEventListener(event, callback);
  }

  noti(p: Parameters<SnackBarTrigger>[0]) {
    if (this.noti_trigger) {
      this.noti_trigger(p);
    }
  }
  noti_trigger?: SnackBarTrigger;
  set_noti_trigger(p: SnackBarTrigger) {
    this.noti_trigger = p;
  }

  error_noti(msg: string) {
    this.noti({
      message: msg,
      key: Math.random().toString(),
      variant: "error",
      autoHideDuration: 3000,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
    });
  }
  success_noti(msg: string) {
    this.noti({
      message: msg,
      key: Math.random().toString(),
      variant: "success",
      autoHideDuration: 3000,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
    });
  }
  info_noti(msg: string) {
    this.noti({
      message: msg,
      key: Math.random().toString(),
      variant: "info",
      autoHideDuration: 3000,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
    });
  }
  push(path: string) {
    if (this.history) this.history.push(path);
  }
  back() {
    if (this.history) this.history.goBack();
  }

  confirmDialog({
    title = "Are you sure?",
    description,
    onSubmit = async () => {
      return;
    },
    onCancel = async () => {
      return;
    },
    submitText,
    cancelText,
  }: {
    title: string;
    description?: string;
    onSubmit?: () => Promise<void>;
    onCancel?: () => Promise<void>;
    submitText?: string;
    cancelText?: string;
  }) {
    this.openDialog({
      title,
      description,
      onSubmit,
      onCancel,
      content: (p) => {
        return <div></div>;
      },
      submitText,
      cancelText,
    });
  }

  logout = () => {
    localStorage.clear();
    this.user = null;
    this.push("/");
  };

  dialog_trigger?: DialogTrigger<OverlayModel>;
  set_dialog_trigger(p: DialogTrigger<OverlayModel>) {
    this.dialog_trigger = p;
  }
  openDialog(props: OverlayModel) {
    this.dialog_trigger.show({ id: Math.random().toString(), ...props });
  }
  setDialogs = (overlays: OverlayModel[]) => {
    this.overlays = overlays;
  };
  hideDialog = (overlay: OverlayModel) => {
    if (overlay.id) {
      this.dialog_trigger.hide({ id: overlay.id });
    }
  };
  queryStr = () => {
    return decodeURI(window.location.search)
      .replace("?", "")
      .split("&")
      .map((param) => param.split("="))
      .reduce((values, [key, value]) => {
        values[key] = value;
        return values;
      }, {});
  };
  copyURLToClipboard = () => {
    var dummy = document.createElement("input"),
      text = window.location.href;

    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  };
}
