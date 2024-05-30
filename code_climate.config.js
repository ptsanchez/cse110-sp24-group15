// code_climate.config.js
module.exports = {
  files: ["project/**/*.js", "project/**/*.html"],
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "off",
  },
};

