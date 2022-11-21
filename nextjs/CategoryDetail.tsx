import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Moment from "react-moment";
import { parseCookies } from "nookies";

import Feedbacks from "@/components/Feedbacks";
import Breadcrumbs from "@/components/Breadcrumbs/Index";

import {
  getCategoryOverview,
  getCategoryRecommendedContents,
  getCategoryCriterias,
  getCategoryFeedbacks,
  getFeedbackComments,
  likeAPI,
  searchVendorsAPI,
} from "@/lib/api";
import {
  CategoryDetailProps,
  CriteriaProps,
  FeedbackProps,
  FeedbackCommentProps,
  RecommendedContentProps,
  TopicOverviewProps,
  VendorProps,
} from "@/lib/types";
import {
  parseImage,
  parseFile,
  parseFilters,
  toggleAccordion,
  toggleSubAccordions
} from "@/utils/helpers";
import {
  feedbackLikeFormatter,
  feedbacksListFormatter,
  feedbackCommentsFormatter,
  toggleFeedbackComments,
} from "@/utils/feedback";

const CategoryDetail = ({ item }: CategoryDetailProps) => {
  const { token } = parseCookies();
  const [loading, setLoading] = React.useState(!1);
  const [topicOverview, setTopicOverview] =
    React.useState<TopicOverviewProps | null>(null);
  const [recommendedContents, setRecommendedContents] =
    React.useState<RecommendedContentProps[]>();
  const [criterias, setCriterias] = React.useState<CriteriaProps[]>();
  const [nFeedbacks, setFeedbacks] = React.useState<FeedbackProps[]>([]);
  const [checkboxes, setCheckboxes] = React.useState<number[]>([]);
  const [filters, setFilters] = React.useState<any[]>([]);
  const [vendors, setVendors] = React.useState<VendorProps[]>([]);
  const [feedbackComments, setFeedbackComments] = React.useState<
    FeedbackCommentProps[]
  >([]);

  useEffect(() => {
    const accordionBtns =
      document.querySelectorAll<HTMLElement>(".item-header");
    accordionBtns.forEach((accordion) => {
      accordion.onclick = function () {
        toggleAccordion(accordion);
      };
    });

    Promise.all([
      getCategoryOverview(item.id, token ?? ""),
      getCategoryRecommendedContents(item.id, token ?? ""),
      getCategoryCriterias(item.id, token ?? ""),
      getCategoryFeedbacks(item.id, token ?? ""),
    ]).then((res) => {
      if (res[0].code === 200) {
        // Topic Overview API response
        setTopicOverview(res[0]?.data?.topic_overview ?? null);
      }
      if (res[1].code === 200) {
        // Recommended Contents API response
        setRecommendedContents(res[1]?.data?.recommended_contents?.data ?? []);
      }
      if (res[2].code === 200) {
        // Criterias API response
        setCriterias(res[2]?.data?.criterias?.data ?? null);
      }
      if (res[3].code === 200) {
        // Feedbacks API response
        setFeedbacks(res[3]?.data?.feedbacks?.data ?? []);
      }
    });

    if (Object.keys(item?.options).length) {
      // Category filters
      setFilters(parseFilters(item?.options));
    }
    setCheckboxes([item.id]);
    filterVendorsByCategory([item.id]);
  }, []);

  // method to fetch vendors based on selected categories.
  const filterVendorsByCategory = (cids: number[]) => {
    setLoading(!0);
    // API to search vendors list
    searchVendorsAPI(token ?? "", { filters: cids.join(",") })
      .then((res) => {
        setLoading(!1);
        if (res.code === 200) {
          setVendors(res?.data?.vendors?.data ?? []);
        }
      })
      .catch((err) => {
        setLoading(!1);
      });
  };

  // method to perform like action on specific feedback.
  const handleLikes = (id: number) => {
    likeAPI({ feedback_id: id }, token ?? "")
      .then((res) => {
        if (res.code === 201 || res.code === 200) {
          setFeedbacks(
            feedbackLikeFormatter(id, nFeedbacks, res.message)
          );
        }
      });
  };

  // method to perform comment action on specific feedback.
  const handleComments = (feedback: any) => {
    setFeedbacks(
      toggleFeedbackComments(feedback.id, nFeedbacks)
    );
  };

  // method to show all comments of a specific feedback.
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
              Category Detail
            </h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <Breadcrumbs items={[
            { path: "/categories", label: "Categories" },
            { path: "", label: item ? item.name : "Category Detail" },
          ]} />
          <div className="container mx-auto">
            <div className="flex flex-wrap">
              <div className="pt-4 w-full">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-4">
                  <div className="py-5 flex-auto">
                    <div className="flex justify-between flex-wrap">
                      <div className="mt-2 mb-4 w-full lg:w-6/12">
                        <h3 className="text-3xl mb-2 font-semibold leading-normal">
                          {item.name}
                        </h3>
                        <div
                          className="text-blueGray-500 ck"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        ></div>
                      </div>

                      <div className="w-full lg:w-6/12 lg:text-right">
                        <Image
                          src={parseImage(item.image)}
                          alt={item.name}
                          width={500}
                          height={220}
                          priority={true}
                          layout="intrinsic"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="py-5 flex-auto">
                    <div className="accordion-content alter">
                      <div className="accordion-item" key="categoryFeedbacks">
                        <header className="item-header py-4">
                          <h4 className="item-question uppercase">
                            Value members see
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
                          <h4 className="item-question uppercase">
                            More about {item.name}
                          </h4>
                          <div className="item-icon">
                            <i className="fa-solid fa-angle-down"></i>
                          </div>
                        </header>
                        <div className="item-content">
                          {topicOverview && (
                            <div className="flex justify-between">
                              <div className="mt-2 mb-4 w-full lg:w-9/12">
                                <div className="mb-3">
                                  <h3 className="text-xl mb-1 font-semibold leading-normal">
                                    {item.name} Overview
                                  </h3>
                                  <a onClick={() => {
                                    const docs = topicOverview.docs;
                                    if (docs.length) {
                                      const file = parseFile(docs[0].file);
                                      window.open(file);
                                    }
                                  }}>
                                    <p className="occ">{topicOverview?.title}</p>
                                  </a>
                                  <p className="date">
                                    <Moment format="MMMM DD, YYYY">
                                      {topicOverview?.created_at}
                                    </Moment>
                                  </p>
                                </div>
                                <div
                                  className="text-blueGray-500 ck"
                                  dangerouslySetInnerHTML={{
                                    __html: topicOverview?.content,
                                  }}
                                ></div>
                              </div>
                              <div className="w-full lg:w-3/12 text-right">
                                <a
                                  onClick={() => {
                                    const docs = topicOverview.docs;
                                    if (docs.length) {
                                      const file = parseFile(docs[0].file);
                                      window.open(file);
                                    }
                                  }}
                                >
                                  <Image
                                    style={{ cursor: "pointer" }}
                                    src={parseImage(topicOverview?.image)}
                                    alt={topicOverview?.title}
                                    width={500}
                                    height={220}
                                    priority={true}
                                    layout="intrinsic"
                                  />
                                </a>
                              </div>
                            </div>
                          )}

                          <h3 className="text-xl font-semibold leading-normal mt-6 mb-4 text-gray-500">
                            Recommended Readings
                          </h3>
                          <div className="recom-list">
                            {recommendedContents &&
                            recommendedContents.length ? (
                              recommendedContents.map((recommendedContent) => (
                                <div
                                  className="flex justify-between item"
                                  key={
                                    recommendedContent.slug +
                                    "-" +
                                    recommendedContent.id
                                  }
                                >
                                  <div className="mt-2 mb-4 w-full lg:w-9/12">
                                    <div className="mb-3">
                                      <h3 className="text-md mb-1 font-semibold leading-normal">
                                        <a
                                          onClick={() => {
                                            const link = recommendedContent.external_link;
                                            if (link) {
                                              window.open(link);
                                            }
                                          }}
                                        >
                                          {recommendedContent.title}
                                        </a>
                                      </h3>
                                      <p className="occ">
                                        {recommendedContent.presenter}
                                      </p>
                                    </div>
                                    <div
                                      className="text-blueGray-500 ck"
                                      dangerouslySetInnerHTML={{
                                        __html: recommendedContent.content,
                                      }}
                                    ></div>
                                  </div>
                                  <div className="w-full lg:w-3/12 text-right">
                                    <a
                                      onClick={() => {
                                        const link =
                                          recommendedContent.external_link;
                                        if (link) {
                                          window.open(link);
                                        }
                                      }}
                                    >
                                      <Image
                                        style={{ cursor: "pointer" }}
                                        src={parseImage(
                                          recommendedContent.image
                                        )}
                                        alt={recommendedContent.title}
                                        width={500}
                                        height={220}
                                        priority={true}
                                        layout="intrinsic"
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
                      <div className="accordion-item">
                        <header id="criteria_header" className="item-header py-4">
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
                                  <table className="ques-table">
                                    <thead>
                                      <th>Evaluation Criteria</th>
                                      <th>Questions to Ask</th>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td>
                                          <div
                                            className="criteria ck mt-2 pr-4"
                                            dangerouslySetInnerHTML={{
                                              __html: criteria.description,
                                            }}
                                          ></div>
                                        </td>
                                        <td>
                                        <div
                                          className="qauetions ck pl-4"
                                          dangerouslySetInnerHTML={{
                                            __html: criteria.question_answer,
                                          }}
                                        ></div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                    <div className="flex-wrap hidden">
                                      <div
                                        className="criteria ck mt-2 pr-4"
                                        dangerouslySetInnerHTML={{
                                          __html: criteria.description,
                                        }}
                                      ></div>
                                      <div
                                        className="qauetions ck pl-4"
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
                                  No vendors meet this criteria.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <header className="item-header py-4">
                          <h4 className="item-question uppercase">
                            {item.name} Vendors
                          </h4>
                          <div className="item-icon">
                            <i className="fa-solid fa-angle-down"></i>
                          </div>
                        </header>
                        <div className="item-content">
                          <div className="flex flex-col min-w-0 break-words w-full mb-6 border-0">
                            <div className="flex-auto py-10 pt-0">
                              <div className="flex flex-wrap">
                                <div className="w-full lg:w-3/12 lg:px-4">
                                  {filters.length ?
                                    filters.map((filter: any, i: number) => (
                                      <div key={i} className="bg-blueGray-100 px-4 rounded-lg pb-4 mb-4">
                                        <div className="container mx-auto">
                                          <div className="flex flex-wrap">
                                            <div className="pt-6 w-full">
                                              <h6 className="text-sm font-semibold mb-2">{filter.name}</h6>
                                              {filter.items.map(
                                                (source: any, i: number) => (
                                                  <div key={i} className="lg:pt-1 pt-1">
                                                    <label className="inline-flex items-center cursor-pointer">
                                                      <input
                                                        id={`check_${source}`}
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
                                                          filterVendorsByCategory(cids);
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
                                    )): null
                                  }
                                </div>
                                <div className="w-full lg:w-9/12 lg:px-4">
                                  <div className="container mx-auto">
                                    {loading &&
                                      <p className="text-center">
                                        loading...
                                      </p>
                                    }

                                    {vendors && vendors.length ? vendors.map((vendor) => (
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
                                                  src={parseImage(vendor.image)}
                                                  height={60}
                                                  width={60}
                                                  alt="..."
                                                  priority={true}
                                                />
                                              </div>
                                              <div className="text">
                                                <h6 className="name">{vendor.display_name}</h6>
                                                <div
                                                  className="txt ck"
                                                  dangerouslySetInnerHTML={{__html: vendor.description}}
                                                ></div>
                                              </div>
                                            </div>
                                          </a>
                                        </Link>
                                      </div>
                                    )): (
                                      <div className="text-center">
                                        <p className="text-blueGray-500">
                                          Data not found.
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

export default CategoryDetail;
