import React from "react";
import Modal from "react-modal";
import { parseCookies } from "nookies";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonLoader from "@/components/ButtonLoader";

import { contactAPI } from "@/lib/api";
import { ContactModalProps } from "@/lib/types";

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

export const ContactModal = ({
  open,
  handleModal
}: ContactModalProps) => {
  const [loading, setLoading] = React.useState(!1);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState({
    name: !1,
    email: !1,
    phone: !1,
    message: !1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    /**
     * Event handler to submit Login Form.
     */
    e.preventDefault();
    let err = errors;
    if (!name.trim().length) {
      err = {...err, name: !0};
    }
    if (!email.trim().length) {
      err = {...err, email: !0};
    }
    if (!phone.trim().length) {
      err = {...err, phone: !0};
    }
    if (!message.trim().length) {
      err = {...err, message: !0};
    }
    if (err.name || err.email || err.phone || err.message) {
      setErrors(err);
      return;
    }

    const cookies = parseCookies();
    const payload = {
      name,
      email,
      phone,
      message
    }
    setLoading(!0);
    contactAPI(payload, cookies?.token ?? '').then((res) => {
      setLoading(!1);
      if (res.code === 200) {
        toast(res.message);
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
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">Contact</h6>
          <button onClick={closeModal}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="mt-5 mb-5">
          <form onSubmit={handleSubmit}>
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                className="border px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Name"
                onChange={
                  (e: React.FormEvent<HTMLInputElement>) => {
                  setErrors({...errors, name: !1});
                  setName(e.currentTarget.value);
                }}
              />
              {errors.name && <p style={{color: 'red'}}>This field is required</p>}
            </div>

            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                className="border px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Email"
                onChange={
                  (e: React.FormEvent<HTMLInputElement>) => {
                  setErrors({...errors, email: !1});
                  setEmail(e.currentTarget.value);
                }}
              />
              {errors.email && <p style={{color: 'red'}}>This field is required</p>}
            </div>

            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Phone
              </label>
              <input
                type="text"
                name="phone"
                className="border px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Phone"
                onChange={
                  (e: React.FormEvent<HTMLInputElement>) => {
                  setErrors({...errors, phone: !1});
                  setPhone(e.currentTarget.value);
                }}
              />
              {errors.phone && <p style={{color: 'red'}}>This field is required</p>}
            </div>

            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="Message"
              >
                Message
              </label>
              <textarea
                rows={4}
                cols={80}
                name="message"
                value={message}
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