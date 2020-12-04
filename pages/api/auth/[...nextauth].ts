import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

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
                username: {label: "Username", type: "text", placeholder: "John Smith"},
                password: {label: "Password", type: "password"},
            }
            authorize: async (credentails) => {
                
                return null
            }
        })

    ],
    database: {
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME,
        synchronize: true
    }
}

export default (req, res) => NextAuth(req, res, options)