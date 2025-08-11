"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [jsonData, setJsonData] = useState(null);

  // Log initial state and re-renders
  console.log("Component state:", { file, message, jsonData });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    console.log("Selected file:", selectedFile); // Log the raw file object

    if (selectedFile) {
      console.log("File details:", {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        lastModified: new Date(selectedFile.lastModified).toLocaleString(),
      });

      if (selectedFile.size > 1 * 1024 * 1024 * 1024) {
        console.warn("File too large:", selectedFile.size);
        setMessage(
          "File size exceeds 1GB limit. Please upload a smaller file."
        );
        setFile(null);
        setJsonData(null);
        return;
      }
      setFile(selectedFile);
      setMessage("");
      setJsonData(null);
    } else {
      console.log("No file selected");
      setMessage("Please select a file.");
      setFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("No file selected.");
      return;
    }

    try {
      setMessage("Uploading...");
      const formData = new FormData();
      formData.append("file", file);

      console.log("Uploading file:", file.name, file.type, file.size);

      const response = await fetch("/api/upload", {
        method: "POST",
      });

      // Check for HTML response (404)
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("text/html")) {
        throw new Error("API endpoint not found. Please check the server.");
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.error || `Upload failed with status ${response.status}`
        );
      }

      const data = await response.json();

      // Log everything to console
      console.group("File Upload Results");
      console.log("File Info:", {
        name: data.fileName,
        type: data.fileType,
        size: data.size,
      });
      console.log("Parsed Data:", data.data);
      console.groupEnd();

      setMessage("File uploaded and converted successfully!");
      setJsonData(data.data);
    } catch (error) {
      console.error("Upload Error:", error);
      setMessage(error.message || "Upload failed");
    }
  };
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-2xl">
        <h1 className="text-2xl font-bold">
          Upload File (PDF, CSV, XLSX, XLS)
        </h1>
        <form
          onSubmit={handleUpload}
          className="flex flex-col gap-4 items-center w-full"
        >
          <input
            type="file"
            accept=".pdf,.csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            type="submit"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            Upload & Convert to JSON
          </button>
        </form>
        {message && <p className="text-red-500">{message}</p>}
        {jsonData && (
          <div className="mt-4 w-full">
            <h2 className="text-xl font-semibold">Converted JSON:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
