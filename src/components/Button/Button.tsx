import { ReactNode } from 'react';
import './Button.scss';

type ButtonProps = {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
};

export const Button = ({ onClick, children, className, icon }: ButtonProps) => {
  return (
    <button className={`button ${className}`} onClick={onClick}>
      <span className="button__icon">{icon}</span>
      {children}
    </button>
  );
};
