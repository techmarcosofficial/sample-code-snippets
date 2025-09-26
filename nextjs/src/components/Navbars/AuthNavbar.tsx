import React from "react";
import Link from "next/link";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-white mb-3 border-b border-gray-200">
      </nav>
    </>
  );
}
