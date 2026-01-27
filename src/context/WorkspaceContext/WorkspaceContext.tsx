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

  const getWorkspaceQueryParam = () => {
    if (typeof window === 'undefined') return undefined;
    const params = new URLSearchParams(window.location.search);
    return params.get('workspace') ?? undefined;
  };

  const readStoredWorkspace = () => {
    const storedWorkspaceStr = localStorage.getItem('activeWorkspace');
    if (!storedWorkspaceStr) return undefined;
    try {
      return JSON.parse(storedWorkspaceStr) as Workspace;
    } catch (error) {
      return undefined;
    }
  };

  // activeWorkspace keeps the full workspace object for this UI; selectedWorkspace is the name used to sync with RC UI.
  const persistWorkspace = (workspace: Workspace) => {
    localStorage.setItem('activeWorkspace', JSON.stringify(workspace));
    localStorage.setItem('selectedWorkspace', workspace.name);
  };

  const getAndSetWorkspaces = async () => {
    const storedWorkspace = readStoredWorkspace();
    const storedWorkspaceName = localStorage.getItem('selectedWorkspace');
    const queryWorkspaceName = getWorkspaceQueryParam();

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

      const sortedWorkspaces = workspaces.sort((s1, s2) => {
        if (s1.name < s2.name) return -1;
        if (s1.name > s2.name) return 1;
        return 0;
      });

      setAvailableWorkspaces(sortedWorkspaces);

      const matchByNameOrId = (value?: string | null) => {
        if (!value) return undefined;
        return sortedWorkspaces.find(
          (workspace) => workspace.name === value || workspace.id === value,
        );
      };

      const newWorkspace =
        matchByNameOrId(queryWorkspaceName) ||
        matchByNameOrId(storedWorkspaceName) ||
        sortedWorkspaces.find((workspace) => workspace.id === storedWorkspace?.id) ||
        sortedWorkspaces[0];

      setActiveWorkspace(newWorkspace);
      if (newWorkspace) {
        persistWorkspace(newWorkspace);
      }
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
    persistWorkspace(workspace);
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
