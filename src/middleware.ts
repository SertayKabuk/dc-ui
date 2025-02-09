import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default async function middleware(request: NextRequest) {
console.log(request)
  
  return NextResponse.next()
}