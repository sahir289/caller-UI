"use client";
import { useState, useRef } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist";

export default function Home() {
  const [file, setFile] = useState(null);
  const [companyType, setCompanyType] = useState("");
  const inputRef = useRef();

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !companyType) {
      toast.error("Please select a file and company type");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawText = event.target.result;
      console.log("Raw file content:", rawText);

      // Send to API
      const formData = new FormData();
      formData.append("file", file);

      await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      console.log("File uploaded");
    };
    reader.readAsText(file);

    const ext = file.name.split(".").pop().toLowerCase();

    let rawData = [];

    if (["xlsx", "xls", "csv"].includes(ext)) {
      rawData = await readExcelOrCsv(file);
    } else if (ext === "pdf") {
      rawData = await readPdf(file);
    } else {
      alert("Unsupported file type");
      return;
    }

    console.log("Extracted Raw Data:", rawData);

    // Process into deposit/withdrawal payload
    const payload = createPayload(rawData, "admin");

    // const formData = new FormData();
    // formData.append("file", file);
    // formData.append("companyType", companyType);

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });

    if (res.ok) {
      toast.success("File uploaded successfully!");
    } else {
      toast.error("Upload failed");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Upload File</h2>
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
              Upload File
            </label>

            <input
              type="file"
              ref={inputRef}
              onChange={(e) => setFile(e.target.files[0])}
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
