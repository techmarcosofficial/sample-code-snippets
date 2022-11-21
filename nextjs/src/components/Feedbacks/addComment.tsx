import React from "react";
import { parseCookies } from "nookies";
import { useStore } from "@/reducers/auth";
import { feedbackAPI, getFeedbackComments } from "@/lib/api";
import { AddCommentProps, FeedbackCommentProps } from "@/lib/types";
import { showAddComment } from "@/utils/helpers";

const AddComment = ({
  feedbacks,
  selectedFeedback,
  feedbackComments,
  setLatesetFeedbacks,
  setFeedbackComments
}: AddCommentProps) => {
  const { user } = useStore();
  const cookies = parseCookies();
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState({
    message: !1,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let err = errors;
    if (!message.trim().length) {
      err = { ...err, message: !0 };
    }
    if (err.message) {
      setErrors(err);
      return;
    }
    const fd = new FormData();
    fd.append("feedback", message);
    fd.append("parent_id", selectedFeedback.id.toString());
    feedbackAPI(fd, cookies?.token ?? "")
      .then((res) => {
        if (res.code === 200) {
          let comments: FeedbackCommentProps[] = [{
            id: 0,
            name: user ? user.display_name : "",
            image: user ? user.image : "",
            role: user ? user.role.name : "",
            feedback_for: selectedFeedback.category_id ? "Category" : "Vendor",
            feedback: message,
          }];
          setMessage("");
          setLatesetFeedbacks(
            feedbacks.map((feedback) => {
              if (feedback.id === selectedFeedback.id) {
                feedback.no_of_comments += 1;
                feedback.openComment = !1;
                return feedback;
                }
              return feedback;
            })
          );
          if (!feedbackComments.length) {
            getFeedbackComments(selectedFeedback.id, cookies?.token ?? "").then((res) => {
              if (res.code === 200) {
                comments = [
                  ...res?.data?.comments.map(
                    (comment: any) => {
                      return {
                        name: comment.category_id
                            ? comment.category_name
                            : comment.organization_name,
                        image:
                            comment.category_id
                                ? comment.category_image
                                : comment.organization_image,
                        role: comment.category_id
                            ? "Category"
                            : "Vendor",
                        feedback_for:
                            comment.category_id
                                ? "Category"
                                : "Vendor",
                        feedback:
                            comment.feedback,
                    };
                  }
                ),
                ...comments,
                ];
                setFeedbackComments(comments);
              }
            });
            return;
        } else {
          setFeedbackComments([...feedbackComments, ...comments]);
        }
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
  }

  return (
    <div className="item reply">
      <form id="commentForm" onSubmit={onSubmit}>
        <div className="xl:w-8/12 mb-12 xl:mb-0">
          <div className="relative w-full mb-3">
            <label
              className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
              htmlFor="Message"
            >
              Comment
            </label>
            <textarea
              rows={4}
              cols={80}
              name="message"
              className="border px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
              placeholder="Type a message..."
              onChange={(
                e: React.FormEvent<HTMLTextAreaElement>
              ) => {
                setErrors({ ...errors, message: !1 });
                setMessage(e.currentTarget.value);
              }}
            />
            {errors.message && (
              <p style={{ color: "red" }}>
                This field is required
              </p>
            )}
          </div>
            <div className="flex justify-end text-center mt-5">
              <button
                className="bg-theme-light text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 mr-4"
                  type="button"
                  onClick={() => {
                    setLatesetFeedbacks(
                      showAddComment(feedbacks, selectedFeedback.id)
                    );
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                  type="submit"
                >
                    SUBMIT
                  </button>
                </div>
            </div>
        </form>
    </div>
  )
}

export default AddComment;