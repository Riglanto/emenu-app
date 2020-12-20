import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';

import { generateMenuHtml, invalidate, upload } from '../aptils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(403).end();
  }

  if (req.method === "POST") {
    const { title, sections } = req.body;
    const domain = "test";
    const menu = await generateMenuHtml(domain, title, sections);
    await upload(domain, menu)
    const invalidationId = await invalidate(domain)
    res.status(201).json({ invalidationId });
  }
}