"use client";
import Header from "@/app/components/Header";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

const formSchema = z.object({
  customerName: z.string().min(3, "Name must be at least 3 characters"),
  customerAge: z.number().min(15, "You must be at least 15 years old"),
  customerGender: z.enum(["male", "female", "LGBT+"]),
  customerSecurityNumber: z
    .string()
    .regex(/^[0-9]{8}$/, "Security number must be 8 digits"),
});

const ticketIdPopup = ({ ticketId }: { ticketId: string }) => {
  return (
    <div className="fixed  flex-col space-y-5 top-0 left-0 w-full h-full bg-black/92 bg-opacity-50 flex items-center justify-center">
      <p className="text-4xl text-white">Your Tikter ID is</p>
      <p className="text-4xl font-bold text-white my-10">{ticketId}</p>
      <p className="text-xl text-white">
        please <strong className="text-yellow-500">copy & remember</strong> this
        number
      </p>
      <p className="text-xl text-white">
        please use this ID to complete your payment
      </p>
      <a href="/payment" className="bg-yellow-500 py-2 px-8 mt-3">
        Go To Payment Page
      </a>
    </div>
  );
};

export default function Home() {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [seatError, setSeatError] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string>("");
  const [seated, setSeated] = useState<boolean[]>(Array(20).fill(false));

  useEffect(() => {
    axios
      .get(`${process.env.BACKEND_URL || "http://localhost:80"}/buyseatleft`)
      .then((res) => {
        setSeated(JSON.parse(res.data.data));
      });
  }, []);

  const Seat = ({ seatNumber }: { seatNumber: number }) => {
    return (
      <button
        onClick={() => {
          setSelectedSeat(selectedSeat === seatNumber ? null : seatNumber);
        }}
        disabled={seated[seatNumber - 1]}
        className={`w-13 disabled:bg-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed h-13 text-center items-center justify-center flex font-semibold hover:bg-yellow-300 cursor-pointer ${
          selectedSeat && selectedSeat === seatNumber
            ? "bg-yellow-500"
            : "bg-gray-300"
        } rounded-full`}
      >
        {`B${seatNumber}`}
      </button>
    );
  };
  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!selectedSeat) {
      setSeatError(true);
      return;
    }
    setSeatError(false);

    const customer = {
      customerName: data.customerName,
      customerAge: data.customerAge,
      customerGender: data.customerGender,
      customerSecurityNumber: data.customerSecurityNumber,
    };

    try {
      await axios
        .post(
          `${process.env.BACKEND_URL || "http://localhost:80"}/applyTicket/buy`,
          {
            customer,
            seatNumber: "B" + String(selectedSeat).padStart(2, "0"),
          }
        )
        .then((response) => {
          setTicketId(response.data.data);
          setShowPopup(true);
        });
    } catch {
      console.error("Error completing payment:");
    }
  };

  return (
    <div className="w-full space-y-10 relative bg-gray-200 flex flex-col items-center justify-items-center min-h-screen px-8 pb-20 py-30 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      <Header />
      {showPopup && ticketIdPopup({ ticketId })}
      <div className="text-4xl font-bold">Buy the ticket🍋</div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl mt-8 space-y-6 bg-white p-8 rounded-lg shadow-xl"
      >
        <div className="w-full flex flex-col items-center justify-items-center">
          <p>please select only ONE seat</p>
          <div className="grid gap-2 grid-cols-5 my-5">
            {[...Array(20)].map((_, i) => (
              <Seat key={i} seatNumber={i + 1} />
            ))}
          </div>
          {seatError && (
            <p className="mt-1 p-2 text-sm text-red-600">
              please select a seat
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            {...register("customerName")}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            type="text"
          />
          {errors.customerName && (
            <p className="mt-1 p-2 text-sm text-red-600">
              {errors.customerName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            {...register("customerAge", { valueAsNumber: true })}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            type="number"
          />
          {errors.customerAge && (
            <p className="mt-1 p-2 text-sm text-red-600">
              {errors.customerAge.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            {...register("customerGender")}
            className="mt-1 p-2 block w-full rounded-md py-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="LGBT+">LGBT+</option>
          </select>
          {errors.customerGender && (
            <p className="mt-1 p-2 text-sm text-red-600">
              {errors.customerGender.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Security Number
          </label>
          <input
            {...register("customerSecurityNumber")}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            type="string"
            maxLength={11}
          />
          {errors.customerSecurityNumber && (
            <p className="mt-1 p-2 text-sm text-red-600">
              {errors.customerSecurityNumber.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="text-xl font-bold bg-yellow-400 hover:bg-yellow-500 py-2 px-5 rounded-xl cursor-pointer"
        >
          Reserved Seat
        </button>
      </form>
    </div>
  );
}
