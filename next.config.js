const { nextI18NextRewrites } = require('next-i18next/rewrites');

const localeSubpaths = {
    'pl': 'pl'
}

module.exports = {
    target: "experimental-serverless-trace",
    rewrites: async () => nextI18NextRewrites(localeSubpaths),
    publicRuntimeConfig: {
        localeSubpaths
    }
};
