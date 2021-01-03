import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/client";
import faunadb from "faunadb";

import { getUserData } from './aptils';

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
      if (search.data.length > 0) {
        const result = search.data[0].data;
        return res.status(200).json({
          title: result.title,
          sections: result.sections,
          domain: result.domain,
          lastPublished: result.lastPublished,
          lastUpdated: result.lastUpdated,
          isPremium: result.isPremium
        })
      }
    } catch (e) {
      // console.log(e)
    }
    return res.status(404).end();
  } else if (req.method === "POST") {
    const { title, sections, domain } = req.body;

    if (domain) {
      const userData = await getUserData(client, email)
      if (userData?.domain) {
        console.warn(`Domain already set to ${userData.domain}.`)
        return res.status(403).end();
      }
      const searchDomain: any = await client.query(q.Map(
        q.Paginate(q.Match(q.Index("users_by_domain"), domain)),
        q.Lambda(["ref"], q.Get(q.Var("ref")))
      ))
      if (searchDomain.data.length > 0) {
        console.warn("User with domain exists.")
        return res.status(403).end();
      }

      const searchSignup: any = await client.query(q.Map(
        q.Paginate(q.Match(q.Index("signups_by_domain"), domain)),
        q.Lambda(["ref"], q.Get(q.Var("ref")))
      ))
      if (searchSignup.data.length > 0) {
        console.warn("Signup with domain exists.")
        return res.status(403).end();
      }
    }

    const result = await client.query(q.Let({
      match: q.Match(q.Index("users_by_email"), email),
      data: { data: { title, sections, domain, lastUpdated: Date.now(), email } }
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