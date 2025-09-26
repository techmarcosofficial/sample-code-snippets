import React from "react";
import Image from "next/image";
import Modal from "react-modal";
import { parseCookies } from "nookies";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonLoader from "@/components/ButtonLoader";

import { feedbackAPI } from "@/lib/api";
import { ReviewModalProps } from "@/lib/types";
import { parseImage } from "@/utils/helpers";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#__next');

export const ReviewModal = ({
  id,
  name,
  description,
  image,
  type,
  open,
  handleModal
}: ReviewModalProps) => {
  const [loading, setLoading] = React.useState(!1);
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState({
    message: !1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    /**
     * Event handler to submit Login Form.
     */
    e.preventDefault();
    let err = errors;
    if (!message.trim().length) {
        err = {...err, message: !0};
    }
    if (err.message) {
      setErrors(err);
      return;
    }

    const cookies = parseCookies();
    const fd = new FormData();
    fd.append('feedback', message);
    if (type === 'category') {
      fd.append('category_id', id.toString());
    } else if (type === 'vendor') {
      fd.append('vendor_id', id.toString());
    } else {
      fd.append('parent_id', id.toString());
    }
    setLoading(!0);
    feedbackAPI(fd, cookies?.token ?? '').then((res) => {
      setLoading(!1);
      if (res.code === 200) {
        toast.success(res.message);
        closeModal();
        return;
      }
      toast.error(res.message);
    }).catch((err) => {
      toast.error(err.message);
    });
  }

  const closeModal = () => {
    handleModal(false);
  }

  return (
    <div>
      <ToastContainer />
      <Modal
        isOpen={open}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Reset Password Modal"
      >
        <div className="text-center flex justify-end">
          {/* <h6 className="text-blueGray-700 text-xl font-bold">Feedback</h6> */}
          <button onClick={closeModal}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="mt-5 mb-5">

          <div className="flex flex-wrap min-w-0 break-words">
            <div className="w-full lg:w-8/12 mb-10 lg:mb-0 py-5">
              <h6 className="text-blueGray-700 text-xl font-bold">{name}</h6>
              <div className="text-blueGray-600 py-4 ck" dangerouslySetInnerHTML={{__html: description}}></div>
            </div>
            <div className="w-full lg:w-4/12 mb-12 lg:mb-0 lg:px-4 lg:text-right">
              <div className="py-5">
                <div className="sq-img inline-block">
                  <Image
                    src={parseImage(image)}
                    alt=""
                    className="align-middle rounded-lg object-cover"
                    height={150}
                    width={150}
                    layout="fill"
                  />
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="Message"
              >
                Share your experience
              </label>
              <textarea
                rows={4}
                cols={80}
                name="message"
                className="border px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                placeholder="Type a message..."
                onChange={
                  (e: React.FormEvent<HTMLTextAreaElement>) => {
                    setErrors({...errors, message: !1});
                    setMessage(e.currentTarget.value);
                }}
              />
              {errors.message && <p style={{color: 'red'}}>This field is required</p>}
            </div>

            <div className="text-center mt-6">
              {loading ? (
                <ButtonLoader />
              ) : (
                <button
                  className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-4 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="submit"
                >
                  SUBMIT
                </button>
              )}
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
