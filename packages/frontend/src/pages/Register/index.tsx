import { Form, Typography, Y } from "@poodna/design-system/src";
import { FetchImage } from "random-image-unsplash";
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
              const r = await apiCall(p);

              localStorage.setItem("userId", r.item.id);
              let from = appStore.queryStr()["from"];
              if (from) {
                appStore.push(decodeURIComponent(from));
              } else {
                appStore.push("/create_room");
              }

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
                choices: async (d) => {
                  const urls = [
                    `https://images.unsplash.com/photo-1616684893808-e5ba8ba5dace?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218fHx8fHx8fHwxNjE5MDU3Mzk4&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400`,
                    `https://images.unsplash.com/photo-1617270376844-92491db13421?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218fHx8fHx8fHwxNjE5MDU3Mzk4&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400`,
                    `https://images.unsplash.com/photo-1618877818190-82adb4145d9e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218fHx8fHx8fHwxNjE5MDU3Mzk4&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400`,
                    `https://images.unsplash.com/photo-1618865262495-63e18cf5d8fe?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218fHx8fHx8fHwxNjE5MDU3Mzk4&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400`,
                    `https://images.unsplash.com/photo-1618908389772-d5009c162a98?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218fHx8fHx8fHwxNjE5MDU3Mzk4&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400`,
                    `https://images.unsplash.com/photo-1618845899551-73fa29f3e9f3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218fHx8fHx8fHwxNjE5MDU3Mzk4&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400`,
                    `https://images.unsplash.com/photo-1618498053401-d7f65ed84a88?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218fHx8fHx8fHwxNjE5MDU3Mzk4&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400`,
                    `https://images.unsplash.com/photo-1618572159535-5fe15f95fbe1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218fHx8fHx8fHwxNjE5MDU3Mzk4&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=400`,
                  ];

                  return urls.map((dd) => ({ value: dd }));
                },
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
