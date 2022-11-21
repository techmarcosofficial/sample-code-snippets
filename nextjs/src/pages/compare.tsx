import React from "react";

import Admin from "@/layouts/Admin";
import Header from "@/layouts/Header";
import Compare from "@/components/Compare";

export default function _Compare() {
  return (
    <>
      <Header title="Compare" />
      <div className="flex flex-wrap">
        <div className="w-full mb-12 xl:mb-0 px-4">
          <Compare />
        </div>
      </div>
    </>
  );
}

_Compare.layout = Admin;
