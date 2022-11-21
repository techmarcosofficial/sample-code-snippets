import React from "react";
import Image from "next/image";
import AddComment from "@/components/Feedbacks/addComment";
import FeedbackComments from "@/components/Feedbacks/FeedbackComments";

import { FeedbacksComponentProps } from "@/lib/types";
import { parseImage, parseExternalImages } from "@/utils/helpers";

const Feedbacks = ({
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
    <div className="flex flex-wrap mt-4">
      <div className="w-full mr-auto ml-auto">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 rounded bg-white">
          <div className="block w-full overflow-x-auto">
            <div className="comments-outer m-0">
              { items.map((item) => (
                <div key={item.id} className="item">
                  <div className="upper">
                    <div className="img shrink-0">
                      <Image
                        src={parseImage(item.organization_image)}
                        className="bg-white rounded-full border align-middle"
                        alt="..."
                        height={60}
                        width={60}
                        priority={true}
                      />
                    </div>
                    <div className="right">
                      <div className="name">{item.organization_name}</div>
                      <div className="cmt mb-0">
                        <div
                          className="txt ck"
                          dangerouslySetInnerHTML={{
                            __html: item.feedback ? parseExternalImages(item.feedback) : ""
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="action">
                    <span className="ac" onClick={() => handleLikes(item.id)}>
                      <i
                        className="fa-regular fa-thumbs-up"
                        style={{ color: item.liked_by_curent_user === "yes" ? "#507DBC" : "#484848"}}
                        >
                      </i>
                      &nbsp;
                      {item.no_of_likes > 0 ? item.no_of_likes : ""}
                    </span>
                    <span className="ac" onClick={() => handleComments(item)}
                    >
                      <i className="fa-regular fa-message"></i>
                      &nbsp;
                      {item.no_of_comments > 0 ? item.no_of_comments : ""}
                    </span>
                    <span className="ac"
                      onClick={() => showComments(item)}
                      style={{
                        fontSize: 12,
                        display: item.no_of_comments > 0 ? "inline" : "none",
                      }}
                    >
                      {!item.toggleCommentTitle ? "Show comments" : "Hide Comments"}
                    </span>
                  </div>
                    
                  {loading && (<p className="item reply">loading...</p>)}
                  {
                    (!loading && item.showComments) ? (
                      <div id={`feedback-${item.id}-comments`}>
                        <FeedbackComments comments={comments} />
                      </div>
                    ): null
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feedbacks;