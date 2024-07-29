import React, { useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

interface WalletComponentProps {
    preferenceId: string;
}

const WalletComponent: React.FC<WalletComponentProps> = ({ preferenceId }) => {
    useEffect(() => {
        initMercadoPago('YOUR_PUBLIC_KEY', { locale: 'pt-BR' });
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md">
                <Wallet initialization={{ preferenceId }} />
            </div>
        </div>
    );
};

export default WalletComponent;
