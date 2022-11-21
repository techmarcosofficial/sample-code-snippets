import { FeedbackProps } from "@/lib/types";

export const feedbacksFormatter = (feedbacks: FeedbackProps[]) => {
  return feedbacks.map((feedbacks) => {
    return {
      ...feedbacks,
      openComment: !1,
      showComments: !1,
      toggleCommentTitle: !1,
    };
  });
}

export const feedbackLikeFormatter = (
  feedbackId: number,
  feedbacks: FeedbackProps[],
  message: string
) => {
  return feedbacks.map((feedback) => {
    if (feedback.id === feedbackId) {
      if (message === "Liked") {
        feedback.liked_by_curent_user = "yes";
        feedback.no_of_likes++;
      } else {
        feedback.liked_by_curent_user = "no";
        feedback.no_of_likes--;
      }
      return feedback;
    }
    return feedback;
  })
}

export const feedbacksListFormatter = (
  feedbackId: number,
  feedbacks: FeedbackProps[]
) => {
  return feedbacks.map((feedback) => {
    if (feedback.id === feedbackId) {
      feedback.toggleCommentTitle = feedback.showComments ? !1 : !0;
      feedback.showComments = !feedback.showComments;
      return feedback;
    }
    return feedback;
  });
}

export const feedbackCommentsFormatter = (
  comments: any[]
) => {
  return comments.map((comment: any) => {
    return {
      id: comment.id,
      name: comment.category_id
        ? comment.category_name
        : comment.organization_name,
      image: comment.category_id
        ? comment.category_image
        : comment.organization_image,
      role: comment.category_id ? "Category" : "Vendor",
      feedback_for: comment.category_id ? "Category" : "Vendor",
      feedback: comment.feedback,
    };
  })
}

export const toggleFeedbackComments = (
  feedbackId: number,
  feedbacks: FeedbackProps[]
) => {
  return feedbacks.map((feedback) => {
    if (feedback.id === feedbackId) {
      feedback.openComment = !feedback.openComment;
      return feedback;
    }
    return feedback;
  });
}