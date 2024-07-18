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

    const { toast } = useToast();

    const router = useRouter();

    function getMessageForField(field: keyof ErrorMessages): string {
        switch (field) {
            case 'email':
                return 'Vamos precisar do seu email. :(';

            default:
                return '';
        }
    }

    const handleSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        setIsButtonInDisabled(true);

        const result = await axios.post(
            'http://localhost:3333/accounts/forgot-password/',
            { email: email },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(' result', result);

        if (result.status === 201) {
            toast({
                title: 'Sucesso',
                description:
                    '`Enviamos um emal com um link para redefinicao da senha`!',
            });
            router.push('/login');
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
                errorMessage = 'Por favor, insira um e-mail válido.';
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
                        className="text-primaryDark dark:text-white-important text-xs"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="Email"
                        onBlur={() => handleBlur('email', email)}
                        value={email}
                        className="px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32 "
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errorMessage.email && (
                        <p className="text-redAtention text-xs italic">
                            {errorMessage.email}
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
export default RecuperarSenha;
