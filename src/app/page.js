"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BASEURL } from "./utils/baseUrl";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

/**
 * Login component for user authentication
 */
export default function Home() {
  const [userNameInput, setUserNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("accessToken");

    if (token && typeof token === 'string' && token.trim() !== '' && (token.match(/\./g) || []).length === 2 && !token.startsWith('{')) {
      window.location.href = "/records";
    }
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    const username = userNameInput.trim();
    const password = passwordInput.trim();
    if (!username || !password) {
      toast.error("Please enter both username and password");
      setIsLoggingIn(false);
      return;
    }

    try {
      const loginResponse = await fetch(`${BASEURL}/v1/login/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: username,
          password: password,
        }),
      });

      const responseData = await loginResponse.json();
      if (loginResponse.ok && responseData.data) {
        localStorage.setItem("accessToken", responseData.data.token);
        toast.success(responseData.message || "Login successful");
        window.location.href = "/records";
      } else {
        toast.error(
          responseData.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.message === "Failed to fetch") {
        toast.error(
          `Cannot connect to API server. Please ensure the backend server is running on ${BASEURL}`
        );
      } else {
        toast.error("Unexpected error occurred: " + err.message);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-purple-600 font-bold text-2xl">📊</span>
          </div>
          <h2 className="text-3xl font-bold text-purple-600 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to access File Upload Portal</p>
        </div>
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">
              Username
            </label>
            <input
              type="text"
              value={userNameInput}
              onChange={(e) => setUserNameInput(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus-ring input-focus bg-white transition-all"
              placeholder="Enter your username"
              autoComplete="username"
              aria-label="Username"
              required
            />
          </div>

          {/* Password with toggle */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">
              Password
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus-ring input-focus bg-white pr-12 transition-all"
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-label="Password"
                required
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                {isPasswordVisible ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg font-medium transition-all btn-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoggingIn ? (
              <>
                <svg className="animate-spin-custom h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
