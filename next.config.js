const { nextI18NextRewrites } = require('next-i18next/rewrites');
const withSourceMaps = require('@zeit/next-source-maps')();
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const {
    NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
    SENTRY_ORG,
    SENTRY_PROJECT,
    SENTRY_AUTH_TOKEN,
    NODE_ENV,
    VERCEL_GITHUB_COMMIT_SHA,
    VERCEL_GITLAB_COMMIT_SHA,
    VERCEL_BITBUCKET_COMMIT_SHA,
} = process.env

const COMMIT_SHA =
    VERCEL_GITHUB_COMMIT_SHA ||
    VERCEL_GITLAB_COMMIT_SHA ||
    VERCEL_BITBUCKET_COMMIT_SHA

const localeSubpaths = {
    'pl': 'pl'
}

process.env.SENTRY_DSN = SENTRY_DSN

module.exports = withSourceMaps({
    target: "experimental-serverless-trace",
    rewrites: async () => nextI18NextRewrites(localeSubpaths),
    publicRuntimeConfig: {
        localeSubpaths
    },
    productionBrowserSourceMaps: true,
    env: {
        // Make the COMMIT_SHA available to the client so that Sentry events can be
        // marked for the release they belong to. It may be undefined if running
        // outside of Vercel
        NEXT_PUBLIC_COMMIT_SHA: COMMIT_SHA,
    },
    webpack: (config, options) => {
        // In `pages/_app.js`, Sentry is imported from @sentry/browser. While
        // @sentry/node will run in a Node.js environment. @sentry/node will use
        // Node.js-only APIs to catch even more unhandled exceptions.
        //
        // This works well when Next.js is SSRing your page on a server with
        // Node.js, but it is not what we want when your client-side bundle is being
        // executed by a browser.
        //
        // Luckily, Next.js will call this webpack function twice, once for the
        // server and once for the client. Read more:
        // https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
        //
        // So ask Webpack to replace @sentry/node imports with @sentry/browser when
        // building the browser's bundle
        if (!options.isServer) {
            config.resolve.alias['@sentry/node'] = '@sentry/browser'
        }

        // Define an environment variable so source code can check whether or not
        // it's running on the server so we can correctly initialize Sentry
        config.plugins.push(
            new options.webpack.DefinePlugin({
                'process.env.NEXT_IS_SERVER': JSON.stringify(
                    options.isServer.toString()
                ),
            })
        )

        // When all the Sentry configuration env variables are available/configured
        // The Sentry webpack plugin gets pushed to the webpack plugins to build
        // and upload the source maps to sentry.
        // This is an alternative to manually uploading the source maps
        // Note: This is disabled in development mode.
        if (
            SENTRY_DSN &&
            SENTRY_ORG &&
            SENTRY_PROJECT &&
            SENTRY_AUTH_TOKEN &&
            COMMIT_SHA &&
            NODE_ENV === 'production'
        ) {
            config.plugins.push(
                new SentryWebpackPlugin({
                    include: '.next',
                    ignore: ['node_modules'],
                    urlPrefix: `~/_next`,
                    release: COMMIT_SHA,
                })
            )
        }
        return config
    }
});
