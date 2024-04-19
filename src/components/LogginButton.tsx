'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

const LogginButton = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Carregando...</div>;
  }

  if (session) {
    return (
      <div>
        <Link href={`/user/${session.id}`} passHref>
          <span className='text-secondary transition duration-300 hover:scale-110'>
            Olá, {session.name}
          </span>
        </Link>
        <button onClick={() => signOut()}>Sair</button>
      </div>
    );
  } else {
    return <button onClick={() => signIn()}>Entrar</button>;
  }
};

export default LogginButton;
