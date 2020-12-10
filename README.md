# Setting up the project
1. Create a [FaunaDB](https://dashboard.fauna.com/accounts/register) database for local developement.

Create a database and generate API key for it.

2. Create a `.env.local` file with the following structure:

```sh
NEXTAUTH_URL=<value>
GOOGLE_ID=<value>
GOOGLE_SECRET=<value>
EMAIL_SERVER_USER=<value>
EMAIL_SERVER_PASSWORD=<value>
EMAIL_SERVER_HOST=<value>
EMAIL_SERVER_PORT=<value>
EMAIL_FROM=<value>
FAUNADB_SECRET_KEY=<value>
APP_SECRET=<value>  ## defaults to test value
```

3. Install the dependenciees:
```sh
yarn install
```
4. Apply db schema:
```sh
yarn setupSchema
```
5. Start a dev server:
```sh
yarn dev
```
