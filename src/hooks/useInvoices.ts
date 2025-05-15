import { useContext } from 'react';

import { InvoicesContext, InvoicesContextType } from '@/context/InvoicesContext/InvoicesContext';

export const useInvoices = (): InvoicesContextType => {
  const context = useContext(InvoicesContext);
  if (!context) {
    throw new Error('useInvoices must be used within a InvoicesProvider');
  }
  return context;
};
