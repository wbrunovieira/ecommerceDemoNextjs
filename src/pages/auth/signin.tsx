import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface User {
  name: string;
  email: string;
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
  user: {
    name: string;
    email: string;
  };
  token: Token;
}

const mapUserToGoogleUser = (user: User): GoogleUser => {
  return {
    name: user.name,
    email: user.email,
    sub: '',
    picture: '',
  };
};

const SignInPage = () => {
  const { data: session, status } = useSession();
  console.log('Status da sessão:', status); // "authenticated", "unauthenticated", "loading"
  console.log('Dados da sessão:', session);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      console.log('Tentando fazer login...');

      await signIn('google', { callbackUrl: 'http://localhost:3000/' });
      console.log('Login feito com sucesso!');
    } catch (error) {
      console.error('Erro ao tentar fazer login:', error);
    }
  };

  const sendGoogleUserData = async (user: User, accessToken: string) => {
    try {
      console.log('user', user);
      console.log('Enviando dados para o servidor: ', JSON.stringify(user));
      console.log('Token de acesso:', accessToken);

      const response = await fetch('http://localhost:3333/accounts/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      console.log('Resposta do servidor:', data);
      if (!response.ok) {
        throw new Error('Falha ao enviar dados ao servidor');
      }
      if (response.ok) {
        console.log(
          'Informações do Google enviadas com sucesso para o servidor.'
        );
      } else {
        console.error(
          'Erro ao enviar informações do Google para o servidor:',
          response.statusText
        );
      }
    } catch (error) {
      console.error(
        'Erro ao enviar informações do Google para o servidor:',
        error
      );
    }
  };

  useEffect(() => {
    console.log('Executando useEffect');
    if (session) {
      console.log('Sessão:', session);
      const googleUser = mapUserToGoogleUser(session.user as User);
      console.log('Usuário do Google:', googleUser);
      const accessToken = session.token.access_token;
      console.log('Token de acesso:', accessToken);
      sendGoogleUserData(googleUser, accessToken);
      console.log('Redirecionando...');

      router.replace('/');
    }
  }, [session, router]);

  if (session) {
    return null;
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <div
        id='g_id_onload'
        data-client_id='437479723854-9dsas2i7couh1d1s838t3rkmi8vh1kin.apps.googleusercontent.com'
        data-context='signin'
        data-ux_mode='popup'
        data-callback='loginFromGoogle'
        data-auto_select='true'
        data-itp_support='true'
      ></div>
      <div
        className='g_id_signin'
        data-type='standard'
        data-shape='pill'
        data-theme='outline'
        data-text='continue_with'
        data-size='large'
        data-logo_alignment='left'
      >
        <button
          onClick={handleSignIn}
          className='px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        >
          Entrar com Google
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
