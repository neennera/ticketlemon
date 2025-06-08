"use client";
import Header from "@/app/components/Header";
import { useState } from "react";

export default function Home() {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const Seat = ({ seatNumber }: { seatNumber: number }) => {
    return (
      <button
        onClick={() => {
          setSelectedSeat(selectedSeat === seatNumber ? null : seatNumber);
        }}
        className={`w-13 h-13 text-center items-center justify-center flex font-semibold hover:bg-yellow-300 cursor-pointer ${
          selectedSeat && selectedSeat === seatNumber
            ? "bg-yellow-500"
            : "bg-gray-300"
        } rounded-full`}
      >
        B{seatNumber}
      </button>
    );
  };

  return (
    <div className="w-full space-y-10 relative bg-gray-200 flex flex-col items-center justify-items-center min-h-screen px-8 pb-20  py-30 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      <Header />
      <div className="text-4xl font-bold">Buy the ticket🍋</div>
      <div className="w-full flex flex-col items-center justify-items-center">
        <p>please select only ONE seat</p>
        <div className="grid gap-2 grid-cols-5 my-5">
          <Seat seatNumber={1} />
          <Seat seatNumber={2} />
          <Seat seatNumber={3} />
          <Seat seatNumber={4} />
          <Seat seatNumber={5} />
          <Seat seatNumber={6} />
          <Seat seatNumber={7} />
          <Seat seatNumber={8} />
          <Seat seatNumber={9} />
          <Seat seatNumber={10} />
          <Seat seatNumber={11} />
          <Seat seatNumber={12} />
          <Seat seatNumber={13} />
          <Seat seatNumber={14} />
          <Seat seatNumber={15} />
          <Seat seatNumber={16} />
          <Seat seatNumber={17} />
          <Seat seatNumber={18} />
          <Seat seatNumber={19} />
          <Seat seatNumber={20} />
        </div>
      </div>
      <button className="text-xl font-bold bg-yellow-400 hover:bg-yellow-500 py-2 px-5 rounded-xl cursor-pointer">
        Reserved Seat
      </button>
    </div>
  );
}
