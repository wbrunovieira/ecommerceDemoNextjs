import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Profile } from "next-auth";

interface ExtendedProfile extends Profile {
  picture?: string;
}

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        name: { label: "name", type: "text", optional: true },
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("Autorizando com credenciais:", credentials);

        if (!credentials) {
          console.log("Credenciais não fornecidas");
          return null;
        }

        const responseCheck = await fetch(
          "http://localhost:3333/accounts/check",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: credentials.email }),
          }
        );

        console.log("responseCheck", responseCheck);

        const exists = await responseCheck.text();
        const userExists = exists.trim().toLowerCase() === "true";

        if (!userExists && credentials.name) {
          const responseCreate = await fetch("http://localhost:3333/accounts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: credentials.name,
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!responseCreate.ok) {
            console.log("Falha ao criar usuário");
            return null;
          }

          const user = await responseCreate.json();
          console.log("Usuário criado com sucesso:", user);

          console.log("Usuário autenticado:user.user.name", user.user.name);

          return {
            user: {
              id: user.user.id,
              name: user.user.name,
              email: user.user.email,
            },
            accessToken: user.access_token,
            id: user.user.id,
            name: user.user.name,
          };
        }

        const response = await fetch("http://localhost:3333/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          console.log("Falha ao autenticar");
          return null;
        }

        const user = await response.json();

        console.log("Usuário autenticado:user.id", user.user.id);
        console.log(
          "Usuário autenticado user.access_token:",
          user.access_token
        );

        return {
          user: {
            id: user.user.id,
            name: user.user.name,
            email: user.user.email,
          },
          accessToken: user.access_token,
          id: user.user.id,
          name: user.user.name,
          email: user.user.email,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
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
      if (account?.provider === "google") {
        const endpointCheck = "http://localhost:3333/accounts/check";
        const endpointCreate = "http://localhost:3333/accounts/google";
        console.log("profile", profile);

        const payload = {
          name: profile?.name,
          email: profile?.email,
          googleUserId: profile?.sub,
          profileImageUrl: profile?.picture || "",
        };
        console.log("payload", payload);
        console.log("email", profile?.email);

        const responseCheck = await fetch(endpointCheck, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: profile?.email }),
        });
        console.log("responseCheck", responseCheck);

        const responseText = await responseCheck.text();
        const response = JSON.parse(responseText);
        const { found, user: existingUser } = response;
        console.log("responseText", responseText);

        console.log("response", response);
        console.log("found", found);
        console.log("existingUser", existingUser);

        if (responseCheck.ok && found) {
          console.log("Usuário já existe");
          user.id = existingUser.id;
          console.log("user.id", existingUser.id);
          user.email = existingUser.email;
          user.name = existingUser.name;
          return true;
        } else if (responseCheck.ok && !found) {
          console.log("Usuário não existe");

          const responseCreate = await fetch(endpointCreate, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          console.log("responseCreate", responseCreate);

          if (!responseCreate.ok) {
            console.error("Failed to create user");
            return false;
          }

          const createdUser = await responseCreate.json();
          console.log("Usuário criado com sucesso:", createdUser);

          user.id = createdUser.user._id.value;

          return true;
        }
        console.log("chegou aqui no false do fim 1");
      }

      if (account?.provider === "credentials") {
        return !!user;
      }
      console.log("chegou aqui no false do fim");
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
      console.log("JWT Callback - Token inicial:", token);
      console.log("JWT Callback - User:", user);
      console.log("JWT Callback - Account:", account);
      console.log("JWT Callback - Profile:", profile);

      if (account) {
        token.accessToken = account.access_token;

        if (account.provider === "google" && profile) {
          token.id = user.id;
          token.picture = profile.picture;
          token.email = profile.email;
          token.name = profile.name;
        }
      }

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.accessToken =
          account?.provider === "google"
            ? account.access_token
            : user.accessToken;
      }

      console.log("JWT Callback - Token final:", token);
      return token;
    },

    async session({ session, token }) {
      console.log("session original", session);
      console.log("token no session", token);

      if (typeof token.id === "string") {
        session.user.id = token.id;
      } else if (typeof token.sub === "string") {
        session.user.id = token.sub;
      } else {
        session.user.id = "default_id";
      }

      session.user.name = token.name || null;
      session.user.email = token.email || null;
      session.user.image = token.picture || null;

      session.accessToken =
        typeof token.accessToken === "string" ? token.accessToken : "";

      console.log("Session Modified:", session);

      console.log("session.accessToken", session.accessToken);
      return session;
    },
  },
};
