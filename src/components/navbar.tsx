import { auth } from "@/auth";
import { SignOut } from "./signout-button";
import Link from "next/link";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="w-full p-4 flex justify-between items-center border-b">
      <div className="text-xl font-bold"><Link href="/">Alien</Link></div>
      <div className="space-x-4 flex items-center">
        {!session ? (
          <Link href="/login" className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors">
            Login
          </Link>
        ) : (
          <SignOut />
        )}
      </div>
    </nav>
  );
}
