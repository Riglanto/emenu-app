import { useState } from "react";
import { Toast } from "react-bootstrap";
import { AppProps } from "next/app";
import { Provider } from 'next-auth/client'

import "../styles/global.scss";
import "../styles/sections.scss";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App({ Component, pageProps }: AppProps) {
  const [notif, setNotif] = useState(null);
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} notify={setNotif} />
      <Toast delay={3000} autohide
        show={!!notif}
        onClose={() => setNotif(null)}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 400
        }}
      >
        <Toast.Header>
          <strong className="mr-auto">Emenu</strong>
          <small>just now</small>
        </Toast.Header>
        <Toast.Body>{notif}</Toast.Body>
      </Toast>
    </Provider>
  );
}
