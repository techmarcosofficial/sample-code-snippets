import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { parseCookies } from "nookies";
import Feedbacks from "@/components/Feedbacks";
import Breadcrumbs from "@/components/Breadcrumbs/Index";
import {
  searchVendorsAPI,
  likeAPI,
  getVendorFeedbacks,
  getFeedbackComments,
  getThirdPartyInfo,
  getVendorCriterias,
} from "@/lib/api";
import {
  VendorDetailPageProps,
  VendorProps,
  FeedbackProps,
  OptionProps,
  FeedbackCommentProps,
  ThirdPartyInfoDataProps,
  CriteriaProps,
} from "@/lib/types";
import {
  parseImage,
  parseFilters,
  parseExternalLinks,
  toggleAccordion,
  toggleSubAccordions
} from "@/utils/helpers";
import {
  feedbackLikeFormatter,
  feedbacksListFormatter,
  feedbackCommentsFormatter,
  toggleFeedbackComments,
} from "@/utils/feedback";

const VendorDetail = ({
  item,
}: VendorDetailPageProps) => {
  const { token } = parseCookies();
  const [loading, setLoading] = React.useState(!1);
  const [checkboxes, setCheckboxes] = React.useState<number[]>([]);
  const [filters, setFilters] = React.useState<any[]>([]);
  const [vendors, setVendors] = React.useState<VendorProps[]>([]);
  const [nFeedbacks, setFeedbacks] = React.useState<FeedbackProps[]>([]);
  const [feedbackComments, setFeedbackComments] = React.useState<
    FeedbackCommentProps[]
  >([]);
  const [thirdParty, setThirdParty] = React.useState<ThirdPartyInfoDataProps[]>([]);
  const [criterias, setCriterias] = React.useState<CriteriaProps[]>([]);

  useEffect(() => {
    const accordionBtns =
      document.querySelectorAll<HTMLElement>(".item-header");
    accordionBtns.forEach((accordion) => {
      accordion.onclick = function () {
        toggleAccordion(accordion);
      };
    });

    if (Object.keys(item?.options).length) {
      // Category filters
      let cids: Array<number> = [];
      let options = parseFilters(item?.options);
      const categoryOption = options.find(
        (option) => option.name.toLowerCase() === "category"
      );
      if (categoryOption) {
        // Vendor Categories
        cids = categoryOption.items.map((item: OptionProps) => item.id);
        // Exclude  Category in filters
        options = options.filter(
          (option) => option.name.toLowerCase() !== "category"
        );
        setCheckboxes(cids);
        filterVendorsByCategory(cids);
      }
      setFilters(options);
    }

    Promise.all([
      getVendorFeedbacks(item.id, token ?? ""),
      getThirdPartyInfo(item.id, token ?? ""),
      getVendorCriterias(item.id, token ?? ""),
    ]).then((res) => {
      if (res[0].code === 200) {
        setFeedbacks(res[0]?.data?.feedbacks?.data ?? []);
      }
      if (res[1].code === 200) {
        setThirdParty(res[1]?.data?.third_party_info?.data ?? []);
      }
      if (res[2].code === 200) {
        setCriterias(res[2]?.data?.criterias?.data ?? []);
      }
    });
  }, []);

  useEffect(() => {
    let valueMemberAccordion = document.querySelector(
      ".accordion-content.alter"
    ) as HTMLDivElement;
    const commentForm = document.querySelector(
      "#commentForm"
    ) as HTMLFormElement;
    if (commentForm) {
      const openCommentsCount = nFeedbacks.filter(
        (nFeedback) => nFeedback.openComment === !0
      ).length;
      valueMemberAccordion = valueMemberAccordion.querySelector(
        ".item-content"
      ) as HTMLDivElement;
      valueMemberAccordion.style.maxHeight =
        valueMemberAccordion.clientHeight +
        commentForm.clientHeight * openCommentsCount +
        "px";
    }
  }, [nFeedbacks]);

  const filterVendorsByCategory = (cids: any) => {
    setLoading(!0);
    searchVendorsAPI(token ?? "", { q: "", filters: cids }).then(
      (res) => {
        if (res.code === 200) {
          setLoading(!1);
          const nVendors: VendorProps[] = res?.data?.vendors?.data;
          if (nVendors.length) {
            setVendors(
              nVendors.filter(
                (vendor) => vendor.id !== item.id) ?? []);
          }
        }
      }
    );
  };

  const handleLikes = (id: number) => {
    const payload = {
      feedback_id: id,
    };
    likeAPI(payload, token ?? "")
      .then((res) => {
        if (res.code === 201 || res.code === 200) {
          setFeedbacks(
            feedbackLikeFormatter(id, nFeedbacks, res.message)
          );
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleComments = (feedback: any) => {
    setFeedbacks(
      toggleFeedbackComments(feedback.id, nFeedbacks)
    );
  };

  const showComments = (feedback: any) => {
    if (!feedback.showComments) {
      setLoading(!0);
      getFeedbackComments(feedback.id, token ?? "").then((res) => {
        setLoading(!1);
        if (res.code === 200) {
          setFeedbackComments(
            feedbackCommentsFormatter(res?.data?.comments)
          );
          setFeedbacks(
            feedbacksListFormatter(feedback.id, nFeedbacks)
          );
        }
      });
    } else {
      setFeedbacks(
        feedbacksListFormatter(feedback.id, nFeedbacks)
      );
    }
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
        <div className="rounded-t bg-theme-light  mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-white text-xl font-bold uppercase">
              Vendor Detail
            </h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <Breadcrumbs
            items={[
              { path: "/vendors", label: "Vendors" },
              { path: "", label: item ? item.display_name : "Vendor Detail" },
            ]}
          />
          <div className="container mx-auto">
            <div className="flex flex-wrap">
              <div className="pt-4 w-full">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-4">
                  <div className="py-5 flex-auto">
                    <div className="flex justify-between">
                      <div
                        className={
                          item.reviewed_by_pbgh
                            ? "mt-2 mb-4 w-full lg:w-8/12"
                            : "mt-2 mb-4 w-full lg:w-12/12"
                        }
                      >
                        <h3 className="text-3xl mb-2 font-semibold leading-normal">
                          {item.display_name}
                        </h3>
                        <div
                          className="text-blueGray-500 ck"
                          dangerouslySetInnerHTML={{
                            __html: item.description ? parseExternalLinks(item.description) : "" }}
                        ></div>
                      </div>
                      {item.reviewed_by_pbgh ? (
                        <div className="w-full lg:w-4/12 text-right">
                          <h6 className="text-xl font-semibold mt-2 mb-4 text-blueGray-500">
                            REVIEWED
                          </h6>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="py-5 flex-auto">
                    <div className="accordion-content alter">
                      <div className="accordion-item" key="categoryFeedbacks">
                        <header className="item-header py-4">
                          <h4 className="item-question uppercase">
                            Community Reviews
                          </h4>
                          <div className="item-icon">
                            <i className="fa-solid fa-angle-down"></i>
                          </div>
                        </header>
                        <div className="item-content">
                          {nFeedbacks.length ? (
                            <Feedbacks
                              loading={loading}
                              items={nFeedbacks}
                              comments={feedbackComments}
                              handleLikes={handleLikes}
                              handleComments={handleComments}
                              showComments={showComments}
                              setLatesetFeedbacks={setFeedbacks}
                              setFeedbackComments={setFeedbackComments}
                            />
                          ) : (
                            <div className="mb-6">
                              <p className="text-center text-blueGray-500">
                                Data not found.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="accordion-item">
                        <header className="item-header py-4">
                          <h4 className="item-question">EVALUATION CRITERIA</h4>
                          <div className="item-icon">
                            <i className="fa-solid fa-angle-down"></i>
                          </div>
                        </header>
                        <div id="criteria_content" className="item-content">
                          <div className="accordion-content sub-acc">
                            {criterias && criterias.length ? (
                              criterias.map((criteria) => (
                                <div
                                  className="accordion-item"
                                  key={criteria.id}
                                >
                                  <header
                                    id={`sub-${criteria.id}`}
                                    className="sub-item-header item-header py-4"
                                    onClick={() =>
                                      toggleSubAccordions(criteria.id)
                                    }
                                  >
                                    <h4 className="item-question text-gray-500">
                                      {criteria.title}
                                    </h4>
                                    <div className="item-icon">
                                      <i className="fa fa-plus"></i>
                                    </div>
                                  </header>
                                  <div className="item-content">
                                    <div className="flex flex-wrap">
                                      <div className="criteria  ck"
                                        dangerouslySetInnerHTML={{
                                          __html: criteria.description,
                                        }}
                                      ></div>
                                      <div  className="questions ck"
                                        dangerouslySetInnerHTML={{
                                          __html: criteria.question_answer,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="mb-6">
                                <p className="text-center text-blueGray-500">
                                  Data not found.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="accordion-item">
                        <header className="item-header py-4">
                          <h4 className="item-question uppercase">
                            3rd party info
                          </h4>
                          <div className="item-icon">
                            <i className="fa-solid fa-angle-down"></i>
                          </div>
                        </header>
                        <div className="item-content">
                          <div className="recom-list">
                            {thirdParty.length ? (
                              thirdParty.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex justify-between item"
                                >
                                  <div className="mt-2 mb-4 w-full lg:w-8/12">
                                    <div className="mb-3">
                                      <h3 className="text-md mb-1 font-semibold leading-normal">
                                        <a onClick={() => {
                                            const link = item.external_link;
                                            if (link) {
                                              window.open(link);
                                            }
                                          }}
                                        >
                                          {item.title}
                                        </a>
                                      </h3>
                                    </div>
                                    <div
                                      className="text-blueGray-500 ck"
                                      dangerouslySetInnerHTML={{__html: item.content}}
                                    ></div>
                                  </div>

                                  <div className="w-full lg:w-4/12 text-right">
                                    <a onClick={() => {
                                      const link = item.external_link;
                                      if (link) {
                                        window.open(link);
                                      }
                                    }}>
                                      <Image
                                        src={parseImage(item.image)}
                                        width={50}
                                        height={50}
                                        alt="..."
                                        priority={true}
                                      />
                                    </a>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="mb-6">
                                <p className="text-center text-blueGray-500">
                                  Data not found.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {item && item?.options ? (
                        <div className="accordion-item">
                          <header className="item-header py-4">
                            <h4 className="item-question uppercase">
                              Vendors in this category
                            </h4>
                            <div className="item-icon">
                              <i className="fa-solid fa-angle-down"></i>
                            </div>
                          </header>
                          <div className="item-content">
                            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border-0">
                              <div className="flex-auto py-10 pt-0">
                                <div className="flex flex-wrap">
                                  <div className="w-full lg:w-3/12 lg:px-4">
                                    {filters.length ?
                                      filters.map(
                                        (filter: any, i: number) => (
                                          <div key={i} className="bg-blueGray-100 px-4 rounded-lg pb-4 mb-4">
                                            <div className="container mx-auto">
                                              <div className="flex flex-wrap">
                                                <div className="pt-6 w-full">
                                                  <h6 className="text-sm font-semibold mb-2 ">
                                                    {filter.name}
                                                  </h6>
                                                  {filter.items.map(
                                                    (
                                                      source: any,
                                                      i: number
                                                    ) => (
                                                      <div
                                                        key={i}
                                                        className="lg:pt-1 pt-1"
                                                      >
                                                        <label className="inline-flex items-center cursor-pointer">
                                                          <input
                                                            id={`check_${source}`}
                                                            type="checkbox"
                                                            className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                                                            onChange={() => {
                                                              let cids =
                                                                checkboxes;
                                                              if (
                                                                cids.includes(
                                                                  source.id
                                                                )
                                                              ) {
                                                                cids =
                                                                  cids.filter(
                                                                    (n) =>
                                                                      n !==
                                                                      source.id
                                                                  );
                                                              } else {
                                                                cids = [
                                                                  ...checkboxes,
                                                                  source.id,
                                                                ];
                                                              }
                                                              setCheckboxes(
                                                                cids
                                                              );
                                                              filterVendorsByCategory(
                                                                cids
                                                              );
                                                            }}
                                                          />
                                                          <span className="ml-2 text-sm font-semibold text-blueGray-600">
                                                            {source.name}
                                                          </span>
                                                        </label>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      ): null
                                    }
                                  </div>
                                  <div className="w-full lg:w-9/12 lg:px-4">
                                    <div className="container mx-auto">
                                      { loading &&
                                        <p className="text-center">
                                          loading...
                                        </p>
                                      }
                                      { vendors && vendors.length ?
                                        vendors.map((vendor) => (
                                          <div
                                            key={vendor.id}
                                            className="w-full px-4 rating-vendor-list"
                                          >
                                            <Link
                                              href={`/vendors/${vendor.slug}`}
                                              as={`/vendors/${vendor.slug}`}
                                              passHref
                                            >
                                              <a>
                                                <div className="flex vendor-rev">
                                                  <div className="img">
                                                    <Image
                                                      className="border bg-blueGray-100 rounded"
                                                      src={parseImage(
                                                        vendor.image
                                                      )}
                                                      width={60}
                                                      height={60}
                                                      priority={true}
                                                    />
                                                  </div>
                                                  <div className="text">
                                                    <h6 className="name">
                                                      {
                                                        vendor.display_name
                                                      }
                                                    </h6>
                                                    <div
                                                      className="txt ck"
                                                      dangerouslySetInnerHTML={{
                                                        __html:
                                                          vendor.description,
                                                      }}
                                                    ></div>
                                                  </div>
                                                </div>
                                              </a>
                                            </Link>
                                          </div>
                                        )): (
                                        <div className="text-center">
                                          <p className="text-blueGray-500">
                                            No vendors meet this criteria.
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
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

export default VendorDetail;
