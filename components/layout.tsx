import Head from 'next/head';
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { signin, signout, useSession } from 'next-auth/client';
import { useCallback } from 'react';
import * as ls from "local-storage";
import ReactCountryFlag from "react-country-flag";

import styles from "~/styles/layout.module.scss";
import { httpsDomain, wwwDomain } from '~/utils';
import { useTranslation, i18n, allLanguages } from '~/i18n';
import { FaGlobeAmericas, FaCheckCircle } from 'react-icons/fa';

const { GA_TRACKING_ID } = process.env;
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
    ls.remove("sections")
    signout({ callbackUrl: '/' })
  }, [signout])

  const { t } = useTranslation();

  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Build your online menu for your restaurant in a matter of seconds."
        />
        <meta
          property="og:image"
          content={"images/example2.png"}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
            `,
          }}
        />
      </Head>
      <header>
        <Navbar expand={session ? "lg" : true} bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#home">{siteTitle}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                {domain && <Nav.Link href={httpsDomain(domain)} target="_blank">{wwwDomain(domain)}</Nav.Link>}
              </Nav>
              <Nav>
                {session?.user?.image && <span style={{ backgroundImage: `url(${session.user.image})` }} className={styles.avatar} />}
                <div className="flex">
                  {session && <Nav.Link>{t('logged_as')} {session.user.email}</Nav.Link>}
                </div>
                {session ?
                  <Nav.Link onClick={onLogout}>{t('logout')}</Nav.Link>
                  : <Nav.Link onClick={() => signin()}>{t('signin')}</Nav.Link>}
                <NavDropdown title={<FaGlobeAmericas color="white" />} id="basic-nav-dropdown" className={styles.flag_dropdown}>
                  {allLanguages.map(lang =>
                    <NavDropdown.Item key={lang} onClick={() => i18n.changeLanguage(lang)}>
                      {lang === "en" ? <FaGlobeAmericas color="black" /> : <ReactCountryFlag countryCode={lang} />}
                      {i18n.language === lang && <FaCheckCircle className={styles.flag_selected} color="green" size={10} />}
                    </NavDropdown.Item>)}
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <main>{children}</main>
    </div >
  )
}