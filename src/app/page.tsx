import Container from '@/components/Container';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { ImagesSlider } from '@/components/ui/images-slider';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <Container>
        <div>
          <ImagesSlider
            className='h-[20rem]'
            images={[
              '/images/foto1.jpg',
              '/images/foto2.jpg',
              '/images/foto3.jpg',
              '/images/foto4.jpg',
            ]}
            autoplay={true}
            direction='up'
          >
            <h1>teste</h1>
          </ImagesSlider>
        </div>
      </Container>
    </>
  );
};
export default Home;
