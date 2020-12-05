import "reflect-metadata"

import { AppProps } from "next/app";
import { Provider } from 'next-auth/client'

import "../styles/global.scss";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}
