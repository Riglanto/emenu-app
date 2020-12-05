import "reflect-metadata";
import { Connection, ConnectionOptions, createConnection, getConnectionOptions } from "typeorm";
import { User } from "./entity/User.entity";

let _conn: Connection = null

export async function getConnection() {
    const conf = await getConnectionOptions()
    const registered: ConnectionOptions = {
        ...conf,
        type: 'postgres',
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT),
        database: process.env.PGDATABASE,
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        schema: process.env.PGSCHEMA,
        entities: [User]}
    if (!_conn) _conn = await createConnection(registered)
    return _conn
}
