import { User } from '~/modules/models/User.entity'
import { serverClient, q, Idx } from '..';

function getBy(index: Idx, value: string) {
	return q.Let(
		{
			ref: q.Match(q.Index(index), value),
		},
		q.If(q.Exists(q.Var('ref')), q.Select('data', q.Get(q.Var('ref'))), null),
	)
}

export async function getUserFromSession(session: any): Promise<User> {
	return serverClient.query(getBy(Idx.USERS_ID, session.user.id))
}

export async function getUserByEmail(email: string): Promise<User> {
	return serverClient.query(getBy(Idx.USERS_EMAIL, email))
}

export async function putUser(u: User): Promise<User> {
	const ref = q.Select(['ref'], q.Get(q.Match(q.Index(Idx.USERS_ID), u.id)))
	const query = q.Replace(ref, {data: u})
	return serverClient.query<User>(query)
}