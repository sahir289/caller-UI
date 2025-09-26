/* eslint-disable react/react-in-jsx-scope */
// pages/records.tsx
"use client";

import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { BASEURL } from "../utils/baseUrl";
import { formatToDubai12Hour } from "../utils/formattime";
import { toast, ToastContainer } from "react-toastify";
import {
  DocumentTextIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

const RecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

                // Validate token format - JWT tokens should have exactly 2 dots and be a valid JWT format
        if (!token || typeof token !== 'string' || token.trim() === '' || (token.match(/\./g) || []).length !== 2 || token.startsWith('{')) {
          toast.error("Invalid session. Please login again.");
          localStorage.clear();
          window.location.href = "/";
          return;
        }
        const res = await fetch(
          `${BASEURL}/v1/records?page=${currentPage}&size=${rowsPerPage}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          toast.error("Failed to fetch records");
          return;
        }
        const result = await res.json();
        if (
          result.message === "Token expired" ||
          result.message === "Invalid token"
        ) {
          toast.error("Login Expired! Please Login Again");
          localStorage.clear();
          window.location.href = "/";
          return;
        }
        if (result.data && result.data.records) {
          setRecords(result.data.records);
          setTotalPages(Math.ceil(result.data.totalCount / rowsPerPage));
          setTotalCount(result.data.totalCount);
        }
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  // Filter records based on search term
  const filteredRecords = records.filter(record =>
    record.file?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.uploaded_by?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute the range of entries displayed
  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalCount);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Records Management</h1>
          <p className="text-gray-600 text-lg">View and manage your uploaded data files</p>
        </div>

          {/* Stats Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <DocumentTextIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{totalCount}</div>
              <div className="text-sm text-gray-600">Total Records</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <BuildingOfficeIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                {new Set(records.map(r => r.company_name)).size}
              </div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <UserIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                {new Set(records.map(r => r.uploaded_by)).size}
              </div>
              <div className="text-sm text-gray-600">Uploaders</div>
            </div>
          </div> */}

          {/* Search and Table */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">All Records</h2>

              {/* Search */}
              <div className="relative w-full sm:w-80">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus-ring input-focus bg-white"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin-custom mb-4"></div>
                <p className="text-gray-600">Loading records...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          <div className="flex items-center">
                            <DocumentTextIcon className="w-4 h-4 mr-2" />
                            Report Name
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-2" />
                            Created Time
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          <div className="flex items-center">
                            <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                            Company
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                          <div className="flex items-center">
                            <UserIcon className="w-4 h-4 mr-2" />
                            Uploaded By
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                            <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            {searchTerm ? "No records found matching your search." : "No records available."}
                          </td>
                        </tr>
                      ) : (
                        filteredRecords.map((record) => (
                          <tr key={record.id} className="border-b border-gray-100 hover:bg-purple-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                              {record.file}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {formatToDubai12Hour(record.created_at)}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {record.company_name}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {record.uploaded_by}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Enhanced Pagination */}
                {totalCount > rowsPerPage && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-8 space-y-4 sm:space-y-0">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-medium">{startEntry}</span> to{" "}
                      <span className="font-medium">{endEntry}</span> of{" "}
                      <span className="font-medium">{totalCount}</span> records
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-hover"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || loading}
                      >
                        <ChevronLeftIcon className="w-4 h-4 mr-1" />
                        Previous
                      </button>

                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          if (pageNum > totalPages) return null;

                          return (
                            <button
                              key={pageNum}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                pageNum === currentPage
                                  ? "bg-purple-500 text-white"
                                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                              }`}
                              onClick={() => setCurrentPage(pageNum)}
                              disabled={loading}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors btn-hover"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || loading}
                      >
                        Next
                        <ChevronRightIcon className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
    </>
  );
};

export default RecordsPage;
