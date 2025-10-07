import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
// import { AuthContext } from "../contexts/AuthProvider";
//import useAuth from "../hooks/useAuth";
// import axios from "axios";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Login = () => {
  const [errorMessage, seterrorMessage] = useState("");
  // const { signUpWithGmail, login } = useAuth();
  const axiosPublic = useAxiosPublic();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  //react hook form
  const {
    register,
    handleSubmit, reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
  const email = data.email;
  const password = data.password;
  
  console.log("Direct backend login only:", { email });
  
  // Clear any previous error messages
  seterrorMessage("");
  
  // ONLY call backend - NO Firebase/useAuth calls
  axiosPublic.post("/users/login", { email, password })
    .then((response) => {
      console.log("✅ Backend login successful:", response.data);
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      
      console.log("✅ User data stored:", response.data.user);
      
      alert("Login successful!");
      
      // Navigate and refresh
      navigate(from, { replace: true });
      window.location.reload();
    })
    .catch((error) => {
      console.error("❌ Backend login failed:", error);
      seterrorMessage(error.response?.data?.message || "Login failed. Please check your credentials.");
    });
};



  // login with google
  // const handleRegister = () => {
  //   signUpWithGmail()
  //     .then((result) => {
  //       const user = result.user;
  //       const userInfor = {
  //         name: result?.user?.displayName,
  //         email: result?.user?.email,
  //       };
  //       axiosPublic
  //         .post("/users", userInfor)
  //         .then((response) => {
  //           // console.log(response);
  //           alert("Signin successful!");
  //           navigate("/");
  //         });
  //     })
  //     .catch((error) => console.log(error));
  // };
  return (
    <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20">
    <div className="mb-5">
    <form
            className="card-body"
            method="dialog"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="font-bold text-lg">Please Login!</h3>

            {/* email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                {...register("email")}
              />
            </div>

            {/* password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                {...register("password", { required: true })}
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover mt-2">
                  Forgot password?
                </a>
              </label>
            </div>

            {/* show errors */}
            {errorMessage ? (
              <p className="text-red text-xs italic">
                Provide a correct username & password.
              </p>
            ) : (
              ""
            )}

            {/* submit btn */}
            <div className="form-control mt-4">
              <input
                type="submit"
                className="btn bg-green text-white"
                value="Login"
              />
            </div>

            {/* close btn */}
            <Link to="/">
            <div
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </div></Link>

            <p className="text-center my-2">
              Donot have an account?
              <Link to="/signup" className="underline text-red ml-1">
                Signup Now
              </Link>
            </p>
          </form>
      <div className="text-center space-x-3">
        <button 
          className="btn btn-circle hover:bg-green hover:text-white cursor-pointer"
          onClick={() => alert("Google login feature is under development. Please use email/password signup for now.")}
        >
          <FaGoogle />
        </button>

        <button 
          className="btn btn-circle hover:bg-green hover:text-white cursor-pointer"
          onClick={() => alert("Facebook login feature is under development. Please use email/password signup for now.")}
        >
          <FaFacebookF />
        </button>

        <button 
          className="btn btn-circle hover:bg-green hover:text-white cursor-pointer"
          onClick={() => alert("GitHub login feature is under development. Please use email/password signup for now.")}
        >
        <FaGithub />
        </button>

        {/* <button onClick={handleRegister} className="btn btn-circle hover:bg-green hover:text-white">
          <FaGoogle />
        </button>
        <button className="btn btn-circle hover:bg-green hover:text-white">
          <FaFacebookF />
        </button>
        <button className="btn btn-circle hover:bg-green hover:text-white">
          <FaGithub />
        </button> */}
      </div>
    </div>
  </div>
  )
}

export default Login