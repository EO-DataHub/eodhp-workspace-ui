import { ReactNode, createContext, useState } from 'react';

export type CatalogueContextType = {
  allDatasets: string[];
  setAllDatasets: (value: string[]) => void;

  allNotebooks: string[];
  setAllNotebooks: (value: string[]) => void;

  allWorkflows: string[];
  setAllWorkflows: (value: string[]) => void;
};

type CatalogueProviderProps = {
  initialState?: Partial<CatalogueContextType>;
  children: ReactNode;
};

export const CatalogueContext = createContext<CatalogueContextType | null>(null);
CatalogueContext.displayName = 'CatalogueContext';

export const CatalogueProvider = ({ initialState = {}, children }: CatalogueProviderProps) => {
  const [allDatasets, setAllDatasets] = useState<string[]>([]);
  const [allNotebooks, setAllNotebooks] = useState<string[]>([]);
  const [allWorkflows, setAllWorkflows] = useState<string[]>([]);

  return (
    <CatalogueContext.Provider
      value={{
        allDatasets,
        setAllDatasets,
        allNotebooks,
        setAllNotebooks,
        allWorkflows,
        setAllWorkflows,
        ...initialState,
      }}
    >
      {children}
    </CatalogueContext.Provider>
  );
};
