"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menu = [
    { name: "Upload", path: "/" },
    { name: "Records", path: "/records" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-lg font-bold mb-6">Dashboard</h2>
      <ul className="space-y-4">
        {menu.map((item) => (
          <li
            key={item.name}
            className={`cursor-pointer p-2 rounded-md ${
              pathname === item.path ? "bg-purple-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => router.push(item.path)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
