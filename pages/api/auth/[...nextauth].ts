import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import authorize from '../../../modules/auth/authorize'

const options = {
    providers: [
        // OAuth authentication providers
        Providers.Apple({
            clientId: process.env.APPLE_ID,
            clientSecret: process.env.APPLE_SECRET
        }),
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
            from: process.env.EMAIL_FROM
        }),
        Providers.Credentials({
            name: 'credentials',
            credentials: {
                username: {label: "Email", type: "text", placeholder: "user@example.com"},
                password: {label: "Password", type: "password"},
            },
            authorize
        })

    ],
    database: {
        type: 'postgres',
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT),
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        synchronize: false
    }
}

export default (req, res) => NextAuth(req, res, options)