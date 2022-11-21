import React, { useEffect } from "react";
import Router from "next/router";
import { useStore } from "@/reducers/auth";

// components

import AdminNavbar from "@/components/Navbars/AdminNavbar";
// import FooterAdmin from "@/components/Footers/FooterAdmin";

interface AdminProps {
  query?: string,
  category?: string,
  children: React.ReactNode
}

export default function Admin({ children, query, category }: AdminProps) {
  const { isLoggedIn } = useStore();
  const [loggedIn, setLoggedIn] = React.useState(!1);
  useEffect(() => {
    setLoggedIn(isLoggedIn);
    if (!isLoggedIn) Router.push('/login');
  }, []);
  if (!loggedIn) return <></>;
  return (
    <>
      <div className="relative bg-blueGray-100">
        <AdminNavbar query={query} category={category} />
        {/* Header */}
        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12"></div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          {children}
          {/* <FooterAdmin /> */}
        </div>
      </div>
    </>
  );
}
