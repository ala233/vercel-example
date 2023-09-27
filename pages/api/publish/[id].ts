import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "../../../lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const postId = typeof (req.query.id) !== 'string' ? req.query.id[0] : req.query.id;

  const post = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      published: true,
    },
  });

  res.json(post);
}

export default handler;