import React from "react";
import { Formik } from "formik";
import { RegisterFormProps } from "../../../types";
import { SignupAPI } from "../../../services";


const Register = () => {
  return (
    <>
      <div className="inner-container">
        <div className="xs-container px-0">
          <div className="full-vh d-flex flex-column justify-content-center">
            <div className="theme-shadow radius-15 px-md-5 px-4 py-5 mb-4">
              <h2 className="head-lg-2 text-center">Sign Up</h2>
              <Formik
                initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
                validate={values => {
                  const errors: RegisterFormProps = {};
                  if (!values.firstName && !values.firstName.trim().length) {
                    errors.firstName = 'Required';
                  }
                  if (!values.email && !values.email.trim().length) {
                    errors.email = 'Required';
                  } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                  ) {
                    errors.email = 'Invalid email address';
                  }
                  if (!values.password && !values.password.trim().length) {
                    errors.password = 'Required';
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  console.log('Form submitted!!!!!!!!!!!!!!!');
                  console.log({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                  });
                  // API request
                  // ...
                  SignupAPI({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                  }).then((res) => {
                    console.log("response : ");
                    console.log(res);
                  });
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
                  <form className="space-y-4 text-gray-700" onSubmit={handleSubmit}>
                    <div className="flex flex-wrap -mx-2 space-y-4 md:space-y-0">
                      <div className="w-full px-2 md:w-1/2">
                        <label className="block" htmlFor="firstName">First name</label>
                        <input
                          type="text"
                          name="firstName"
                          className="form-control theme-ip py-4"
                          placeholder="First Name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.firstName}
                        />
                        {errors.firstName && touched.firstName && errors.firstName}
                      </div>
                      <div className="w-full px-2 md:w-1/2">
                        <label className="block" htmlFor="lastName">Last name</label>
                        <input
                          type="text"
                          name="lastName"
                          className="form-control theme-ip py-4"
                          placeholder="Last Name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.lastName}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="w-full">
                        <label className="block" htmlFor="email">Email</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control theme-ip py-4" id="formGridCode_card"
                          placeholder="Email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                        />
                        {errors.email && touched.email && errors.email}
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="w-full">
                        <label className="block" htmlFor="password">Password</label>
                        <input
                          type="password"
                          name="password"
                          className="form-control theme-ip py-4" id="formGridCode_card"
                          placeholder="Password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                        />
                        {errors.password && touched.password && errors.password}
                      </div>
                    </div>
                    <div className="text-center mt-4 pt-1 mb-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="theme-btn w-100">Submit
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register;
