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
          console.log('Credenciais não fornecidas');
          return null;
        }

        const responseCheck = await fetch(
          'http://localhost:3333/accounts/check',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: credentials.email }),
          }
        );
        console.log('responseCheck', responseCheck);

        const exists = await responseCheck.text();
        console.log('exists', exists);
        if (exists.trim() === 'true') {
          console.log('Usuário já existe, falha ao criar novo usuário');
          return null;
        }

        const response = await fetch('http://localhost:3333/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: credentials.name,
            email: credentials.email,
            password: credentials.password,
          }),
        });
        console.log('response', response);

        const user = await response.json();
        console.log('user', user);

        if (user && response.ok) {
          console.log('Usuário criado com sucesso:', user);
          return user;
        }

        console.log('Falha ao criar usuário');
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
    signIn: '/login',
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
        console.log('account no jwt account e user', account);
        token.accessToken = user.accessToken;
        token.user = user;
      }

      if (account && user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      } else if (account && !user && account.access_token) {
        console.log('account no user', account);
        token.accessToken = account.access_token;
      }
      if (account && profile && account.provider === 'google') {
        console.log(
          'account no jwt account, profile e account.provider google',
          account
        );
        token.sub = profile.sub;
        token.picture = profile.picture;
      }

      console.log('token no jwt', token);
      return token;
    },

    async session({ session, token }) {
      // console.log('session', session);
      // session = token.user as any;
      // console.log('session no session', session);
      console.log('session original', session);
      console.log('token no session', token);
      if (token.user) {
        session.user = token.user;
        console.log('session.user', session.user); // Adiciona usuário à sessão se presente no token
      }
      console.log('Tipo de profileImageUrl:', typeof token.profileImageUrl);
      console.log('Valor de profileImageUrl:', token.profileImageUrl);

      // Você pode também querer adicionar informações específicas de provedores externos
      // if (typeof token.picture === 'string') {
      //   session.user?.image = token.picture; // Adiciona a imagem do perfil, se disponível
      // }
      console.log('session no session', session);
      return session;
    },
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST, nextAuthOptions };
