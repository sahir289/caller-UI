import React from 'react';

export default function Header() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">File Upload Portal</h1>
      <button
        onClick={handleLogout}
        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
      >
        Logout
      </button>
    </header>
  );
}
