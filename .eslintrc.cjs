module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["standard", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    indent: ["error", 2],
    "comma-dangle": ["error", "always-multiline"],
    camelcase: "off",
    "object-curly-spacing": [
      "error",
      "always",
      {
        arraysInObjects: false,
      },
    ],
  },
};
