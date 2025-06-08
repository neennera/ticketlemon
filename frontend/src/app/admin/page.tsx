"use client";

import Header from "@/app/components/Header";
import { useEffect, useState } from "react";
import axios from "axios";

interface Ticket {
  ticketUUID: string;
  ticketId: string;
  customerName: string;
  customerAge: number;
  customerGender: string;
  status: "PROCESS" | "SUCCESS" | "FAIL";
}

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<
    "ALL" | "PROCESS" | "SUCCESS" | "FAIL"
  >("ALL");
  const [isLoading, setIsLoading] = useState(false);

  const fetchTickets = async (
    page = 1,
    status: "ALL" | "PROCESS" | "SUCCESS" | "FAIL" = "ALL"
  ) => {
    setIsLoading(true);
    try {
      const url =
        status === "ALL"
          ? `http://localhost:80/admin/tickets?page=${page}&limit=10`
          : `http://localhost:80/admin/tickets/status/${status}?page=${page}&limit=10`;

      const response = await axios.get(url);

      setTickets(response.data.data);
      setTotalPages(Math.ceil(response.data.total / 10));
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(currentPage, selectedStatus);
  }, [currentPage, selectedStatus]);

  const handleStatusFilter = (
    status: "ALL" | "PROCESS" | "SUCCESS" | "FAIL"
  ) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleStatusUpdate = async (
    ticketUUID: string,
    newStatus: "SUCCESS" | "FAIL"
  ) => {
    try {
      await axios.patch(`http://localhost:80/updateTicket/free`, {
        ticketUUID: ticketUUID,
        status: newStatus,
      });
      fetchTickets(currentPage, selectedStatus);
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  return (
    <div className="w-full space-y-10 relative bg-gray-200 flex flex-col items-center justify-items-center min-h-screen px-8 pb-20 py-30 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      <Header />
      <div className="text-4xl font-bold">Admin Page</div>

      {/* Ticket List Section */}
      <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Ticket Applications</h2>
          <div className="space-x-2">
            <button
              onClick={() => handleStatusFilter("ALL")}
              className={`px-4 py-2 rounded-md ${
                selectedStatus === "ALL"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter("PROCESS")}
              className={`px-4 py-2 rounded-md ${
                selectedStatus === "PROCESS"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Process
            </button>
            <button
              onClick={() => handleStatusFilter("SUCCESS")}
              className={`px-4 py-2 rounded-md ${
                selectedStatus === "SUCCESS"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Done
            </button>
            <button
              onClick={() => handleStatusFilter("FAIL")}
              className={`px-4 py-2 rounded-md ${
                selectedStatus === "FAIL"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Fail
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ticket ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr key={ticket.ticketUUID}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ticket.ticketId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ticket.status === "SUCCESS"
                              ? "bg-green-100 text-green-800"
                              : ticket.status === "FAIL"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ticket.status === "PROCESS" &&
                          ticket.ticketId.includes("TF") && (
                            <div className="space-x-2">
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    ticket.ticketUUID,
                                    "SUCCESS"
                                  )
                                }
                                className="px-3 py-1 bg-green-600 cursor-pointer text-white rounded-md hover:bg-green-700"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(ticket.ticketUUID, "FAIL")
                                }
                                className="px-3 py-1 cursor-pointer bg-red-600 text-white rounded-md hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        {ticket.status === "PROCESS" &&
                          ticket.ticketId.includes("TB") && (
                            <p className="text-gray-500 italic">
                              payment process
                            </p>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
