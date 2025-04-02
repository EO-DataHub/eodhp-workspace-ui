import { ReactNode, createContext, useEffect, useState } from 'react';

export type DataLoaderContextType = {
  file: File;
  setFile: (value: File) => void;

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
};

type DataLoaderProviderProps = {
  initialState?: Partial<DataLoaderContextType>;
  children: ReactNode;
};
type State = 'validate' | 'upload' | 'harvest';

export const DataLoaderContext = createContext<DataLoaderContextType | null>(null);
DataLoaderContext.displayName = 'DataLoaderContext';

export const DataLoaderProvider = ({ initialState = {}, children }: DataLoaderProviderProps) => {
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState<string>('');
  const [state, setState] = useState<State>('validate');
  const [message, setMessage] = useState<string>();
  const [running, setRunning] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [fileType, setFileType] = useState<string>('stac');

  useEffect(() => {}, []);

  return (
    <DataLoaderContext.Provider
      value={{
        file,
        setFile,
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
        ...initialState,
      }}
    >
      {children}
    </DataLoaderContext.Provider>
  );
};
