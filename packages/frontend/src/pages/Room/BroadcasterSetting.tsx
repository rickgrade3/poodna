import { Form, Typography } from "@poodna/design-system/src";
interface Fields {
  braodcasters: string[];
}
const { Form: F } = Form<Fields>();
export default () => {
  return (
    <>
      <F
        {...{
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
                choices: async (d) => [],
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
