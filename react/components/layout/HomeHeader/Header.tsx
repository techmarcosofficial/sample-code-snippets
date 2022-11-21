import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../../redux/actions/authActions";
import LogoIcon from "../../../assets/images/sidebar-fav.svg";

const Header = ({ user }: any) => {
  const dispatch = useDispatch();
  return (
    <div className="admin-header">
      <div className="admin-nav">
        <div className="toggler">
          <button
            title="Open"
            className="sidebar-toggler"
            onClick={() => {
              const body = document.querySelector("#root");
              if (body?.classList.contains("sidebar-open")) {
                body?.classList.remove("sidebar-open");
              } else {
                body?.classList.add("sidebar-open");
              }
            }}
          >
            <span className="bar"></span>
            <span className="bar m"></span>
            <span className="bar"></span>
          </button>
        </div>
        <div className="center-logo">
          <span className="img">
            <img src={LogoIcon} alt="Logo" className="img-fluid fav" height="" width="" />
          </span>
        </div>
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass hd-search-toggle" onClick={() => {
            const hdsearch = document.querySelector('.search-box');
            if (hdsearch?.classList.contains('open')) {
              hdsearch?.classList.remove('open');
            } else {
              hdsearch?.classList.add('open');
            }
            }}>
          </i>
          <div className="input-wrap search-outer">
            <input
              type="text"
              className="form-control theme-ip"
              placeholder="Search"
            />
          </div>

          <div className="search-autodrop">
            <div className="sec">
              <h3 className="md-head">Recent</h3>
              <ul className="list">
                <li className="orange">
                  <Link to="/">Retail Location: Annapolis, MD</Link>
                </li>
                <li className="orange">
                  <Link to="/">Cultivation Location: Bethesda, MD</Link>
                </li>
                <li>
                  <Link to="/">Jason Vedadi, CEO of story</Link>
                </li>
                <li className="green">
                  <Link to="/">Cultivation Operation</Link>
                </li>
                <li className="green">
                  <Link to="/">Cultivation License: Bethesda , MD</Link>
                </li>
                      
              </ul>
            </div>
            <div className="sec">
              <h3 className="md-head">Quick Links</h3>
              <ul className="list">
                <li>
                  <Link to="/">Operations</Link>
                </li>
                <li>
                  <Link to="/">Locations</Link>
                </li>
                <li>
                  <Link to="/">Contacts</Link>
                </li>
                <li>
                  <Link to="/">Documents</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="dropdown user-drop">
          <button
            title="User"
            className="dropdown-toggle"
            data-toggle="dropdown"
          >
            {
              user ? (
                user.lastName ? `
                ${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`: `
                ${user.firstName.substr(0, 2).toUpperCase()}`) : ""
            }
          </button>
          <div className="dropdown-menu dropdown-menu-right theme-drop">
            <a href="/profile" title="View Profile" className="link">
              My Account
            </a>
            {user ? (
              <Link
                to="/"
                className="link"
                onClick={() => {
                  dispatch(logoutAction());
                  localStorage.clear();
                  window.location.href = "/";
                }}>Logout
              </Link>
              ): (
                <Link to="/login" className="link">Login</Link>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
