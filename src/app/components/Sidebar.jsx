"use client"

import React from 'react';
import { useState } from "react";

export default function Sidebar() {
  const [active, setActive] = useState("Upload");

  const menu = [
    { name: "Upload", path: "/" },
    // { name: "History", path: "/history" }
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-lg font-bold mb-6">Dashboard</h2>
      <ul className="space-y-4">
        {menu.map((item) => (
          <li
            key={item.name}
            className={`cursor-pointer p-2 rounded-md ${
              active === item.name ? "bg-purple-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setActive(item.name)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
