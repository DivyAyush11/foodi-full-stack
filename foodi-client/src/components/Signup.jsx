import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFacebookF, FaGithub, FaGoogle, FaRegUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Modal from "./Modal";
// import { AuthContext } from "../contexts/AuthProvider";
// import axios from "axios";
import useAxiosPublic from "../hooks/useAxiosPublic";

const Signup = () => {
  const { signUpWithGmail, createUser, updateUserProfile } =
    useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
  console.log("Testing direct backend signup:", data);
  
  const userInfor = {
    name: data.name,
    email: data.email,
    password: data.password
  };
  
  // Call your working backend directly (bypass Firebase)
  axiosPublic.post("/users", userInfor)
    .then((response) => {
      console.log("✅ Signup successful:", response.data);
      
      // Store user info (you can enhance this later)
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      
      alert("Account created successfully!");
      navigate(from, { replace: true });
    })
    .catch((error) => {
      console.error("❌ Signup error:", error);
      alert("Signup failed: " + (error.response?.data?.message || error.message));
    });
  };


  return (
    <div className="max-w-md bg-white shadow w-full mx-auto flex items-center justify-center my-20">
      <div className="mb-5">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="font-bold text-lg">Please Create An Account!</h3>
          {/* name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="name"
              placeholder="Your name"
              className="input input-bordered"
              {...register("name")}
            />
          </div>

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
              {...register("password")}
            />
            <label className="label">
              <a href="#" className="label-text-alt link link-hover mt-2">
                Forgot password?
              </a>
            </label>
          </div>

          {/* error message */}
          <p>{errors.message}</p>

          {/* submit btn */}
          <div className="form-control mt-6">
            <input
              type="submit"
              className="btn bg-green text-white"
              value="Sign up"
            />
          </div>

          <div className="text-center my-2">
            Have an account?
            <Link to="/login">
              <button className="ml-2 underline">Login here</button>
            </Link>
          </div>
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
          {/* <button
            onClick={handleRegister}
            className="btn btn-circle hover:bg-green hover:text-white"
          >
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
  );
};

export default Signup;
