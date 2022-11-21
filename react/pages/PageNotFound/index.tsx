import React from "react";
import Header from "../../components/layout/Header/Header";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <>
      <div className="inner-container">
        <Header />
        <div className="sec-not-found text-center">
          <h1 className="head-xxl">404</h1>
          <p>Sorry, but the page you are looking for does not exist</p>
          <p>Maybe you can go back to home</p>
          <div className="mt-4 mb-5">
            <Link to="/" title="Back to Home" className="theme-btn f-med">
              <span>Back to Home</span>
              <i className="fa-solid fa-chevron-right ml-2"></i>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index;
