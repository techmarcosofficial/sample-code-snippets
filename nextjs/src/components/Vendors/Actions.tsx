import React from "react";
import Link from "next/link";
import { ContactModal } from "@/components/Modals/Contact";
import { ReviewModal } from "@/components/Modals/Review";
import { ActionsProps } from "@/lib/types";

export default function Actions({
  type,
  item
}: ActionsProps) {
  const [openContact, setOpenContact] = React.useState(!1);
  const [openReview, setOpenReview] = React.useState(!1);
  const handleContactModal = (t: boolean) => setOpenContact(t);
  const handleReviewModal = (t: boolean) => setOpenReview(t);
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6 border-b">
          <div className="text-center">
            <h6 className="text-blueGray-700 text-xl font-bold uppercase">Actions</h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <div className="container mx-auto action-btn-outer">
            <div className="text-center mt-6">
              <Link href="/compare" as="/compare">
                <a
                  className="bg-theme text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-4 block rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem('vids', JSON.stringify([item.id]));
                  }}
                >
                  COMPARE
                </a>
              </Link>
            </div>
            <div className="text-center mt-6">
              <button
                className="bg-theme text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-4 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                type="button"
                onClick={() => setOpenContact(!openContact)}
              >
                CONTACT
              </button>
            </div>
            <div className="text-center mt-6">
              <button
                className="bg-theme text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-4 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                type="button"
                onClick={() => setOpenReview(!openReview)}
              >
                REVIEW
              </button>
            </div>
          </div>
        </div>
      </div>
      <ContactModal open={openContact} handleModal={handleContactModal} />
      <ReviewModal
        type={type}
        id={item.id}
        name={item.display_name}
        description={item.description}
        image={item.image}
        open={openReview}
        handleModal={handleReviewModal} />
      </>
  );
}
