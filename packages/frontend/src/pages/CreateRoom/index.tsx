import { Form, Typography } from "@poodna/design-system/src";
import api from "src/api";
import { appStore } from "src/stores/appStore";
const apiCall = api.ChatRoom.create.execute;
type Fields = Parameters<typeof apiCall>[0];
const { Form: _Form } = Form<Fields>();
export default () => {
  return (
    <>
      <_Form
        {...{
          initialValue: {
            title: "",
            ownerId: appStore.user.id || "",
            name: "",
            maximum: 100,
            auto_pick_broadcaster: true,
          },
          header: "Start The Room",
          submit: {
            onClick: async (p) => {
              const r = await apiCall(p);
              await api.ChatRoom.add_mainloop.execute({
                id: r.item.id || "",
                userId: appStore.user.id,
              });
              appStore.push(`/room/${r.item.id}`);
              return true;
            },
          },
          steps: [
            [
              "Enter room name",
              {
                component: "TEXT",
                label: "Enter room name",
                field: "title",
                placeholder: "Enter room name",
                value: async (d) => d.title,
              },
              "Total user in main loop",
              {
                component: "NUMBER_SLIDER",
                label: "Total user in main loop",
                field: "maximum",
                value: async (d) => d.maximum,
              },
              "Auto pick broadcaster",
              {
                component: "YES_NO",
                label: "Auto pick broadcaster",
                field: "auto_pick_broadcaster",
                value: async (d) => d.auto_pick_broadcaster,
              },
            ],
          ],
        }}
      />
    </>
  );
};
