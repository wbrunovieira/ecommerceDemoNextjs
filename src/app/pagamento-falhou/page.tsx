'use client';

import WalletComponent from '@/components/WalletComponent';

const PaymentFayout = () => {
    const preferenceId = '<PREFERENCE_ID>';
    return (
        <div className="bg-linear-gradient flex items-center justify-center md:min-h-screen py-8">
            <div className="flex flex-col items-center justify-center z-10 bg-white p-8 border-2 border-y-primaryDark rounded-lg shadow-lg  md:w-auto w-full md-w-3/5">
                <div className="flex flex-col  mb-2 w-full ">
                    <h1 className="text-lg md:text-3xl text-primaryDark font-bold text-center animate-fade-in whitespace-nowrap ">
                        Algo deu errado com o pagamento
                    </h1>
                    <p className="text-sm md:text-lg text-gray-600 text-center text-left">
                        Não se preocupe, estamos aqui para ajudar.
                    </p>
                    <p className="text-sm md:text-lg text-gray-600 text-center mb-4 text-left">
                        Você pode tentar novamente ou escolher outro método de
                        pagamento.
                    </p>
                    <hr className="border-0 h-[2px] bg-gradient-to-r from-primary to-primary-light mt-1 w-full mb-6" />
                    <WalletComponent preferenceId={preferenceId} />
                </div>
            </div>
        </div>
    );
};

export default PaymentFayout;
