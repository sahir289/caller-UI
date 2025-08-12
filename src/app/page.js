"use client";
import React from 'react';
import { useState, useRef } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { toast, ToastContainer } from "react-toastify";
// import * as XLSX from "xlsx";
// import * as pdfjsLib from "pdfjs-dist";
import { BASEURL } from "./utils/baseUrl";

export default function Home() {
  const [file, setFile] = useState(null);
  const [companyType, setCompanyType] = useState("");

  const inputRef = useRef(null);
  // const [uploading, setUploading] = useState(false);
  // const [progress, setProgress] = useState(0);
  // const [error, setError] = useState(null);
  // const [successMsg, setSuccessMsg] = useState(null);

  const allowedFileTypes = [
    "application/pdf",
    "application/vnd.ms-excel", // for .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];


  const handleClick = () => {
    // setError(null);
    // setSuccessMsg(null);
    inputRef.current.click();
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }
  console.log("BASEURL:", BASEURL);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("first");

    if (!file || !companyType) {
      toast.error("Please select a file and company type");
      return;
    }

    if (!allowedFileTypes.includes(file.type)) {
      toast.error(`Unsupported file type. Please upload PDF or Excel files`);
      return;
    }

    // Validate size (limit 50MB)
    const maxSizeMB = 50;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }

    try {
      const formData = new FormData();  
      formData.append("file", file);

      const res = await fetch(`${BASEURL}/api/users/upload`, {
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: formData,
      });
      console.log(res, "res");

      if (res.ok) {
        toast.success("File uploaded successfully!");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    //   setUploading(false);
      toast.error("Unexpected error occurred.");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Upload Users Data File</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Select Panel</label>
            <select
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Select --</option>
              <option value="IT">Anna247</option>
              <option value="Finance">Anna777</option>
            </select>
          </div>

          <div className="flex flex-col max-w-md mx-auto p-4">
            <label className="block mb-1 font-medium text-gray-500 text-sm sm:text-base">
              Upload Users Data File
            </label>

            <input
              type="file"
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={handleClick}
              className="flex items-center justify-center text-white bg-purple-500 rounded-xl gap-2 py-2 px-4 hover:bg-purple-700 transition
               text-sm sm:text-base"
            >
              <ArrowUpTrayIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              Select Users File
            </button>

            {file && (
              <span className="mt-2 text-gray-700 text-xs sm:text-sm break-words">
                Selected file: {file.name}
              </span>
            )}

            <button
              type="submit"
              className="flex items-center w-full justify-center text-white bg-purple-500 rounded-xl py-2 px-4 hover:bg-purple-700 transition mt-4
               text-sm sm:text-base"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white mt-4 p-6 rounded-lg shadow-lg max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Upload Users Pairing File</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Select Panel</label>
            <select
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Select --</option>
              <option value="IT">Anna247</option>
              <option value="Finance">Anna777</option>
            </select>
          </div>

          <div className="flex flex-col max-w-md mx-auto p-4">
            <label className="block mb-1 font-medium text-gray-500 text-sm sm:text-base">
              Upload Users Pairing File
            </label>

            <input
              type="file"
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={handleClick}
              className="flex items-center justify-center text-white bg-purple-500 rounded-xl gap-2 py-2 px-4 hover:bg-purple-700 transition
               text-sm sm:text-base"
            >
              <ArrowUpTrayIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              Select File
            </button>

            {file && (
              <span className="mt-2 text-gray-700 text-xs sm:text-sm break-words">
                Selected file: {file.name}
              </span>
            )}

            <button
              type="submit"
              className="flex items-center w-full justify-center text-white bg-purple-500 rounded-xl py-2 px-4 hover:bg-purple-700 transition mt-4
               text-sm sm:text-base"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
