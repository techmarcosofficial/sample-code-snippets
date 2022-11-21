import React from "react";
import Link from "next/link";
import Image from "next/image";
import { parseImage } from "@/utils/helpers";
import { FeaturedCategoriesProps } from "@/lib/types";

export default function FeaturedCategories({
  categories
}: FeaturedCategoriesProps) {
  return (
    <div className="flex flex-wrap mt-10">
      <div className="w-full px-4 mr-auto ml-auto">
        <h3 className="text-3xl mb-3 font-semibold leading-normal text-theme uppercase">
          Featured Categories
        </h3>
        <div className="flex-auto">
          <div className="accordion-content">
            {categories.map((category) => (
              <div key={category.id} className="accordion-item">
                <header className="item-header py-4">
                  <h4 className="item-question uppercase">{category.name}</h4>
                  <div className="item-icon">
                    <i className="fa fa-plus"></i>
                  </div>
                </header>
                <div className="item-content">
                  <div className="item-answer">
                    <div className="flex">
                      <div className="pt-1 shrink-0 img">
                        <Image
                          src={parseImage(category.image)}
                          height={70}
                          width={70}
                          alt={category.name}
                          priority={true}
                          layout="intrinsic"
                          className="bg-white rounded border align-middle"
                        />
                      </div>
                      <div className="ml-3">
                        <div
                          className="mb-2 ck"
                          dangerouslySetInnerHTML={{
                            __html: category.description,
                          }}
                        ></div>
                        <Link
                          href={`/categories/${category.slug}`}
                          as={`/categories/${category.slug}`}
                          passHref
                        >
                        <a className="text-theme-light" title="More Info">More Info</a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
