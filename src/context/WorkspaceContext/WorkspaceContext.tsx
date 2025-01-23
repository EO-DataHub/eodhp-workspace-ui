import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react';

import { Account, Workspace } from './types';

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

  getAndSetWorkspaces: () => void;

  accounts: Account[];
};

type WorkspaceProviderProps = {
  initialState?: Partial<WorkspaceContextType>;
  children: ReactNode;
};

export const WorkspaceContext = createContext<WorkspaceContextType | null>(null);
WorkspaceContext.displayName = 'WorkspaceContext';

export const WorkspaceProvider = ({ initialState = {}, children }: WorkspaceProviderProps) => {
  const [availableWorkspaces, setAvailableWorkspaces] = useState<Workspace[]>();
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>();
  const [activeApplication, setActiveApplication] = useState<string | undefined>();
  const [selectedItemPath, setSelectedItemPath] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const func = async () => {
      const res = await fetch(`/api/accounts`);
      const accounts: Account[] = await res.json();
      setAccounts(accounts);
    };
    func();
  }, []);

  const getAndSetWorkspaces = async () => {
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

  useEffect(() => {
    getAndSetWorkspaces();
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
        getAndSetWorkspaces,
        accounts,
        ...initialState,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
