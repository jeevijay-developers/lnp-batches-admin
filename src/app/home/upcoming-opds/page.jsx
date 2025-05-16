"use client";
import React, { useEffect, useState } from "react";
import { getAllNextOPDs } from "../../../server/common";
import { ClipLoader } from "react-spinners";

const columns = [
  { key: "image", label: "" },
  { key: "title", label: "Title" },
  { key: "location", label: "Location" },
  { key: "date", label: "Date" },
  { key: "time", label: "Time" }
];

const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

const UpcomingOPDsPage = () => {
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 10;

  useEffect(() => {
    setLoading(true);
    getAllNextOPDs()
      .then((res) => {
        console.log("Upcoming OPDs data: ", res);
        
        setData(res);
        // setTotalPages(res.total ? Math.ceil(res.total / limit) : 1);
      })
      .catch((err) => {
        setData([]);
        setTotalPages(1);
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [pageNo]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-700 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-8">
          Upcoming OPDs
        </h1>
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-blue-200 dark:bg-gray-900 text-center text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4">
                    <div className="flex justify-center items-center w-full">
                      <ClipLoader
                        color={"#3b82f6"}
                        loading={loading}
                        size={30}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      /> 
                    </div>
                  </td>
                </tr>
              ) : data && data.length <= 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No data found.
                  </td>
                </tr>
              ) : (
                data && data.map((row) => (
                  <tr
                    key={row._id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-2 border-b text-center border-gray-200 dark:border-gray-700"
                      >                        {col.key === "image" ? (
                          <img 
                            src={row[col.key]} 
                            alt="OPD Image"
                            className="w-12 h-12 object-cover rounded-md mx-auto"
                          />
                        ) : col.key === "createdAt" ? (
                          formatDate(row[col.key])
                        ) : (
                          row[col.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white font-semibold disabled:opacity-50"
            onClick={() => setPageNo((p) => Math.max(1, p - 1))}
            disabled={pageNo === 1}
          >
            Previous
          </button>
          <span className="text-gray-700 dark:text-gray-200 font-semibold">
            Page {pageNo} of {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white font-semibold disabled:opacity-50"
            onClick={() => setPageNo((p) => Math.min(totalPages, p + 1))}
            disabled={pageNo === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingOPDsPage;
