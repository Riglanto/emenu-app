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

type Props = {
  notify: (text: string, delay?: number) => void
}

export default function Home({ notify }: Props) {
  const [session, loading] = useSession()
  return (
    <Layout loggedIn={!!session}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Builder notify={notify} />
    </Layout>
  );
}

