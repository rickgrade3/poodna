import { Avatar, Form, Typography } from "@poodna/design-system/src";
import React from "react";
import api from "src/api";
interface Fields {
  braodcasters: string[];
}
const { Form: F } = Form<Fields>();
export default (p: { roomId: string; onSubmit: () => any }) => {
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
            onClick: async (x) => {
              for (const u of x.braodcasters) {
                await api.ChatRoom.add_broadcaster.execute({
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
                field: "braodcasters",
                choices: () => {
                  const { data } = api.ChatRoom.list_mainloop.hook({
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
                  d.braodcasters.map((d) => ({ value: d })),
              },
            ],
          ],
        }}
      />
    </>
  );
};
