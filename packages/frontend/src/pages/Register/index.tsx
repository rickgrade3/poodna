import { Form, Typography } from "@poodna/design-system/src";
import api from "src/api";
import { appStore } from "src/stores/appStore";
const apiCall = api.User.create.execute;
type Fields = Parameters<typeof apiCall>[0];

const { Form: _Form } = Form<Fields>();
export default () => {
  return (
    <>
      <_Form
        {...{
          initialValue: {
            name: "",
            avatar: "",
          },
          headers: ["Get started", "Choose your avatar"],
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
