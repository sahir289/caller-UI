/* eslint-disable react/prop-types */
"use client";

import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function ClientLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    // Validate token format - JWT tokens should have exactly 2 dots and be a valid JWT format
    const isValidToken = token && typeof token === 'string' && token.trim() !== '' && (token.match(/\./g) || []).length === 2 && !token.startsWith('{');
    
    if (!isValidToken && token) {
      localStorage.clear();
    }

    setIsAuthenticated(isValidToken);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin-custom mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {children}
    </div>
  );
}
