import Head from 'next/head'
import { Container, Nav, Navbar } from "react-bootstrap";
import { signin, signout, useSession } from 'next-auth/client';
import { useCallback } from 'react';

import styles from "~/styles/layout.module.scss";
import { httpsDomain, wwwDomain } from '~/utils';


export const siteTitle = 'EMenu'

export default function Layout({
  children,
  home,
  loggedIn,
  domain
}: {
  children: React.ReactNode
  home?: boolean
  loggedIn?: boolean
  domain?: string
}) {
  const [session] = useSession()
  const onLogout = useCallback(() => {
    signout({ callbackUrl: '/' })
  }, [signout])

  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#home">{siteTitle}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Nav className="mr-auto">
              {domain && <Nav.Link href={httpsDomain(domain)} target="_blank">{wwwDomain(domain)}</Nav.Link>}
            </Nav>
            <Nav>
              {session?.user?.image && <span style={{ backgroundImage: `url(${session.user.image})` }} className={styles.avatar} />}
              <div className="flex">
                {session && <Nav.Link>Signed in as {session.user.email}</Nav.Link>}
              </div>
              {session ?
                <Nav.Link onClick={onLogout}>Logout</Nav.Link>
                : <Nav.Link onClick={() => signin()}>Sign in</Nav.Link>}
            </Nav>
          </Container>
        </Navbar>
      </header>
      <main>{children}</main>
    </div>
  )
}