import React from "react";
import Image from "next/image";
import { VendorLogoProps } from "@/lib/types";
import { parseImage } from "@/utils/helpers";

export default function VendorLogo({
  image
}: VendorLogoProps) {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0 overflow-hidden">
        <div className="flex-auto pt-0">
          <div className="container mx-auto">
            <div className="flex flex-wrap items-center">
              <div className="w-full mr-auto ml-auto">
                <div className="relative min-w-0 break-words bg-white w-full text-center">
                  <Image
                    className="align-middle rounded-t-lg"
                    src={parseImage(image)}
                    alt=""
                    height={200}
                    width={200}
                    priority={true}
                    layout="intrinsic"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
