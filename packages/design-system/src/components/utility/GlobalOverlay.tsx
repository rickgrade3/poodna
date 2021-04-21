import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { ReactElement, useContext, useEffect, useState } from "react";
import { IoChevronBack, IoClose } from "react-icons/io5";
import { icons } from "react-icons/lib";
import { Button, Typography } from "../..";
import { X, Y } from "../Layout/Layout";

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
const MyUseOverlay = () => {
  const [overlays, setOverlays] = useState<OverlayModel[]>([]);
  console.log("overlays", overlays);
  return {
    overlays,
    setOverlays,
    hideOverlay: (id: string) => {
      console.log("hideOverlay");
      setOverlays([...overlays.filter((o) => o.id !== id)]);
    },
    showOverlay: (ov: OverlayModel) => {
      setOverlays([...overlays, ov]);
    },
  };
};
const OverlayContext = React.createContext<ReturnType<typeof MyUseOverlay>>(
  undefined
);

const Drawer = (p: OverlayModel) => {
  const r = useOverlay();

  return (
    <motion.div
      initial={"pageInitial"}
      animate="pageAnimate"
      exit="pageExit"
      style={{
        zIndex: 99,
        position: "fixed",
        left: 0,
        width: "100%",
        top: 0,
        height: "100%",
        overflow: "auto",
        display: "flex",
        alignItems: "center",
      }}
      transition={{
        type: "spring",
        bounce: 0,
        duration: 0.75,
      }}
      variants={{
        pageInitial: {
          background: "rgba(0,0,0,0)",
        },
        pageAnimate: {
          background: "rgba(0,0,0,0.5)",
        },
        pageExit: {
          background: "rgba(0,0,0,0)",
        },
      }}
    >
      <div
        onClick={() => {
          console.log(p);
          r.hideOverlay(p.id);
        }}
        style={{
          position: "absolute",
          left: 0,
          width: "100%",
          top: 0,
          height: "100%",
          overflow: "auto",
        }}
      ></div>
      <motion.div
        initial={"pageInitial"}
        animate="pageAnimate"
        exit="pageExit"
        style={{
          width: "100%",
          position: "relative",
        }}
        transition={{
          type: "spring",
          bounce: 0,
          duration: 0.75,
        }}
        variants={{
          pageInitial: {
            transform: "translate(100%,0px)",
          },
          pageAnimate: {
            transform: "translate(0%,0px)",
          },
          pageExit: {
            transform: "translate(100%,0px)",
          },
        }}
      >
        <Y
          style={{
            margin: "auto",
            position: "relative",
            height: "100vh",
            overflow: "auto",
          }}
          gap={10}
          p={2}
          variant={["light"]}
          align="start"
          justify="start"
        >
          <X justify="start">
            <Button
              variant="text"
              full={false}
              onClick={() => {
                r.hideOverlay(p.id);
              }}
            >
              <IoChevronBack style={{ width: "2rem", height: "2rem" }} />
            </Button>
            <Typography variant="heading" size="text_2xl">
              {p.title}
            </Typography>
          </X>
          <div>
            {p.content({
              back: () => {
                r.hideOverlay(p.id);
              },
            })}
          </div>
          <X
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              boxShadow: "0px 0px 8px #00000061",
            }}
            variant={["box", "light", "rounded"]}
          >
            <Button
              onClick={async () => {
                if (p.onCancel) {
                  await p.onCancel();
                }
                r.hideOverlay(p.id);
              }}
              variant="dim"
              style={{ width: 200 }}
            >
              {p.cancelText || "Cancel"}
            </Button>
            <Button
              onClick={async () => {
                if (p.onSubmit) {
                  await p.onSubmit();
                }
                r.hideOverlay(p.id);
              }}
              variant="primary"
            >
              {p.submitText || "Submit"}
            </Button>
          </X>
        </Y>
      </motion.div>
    </motion.div>
  );
};
const Modal = (p: OverlayModel) => {
  const r = useOverlay();

  return (
    <motion.div
      initial={"pageInitial"}
      animate="pageAnimate"
      exit="pageExit"
      style={{
        zIndex: 99,
        position: "fixed",
        left: 0,
        width: "100%",
        top: 0,
        height: "100%",
        overflow: "auto",
        display: "flex",
        alignItems: "center",
      }}
      transition={{
        type: "spring",
        bounce: 0,
        duration: 0.75,
      }}
      variants={{
        pageInitial: {
          background: "rgba(0,0,0,0)",
        },
        pageAnimate: {
          background: "rgba(0,0,0,0.5)",
        },
        pageExit: {
          background: "rgba(0,0,0,0)",
        },
      }}
    >
      <div
        onClick={() => {
          console.log(p);
          r.hideOverlay(p.id);
        }}
        style={{
          position: "absolute",
          left: 0,
          width: "100%",
          top: 0,
          height: "100%",
          overflow: "auto",
        }}
      ></div>
      <motion.div
        initial={"pageInitial"}
        animate="pageAnimate"
        exit="pageExit"
        style={{
          width: "100%",
          position: "relative",
        }}
        transition={{
          type: "spring",
          bounce: 0,
          duration: 0.75,
        }}
        variants={{
          pageInitial: {
            opacity: 0,
            transform: "translate(0,-20px)",
          },
          pageAnimate: {
            opacity: 1,
            transform: "translate(0,0px)",
          },
          pageExit: {
            opacity: 0,
            transform: "translate(0,-20px)",
          },
        }}
      >
        <Y
          style={{ margin: "auto" }}
          gap={10}
          variant={["box", "light", "rounded", "page-wrapper"]}
        >
          <X justify="between">
            <Typography variant="heading" size="text_2xl">
              {p.title}
            </Typography>
            <Button
              variant="text"
              full={false}
              onClick={() => {
                r.hideOverlay(p.id);
              }}
            >
              <IoClose style={{ width: "2rem", height: "2rem" }} />
            </Button>
          </X>
          <div>
            {p.content({
              back: () => {
                r.hideOverlay(p.id);
              },
            })}
          </div>
          <X>
            <Button
              onClick={async () => {
                if (p.onCancel) {
                  await p.onCancel();
                }
                r.hideOverlay(p.id);
              }}
              variant="dim"
              style={{ width: 200 }}
            >
              {p.cancelText || "Cancel"}
            </Button>
            <Button
              onClick={async () => {
                if (p.onSubmit) {
                  await p.onSubmit();
                }
                r.hideOverlay(p.id);
              }}
              variant="primary"
            >
              {p.submitText || "Submit"}
            </Button>
          </X>
        </Y>
      </motion.div>
    </motion.div>
  );
};

export default (p: { children: ReactElement }) => {
  const r = MyUseOverlay();
  return (
    <OverlayContext.Provider value={r}>
      {p.children}
      <AnimatePresence>
        {r.overlays.map((ov) => {
          if (ov.variant === "DRAWER") {
            return <Drawer {...ov} />;
          } else {
            return <Modal {...ov} />;
          }
        })}
      </AnimatePresence>
    </OverlayContext.Provider>
  );
};
export const useOverlay = () => {
  const r = useContext(OverlayContext);
  return r;
};
