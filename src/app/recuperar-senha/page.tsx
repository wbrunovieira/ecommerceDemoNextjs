'use client';
import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import Link from 'next/link';

interface ErrorMessages {
    email: string;
}

const RecuperarSenha: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [isButtonInDisabled, setIsButtonInDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState<ErrorMessages>({
        email: '',
    });
    

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BACKEND;
    const { toast } = useToast();

    const router = useRouter();

    function getMessageForField(field: keyof ErrorMessages): string {
        switch (field) {
            case 'email':
                return 'Por favor, insira seu e-mail para que possamos ajudá-lo a redefinir sua senha.';

            default:
                return '';
        }
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setIsButtonInDisabled(true);

        try {
            const result = await axios.post(
                `${BASE_URL}/accounts/forgot-password/`,
                { email: email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (result.status === 201) {
                toast({
                    title: 'E-mail enviado com sucesso!',
                    description:
                        'Verifique sua caixa de entrada para encontrar o link de redefinição de senha. Estamos aqui para ajudar!',
                });
                router.push('/login');
            }
        } catch (error) {
            toast({
                title: 'Ops, algo deu errado!',
                description:
                    'Não conseguimos enviar o e-mail de redefinição. Por favor, tente novamente mais tarde.',
            });
            setIsButtonInDisabled(false);
        }
    };

    const handleBlur = (field: keyof ErrorMessages, value: string) => {
        setErrorMessage((prev: ErrorMessages) => {
            let errorMessage = value ? '' : getMessageForField(field);

            if (
                field === 'email' &&
                value &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ) {
                errorMessage =
                    'Por favor, insira um e-mail válido para continuar.';
            }

            return {
                ...prev,
                [field]: errorMessage,
            };
        });
    };

    return (
        <div className="flex md:min-h-screen items-center justify-center  bg-linear-gradient  p-4 sm:p-6 lg:p-8">
            <div className="bg-white dark:bg-dark-secondary-gradient p-6 sm:p-8 lg:p-10 border-y-primaryDark rounded-lg shadow-lg z-10 relative overflow-hidden w-full md:w-3/5">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Esqueceu a senha?
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    Sem problemas! Digite seu e-mail abaixo e nós vamos ajudar
                    você a recuperar o acesso.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col space-y-6"
                >
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-primaryDark dark:text-white-important text-xs"
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
                            className="mt-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm bg-white bg-opacity-80 dark:border-gray-700 w-full max-w-full focus:ring-secondary focus:border-secondary dark:bg-gray-700 dark:text-gray-300"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    {errorMessage.email && (
                        <p className="text-redAtention text-xs italic">
                            {errorMessage.email}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isButtonInDisabled}
                        className="w-full flex items-center justify-center bg-secondary text-white-important px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-full max-w-full transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-dark"
                    >
                        {isButtonInDisabled ? (
                            <svg
                                className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-3xl"
                                viewBox="0 0 24 24"
                            ></svg>
                        ) : null}
                        Enviar link de redefinição
                    </button>
                    <div className="flex justify-between items-center mt-4 gap-2">
                        <Link href="/login">
                            <button
                                type="button"
                                className="bg-secondary text-white-important px-4 text-xs py-2 rounded-lg shadow-md hover:bg-secondary-dark w-full max-w-full transition duration-300 hover:scale-105 whitespace-nowrap"
                            >
                                Voltar para o Login
                            </button>
                        </Link>

                        <Link href="/" legacyBehavior>
                            <a className="bg-secondary text-center text-white-important px-4 py-2 text-xs rounded-lg shadow-md hover:bg-secondary-dark w-full max-w-full transition duration-300 hover:scale-105 whitespace-nowrap">
                                Voltar para a Home
                            </a>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default RecuperarSenha;
