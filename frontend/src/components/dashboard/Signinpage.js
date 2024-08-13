import React, { useContext, useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { AuthContext } from "./../../AuthContext";

const clientId =
  "212614114764-scduo8rud6qlrg210iqpu7b981kl2hvd.apps.googleusercontent.com";

function Signinpage() {
  const { updateUser } = useContext(AuthContext);
  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const emailRef = useRef(null);
  const handleForgotPassword = async () => {
    const email = emailRef.current.value;
    if (!email) {
      Swal.fire({
        title: "Error",
        text: "Please enter your email address.",
        icon: "error",
      });
      return;
    }
    try {
      const response = await axios.post(
        "https://hchaichi-bmqq.vercel.app/auth/forgot-password",
        { email }
      );
      Swal.fire({
        title: response.data.result ? "Success" : "Error",
        text: response.data.message,
        icon: response.data.result ? "success" : "error",
      });
    } catch (error) {
      console.error("There was an error sending the reset email!", error);
      Swal.fire({
        title: "Error",
        text: "There was an error sending the reset email!: " + error,
        icon: "error",
      });
    }
  };

  const onSubmit = async (data) => {
    //console.table(data);

    try {
      btnRef1.current.style.display = "none";
      btnRef2.current.style.display = "block";
      const response = await axios.post(
        "https://hchaichi-bmqq.vercel.app/auth/login",
        data,
        { withCredentials: true }
      );

      if (response.data.result) {
        /*                 Swal.fire({
                    title: 'Success',
                    text: response.data.message,
                    icon: 'success'
                }); */

        if (response.data.token) {
          updateUser(response.data.user);
          //navigate(`/user/addorder/${response.data.user._id}`, { replace: true });
          if (response.data.user.role == "client") {
            navigate(`/user/addorder`, { replace: true });
          } else if (response.data.user.role == "admin") {
            navigate(`/dashboard`, { replace: true });
          }
        }
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("There was an error signing in!", error);
      Swal.fire({
        title: "Error",
        text: "There was an error signing in!: " + error,
        icon: "error",
      });
    } finally {
      btnRef2.current.style.display = "none";
      btnRef1.current.style.display = "block";
    }
  };
  const password = watch("password");

  const onSuccess = (res) => {
    console.log("Login Success! Current user: ", res.profileObj);
    try {
      axios
        .post(
          "https://hchaichi-bmqq.vercel.app/auth/google/login",
          res.profileObj,
          { withCredentials: true }
        )
        .then((response) => {
          if (response.data.result) {
            if (response.data.token) {
              updateUser(response.data.client);
              //alert(response.data.client._id)
              //navigate(`/user/addorder/${response.data.client._id}`, { replace: true });
              //navigate(`/user/addorder`, { replace: true });

              if (response.data.client.role == "client") {
                navigate(`/user/addorder`, { replace: true });
              } else if (response.data.client.role == "admin") {
                navigate(`/dashboard`, { replace: true });
              }
            }
          } else {
            Swal.fire({
              title: "Error",
              text: response.data.message,
              icon: "error",
            });
          }
        })
        .catch((error) => {
          console.error("There was an error signing up!", error);
        });
    } catch (error) {
      console.error("There was an error signing up!", error);
      Swal.fire({
        title: "Error",
        text: "There was an error signing up!: " + error,
        icon: "error",
      });
    }
  };
  const onFailure = (res) => {
    console.log("Login Failure!: ", res);
    Swal.fire({
      title: "Error",
      text: "There was an error signing up!: " + res,
      icon: "error",
    });
  };

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  return (
    <>
      <div id="kt_body" className="auth-bg">
        <div className="d-flex flex-column flex-root">
          <div className="d-flex flex-column flex-lg-row flex-column-fluid min-vh-100">
            <div className="d-flex flex-column flex-lg-row-auto w-xl-600px bg-primary positon-xl-relative ">
              <div className="d-flex flex-column position-xl-fixed top-0 bottom-0 w-xl-600px">
                <div className="d-flex flex-row-fluid flex-column flex-center text-center p-10 pt-lg-20">
                  <a href="/" className="py-9 mb-10">
                    <img
                      alt="Logo"
                      src="/assets/media/logos/logo-compact-light.svg"
                      className="h-70px"
                    />
                  </a>

                  <h1 className="fw-bold fs-2qx pb-5 pb-md-10 text-white">
                    Welcome to Rider
                  </h1>

                  <p className="text-white fw-semibold fs-2">
                    Discover Simply Amazing Admin Dashboard <br />
                    With The Stunning Design System
                  </p>
                </div>

                <div className="d-flex flex-row-auto flex-center">
                  <img
                    src="/assets/media/illustrations/dozzy-1/2.png"
                    alt=""
                    className="h-200px h-lg-350px mb-10"
                  />
                </div>
              </div>
            </div>

            <div className="d-flex flex-column flex-lg-row-fluid py-10">
              <div className="d-flex flex-center flex-column flex-column-fluid">
                <div className="w-lg-500px p-10 p-lg-15 mx-auto">
                  <form
                    className="form w-100"
                    noValidate="novalidate"
                    id="kt_sign_in_form"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="text-center mb-10">
                      <h1 className="text-gray-900 mb-3">
                        Sign In to Rider HTML Pro{" "}
                      </h1>

                      <div className="text-gray-500 fw-semibold fs-4">
                        New Here?
                        <a href="/auth/signup" className="link-primary fw-bold">
                          {" "}
                          Create an Account
                        </a>
                      </div>
                    </div>

                    <div className="fv-row mb-10">
                      <label className="form-label fs-6 fw-bold text-gray-900">
                        Email
                      </label>

                      <input
                        className="form-control form-control-lg form-control-solid"
                        type="email"
                        placeholder=""
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                            message: "Email is not valid",
                          },
                        })}
                        ref={emailRef}
                      />
                      {errors.email && <p>{errors.email.message}</p>}
                    </div>

                    <div className="fv-row mb-10">
                      <div className="d-flex flex-stack mb-2">
                        <label className="form-label fw-bold text-gray-900 fs-6 mb-0">
                          Password
                        </label>

                        <a
                          onClick={handleForgotPassword}
                          className="link-primary fs-6 fw-bold"
                          style={{ cursor: "pointer" }}
                        >
                          Forgot Password ?
                        </a>
                      </div>

                      <input
                        className="form-control form-control-lg form-control-solid"
                        type="password"
                        placeholder=""
                        {...register("password", {
                          required: "Password is required",
                          pattern: {
                            value:
                              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*?&])[A-Za-z\d@!%*?&]{8,}$/,
                            message:
                              "Use 8 or more characters with a mix of letters, numbers & symbols except $",
                          },
                        })}
                      />
                      {errors.password && <p>{errors.password.message}</p>}
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        id="kt_sign_in_submit"
                        className="btn btn-lg btn-primary w-100 mb-5"
                      >
                        <span ref={btnRef1} className="indicator-label">
                          Continue
                        </span>

                        <span ref={btnRef2} className="indicator-progress">
                          Please wait...{" "}
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      </button>

                      <div className="text-center text-muted text-uppercase fw-bold mb-5">
                        or
                      </div>

                      <GoogleLogin
                        className="google-login-button  btn btn-flex flex-center btn-light btn-lg w-100 mb-5"
                        clientId={clientId}
                        buttonText="Continue with Google"
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        cookiePolicy={"single_host_origin"}
                        isSignedIn={false}
                      />
                    </div>
                  </form>
                </div>
              </div>

              <div className="d-flex flex-center flex-wrap fs-6 p-5 pb-0">
                <div className="d-flex flex-center fw-semibold fs-6">
                  <a href="/" className="text-muted text-hover-primary px-2">
                    Home
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signinpage;
