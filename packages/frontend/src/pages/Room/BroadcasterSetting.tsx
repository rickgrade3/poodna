import { Avatar, Form, Typography } from "@poodna/design-system/src";
import React from "react";
import api from "src/api";
interface Fields {
  braodcasters: string[];
}
const { Form: F } = Form<Fields>();
export default (p: { roomId: string }) => {
  return (
    <>
      <F
        {...{
          variant: ["box"],
          initialValue: {
            braodcasters: [],
          },
          header: "Pick friends that will forward sounds to the others",
          ctaFloating: true,
          submit: {
            onClick: async (p) => {
              return true;
            },
          },
          steps: [
            [
              {
                component: "MULTI_SELECT_ITEM",
                field: "braodcasters",
                choices: async () => {
                  return await new Promise((resolve) => {
                    api.ChatRoom.list_mainloop
                      .execute({ id: p.roomId })
                      .then((d) => {
                        console.log("d", d);
                        resolve(
                          d.list.map((d) => ({
                            label: d.name,
                            value: d.id,
                            decoration: <Avatar src={d.avatar} />,
                          }))
                        );
                      });
                  });
                },
                value: async (d, choices) =>
                  d.braodcasters.map((d) => ({ value: d })),
              },
            ],
          ],
        }}
      />
    </>
  );
};
