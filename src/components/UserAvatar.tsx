import { auth } from "../auth"
import Image from 'next/image';

export default async function UserAvatar() {
  const session = await auth()
 
  if (!session?.user) return null
 
  return (
    <div>
      <Image 
        src={session.user.image ?? ''} 
        alt="User Avatar" 
        width={32} 
        height={32}
        className="rounded-full"
      />
      <div>
        <p>Name: {session.user.name ?? 'N/A'}</p>
        <p>Email: {session.user.email ?? 'N/A'}</p>
      </div>
    </div>
  )
}