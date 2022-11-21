import React from "react";
import { GetServerSideProps } from "next";
import nookies from "nookies";
import { SearchPageProps } from "@/lib/types";

import Admin from "@/layouts/Admin";
import Search from "@/components/Search";

export default function _Search({
  query,
  category,
}: SearchPageProps) {
  return (
    <Admin query={query} category={category}>
      <div className="flex flex-wrap">
        <div className="w-full mb-12 xl:mb-0 px-4">
          <Search query={query} category={category} />
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = nookies.get(context);
  const { q, category } = context.query;
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      }
    }
  }

  return {
    props: {
      query: q ?? "",
      category: category ?? "",
    },
  }
}
