import { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';

export type WorkspaceContextType = {
  workspaceName: string;
  setWorkspaceName: Dispatch<SetStateAction<string>>;
};

type WorkspaceProviderProps = {
  initialState?: Partial<WorkspaceContextType>;
  children: ReactNode;
};

export const WorkspaceContext = createContext<WorkspaceContextType | null>(null);
WorkspaceContext.displayName = 'WorkspaceContext';

export const WorkspaceProvider = ({ initialState = {}, children }: WorkspaceProviderProps) => {
  const [workspaceName, setWorkspaceName] = useState<string>('');

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceName,
        setWorkspaceName,
        ...initialState,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
