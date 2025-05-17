import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/baseUrl";
import { getAuthData, saveAuthData } from "../config/authConfig";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const { token } = getAuthData();
    if (token) navigate("/agents");
  }, [navigate]);

  //function to login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/v1/users/signIn", { email, password });

      saveAuthData(res?.data?.result?.token, res?.data?.result?.userDetails);

      // Redirect based on role (if needed, decode token using jwt-decode)
      navigate("/agents"); // or /admin or /user
    } catch {
      // console.error(err.response?.data || "Login failed");
      toast.error("Login failed. Please check your email and password.");
    }
  };

  return (
    // This div now acts as the body, applying global page styles
    <div className="font-inter bg-gradient-to-tr from-fuchsia-100 via-purple-200 to-slate-300 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Form Container with Glassmorphism effect using Tailwind */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-xl p-8 md:p-12">
          {/* Logo/Header Section */}
          <div className="text-center mb-8">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Address Input */}
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

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Sign In Button */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-lg bg-purple-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-md hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-800  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition duration-150 ease-in-out"
              >
                Sign In
              </button>
            </div>
            <div className="mt-6 text-right">
              <p className="text-sm text-gray-700">
                Dont have an account?{" "}
                <Link to="/register">
                  <span className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition duration-150 ease-in-out">
                    Register here
                  </span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
