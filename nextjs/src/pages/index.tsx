import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import nookies, { parseCookies } from "nookies";

import Header from "@/layouts/Header";
import Navbar from "@/components/Navbars/AdminNavbar";
import HomeCarousel from "@/components/HomeCarousel";
import FeaturedCategories from "@/components/Categories/FeaturedCategories";
import LatestCommunityFeedbacks from "@/components/Feedbacks/LatestCommunityFeedbacks";
import TrendingVendors from "@/components/Vendors/TrendingVendors";

import {
  getSlides,
  getFeaturedCategories,
  getLatestFeedbacks,
  getFeedbackComments,
  getTrendingVendors,
  likeAPI,
} from "@/lib/api";
import {
  HomePageProps,
  SlidesCategories,
  CategoryProps,
  FeedbackProps,
  VendorProps,
  FeedbackCommentProps,
} from "@/lib/types";
import {
  feedbacksFormatter,
  feedbackLikeFormatter,
  feedbacksListFormatter,
  feedbackCommentsFormatter,
  toggleFeedbackComments,
} from "@/utils/feedback";
import { togglePlusSignAccordion } from "@/utils/helpers";

export default function Home({
  slides,
  featuredCategories,
  latestFeedbacks,
  trendingVendors,
}: HomePageProps) {
  const { token } = parseCookies();
  const [loading, setLoading] = React.useState(!1);
  const [nFeedbacks, setLatesetFeedbacks] = React.useState<FeedbackProps[]>([]);
  const [feedbackComments, setFeedbackComments] = React.useState<FeedbackCommentProps[]>([]);

  useEffect(() => {
    const accordionBtns =
      document.querySelectorAll<HTMLElement>(".item-header");
    accordionBtns.forEach((accordion) => {
      // Default open fetaured categories accordion all items.
      togglePlusSignAccordion(accordion);
      // Toggle accordion as per selected
      accordion.onclick = function () {
        togglePlusSignAccordion(accordion);
      };
    });

    if (latestFeedbacks && latestFeedbacks.length) {
      setLatesetFeedbacks(
        feedbacksFormatter(latestFeedbacks));
    }
  }, []);

  // method to handle like button action in community section.
  const handleLikes = (id: number) => {
    likeAPI({feedback_id: id}, token ?? "")
      .then((res) => {
        if (res.code === 201 || res.code === 200) {
          setLatesetFeedbacks(
            feedbackLikeFormatter(id, nFeedbacks, res.message));
        }
    });
  };

  // method to show/hide comments in community section.
  const handleComments = (feedback: any) => {
    setLatesetFeedbacks(
      toggleFeedbackComments(feedback.id, nFeedbacks));
  };

  // method to show a feedback all comments in community section.
  const showComments = (feedback: any) => {
    if (!feedback.showComments) {
      setLoading(!0);
      getFeedbackComments(feedback.id, token ?? "").then((res) => {
        setLoading(!1);
        if (res.code === 200) {
          setFeedbackComments(
            feedbackCommentsFormatter(res?.data?.comments)
          );
          setLatesetFeedbacks(
            feedbacksListFormatter(feedback.id, nFeedbacks));
        }
      });
    } else {
      setLatesetFeedbacks(
        feedbacksListFormatter(feedback.id, nFeedbacks));
    }
  };

  return (
    <>
      <Header title="Home" />
      <Navbar />
      <main>
        {slides ? (
          <div className="home-slider">
            <HomeCarousel items={slides} />
          </div>
        ): null}

        <section className="pb-20 bg-blueGray-100 pt-2">
          <div className="container mx-auto md:px-4 px-2">
            {/* Featured categories section */}
            {
              featuredCategories.length ? (
                <FeaturedCategories
                  categories={featuredCategories}
                />
              ): null
            }

            {/* Community latest feedbacks section */}
            {
              nFeedbacks.length ? (
                <LatestCommunityFeedbacks
                  loading={loading}
                  items={nFeedbacks}
                  comments={feedbackComments}
                  handleLikes={handleLikes}
                  handleComments={handleComments}
                  showComments={showComments}
                  setLatesetFeedbacks={setLatesetFeedbacks}
                  setFeedbackComments={setFeedbackComments}
                />
              ): null
            }

            {/* Trending vendors section */}
            {
              trendingVendors.length ? (
                <TrendingVendors vendors={trendingVendors} />
              ): null
            }
          </div>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = nookies.get(context);
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      }
    };
  }

  let slides: SlidesCategories[] = [];
  let featuredCategories: CategoryProps[] = [];
  let latestFeedbacks: FeedbackProps[] = [];
  let trendingVendors: VendorProps[] = [];
  const [
    slidesResponse,
    featuredCategoriesResponse,
    feedbacksResponse,
    trendingVendorsResponse] =
    await Promise.all([
      getSlides(token),
      getFeaturedCategories(token),
      getLatestFeedbacks(token),
      getTrendingVendors(token)
    ]);
  if (slidesResponse.code === 200) {
    slides = slidesResponse?.data?.categories ?? [];
  }
  if (featuredCategoriesResponse.code === 200) {
    featuredCategories = featuredCategoriesResponse?.data?.categories ?? [] ;
  }
  if (feedbacksResponse.code === 200) {
    latestFeedbacks = feedbacksResponse?.data?.latestFeedbacks ?? [];
  }
  if (trendingVendorsResponse.code === 200) {
    trendingVendors = trendingVendorsResponse?.data?.vendors ?? [];
  }
  return {
    props: {
      token: token ?? null,
      slides,
      featuredCategories,
      latestFeedbacks,
      trendingVendors,
    },
  };
};
