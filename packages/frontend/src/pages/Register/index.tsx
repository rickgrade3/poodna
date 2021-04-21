import { Form, Typography, Y } from "@poodna/design-system/src";
import React from "react";
import api from "src/api";
import Logo from "src/components/Logo";
import { appStore } from "src/stores/appStore";
const apiCall = api.User.create.execute;
type Fields = Parameters<typeof apiCall>[0];

const { Form: F } = Form<Fields>();
export default () => {
  return (
    <>
      <F
        {...{
          initialValue: {
            name: "",
            avatar: "",
          },
          headers: ["Get started", "Choose your avatar"].map((v) => {
            return (
              <Y justify="center" gap={4} align="center">
                <Logo />
                <Typography
                  className="text-center"
                  size="text_4xl"
                  variant="heading"
                >
                  {v}
                </Typography>
              </Y>
            );
          }),
          submit: {
            onClick: async (p) => {
              console.log(p);
              const r = await apiCall(p);
              console.log(r);
              localStorage.setItem("userId", r.item.id);
              appStore.push("/create_room");

              return true;
            },
          },
          steps: [
            [
              {
                component: "TEXT",
                widthPercent: 100,
                field: "name",
                placeholder: "Enter your name",
                value: async (d) => d.name,
              },
            ],
            [
              {
                component: "AVATAR_SELCTOR",
                field: "avatar",
                value: async (d, choices) => ({ value: d.avatar }),
              },
            ],
          ],
        }}
      />
    </>
  );
};
