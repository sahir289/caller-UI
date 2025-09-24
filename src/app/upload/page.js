"use client";
import React, { useState, useRef, useCallback } from "react";
import { ArrowUpTrayIcon, DocumentIcon, CloudIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { toast, ToastContainer } from "react-toastify";
import { BASEURL } from "../utils/baseUrl";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [companyType, setCompanyType] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [dragActivePairing, setDragActivePairing] = useState(false);

  const inputRef = useRef(null);
  const inputRefPairing = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingPairing, setUploadingPairing] = useState(false);

  const allowedFileTypes = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];

  // Drag and drop handlers for first upload
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (allowedFileTypes.includes(droppedFile.type)) {
        setFile(droppedFile);
      } else {
        toast.error("Unsupported file type. Please upload PDF, Excel, or CSV files");
      }
    }
  }, []);

  // Drag and drop handlers for pairing upload
  const handleDragPairing = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActivePairing(true);
    } else if (e.type === "dragleave") {
      setDragActivePairing(false);
    }
  }, []);

  const handleDropPairing = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActivePairing(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (allowedFileTypes.includes(droppedFile.type)) {
        setFileData(droppedFile);
      } else {
        toast.error("Unsupported file type. Please upload PDF, Excel, or CSV files");
      }
    }
  }, []);

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

  const handleTokenError = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const token = localStorage.getItem("accessToken");

        // Validate token format - JWT tokens should have exactly 2 dots and be a valid JWT format
    if (!token || typeof token !== 'string' || token.trim() === '' || (token.match(/\./g) || []).length !== 2 || token.startsWith('{')) {
      toast.error("Invalid session. Please login again.");
      localStorage.clear();
      window.location.href = "/";
      setUploading(false);
      return;
    }

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
        setFile(null);
        setCompanyType("");
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
        setFileData(null);
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
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Welcome to File Upload Portal</h1>
          <p className="text-gray-600 text-lg">Upload and manage your data files with ease</p>
        </div>

        {/* Upload Forms */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Users Data File Upload */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <CloudIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Upload Users Data File</h3>
                <p className="text-sm text-gray-600">Transaction history and user data files</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Select Company Panel</label>
                <select
                  value={companyType}
                  onChange={(e) => setCompanyType(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus-ring input-focus bg-white"
                >
                  <option value="">-- Choose Company --</option>
                  <option value="Anna247">Anna247</option>
                  <option value="Anna777">Anna777</option>
                </select>
              </div>

              {/* Drag and Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-purple-500 bg-purple-50"
                    : file
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={inputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.xlsx,.xls,.csv"
                />

                <div className="flex flex-col items-center">
                  {file ? (
                    <>
                      <CheckCircleIcon className="w-12 h-12 text-green-500 mb-4" />
                      <p className="text-lg font-medium text-gray-800 mb-2">File Selected</p>
                      <p className="text-sm text-gray-600 mb-1">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </>
                  ) : (
                    <>
                      <ArrowUpTrayIcon className="w-12 h-12 text-purple-500 mb-4" />
                      <p className="text-lg font-medium text-gray-800 mb-2">
                        {dragActive ? "Drop your file here" : "Drag & drop your file here"}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">or click to browse</p>
                      <button
                        type="button"
                        onClick={handleClick}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors btn-hover"
                      >
                        Choose File
                      </button>
                    </>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading || !file || !companyType}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg font-medium transition-all btn-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin-custom h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                    Upload Data File
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Users Pairing File Upload */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <CloudIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Upload Pairing Data</h3>
                <p className="text-sm text-gray-600">Link users with their agents</p>
              </div>
            </div>

            <form onSubmit={handleSubmitPairing} className="space-y-6">
              {/* Drag and Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragActivePairing
                    ? "border-purple-500 bg-purple-50"
                    : fileData
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50"
                }`}
                onDragEnter={handleDragPairing}
                onDragLeave={handleDragPairing}
                onDragOver={handleDragPairing}
                onDrop={handleDropPairing}
              >
                <input
                  type="file"
                  ref={inputRefPairing}
                  onChange={handleFileChangePairing}
                  className="hidden"
                  accept=".pdf,.xlsx,.xls,.csv"
                />

                <div className="flex flex-col items-center">
                  {fileData ? (
                    <>
                      <CheckCircleIcon className="w-12 h-12 text-green-500 mb-4" />
                      <p className="text-lg font-medium text-gray-800 mb-2">File Selected</p>
                      <p className="text-sm text-gray-600 mb-1">{fileData.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(fileData.size)}</p>
                    </>
                  ) : (
                    <>
                      <ArrowUpTrayIcon className="w-12 h-12 text-purple-500 mb-4" />
                      <p className="text-lg font-medium text-gray-800 mb-2">
                        {dragActivePairing ? "Drop your file here" : "Drag & drop your file here"}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">or click to browse</p>
                      <button
                        type="button"
                        onClick={handleClickPairing}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors btn-hover"
                      >
                        Choose File
                      </button>
                    </>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={uploadingPairing || !fileData}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-lg font-medium transition-all btn-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploadingPairing ? (
                  <>
                    <svg className="animate-spin-custom h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                    Upload Pairing File
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* File Upload Guide */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <DocumentIcon className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">File Upload Guide</h2>
          </div>

          <p className="text-gray-600 mb-6">You can upload PDF, Excel (.xlsx, .xls), or CSV files. Here&apos;s the expected format for each file type:</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h4 className="font-medium text-purple-600 mb-2 flex items-center">
                  <CloudIcon className="w-5 h-5 mr-2" />
                  Users Data File (History)
                </h4>
                <p className="text-sm text-gray-600 mb-3">Supported formats:</p>

                {/* Payin CSV Format */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">📄 Payin CSV Files:</h5>
                  <div className="space-y-1 ml-4">
                    {[
                      "User - User identifier",
                      "Created At - Transaction creation timestamp",
                      "Requested Amount - Transaction amount",
                      "Status (optional) - Transaction status"
                    ].map((item, index) => (
                      <div key={`payin-${index}`} className="flex items-start text-sm">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payout CSV Format */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">📄 Payout CSV Files:</h5>
                  <div className="space-y-1 ml-4">
                    {[
                      "User - User identifier",
                      "Created At - Transaction creation timestamp",
                      "Requested Amount - Transaction amount",
                      "Status (optional) - Transaction status"
                    ].map((item, index) => (
                      <div key={`payout-${index}`} className="flex items-start text-sm">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manual Withdraw Excel Format */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">📊 Manual Withdraw Excel:</h5>
                  <div className="space-y-1 ml-4">
                    {[
                      "UserName - User identifier",
                      "PaymentDate - Transaction date",
                      "Amount - Transaction amount",
                      "Status (optional) - Transaction status"
                    ].map((item, index) => (
                      <div key={`manual-${index}`} className="flex items-start text-sm">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deposit Sheet Format */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">📊 Deposit Sheets (Excel):</h5>
                  <div className="space-y-1 ml-4">
                    {[
                      "ID NAME - User identifier",
                      "DATE - Transaction date",
                      "AMOUNT - Transaction amount",
                      "STATUS (optional) - Transaction status"
                    ].map((item, index) => (
                      <div key={`deposit-${index}`} className="flex items-start text-sm">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Withdrawal Sheet Format */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">📊 Withdrawal Sheets (Excel):</h5>
                  <div className="space-y-1 ml-4">
                    {[
                      "ID NAME - User identifier",
                      "DATE - Transaction date",
                      "AMOUNT - Transaction amount",
                      "STATUS (optional) - Transaction status"
                    ].map((item, index) => (
                      <div key={`withdrawal-${index}`} className="flex items-start text-sm">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-3 italic">Other columns will be stored as additional configuration data.</p>
              </div>            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h4 className="font-medium text-purple-600 mb-2 flex items-center">
                <CloudIcon className="w-5 h-5 mr-2" />
                Users Pairing File
              </h4>
              <p className="text-sm text-gray-600 mb-3">Required columns for Excel/CSV files:</p>
              <div className="space-y-2">
                {[
                  "userid - User identifier",
                  "agent - Agent identifier"
                ].map((item, index) => (
                  <div key={index} className="flex items-start text-sm">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}