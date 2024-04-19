import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { Profile } from 'next-auth';

interface ExtendedProfile extends Profile {
  picture?: string;
}

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        name: { label: 'name', type: 'text', optional: true },
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials, req) {
        console.log('Autorizando com credenciais:', credentials);
        if (!credentials) {
          return null;
        }
        const isSignUp = !!credentials.name;
        const endpoint = isSignUp
          ? 'http://localhost:3333/accounts'
          : 'http://localhost:3333/sessions';
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            name: credentials?.name,
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const user = await response.json();

        if (user && response.ok) {
          return user;
        }

        return null;
      },
    }),
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
  pages: {
    signIn: '/cadastro',
  },
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: any;
      account: any;
      profile?: ExtendedProfile;
    }) {
      if (account?.provider === 'google') {
        const picture = profile?.picture;
        const endpoint = 'http://localhost:3333/accounts/google';
        const payload = {
          name: profile?.name,
          email: profile?.email,
          googleUserId: profile?.sub,
          profileImageUrl: profile?.picture || '',
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    },
    async jwt({
      token,
      user,
      account,
      profile,
    }: {
      token: any;
      user: any;
      account: any;
      profile?: ExtendedProfile;
    }) {
      if (account && user) {
        token.accessToken = user.accessToken;
        token.user = user;
      }

      if (account && !user && account.access_token) {
        token.accessToken = account.access_token;
      }
      if (account && profile && account.provider === 'google') {
        token.sub = profile.sub;
        token.picture = profile.picture;
      }

      return token;
    },

    async session({ session, token }) {
      session = token.user as any;

      return session;
    },
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST, nextAuthOptions };
