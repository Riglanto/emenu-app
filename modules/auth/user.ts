import { User } from '~/modules/models/User.entity'
import { getFaunaClient, q, Idx } from '..';

function getBy(index: Idx, value: string) {
	return q.Let(
		{
			ref: q.Match(q.Index(index), value),
		},
		q.If(q.Exists(q.Var('ref')), q.Select('data', q.Get(q.Var('ref'))), null),
	)
}

export async function getUserFromSession(session: any): Promise<User> {
	return getFaunaClient().query(getBy(Idx.USERS_ID, session.user.id))
}

export async function getUserByEmail(email: string): Promise<User> {
	return getFaunaClient().query(getBy(Idx.USERS_EMAIL, email))
}

export async function putUser(u: User): Promise<User> {
	const ref = q.Select(['ref'], q.Get(q.Match(q.Index(Idx.USERS_ID), u.id)))
	const query = q.Replace(ref, {data: u})
	return getFaunaClient().query<User>(query)
}

let i = 0

setInterval(
	() => console.log('Boop!', i++)
, 2000)