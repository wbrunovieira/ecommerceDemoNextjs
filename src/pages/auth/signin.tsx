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
    <div>
      <button onClick={handleSignIn}>Entrar com Google</button>
    </div>
  );
};

export default SignInPage;
