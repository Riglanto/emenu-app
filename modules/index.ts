import faunadb, { query } from 'faunadb';
import { Account } from './models/Account.entity';
import { Session } from './models/Session.entity';
import { User } from './models/User.entity';
import { VerificationRequest } from './models/VerificationRequest.entity';

export function getFaunaClient() {
	const secret = process.env.FAUNADB_SECRET_KEY
	if (!secret) {
		throw Error('fauna secret key is not provided. Set "FAUNADB_SECRET_KEY" env variable')
	}
	return new faunadb.Client({ secret })
}

export const q = query;

export enum Idx {
	USERS_ID = 'index_users_id',
	USERS_EMAIL = 'index_users_email',
	USERS_ACCOUNT_ID_PROVIDER_ID = 'index_accounts_providerId_providerAccountId',
	VERIFICATION_REQUESTS_TOKEN = 'index_verificationRequests_token',
	SESSIONS_ID = 'index_sessions_id',
	SESSIONS_SESSION_TOKEN = 'index_sessions_sessionToken'
}

async function createCollection(name: string) {
	const q = query.If(query.Exists(query.Collection(name)), null, query.CreateCollection({ name }))
	return getFaunaClient().query(q).then(() => console.log('created collection: ' + name))
}

async function createIndex<T extends {}>(name: string, col: string, terms: Array<keyof T>) {
	const queryIndex = query.CreateIndex({
		name,
		source: query.Collection(col),
		terms: terms.map((t) => ({ field: ['data', t] }))
	})
	const q = query.If(query.Exists(query.Index(name)), null, queryIndex)
	return getFaunaClient().query(q).then(() => console.log(`created index ${name} on collection ${col}`))
}

export async function setupSchema() {
	await Promise.all([
		createCollection('users'),
		createCollection('accounts'),
		createCollection('sessions'),
		createCollection('verificationRequests')
	]);

	await createIndex<User>(Idx.USERS_ID, 'users', ['id'])
	await createIndex<User>(Idx.USERS_EMAIL, 'users', ['email'])
	await createIndex<Account>(Idx.USERS_ACCOUNT_ID_PROVIDER_ID, 'accounts', ['id', 'providerId'])
	await createIndex<VerificationRequest>(Idx.VERIFICATION_REQUESTS_TOKEN, 'verificationRequests', ['token'])
	await createIndex<Session>(Idx.SESSIONS_ID, 'sessions', ['id'])
	await createIndex<Session>(Idx.SESSIONS_SESSION_TOKEN, 'sessions', ['sessionToken'])
	console.info('Setup done.');
}