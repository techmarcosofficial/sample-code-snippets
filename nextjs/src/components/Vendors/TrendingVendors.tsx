import React from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingVendorsProps } from "@/lib/types";
import { parseImage } from "@/utils/helpers";

export default function TrendingVendors({
  vendors
}: TrendingVendorsProps) {
  return (
    <div className="flex flex-wrap mt-10">
      <div className="w-full px-4 mr-auto ml-auto">
        <div className="relative w-full max-w-full flex-grow flex-1">
          <h3 className="text-3xl mb-3 font-semibold leading-normal text-theme uppercase">
            Trending Vendors
          </h3>
        </div>
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
          <div className="rounded-t mb-0 px-4 border-0 mt-4"></div>
          <div className="block w-full overflow-x-auto">
            <div className="comments-outer">
              {vendors.map((vendors) => (
                <div key={vendors.id} className="item">
                  <Link
                    href={`/vendors/${vendors.slug}`}
                    as={`/vendors/${vendors.slug}`}
                    passHref
                  >
                    <a>
                      <div className="upper mb-0">
                        <div className="img">
                          <Image
                            src={parseImage(vendors.image)}
                            className="bg-white rounded border"
                            alt={vendors.display_name}
                            height={70}
                            width={70}
                          />
                        </div>
                        <div className="right">
                          <div className="name">
                            {vendors.display_name}
                          </div>
                          <div className="occ ck" dangerouslySetInnerHTML={{
                            __html: vendors.description}}></div>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
