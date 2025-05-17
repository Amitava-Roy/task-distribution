"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/baseUrl";
import { saveAuthData } from "../config/authConfig";

export default function RegisterPage() {
  // State for email input
  const [email, setEmail] = useState("");
  // State for password input
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handles the registration form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Send a POST request to the register API endpoint
      const registerData = await api.post("/api/v1/users/signUp", {
        email,
        password,
      });
      console.log(registerData?.data);

      saveAuthData(
        registerData?.data?.result?.token,
        registerData?.data?.result?.userDetails
      );
      // Redirect the user to the login page
      navigate("/agents");
    } catch (error) {
      console.log(error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    // Main container for the page, applying background gradient and centering content
    <div className="font-inter bg-gradient-to-tr from-fuchsia-100 via-purple-200 to-slate-300 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Form Container with Glassmorphism effect */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-xl p-8 md:p-12">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Join us! Please fill in your details to register.
            </p>
          </div>

          {/* Registration Form */}
          <form className="space-y-6" onSubmit={handleRegister}>
            {/* Email Address Input Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password" // Use "new-password" for registration forms
                  required
                  className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Role Selection Field (Optional) */}
            {/* <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Register as
              </label>
              <div className="mt-2">
                <select
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out bg-white" // Added bg-white for select dropdown
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div> */}

            {/* Register Button */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-lg bg-purple-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-md hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition duration-150 ease-in-out"
              >
                Register
              </button>
            </div>
          </form>

          {/* Login Link Section */}
          <div className="mt-6 text-right">
            <p className="text-sm text-gray-700">
              Already have an account?{" "}
              <Link to="/login">
                <span className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition duration-150 ease-in-out">
                  Sign in here
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
