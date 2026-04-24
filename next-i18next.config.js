const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "es", // idioma por defecto
    locales: ["en", "es"], // idiomas soportados
  },
  localePath: path.resolve("./public/locales"),
};
