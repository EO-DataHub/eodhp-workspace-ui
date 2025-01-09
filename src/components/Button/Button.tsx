import { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.scss';

type ButtonProps = {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ onClick, children, className, icon, ...rest }: ButtonProps) => {
  return (
    <button className={`button ${className}`} onClick={onClick} {...rest}>
      {icon && <span className="button__icon">{icon}</span>}
      {children}
    </button>
  );
};
