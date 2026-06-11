import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      isPremium: boolean;
      // ^^^^^^^^^^^^^^^^
      // add this ✅
    } & DefaultSession['user']
  }

  interface User {
    role: string;
    isPremium: boolean;
    // ^^^^^^^^^^^^^^^^
    // add this ✅
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    isPremium: boolean;
    // ^^^^^^^^^^^^^^^^
    // add this ✅
  }
}