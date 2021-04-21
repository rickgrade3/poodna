import { Avatar, Form, Typography } from "@poodna/design-system/src";
import React from "react";
import api from "src/api";
interface Fields {
  mainloops: string[];
}
const { Form: F } = Form<Fields>();
export default (p: { roomId: string; onSubmit: () => any }) => {
  return (
    <>
      <F
        {...{
          variant: ["box"],
          initialValue: {
            mainloops: [],
          },
          header: "Add User to Main Loop",
          ctaFloating: true,
          submit: {
            onClick: async (x) => {
              for (const u of x.mainloops) {
                await api.ChatRoom.add_mainloop.execute({
                  id: p.roomId,
                  userId: u,
                });
                await api.ChatRoom.remove_listener.execute({
                  id: p.roomId,
                  userId: u,
                });
              }
              p.onSubmit();
              return true;
            },
          },
          steps: [
            [
              {
                component: "MULTI_SELECT_ITEM_HOOK",
                field: "mainloops",
                choices: () => {
                  const { data } = api.ChatRoom.list_outsider.hook({
                    id: p.roomId,
                  });
                  return {
                    data: (data?.list || []).map((d) => ({
                      label: d.name,
                      value: d.id,
                      decoration: <Avatar src={d.avatar} />,
                    })),
                  };
                },
                value: async (d, choices) =>
                  d.mainloops.map((d) => ({ value: d })),
              },
            ],
          ],
        }}
      />
    </>
  );
};
