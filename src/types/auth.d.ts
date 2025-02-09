import { type DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      role: 'user' | 'admin' | 'none'
    } & DefaultSession['none']
  }

  interface User {
    role: 'user' | 'admin' | 'none'
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser {
    role: 'user' | 'admin' | 'none'
  }
}