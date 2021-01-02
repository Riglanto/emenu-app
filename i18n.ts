import NextI18Next from "next-i18next";
const { localeSubpaths } = require("next/config").default().publicRuntimeConfig;
import path from "path";

const debug = process.env.NODE_ENV !== "production";

const defaultLanguage = "en";
const otherLanguages = ["pl"];
export const allLanguages = [defaultLanguage, ...otherLanguages];

const nextI18Next = new NextI18Next({
  defaultLanguage,
  otherLanguages,
  debug,
  localeSubpaths: localeSubpaths as Record<string, string>,
  localePath: path.resolve("./public/locales"),
});

export const { Trans, Link, useTranslation, appWithTranslation, i18n } = nextI18Next;

export default i18n;
