# Setting up the project
1. Create a [FaunaDB](https://dashboard.fauna.com/accounts/register) database for local development.

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
AWS_ID=<value>
AWS_SECRET=<value>
AWS_CF_DISTRIBUTION_ID=<value>
APP_SECRET=<value>  ## defaults to test value
```

3. Install the dependencies:
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
