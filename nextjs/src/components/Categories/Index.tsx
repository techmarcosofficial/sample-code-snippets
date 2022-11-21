import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@etchteam/next-pagination";
import "@etchteam/next-pagination/dist/index.css";

import Breadcrumbs from "@/components/Breadcrumbs/Index";
import { CATEGORIES } from "@/components/Breadcrumbs/feeds";
import { CategoriesListProps, CategoriesProps } from "@/lib/types";
import { parseImage } from "@/utils/helpers";

export default function Index({
  items
}: CategoriesListProps) {
  const [categories, setCategories] = React.useState<CategoriesProps | null>(null);
  useEffect(() => {
    setCategories(items ? items : null);
    let pagination = document.querySelector("#next-pagination__size") as HTMLDivElement;
    if (pagination) {
      (pagination.closest("div") as HTMLDivElement).style.display = "none";
    }
  }, [categories]);
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
        <div className="rounded-t bg-theme-light text-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-white text-xl font-bold uppercase">Categories</h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0 pb-0">
          <Breadcrumbs items={CATEGORIES} />
          <div className="container mx-auto">
            <div className="cat-grid">
              {items && items.data.map((category) => (
                <div key={category.id} className="w-full h-full">
                  <Link
                    href={`/categories/${category.slug}`}
                    as={`/categories/${category.slug}`}
                    passHref
                  >
                    <a>
                      <div className="cat-wrap-box shadow-lg rounded-lg overflow-hidden">
                        <Image
                          src={parseImage(category.image)}
                          alt={category.name}
                          priority={true}
                          layout="fill"
                        />
                        <span id="blackOverlay" className="w-full h-full absolute overlay bg-black opacity-50"></span>
                        <div className="content flex flex-col">
                          <div className="text" dangerouslySetInnerHTML={{__html: category.description}}></div>
                          <h6 className="bottom">{category.name}</h6>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Pagination START */}
        {items && items.total > items.per_page ? (
          <div className="flex-auto lg:px-10 py-10 pt-0">
            <div className="container mx-auto">
              <Pagination
                sizes={[items.per_page]}
                perPageText=""
                total={items.total}
              />
            </div>
          </div>
        ): null}
        {/* Pagination END */}
      </div>
    </>
  );
}
