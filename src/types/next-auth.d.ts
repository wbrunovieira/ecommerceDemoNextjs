import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string | null;
    email?: string;
    picture?: string;
    accessToken?: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }

  interface JWT {
    accessToken?: string;
    id?: string;
    name?: string;
    email?: string;
    picture?: string;
    role?: string;
    user?: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role?: string;
    };
  }
}
