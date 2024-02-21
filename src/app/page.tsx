import Container from '@/components/Container';
import Header from '@/components/Header';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <Container>
        <div>
          <h1>Corpo da Pagina</h1>
        </div>
      </Container>
    </>
  );
};
export default Home;
