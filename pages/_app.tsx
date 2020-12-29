import { useState } from "react";
import { Toast } from "react-bootstrap";
import { AppProps } from "next/app";
import { Provider } from 'next-auth/client'
import "reflect-metadata";

import "../styles/global.scss";
import "../styles/sections.scss";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App({ Component, pageProps }: AppProps) {
  const [notif, setNotif] = useState(null);
  const notify = (text, delay) => setNotif({ text, delay });
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} notify={notify} />
      <Toast delay={notif?.delay || 3000} autohide={notif?.delay !== 0}
        show={!!notif}
        onClose={() => setNotif(null)}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 400,
          zIndex: 10000
        }}
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
