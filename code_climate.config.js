// code_climate.config.js
module.exports = [
    {
      files: ["project/**/*.js", "project/**/*.html", "project/**/*.css"],
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
