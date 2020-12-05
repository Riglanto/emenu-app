module.exports = {
    type: 'postgres',
   "host": process.env.PGHOST,
   "port": Number(process.env.PGPORT),
   "database": process.env.PGDATABASE,
   "username": process.env.PGUSER,
   "password": process.env.PGPASSWORD,
   "schema": process.env.PGSCHEMA || "public",
   "synchronize": false,
   "logging": false,
   "entities": [
      "**/*.entity",
   ],
   "migrations": [
      "db/migration/**/*.js"
   ],
   "subscribers": [
      "db/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "./db/entity",
      "migrationsDir": "./db/migration",
      "subscribersDir": "./db/subscriber"
   }
}