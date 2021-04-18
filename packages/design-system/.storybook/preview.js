import "../src/index.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: "dark",
    values: [
      {
        name: "dark",
        value: "#000",
      },
      {
        name: "light",
        value: "#fff",
      },
    ],
  },
};
