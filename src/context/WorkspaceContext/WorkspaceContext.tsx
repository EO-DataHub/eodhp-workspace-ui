import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';

import { toast } from 'react-toastify';

import { getMembers } from '@/services/members/members';
import { Member } from '@/services/members/types';

import { accountsPlaceholder, workspacesPlaceholder } from './placeholder';
import { Account, Workspace } from './types';

export type WorkspaceContextType = {
  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;

  availableWorkspaces: Workspace[];
  setAvailableWorkspaces?: Dispatch<SetStateAction<Workspace[]>>;

  activeWorkspace?: Workspace;
  setActiveWorkspace?: Dispatch<SetStateAction<Workspace>>;

  activeApplication?: string;
  setActiveApplication?: Dispatch<SetStateAction<string>>;

  selectedItemPath?: string[];
  setSelectedItemPath?: Dispatch<SetStateAction<string[]>>;

  selectWorkspace: (workspace: Workspace) => void;

  workspaceOwner: string;
  isWorkspaceOwner: boolean;

  getAndSetMembers: () => void;
  members: Member[];
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
  const [content, setContent] = useState<React.ReactNode>();
  const [availableWorkspaces, setAvailableWorkspaces] = useState<Workspace[]>();
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>();
  const [activeApplication, setActiveApplication] = useState<string | undefined>();
  const [selectedItemPath, setSelectedItemPath] = useState<string[]>([]);
  const [isWorkspaceOwner, setIsWorkspaceOwner] = useState<boolean>();
  const [workspaceOwner, setWorkspaceOwner] = useState<string>();
  const [members, setMembers] = useState<Member[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const setMessage = (message: string) => {
    toast(message);
  };

  useEffect(() => {
    const func = async () => {
      let accounts: Account[];
      if (import.meta.env.VITE_WORKSPACE_LOCAL) {
        accounts = accountsPlaceholder.data.accounts;
      } else {
        const res = await fetch(`/api/accounts`);
        if (!res.ok) {
          throw new Error('Error getting accounts');
        }
        accounts = await res.json();
      }
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
      let workspaces: Workspace[];
      if (import.meta.env.VITE_WORKSPACE_LOCAL) {
        workspaces = workspacesPlaceholder;
      } else {
        const res = await fetch(`/api/workspaces`);
        if (!res.ok) {
          throw new Error();
        }
        workspaces = await res.json();
      }

      setAvailableWorkspaces(workspaces);

      const newWorkspace =
        workspaces.filter((workspace) => {
          return storedWorkspace?.id === workspace.id;
        })[0] || workspaces[0];

      setActiveWorkspace(newWorkspace);
    } catch (error) {
      console.error('Error retrieving workspaces');
      setMessage('Error retrieving workspaces');
      if (storedWorkspace) setActiveWorkspace(storedWorkspace);
    }
  };

  useEffect(() => {
    getAndSetWorkspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const checkWorkspaceOwnership = async () => {
      try {
        let accounts: Account[];
        if (import.meta.env.VITE_WORKSPACE_LOCAL) {
          accounts = accountsPlaceholder.data.accounts;
        } else {
          const res = await fetch(`/api/accounts`);
          if (!res.ok) {
            throw new Error('Error getting accounts');
          }
          accounts = await res.json();
        }

        let _isWorkspaceOwner = false;

        accounts.forEach((account) => {
          if (account.workspaces?.length) {
            account.workspaces.forEach((workspace) => {
              if (activeWorkspace.id === workspace.id) {
                _isWorkspaceOwner = true;
              }
            });
          }
        });

        setIsWorkspaceOwner(_isWorkspaceOwner);
        setWorkspaceOwner(activeWorkspace.owner);
      } catch (error) {
        console.error(error.message);
      }
    };
    if (!activeWorkspace) return;
    checkWorkspaceOwnership();
  }, [activeWorkspace]);

  useEffect(() => {
    const func = async () => {
      await getAndSetMembers();
    };
    func();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWorkspace]);

  const getAndSetMembers = async () => {
    if (!activeWorkspace) return;
    try {
      const _members = await getMembers(activeWorkspace?.name);
      setMembers(_members);
    } catch (error) {
      console.error(error);
      console.error('Error getting workspace members');
      setMessage('Error getting workspace members');
    }
  };

  const selectWorkspace = (workspace: Workspace) => {
    window.localStorage.setItem('activeWorkspace', JSON.stringify(workspace));
    setActiveWorkspace(workspace);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        content,
        setContent,
        availableWorkspaces,
        activeWorkspace,
        setActiveWorkspace,
        activeApplication,
        setActiveApplication,
        selectedItemPath,
        setSelectedItemPath,
        selectWorkspace,
        workspaceOwner,
        isWorkspaceOwner,
        getAndSetMembers,
        members,
        getAndSetWorkspaces,
        accounts,
        ...initialState,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
