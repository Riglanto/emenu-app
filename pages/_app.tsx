import { useState } from "react";
import { Toast } from "react-bootstrap";
import type { AppProps } from "next/app";
import App from "next/app";
import { Provider } from 'next-auth/client'
import "reflect-metadata";
import { appWithTranslation } from '~/i18n';

import "../styles/global.scss";
import "../styles/sections.scss";
import styles from "../styles/app.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [notif, setNotif] = useState(null);
  const notify = (text, delay) => setNotif({ text, delay });
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
          <small>just now</small>
        </Toast.Header>
        <Toast.Body>{notif?.text}</Toast.Body>
      </Toast>
    </Provider>
  );
}

MyApp.getInitialProps = async (appContext) => ({ ...await App.getInitialProps(appContext) })

export default appWithTranslation(MyApp)