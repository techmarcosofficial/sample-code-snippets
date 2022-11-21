/* eslint-disable */
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from '../../../assets/images/sidebar-logo.svg';
import LogoIcon from '../../../assets/images/sidebar-fav.svg';

const SideBar = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") return;
    (document.querySelector('.active') as HTMLLIElement).classList.remove("active");
    const link = (document.querySelector(`a[href="${location.pathname}"]`) as HTMLAnchorElement);
    if (link) {
      link.closest('li')?.classList.add('active');
    }
  }, []);
  const routeHandler = (e: any) => {
    const root = document.querySelector('#root') as HTMLDivElement;
    if (root.clientWidth <= 575) {
      if (root?.classList.contains('sidebar-open')) {
        root?.classList.remove('sidebar-open');
      }
    }
  }
  return (
    <>
      <aside className="sidebar">
        <header>
          <div className="side-head">
            <span className="img">
              <img src={LogoIcon} alt="Logo" className="img-fluid fav" height="35" width="35" />
              <img src={Logo} alt="Logo" className="img-fluid" height="16" width="133" />
            </span>
            <div className="text logo-text">
              <button
                title="Open"
                className="sidebar-toggler"
                onClick={() => {
                  const body = document.querySelector('#root');
                  if (body?.classList.contains('sidebar-open')) {
                    body?.classList.remove('sidebar-open');
                  } else {
                    body?.classList.add('sidebar-open');
                  }
                }}
              >
                <span className="bar"></span>
                <span className="bar m"></span>
                <span className="bar"></span>
              </button>
            </div>
          </div>
        </header>

        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">
              <li className="item active">
                <Link to="/" className="link" onClick={routeHandler}>
                  <i className="fa-solid fa-chart-simple"></i>
                  <span className="text">Dashboard</span>
                </Link>
              </li>
              <li className="item">
                <Link to="/operations" className="link" onClick={routeHandler}>
                  <i className="fa-solid fa-building"></i>
                  <span className="text">Operations</span>
                </Link>
              </li>
              <li className="item">
                <Link to="/locations" className="link" onClick={routeHandler}>
                  <i className="fa-solid fa-location-dot"></i>
                  <span className="text">Locations</span>
                </Link>
              </li>
              <li className="item">
                <Link to="/renewals" className="link" onClick={routeHandler}>
                  <i className="fa-solid fa-bell"></i>
                  <span className="text">Renewals</span>
                </Link>
              </li>
              <li className="item">
                <Link to="/documents" className="link" onClick={routeHandler}>
                  <i className="fa-solid fa-file"></i>
                  <span className="text">Documents</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="bottom-content">
            <ul className="menu-links">
              <li className="item filled">
                <Link to="/" className="link">
                  <i className="fa-solid fa-user"></i>
                  <span className="text">Account</span>
                </Link>
              </li>
              <li className="item">
                <Link to="/" className="link">
                  <i className="fa-solid fa-gear"></i>
                  <span className="text">Admin</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  )
}

export default SideBar;
