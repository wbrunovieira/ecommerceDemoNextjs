import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

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
  },
  callbacks: {
    async signIn({ account, profile }) {
      console.log('SignIn callback chamado:', { account, profile });
      if (account?.provider === 'google') {
        return true;
      }
      return false;
    },
    jwt: async ({ token, account }) => {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      } else if (!token.accessToken) {
        token.accessToken = '';
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback chamado:', { url, baseUrl });
      return baseUrl;
    },
    async session({ session, token }) {
      session.user = {
        name: token.name ?? '',
        email: token.email ?? '',
        image: token.picture ?? '',
      };
      session.token = token;

      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
  },
});
