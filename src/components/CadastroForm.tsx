'use client';
import React, { useState, SyntheticEvent, useRef, useEffect } from 'react';

import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

interface ErrorMessages {
    name: string;
    email: string;
    password: string;
    repeatPassword: string;
}

const CadastroForm = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatPassword, setRepeatPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [isGoogleSignInDisabled, setIsGoogleSignInDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState<ErrorMessages>({
        name: '',
        email: '',
        password: '',
        repeatPassword: '',
    });

    const router = useRouter();
    const { data: session, update } = useSession();
    const [isButtonInDisabled, setIsButtonInDisabled] = useState(false);

    const togglePasswordVisibility = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowPassword(!showPassword);
    };
    const handleGoogleSignInClick = async () => {
        setIsGoogleSignInDisabled(true);

        await signIn('google');

        setIsGoogleSignInDisabled(false);
    };

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
                    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()])[A-Za-z\d@$!%*?&()]{8,}$/.test(
                        value
                    )
                ) {
                    errorMessage =
                        'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.';
                }
            }

            if (field === 'repeatPassword' && value !== password) {
                errorMessage = 'As senhas não coincidem.';
            }

            return {
                ...prev,
                [field]: errorMessage,
            };
        });
    };

    function getMessageForField(field: keyof ErrorMessages): string {
        switch (field) {
            case 'name':
                return 'Esqueceu de colocar o seu nome. :(';
            case 'email':
                return 'Vamos precisar do seu email. :(';
            case 'password':
                return 'Senha é obrigatória.';
            case 'repeatPassword':
                return 'Você precisa repetir a senha.';
            default:
                return '';
        }
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        setIsButtonInDisabled(true);
        e.preventDefault();

        if (password !== repeatPassword) {
            setErrorMessage((prev) => ({
                ...prev,
                repeatPassword:
                    'As senhas não coincidem. Por favor, tente novamente.',
            }));
            return;
        }

        console.log('result', name, email, password);

        const result = await signIn('credentials', {
            name,
            email,
            password,
            redirect: false,
        });
        console.log('result', result);

        if (result?.error) {
            return;
        }

        await update();
        router.replace('/');
    };

    return (
        <div className="flex items-center justify-center min-h-max py-8">
            <div className="bg-primaryLight  rounded-lg shadow-lg z-10 relative overflow-hidden w-full max-w-md lg:max-w-lg">
                <div className="relative z-10 bg-primary p-16 border-2 border-y-primaryDark rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-secondary mb-4">
                        Cadastro
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col  ">
                        <label
                            htmlFor="name"
                            className="text-white-important text-xs"
                        >
                            Nome
                        </label>
                        <input
                            id="name"
                            autoComplete="name"
                            type="text"
                            name="name"
                            required
                            placeholder="nome"
                            value={name}
                            onBlur={() => handleBlur('name', name)}
                            onChange={(e) => setName(e.target.value)}
                            className="text-xs px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-full mb-4 focus:border-primaryDark focus:ring-4 focus:ring-secondary focus:ring-opacity-50 focus:outline-none caret-secondary required  placeholder-primary  "
                        />
                        {errorMessage.name && (
                            <p className="text-redAtention text-xs italic">
                                {errorMessage.name}
                            </p>
                        )}

                        <label
                            htmlFor="email"
                            className="text-white-important text-xs"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            name="email"
                            required
                            placeholder="email"
                            onBlur={() => handleBlur('email', email)}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            className="text-xs px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-full mb-4 focus:border-primaryDark focus:ring-2 focus:ring-secondary focus:ring-opacity-50 focus:outline-none caret-secondary invalid:border-red-400 placeholder-primary"
                        />
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
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                required
                                autoComplete="password"
                                placeholder="Senha"
                                onBlur={() => handleBlur('password', password)}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="text-xs px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-full pr-10 focus:border-primaryDark focus:ring-2 focus:ring-secondary focus:ring-opacity-50 focus:outline-none caret-secondary placeholder-primary"
                            />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                {showPassword ? (
                                    <FiEyeOff
                                        onClick={togglePasswordVisibility}
                                        className="cursor-pointer text-gray-500"
                                    />
                                ) : (
                                    <FiEye
                                        onClick={togglePasswordVisibility}
                                        className="cursor-pointer text-gray-500"
                                    />
                                )}
                            </span>
                            {errorMessage.password && (
                                <p className="text-redAtention  text-xs italic">
                                    {errorMessage.password}
                                </p>
                            )}
                        </div>

                        <label
                            htmlFor="email"
                            className="text-white-important text-xs mt-4"
                        >
                            Repetir a senha
                        </label>
                        <div className="relative w-full ">
                            <input
                                id="repeatPassword"
                                type={showPassword ? 'text' : 'password'}
                                name="repeatPassword"
                                value={repeatPassword}
                                onChange={(e) =>
                                    setRepeatPassword(e.target.value)
                                }
                                onBlur={() =>
                                    handleBlur('repeatPassword', repeatPassword)
                                }
                                required
                                placeholder="Repetir a senha"
                                className="text-xs px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-full  focus:border-primaryDark focus:ring-2 focus:ring-secondary focus:ring-opacity-50 focus:outline-none caret-secondary placeholder-primary"
                            />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                {showPassword ? (
                                    <FiEyeOff
                                        onClick={togglePasswordVisibility}
                                        className="cursor-pointer text-gray-500 "
                                    />
                                ) : (
                                    <FiEye
                                        onClick={togglePasswordVisibility}
                                        className="cursor-pointer text-gray-500"
                                    />
                                )}
                            </span>
                        </div>
                        {errorMessage.password && (
                            <p className="text-redAtention text-xs italic">
                                {errorMessage.password}
                            </p>
                        )}
                        {errorMessage.repeatPassword && (
                            <p className="text-primaryDark w-full rounded-md text-xs mb-4 bg-primaryLight p-2">
                                {errorMessage.repeatPassword}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isButtonInDisabled}
                            id="submitButton"
                            className="flex items-center justify-center  bg-secondary mb-4 text-white-important px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-full transition duration-300 hover:scale-105 mt-8"
                        >
                            {isButtonInDisabled ? (
                                <svg
                                    className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-3xl"
                                    viewBox="0 0 24 24"
                                ></svg>
                            ) : null}
                            Cadastrar
                        </button>

                        <button
                            type="button"
                            disabled={isGoogleSignInDisabled}
                            className="bg-secondary text-white-important flex items-center justify-center px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-full transition duration-300 hover:scale-105"
                            onClick={handleGoogleSignInClick}
                        >
                            <div>
                                <FcGoogle className="mr-2" size={24} />
                            </div>
                            <span className="mr-2">Login com Google</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CadastroForm;
