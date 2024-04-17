// pages/auth/signin.tsx
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const SignInPage = () => {
  const { data: session } = useSession();
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

  useEffect(() => {
    if (session) {
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
