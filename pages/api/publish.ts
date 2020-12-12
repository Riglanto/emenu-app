import { NextApiRequest, NextApiResponse } from 'next'
import { generateMenuHtml, invalidate, upload } from './aptils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { title, sections } = req.body;
    const domain = "test";
    const menu = generateMenuHtml(domain, title, sections);
    await upload(domain, menu)
    await invalidate(domain)
    res.status(201).end();
  }
}