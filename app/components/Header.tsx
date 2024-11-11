import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#111111] text-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <ul className="flex flex-row space-x-6 justify-center">
          <li>
            <Link href="/" className="hover:text-[#901010] transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="hover:text-[#901010] transition-colors"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/playlist"
              className="hover:text-[#901010] transition-colors"
            >
              Playlist
            </Link>
          </li>
          <li>
            <Link
              href="/users"
              className="hover:text-[#901010] transition-colors"
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="hover:text-[#901010] transition-colors"
            >
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
