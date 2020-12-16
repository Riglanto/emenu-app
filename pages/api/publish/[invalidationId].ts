import { NextApiRequest, NextApiResponse } from 'next'
import { getInvalidationStatus } from '../aptils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { invalidationId } = req.query;
    const status = await getInvalidationStatus(invalidationId as string)
    res.status(200).json({ status });
  }
}