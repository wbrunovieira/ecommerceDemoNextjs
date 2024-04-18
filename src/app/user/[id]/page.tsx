// src/pages/user/[id].tsx
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Container from '@/components/Container';
import Image from 'next/image';

const UserPage: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = router.query.id; // Captura o ID do usuário da URL, se necessário

  if (status === 'loading') {
    return <div>Carregando...</div>;
  }

  return (
    <Container>
      <section className='flex mt-2 gap-8'>
        {status === 'authenticated' && session?.user ? (
          <div className='flex flex-col w-1/4'>
            <h2 className='text-2xl font-bold'>Olá, {session.user.name}!</h2>
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || 'Usuário'}
                width={200}
                height={200}
              />
            )}
            <p className='text-lg'>Seus dados:</p>
            <p>ID: {session.user.id}</p>
            <p>Nome: {session.user.name}</p>
            <p>Email: {session.user.email}</p>
          </div>
        ) : (
          <div className='flex flex-col w-1/4'>
            <h2 className='text-2xl font-bold'>Olá, visitante!</h2>
            <p className='text-lg'>Faça login para ver seus dados.</p>
          </div>
        )}
        {/* Aqui podem ser adicionados componentes adicionais conforme necessário */}
      </section>
    </Container>
  );
};

export default UserPage;
