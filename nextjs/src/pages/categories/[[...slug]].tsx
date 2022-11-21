import React from "react";
import { GetServerSideProps } from "next";
import nookies from "nookies";

import Admin from "@/layouts/Admin";
import Header from "@/layouts/Header";
import Categories from "@/components/Categories/Index";
import CategoryDetail from "@/components/Categories/CategoryDetail";
import {
  getCategories,
  getCategoryById
} from "@/lib/api";
import {
  CategoriesPageProps
} from "@/lib/types";

export default function _Categories({
  items,
  item,
}: CategoriesPageProps) {
  return (
    <>
      <div className="flex flex-wrap">
        {item ? (
          <>
            <Header title={item.name} />
            <div className="w-full mb-12 xl:mb-0 px-4">
              <CategoryDetail item={item} />
            </div>
          </>
        ) : (
          <>
            <Header title="Categories" />
            <div className="w-full mb-12 xl:mb-0 px-4">
              {items && <Categories items={items} />}
            </div>
          </>
        )}
      </div>
    </>
  );
}

_Categories.layout = Admin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  const { token } = nookies.get(context);
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      }
    }
  }

  let items = null;
  let item = null;
  if (Array.isArray(slug)) {
    const categorySlug = slug[0];
    // Fetch category detail by slug.
    const categoryResponse = await getCategoryById(
      categorySlug ? categorySlug : "", token);
    if (categoryResponse.code === 200) {
      item = categoryResponse?.data?.category ?? null;
      if (Array.isArray(item)) item = null;
    }
  } else {
    // Fetch categories list.
    const categoriesResponse = await getCategories(token, context.query);
    if (categoriesResponse.code === 200) {
      items = categoriesResponse?.data?.categories ?? null;
    }
  }

  return {
    props: {
      token,
      items,
      item,
    },
  };
};
