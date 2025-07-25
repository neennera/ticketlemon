"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";

const formSchema = z.object({
  customerName: z.string().min(3, "Name must be at least 3 characters"),
  customerAge: z.number().min(15, "You must be at least 15 years old"),
  customerGender: z.enum(["male", "female", "LGBT+"]),
  customerSecurityNumber: z
    .string()
    .length(8, "Security number must be 8 digits"),
  Q1: z
    .string()
    .min(
      10,
      "Please share your favorite moment with LEMON band with length more than 10 characters"
    ),
  Q2: z
    .string()
    .min(
      10,
      "Please tell us why you want to attend this concert with length more than 10 characters"
    ),
  Q3: z
    .string()
    .min(
      10,
      "Please share your story related to the band with length more than 10 characters"
    ),
});

type FormData = z.infer<typeof formSchema>;

const ticketIdPopup = ({ ticketId }: { ticketId: string }) => {
  return (
    <div className="fixed  flex-col space-y-5 top-0 left-0 w-full h-full bg-black/92 bg-opacity-50 flex items-center justify-center">
      <p className="text-4xl text-white">Your Ticker ID is</p>
      <p className="text-4xl font-bold text-white my-10">{ticketId}</p>
      <p className="text-xl text-white">
        please <strong className="text-yellow-500">copy & remember</strong> this
        number to check your status
      </p>

      <a href="/payment" className="bg-yellow-500 py-2 px-8 mt-3">
        Go To Check Status Page
      </a>
    </div>
  );
};

export default function Home() {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [ticketId, setTicketId] = useState<string>("");
  const [seatError, setSeatError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    const customer = {
      customerName: data.customerName,
      customerAge: data.customerAge,
      customerGender: data.customerGender,
      customerSecurityNumber: data.customerSecurityNumber,
    };
    const questions = {
      Q1: data.Q1,
      Q2: data.Q2,
      Q3: data.Q3,
    };
    try {
      await axios
        .post(
          `${
            process.env.BACKEND_URL || "http://localhost:80"
          }/applyTicket/free`,
          {
            customer,
            questions,
          }
        )
        .then((response) => {
          setTicketId(response.data.data);
          setShowPopup(true);
        })
        .catch((error) => {
          throw new Error(error.response.data.error);
        });
      setShowPopup(true);
    } catch (error: unknown) {
      setSeatError(error instanceof Error ? error.message : "error");
    }
  };

  return (
    <div className="flex w-140 items-center  flex-col justify-center ">
      {showPopup && ticketIdPopup({ ticketId })}
      <div className="text-4xl font-bold max-w-2xl w-full text-center text-white">
        Apply Free ticket🍋
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl mt-8 space-y-6 bg-white/95 border border-white p-8 rounded-lg shadow-xl"
      >
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
            type="text"
            maxLength={11}
          />
          {errors.customerSecurityNumber && (
            <p className="mt-1 p-2 text-sm text-red-600">
              {errors.customerSecurityNumber.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            What is your most cherished moment with LEMON band?
          </label>
          <textarea
            {...register("Q1")}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={4}
          />
          {errors.Q1 && (
            <p className="mt-1 p-2 text-sm text-red-600">{errors.Q1.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Why do you want to attend this concert?
          </label>
          <textarea
            {...register("Q2")}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={4}
          />
          {errors.Q2 && (
            <p className="mt-1 p-2 text-sm text-red-600">{errors.Q2.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Share your personal story related to LEMON band
          </label>
          <textarea
            {...register("Q3")}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={4}
          />
          {errors.Q3 && (
            <p className="mt-1 p-2 text-sm text-red-600">{errors.Q3.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          Submit
        </button>
        <p className="mt-1 p-2 text-sm text-red-600">{seatError}</p>
      </form>
    </div>
  );
}
