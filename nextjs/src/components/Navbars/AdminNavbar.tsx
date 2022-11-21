import React from "react";
import Link from "next/link";
import Image from "next/image";

import AdminSearch from "@/layouts/AdminSearch";
import UserDropdown from "@/components/Dropdowns/UserDropdown";

export default function Navbar({ query='', category='' }) {
  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 flex items-center p-4 site-header">
        <div className="w-full mx-autp items-center flex justify-between md:px-10 px-4">
          {/* Brand */}
          <Link href="/" as="/" passHref>
            <a className="text-white text-sm uppercase font-semibold whitespace-nowrap mr-3 shrink-0 head-logo">
              <Image
                src="/assets/Logo.png"
                alt="Logo"
                height={50}
                width={170}
                priority={true}
              />
            </a>
          </Link>
          <AdminSearch query={query} category={category} />
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
            <li className="flex items-center">
              <Link href="/categories" as="/categories" passHref>
                <a
                  className="lg:text-white lg:hover:text-blueGray-200 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                >
                  <span className="text-white inline-block ml-2 text-sm">Categories</span>
                </a>
                </Link>
            </li>
          </ul>
          {/* User */}
          <ul className="flex-col md:flex-row list-none items-center flex user-drop">
            <UserDropdown />
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
