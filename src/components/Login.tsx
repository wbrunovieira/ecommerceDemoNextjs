'use client';

import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface ErrorMessages {
    email: string;
    password: string;
}

const Login = () => {
    const { data: session } = useSession();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isButtonInDisabled, setIsButtonInDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState<ErrorMessages>({
        email: '',
        password: '',
    });
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
        if (session) {
            router.push('/');
        }
    }, [session, router]);

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setIsButtonInDisabled(true);

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setErrorMessage({ email: '', password: 'Credenciais inválidas' });
            setIsButtonInDisabled(false);
            return;
        }

        router.push('/');

        setIsButtonInDisabled(false);
    };

    const handleGoogleSignIn = async () => {
        setIsButtonInDisabled(true);

        const result = await signIn('google', { callbackUrl: '/' });

        if (result?.error) {
            return;
        }

        router.push('/');
        setIsButtonInDisabled(false);
    };

    const togglePasswordVisibility = (e: SyntheticEvent) => {
        setShowPassword((prev) => !prev);
    };

    function getMessageForField(field: keyof ErrorMessages): string {
        switch (field) {
            case 'email':
                return 'Vamos precisar do seu email. :(';
            case 'password':
                return 'Senha é obrigatória.';

            default:
                return '';
        }
    }

    const handleBlur = (field: keyof ErrorMessages, value: string) => {
        setErrorMessage((prev: ErrorMessages) => {
            let errorMessage = value ? '' : getMessageForField(field);

            if (
                field === 'email' &&
                value &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ) {
                errorMessage = 'Por favor, insira um e-mail válido.';
            }

            if (field === 'password') {
                if (!value) {
                    errorMessage = getMessageForField(field);
                } else if (
                    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
                        value
                    )
                ) {
                    errorMessage =
                        'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.';
                }
            }

            return {
                ...prev,
                [field]: errorMessage,
            };
        });
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className="flex items-center justify-center min-h-max py-8">
            <div className="bg-primaryLight   rounded-lg shadow-lg z-10 relative overflow-hidden w-full max-w-md lg:max-w-lg ">
                <div className="relative z-10 bg-primary  px-16 py-8 border-2 border-y-primaryDark rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-secondary mb-4 ">
                        Login
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-col ">
                        <label
                            htmlFor="email"
                            className="text-white-important text-xs mb-"
                        >
                            Email
                            <input
                                type="email"
                                name="email"
                                required
                                autoComplete="email"
                                placeholder="Email"
                                onBlur={() => handleBlur('email', email)}
                                value={email}
                                className="text-xs text-primaryDark px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-full"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        {errorMessage.email && (
                            <p className="text-redAtention text-xs italic">
                                {errorMessage.email}
                            </p>
                        )}

                        <label
                            htmlFor="email"
                            className="text-white-important text-xs"
                        >
                            Senha
                        </label>
                        <div className="relative w-full">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Senha"
                                autoComplete="password"
                                value={password}
                                onBlur={() => handleBlur('password', password)}
                                className="text-xs text-primaryDark  px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-full"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div>
                                <Link
                                    href="/recuperar-senha"
                                    className="text-xs text-blue-500 hover:underline"
                                >
                                    Esqueci a minha senha
                                </Link>
                            </div>

                            <span className="absolute top-1/2 transform -translate-y-1/2 right-px flex items-center justify-center pr-3 ">
                                {showPassword ? (
                                    <FiEyeOff
                                        onClick={togglePasswordVisibility}
                                        className="cursor-pointer mb-6 text-gray-500"
                                    />
                                ) : (
                                    <FiEye
                                        onClick={togglePasswordVisibility}
                                        className="cursor-pointer mb-6 text-gray-500"
                                    />
                                )}
                            </span>
                            {errorMessage.password && (
                                <p className="text-redAtention  text-xs italic">
                                    {errorMessage.password}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-4 mt-8">
                            <button
                                type="submit"
                                disabled={isButtonInDisabled}
                                className="flex items-center justify-center bg-secondary text-white-important px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-full transition duration-300 hover:scale-105"
                            >
                                {isButtonInDisabled ? (
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-3xl"
                                        viewBox="0 0 24 24"
                                    ></svg>
                                ) : null}
                                Acessar
                            </button>

                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={isButtonInDisabled}
                                className="bg-secondary text-white-important flex items-center justify-center px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-full transition duration-300 hover:scale-105"
                            >
                                {isButtonInDisabled ? (
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-3xl"
                                        viewBox="0 0 24 24"
                                    ></svg>
                                ) : (
                                    <FcGoogle className="mr-2" size={24} />
                                )}
                                Login com Google
                            </button>

                            <Link
                                href="/cadastro"
                                className="flex items-center justify-center bg-secondary text-white-important px-2  py-1 rounded-lg shadow-md hover:bg-secondary-dark w-full transition duration-300 hover:scale-105 p-4"
                            >
                                Cadastrar
                            </Link>
                        </div>

                        <Link
                            href="/"
                            className="flex items-center justify-center bg-secondary text-white-important px-4 py-2 rounded-lg shadow-md hover:bg-secondary-darkw-full transition duration-300 hover:scale-105 mt-8"
                        >
                            Voltar
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
