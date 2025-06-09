"use client";
import Header from "@/app/components/Header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

const formSchema = z.object({
  ticketID: z.string().length(7, "ticketID must be 7 characters"),
  paymentPlatform: z.enum(["QRCODE", "DIRECT", "PAYPLAT"]),
  paymentReference: z
    .string()
    .min(3, "must be length at least 3")
    .max(255, " must be under 255 characters"),
});

type FormData = z.infer<typeof formSchema>;

const completePopup = () => {
  return (
    <div className="fixed  flex-col space-y-5 top-0 left-0 w-full h-full bg-black/92 bg-opacity-50 flex items-center justify-center">
      <p className="text-4xl text-white">Success 📣</p>
      <Link href="/" className="bg-yellow-500 py-2 px-8 mt-3">
        Go To Home
      </Link>
    </div>
  );
};

export default function Home() {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    const bodyData = {
      ticketID: data.ticketID,
      paymentPlatform: data.paymentPlatform,
      paymentReference: data.paymentReference,
    };

    // use Axios to send data to backend
    try {
      await axios
        .patch(
          `${
            process.env.BACKEND_URL || "http://localhost:80"
          }/updateTicket/buy`,
          bodyData
        )
        .then(() => setShowPopup(true));
    } catch {
      console.error("Error completing payment:");
    }
  };

  return (
    <div className="w-full space-y-10 relative bg-gray-200 flex flex-col items-center justify-items-center min-h-screen px-8 pb-20 py-30 sm:px-20 font-[family-name:var(--font-geist-sans)]">
      {showPopup && completePopup()}
      <Header />
      <div className="text-4xl font-bold">Complete Payment</div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl mt-8 space-y-6 bg-white p-8 rounded-lg shadow-xl"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            TicketId
          </label>
          <input
            {...register("ticketID")}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            type="text"
          />
          {errors.ticketID && (
            <p className="mt-1 p-2 text-sm text-red-600">
              {errors.ticketID.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Platform
          </label>
          <select
            {...register("paymentPlatform")}
            className="mt-1 p-2 block w-full rounded-md py-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Payment Platform</option>
            <option value="QRCODE">QRCODE</option>
            <option value="DIRECT">DIRECT</option>
            <option value="PAYPLAT">PAYPLAT</option>
          </select>
          {errors.paymentPlatform && (
            <p className="mt-1 p-2 text-sm text-red-600">
              {errors.paymentPlatform.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            paymentReference
          </label>
          <input
            {...register("paymentReference")}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            type="string"
            maxLength={255}
          />
          {errors.paymentReference && (
            <p className="mt-1 p-2 text-sm text-red-600">
              {errors.paymentReference.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="text-xl font-bold bg-yellow-400 hover:bg-yellow-500 py-2 px-5 rounded-xl cursor-pointer"
        >
          Complete Payment
        </button>
      </form>
    </div>
  );
}
