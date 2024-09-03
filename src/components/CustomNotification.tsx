// CustomNotification.tsx
import React, { useEffect } from 'react';

interface CustomNotificationProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const CustomNotification: React.FC<CustomNotificationProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); 

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed top-4 right-4 z-50 p-4 rounded shadow-lg text-white ${
                type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
        >
            {message}
        </div>
    );
};

export default CustomNotification;
