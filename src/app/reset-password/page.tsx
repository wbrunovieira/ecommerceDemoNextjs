'use client';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';
interface ErrorMessages {
    password: string;
    repeatPassword: string;
}

const ResetPassword = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [isButtonInDisabled, setIsButtonInDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState<ErrorMessages>({
        password: '',
        repeatPassword: '',
    });

    const { toast } = useToast();

    console.log('token', token);

    const router = useRouter();

    function getMessageForField(field: keyof ErrorMessages): string {
        switch (field) {
            case 'password':
                return 'Vamos precisar do seu password. :(';

            default:
                return '';
        }
    }

    const togglePasswordVisibility = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: SyntheticEvent) => {
        setIsButtonInDisabled(true);
        e.preventDefault();

        const result = await axios.post(
            'http://localhost:3333/accounts/forgot-password/',

            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    };

    const handleBlur = (field: keyof ErrorMessages, value: string) => {
        setErrorMessage((prev: ErrorMessages) => {
            let errorMessage = value ? '' : getMessageForField(field);

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

    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute bg-primaryLight dark:bg-dark-secondary-gradient p-96 rounded-lg shadow-lg z-10 relative overflow-hidden lg:p-96 md:p-48 sm:w-full">
                <div>Esqueceu a senha?</div>
                <div>Digite o e-mail cadastrado</div>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col space-y-4"
                >
                    <label
                        htmlFor="email"
                        className="text-white-important text-xs"
                    >
                        Senha
                    </label>
                    <div className="relative w-96 md:w-72 sm:w-32">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Senha"
                            autoComplete="password"
                            value={password}
                            onBlur={() => handleBlur('password', password)}
                            className="px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32"
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
                        className="text-white-important text-xs"
                    >
                        Senha
                    </label>
                    <div className="relative w-96 md:w-72 sm:w-32">
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
                            className="px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-full pr-10 focus:border-primaryDark focus:ring-2 focus:ring-secondary focus:ring-opacity-50 focus:outline-none caret-secondary placeholder-primary"
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
                        className="text-white-important text-xs"
                    >
                        Repetir a senha
                    </label>
                    <div className="relative w-96 md:w-72 sm:w-32">
                        <input
                            id="repeatPassword"
                            type={showPassword ? 'text' : 'password'}
                            name="repeatPassword"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            onBlur={() =>
                                handleBlur('repeatPassword', repeatPassword)
                            }
                            required
                            placeholder="Repetir a senha"
                            className="px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32 mb-4 focus:border-primaryDark focus:ring-2 focus:ring-secondary focus:ring-opacity-50 focus:outline-none caret-secondary placeholder-primary"
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
                        <p className="text-primaryDark w-48 rounded-md text-xs mb-4 bg-primaryLight p-2">
                            {errorMessage.repeatPassword}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isButtonInDisabled}
                        className="flex items-center justify-center bg-secondary text-white-important px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-96 md:w-72 sm:w-32 transition duration-300 hover:scale-105"
                    >
                        {isButtonInDisabled ? (
                            <svg
                                className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-3xl"
                                viewBox="0 0 24 24"
                            ></svg>
                        ) : null}
                        Enviar
                    </button>

                    <Link href="/login">
                        <button
                            type="button"
                            className="bg-secondary text-white-important px-2  text-xs py-1 rounded-lg shadow-md hover:bg-secondary-dark w-96 md:w-72 sm:w-32 transition duration-300 hover:scale-105"
                        >
                            Voltar para Login
                        </button>
                    </Link>

                    <Link href="/" legacyBehavior>
                        <a className="bg-secondary text-white-important px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-32 md:w-32 sm:w-32 transition duration-300 hover:scale-105 mt-8">
                            Home
                        </a>
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
