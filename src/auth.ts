import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({

  secret: process.env.BETTER_AUTH_SECRET,

  providers: [

    Google({

      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),

    Credentials({


      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          role: user.role,
          isPremium: user.isPremium,
        };
      }
    })
  ],

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
  },

  callbacks: {

    async signIn({ user, account }) {
    // only for Google login
    if (account?.provider === 'google') {
      try {
        // check if user already exists
        const existing = await prisma.user.findUnique({
          where: { email: user.email! }
        });

        // if not exists → create them
        if (!existing) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              password: '',
              // no password for Google users ✅
              role: 'user',
            }
          });
        }
        return true; // allow sign in ✅
      } catch {
        return false; // block sign in ❌
      }
    }
    return true; // allow credentials sign in ✅
  },


    jwt({ token, user }) {
    //         ^^^^^^^^^ ✅ fixed — added )
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.isPremium = (user as any).isPremium;
        // ^^^^^ ✅ fixed — token not skipToken
      }
      return token;
    },

    session({ session, token }) {
      if (token) {
        session.user.id = token.id as any;
        session.user.role = token.role as any;
        session.user.isPremium = token.isPremium as boolean;
      }
      return session;
    }

  }

});