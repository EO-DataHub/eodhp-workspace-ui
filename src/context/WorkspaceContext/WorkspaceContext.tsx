import { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';

import { AVAILABLE_WORKSPACES } from './placeholders';

export type WorkspaceContextType = {
  availableWorkspaces: string[];
  setAvailableWorkspaces?: Dispatch<SetStateAction<string[]>>;

  activeWorkspace?: string;
  setActiveWorkspace?: Dispatch<SetStateAction<string>>;
};

type WorkspaceProviderProps = {
  initialState?: Partial<WorkspaceContextType>;
  children: ReactNode;
};

export const WorkspaceContext = createContext<WorkspaceContextType | null>(null);
WorkspaceContext.displayName = 'WorkspaceContext';

export const WorkspaceProvider = ({ initialState = {}, children }: WorkspaceProviderProps) => {
  const [availableWorkspaces, setAvailableWorkspaces] = useState<string[]>(AVAILABLE_WORKSPACES); // eslint-disable-line
  const [activeWorkspace, setActiveWorkspace] = useState<string | undefined>(
    AVAILABLE_WORKSPACES[0],
  );

  return (
    <WorkspaceContext.Provider
      value={{
        availableWorkspaces,
        activeWorkspace,
        setActiveWorkspace,
        ...initialState,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
