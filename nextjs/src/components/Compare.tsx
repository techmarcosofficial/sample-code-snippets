import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { parseCookies } from "nookies";

import AutoComplete from "@/components/Search/AutoComplete";
import Breadcrumbs from "@/components/Breadcrumbs/Index";
import { COMPARE } from "@/components/Breadcrumbs/feeds";
import { compareVendorsAPI } from "@/lib/api";
import { findVendorIds } from "@/utils/helpers";
import { AutoCompleteVendorsProps } from "@/lib/types";

export default function Compare() {
  const router = useRouter();
  const { token } = parseCookies();
  const [loading, setLoading] = React.useState(!1);
  const [vendors, setVendors] = React.useState<any[]>([]);
  const [filters, setFilters] = React.useState<any[]>([]);
  const [categoryIds, setCategoryIds] = React.useState<any[]>([]);

  useEffect(() => {
    let vids: any = sessionStorage.getItem("vids");
    if (vids) {
      vids = JSON.parse(vids);
      const payload = findVendorIds(vids);
      getData("", null, payload);
    }
  }, []);

  const getData = (
    name: string,
    seachedItemId: number | null,
    payload: Array<number | null>
  ) => {
    setLoading(!0);
    compareVendorsAPI(payload, token ?? "").then((res) => {
      setLoading(!1);
      if (res.code === 200) {
        let nVendors: Array<AutoCompleteVendorsProps | null> = [];
        if (res?.data?.primary_vendor_categories) {
          setCategoryIds(res?.data?.primary_vendor_categories);
        }
        if (res?.data?.vendors) {
          nVendors = Object.keys(res?.data?.vendors).map((vendor: string) => {
            return {
              ...res?.data?.vendors[vendor],
              selected: !0,
              showText: !1
            };
          });

          if (seachedItemId) {
            const newItemIndex = nVendors.findIndex(
              (n) => n && n.id === seachedItemId
            );
            switch (name) {
              case "vendor1":
                vendors[newItemIndex] = nVendors[newItemIndex];
                nVendors = vendors;
                break;
              case "vendor2":
                nVendors = [vendors[0], nVendors[newItemIndex], vendors[2]];
                break;
              case "vendor3":
                nVendors = [vendors[0], vendors[1], nVendors[newItemIndex]];
                break;
            }
          } else {
            switch (nVendors.length) {
              case 1:
                nVendors = [...nVendors, null, null];
                break;
              case 2:
                nVendors = [...nVendors, null];
                break;
            }
          }

          setVendors(nVendors);
          let nFilters: unknown[] = [];
          if (res?.data?.filters) {
            nFilters = Object.entries(res?.data?.filters).map(
              ([key, value]: any) => {
                return {
                  name: key,
                  items: Object.entries(value).map(([j, k]: any) => {
                    k.slug = j;
                    return { ...k };
                  }),
                };
              }
            );
          }
          setFilters(nFilters);
        }
      }
    });
  };

  // method called based on the selected vendor.
  const handleSearch = (name: string, item: any, removeItem: number | null) => {
    let vids: number[] = vendors
      .filter((vendor) => vendor && vendor.id)
      .map((vendor) => vendor.id);
    switch (name) {
      case "vendor1":
        vids = [item.id, ...vids];
        if (removeItem) {
          vids = vids.filter((vid) => vid !== removeItem);
        }
        break;
      case "vendor2":
        vids.splice(1, 0, item.id);
        if (removeItem) {
          vids = vids.filter((vid) => vid !== removeItem);
        }
        break;
      case "vendor3":
        vids = [...vids, item.id];
        if (removeItem) {
          vids = vids.filter((vid) => vid !== removeItem);
        }
        break;
      default:
    }
    getData(name, item.id, findVendorIds(vids));
  };

  // method to extract vendor ID's
  const vendorIds = () => {
    return vendors.filter((vendor) => vendor && vendor).map((t) => t.id);
  };

  // method to remove vendor from vendors list.
  const removeVendor = (index: number) => {
    const nVendors = vendors.map((vendor, i) => {
      if (i === index) return null;
      return vendor;
    });
    // return vendors listing page if no vendor on this page.
    if (!nVendors.filter((nVendor) => nVendor).length) {
      router.push('/vendors');
      return;
    }
    setVendors(nVendors);
  };

  // toggle vendor description
  const toggle = (index: number) => {
    const nVendors = vendors.map((vendor, i) => {
      if (i === index) {
        vendor.showText = !vendor.showText;
        return vendor;
      }
      return vendor;
    });
    setVendors(nVendors);
  }

  const vids: any = sessionStorage.getItem("vids");
  if (!vids) {
    router.push("/");
  }

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold uppercase">
              Vendor Compare
            </h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <Breadcrumbs items={COMPARE} />
          <div className="container mx-auto">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-3/12 lg:px-4 mb-4">
                <div className="container mx-auto sticky-bar">
                  <div className="flex flex-wrap">
                    <div className="lg:pt-12 pt-4 w-full lg:px-4">
                      <a
                        href="#reach_1"
                        className="ml-2 text-sm font-semibold text-blueGray-600"
                      >
                        AT A GLANCE
                      </a>
                    </div>
                    {loading && (
                      <p className="px-4 py-4 text-center">loading...</p>
                    )}
                    {filters.length
                      ? filters.map((filter, index) => (
                          <div key={index} className="pt-2 w-full lg:px-4">
                            <a
                              href={`#reach_${index + 2}`}
                              className="ml-2 text-sm font-semibold text-blueGray-600"
                            >
                              {filter.name}
                            </a>
                          </div>
                        ))
                      : null}
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-9/12 lg:px-4">
                <div className="lg:pt-12 pt-4 w-full lg:px-4">
                  <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                    <div className="px-4 py-5 flex-auto">
                      <p id="reach_1" className="lg:px-4 f-semi text-lg theme-txt">AT A GLANCE</p>
                    </div>
                    <div className="px-4 py-5 flex-auto">
                      <div className="mx-auto w-full">
                        <h6 className="mb-3 lg:px-4">OVERVIEW</h6>
                        <div className="flex flex-wrap">
                          {vendors.length ? (
                            <>
                              {vendors.map((vendor, index) => (
                                <div
                                  key={index}
                                  className="w-full lg:w-6/12 xl:w-4/12 lg:px-4"
                                >
                                  {vendor ? (
                                    <>
                                      <div className="flex">
                                        <h6 className="mr-3">
                                          {vendor.display_name}
                                        </h6>
                                        {vendor.selected && (
                                          <button
                                            onClick={() => removeVendor(index)}
                                            className="cross-btn"
                                          >
                                            <i className="fa-solid fa-xmark text-theme-light"></i>
                                          </button>
                                        )}
                                      </div>
                                      {
                                        vendor.description && vendor.description.length > 100 ? (
                                          <>
                                            {vendor.showText ? (
                                              <>
                                                <div
                                                  className="mt-2 mb-4 text-blueGray-500 ck"
                                                  dangerouslySetInnerHTML={{
                                                    __html: vendor.description
                                                  }}
                                                ></div>{" "}
                                                <a className="text-theme-light" onClick={() => toggle(index)}>Hide</a>
                                              </>
                                            ): (
                                              <div className="flex flex-wrap flex-col">
                                                <div
                                                  className="mt-2 mb-3 text-blueGray-500 ck"
                                                  dangerouslySetInnerHTML={{
                                                    __html: `${vendor.description.substring(0, 100)} ...`,
                                                  }}
                                                ></div>
                                                <div>
                                                  <a className="text-theme-light block" onClick={() => toggle(index)}>Show more</a>
                                                </div>
                                              </div>
                                            )}
                                          </>
                                        ) : (
                                          <div
                                            className="mt-2 mb-4 text-blueGray-500 ck"
                                            dangerouslySetInnerHTML={{
                                              __html: vendor.description
                                            }}
                                          ></div>
                                        )
                                      }
                                    </>
                                  ) : (
                                    <AutoComplete
                                      name={`vendor${index + 1}`}
                                      vendorIds={vendorIds()}
                                      categoryIds={categoryIds}
                                      handleSearch={handleSearch}
                                    />
                                  )}
                                </div>
                              ))}
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg">
                    <div className="px-4 py-5 flex-auto">
                      <p className="lg:px-4 f-semi text-lg theme-txt">CATEGORY LANDSCAPE</p>
                    </div>
                    <div className="px-4 py-5 flex-auto">
                      <div className="compare-table">
                        <table>
                          <thead>
                            <tr>
                              {filters.length ? (
                                <th id={`reach_2`}>{filters[0].name}</th>
                              ) : null}
                              {vendors.length
                                ? vendors.map((vendor) => (
                                    <>
                                      {vendor ? (
                                        <th key={vendor.id}>
                                          <Link
                                            href={`/vendors/${vendor.slug}`}
                                            as={`/vendors/${vendor.slug}`}
                                          >
                                            <a>{vendor.display_name}</a>
                                          </Link>
                                        </th>
                                      ) : (
                                        <th></th>
                                      )}
                                    </>
                                  ))
                                : null}
                            </tr>
                          </thead>
                          <tbody>
                            {loading && (
                              <tr>
                                <td colSpan={4}>
                                  <p className="px-4 py-4 text-center">
                                    loading...
                                  </p>
                                </td>
                              </tr>
                            )}
                            {filters.length
                              ? filters.map((filter, index) => (
                                  <>
                                    <tr key={index}>
                                      {index !== 0 ? (
                                        <td colSpan={4}>
                                          <th
                                            id={`reach_${index + 2}`}
                                            style={{ paddingLeft: 0 }}
                                          >
                                            {filter.name}
                                          </th>
                                        </td>
                                      ) : null}
                                    </tr>
                                    {filter.items.map(
                                      (item: any, i: number) => (
                                        <tr key={i}>
                                          <td>{item.name}</td>
                                          {vendors.length
                                            ? vendors.map((vendor) => (
                                                <>
                                                  {vendor ? (
                                                    <td>
                                                      <span className={`${item[vendor.id] ? "check": "cross"}`}>
                                                        <i className={`${item[vendor.id] ? "fa fa-check" : "fa fa-xmark"}`}></i>
                                                      </span>
                                                    </td>
                                                  ) : (
                                                    <td></td>
                                                  )}
                                                </>
                                              ))
                                            : null}
                                        </tr>
                                      )
                                    )}
                                  </>
                                ))
                              : null}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
