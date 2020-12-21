import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/client";
import faunadb from "faunadb";

import { getSections } from "../../components/sections"

const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY });

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(403).end();
  }

  const id = '2841004626285696072';
  if (req.method === "GET") {
    const result: any = await client.query(
      q.Get(q.Ref(q.Collection('sections'), id))
    )
    res.status(200).json(result.data);
  } else if (req.method === "POST") {
    const { title, sections } = req.body;
    const result = await client.query(q.Let({
      match: q.Ref(q.Collection('sections'), id),
      data: { data: { title, sections, lastUpdated: Date.now() } }
    },
      q.If(
        q.Exists(q.Var('match')),
        q.Update(q.Var('match'), q.Var('data')),
        q.Create(q.Var('match'), q.Var('data'))
      )
    ))
    res.status(201).end();
  }

  // const session = await getSession({ req });
  // if (session) {
  //   res.end(
  //     `Welcome to the VIP club, ${session.user.name || session.user.email}!`
  //   );
  // } else {
  //   res.statusCode = 403;
  //   res.end("Hold on, you're not allowed in here!");
  // }
}