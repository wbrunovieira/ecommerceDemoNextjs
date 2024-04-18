import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface User {
  name: string;
  email: string;
  sub: string;
  image: string;
}

interface GoogleUser {
  name: string;
  email: string;
  sub: string;
  picture: string;
}

interface Token {
  access_token: string;
}

interface CustomSession {
  user: User;
  token: Token;
}

const mapUserToGoogleUser = (user: User): GoogleUser => {
  return {
    name: user.name,
    email: user.email,
    sub: user.sub,
    picture: user.image,
  };
};

const SignInPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('useEffect chamado!');
    if (status === 'authenticated') {
      console.log('Usuário autenticado:', session.user);
      console.log('Dados da sessão:', session);

      const googleUser = mapUserToGoogleUser(session.user as User);
      console.log('Usuário do Google:', googleUser);
      const accessToken = session.token.access_token;
      sendGoogleUserData(googleUser, accessToken).then(() => {
        console.log('Redirecionando para a home...so que nao');
        router.replace('/');
      });
    }
  }, [status, session, router]);

  const handleSignIn = async () => {
    console.log('Tentando fazer login...');
    const result = await signIn('google', {
      redirect: false,
      callbackUrl: 'http://localhost:3000/',
    });

    if (result && result.ok) {
      console.log('Login feito com sucesso!');

      if (session) {
        const googleUser = mapUserToGoogleUser(session.user as User);
        const accessToken = session.token.access_token;
        sendGoogleUserData(googleUser, accessToken).then(() => {
          console.log('Redirecionando para a home...');
          router.replace('/');
        });
      } else {
        throw new Error('Sessão não está disponível após o login.');
      }
    } else {
      console.error('Falha ao tentar fazer login');
    }
  };

  const sendGoogleUserData = async (user: GoogleUser, accessToken: string) => {
    console.log('Dados enviados para o servidor:', {
      name: user.name,
      email: user.email,
      googleUserId: user.sub,
      profileImageUrl: user.picture,
    });
    const payload = {
      name: user.name,
      email: user.email,
      googleUserId: user.sub,
      profileImageUrl: user.picture,
    };

    try {
      const response = await fetch('http://localhost:3333/accounts/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(
        'Resposta do servidor:',
        response.status,
        response.statusText,
        response
      );
      const data = await response.json();
      console.log('Resposta do servidor:', data);
      if (!response.ok) {
        throw new Error('Falha ao enviar dados ao servidor');
      }
    } catch (error) {
      console.error(
        'Erro ao enviar informações do Google para o servidor:',
        error
      );
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <button
        onClick={handleSignIn}
        className='px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
      >
        Entrar com Google
      </button>
    </div>
  );
};

export default SignInPage;
