import React, { ReactNode, createContext, useState } from 'react';

import { toast } from 'react-toastify';

export type PublisherContextType = {
  files: FileList;
  setFiles: (value: FileList) => void;

  fileName: string;
  setFileName: (value: string) => void;

  state: State;
  setState: (value: State) => void;

  setMessage: (value: string) => void;

  running: boolean;
  setRunning: (value: boolean) => void;

  validationErrors: string[];
  setValidationErrors: (value: string[]) => void;
};

type PublisherProviderProps = {
  initialState?: Partial<PublisherContextType>;
  children: ReactNode;
};
type State = 'validate' | 'upload' | 'harvest' | 'view';

export const PublisherContext = createContext<PublisherContextType | null>(null);
PublisherContext.displayName = 'PublisherContext';

export const PublisherProvider = ({ initialState = {}, children }: PublisherProviderProps) => {
  const [files, setFiles] = useState<FileList>();
  const [fileName, setFileName] = useState<string>('');
  const [state, setState] = useState<State>('validate');
  const [running, setRunning] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const setMessage = (message: string) => {
    toast(message);
  };

  return (
    <PublisherContext.Provider
      value={{
        files,
        setFiles,
        fileName,
        setFileName,
        state,
        setState,
        setMessage,
        running,
        setRunning,
        validationErrors,
        setValidationErrors,
        ...initialState,
      }}
    >
      {children}
    </PublisherContext.Provider>
  );
};
