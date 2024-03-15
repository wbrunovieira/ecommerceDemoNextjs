import React from 'react';
import Login from '../../components/Login';

const Page: React.FC = () => {
  return (
    <div className='fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-80'>
      <Login />
    </div>
  );
};

export default Page;
