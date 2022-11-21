import React from "react";
import Link from "next/link";
import Image from "next/image";
import AddComment from "@/components/Feedbacks/addComment";
import FeedbackComments from "@/components/Feedbacks/FeedbackComments";

import { FeedbacksComponentProps, } from "@/lib/types";
import { parseImage } from "@/utils/helpers";

const LatestCommunityFeedbacks = ({
  loading,
  items,
  comments,
  handleLikes,
  handleComments,
  showComments,
  setLatesetFeedbacks,
  setFeedbackComments,
}: FeedbacksComponentProps) => {
  return (
    <div className="flex flex-wrap mt-10">
      <div className="w-full px-4 mr-auto ml-auto">
        <div className="relative w-full max-w-full flex-grow flex-1">
          <h3 className="text-3xl mb-3 font-semibold leading-normal text-theme uppercase">
            Latest Community Feedback
          </h3>
        </div>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
        <div className="rounded-t mb-0 px-4 border-0 mt-4">
          <div className="flex flex-wrap items-center"></div>
        </div>
        <div className="block w-full overflow-x-auto">
          <div className="comments-outer">
            {items.map((item) => (
              <div key={item.id} className="item">
                <div className="upper">
                  <div className="img shrink-0">
                    <Image
                      src={parseImage(item.organization_image)}
                      className="bg-white rounded-full border align-middle"
                      alt="..."
                      height={70}
                      width={70}
                    />
                  </div>
                  <div className="right">
                    <div className="name">{item.organization_name}</div>
                      <div className="cmt mb-0">
                        <span className="bd">
                          {item.feedback_for.charAt(0).toUpperCase() + item.feedback_for.slice(1)}: &nbsp;
                            {item.feedback_for == "category" ? (
                              <Link
                                href={`/categories/${item.category_slug}`}
                                as={`/categories/${item.category_slug}`}
                              >
                                <a>{item.category_name}</a>
                              </Link>
                            ) : (
                              <Link
                                href={`/vendors/${item.vendor_slug}`}
                                as={`/vendors/${item.vendor_slug}`}
                              >
                                <a>{item.vendor_name}</a>
                              </Link>
                            )
                          } &nbsp;
                        </span>
                        <div className="txt ck"
                          dangerouslySetInnerHTML={{__html: item.feedback}}></div>
                        </div>
                      </div>
                    </div>

                    <div className="action">
                      <span className="ac" onClick={() => handleLikes(item.id)}>
                        <i
                          className="fa-regular fa-thumbs-up"
                          style={{color: item.liked_by_curent_user === "yes" ? "#507DBC" : "#484848"}}></i>
                        &nbsp;
                        {item.no_of_likes > 0 ? item.no_of_likes : ""}
                      </span>
                      <span
                        className="ac"
                        onClick={() => handleComments(item)}
                      >
                        <i className="fa-regular fa-message"></i>
                        &nbsp;
                        {item.no_of_comments > 0 ? item.no_of_comments : ""}
                      </span>
                      <span
                        className="ac"
                        onClick={() => showComments(item)}
                        style={{
                          fontSize: 12,
                          display: item.no_of_comments > 0 ? "inline" : "none",
                        }}
                      >
                        {!item.toggleCommentTitle ? "Show comments" : "Hide Comments"}
                      </span>
                    </div>

                    {/* Latest Feedbacks */}
                    {loading && (<p className="item reply">loading...</p>)}
                    {!loading && item.showComments &&
                      <FeedbackComments comments={comments} />
                    }
                    {item.openComment && (
                      <AddComment
                        feedbacks={items}
                        selectedFeedback={item}
                        feedbackComments={comments}
                        setLatesetFeedbacks={setLatesetFeedbacks}
                        setFeedbackComments={setFeedbackComments}
                      />
                    )}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LatestCommunityFeedbacks;