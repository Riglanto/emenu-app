import "reflect-metadata"
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/client";

import signup from '~/modules/auth/signup'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (req.method != "POST") {
    res.setHeader('Allow', ['GET', 'PUT'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  if (session) {
    res.statusCode = 400;
    return res.end("You're already logged in.");
  }
  try {
    const user = await signup(req.body)
    res.status(201)
    return res.json(user)
  } catch(e) {
    if (e.code == '23505') { // duplicate
      res.status(400)
      return res.json({error: 'User with this email aldready exists.'})
    }

    res.status(422)
    return res.json(e)
  }
}