import React from 'react';
interface ProductCart {
    id: string;
    title: string;
    image: string;
    price: number;
}
interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    onClick?: (
        event: React.MouseEvent<HTMLButtonElement>,
        product?: ProductCart
    ) => void;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    onClick,
}) => {
    const baseStyles = 'focus:outline-none transition ease-in-out duration-150';
    const variantStyles = {
        primary: 'bg-prymary hover:bg-secondary text-white rounded-md',
        secondary: 'bg-secondary hover:bg-primary text-white rounded-md',
    };
    const sizeStyles = {
        small: 'text-xs px-3 py-2',
        medium: 'text-md px-4 py-2',
        large: 'text-lg px-5 py-3',
    };

    const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} text-white-important whitespace-nowrap`;

    return (
        <button
            className={classes}
            onClick={(e) => onClick && onClick(e)}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
