import React from "react"
import Head from "next/head";
import { HeaderProps } from "@/lib/types";

const Header = ({ title }: HeaderProps) => {
  return (
    <Head>
      <title>{`SubPop | ${title}`}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="shortcut icon" href="/favicon.png"/>
    </Head>
  )
}

export default Header;