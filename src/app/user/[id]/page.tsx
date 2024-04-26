// src/app/user/[id]/page.tsx
import { NextPage } from 'next';
import { useRouter } from 'next/navigation'; // Corrigido para usar next/navigation
import { useSession } from 'next-auth/react';
import Container from '@/components/Container';
import Image from 'next/image';

const UserPage: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Carregando...</p>;
  }

  if (!session) {
    router.replace('/auth/signin');
    return null;
  }

  return (
    <Container>
      <h1>Perfil do Usuário</h1>
      <Image
        src='/path/to/image.jpg'
        alt='User Image'
        width={200}
        height={200}
      />
      {/* Outros componentes ou lógica */}
    </Container>
  );
};

export default UserPage;
