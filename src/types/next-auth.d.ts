import 'next-auth';

declare module 'next-auth' {
  interface User {
    id?: string;
    name?: string | null;
    email?: string;
    picture?: string;
    accessToken?: string;
  }

  interface Session {
    id: string;
    name: string;
    email: string;
    image?: string;
    accessToken?: string;
  }
}
