import { useContext } from 'react';

import {
  DataLoaderContext,
  DataLoaderContextType,
} from '@/context/DataLoaderContext/DataLoaderContext';

export const useDataLoader = (): DataLoaderContextType => {
  const context = useContext(DataLoaderContext);
  if (!context) {
    throw new Error('useDataLoader must be used within a DataLoaderProvider');
  }
  return context;
};
