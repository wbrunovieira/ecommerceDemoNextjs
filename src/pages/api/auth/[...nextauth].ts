import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      console.log('SignIn callback chamado:', { account, profile });
      if (account?.provider === 'google') {
        return true;
      }
      return false;
    },
    async session({ session, token }) {
      console.log('Session callback chamado:', { session, token });
      session.user = session.user ?? {};
      return session;
    },

    async jwt({ token, account }) {
      console.log('JWT callback chamado:', { token, account });
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback chamado:', { url, baseUrl });
      return baseUrl;
    },
  },

  pages: {
    signIn: '/auth/signin',
  },
});
