import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/client";
import faunadb from "faunadb";

const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY });

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(403).end();
  }
  const { email } = session.user;
  if (req.method === "GET") {
    try {
      const search: any = await client.query(q.Map(
        q.Paginate(q.Match(q.Index("users_by_email"), email)),
        q.Lambda(["ref"], q.Get(q.Var("ref")))
      ))
      console.log(search)
      if (search.data.length > 0) {
        return res.status(200).json(search.data[0].data);
      }
    } catch (e) {
      console.log(e)
    }
    return res.status(404).end();
  } else if (req.method === "POST") {
    const { title, sections } = req.body;
    const result = await client.query(q.Let({
      match: q.Match(q.Index("users_by_email"), email),
      data: { data: { title, sections, lastUpdated: Date.now(), email } }
    },
      q.If(
        q.Exists(q.Var('match')),
        q.Update(q.Select('ref', q.Get(q.Var('match'))), q.Var('data')),
        q.Create(q.Collection('sections'), q.Var('data'))
      )
    ))
    res.status(201).end();
  }
}