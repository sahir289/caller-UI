import React from 'react';

export default function Header() {
  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage data (including accessToken)
    window.location.reload(); // Reload the page
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">File Upload Portal</h1>
      <button
        onClick={handleLogout}
        className="bg-purple-500 text-white cursor-pointer px-4 py-2 rounded hover:bg-purple-700"
      >
        Logout
      </button>
    </header>
  );
}
