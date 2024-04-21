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
        const endpointCheck = 'http://localhost:3333/accounts/check';
        const endpointCreate = 'http://localhost:3333/accounts/google';
        console.log('profile', profile);
        const payload = {
          name: profile?.name,
          email: profile?.email,
          googleUserId: profile?.sub,
          profileImageUrl: profile?.picture || '',
        };
        console.log('payload', payload);
        console.log('email', profile?.email);

        const responseCheck = await fetch(endpointCheck, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: profile?.email }),
        });
        console.log('responseCheck', responseCheck);

        const responseText = await responseCheck.text();
        const userExists = responseText.trim().toLowerCase() === 'true';
        console.log('userExists', userExists);

        if (responseCheck.ok && userExists) {
          console.log('Usuário já existe');
          return true;
        } else if (responseCheck.ok && !userExists) {
          console.log('Usuário não existe');
          const responseCreate = await fetch(endpointCreate, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          console.log('responseCreate', responseCreate);
          return responseCreate.ok;
        }
        console.log('chegou aqui no false do fim 1');
      }
      console.log('chegou aqui no false do fim');
      return false;
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
        console.log('account no jwt', account);
        token.accessToken = user.accessToken;
        token.user = user;
      }

      if (account && !user && account.access_token) {
        console.log('account no jwt 2', account);
        token.accessToken = account.access_token;
      }
      if (account && profile && account.provider === 'google') {
        console.log('account no jwt 3', account);
        token.sub = profile.sub;
        token.picture = profile.picture;
      }

      console.log('token no jwt', token);
      return token;
    },

    async session({ session, token }) {
      console.log('session', session);
      session = token.user as any;
      console.log('session no session', session);
      return session;
    },
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST, nextAuthOptions };
