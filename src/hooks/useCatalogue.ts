import { useContext } from 'react';

import {
  CatalogueContext,
  CatalogueContextType,
} from '@/context/CatalogueContext/CatalogueContext';

export const useCatalogue = (): CatalogueContextType => {
  const context = useContext(CatalogueContext);
  if (!context) {
    throw new Error('useCatalogue must be used within a CatalogueProvider');
  }
  return context;
};
