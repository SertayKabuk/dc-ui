import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default async function proxy(request: NextRequest) {
console.log(request)
  
  return NextResponse.next()
}