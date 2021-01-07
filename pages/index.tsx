import Head from "next/head";
import { GetServerSideProps } from "next";
import {
  getSession,
  useSession
} from 'next-auth/client'

import Layout, { siteTitle } from "~/components/layout";
import Builder from "~/components/builder";
import * as api from "~/api"

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getSession(context)
  const data = session ? await api.initialFetchSections({ headers: { cookie: context.req.headers.cookie } }) : null;

  if (session?.['setPassword']) {
    const { res } = context
    res.writeHead(302, {Location: '/set-password'})
    res.end()
    return {props: {}}
  }
  else
    return {
      props: { session, data }
    }
}

type Props = {
  notify: (text: string, delay?: number) => void
  data: any
}

export default function Home({ notify, data }: Props) {
  const [session, loading] = useSession()
  return (
    <Layout loggedIn={!!session} domain={!!session && data?.domain}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Builder loggedIn={!!session} notify={notify} data={data} />
    </Layout>
  );
}

