import { User } from '~/modules/models/User.entity'
import { client } from '../index';

async function getBy(field: '_id' | 'email', value: string) {
	const db = (await client)
	return db.collection('users').findOne<User>({[field]: value})
}

export async function getUserFromSession(session: any): Promise<User> {
	return getBy('_id', session.user.id)
}

export async function getUserByEmail(email: string): Promise<User> {
	return getBy('email', email)
}

export async function putUser(u: User): Promise<User> {
	const db = await client
	const filter = {_id: u._id}
	await db.collection('users').replaceOne(filter, u)
	return u
}