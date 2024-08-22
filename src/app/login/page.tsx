import React from 'react';

import LoginForm from '../../components/Login';
import Container from '@/components/Container';

const LoginPage = () => {
    return (
        <>
            <div className="bg-linear-gradient w-full max-w-full">
                <Container>
                    <div className=" w-full max-w-full">
                        <LoginForm />
                    </div>
                </Container>
            </div>
        </>
    );
};

export default LoginPage;
