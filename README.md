# Setting up the project

1. Create a `.env.local` file with the following structure:

```sh
NEXTAUTH_URL=<value>
GOOGLE_ID=<value>
GOOGLE_SECRET=<value>
EMAIL_SERVER_USER=<value>
EMAIL_SERVER_PASSWORD=<value>
EMAIL_SERVER_HOST=<value>
EMAIL_SERVER_PORT=<value>
EMAIL_FROM=<value>
DATABASE_URL=<value>
FAUNADB_SECRET_KEY=<value>
```

2. Install the dependenciees:
```sh
yarn install
```
3. Start a dev server:
```sh
yarn dev
```
