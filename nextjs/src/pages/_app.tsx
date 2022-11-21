import React from "react";
import App from "next/app";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/tailwind.css";
import '../styles/common.scss';

export default class MyApp extends App {
  // static async getInitialProps({ Component, router, ctx }) {
  //   let pageProps = {};
  //   if (Component.getInitialProps) {
  //     pageProps = await Component.getInitialProps(ctx);
  //   }

  //   return { pageProps };
  // }
  render() {
    const { Component, pageProps, router }: any = this.props;
    const Layout = Component.layout || (({ children }: any) => <>{children}</>);
    return (
      <Layout>
        <Component key={router.asPath} {...pageProps} />
      </Layout>
    );
  }
}
