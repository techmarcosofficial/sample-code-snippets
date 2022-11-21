import React, { useState } from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { Formik } from "formik";
import SideBar from "../../../components/layout/SideBar/SideBar";
import Header from "../../../components/layout/Header/Header";
import InputError from "../../../components/common/InputError";
import {
  FIRST_NAME,
  COMPANY_NAME,
  JOB_TITLE,
  PHONE_NUMBER
} from "../../../utils";
import { updateProfileAction } from "../../../redux/actions/authActions";

const Profile = ({ token, user, updateProfile }: any) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [showPasswordClasses, setPasswordShownClasses] = useState(
    "fa-solid fa-eye-slash icon-after light cursor-pointer f-14"
  );
  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    passwordShown
      ? setPasswordShownClasses(
          "fa-solid fa-eye-slash icon-after light cursor-pointer f-14"
        )
      : setPasswordShownClasses(
          "fa-solid fa-eye icon-after light cursor-pointer f-14"
        );
    setPasswordShown(!passwordShown);
  };

  if (!token) {
    return <Navigate to="/login" />
  }
  return (
    <main className="main-wrapper">
      <SideBar />
      <section className="admin-home">
        <div className="inner-container">
        <Header />
          <div className="main-data">
            {user.firstName && user.lastName ? (
              <div className="sec-info text-center pb-4">
                <div className="avatar mx-auto mb-3">
                  <span className="txt">
                    {`${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`}
                  </span>
                </div>
                <h1 className="head-lg">
                  {`${user.firstName} ${user.lastName}`}
                </h1>
              </div>
            ): (
              <div className="sec-info text-center pb-4">
                <div className="avatar mx-auto mb-3">
                  <span className="txt">
                    {`${user.firstName.substr(0, 2).toUpperCase()}`}
                  </span>
                </div>
                <h1 className="head-lg">
                  {`${user.firstName}`}
                </h1>
              </div>
            )}

            <div className="row">

              {/* left col */}
              <div className="col-md-6 d-flex flex-column">
                <div className="admin-card h-100">
                  <div className="head">
                    <div className="left">
                      <h3 className="head-md">Basic Information</h3>
                    </div>
                  </div>
                  <div className="body">
                    <Formik
                      // enableReinitialize={true}
                      initialValues={{
                        firstName: user.firstName,
                        lastName: user.lastName ? user.lastName : "",
                        jobTitle: user.jobTitle ? user.jobTitle : "",
                        companyName: user.companyName ? user.companyName : "",
                        phoneNumber: user.phoneNumber ? user.phoneNumber : "",
                        error: ""
                      }}
                      validate={(values) => {
                        const errors: any = {};
                        if (!values.firstName) {
                          errors.firstName = FIRST_NAME;
                        } else if (!values.jobTitle) {
                          errors.jobTitle = JOB_TITLE;
                        } else if (!values.companyName) {
                          errors.companyName = COMPANY_NAME;
                        } else if (!values.phoneNumber) {
                          errors.phoneNumber = PHONE_NUMBER;
                        }
                        return errors;
                      }}
                      onSubmit={async (values, { setSubmitting, setFieldError }) => {
                        // API request
                        const payload = {
                          firstName: values.firstName,
                          lastName: values.lastName,
                          jobTitle: values.jobTitle,
                          companyName: values.companyName,
                          phoneNumber: values.phoneNumber
                        }
                        const response = await fetch(
                          `${process.env.REACT_APP_API_URL}/auth/update-profile`,
                          {
                            method: "PATCH",
                            headers: {
                              Accept: "application/json",
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(payload),
                          }
                        );
                        const result = await response.json();
                        if (result.acknowledged) {
                          const newUser = {
                            ...user,
                            ...payload
                          }
                          // store user and token in local storage
                          localStorage.setItem("user", JSON.stringify(newUser));
                          await updateProfile(newUser);
                          setSubmitting(false);
                          return;
                        }
                        setFieldError("error", result.message);
                        setSubmitting(false);
                      }}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        /* and other goodies */
                      }) => (
                        <form className="space-y-2" onSubmit={handleSubmit}>
                          <div className="row md-row">
                            <div className="col-sm-6">
                              <div className="form-group">
                                <label htmlFor="" className="form-label">First Name</label>
                                <input
                                  type="text"
                                  name="firstName"
                                  className="form-control theme-ip curve"
                                  placeholder="Enter First Name"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.firstName}
                                />
                                <InputError
                                  error={touched.firstName}
                                  message={errors.firstName}
                                  touched={touched}
                                />
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="form-group">
                                <label htmlFor="" className="form-label">Last Name</label>
                                <input
                                  type="text"
                                  name="lastName"
                                  className="form-control theme-ip curve"
                                  placeholder="Enter Last Name"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.lastName}
                                />
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="form-group">
                                <label htmlFor="" className="form-label">Job Title</label>
                                <input
                                  type="text"
                                  name="jobTitle"
                                  className="form-control theme-ip curve"
                                  placeholder="Enter Job Title"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.jobTitle}
                                />
                                <InputError
                                  error={touched.jobTitle}
                                  message={errors.jobTitle}
                                  touched={touched}
                                />
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="form-group">
                                <label htmlFor="" className="form-label">Company</label>
                                <input
                                  type="text"
                                  name="companyName"
                                  className="form-control theme-ip curve"
                                  placeholder="Enter Company Name"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.companyName}
                                />
                                <InputError
                                  error={touched.companyName}
                                  message={errors.companyName}
                                  touched={touched}
                                />
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="form-group">
                                <label htmlFor="" className="form-label">Phone Number</label>
                                <input
                                  type="text"
                                  name="phoneNumber"
                                  className="form-control theme-ip curve"
                                  placeholder="Enter Phone Number"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.phoneNumber}
                                />
                                <InputError
                                  error={touched.phoneNumber}
                                  message={errors.phoneNumber}
                                  touched={touched}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="action-btn">
                            <button type="submit" className="theme-btn border-btn dark-grey curve md" title="Save Changes">Save Changes</button>
                          </div>
                        </form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
              {/* left col */}

              {/* right col */}
              <div className="col-md-6 d-flex flex-column">
                <div className="admin-card h-100">
                  <div className="head">
                    <div className="left">
                      <h3 className="head-md">Account Information</h3>
                    </div>
                  </div>
                  <div className="body">
                    <div className="row md-row">
                      <div className="col-sm-12">
                        <div className="form-group">
                          <label htmlFor="" className="form-label">Email</label>
                          <input
                            type="email"
                            name="email"
                            className="form-control theme-ip curve"
                            placeholder="Enter Email"
                            value={user.email}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label htmlFor="" className="form-label">New Password</label>
                          <div className="input-wrap">
                            <input
                              type={passwordShown ? "text" : "password"}
                              name="password"
                              className="form-control theme-ip curve pr-5"
                              placeholder="Password"
                            />
                            <i
                              className={showPasswordClasses}
                              onClick={togglePassword}
                            ></i>
                            {/* <i className=""></i> */}
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label htmlFor="" className="form-label">Confirm Password</label>
                          <div className="input-wrap">
                            <input
                              type={passwordShown ? "text" : "password"}
                              name="password"
                              className="form-control theme-ip curve pr-5"
                              placeholder="Password"
                            />
                            <i
                              className={showPasswordClasses}
                              onClick={togglePassword}
                            ></i>
                            {/* <i className=""></i> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="action-btn">
                      <button type="button" className="theme-btn border-btn dark-grey curve md mr-3" title="Cancel">Cancel</button>
                      <button type="button" className="theme-btn border-btn dark-grey curve md" title="Save" disabled>Save</button>
                    </div>

                    <div className="action-btn pt-4">
                      <label htmlFor="" className="form-label">Two-Factor Authentication</label>
                      <p className="mb-2">Require an authentication code when you log in with an email and password</p>
                      <button type="button" className="theme-btn border-btn dark-grey curve md" title="Cancel">Enable</button>
                    </div>
                  </div>
                </div>
              </div>
              {/* right col */}

            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

Profile.propTypes = {
  // loading: PropTypes.bool.isRequired,
  token: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  updateProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state: any) => ({
  // ... computed data from state and optionally ownProps
  //   loading: state.post.loading,
  token: state.auth.token,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateProfile: (user: any) => dispatch(updateProfileAction(user))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);