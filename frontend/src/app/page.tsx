"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { circusShows } from "@/data/mockData";

export default function Home() {
  interface CircusShow {
    id: number;
    showName: string;
    showImage: string;
    showDescription: string;
    showCasting: string;
    showTime: string;
  }
  const [selectedShow, setSelectedShow] = useState<CircusShow | null>(null);

  return (
    <main className="min-h-screen bg-red-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/circus-tent.jpg"
            alt="Circus Tent Background"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <div className="z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-yellow-400 mb-6 font-circus">
            TicketLemon
          </h1>
          <p className="text-white text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
            Step right up to the greatest show on Earth! Secure your seats to
            witness spectacular performances, death-defying stunts, and magical
            moments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/buy"
              className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-red-900 font-bold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Buy Tickets
            </Link>
            <Link
              href="/free"
              className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-red-900 font-bold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Free Tickets
            </Link>
            <Link
              href="/status"
              className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-red-900 font-bold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Check Status
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <div className="animate-bounce">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Ongoing Shows Section */}
      <section className="py-16 px-4 bg-red-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-800">
            <span className="inline-block transform -rotate-2 bg-yellow-400 px-4 py-2">
              Ongoing Shows
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {circusShows.map((show) => (
              <div
                key={show.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg transform transition-all hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative h-64">
                  <Image
                    src={show.showImage}
                    alt={show.showName}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-red-800 mb-2">
                    {show.showName}
                  </h3>
                  <button
                    onClick={() => setSelectedShow(show)}
                    className="mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-red-900 font-bold rounded-full text-sm transition-all"
                  >
                    See More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>
            © 2023 TicketLemon Circus. All rights under the big top reserved!
          </p>
        </div>
      </footer>

      {/* Modal for Show Details */}
      {selectedShow && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-80">
              <Image
                src={selectedShow.showImage}
                alt={selectedShow.showName}
                fill
                style={{ objectFit: "cover" }}
              />
              <button
                onClick={() => setSelectedShow(null)}
                className="absolute top-4 right-4 bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-bold text-red-800 mb-4">
                {selectedShow.showName}
              </h3>
              <p className="text-gray-700 mb-4">
                {selectedShow.showDescription}
              </p>
              <p className="text-gray-800 font-medium mb-2">
                {selectedShow.showCasting}
              </p>
              <p className="text-gray-800 font-bold">
                Show Time: {new Date(selectedShow.showTime).toLocaleString()}
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  href="/buy"
                  className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-red-900 font-bold rounded-full text-lg transition-all"
                >
                  Get Tickets Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
