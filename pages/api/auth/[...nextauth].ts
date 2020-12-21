import NextAuth, { InitOptions } from 'next-auth'
import Adapter from '~/modules/auth/adapter'
import Providers from 'next-auth/providers'
import authorize from '../../../modules/auth/authorize'
import { getUserByEmail } from '~/modules/auth/user'

const options: InitOptions = {
    providers: [
        // Providers.Apple({
        //     clientId: process.env.APPLE_ID,
        //     clientSecret: process.env.APPLE_SECRET
        // }),
        Providers.Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
        // Sign in with passwordless email link
        Providers.Email({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD
                }
            },
            from: process.env.EMAIL_FROM,
        }),
        Providers.Credentials({
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "user@example.com" },
                password: { label: "Password", type: "password" },
            },
            authorize
        })

    ],
    session: {
        jwt: true
    },
    callbacks: {
        /**
         * @param  {object}  token     Decrypted JSON Web Token
         * @param  {object}  user      User object      (only available on sign in)
         * @param  {object}  account   Provider account (only available on sign in)
         * @param  {object}  profile   Provider profile (only available on sign in)
         * @param  {boolean} isNewUser True if new user (only available on sign in)
         * @return {object}            JSON Web Token that will be saved
         */
        jwt: async (token, user, account, profile, isNewUser) => {
            if (account?.type === 'email') { // email provider was used to a session.
                const realUser = await getUserByEmail(user.email)
                console.table([realUser, user])
                token.setPassword = !realUser.password
            }
            return Promise.resolve(token)
        },
        session: async (session, token) => {
            session['setPassword'] = token['setPassword']
            return session
        },
    },
    // adapter: Adapter.Adapter({}),
    database: process.env.DATABASE_URL,
    secret: process.env.APP_SECRET || 'secret',
    debug: true
}

export default (req, res) => NextAuth(req, res, options)