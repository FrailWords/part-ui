import React from "react";
import Head from "next/head";

import "antd/dist/antd.css";

function MyApp(props) {
  let { Component, pageProps } = props;
  return (
    <React.Fragment>
      <Head>
        <title>Controller Interface</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </React.Fragment>
  );
}

export default MyApp;
