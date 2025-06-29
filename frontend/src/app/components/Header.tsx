import Link from "next/link";

export default function Header() {
  return (
    <header className="w-screen flex flex-wrap max-sm:text-sm z-20 sm:flex-row justify-center sm:space-x-5 py-2 fixed backdrop-blur-sm top-0 left-0 right-0 bg-yellow-500/30">
      <Link
        href="/"
        className="py-2 px-10 font-bold lg:absolute left-3 text-xl  hover:text-yellow-800"
      >
        TICKETLEMON
      </Link>
      <Link
        href="/buy"
        className="py-2 px-10 font-bold hover:bg-yellow-500 rounded-sm"
      >
        buy ticket
      </Link>

      <Link
        href="/free"
        className="py-2 px-10 font-bold hover:bg-yellow-500 rounded-sm"
      >
        free ticket
      </Link>
      <Link
        href="/payment"
        className="py-2 px-10 font-bold hover:bg-yellow-500 rounded-sm"
      >
        payment
      </Link>
      <Link
        href="/status"
        className="py-2 px-10 font-bold hover:bg-yellow-500 rounded-sm"
      >
        check status
      </Link>
      <Link
        href="/admin"
        className="lg:absolute right-3 py-2 px-10  italic text-yellow-700 hover:text-yellow-900"
      >
        for admin
      </Link>
    </header>
  );
}
