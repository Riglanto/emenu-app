import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';


import { setPassword } from '~/modules/auth/password';
import { getUserByEmail, getUserFromSession } from '~/modules/auth/user';
import { getToken } from 'next-auth/jwt';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });
	if (req.method != 'POST') {
		res.setHeader('Allow', [ 'POST' ]);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
	if (!session) {
		res.statusCode = 400;
		return res.end("You're not logged in.");
	}
	const token = await getToken({req, secret: process.env.APP_SECRET || 'secret'})
	try {
		const user = await setPassword(await getUserByEmail(token['email']), req.body);
		delete token['setPassword']
		res.status(200);
		
		return res.json(user);
	} catch (e) {

		res.status(422);
		return res.json(e);
	}
};
