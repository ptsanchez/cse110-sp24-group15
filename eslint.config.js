export default [
    {
      files: ["projects/**/*.js", "projects/**/*.html"],
      languageOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
      },
      rules: {
        // Add your ESLint rules here
        "no-unused-vars": "warn",
        "no-console": "off",
      },
    },
  ];
  