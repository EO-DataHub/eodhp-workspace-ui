import { ReactNode, createContext, useEffect, useState } from 'react';

import type { Catalog, Collection } from 'stac-js';

export type DataLoaderContextType = {
  files: FileList;
  setFiles: (value: FileList) => void;

  fileName: string;
  setFileName: (value: string) => void;

  state: State;
  setState: (value: State) => void;

  message: string;
  setMessage: (value: string) => void;

  running: boolean;
  setRunning: (value: boolean) => void;

  validationErrors: string[];
  setValidationErrors: (value: string[]) => void;

  fileType: string;
  setFileType: (value: string) => void;

  selectedCatalog: Catalog;
  setSelectedCatalog: (value: Catalog) => void;

  collections: Collection[];
  setCollections: (value: Collection[]) => void;

  selectedCollection: Collection;
  setSelectedCollection: (value: Collection) => void;
};

type DataLoaderProviderProps = {
  initialState?: Partial<DataLoaderContextType>;
  children: ReactNode;
};
type State = 'validate' | 'upload' | 'harvest' | 'view';

export const DataLoaderContext = createContext<DataLoaderContextType | null>(null);
DataLoaderContext.displayName = 'DataLoaderContext';

export const DataLoaderProvider = ({ initialState = {}, children }: DataLoaderProviderProps) => {
  const [files, setFiles] = useState<FileList>();
  const [fileName, setFileName] = useState<string>('');
  const [state, setState] = useState<State>('validate');
  const [message, setMessage] = useState<string>();
  const [running, setRunning] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [fileType, setFileType] = useState<string>('stac');
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog>();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection>();

  useEffect(() => {}, []);

  return (
    <DataLoaderContext.Provider
      value={{
        files,
        setFiles,
        fileName,
        setFileName,
        state,
        setState,
        message,
        setMessage,
        running,
        setRunning,
        validationErrors,
        setValidationErrors,
        fileType,
        setFileType,
        selectedCatalog,
        setSelectedCatalog,
        collections,
        setCollections,
        selectedCollection,
        setSelectedCollection,
        ...initialState,
      }}
    >
      {children}
    </DataLoaderContext.Provider>
  );
};
