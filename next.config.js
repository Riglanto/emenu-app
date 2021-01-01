const { nextI18NextRewrites } = require('next-i18next/rewrites');

const localeSubpaths = {
    'en': 'en',
    'pl': 'pl'
}

module.exports = {
    target: "experimental-serverless-trace",
    rewrites: async () => nextI18NextRewrites(localeSubpaths),
    publicRuntimeConfig: {
        localeSubpaths
    }
};
