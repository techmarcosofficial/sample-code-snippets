import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { createPopper } from "@popperjs/core";
import { useStore } from "@/reducers/auth";
import { UserProps } from "@/lib/types";
import { parseImage } from "@/utils/helpers";


const UserDropdown = () => {
  const router = useRouter();
  // dropdown props
  const [nUser, setUser] = React.useState<UserProps | null>(null);
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef: React.RefObject<HTMLAnchorElement> = React.createRef();
  const popoverDropdownRef: React.RefObject<HTMLDivElement> = React.createRef();
  const { user, logout } = useStore();

  useEffect(() => {
    setUser(user);
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  const openDropdownPopover = () => {
    const popImg = document.querySelector('#popImg') as HTMLAnchorElement;
    const tooltip = document.querySelector('#tooltip') as HTMLDivElement;
    createPopper(popImg, tooltip, {
      placement: "bottom-end",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <a
        id="popImg"
        className="text-blueGray-500 block"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        {nUser && <div className="items-center flex">
          <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
            <img
              alt="..."
              className="w-full rounded-full align-middle border-none shadow-lg"
              src={parseImage(nUser.image)}
            />
          </span>
        </div>}
      </a>
      <div
        id="tooltip"
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <Link href="/profile">
          <a
            className={
              "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
            }
            onClick={() => setDropdownPopoverShow(false)}
          >
            Profile
          </a>
        </Link>
        {(user && user.role && user.role.name !== "Organization") ? (
          <Link href="/vendors">
            <a
              className={
                "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
              }
              onClick={() => setDropdownPopoverShow(false)}
            >
              Vendors
            </a>
          </Link>
        ): null}
        <div className="h-0 my-2 border border-solid border-blueGray-100" />
        <div className="text-center mt-1 mb-1 px-3">
          <button
            className="text-white text-xs font-bold uppercase px-4 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mb-0  mb-3 ease-linear transition-all duration-150 theme-btn w-full"
            onClick={() => {
              setDropdownPopoverShow(false);
              logout();
            }}
          >
            <i className="fas fa-arrow-right-from-bracket"></i> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDropdown;
