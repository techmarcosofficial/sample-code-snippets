import React from "react";
import Modal from "react-modal";
import { parseCookies } from "nookies";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ButtonLoader from "@/components/ButtonLoader";
import { useStore } from "@/reducers/auth";
import { changePasswordAPI } from "@/lib/api";
import {
  ChangePasswordProps,
  ResetPasswordModalProps
} from "@/lib/types";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '600px',
    maxWidth: 'calc(100vw - 40px)',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#__next');

export const ResetPasswordModal = ({
  open,
  handleModal
}: ResetPasswordModalProps) => {
  const { logout } = useStore();
  const [loading, setLoading] = React.useState(!1);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const [errors, setErrors] = React.useState({
    currentPassword: !1,
    newPassword: !1,
    confirmNewPassword: !1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    /**
     * Event handler to submit Login Form.
     */
    e.preventDefault();
    let err = errors;
    if (!currentPassword.trim().length) {
        err = {...err, currentPassword: !0};
    }
    if (!newPassword.trim().length) {
        err = {...err, newPassword: !0};
    }
    if (!confirmNewPassword.trim().length) {
        err = {...err, confirmNewPassword: !0};
    }
    if (err.currentPassword || err.newPassword || err.confirmNewPassword) {
      setErrors(err);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('New password and confirm password not matched.');
      return;
    }

    const cookies = parseCookies();
    const payload: ChangePasswordProps = {
      current_password: currentPassword,
      password: newPassword,
      confirm_password: confirmNewPassword,
    }
    setLoading(!0);
    changePasswordAPI(payload, cookies?.token ?? '').then((res) => {
      setLoading(!1);
      if (res.code === 200) {
        toast(res.message);
        closeModal();
        setTimeout(() => logout(), 2000);
        return;
      }
      toast.error(res.message);
    }).catch((err) => {
      console.log(err);
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
          <h6 className="text-blueGray-700 text-xl font-bold">Change Password</h6>
          <button onClick={closeModal}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="mt-5 mb-5">
          <form onSubmit={handleSubmit}>
            <div className="relative w-full mb-5">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                className="border-1 px-3 py-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Current Password"
                onChange={
                  (e: React.FormEvent<HTMLInputElement>) => {
                  setErrors({...errors, currentPassword: !1});
                  setCurrentPassword(e.currentTarget.value);
                }}
              />
              {errors.currentPassword && <p style={{color: 'red'}}>This field is required</p>}
            </div>

            <div className="relative w-full mb-5">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                className="border-1 px-3 py-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="New Password"
                onChange={
                  (e: React.FormEvent<HTMLInputElement>) => {
                    setErrors({...errors, newPassword: !1});
                    setNewPassword(e.currentTarget.value);
                }}
              />
              {errors.newPassword && <p style={{color: 'red'}}>This field is required</p>}
            </div>

            <div className="relative w-full mb-5">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmNewPassword"
                className="border-1 px-3 py-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Re-Type New Password"
                onChange={
                  (e: React.FormEvent<HTMLInputElement>) => {
                    setErrors({...errors, confirmNewPassword: !1});
                    setConfirmNewPassword(e.currentTarget.value);
                }}
              />
              {errors.confirmNewPassword && <p style={{color: 'red'}}>This field is required</p>}
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
