import React from "react";
import Image from "next/image";
import { parseImage } from "@/utils/helpers";
import { FeedbackCommentsComponentProps } from "@/lib/types";

const FeedbackComments = ({ comments }: FeedbackCommentsComponentProps) => (
  <>
    {comments.map((comment, i) => (
      <div key={i} className="item reply">
        <div className="upper">
          <div className="img">
            <Image
              src={parseImage(comment.image)}
              className="bg-white rounded-full border"
              alt="..."
              width={70}
              height={70}
            />
          </div>
          <div className="right">
            <div className="name">{comment.name}</div>
            <div className="occ">Organisation</div>
          </div>
        </div>
        <div className="cmt">
          <span className="bd">Re: {comment.feedback_for}</span>
          <div className="txt">{comment.feedback}</div>
        </div>
        {/* <div className="action">
          <span className="ac"><i className="fa-regular fa-thumbs-up"></i></span>
          <span className="ac"><i className="fa-regular fa-message"></i></span>
          </div> 
        */}
      </div>
    ))}
  </>
);

export default FeedbackComments;