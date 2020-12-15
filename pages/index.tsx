import Head from "next/head";
import { GetServerSideProps } from "next";
import {
  getSession,
  useSession
} from 'next-auth/client'

import Layout, { siteTitle } from "~/components/layout";
import Builder from "~/components/builder";

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getSession(context)
  if (session?.['setPassword'])
    return {
      props: {},
      redirect: { destination: '/set-password' }
    }
  else
    return {
      props: {}
    }
}

export default function Home() {
  const [session, loading] = useSession()

  return (
    <Layout loggedIn={!!session}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Builder />
    </Layout>
  );
}

