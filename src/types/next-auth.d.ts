
import 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string;
        name?: string | null;
        email?: string;
        picture?: string;
        accessToken?: string;
        role?: string;
    }

    interface Session {
        accessToken: string;
        user: User;
    }

    interface JWT {
        accessToken?: string;
        id?: string;
        name?: string;
        email?: string;
        picture?: string;
        role?: string;
    }
}
