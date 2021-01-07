import { MongoClient, Db } from 'mongodb'

const CONN_URL = process.env.DATABASE_URL
export let client = new Promise<Db>((resolve, reject) => {
    MongoClient.connect(CONN_URL, function(err, client) {
        if (err !== null) return reject(err)
        console.log("Connected correctly to server")
        resolve(client.db())
      });
})
