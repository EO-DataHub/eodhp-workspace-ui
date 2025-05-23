/* eslint-disable no-constant-condition */
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';

import { getMembers } from '@/services/members/members';
import { Member } from '@/services/members/types';

import { accountsPlaceholder, skuPlaceholder, workspacesPlaceholder } from './placeholder';
import { Account, SKU, Workspace } from './types';

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
  skus: SKU[];
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
  const [skus, setSKUs] = useState<SKU[]>([]);

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

  // Attempt to get SKUs from workspace services. Will use placeholder data locally.
  // SKU stands for stock-keeping unit defined https://github.com/EO-DataHub/accounting-service/blob/9583a1217ca6be898b700bd9a9cae59a51fca727/accounting_service/models.py#L64
  useEffect(() => {
    if (!activeWorkspace) return;
    const fetchAllSkus = async () => {
      if (import.meta.env.VITE_WORKSPACE_LOCAL) {
        return skuPlaceholder;
      }

      const all: SKU[] = [];
      let after: string | undefined = undefined;
      const limit = 1000;

      while (true) {
        const params = new URLSearchParams({ limit: String(limit) });
        if (after) params.set('after', after);

        const res = await fetch(
          `/api/workspaces/${activeWorkspace.name}/accounting/usage-data?${params.toString()}`,
        );
        if (!res.ok) {
          throw new Error('Error fetching usage data');
        }
        const batch: SKU[] = await res.json();
        if (batch.length === 0) break;
        all.push(...batch);
        after = batch[batch.length - 1].uuid;
      }

      return all;
    };

    fetchAllSkus()
      .then(setSKUs)
      .catch((err) => {
        console.error(err);
      });
  }, [activeWorkspace]);

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
      if (storedWorkspace) setActiveWorkspace(storedWorkspace);
    }
  };

  useEffect(() => {
    getAndSetWorkspaces();
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
        setWorkspaceOwner(activeWorkspace.account);
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
        skus,
        ...initialState,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
