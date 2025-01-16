import React from 'react';

// 定义按钮的变体类型
type ButtonVariant = 'primary' | 'secondary' | 'danger';

// 定义按钮的尺寸类型
type ButtonSize = 'small' | 'medium' | 'large';

// 定义按钮的属性接口
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    onClick,
    className = '',
    type = 'button',
    ...rest
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants: Record<ButtonVariant, string> = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    const sizes: Record<ButtonSize, string> = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-6 py-3 text-lg',
    };

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer cursor';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;