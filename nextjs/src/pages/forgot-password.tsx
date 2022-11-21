import React from "react";
import Link from "next/link";
import Router from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Auth from "@/layouts/Auth";
import Header from "@/layouts/Header";
import ButtonLoader from "@/components/ButtonLoader";

import { useStore } from "@/reducers/auth";
import { forgotPasswordAPI } from "@/lib/api";

export default function ForgotPassword() {
  const { isLoggedIn } = useStore();
  const [loading, setLoading] = React.useState(!1);
  const [email, setEmail] = React.useState("");
  const [errors, setErrors] = React.useState({
    email: !1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    /**
     * Event handler to submit Forgot Password Form.
     */
    e.preventDefault();
    let err = errors;
    if (!email.trim().length) {
      err = { ...err, email: !0 };
    }
    if (err.email) {
      setErrors(err);
      return;
    }
    setLoading(!0);
    forgotPasswordAPI(email).then((res) => {
      setLoading(!1);
      toast(res.message);
      setEmail("");
    });
  };

  if (isLoggedIn) {
    Router.push("/");
  }

  return (
    <>
      <Header title="Forgot Password" />
      <ToastContainer />
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Forgot Password
                  </h6>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form onSubmit={handleSubmit}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="border px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={email}
                      placeholder="Email"
                      onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        setErrors({ ...errors, email: !1 });
                        setEmail(e.currentTarget.value);
                      }}
                    />
                    {errors.email && (
                      <p style={{ color: "red" }}>This field is required</p>
                    )}
                  </div>

                  <div className="relative w-full">
                    <div className="w-1/2 block text-blueGray-600 font-bold">
                      <Link href="/login">
                        <small>Login</small>
                      </Link>
                    </div>
                  </div>

                  <div className="text-center mt-6">
                    {loading ? (
                      <ButtonLoader />
                    ) : (
                      <button
                        className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-4 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        type="submit"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ForgotPassword.layout = Auth;
