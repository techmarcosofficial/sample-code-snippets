import React from "react";
import { GetServerSideProps } from "next";
import nookies from "nookies";

import Admin from "@/layouts/Admin";
import Header from "@/layouts/Header";
import Actions from "@/components/Vendors/Actions";
import Vendors from "@/components/Vendors/Index";
import VendorDetail from "@/components/Vendors/VendorDetail";
import VendorLogo from "@/components/Vendors/VendorLogo";
import VendorInfo from "@/components/Vendors/VendorInfo";

import {
  getVendors,
  getVendorById,
} from "@/lib/api";
import { VendorsPageProps } from "@/lib/types";

export default function _Vendors({
  items,
  item,
}: VendorsPageProps) {
  return (
    <>
      <div className="flex flex-wrap">
        {item ? (
          <>
            <Header title={item.display_name} />
            <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
              <VendorDetail item={item} />
            </div>
            <div className="w-full xl:w-4/12 px-4">
              <div className="vendor-sidebar">
                <VendorLogo image={item.image} />
                <Actions type="vendor" item={item} />
                {item?.options && <VendorInfo item={item} />}
              </div>
            </div>
          </>
        ) : (
          <>
            <Header title="Vendors" />
            <div className="w-full mb-12 xl:mb-0 px-4">
              <Vendors items={items ? items : null} currentVendorId={null} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

_Vendors.layout = Admin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = nookies.get(context);
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      }
    };
  }
  const { slug } = context.query;
  let items = null;
  let item = null;
  if (Array.isArray(slug)) {
    const vSlug = slug[0];
    if (vSlug) {
      // Fetch vendor detail by slug.
      const vendorResponse = await getVendorById(vSlug, token);
      if (vendorResponse.code === 200) {
        item = vendorResponse?.data?.vendor ?? null;
      }
    }
  } else {
    // Fetch vendors list.
    const vendorsResponse = await getVendors(token, context.query);
    if (vendorsResponse.code === 200) {
      items = vendorsResponse?.data?.vendors ?? null;
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
