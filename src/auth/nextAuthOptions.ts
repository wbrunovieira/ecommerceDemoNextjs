import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { Profile } from 'next-auth';
import { Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

interface ExtendedProfile extends Profile {
    picture?: string | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;

export const nextAuthOptions: NextAuthOptions = {
    debug: true,
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                name: { label: 'name', type: 'text', optional: true },
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                try {
                    console.log('Tentando logar com:', credentials.email);

                    const responseCheck = await fetch(
                        `${BASE_URL}/accounts/check`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: credentials.email }),
                        }
                    );

                    if (!responseCheck.ok) {
                        console.error('Erro ao verificar usuário');
                        return null;
                    }

                    const data = await responseCheck.json();

                    if (data.found) {
                        console.log('Usuário encontrado, retornando dados...');

                        console.log('credentials.email', credentials.email);
                        console.log(
                            'credentials.password',
                            credentials.password
                        );

                        const responseLogin = await fetch(
                            `${BASE_URL}/sessions`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    email: credentials.email,
                                    password: credentials.password,
                                }),
                            }
                        );

                        console.log('responseLogin', responseLogin);

                        if (!responseLogin.ok) {
                            console.error('Erro ao fazer login');
                            return null;
                        }

                        const loginData = await responseLogin.json();

                        return {
                            id: data.user.id,
                            name: data.user.name,
                            email: data.user.email,
                            role: data.user.role,
                            accessToken: loginData.access_token,
                        };
                    }

                    console.log(
                        'Usuário não encontrado, criando novo usuário...'
                    );

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

                    if (responseCreate.status !== 201) {
                        console.error('Erro ao criar usuário');
                        return null;
                    }

                    const newUser = await responseCreate.json();

                    console.log('Novo usuário criado, retornando dados...');

                    return {
                        id: newUser.user.id,
                        name: newUser.user.name,
                        email: newUser.user.email,
                        role: newUser.user.role,
                        accessToken: credentials.password,
                    };
                } catch (error) {
                    console.error('Erro na autorização:', error);
                    return null;
                }
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
        }: {
            token: JWT;
            user?: User;
            account?: any;
        }): Promise<JWT> {
            console.log('JWT Callback - Start', { token, user, account });

            if (account && user) {
                token.accessToken = account.access_token || user.accessToken;
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.picture = user.picture;
                token.role = user.role || 'user';
            }

            console.log('JWT Callback - Final', token);
            return token;
        },
        async session({
            session,
            token,
        }: {
            session: Session;
            token: JWT;
        }): Promise<Session> {
            console.log('Session Callback - Start', { session, token });

            session.user = {
                id: typeof token.id === 'string' ? token.id : 'default_id',
                name: token.name ?? 'Usuário',
                email: token.email ?? 'email@desconhecido.com',
                picture: token.picture ?? '',
                role: typeof token.role === 'string' ? token.role : 'user',
            };

            session.accessToken =
                typeof token.accessToken === 'string' ? token.accessToken : '';

            console.log('Session Callback - Final', session);
            return session;
        },
    },
};
