"use client";
import React from "react";
import { useState, useRef } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { toast, ToastContainer } from "react-toastify";
// import * as XLSX from "xlsx";
// import * as pdfjsLib from "pdfjs-dist";
import { BASEURL } from "./utils/baseUrl";

export default function Home() {
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [companyType, setCompanyType] = useState("");
  //   const [companyTypePairing, setCompanyTypePairing] = useState("");

  const inputRef = useRef(null);
  const inputRefPairing = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingPairing, setUploadingPairing] = useState(false);
  // const [progress, setProgress] = useState(0);
  // const [error, setError] = useState(null);
  // const [successMsg, setSuccessMsg] = useState(null);

  const allowedFileTypes = [
    "application/pdf",
    "application/vnd.ms-excel", // for .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv", // for .csv
  ];

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleClickPairing = () => {
    inputRefPairing.current.click();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileChangePairing = (e) => {
    setFileData(e.target.files[0]);
  };
  console.log("BASEURL:", BASEURL);

  // "No token provided";
  // "Token expired";
  // "Invalid token";
  const handleTokenError = () => {
    localStorage.clear();
    window.location.reload();
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const token = localStorage.getItem("accessToken");

    if (!file || !companyType) {
      toast.error("Please select a file and company type");
      setUploading(false);
      return;
    }

    if (!allowedFileTypes.includes(file.type)) {
      toast.error(`Unsupported file type. Please upload PDF or Excel files`);
      setUploading(false);
      return;
    }

    const maxSizeMB = 50;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit.`);
      setUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("company_name", companyType);

      const res = await fetch(`${BASEURL}/v1/history/createHistory`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("File uploaded successfully!");
      } else if (
        data.message === "No token provided" ||
        data.message === "Token expired" ||
        data.message === "Invalid token"
      ) {
        toast.error("Login Expired! Please Login Again");
        handleTokenError();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Unexpected error occurred.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitPairing = async (e) => {
    e.preventDefault();
    setUploadingPairing(true);
    const token = localStorage.getItem("accessToken");

    if (!fileData) {
      toast.error("Please select a file");
      setUploadingPairing(false);
      return;
    }

    if (!allowedFileTypes.includes(fileData.type)) {
      toast.error(`Unsupported file type. Please upload PDF or Excel files`);
      setUploadingPairing(false);
      return;
    }

    const maxSizeMB = 50;
    if (fileData.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSizeMB}MB limit.`);
      setUploadingPairing(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", fileData);

      const res = await fetch(`${BASEURL}/v1/agents/pairAgentwitUser`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("File uploaded successfully!");
      } else if (
        data.message === "No token provided" ||
        data.message === "Token expired" ||
        data.message === "Invalid token"
      ) {
        toast.error("Login Expired! Please Login Again");
        handleTokenError();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Unexpected error occurred.");
    } finally {
      setUploadingPairing(false);
    }
  }

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
              className="w-full border p-2 rounded cursor-pointer"
            >
              <option value="">-- Select --</option>
              <option value="Anna247">Anna247</option>
              <option value="Anna777">Anna777</option>
            </select>
          </div>

          <div className="flex flex-col max-w-md mx-auto p-4">
            <label className="block mb-1 font-medium text-gray-500 text-sm sm:text-base ">
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
               text-sm sm:text-base cursor-pointer"
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
              disabled={uploading}
              className="flex items-center w-full justify-center text-white bg-purple-500 rounded-xl py-2 px-4 hover:bg-purple-700 transition mt-4
               text-sm sm:text-base cursor-pointer"
            >
              {uploading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white mt-4 p-6 rounded-lg shadow-lg max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Upload Users Pairing File
        </h2>
        <form onSubmit={handleSubmitPairing} className="space-y-4">
          {/* <div>
            <label className="block mb-1 font-medium">Select Panel</label>
            <select
              value={companyTypePairing}
              onChange={(e) => setCompanyTypePairing(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Select --</option>
              <option value="IT">Anna247</option>
              <option value="Finance">Anna777</option>
            </select>
          </div> */}

          <div className="flex flex-col max-w-md mx-auto p-4">
            <label className="block mb-1 font-medium text-gray-500 text-sm sm:text-base">
              Upload Users Pairing File
            </label>

            <input
              type="file"
              ref={inputRefPairing}
              onChange={handleFileChangePairing}
              className="hidden"
            />

            <button
              type="button"
              onClick={handleClickPairing}
              className="flex items-center justify-center text-white bg-purple-500 rounded-xl gap-2 py-2 px-4 hover:bg-purple-700 transition
               text-sm sm:text-base cursor-pointer"
            >
              <ArrowUpTrayIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              Select File
            </button>

            {fileData && (
              <span className="mt-2 text-gray-700 text-xs sm:text-sm break-words">
                Selected file: {fileData.name}
              </span>
            )}

            <button
              type="submit"
              disabled={uploadingPairing}
              className="flex items-center w-full justify-center text-white bg-purple-500 rounded-xl py-2 px-4 hover:bg-purple-700 transition mt-4
               text-sm sm:text-base cursor-pointer"
            >
              {uploadingPairing ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
