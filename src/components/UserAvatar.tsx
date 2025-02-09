import { auth } from "../auth"
import Image from 'next/image';

export default async function UserAvatar() {
  const session = await auth()
 
  if (!session?.user) return null
 
  return (
    <div className="flex flex-col items-center justify-center w-full text-center p-8">
      <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
          <Image 
            src={session.user.image ?? ''} 
            alt="User Avatar" 
            width={156} 
            height={156}
            className="rounded-full mb-4 shadow-lg border-4 border-white hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {session.user.name ?? 'N/A'}
          </p>
          <p className="text-gray-600 font-medium">
            {session.user.email ?? 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}