import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client';

import { getInvalidationStatus } from '../aptils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(403).end();
  }

  if (req.method === "GET") {
    const { invalidationId } = req.query;
    const status = await getInvalidationStatus(invalidationId as string)
    res.status(200).json({ status });
  }
}