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

  isWorkspaceOwner: boolean;
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
  const [isWorkspaceOwner, setIsWorkspaceOwner] = useState<boolean>();

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

  useEffect(() => {
    const checkWorkspaceOwnership = async () => {
      try {
        const res = await fetch(`/api/accounts`);
        if (!res.ok) {
          throw new Error('Error getting accounts');
        }
        const json = await res.json();
        const accounts: Account[] = json.data.accounts;
        // TODO: When we can select the account, we should not iterate through all
        // available accounts, but only the selected one.
        accounts.forEach((account) => {
          if (account.workspaces.length) {
            account.workspaces.map((workspace) => {
              if (activeWorkspace.id === workspace.id) {
                setIsWorkspaceOwner(true);
              }
            });
          }
        });
      } catch (error) {
        console.error('Error fetching accounts');
        //TODO: Testing only, remove in prod
        setIsWorkspaceOwner(true);
      }
    };
    checkWorkspaceOwnership();
  }, [activeWorkspace]);

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
        isWorkspaceOwner,
        ...initialState,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
