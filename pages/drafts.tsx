import React from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import Layout from '../components/Layout';
import Post, { PostProps } from '../components/Post';
import prisma from '../lib/prisma';
import { authOptions } from './api/auth/[...nextauth]';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, res } = ctx;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.statusCode = 403;

    return {
      props: {
        draft: [],
      },
    };
  }

  const drafts = await prisma.post.findMany({
    where: {
      author: {
        email: session.user.email,
      },
      published: false,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    props: {
      drafts,
    },
  };
};

type DraftsProps = {
  drafts: PostProps[];
}

const Drafts: React.FC<DraftsProps> = (props) => {
  const { data: session } = useSession();

  const css = `
    .post {
      background: var(--geist-background);
      transition: box-shadow 0.1s ease-in;
    }

    .post:hover {
      box-shadow: 1px 1px 3px #aaa;
    }

    .post + .post {
      margin-top: 2rem;
    }
  `;

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Drafts</h1>
        <main>
          {props.drafts.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{css}</style>
    </Layout>
  );
};

export default Drafts;