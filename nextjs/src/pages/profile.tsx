import React from "react";
import Admin from "@/layouts/Admin";
import Header from "@/layouts/Header";
import Profile from "@/components/Profile";

export default function _Profile() {
  return (
    <>
      <Header title="Profile" />
      <div className="flex flex-wrap">
        <div className="w-full mb-12 xl:mb-0 px-4">
          <Profile />
        </div>
      </div>
    </>
  );
}

_Profile.layout = Admin;
