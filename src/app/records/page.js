/* eslint-disable react/react-in-jsx-scope */
// pages/records.tsx
"use client";

import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASEURL } from "../utils/baseUrl";
import { formatToDubai12Hour } from "../utils/formattime";

const RecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
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

        if (!res.ok) throw new Error("Failed to fetch records");

        const result = await res.json();
        setRecords(result.data.data);
        setTotalPages(Math.ceil(result.data.totalCount / rowsPerPage));
        setTotalCount(result.data.totalCount);
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  // Compute the range of entries displayed
  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalCount);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex items-center w-full bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
            Records
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 mb-4">
                <thead className="bg-purple-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Report Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Created Time
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Report Type
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Uploaded By
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-purple-50">
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {record.file}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {formatToDubai12Hour(record.created_at)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {record.company_name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {record.uploaded_by}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalCount > rowsPerPage && (
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </button>

              <span className="text-gray-700">
                Page {currentPage} of {totalPages} | Showing {startEntry} to{" "}
                {endEntry} of {totalCount} records
              </span>

              <button
                className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || loading}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecordsPage;
