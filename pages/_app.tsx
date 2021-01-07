import { useState } from "react";
import { Toast } from "react-bootstrap";
import App from "next/app";
import { Provider } from 'next-auth/client'
import "reflect-metadata";
import { appWithTranslation, useTranslation } from '~/i18n';
import * as Sentry from "@sentry/node";

import "../styles/global.scss";
import "../styles/sections.scss";

import styles from "../styles/app.module.scss";

import "bootstrap/dist/css/bootstrap.min.css";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    enabled: process.env.NODE_ENV === "production",
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN
  })
}

function MyApp({ Component, pageProps, err }) {
  const [notif, setNotif] = useState(null);
  const notify = (text, delay) => setNotif({ text, delay });
  const { t } = useTranslation();
  // throw new Exception("XUZ")
  return (
    <Provider session={pageProps.session}>
      {/* Workaround for https://github.com/vercel/next.js/issues/8592 */}
      <Component {...pageProps} notify={notify} err={err} />
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