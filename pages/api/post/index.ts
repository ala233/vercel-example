// import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '../../../lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, content } = req.body;
  const session = await getServerSession(req, res, authOptions);
  const result = await prisma.post.create({
    data: {
      title,
      content,
      author: {
        connect: {
          email: session?.user?.email,
        },
      },
    },
  });

  res.json(result);
}

export default handler;
