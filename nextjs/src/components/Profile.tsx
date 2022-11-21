import React, { useEffect } from "react";
import Image from "next/image";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ButtonLoader from "@/components/ButtonLoader";
import Breadcrumbs from "@/components/Breadcrumbs/Index";
import { PROFILE } from "@/components/Breadcrumbs/feeds";
import { ResetPasswordModal } from "@/components/Modals/ResetPassword";

import { useStore } from "@/reducers/auth";
import { updateProfileAPI } from "@/lib/api";
import { UserProps } from "@/lib/types";
import { parseImage } from "@/utils/helpers";

export default function Profile() {
  const { user, token, updateUser } = useStore();
  const [loading, setLoading] = React.useState(!1);
  const [nUser, setUser] = React.useState<UserProps | null>(null);
  const [nToken, setToken] = React.useState<string | null>(null);
  const [edit, setEdit] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState<File>();
  const [errors, setErrors] = React.useState({
    name: !1,
  });

  useEffect(() => {
    if (user) {
      setUser(user);
      setToken(token);
      setName(user?.display_name ?? "");
      setDescription(user?.description ?? "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    /**
     * Event handler to submit Profile Form.
     */
    e.preventDefault();
    let err = errors;
    if (!name.trim().length) {
      err = { ...err, name: !0 };
    }
    if (err.name) {
      setErrors(err);
      return;
    }

    const cookies = parseCookies();
    const fd = new FormData();
    fd.append("display_name", name);
    fd.append("description", description);
    if (image) {
      fd.append("profile_image", image);
    }
    setLoading(!0);
    updateProfileAPI(fd, cookies?.token ?? "").then((res) => {
      setLoading(!1);
      if (res.code === 200) {
        toast.success(res.message);
        updateUser(res.data.user);
        setTimeout(() => setEdit(false), 2000);
        return;
      }
      toast.error(res.message);
    });
  };

  const handleModal = (t: boolean) => {
    setOpen(t);
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
        <div className="rounded-t bg-theme-light mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-white text-xl font-bold uppercase">
              My Profile
            </h6>
            {!edit ? (
              <button
                className="bg-white active:bg-blueGray-600 text-theme font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setEdit(!edit)}
              >
                Update
              </button>
            ) : (
              <button
                className="bg-white active:bg-blueGray-600 text-theme font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => {
                  setEdit(!edit);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <Breadcrumbs items={PROFILE} />
          <div className="mx-auto">
            <div className="flex flex-wrap">
              {!edit ? (
                <div className="lg:pt-12 pt-4 w-full">
                  <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8">
                    <div className=" flex-auto">
                      {
                        nUser ? (
                          <>
                            <div className="flex flex-wrap pb-4">
                              <div className="img shrink-0">
                                <Image
                                  src={parseImage(nUser.image)}
                                  className="bg-white  border align-middle"
                                  alt="..."
                                  height={70}
                                  width={70}
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap pb-4">
                              <p className="text-xl font-semibold">Name : </p>
                              <p className="text-xl font-semibold text-blueGray-500 ml-2">
                                {nUser.display_name}
                              </p>
                            </div>
                            <div className="flex flex-wrap pb-4">
                              <p className="text-xl font-semibold">Email : </p>
                              <p className="text-xl font-semibold text-blueGray-500 ml-2">
                                {nUser.email}
                              </p>
                            </div>
                            <div className="flex flex-wrap pb-4">
                              <p className="text-xl font-semibold">Description : </p>
                              <p className="text-xl font-semibold text-blueGray-500 ml-2">
                                {nUser.description}
                              </p>
                            </div>
                          </>
                        ) : null
                      }
                      <div className="flex flex-wrap py-4">
                        <div className="text-center">
                          <button
                            className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-4 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => setOpen(!open)}
                          >
                            RESET PASSWORD
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="container mx-auto px-4 h-full py-5">
                  <div className="flex content-center items-center justify-center h-full">
                    <div className="w-full lg:w-6/12 px-4">
                      <form onSubmit={handleSubmit}>
                        <div className="relative w-full mt-4 mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={name}
                            className="border-1 px-3 py-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Name"
                            onChange={(
                              e: React.FormEvent<HTMLInputElement>
                            ) => {
                              setErrors({ ...errors, name: !1 });
                              setName(e.currentTarget.value);
                            }}
                          />
                          {errors.name && (
                            <p style={{ color: "red" }}>
                              This field is required
                            </p>
                          )}
                        </div>
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="Description"
                          >
                            Description
                          </label>
                          <textarea
                            rows={4}
                            cols={80}
                            name="description"
                            value={description}
                            className="border-1 px-3 py-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                            placeholder="Type a message..."
                            onChange={(
                              e: React.FormEvent<HTMLTextAreaElement>
                            ) => {
                              setDescription(e.currentTarget.value);
                            }}
                          />
                        </div>
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="Image"
                          >
                            Image
                          </label>
                          <input
                            type="file"
                            name="image"
                            accept="image/*"
                            className="border-1 px-3 py-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                            onChange={(
                              e: React.FormEvent<HTMLInputElement>
                            ) => {
                              const target = e.target as HTMLInputElement;
                              setImage((target.files as FileList)[0]);
                            }}
                          />
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
              )}
            </div>
          </div>
        </div>
      </div>
      <ResetPasswordModal
        token={nToken}
        open={open}
        handleModal={handleModal}
      />
    </>
  );
}
