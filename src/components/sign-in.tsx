import { signIn } from "@/auth"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("discord", { redirectTo: "/" })
      }}
    >
      <button type="submit">Signin with Discord</button>
    </form>
  )
} 