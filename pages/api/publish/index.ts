import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';
import faunadb from "faunadb";

import { generateMenuHtml, getDomainByEmail, invalidate, upload } from '../aptils';

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET_KEY });

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(403).end();
  }

  if (req.method === "POST") {
    const { title, sections } = req.body;
    const { email } = session.user;
    const domain = await getDomainByEmail(client, email);

    const menu = await generateMenuHtml(domain, title, sections);

    await upload(domain, menu)
    const invalidationId = await invalidate(domain)
    res.status(201).json({ invalidationId });
  }
}