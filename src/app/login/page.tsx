import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { signIn } from "@/auth"

export default async function LoginPage() {
  const session = await auth()
  
  // Redirect to home if already authenticated
  if (session) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form
          action={async () => {
            "use server"
            await signIn("discord", { redirectTo: "/" })
          }}
          className="space-y-4"
        >
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-[#5865F2] hover:bg-[#4752C4] rounded-lg transition-colors"
          >
            Sign in with Discord
          </button>
        </form>
      </div>
    </div>
  )
}