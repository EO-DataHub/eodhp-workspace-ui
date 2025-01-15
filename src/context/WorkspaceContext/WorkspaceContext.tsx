import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react';

import { Workspace } from './types';

export type WorkspaceContextType = {
  availableWorkspaces: Workspace[];
  setAvailableWorkspaces?: Dispatch<SetStateAction<Workspace[]>>;

  activeWorkspace?: Workspace;
  setActiveWorkspace?: Dispatch<SetStateAction<Workspace>>;

  activeApplication?: string;
  setActiveApplication?: Dispatch<SetStateAction<string>>;

  selectedItemPath?: string[];
  setSelectedItemPath?: Dispatch<SetStateAction<string[]>>;

  selectWorkspace: (workspace: Workspace) => void;
};

type WorkspaceProviderProps = {
  initialState?: Partial<WorkspaceContextType>;
  children: ReactNode;
};

export const WorkspaceContext = createContext<WorkspaceContextType | null>(null);
WorkspaceContext.displayName = 'WorkspaceContext';

export const WorkspaceProvider = ({ initialState = {}, children }: WorkspaceProviderProps) => {
  const [availableWorkspaces, setAvailableWorkspaces] = useState<Workspace[]>(); // eslint-disable-line
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>();
  const [activeApplication, setActiveApplication] = useState<string | undefined>();
  const [selectedItemPath, setSelectedItemPath] = useState<string[]>([]);

  useEffect(() => {
    const getWorkspaces = async () => {
      const storedWorkspaceStr = localStorage.getItem('activeWorkspace');
      let storedWorkspace: Workspace;
      if (storedWorkspaceStr) {
        storedWorkspace = JSON.parse(storedWorkspaceStr);
      }

      try {
        const res = await fetch(`/api/workspaces`);
        if (!res.ok) {
          throw new Error();
        }
        const workspaces = await res.json();
        setAvailableWorkspaces(workspaces);
        setActiveWorkspace(storedWorkspace || workspaces[0]);
      } catch (error) {
        console.error('Error retrieving workspaces');
        if (storedWorkspace) setActiveWorkspace(storedWorkspace);
      }
    };
    getWorkspaces();
  }, []);

  const selectWorkspace = (workspace: Workspace) => {
    window.localStorage.setItem('activeWorkspace', JSON.stringify(workspace));
    setActiveWorkspace(workspace);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        availableWorkspaces,
        activeWorkspace,
        setActiveWorkspace,
        activeApplication,
        setActiveApplication,
        selectedItemPath,
        setSelectedItemPath,
        selectWorkspace,
        ...initialState,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
