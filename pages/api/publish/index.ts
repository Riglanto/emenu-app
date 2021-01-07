import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import faunadb from "faunadb";
import * as Sentry from "@sentry/node";

import { generateMenuHtml, getUserData, invalidate, upload } from '../aptils';
import { differenceInMinutes } from 'date-fns';
import { PUBLISH_LOCK } from '~/utils';

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY });
const q = faunadb.query;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).end();
  }

  if (req.method === "POST") {
    const { title, sections } = req.body;
    const { email } = session.user;
    if (!email) {
      throw "No email for user";
    }
    const data = await getUserData(client, email);
    const { domain, lastPublished, isPremium } = data;

    if (!isPremium && differenceInMinutes(Date.now(), lastPublished) < PUBLISH_LOCK) {
      return res.status(403).end();
    }

    await client.query(
      q.Update(q.Select('ref', q.Get(q.Match(q.Index("users_by_email"), email))),
        { data: { lastPublished: Date.now() } })
    )

    const menu = await generateMenuHtml(domain, title, sections);

    await upload(domain, menu)
    const invalidationId = await invalidate(domain)
    res.status(201).json({ invalidationId });
  }
}