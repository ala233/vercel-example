import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// DELETE /api/post/:id
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const postId = typeof (req.query.id) !== 'string' ? req.query.id[0] : req.query.id;

  if (req.method === 'DELETE') {
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    
    res.json(post);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`,
    );
  }
}

export default handler;
