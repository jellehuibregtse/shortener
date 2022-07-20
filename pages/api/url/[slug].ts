import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../db/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query['slug'];

  if (!slug || typeof slug !== 'string') {
    res.statusCode = 400;
    return res.send(JSON.stringify({ message: 'Please specify a slug.' }));
  }

  const data = await prisma.shortLink.findFirst({
    where: {
      slug,
    },
  });

  if (!data) {
    res.statusCode = 404;
    return res.send(JSON.stringify({ message: 'Slug not found.' }));
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1000000000, stale-while-revalidate');

  return res.json(data);
};
