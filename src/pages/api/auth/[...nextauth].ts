import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { Profile } from 'next-auth';
import { User as NextAuthUser } from 'next-auth';

interface ExtendedProfile extends Profile {
  sub?: string;
  picture?: string;
}

interface ExtendedUser extends NextAuthUser {
  sub?: string;
  picture?: string;
}
export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ account, profile }) {
     
      if (account?.provider === 'google') {
        return true;
      }
      return false;
    },

    jwt: async ({ token, account, profile }) => {
     
      if (account && profile) {
        token.sub = (profile as any).sub;
        token.picture = (profile as any).picture;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
     

      return '/auth/signin';
    },
    session: async ({ session, token }) => {
     
      session.user = {
        name: token.name ?? '',
        email: token.email ?? '',
        image: token.picture ?? '',
        sub: token.sub ?? '',
      } as ExtendedUser;

      session.token = {
        access_token: String(token.accessToken ?? ''),
      };
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
  },
});
