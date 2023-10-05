import "../styles/globals.css";

import { NextUIProvider } from "@nextui-org/react";
import Router from "next/router";
import { useState, useEffect } from "react";
import LoadingSymbol from "../components/Reusable/loadingSymbol";

export default function App({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const start = () => {
      setIsLoading(true);
    };
    const end = () => {
      setIsLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return isLoading ? <LoadingSymbol height={300} width={300} />
    : (
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    );
}
