"use client";

import Header from "@/app/components/Header";
import { useEffect, useState } from "react";
import axios from "axios";

interface Ticket {
  ticketUUID: string;
  ticketId: string;
  zone: string;
  seat: string;
  customerName: string;
  customerAge: number;
  customerGender: string;
  status: "PROCESS" | "SUCCESS" | "FAIL";
}

interface TicketDetail {
  Q1: string;
  Q2: string;
  Q3: string;
  ticketId: string;
  ticketUUID: string;
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
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTickets = async (
    page = 1,
    status: "ALL" | "PROCESS" | "SUCCESS" | "FAIL" = "ALL"
  ) => {
    setIsLoading(true);
    try {
      const url =
        status === "ALL"
          ? `${
              process.env.BACKEND_URL || "http://localhost:80"
            }/admin/tickets?page=${page}&limit=10`
          : `${
              process.env.BACKEND_URL || "http://localhost:80"
            }/admin/tickets/status/${status}?page=${page}&limit=10`;

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

  const handleViewAnswers = async (ticketId: string) => {
    try {
      const response = await axios.get(
        `${process.env.BACKEND_URL || "http://localhost:80"}/ticket/${ticketId}`
      );
      setSelectedTicket(response.data.data[0]);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  };

  const handleStatusUpdate = async (
    ticketUUID: string,
    newStatus: "SUCCESS" | "FAIL"
  ) => {
    try {
      await axios.patch(
        `${process.env.BACKEND_URL || "http://localhost:80"}/updateTicket/free`,
        {
          ticketUUID: ticketUUID,
          status: newStatus,
        }
      );
      setIsModalOpen(false);
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
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seat
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
                        {ticket.zone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ticket.seat === "F00" ? "-" : ticket.seat}
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
                            <button
                              onClick={() => handleViewAnswers(ticket.ticketId)}
                              className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                            >
                              View Answer
                            </button>
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

      {/* Modal */}
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              Ticket Details - {selectedTicket.ticketId}
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">
                  What is your most cherished moment with LEMON band?
                </h3>
                <p className="mt-1 text-gray-600">{selectedTicket.Q1}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700">
                  Why do you want to attend this concert?
                </h3>
                <p className="mt-1 text-gray-600">{selectedTicket.Q2}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700">
                  Share your personal story related to LEMON band
                </h3>
                <p className="mt-1 text-gray-600">{selectedTicket.Q3}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() =>
                  handleStatusUpdate(selectedTicket.ticketUUID, "SUCCESS")
                }
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() =>
                  handleStatusUpdate(selectedTicket.ticketUUID, "FAIL")
                }
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
