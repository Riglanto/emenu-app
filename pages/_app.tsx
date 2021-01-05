import { useState } from "react";
import { Toast } from "react-bootstrap";
import type { AppProps } from "next/app";
import App from "next/app";
import { Provider } from 'next-auth/client'
import "reflect-metadata";
import { appWithTranslation, useTranslation } from '~/i18n';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import "../styles/global.scss";
import "../styles/sections.scss";

import styles from "../styles/app.module.scss";

import "bootstrap/dist/css/bootstrap.min.css";

const debug = process.env.NODE_ENV !== "production";

if (!debug) {
  Sentry.init({
    dsn: process.env.SENTRY,
    autoSessionTracking: true,
    integrations: [
      new Integrations.BrowserTracing(),
    ],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  })
}

function MyApp({ Component, pageProps }: AppProps) {
  const [notif, setNotif] = useState(null);
  const notify = (text, delay) => setNotif({ text, delay });
  const { t } = useTranslation();
  // throw new Exception("XUZ")
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} notify={notify} />
      <Toast delay={notif?.delay || 3000} autohide={notif?.delay !== 0}
        show={!!notif}
        onClose={() => setNotif(null)}
        className={styles.toast}
      >
        <Toast.Header>
          <strong className="mr-auto">Emenu</strong>
          <small>{t("notify.now")}</small>
        </Toast.Header>
        <Toast.Body>{notif?.text}.</Toast.Body>
      </Toast>
    </Provider>
  );
}

MyApp.getInitialProps = async (appContext) => ({ ...await App.getInitialProps(appContext) })

export default appWithTranslation(MyApp)