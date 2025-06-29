"use client";
import { useState, FormEvent } from "react";
import axios from "axios";

interface Ticket {
  ticketUUID: string;
  ticketId: string;
  zone: string;
  seat: string;
  status: "PROCESS" | "SUCCESS" | "FAIL";
  // For free ticket, questions may be included
  Q1?: string;
  Q2?: string;
  Q3?: string;
}

export default function TicketStatusPage() {
  const [ticketId, setTicketId] = useState("");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setTicket(null);
    try {
      const backendUrl = process.env.BACKEND_URL || "http://localhost:80";
      const response = await axios.get(`${backendUrl}/ticket/${ticketId}`);
      if (
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        setTicket(response.data.data[0]);
      } else {
        setError("Ticket not found");
      }
    } catch {
      setError("Ticket not found");
    }
  };

  return (
    <div className="flex w-140 items-center  flex-col justify-center space-y-10 ">
      <div className="text-4xl font-bold text-center text-white">
        Check Your Ticket Status 🍋
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 relative bg-white/95 border border-white p-6 w-full max-w-2xl rounded-lg shadow-md"
      >
        <label htmlFor="ticketId" className="block text-lg font-medium">
          Ticket ID:
        </label>
        <input
          type="text"
          id="ticketId"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter your ticket ID"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 relative w-full cursor-pointer bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
        >
          Check Ticket
        </button>
      </form>

      {error && <div className="text-red-500 text-lg">{error}</div>}

      {ticket && (
        <div className="mt-8 p-6 w-120 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Ticket Details</h2>
          <p>
            <strong>Ticket ID:</strong> {ticket.ticketId}
          </p>
          <p>
            <strong>Zone:</strong> {ticket.zone}
          </p>
          <p>
            <strong>Seat:</strong> {ticket.seat}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {ticket.status != "PROCESS"
              ? ticket.status
              : ticket.zone === "FREE"
              ? "wait for admin to check your application"
              : "please complete payment process"}
          </p>
          {ticket.zone === "FREE" && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">
                Questions & Answers
              </h3>
              <p>
                <strong>Q1:</strong> {ticket.Q1 || "-"}
              </p>
              <p>
                <strong>Q2:</strong> {ticket.Q2 || "-"}
              </p>
              <p>
                <strong>Q3:</strong> {ticket.Q3 || "-"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
