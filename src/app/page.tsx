import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await auth()
  if (!session) return <div>Not authenticated</div>

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <div className="mb-12 flex flex-col items-center">
          <UserAvatar />
          <h1 className="text-3xl font-bold mt-4 mb-2">Welcome to Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your Discord servers and more</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/discord" 
                className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.175 13.175 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.061.061 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Discord Servers
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  View and manage your Discord servers
                </p>
              </div>
            </div>
          </Link>

          <Link href="/matches"
                className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.433 4.86a1 1 0 0 0-1.466-.572l-6 3a1 1 0 0 0-.467.467l-3 6a1 1 0 0 0 0 .894l3 6a1 1 0 0 0 .467.467l6 3a1 1 0 0 0 1.466-.572l3-12a1 1 0 0 0 0-.684l-3-12zM19.65 16.76l-4.8-2.4 2.4-4.8 4.8 2.4-2.4 4.8z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                  PUBG Matches
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  View your PUBG match history
                </p>
              </div>
            </div>
          </Link>

          {/* Placeholder for future features */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">More Coming Soon</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Additional features will be added here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Session info in a collapsible section */}
        <details className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400">
            Session Details
          </summary>
          <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-50 dark:bg-gray-900 rounded">
            {JSON.stringify(session, null, 2)}
          </pre>
        </details>
      </main>

      <footer className="mt-16 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-600 dark:text-gray-400">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
