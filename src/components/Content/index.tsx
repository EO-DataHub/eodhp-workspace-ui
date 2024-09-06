import { ReactNode } from 'react';
import './styles.scss';

type Content = {
  children: ReactNode;
};

export const Content = ({ children }: Content) => {
  return <div className="workspace__content">{children}</div>;
};
