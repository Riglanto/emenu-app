import NextI18Next from "next-i18next";
const { localeSubpaths } = require("next/config").default().publicRuntimeConfig;
import path from "path";

const debug = process.env.NODE_ENV !== "production";

const i18n = new NextI18Next({
  defaultLanguage: "en",
  otherLanguages: ["pl"],
  debug,
  localeSubpaths: localeSubpaths as Record<string, string>,
  localePath: path.resolve("./public/locales"),
});

export const { Trans, Link, useTranslation, appWithTranslation } = i18n;

export default i18n;
