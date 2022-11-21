import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { LoginFormProps } from "../../../types";
import { EMAIL, PASSWORD, INVALID_EMAIL } from "../../../utils";
import { loginAction } from "../../../redux/actions/authActions";
import Logo from "../../../assets/images/sidebar-logo.svg";
import LogoIcon from "../../../assets/images/sidebar-fav.svg";
import { LoginAPI } from "../../../services";

const Login = () => {
  useEffect(() => {
    document.title = "Resin | Login";
  }, []);
  const dispatch = useDispatch();
  const [passwordShown, setPasswordShown] = useState(false);
  const [showPasswordClasses, setPasswordShownClasses] = useState(
    "fa-solid fa-eye-slash icon-after light cursor-pointer"
  );
  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    passwordShown
      ? setPasswordShownClasses(
          "fa-solid fa-eye-slash icon-after light cursor-pointer"
        )
      : setPasswordShownClasses(
          "fa-solid fa-eye icon-after light cursor-pointer"
        );
    setPasswordShown(!passwordShown);
  };

  return (
    <>
      <div className="dark-sec">
        <div className="xs-container px-0">
          <div className="full-vh d-flex flex-column justify-content-center py-5">
            <div className="d-flex flex-column align-items-center mb-4">
              <img
                src={LogoIcon}
                alt="Logo"
                className="img-fluid fav mb-2 login-logo"
                height="35"
                width="35"
              />
              <img
                src={Logo}
                alt="Logo"
                className="img-fluid"
                height="16"
                width="133"
              />
            </div>
            <div className="px-4 py-5 mb-4">
              <Formik
                initialValues={{ email: "", password: "", error: "" }}
                validate={(values) => {
                  const errors: LoginFormProps = {};
                  if (!values.email) {
                    errors.email = EMAIL;
                  } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                      values.email
                    )
                  ) {
                    errors.email = INVALID_EMAIL;
                  }
                  if (!values.password && !values.password.trim().length) {
                    errors.password = PASSWORD;
                  }
                  return errors;
                }}
                onSubmit={async (values, { setSubmitting, setFieldError }) => {
                  console.log("Form submitted!!!!!!!!!!!!!!!");
                  console.log(values.email, values.password);
                  // API request
                  LoginAPI({
                    email: values.email,
                    password: values.password,
                  }).then((result: any) => {
                    if (result.success) {
                      // store user and token in local storage
                      localStorage.setItem("user", JSON.stringify(result.user));
                      localStorage.setItem("accessToken", result.token);
                      // store user and token in redux
                      dispatch(loginAction(result.user, result.token));
                      setSubmitting(false);
                      return;
                    }
                    setFieldError("error", result.message);
                    setSubmitting(false);
                  });
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
                    <div className="flex flex-wrap">
                      <div className="w-full">
                        <input
                          type="email"
                          name="email"
                          className="form-control theme-ip py-4 text-center"
                          placeholder="Email"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                        />
                        <p
                          style={{ color: "red" }}
                          className="small text-center w-100"
                        >
                          {errors.email && touched.email && errors.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="w-full">
                        <div className="input-wrap">
                          <input
                            type={passwordShown ? "text" : "password"}
                            name="password"
                            className="form-control theme-ip py-4 px-5 text-center"
                            placeholder="Password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                          />
                          <i
                            className={showPasswordClasses}
                            onClick={togglePassword}
                          ></i>
                        </div>
                        <p
                          style={{ color: "red" }}
                          className="small text-center w-100"
                        >
                          {errors.password &&
                            touched.password &&
                            errors.password}
                        </p>
                      </div>
                      {errors.error ? (
                        <p
                          style={{ color: "red", textAlign: "center" }}
                          className="small text-center w-100"
                        >
                          {errors.error}
                        </p>
                      ) : null}
                    </div>
                    <div className="d-flex justify-content-center">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          name="checkbox"
                          id="checkbox"
                        />
                        <label
                          className="custom-control-label txt-l-w f-13"
                          htmlFor="checkbox"
                        >
                          Remember Me?
                        </label>
                      </div>
                    </div>
                    <div className="text-center mt-2 pt-1 mb-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="theme-btn w-100"
                      >
                        {isSubmitting ? "Logging in..." : "Login"}
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
  );
};

export default Login;
