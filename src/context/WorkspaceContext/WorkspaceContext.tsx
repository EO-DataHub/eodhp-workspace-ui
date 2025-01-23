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
      // const res = await fetch(`/api/accounts`);
      // const accounts: Account[] = await res.json();
      const FAKE_ACCOUNTS = [
        {
          id: '1032c57b-a9c7-42a0-aff7-814d09a75bc6',
          name: 'TestAccount4',
          accountOwner: 'isaacjenkinstpz',
          workspaces: null,
        },
        {
          id: '005ebcb4-f01f-44bc-b211-368a2f316a40',
          name: 'TestAccount5',
          accountOwner: 'isaacjenkinstpz',
          workspaces: null,
        },
        {
          id: '6b6a6a74-9f03-48db-8966-4c01cc2b222a',
          name: 'Personal EODH Account',
          accountOwner: 'isaacjenkinstpz',
          workspaces: [
            {
              id: 'fb265104-0473-44e9-b6ce-e2bf8306dd30',
              name: 'isaacjenkinstpz',
              account: '6b6a6a74-9f03-48db-8966-4c01cc2b222a',
              member_group: 'dev',
              status: 'ready',
              stores: [
                {
                  object: [
                    {
                      store_id: 'e2309bda-ed1f-4599-b7d1-2bab8edf6d3c',
                      name: 'workspaces-eodhp-dev',
                      path: 'isaacjenkinstpz/',
                      env_var: 'S3_BUCKET_WORKSPACE',
                      access_point_arn:
                        'arn:aws:s3:eu-west-2:312280911266:accesspoint/eodhp-dev-y4jfxod4-isaacjenkinstpz-s3',
                    },
                  ],
                  block: [
                    {
                      store_id: '0f99faab-57a0-474b-be79-2672150274d5',
                      name: 'eodhp-dev-y4jFxoD4-isaacjenkinstpz-pv',
                      access_point_id: 'fsap-04dc0a930d943aa34',
                      fs_id: 'fs-045e65dcd4e24f91d',
                    },
                  ],
                },
              ],
              last_updated: '2025-01-22T16:04:45.374314Z',
            },
          ],
        },
      ];
      setAccounts(FAKE_ACCOUNTS);
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
