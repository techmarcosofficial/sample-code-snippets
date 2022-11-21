import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Auth from "@/layouts/Auth";
import Header from "@/layouts/Header";
import ButtonLoader from "@/components/ButtonLoader";

import { resetPasswordAPI } from "@/lib/api";
import { ResetPasswordProps } from "@/lib/types";
import { PASSWORD_NOT_MATCHED } from "@/lib/constants";
import { useStore } from "@/reducers/auth";

export default function ResetPassword() {
  const router = useRouter();
  const { isLoggedIn } = useStore();
  const [loading, setLoading] = React.useState(!1);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const [errors, setErrors] = React.useState({
    newPassword: !1,
    confirmNewPassword: !1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    /**
     * Event handler to submit Reset Password Form.
     */
    e.preventDefault();
    let err = errors;
    if (!newPassword.trim().length) {
      err = {...err, newPassword: !0};
    }
    if (!confirmNewPassword.trim().length) {
      err = {...err, confirmNewPassword: !0};
    }
    if (err.newPassword || err.confirmNewPassword) {
      setErrors(err);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error(PASSWORD_NOT_MATCHED);
      return;
    }

    const payload: ResetPasswordProps = {
      token: router?.query?.token as string,
      password: newPassword,
      confirm_password: confirmNewPassword,
    }
    setLoading(!0);
    resetPasswordAPI(payload).then((res) => {
      setLoading(!1);
      toast(res.message);
      if (res.code && res.code === 200) {
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    });
  }

  if (isLoggedIn) {
    router.push('/');
  }

  return (
    <>
      <Header title="Reset Password" />
      <ToastContainer />
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Reset Password
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
                      New Password
                    </label>
                    <input
                      type="password"
                      className="border px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={newPassword}
                      placeholder="New Password"
                      onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        setErrors({...errors, newPassword: !1});
                        setNewPassword(e.currentTarget.value);
                      }}
                    />
                    {errors.newPassword && <p style={{color: 'red'}}>This field is required</p>}
                  </div>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="border px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={confirmNewPassword}
                      placeholder="Confirm New Password"
                      onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        setErrors({...errors, confirmNewPassword: !1});
                        setConfirmNewPassword(e.currentTarget.value);
                      }}
                    />
                    {errors.confirmNewPassword && <p style={{color: 'red'}}>This field is required</p>}
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

ResetPassword.layout = Auth;
