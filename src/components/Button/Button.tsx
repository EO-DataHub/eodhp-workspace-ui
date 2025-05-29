import { ReactNode } from 'react';

import { Button as RadixButton, ButtonProps as RadixButtonProps } from '@radix-ui/themes';

type CustomButtonProps = {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
} & RadixButtonProps;

export const Button = ({ icon, children, className = '', ...rest }: CustomButtonProps) => {
  return (
    <RadixButton className={className} {...rest}>
      {icon && <span style={{ marginRight: '0.5rem', display: 'inline-flex' }}>{icon}</span>}
      {children}
    </RadixButton>
  );
};
