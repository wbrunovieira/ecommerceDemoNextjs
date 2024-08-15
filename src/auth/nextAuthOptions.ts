import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { Profile } from 'next-auth';

interface ExtendedProfile extends Profile {
    picture?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

export const nextAuthOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                name: { label: 'name', type: 'text', optional: true },
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials, req) {
                if (!credentials) {
                    return null;
                }

                console.log('credentials.email ', credentials.email);
                const responseCheck = await fetch(
                    `${BASE_URL}/accounts/check'`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: credentials.email }),
                    }
                );
                console.log('responseCheck', responseCheck);

                const data = await responseCheck.json();
                const userExists = data.found;

                console.log('userExists', userExists);

                if (!userExists && credentials.name) {
                    console.log('userExists nao existe vamos criar');
                    const responseCreate = await fetch(`${BASE_URL}/accounts`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: credentials.name,
                            email: credentials.email,
                            password: credentials.password,
                            role: 'user',
                        }),
                    });
                    console.log('criado responseCreate', responseCreate);

                    if (!responseCreate.ok) {
                        return null;
                    }

                    const user = await responseCreate.json();
                    console.log('criado user', user);

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

                const response = await fetch(`${BASE_URL}/sessions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials),
                });

                if (!response.ok) {
                    return null;
                }

                const user = await response.json();

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
            clientSecret: process.env
                .NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
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
                const endpointCheck = `${BASE_URL}/accounts/check`;
                const endpointCreate = `${BASE_URL}/accounts/google`;

                const payload = {
                    name: profile?.name,
                    email: profile?.email,
                    googleUserId: profile?.sub,
                    profileImageUrl: profile?.picture || '',
                };

                const responseCheck = await fetch(endpointCheck, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: profile?.email }),
                });

                const responseText = await responseCheck.text();
                const response = JSON.parse(responseText);
                const { found, user: existingUser } = response;

                if (responseCheck.ok && found) {
                    user.id = existingUser.id;

                    user.email = existingUser.email;
                    user.name = existingUser.name;
                    return true;
                } else if (responseCheck.ok && !found) {
                    const responseCreate = await fetch(endpointCreate, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });

                    if (!responseCreate.ok) {
                        console.error('Failed to create user');
                        return false;
                    }

                    const createdUser = await responseCreate.json();

                    user.id = createdUser.user._id.value;

                    return true;
                }
            }

            if (account?.provider === 'credentials') {
                return !!user;
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
            if (account) {
                token.accessToken = account.access_token;

                if (account.provider === 'google' && profile) {
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
                    account?.provider === 'google'
                        ? account.access_token
                        : user.accessToken;
            }

            return token;
        },

        async session({ session, token }) {
            console.log('session', session);
            console.log('token', token);
            if (typeof token.id === 'string') {
                session.user.id = token.id;
            } else if (typeof token.sub === 'string') {
                session.user.id = token.sub;
            } else {
                session.user.id = 'default_id';
            }

            session.user.name = token.name || null;
            session.user.email = token.email || null;
            session.user.image = token.picture || null;

            session.accessToken =
                typeof token.accessToken === 'string' ? token.accessToken : '';

            return session;
        },
    },
};
