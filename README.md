![image](https://github.com/Riglanto/emenu-app/assets/6277878/d1298d4b-e028-4565-b7b8-1035cb45fd7e)

![image](https://github.com/Riglanto/emenu-app/assets/6277878/c320678b-2a71-4ff5-8a94-4ffe69b5d4ce)

![image](https://github.com/Riglanto/emenu-app/assets/6277878/964c7139-6495-46cd-9a9f-3ceb09f3ed5f)

![image](https://github.com/Riglanto/emenu-app/assets/6277878/752f1cb4-6d0a-4cec-a0a9-72c2fb0996a3)

![image](https://github.com/Riglanto/emenu-app/assets/6277878/49e44a6d-6388-4225-97ab-439b01daa1c5)




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
