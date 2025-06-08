export default function Header() {
  return (
    <header className="w-full flex justify-center space-x-5  absolute top-0 left-0 right-0 bg-yellow-50">
      <a href="/buy" className="py-2 px-10 font-bold hover:bg-yellow-500">
        buy ticket
      </a>
      <a href="/free" className="py-2 px-10 font-bold hover:bg-yellow-500">
        free ticket
      </a>
      <a href="/admin" className="py-2 px-10 font-bold hover:bg-yellow-500">
        admin
      </a>
    </header>
  );
}
