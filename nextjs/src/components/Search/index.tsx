import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import Pagination from "@etchteam/next-pagination";
import "@etchteam/next-pagination/dist/index.css";

import Breadcrumbs from "@/components/Breadcrumbs/Index";
import { SEARCH } from "@/components/Breadcrumbs/feeds";
import { parseImage, parseFilters } from "@/utils/helpers";
import { VendorsProps, VendorProps, SearchPageProps } from "@/lib/types";
import { getFilters, getCategoryById, searchVendorsAPI } from "@/lib/api";

const Search = ({ query, category }: SearchPageProps) => {
  const router = useRouter();
  const { token } = parseCookies();
  const [loading, setLoading] = React.useState(!1);
  const [checkboxes, setCheckboxes] = React.useState<number[]>([]);
  const [selectedVendorsCount, setSelectedVendorsCount] = React.useState<number>(0);
  const [vendors, setVendors] = React.useState<VendorsProps | null>(null);
  const [filters, setFilters] = React.useState<any[]>([]);
  useEffect(() => {
    if (category && category.length) {
      // Get category based filters
      setLoading(!0);
      getCategoryById(category, token ?? '').then((res) => {
        setLoading(!1);
        if (res.code === 200) {
          const result = res?.data?.category ?? null;
          if (Object.keys(result?.options).length) {
            // Category filters
            setFilters(parseFilters(result?.options));
            setCheckboxes([result.id]);
          }
        }
      });
    } else {
      // Get univarsal filters if user don't selected any category.
      setLoading(!0);
      getFilters(token ?? '').then((res) => {
        setLoading(!1);
        if (res.code === 200) {
          const options = Object.entries(res?.data?.filters).map(([key, value]: any) => {
            return {
              name: key,
              items: Object.keys(value).map((t: string, i: number) => {
                return {
                  id: t,
                  name: Object.values(value)[i],
                  selected: !1
                };
              }),
            }
          });
          if (options.length) {
            setFilters(options);
          };
        }
      });
    }
    handleSearch({q: query});
  }, []);

  const handleSearch = (query: any) => {
    setLoading(!0);
    searchVendorsAPI(token ?? '', query)
      .then((res) => {
        setLoading(!1);
        if (res.code === 200) {
          res?.data?.vendors?.data.map((vendor: VendorProps) => {
            return {...vendor, selected: !1}
          }) ?? [];
          setVendors(res?.data?.vendors);
        }
      });
  }

  const handleSorting = (e: any) => {
    switch(e.currentTarget.value) {
      case 'ASC':
        handleSearch({q: query, sort: 'display_name', direction: 'asc'});
        break;
      case 'DESC':
        handleSearch({q: query, sort: 'display_name', direction: 'desc'});
        break;
    }
  }
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
        <div className="rounded-t bg-theme-light mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-white text-xl font-bold uppercase">Search</h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <Breadcrumbs items={SEARCH} />
          <div className="container mx-auto">
            <div className="flex flex-wrap py-5 mt-5">
              <div className="w-full lg:w-3/12 px-4"></div>
                <div className="w-full lg:w-9/12 px-4">
                  <div className="mx-auto">
                    <div className="px-4 flex-auto">
                      <div className="flex flex-wrap">
                        <div className="w-full lg:w-8/12"></div>
                        <div className="w-full lg:w-4/12">
                          <div className="flex flex-wrap">
                            <div className="flex lg:w-6/12 text-center">
                              {selectedVendorsCount > 0 ? (
                                <button
                                  className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                  type="button"
                                  onClick={() => {
                                    if (vendors && vendors.data.length) {
                                      let vids = vendors.data.filter((vendor) => vendor.selected).map(
                                        (vendor) => vendor.id);
                                      sessionStorage.setItem('vids', JSON.stringify(vids));
                                      router.push('/compare');
                                    }
                                  }}
                                >
                                  Compare
                                </button>
                              ) : null}
                            </div>
                            <div className="lg:w-6/12">
                              <select
                                name="sort"
                                className="border px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                placeholder="ASC"
                                onChange={handleSorting}
                              >
                                <option>Sort</option>
                                <option value="ASC">ASC</option>
                                <option value="DESC">DESC</option>
                              </select>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap">
              <div className="w-full lg:w-3/12 px-4 bg-blueGray-100 rounded-lg pb-4 mb-4">
                {filters.map((filter: any, i: number) => (
                  <div key={i} className="container mx-auto">
                    <div className="flex flex-wrap">
                      <div className=" pt-6 w-full">
                        <h6 className="text-sm font-semibold mb-2">{filter.name}</h6>
                        {filter.items.map((source: any, i: number) => (
                          <div key={i} className="lg:pt-1 pt-1">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                id={`check_${source.id}`}
                                type="checkbox"
                                className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                                onChange={() => {
                                  let cids = checkboxes;
                                  if (cids.includes(source.id)) {
                                    cids = cids.filter((n) => n !== source.id);
                                  } else {
                                    cids = [...checkboxes, source.id];
                                  }
                                  setCheckboxes(cids);
                                  handleSearch({q: query, filters: cids});
                                }}
                              />
                              <span className="ml-2 text-sm font-semibold text-blueGray-600">
                                {source.name}
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full lg:w-9/12 lg:px-4">
                <div className="container mx-auto">
                  <div className="lg:px-4">
                    {loading && (<p className="text-center">loading...</p>)}
                    <div className="comments-outer m-0">
                      {!loading && vendors ? vendors.data.map((item) => (
                        <div
                          className="item"
                          key={item.id}
                          style={{backgroundColor: item.selected ? '#dff2d8' : 'white'}}
                          onClick={() => {
                            vendors.data.map((vendor) => {
                              if (vendor.id === item.id) {
                                vendor.selected = !vendor.selected;
                                return vendor;
                              }
                              return vendor;
                            });
                            let count = vendors.data.filter((vendor) => vendor.selected).length;
                            if (count <= 3) {
                              setVendors(vendors);
                              setSelectedVendorsCount(count);
                            }
                          }}>
                          <div className="upper mb-0">
                            <div className="img">
                              <Image src={parseImage(item.image)} width={80} height={80} className="border bg-blueGray-100 rounded-full"/>
                            </div>
                            <div className="right mr-4">
                              <div className="name">{item.display_name}</div>
                              <div className="occ ck" dangerouslySetInnerHTML={{__html: item.description}}></div>
                            </div>
                            <div className="ml-auto">
                              <div className="text-sm bg-theme text-center p-4 rounded-lg" style={{color: 'white'}}>PBGH <br />REVIEWED</div>
                            </div>
                          </div>
                        </div>
                      )): (
                        <div className="h-16">
                          <p className="text-center text-blueGray-500 p-4">
                            No vendors meet this criteria.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Pagination START */}
                {vendors && (vendors.data.length > vendors.per_page) ? (
                  <div className="flex-auto py-10 pt-10 px-4">
                    <div className="container mx-auto">
                      <Pagination
                        sizes={[vendors.per_page]}
                        perPageText=""
                        total={vendors.total}
                      />
                    </div>
                  </div>
                ): null}
                {/* Pagination END */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Search;
