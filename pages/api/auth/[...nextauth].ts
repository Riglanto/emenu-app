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
                port: process.env.EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD
                }
            },
            from: process.env.EMAIL_FROM
        }),
    ],
    // SQL or MongoDB database (or leave empty)
    // database: process.env.DATABASE_URL
    database: {
        type: 'postgres',
        host: 'emenudb.ccmqyjkj1lkp.us-east-1.rds.amazonaws.com',
        port: 5432,
        username: 'postgres',
        password: 'sO$036am&W^9Nkjn',
        database: 'emenu',
        synchronize: true
    }
}

export default (req, res) => NextAuth(req, res, options)